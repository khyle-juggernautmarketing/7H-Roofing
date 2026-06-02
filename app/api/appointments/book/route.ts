import { NextResponse } from 'next/server'
import { isValidBookableStart } from '@/lib/booking/slots'
import { addAppointmentIfAvailable, loadAppointments } from '@/lib/booking/store'
import { formatCstDisplay, formatCstTime } from '@/lib/booking/cst'
import { markLeadBooked } from '@/lib/booking/pendingLeads'
import { buildLeadWebhookPayload } from '@/lib/leadWebhook'
import { buildCapiUserDataFromLead, sendMetaConversionEvent } from '@/lib/metaCapi'
import { sendWebhook } from '@/lib/webhook/sendWebhook'
import { SITE_URL } from '@/utils/siteData'
import type { PropertyAge, Service, Timeline } from '@/types/lead'
import { PROPERTY_AGES, SERVICES, TIMELINES } from '@/types/lead'

type BookBody = {
  startUtc?: string
  leadId?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  service?: string
  propertyAge?: string
  timeline?: string
  consent?: boolean
  eventId?: string
  fbp?: string
  fbc?: string
}

function isAllowed(value: string, allowed: readonly string[]): boolean {
  return allowed.includes(value)
}

function sanitize(s: unknown, max: number): string {
  if (typeof s !== 'string') return ''
  return s.replace(/[<>"'`]/g, '').trim().slice(0, max)
}

export async function POST(request: Request) {
  let body: BookBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const startUtc = typeof body.startUtc === 'string' ? body.startUtc : ''
  const firstName = sanitize(body.firstName, 60)
  const lastName = sanitize(body.lastName, 60)
  const email = sanitize(body.email, 254)
  const phone = sanitize(body.phone, 32)
  const address = sanitize(body.address, 200)
  const service = sanitize(body.service, 64)
  const propertyAge = sanitize(body.propertyAge, 64)
  const timeline = sanitize(body.timeline, 64)
  const consent = body.consent === true
  const leadId = sanitize(body.leadId, 64) || crypto.randomUUID()
  const eventId =
    typeof body.eventId === 'string' && body.eventId.length <= 64 ? body.eventId.trim() : crypto.randomUUID()
  const fbp = typeof body.fbp === 'string' ? body.fbp.slice(0, 256) : undefined
  const fbc = typeof body.fbc === 'string' ? body.fbc.slice(0, 256) : undefined

  if (!startUtc || !firstName || !lastName || !email || !phone || !address) {
    return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 })
  }

  if (!service || !propertyAge || !timeline || !isAllowed(service, SERVICES) || !isAllowed(propertyAge, PROPERTY_AGES) || !isAllowed(timeline, TIMELINES)) {
    return NextResponse.json({ error: 'Missing or invalid lead form selections.' }, { status: 400 })
  }

  const appointments = await loadAppointments()
  if (!isValidBookableStart(startUtc, appointments)) {
    return NextResponse.json({ error: 'That time is no longer available. Please choose another slot.' }, { status: 409 })
  }

  const start = new Date(startUtc)
  const record = await addAppointmentIfAvailable(
    {
      startUtc,
      leadId,
      firstName,
      lastName,
      email,
      phone,
      address,
      service,
    },
    startUtc,
  )

  if (!record) {
    return NextResponse.json({ error: 'That time is no longer available. Please choose another slot.' }, { status: 409 })
  }

  const appointmentLabel = `${formatCstDisplay(start)} at ${formatCstTime(start)} CST`

  await markLeadBooked(leadId)

  const { type: _omit, ...leadFields } = buildLeadWebhookPayload(
    {
      service: service as Service,
      propertyAge: propertyAge as PropertyAge,
      timeline: timeline as Timeline,
      firstName,
      lastName,
      email,
      phone,
      address,
      consent,
    },
    { leadId, source: '7h-roofing-landing' },
  )

  const webhookResult = await sendWebhook(
    {
      type: 'appointment',
      appointmentId: record.id,
      startUtc,
      appointmentLabel,
      calendarCompleted: true,
      bookingStatus: 'appointment_booked',
      ...leadFields,
    },
    'appointment-booking',
  )

  if (!webhookResult.ok) {
    console.error('Appointment webhook failed:', webhookResult.error)
  }

  const capiResult = await sendMetaConversionEvent({
    eventName: 'Schedule',
    eventId,
    eventSourceUrl: `${SITE_URL}/thank-you`,
    userData: buildCapiUserDataFromLead({ email, phone, firstName, lastName }, request, { fbp, fbc }),
    customData: {
      lead_id: leadId,
      service,
      appointment_id: record.id,
    },
  })
  if (!capiResult.ok) {
    console.error('Meta CAPI Schedule failed:', capiResult.error)
  }

  return NextResponse.json({
    ok: true,
    appointmentId: record.id,
    appointmentLabel,
    date: formatCstDisplay(start),
    time: formatCstTime(start),
    metaEventId: eventId,
  })
}
