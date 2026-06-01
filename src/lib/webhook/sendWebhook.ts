import { isValidJwtSecret, isValidWebhookUrl, signJwtHS256 } from '@/lib/jwt'

const WEBHOOK_TIMEOUT_MS = 25_000

export function getWebhookConfig() {
  const url = process.env.N8N_WEBHOOK_URL?.trim()
  const jwtSecret = process.env.N8N_JWT_SECRET?.trim()
  if (!url || !jwtSecret) return null
  if (!isValidWebhookUrl(url) || !isValidJwtSecret(jwtSecret)) return null
  return { url, jwtSecret }
}

export async function sendWebhook(
  payload: Record<string, unknown>,
  jwtSub: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = getWebhookConfig()
  if (!config) {
    console.error('Webhook: invalid or missing configuration')
    return { ok: false, error: 'Webhook not configured' }
  }

  const token = signJwtHS256(config.jwtSecret, { sub: jwtSub, leadId: payload.leadId as string | undefined })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    const res = await fetch(config.url, {
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

    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      console.error('Webhook rejected', res.status, errBody.slice(0, 120))
      return { ok: false, error: 'Webhook returned an error' }
    }

    return { ok: true }
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError'
    console.error('Webhook unreachable', aborted ? 'timeout' : 'network')
    return { ok: false, error: aborted ? 'Webhook timeout' : 'Webhook unreachable' }
  } finally {
    clearTimeout(timeout)
  }
}
