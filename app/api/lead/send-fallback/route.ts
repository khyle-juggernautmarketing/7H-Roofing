import { NextResponse } from 'next/server'
import { trySendFallbackWebhook } from '@/lib/booking/pendingLeads'

export async function POST(request: Request) {
  let body: { leadId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const leadId = typeof body.leadId === 'string' ? body.leadId.trim() : ''
  if (!leadId) {
    return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })
  }

  const outcome = await trySendFallbackWebhook(leadId)

  if (outcome === 'not_found') {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }
  if (outcome === 'failed') {
    return NextResponse.json({ error: 'Could not send to webhook' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, outcome })
}
