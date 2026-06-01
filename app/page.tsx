import { MetaPixel } from '@/components/MetaPixel'
import { Comparison } from '@/components/Comparison'
import { Footer } from '@/components/Footer'
import { GeoTargeting } from '@/components/GeoTargeting'
import { Hero } from '@/components/Hero'
import { Insurance } from '@/components/Insurance'
import { Navbar } from '@/components/Navbar'
import { Services } from '@/components/Services'
import { Testimonials } from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <MetaPixel event="PageView" />
      <Navbar />
      <main className="min-w-0 overflow-x-hidden">
        <Hero />
        <Comparison />
        <Services />
        <Insurance />
        <Testimonials />
        <GeoTargeting />
      </main>
      <Footer />
    </>
  )
}
