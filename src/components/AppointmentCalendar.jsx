'use client'

import { CalendarDays, Clock, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMetaBrowserCookies } from '@/utils/metaCookies'

export function AppointmentCalendar({ lead }) {
  const router = useRouter()
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [loadingDates, setLoadingDates] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [booking, setBooking] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/appointments/slots')
        const j = await res.json()
        if (!res.ok) throw new Error(j.error || 'Could not load dates')
        if (cancelled) return
        const list = j.dates ?? []
        setDates(list)
        if (list[0]?.key) setSelectedDate(list[0].key)
      } catch (e) {
        if (!cancelled) setErrorMsg(e instanceof Error ? e.message : 'Could not load calendar.')
      } finally {
        if (!cancelled) setLoadingDates(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const loadSlots = useCallback(async (dateKey) => {
    if (!dateKey) return
    setLoadingSlots(true)
    setErrorMsg('')
    setSelectedSlot('')
    try {
      const res = await fetch(`/api/appointments/slots?date=${encodeURIComponent(dateKey)}`)
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Could not load times')
      setSlots(j.slots ?? [])
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Could not load available times.')
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) loadSlots(selectedDate)
  }, [selectedDate, loadSlots])

  const confirmBooking = async () => {
    if (!selectedSlot) {
      setErrorMsg('Please select a time slot.')
      return
    }
    setBooking(true)
    setErrorMsg('')
    try {
      const metaEventId = crypto.randomUUID()
      const { fbp, fbc } = getMetaBrowserCookies()
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUtc: selectedSlot,
          leadId: lead.leadId,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          address: lead.address,
          service: lead.service,
          propertyAge: lead.propertyAge,
          timeline: lead.timeline,
          consent: lead.consent,
          eventId: metaEventId,
          fbp,
          fbc,
        }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Booking failed')
      sessionStorage.setItem('meta_schedule_event_id', j.metaEventId ?? metaEventId)
      const params = new URLSearchParams({
        date: j.date ?? '',
        time: j.time ?? '',
        name: `${lead.firstName} ${lead.lastName}`.trim(),
      })
      router.push(`/thank-you?${params.toString()}`)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Booking failed. Please try another time.')
      if (selectedDate) loadSlots(selectedDate)
    } finally {
      setBooking(false)
    }
  }

  if (loadingDates) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-neutral-600">
        <Loader2 className="h-8 w-8 animate-spin text-[#E64646]" aria-hidden />
        <p className="text-sm font-medium">Loading available appointments…</p>
      </div>
    )
  }

  if (!dates.length) {
    return (
      <div className="min-h-[280px] px-2 text-center">
        <p className="text-sm text-neutral-600">No appointment slots are available in the next 3 business days.</p>
        <p className="mt-2 text-sm text-neutral-500">Please call us and we&apos;ll schedule you directly.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">Schedule Your Visit</h3>
        <p className="mt-1 text-sm text-neutral-500">
          All times are <strong className="font-semibold text-neutral-700">Central (CST)</strong>. Mon–Fri, 8 AM–6 PM.
          Each visit reserves a 90-minute window.
        </p>
      </div>

      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-neutral-600">
          <CalendarDays className="h-4 w-4 text-[#E64646]" aria-hidden />
          Select a date
        </span>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="min-h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base focus:border-[#E64646] focus:outline-none focus:ring-2 focus:ring-[#E64646]/20 sm:text-sm"
        >
          {dates.map((d) => (
            <option key={d.key} value={d.key}>{d.label}</option>
          ))}
        </select>
      </label>

      <div className="mt-5">
        <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-neutral-600">
          <Clock className="h-4 w-4 text-[#E64646]" aria-hidden />
          Select a time (15-min slots)
        </span>
        {loadingSlots ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-neutral-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#E64646]" aria-hidden />
            Loading times…
          </div>
        ) : slots.length === 0 ? (
          <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-600">
            No open times on this date. Please choose another day.
          </p>
        ) : (
          <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
            {slots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => setSelectedSlot(slot.value)}
                className={`min-h-11 rounded-lg border-2 px-2 py-2 text-sm font-semibold transition-all ${
                  selectedSlot === slot.value
                    ? 'border-[#E64646] bg-[#E64646]/10 text-neutral-900 ring-2 ring-[#E64646]/30'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-[#E64646]/50'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {errorMsg && <p className="mt-4 text-sm text-red-600" role="alert">{errorMsg}</p>}

      <button
        type="button"
        onClick={confirmBooking}
        disabled={booking || !selectedSlot || loadingSlots}
        className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#E64646] text-base font-semibold text-white transition-all hover:bg-[#c93a3a] disabled:opacity-70 sm:text-sm"
      >
        {booking ? (
          <><Loader2 className="h-5 w-5 animate-spin" aria-hidden />Confirming…</>
        ) : (
          'Confirm Appointment'
        )}
      </button>
    </div>
  )
}
