'use client'

import { Check, X } from 'lucide-react'
import { BRAND_NAME, COMPARISON_ROWS } from '@/utils/siteData'

export function Comparison() {
  return (
    <section id="comparison" className="border-t border-neutral-100 bg-neutral-50 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E64646]">Why 7H</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Why Choose {BRAND_NAME}?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-neutral-600">
            See the difference true quality, insurance expertise, and local accountability make.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="relative z-10 rounded-2xl border-2 border-[#E64646]/40 bg-white p-5 shadow-xl sm:p-6 lg:scale-[1.02]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E64646] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
              The Trusted Choice
            </span>
            <h3 className="mt-2 text-center text-lg font-bold text-neutral-900">{BRAND_NAME}</h3>
            <ul className="mt-6 space-y-4">
              {COMPARISON_ROWS.map((row) => (
                <li key={row.us} className="flex items-start gap-3 text-sm text-neutral-800">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#E64646]" aria-hidden />
                  <span>{row.us}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-center text-lg font-bold text-neutral-500">Other Contractors</h3>
            <ul className="mt-6 space-y-4">
              {COMPARISON_ROWS.map((row) => (
                <li key={row.them} className="flex items-start gap-3 text-sm text-neutral-500">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-neutral-400" aria-hidden />
                  <span>{row.them}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
