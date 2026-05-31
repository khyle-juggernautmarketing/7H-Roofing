'use client'

import { CheckCircle2 } from 'lucide-react'
import { WHY_7H_PROPS, WHY_7H_STATS } from '@/lib/constants'

export function Why7H() {
  return (
    <section id="why-7h" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Middle Tennessee&apos;s Trusted Roofing Contractor
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Since 2006, 7H Roofing &amp; Construction has been the go-to choice for homeowners and businesses
              across Franklin, Spring Hill, and the greater Middle Tennessee region. We combine local expertise
              with premium materials to deliver results that stand the test of time.
            </p>
            <ul className="mt-8 space-y-3">
              {WHY_7H_PROPS.map((prop) => (
                <li key={prop} className="flex items-start gap-3 text-slate-800">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#48D1CC]" aria-hidden />
                  <span className="font-medium">{prop}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl lg:p-12">
            <span className="inline-flex rounded-full border border-[#48D1CC]/40 bg-[#48D1CC]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#48D1CC]">
              Top Rated
            </span>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-10">
              {WHY_7H_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-extrabold text-white sm:text-5xl">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
