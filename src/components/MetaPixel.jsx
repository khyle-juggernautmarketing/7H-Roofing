import Script from 'next/script'
import { META_PIXEL_ID, META_PIXEL_INIT_SCRIPT } from '@/lib/metaPixel'
import { MetaPixelEvents } from '@/components/MetaPixelEvents'

/** Server-safe: base pixel in head + route-specific events on the client. */
export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel-base" strategy="beforeInteractive">
        {META_PIXEL_INIT_SCRIPT}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <MetaPixelEvents />
    </>
  )
}
