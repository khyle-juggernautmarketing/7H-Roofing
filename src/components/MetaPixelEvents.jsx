'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function MetaPixelEvents() {
  const pathname = usePathname()
  const lastTracked = useRef('')

  useEffect(() => {
    const fbq = window.fbq
    if (typeof fbq !== 'function') return

    let event = ''
    if (pathname === '/thank-you') event = 'Schedule'
    else if (pathname === '/') event = 'PageView'

    if (!event || lastTracked.current === `${pathname}:${event}`) return

    fbq('track', event)
    lastTracked.current = `${pathname}:${event}`
  }, [pathname])

  return null
}
