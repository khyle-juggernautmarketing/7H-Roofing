'use client'

import { CheckCircle2, Star } from 'lucide-react'
import { CONTACT_INFO, HERO_IMAGE, VALUE_PROPS } from '@/utils/siteData'
import { LandscapeImage } from '@/components/LandscapeImage'
import { LeadForm } from '@/components/LeadForm'

export function Hero() {
  return (
    <section className="bg-white">
      {/* Banner image — wide landscape */}
      <div className="relative w-full">
        <LandscapeImage
          src={HERO_IMAGE}
          alt="Aerial view of a home with professional roofing by 7H Roofing and Construction"
          priority
          sizes="100vw"
          aspectClass="aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.4/1]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-white" aria-hidden />
      </div>

      {/* Floating card layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-3 pb-12 pt-0 sm:px-4 sm:pb-20">
        <div className="-mt-12 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card-lg sm:-mt-20 sm:rounded-2xl md:-mt-24">
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12">
            {/* Left content column */}
            <div className="border-b border-neutral-100 p-5 sm:p-8 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-10">
              <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[#E64646]/30 bg-[#E64646]/5 px-3 py-1.5 text-[0.65rem] font-semibold uppercase leading-snug tracking-wide text-[#E64646] sm:px-4 sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-[#E64646]" aria-hidden />
                Family-Owned Since 2006 — Franklin &amp; Spring Hill
              </p>

              <h1 className="mt-4 text-balance text-[1.65rem] font-extrabold leading-tight tracking-tight text-neutral-900 sm:mt-5 sm:text-4xl lg:text-5xl">
                Protect Your Home with Trusted{' '}
                <span className="text-[#E64646]">Roofing &amp; Construction</span> Solutions
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                Middle Tennessee&apos;s premier certified exterior contractor. Reliable residential roofing,
                emergency storm restorations, and premium craftsmanship designed to protect what matters most.
              </p>

              <ul className="mt-6 space-y-2.5">
                {VALUE_PROPS.map((prop) => (
                  <li key={prop} className="flex items-start gap-3 text-neutral-800">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#E64646]" aria-hidden />
                    <span className="text-sm font-medium sm:text-base">{prop}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#E64646] text-[#E64646]" aria-hidden />
                  ))}
                </div>
                <span className="text-sm font-medium text-neutral-600">Trusted by homeowners across Middle TN</span>
              </div>

              <a
                href={CONTACT_INFO.primaryPhoneHref}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-neutral-900 px-6 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
              >
                Call {CONTACT_INFO.primaryPhone}
              </a>
            </div>

            {/* Right form column */}
            <div id="contact" className="min-w-0 bg-neutral-50 p-4 sm:p-8 lg:col-span-5">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
