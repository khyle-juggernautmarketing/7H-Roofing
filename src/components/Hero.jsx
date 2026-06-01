'use client'

import { CheckCircle2 } from 'lucide-react'
import { CONTACT_INFO, HERO_IMAGE, VALUE_PROPS } from '@/utils/siteData'
import { GoogleReviewsBadge } from '@/components/GoogleReviewsBadge'
import { LandscapeImage } from '@/components/LandscapeImage'
import { LeadForm } from '@/components/LeadForm'

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-neutral-50 to-white">
      <div className="relative w-full">
        <LandscapeImage
          src={HERO_IMAGE}
          alt="Professional roofing project completed by 7H Roofing and Construction"
          priority
          sizes="100vw"
          aspectClass="aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.35/1]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/25" aria-hidden />
      </div>

      {/* Floating card */}
      <div className="relative z-10 mx-auto max-w-7xl px-3 pb-14 pt-0 sm:px-4 sm:pb-20">
        <div className="-mt-10 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] sm:-mt-16 md:-mt-20">
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12">
            <div className="border-b border-neutral-100 p-5 sm:p-8 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-10 xl:p-12">
              <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[#E64646]/25 bg-[#E64646]/5 px-3 py-1.5 text-[0.65rem] font-semibold uppercase leading-snug tracking-wide text-[#E64646] sm:px-4 sm:text-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#E64646]" aria-hidden />
                Family-Owned Since 2006 — Franklin &amp; Spring Hill
              </p>

              <h1 className="mt-4 text-balance text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-neutral-900 sm:mt-5 sm:text-4xl lg:text-[2.65rem]">
                Protect Your Home with Trusted{' '}
                <span className="text-[#E64646]">Roofing &amp; Construction</span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                Middle Tennessee&apos;s premier certified exterior contractor. Reliable residential roofing,
                emergency storm restorations, and premium craftsmanship designed to protect what matters most.
              </p>

              <div className="mt-6">
                <GoogleReviewsBadge variant="compact" className="max-w-md" />
              </div>

              <ul className="mt-6 space-y-3">
                {VALUE_PROPS.map((prop) => (
                  <li key={prop} className="flex items-start gap-3 text-neutral-800">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#E64646]" aria-hidden />
                    <span className="text-sm font-medium sm:text-base">{prop}</span>
                  </li>
                ))}
              </ul>

              <a
                href={CONTACT_INFO.primaryPhoneHref}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-neutral-900 px-7 text-sm font-bold text-white shadow-lg transition-all hover:bg-neutral-800 hover:shadow-xl"
              >
                Call {CONTACT_INFO.primaryPhone}
              </a>
            </div>

            <div id="contact" className="min-w-0 bg-gradient-to-br from-neutral-50 to-neutral-100/80 p-4 sm:p-8 lg:col-span-5 lg:p-8">
              <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-6">
                <LeadForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
