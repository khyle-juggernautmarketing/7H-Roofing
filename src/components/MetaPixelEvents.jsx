'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { getMetaBrowserCookies } from '@/utils/metaCookies'

function trackBrowser(event, eventId) {
  const fbq = window.fbq
  if (typeof fbq !== 'function') return false
  fbq('track', event, {}, { eventID: eventId })
  return true
}

export function MetaPixelEvents() {
  const pathname = usePathname()
  const lastTracked = useRef('')

  useEffect(() => {
    let event = ''
    if (pathname === '/thank-you') event = 'Schedule'
    else if (pathname === '/') event = 'PageView'

    if (!event) return

    const storageKey = `meta_tracked_${pathname}_${event}`
    if (lastTracked.current === storageKey) return

    const run = async () => {
      if (event === 'Schedule') {
        const eventId = sessionStorage.getItem('meta_schedule_event_id')
        if (!eventId) return
        if (trackBrowser('Schedule', eventId)) {
          lastTracked.current = storageKey
          sessionStorage.removeItem('meta_schedule_event_id')
        }
        return
      }

      if (event === 'PageView') {
        const eventId = crypto.randomUUID()
        const { fbp, fbc } = getMetaBrowserCookies()
        trackBrowser('PageView', eventId)
        lastTracked.current = storageKey
        try {
          await fetch('/api/meta/capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventName: 'PageView', eventId, fbp, fbc }),
            keepalive: true,
          })
        } catch {
          /* CAPI optional for PageView */
        }
      }
    }

    run()
  }, [pathname])

  return null
}
