'use client'

import { Clock, MapPin, Phone } from 'lucide-react'
import { BOTTOM_CTA_CONTACT } from '@/lib/constants'
import { LeadForm } from '@/components/LeadForm'

const ICON_MAP = {
  phone: Phone,
  map: MapPin,
  clock: Clock,
}

export function BottomCTA() {
  return (
    <section id="contact" className="border-t border-slate-200/60 bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Schedule Your Free Roof Assessment
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Ready to protect your home? Reach out directly or complete the quick form — we&apos;ll respond fast.
          </p>

          <div className="mt-10 space-y-6">
            {BOTTOM_CTA_CONTACT.map((item) => {
              const Icon = ICON_MAP[item.icon]
              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="group flex items-start gap-4 rounded-xl transition-colors hover:text-[#48D1CC]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-colors group-hover:bg-[#48D1CC] group-hover:text-slate-900">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-[#48D1CC]">{item.title}</p>
                    <p className="mt-0.5 text-slate-600">{item.detail}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        <div className="w-full lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-card-lg sm:p-6">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  )
}
