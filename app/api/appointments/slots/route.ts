import { NextResponse } from 'next/server'
import { processDuePendingLeads } from '@/lib/booking/pendingLeads'
import { getBookableDateKeys, generateSlotsForDate } from '@/lib/booking/slots'
import { loadAppointments } from '@/lib/booking/store'
import { cstToUtc, formatCstDisplay } from '@/lib/booking/cst'

export async function GET(request: Request) {
  await processDuePendingLeads().catch(() => {})

  const { searchParams } = new URL(request.url)
  const dateKey = searchParams.get('date')

  const appointments = await loadAppointments()
  const dates = getBookableDateKeys().map((key) => {
    const [y, m, d] = key.split('-').map(Number)
    return { key, label: formatCstDisplay(cstToUtc(y, m, d, 12, 0)) }
  })

  if (!dateKey) {
    return NextResponse.json({ dates, timezone: 'America/Chicago (CST/CDT)' })
  }

  if (!getBookableDateKeys().includes(dateKey)) {
    return NextResponse.json({ error: 'Date is not available for booking.' }, { status: 400 })
  }

  const slots = generateSlotsForDate(dateKey, appointments)
  return NextResponse.json({ date: dateKey, slots, timezone: 'America/Chicago (CST/CDT)' })
}
