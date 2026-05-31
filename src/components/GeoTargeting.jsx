'use client'

import { MapPin } from 'lucide-react'
import { LOCATIONS } from '@/utils/siteData'

export function GeoTargeting() {
  return (
    <section id="service-areas" className="border-t border-neutral-100 bg-neutral-50 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <MapPin className="mx-auto h-8 w-8 text-[#E64646]" aria-hidden />
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Proudly Serving Middle Tennessee &amp; North Alabama
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-neutral-600">
          Local dispatch teams across Lawrenceburg, Pulaski, Huntsville, Franklin, and Spring Hill.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {LOCATIONS.map((city) => (
            <span
              key={city.name}
              className={`inline-flex cursor-default items-center gap-1.5 rounded-full border py-2 px-4 text-sm transition-all ${
                city.featured
                  ? 'border-[#E64646]/40 bg-[#E64646]/10 font-semibold text-neutral-900'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-[#E64646]/30'
              }`}
            >
              <MapPin className={`h-3.5 w-3.5 ${city.featured ? 'text-[#E64646]' : 'text-neutral-400'}`} aria-hidden />
              {city.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
