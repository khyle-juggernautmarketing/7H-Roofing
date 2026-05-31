'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BRAND_NAME, CONTACT_INFO, LOGO_IMAGE, NAV_LINKS } from '@/utils/siteData'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-neutral-900 px-3 py-2 text-center text-[0.7rem] font-medium leading-snug text-white sm:px-4 sm:py-2.5 sm:text-sm">
        <span className="inline-block max-w-2xl">
          <span aria-hidden>🚨 </span>
          <span className="sm:hidden">Storm damage? 24/7 line: </span>
          <span className="hidden sm:inline">Storm Damage? Protecting Franklin &amp; Spring Hill Homes Since 2006. 24/7 Emergency Line: </span>
          <a
            href={CONTACT_INFO.primaryPhoneHref}
            className="whitespace-nowrap font-semibold text-[#E64646] underline underline-offset-2 hover:text-red-400"
            aria-label={`Call emergency line ${CONTACT_INFO.primaryPhone}`}
          >
            {CONTACT_INFO.primaryPhone}
          </a>
        </span>
      </div>

      <div
        className={`border-b border-neutral-200 bg-white transition-shadow ${scrolled ? 'shadow-md' : ''}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="#" className="relative h-12 w-36 shrink-0 sm:h-14 sm:w-44" aria-label={`${BRAND_NAME} home`}>
            <Image src={LOGO_IMAGE} alt={`${BRAND_NAME} logo`} fill className="object-contain object-left" priority />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={CONTACT_INFO.primaryPhoneHref}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-900"
              aria-label={`Call ${CONTACT_INFO.primaryPhone}`}
            >
              <Phone className="h-4 w-4 text-[#E64646]" aria-hidden />
              {CONTACT_INFO.primaryPhone}
            </a>
            <Button href="#contact">Free Estimate</Button>
          </div>

          <button
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-neutral-200 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white p-6 shadow-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              aria-label="Mobile navigation"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-bold">{BRAND_NAME}</span>
                <button type="button" onClick={() => setOpen(false)} className="min-h-12 min-w-12" aria-label="Close menu">
                  <X className="mx-auto h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block min-h-12 rounded-lg px-4 py-3 text-lg font-medium hover:bg-neutral-50"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="mt-auto space-y-3 pt-8">
                <a
                  href={CONTACT_INFO.primaryPhoneHref}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-neutral-900 font-semibold"
                >
                  <Phone className="h-5 w-5 text-[#E64646]" /> {CONTACT_INFO.primaryPhone}
                </a>
                <Button href="#contact" className="w-full" onClick={() => setOpen(false)}>
                  Free Estimate
                </Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
