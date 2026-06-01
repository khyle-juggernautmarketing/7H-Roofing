import { NextResponse } from 'next/server'
import { processDuePendingLeads } from '@/lib/booking/pendingLeads'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET?.trim()

  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sent = await processDuePendingLeads()
  return NextResponse.json({ ok: true, sent })
}
