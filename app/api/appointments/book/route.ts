import { NextResponse } from 'next/server'
import { isValidBookableStart } from '@/lib/booking/slots'
import { addAppointmentIfAvailable, loadAppointments } from '@/lib/booking/store'
import { formatCstDisplay, formatCstTime } from '@/lib/booking/cst'
import { isValidJwtSecret, isValidWebhookUrl, signJwtHS256 } from '@/lib/jwt'

type BookBody = {
  startUtc?: string
  leadId?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  service?: string
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
  const leadId = sanitize(body.leadId, 64) || crypto.randomUUID()

  if (!startUtc || !firstName || !lastName || !email || !phone || !address) {
    return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 })
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

  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim()
  const jwtSecret = process.env.N8N_JWT_SECRET?.trim()
  if (webhookUrl && jwtSecret && isValidWebhookUrl(webhookUrl) && isValidJwtSecret(jwtSecret)) {
    try {
      const token = signJwtHS256(jwtSecret, { sub: 'appointment-booking', appointmentId: record.id })
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'appointment',
          appointmentId: record.id,
          startUtc,
          appointmentLabel,
          leadId,
          firstName,
          lastName,
          email,
          phone,
          address,
          service,
        }),
      })
    } catch (err) {
      console.error('Appointment webhook failed', err)
    }
  }

  return NextResponse.json({
    ok: true,
    appointmentId: record.id,
    appointmentLabel,
    date: formatCstDisplay(start),
    time: formatCstTime(start),
  })
}
