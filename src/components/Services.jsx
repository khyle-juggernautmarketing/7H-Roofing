'use client'

import { ArrowRight } from 'lucide-react'
import { CONTACT_INFO, SERVICES } from '@/utils/siteData'
import { LandscapeImage } from '@/components/LandscapeImage'
import { Button } from '@/components/ui/Button'

export function Services() {
  return (
    <section id="services" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E64646]">Our Services</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Complete Exterior &amp; Roofing Solutions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-neutral-600">
            Weather-proofing engineered for Middle Tennessee&apos;s storms, humidity, and seasonal extremes.
          </p>
        </div>

        <div className="mt-14 space-y-8">
          {SERVICES.map((row) => (
            <article
              key={row.id}
              className="group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all hover:border-[#E64646]/25 hover:shadow-lg"
            >
              <div className={`grid grid-cols-1 md:grid-cols-2 ${row.reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div className={`flex flex-col justify-center p-6 sm:p-8 ${row.reverse ? 'md:order-2' : ''}`}>
                  <h3 className="text-2xl font-bold text-neutral-900">{row.title}</h3>
                  <p className="mt-4 leading-relaxed text-neutral-600">{row.description}</p>
                  <div className="mt-6">
                    <Button
                      href={row.id === 'storm-damage' ? CONTACT_INFO.primaryPhoneHref : '#contact'}
                      variant="primary"
                      className="group/btn inline-flex items-center gap-2"
                    >
                      {row.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" aria-hidden />
                    </Button>
                  </div>
                </div>
                <div className={row.reverse ? 'md:order-1' : ''}>
                  <LandscapeImage
                    src={row.image}
                    alt={row.alt}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    aspectClass="aspect-[16/10] sm:aspect-[16/9] md:aspect-[5/4]"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
