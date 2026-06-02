import { createHash } from 'node:crypto'
import { META_PIXEL_ID } from '@/lib/metaPixel'
import { SITE_URL } from '@/utils/siteData'

const GRAPH_API_VERSION = 'v21.0'

function hashMeta(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `1${digits}`
  return digits
}

export type MetaCapiUserData = {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  clientIpAddress?: string
  clientUserAgent?: string
  fbp?: string
  fbc?: string
}

export type MetaCapiEventParams = {
  eventName: 'PageView' | 'Lead' | 'Schedule' | string
  eventId: string
  eventSourceUrl?: string
  userData?: MetaCapiUserData
  customData?: Record<string, string | number | boolean>
}

export function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim()
  return request.headers.get('x-real-ip') ?? undefined
}

export function buildCapiUserDataFromLead(
  lead: {
    email: string
    phone: string
    firstName: string
    lastName: string
  },
  request?: Request,
  cookies?: { fbp?: string; fbc?: string },
): MetaCapiUserData {
  return {
    email: lead.email,
    phone: lead.phone,
    firstName: lead.firstName,
    lastName: lead.lastName,
    clientIpAddress: request ? getClientIp(request) : undefined,
    clientUserAgent: request?.headers.get('user-agent') ?? undefined,
    fbp: cookies?.fbp,
    fbc: cookies?.fbc,
  }
}

function toGraphUserData(userData?: MetaCapiUserData): Record<string, string> {
  const out: Record<string, string> = {}
  if (!userData) return out

  if (userData.email) out.em = hashMeta(userData.email)
  if (userData.phone) {
    const normalized = normalizePhone(userData.phone)
    if (normalized) out.ph = hashMeta(normalized)
  }
  if (userData.firstName) out.fn = hashMeta(userData.firstName)
  if (userData.lastName) out.ln = hashMeta(userData.lastName)
  if (userData.clientIpAddress) out.client_ip_address = userData.clientIpAddress
  if (userData.clientUserAgent) out.client_user_agent = userData.clientUserAgent
  if (userData.fbp) out.fbp = userData.fbp
  if (userData.fbc) out.fbc = userData.fbc

  return out
}

export async function sendMetaConversionEvent(
  params: MetaCapiEventParams,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim()
  if (!accessToken) {
    console.error('Meta CAPI: META_CAPI_ACCESS_TOKEN is not set')
    return { ok: false, error: 'Meta CAPI not configured' }
  }

  const eventSourceUrl = params.eventSourceUrl ?? SITE_URL

  const payload = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        action_source: 'website',
        event_source_url: eventSourceUrl,
        user_data: toGraphUserData(params.userData),
        custom_data: params.customData,
      },
    ],
    access_token: accessToken,
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      const message =
        typeof body === 'object' && body && 'error' in body
          ? JSON.stringify((body as { error: unknown }).error).slice(0, 200)
          : res.statusText
      console.error('Meta CAPI error', res.status, message)
      return { ok: false, error: message }
    }

    return { ok: true }
  } catch (err) {
    console.error('Meta CAPI request failed', err)
    return { ok: false, error: 'Meta CAPI request failed' }
  }
}
