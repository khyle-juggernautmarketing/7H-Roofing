'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BRAND_NAME, CONTACT_INFO, FOOTER_LINKS, LOGO_IMAGE, SITE_URL } from '@/utils/siteData'

export function Footer() {
  const officeCount = CONTACT_INFO.offices.length
  const officeGridClass =
    officeCount >= 3
      ? 'sm:grid-cols-2 xl:grid-cols-3'
      : officeCount === 2
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-1'

  return (
    <footer className="border-t border-neutral-800 bg-neutral-900 px-4 py-14 text-neutral-400 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Top row: brand + navigation */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="relative mb-4 h-12 w-36 sm:h-14 sm:w-44">
              <Image
                src={LOGO_IMAGE}
                alt={`${BRAND_NAME} logo`}
                fill
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <p className="max-w-md text-sm leading-relaxed">
              Protecting properties across Middle Tennessee and North Alabama since {CONTACT_INFO.established}.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1.5 text-xs font-medium text-neutral-300">
                {CONTACT_INFO.licenses.tn}
              </span>
              <span className="rounded-full border border-neutral-700 bg-neutral-800/60 px-3 py-1.5 text-xs font-medium text-neutral-300">
                {CONTACT_INFO.licenses.al}
              </span>
            </div>
            <p className="mt-4 text-sm text-neutral-500">🕒 {CONTACT_INFO.hours}</p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-1">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <a href={link.href} className="transition-colors hover:text-[#E64646]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 xl:col-span-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white">Get In Touch</h3>
            <div className="rounded-xl border border-neutral-800 bg-neutral-800/40 p-5">
              <p className="text-sm text-neutral-300">Need a free roof assessment or emergency tarping?</p>
              <a
                href={CONTACT_INFO.primaryPhoneHref}
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#E64646] px-4 text-base font-bold text-white transition-colors hover:bg-[#c93a3a] sm:w-auto"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {CONTACT_INFO.primaryPhone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-[#E64646]"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>
        </div>

        {/* Office locations — dynamic grid based on office count */}
        <div className="mt-12 border-t border-neutral-800 pt-10 lg:mt-14">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white">Office Locations</h3>
          <div className={`grid grid-cols-1 gap-4 ${officeGridClass}`}>
            {CONTACT_INFO.offices.map((office) => (
              <article
                key={office.id}
                className="flex h-full flex-col rounded-xl border border-neutral-800 bg-neutral-800/30 p-5 transition-colors hover:border-neutral-700"
              >
                <h4 className="font-semibold text-white">{office.city}</h4>
                <address className="mt-3 flex flex-1 flex-col not-italic text-sm leading-relaxed">
                  <p className="flex items-start gap-2 text-neutral-300">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E64646]" aria-hidden />
                    <span>
                      {office.address}
                      <br />
                      {office.cityStateZip}
                    </span>
                  </p>
                  <p className="mt-3">
                    <a
                      href={office.href}
                      className="inline-flex items-center gap-2 font-medium text-[#E64646] transition-colors hover:text-red-400"
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      {office.phone}
                    </a>
                  </p>
                  <p className="mt-2">
                    <a
                      href={`mailto:${office.email}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-[#E64646]"
                    >
                      <Mail className="h-4 w-4 shrink-0" aria-hidden />
                      {office.email}
                    </a>
                  </p>
                </address>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-neutral-800 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-neutral-600 sm:flex-row">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {BRAND_NAME}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href={SITE_URL} className="hover:text-neutral-300">
              {SITE_URL.replace('https://', '')}
            </Link>
            <Link href="#" className="hover:text-neutral-300">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-neutral-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
