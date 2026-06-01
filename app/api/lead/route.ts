import { NextResponse } from 'next/server'
import { isValidJwtSecret, isValidWebhookUrl, signJwtHS256 } from '@/lib/jwt'
import { isRateLimited, rateLimitKey, validateLeadBody } from '@/lib/leadSecurity'
import { buildLeadWebhookPayload } from '@/lib/leadWebhook'

const WEBHOOK_TIMEOUT_MS = 25_000
const MAX_BODY_BYTES = 8_192

function getWebhookConfig() {
  const url = process.env.N8N_WEBHOOK_URL?.trim()
  const jwtSecret = process.env.N8N_JWT_SECRET?.trim()
  if (!url || !jwtSecret) return null
  if (!isValidWebhookUrl(url) || !isValidJwtSecret(jwtSecret)) return null
  return { url, jwtSecret }
}

export async function POST(request: Request) {
  const config = getWebhookConfig()
  if (!config) {
    console.error('Lead API: invalid or missing webhook configuration')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  }

  const limiterKey = rateLimitKey(request)
  if (isRateLimited(limiterKey)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes or call us directly.' },
      { status: 429 },
    )
  }

  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const validated = validateLeadBody(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      service,
      propertyAge,
      timeline,
      consent,
    } = validated.data

    const leadId = crypto.randomUUID()
    const payload = buildLeadWebhookPayload(
      { service, propertyAge, timeline, firstName, lastName, email, phone, address, consent },
      { leadId, source: '7h-roofing-landing' },
    )

    const token = signJwtHS256(config.jwtSecret, { sub: 'lead-form', leadId })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

    let res: Response
    try {
      res = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        cache: 'no-store',
      })
    } catch (e) {
      clearTimeout(timeout)
      const aborted = e instanceof Error && e.name === 'AbortError'
      console.error('Lead API: webhook unreachable', aborted ? 'timeout' : 'network')
      return NextResponse.json(
        { error: aborted ? 'Request timed out. Please try again or call us.' : 'Could not reach booking service. Please try again.' },
        { status: 503 },
      )
    } finally {
      clearTimeout(timeout)
    }

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      console.error('Lead API: webhook rejected request', res.status, errBody.slice(0, 120))
      return NextResponse.json(
        { error: 'Booking service returned an error. Please try again or call us.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true, leadId }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('Lead API: unexpected error')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
