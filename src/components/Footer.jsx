'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BRAND_NAME, CONTACT_INFO, FOOTER_LINKS, LOGO_IMAGE } from '@/utils/siteData'

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900 px-4 py-16 text-neutral-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div>
          <div className="relative mb-4 h-12 w-36 sm:h-14 sm:w-44">
            <Image src={LOGO_IMAGE} alt={`${BRAND_NAME} logo`} fill className="object-contain object-left brightness-0 invert" />
          </div>
          <p className="text-sm leading-relaxed">
            Protecting properties across Middle Tennessee and North Alabama since {CONTACT_INFO.established}.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2">{CONTACT_INFO.licenses.tn}</p>
            <p className="rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2">{CONTACT_INFO.licenses.al}</p>
            <p className="pt-2 text-neutral-500">🕒 {CONTACT_INFO.hours}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href + link.label}>
                <a href={link.href} className="transition-colors hover:text-[#E64646]">{link.label}</a>
              </li>
            ))}
          </ul>
          <a
            href={CONTACT_INFO.primaryPhoneHref}
            className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-[#E64646] px-4 py-3 text-base font-bold text-white hover:bg-[#c93a3a]"
          >
            {CONTACT_INFO.primaryPhone}
          </a>
        </div>

        {CONTACT_INFO.offices.map((office) => (
          <div key={office.id}>
            <h3 className="mb-3 font-semibold text-white">{office.city}</h3>
            <address className="not-italic text-sm leading-relaxed">
              <p>{office.address}</p>
              <p className="text-neutral-400">{office.cityStateZip}</p>
              <p className="mt-2">
                <a href={office.href} className="font-medium text-[#E64646] hover:underline">
                  Call: {office.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${office.email}`} className="hover:text-[#E64646]">
                  Email: {office.email}
                </a>
              </p>
            </address>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-neutral-800 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-neutral-600 sm:flex-row">
          <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> {BRAND_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-neutral-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-neutral-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
