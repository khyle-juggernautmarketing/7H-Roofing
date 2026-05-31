import { CONTACT_INFO, LOCATIONS, SERVICES } from '@/utils/siteData'

export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: '7H Roofing and Construction',
    url: 'https://7hroofing.com',
    logo: 'https://7hroofing.com/Logo.png',
    image: 'https://7hroofing.com/hero-bg.webp',
    telephone: CONTACT_INFO.primaryPhone,
    email: CONTACT_INFO.email,
    foundingDate: '2006',
    priceRange: '$$',
    areaServed: LOCATIONS.filter((l) => l.featured).map((l) => l.name),
    address: CONTACT_INFO.offices.map((office) => ({
      '@type': 'PostalAddress',
      streetAddress: office.address,
      addressLocality: office.cityStateZip.split(',')[0]?.trim(),
      addressRegion: office.cityStateZip.match(/,\s*([A-Z]{2})/)?.[1] ?? '',
      postalCode: office.cityStateZip.match(/\d{5}/)?.[0] ?? '',
      addressCountry: 'US',
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roofing & Construction Services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.description },
      })),
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
