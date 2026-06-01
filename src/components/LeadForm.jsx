'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import {
  CONTACT_INFO,
  FORM_PROPERTY_AGE_OPTIONS,
  FORM_SERVICE_OPTIONS,
  FORM_TIMELINE_OPTIONS,
} from '@/utils/siteData'
import { AppointmentCalendar } from '@/components/AppointmentCalendar'
import { initialLeadForm } from '@/types/lead'
import { maskForLog, sanitizeInput } from '@/utils/validation'

const STEPS = [
  { id: 1, title: 'What service do you need?' },
  { id: 2, title: 'How old is your property?' },
  { id: 3, title: 'When do you need your inspection or repair?' },
  { id: 4, title: 'Your contact details' },
]

function StepIndicator({ step }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-0" aria-label={`Step ${step} of ${STEPS.length}`}>
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              step >= s.id
                ? 'bg-[#E64646] text-white ring-2 ring-[#E64646]/30'
                : 'border-2 border-neutral-200 bg-white text-neutral-400'
            }`}
          >
            {step > s.id ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : s.id}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 sm:w-10 ${step > s.id ? 'bg-[#E64646]' : 'bg-neutral-200'}`} aria-hidden />
          )}
        </div>
      ))}
    </div>
  )
}

function IconOption({ opt, selected, onSelect, index }) {
  const Icon = opt.icon
  return (
    <button
      type="button"
      onClick={() => onSelect(opt.value)}
      style={{ animationDelay: `${index * 40}ms` }}
      className={`animate-form-option group flex min-h-[52px] items-center gap-3 rounded-lg border-2 p-3.5 text-left transition-all hover:border-[#E64646] sm:min-h-14 sm:p-4 ${
        selected
          ? 'border-[#E64646] bg-[#E64646]/5 ring-2 ring-[#E64646]/30'
          : 'border-neutral-200 bg-white hover:bg-neutral-50'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
          selected
            ? 'bg-[#E64646] text-white'
            : 'bg-neutral-100 text-neutral-600 group-hover:bg-[#E64646]/10 group-hover:text-[#E64646]'
        }`}
        aria-hidden
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className={`flex-1 text-sm font-medium leading-snug ${selected ? 'text-neutral-900' : 'text-neutral-700'}`}>
        {opt.label}
      </span>
      {selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#E64646]" aria-hidden />}
    </button>
  )
}

function SuccessMarks() {
  return (
    <svg className="h-28 w-28 text-[#E64646]" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="28" fill="rgba(230,70,70,0.12)" />
      <path
        className="animate-check-stroke"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 34l8 8 20-22"
      />
    </svg>
  )
}

const inputClass =
  'min-h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base focus:border-[#E64646] focus:outline-none focus:ring-2 focus:ring-[#E64646]/20 sm:text-sm'

export function LeadForm() {
  const prefersReducedMotion = useReducedMotion()
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialLeadForm)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [bookingLead, setBookingLead] = useState(null)

  const selectService = useCallback((service) => {
    setData((d) => ({ ...d, service }))
    setErrorMsg('')
    setTimeout(() => setStep(2), 180)
  }, [])

  const selectPropertyAge = useCallback((propertyAge) => {
    setData((d) => ({ ...d, propertyAge }))
    setErrorMsg('')
    setTimeout(() => setStep(3), 180)
  }, [])

  const selectTimeline = useCallback((timeline) => {
    setData((d) => ({ ...d, timeline }))
    setErrorMsg('')
    setTimeout(() => setStep(4), 180)
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const firstName = sanitizeInput(data.firstName, 60)
    const lastName = sanitizeInput(data.lastName, 60)
    const email = sanitizeInput(data.email, 254)
    const phone = sanitizeInput(data.phone, 32)
    const address = sanitizeInput(data.address, 200)

    if (!data.service || !data.propertyAge || !data.timeline) {
      setErrorMsg('Please complete all steps before submitting.')
      return
    }
    if (!firstName || !lastName || !email || !phone || !address) {
      setErrorMsg('Please fill in all required fields.')
      return
    }
    if (!data.consent) {
      setErrorMsg('Please agree to the contact consent to continue.')
      return
    }
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      setErrorMsg('Please enter a valid phone number.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email.')
      return
    }
    if (address.length < 5) {
      setErrorMsg('Please enter a valid street address.')
      return
    }

    const payload = {
      service: data.service,
      propertyAge: data.propertyAge,
      timeline: data.timeline,
      firstName,
      lastName,
      email,
      phone,
      address,
      consent: data.consent,
      website: honeypot,
    }

    console.log('[7H LeadForm] masked submission', maskForLog(payload))

    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('idle')
        setErrorMsg(typeof j.error === 'string' ? j.error : 'Submission failed. Please call us directly.')
        return
      }
      setBookingLead({
        leadId: typeof j.leadId === 'string' ? j.leadId : crypto.randomUUID(),
        firstName,
        lastName,
        email,
        phone,
        address,
        service: data.service,
      })
      setStatus('booking')
    } catch {
      setStatus('idle')
      setErrorMsg('Network error. Check your connection or call us directly.')
    }
  }

  const motionDur = prefersReducedMotion ? 0 : 0.35

  if (status === 'booking' && bookingLead) {
    return (
      <div className="animate-form-success">
        <div className="mb-4 rounded-lg border border-[#E64646]/20 bg-[#E64646]/5 px-4 py-3 text-center">
          <p className="text-sm font-semibold text-neutral-900">Request received!</p>
          <p className="mt-1 text-xs text-neutral-600">Pick a date and time below to complete your booking.</p>
        </div>
        <AppointmentCalendar lead={bookingLead} />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">Get Your Free Roof Assessment</h3>
        <p className="mt-1 text-sm text-neutral-500">Answer a few quick questions to secure your quote.</p>
      </div>

      <StepIndicator step={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
          transition={{ duration: motionDur, ease: [0.22, 1, 0.36, 1] }}
          className="animate-form-step"
        >
          <p className="mb-4 text-sm font-semibold text-neutral-700">{STEPS[step - 1].title}</p>

          {step === 1 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FORM_SERVICE_OPTIONS.map((opt, i) => (
                <IconOption key={opt.value} opt={opt} selected={data.service === opt.value} onSelect={selectService} index={i} />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FORM_PROPERTY_AGE_OPTIONS.map((opt, i) => (
                <IconOption key={opt.value} opt={opt} selected={data.propertyAge === opt.value} onSelect={selectPropertyAge} index={i} />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FORM_TIMELINE_OPTIONS.map((opt, i) => (
                <IconOption key={opt.value} opt={opt} selected={data.timeline === opt.value} onSelect={selectTimeline} index={i} />
              ))}
            </div>
          )}

          {step === 4 && (
            <form onSubmit={submit} className="space-y-4">
              <label className="sr-only" aria-hidden>
                Website
                <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-neutral-600">First Name</span>
                  <input required autoComplete="given-name" value={data.firstName} onChange={(e) => setData({ ...data, firstName: sanitizeInput(e.target.value, 60) })} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-neutral-600">Last Name</span>
                  <input required autoComplete="family-name" value={data.lastName} onChange={(e) => setData({ ...data, lastName: sanitizeInput(e.target.value, 60) })} className={inputClass} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-neutral-600">Email</span>
                <input type="email" required autoComplete="email" value={data.email} onChange={(e) => setData({ ...data, email: sanitizeInput(e.target.value, 254) })} className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-neutral-600">Phone</span>
                <input type="tel" required autoComplete="tel" value={data.phone} onChange={(e) => setData({ ...data, phone: sanitizeInput(e.target.value, 32) })} className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-neutral-600">Property Address</span>
                <input
                  required
                  autoComplete="street-address"
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: sanitizeInput(e.target.value, 200) })}
                  placeholder="Street address, city, state"
                  className={inputClass}
                />
              </label>
              <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => setData({ ...data, consent: e.target.checked })}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-300 text-[#E64646] focus:ring-[#E64646]"
                />
                <span className="text-xs leading-relaxed text-neutral-600">
                  By submitting, you agree to receive follow-up contact regarding this estimate under CCPA data privacy frameworks.
                </span>
              </label>
              {errorMsg && <p className="text-sm text-red-600" role="alert">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#E64646] text-base font-semibold text-white transition-all hover:bg-[#c93a3a] disabled:opacity-70 sm:text-sm"
              >
                {status === 'loading' ? (
                  <><Loader2 className="h-5 w-5 animate-spin" aria-hidden />Sending...</>
                ) : (
                  'Get My Free Roof Assessment'
                )}
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      {errorMsg && step !== 4 && (
        <p className="mt-3 text-sm text-red-600" role="alert">{errorMsg}</p>
      )}

      {step > 1 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => { setErrorMsg(''); setStep((s) => Math.max(1, s - 1)) }}
            className="flex min-h-12 items-center text-sm font-semibold text-neutral-500 transition-colors hover:text-[#E64646]"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}
