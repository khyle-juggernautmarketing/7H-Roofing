'use client'

import { INSURANCE_STEPS } from '@/utils/siteData'

export function Insurance() {
  return (
    <section id="insurance" className="bg-neutral-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-2xl bg-neutral-900 p-8 text-white shadow-xl lg:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Master Your Insurance Claim with Expert Contractors
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-300">
              Navigating storm damage claims doesn&apos;t have to be overwhelming. 7H works directly with your
              insurance carrier to ensure you receive the full coverage you deserve.
            </p>
          </div>

          <div className="mt-12 hidden lg:block">
            <div className="relative flex items-start justify-between">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-neutral-700" aria-hidden />
              {INSURANCE_STEPS.map((step, i) => (
                <div key={step.title} className="relative z-10 flex w-[18%] flex-col items-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E64646] text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-sm font-bold">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6 lg:hidden">
            {INSURANCE_STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E64646] text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
