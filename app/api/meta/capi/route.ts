import { NextResponse } from 'next/server'
import { getClientIp, sendMetaConversionEvent } from '@/lib/metaCapi'
import { SITE_URL } from '@/utils/siteData'

type Body = {
  eventName?: string
  eventId?: string
  fbp?: string
  fbc?: string
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventName = typeof body.eventName === 'string' ? body.eventName.trim() : ''
  const eventId = typeof body.eventId === 'string' ? body.eventId.trim() : ''

  if (!eventName || !eventId) {
    return NextResponse.json({ error: 'Missing eventName or eventId' }, { status: 400 })
  }

  if (eventName !== 'PageView') {
    return NextResponse.json({ error: 'Unsupported event' }, { status: 400 })
  }

  const fbp = typeof body.fbp === 'string' ? body.fbp.slice(0, 256) : undefined
  const fbc = typeof body.fbc === 'string' ? body.fbc.slice(0, 256) : undefined

  const result = await sendMetaConversionEvent({
    eventName: 'PageView',
    eventId,
    eventSourceUrl: SITE_URL,
    userData: {
      clientIpAddress: getClientIp(request),
      clientUserAgent: request.headers.get('user-agent') ?? undefined,
      fbp,
      fbc,
    },
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
