'use client'

import { Award, BadgeCheck, Calendar, Shield, Star } from 'lucide-react'
import { TRUST_BADGES } from '@/lib/constants'

const ICONS = [BadgeCheck, Shield, Star, Calendar, Award]

export function TrustBadges() {
  return (
    <section className="border-y border-slate-200/60 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-5 lg:gap-4">
          {TRUST_BADGES.map((badge, i) => {
            const Icon = ICONS[i] ?? BadgeCheck
            return (
              <div
                key={badge.tag}
                className="flex min-w-[200px] shrink-0 flex-col items-center text-center sm:min-w-0"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#48D1CC]">
                  {badge.tag}
                </span>
                <p className="mt-1 text-sm font-semibold text-slate-900">{badge.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{badge.subtitle}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
