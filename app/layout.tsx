import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { LocalBusinessJsonLd } from '@/components/LocalBusinessJsonLd'
import { SITE_URL } from '@/utils/siteData'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const title = '7H Roofing & Construction | Roofing Contractor in Lawrenceburg, Pulaski & Huntsville'
const description =
  'Licensed TN & AL roofing contractor. Free roof assessments, storm damage repair, 24/7 emergency tarping. Serving Lawrenceburg, Pulaski, Huntsville, Franklin & Spring Hill since 2006.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    'roofing contractor Lawrenceburg TN',
    'roofing Pulaski TN',
    'roofing Huntsville AL',
    'roof repair Spring Hill TN',
    'roof replacement Franklin TN',
    'storm damage roof repair',
    '7H Roofing and Construction',
    'emergency roof tarping',
    'free roof inspection',
  ],
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: '7H Roofing and Construction',
    images: [{ url: '/hero-bg.webp', width: 1200, height: 630, alt: '7H Roofing professional residential roof installation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/hero-bg.webp'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen overflow-x-hidden bg-white font-sans text-neutral-900 antialiased">
        <LocalBusinessJsonLd />
        {children}
      </body>
    </html>
  )
}
