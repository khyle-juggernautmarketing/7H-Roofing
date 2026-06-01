import { NextResponse } from 'next/server'
import { savePendingLead } from '@/lib/booking/pendingLeads'
import { isRateLimited, rateLimitKey, validateLeadBody } from '@/lib/leadSecurity'

const MAX_BODY_BYTES = 8_192

export async function POST(request: Request) {
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
    const pending = await savePendingLead(leadId, {
      service,
      propertyAge,
      timeline,
      firstName,
      lastName,
      email,
      phone,
      address,
      consent,
    })

    return NextResponse.json(
      {
        ok: true,
        leadId,
        /** Webhook fires on calendar booking, or after this time if calendar is skipped. */
        sendAfter: pending.sendAfter,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    console.error('Lead API: unexpected error')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
