'use client'

import { Star } from 'lucide-react'
import { TESTIMONIALS } from '@/utils/siteData'

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            What Our Neighbors Say
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-600">
            Real reviews from homeowners across Middle Tennessee and North Alabama.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((review) => (
            <article key={review.name} className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#E64646] text-[#E64646]" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <footer className="mt-4 border-t border-neutral-200 pt-4">
                <cite className="not-italic">
                  <p className="font-semibold text-neutral-900">{review.name}</p>
                  <p className="text-xs text-neutral-500">{review.location}</p>
                </cite>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
