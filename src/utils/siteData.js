import {
  Building2,
  Calendar,
  CalendarClock,
  Clock,
  CloudLightning,
  Hammer,
  HelpCircle,
  Home,
  Paintbrush,
  Search,
  Zap,
} from 'lucide-react'

export const BRAND_NAME = '7H Roofing and Construction'
export const SITE_URL = 'https://7hroofing.toprooferusa.com'

/** Google Business Profile — update reviewCount when your listing changes. */
export const GOOGLE_BUSINESS = {
  url: 'https://www.google.com/maps/place/7H+Roofing+and+Construction/@35.230307,-87.1687407,17z/data=!3m1!4b1!4m6!3m5!1s0x8863017d876482bb:0x5b360b7cf5336aa1!8m2!3d35.230307!4d-87.1687407!16s%2Fg%2F11fjtqnpjs?entry=ttu',
  rating: 5.0,
  reviewCount: 100,
  reviewCountLabel: '100+',
  locationLabel: 'Lawrenceburg, TN',
}

export const SHANE_IMAGE = '/shane.jpg'

export const ACCENT = '#E64646'
export const ACCENT_DARK = '#c93a3a'
export const ACCENT_LIGHT = 'rgba(230, 70, 70, 0.12)'

export const LOCATIONS = [
  { name: 'Franklin, TN', featured: true },
  { name: 'Spring Hill, TN', featured: true },
  { name: 'Lawrenceburg, TN', featured: true },
  { name: 'Pulaski, TN', featured: true },
  { name: 'Huntsville, AL', featured: true },
  { name: 'Nashville, TN', featured: false },
  { name: 'Murfreesboro, TN', featured: false },
  { name: 'Columbia, TN', featured: false },
  { name: 'Madison, AL', featured: false },
  { name: 'Decatur, AL', featured: false },
]

export const TESTIMONIALS = [
  {
    name: 'Pamela S.',
    location: 'Franklin, TN',
    quote:
      'After the storm hit Franklin, 7H was at our door within hours. They handled the insurance claim, tarped our roof immediately, and completed the full replacement faster than we expected. Professional from start to finish.',
    rating: 5,
  },
  {
    name: 'Emily R.',
    location: 'Spring Hill, TN',
    quote:
      'We got three quotes for our roof replacement and 7H stood out immediately. Transparent line-item pricing, no surprise fees, and the crew left our property cleaner than they found it. Highly recommend to any Spring Hill homeowner.',
    rating: 5,
  },
  {
    name: 'Nicholas C.',
    location: 'Franklin, TN',
    quote:
      '19 years in business shows. From the free inspection to the final walkthrough, every step was communicated clearly. They worked directly with our adjuster and the rebuild quality is outstanding. True local experts.',
    rating: 5,
  },
]

export const SERVICES = [
  {
    id: 'residential-install',
    title: 'Residential Roof Installation & Replacement',
    description:
      'Expert asphalt shingle and metal roof installations built to withstand Middle Tennessee storms, humidity, and seasonal extremes. Premium GAF materials with comprehensive long-term warranties.',
    cta: 'Get Installation Quote',
    image: '/service-1.jpg',
    alt: 'Residential roof installation and replacement by 7H Roofing',
    reverse: false,
  },
  {
    id: 'storm-damage',
    title: 'Storm Damage Repair & 24/7 Tarping',
    description:
      'Emergency leak mitigation and temporary fixes when you need them most. Our 24/7 response team provides immediate tarping, structural assessment, and full restoration after severe weather.',
    cta: 'Call Emergency Line',
    image: '/service-2.jpg',
    alt: 'Storm damage roof repair and 24/7 emergency tarping',
    reverse: true,
  },
  {
    id: 'custom-design',
    title: 'Custom Roof Design & Remodeling',
    description:
      'Light construction, additions, and custom roof design consultations tailored to your vision. We blend structural integrity with aesthetic excellence for lasting curb appeal and property value.',
    cta: 'Schedule Consultation',
    image: '/service-3.jpg',
    alt: 'Custom roof design and exterior remodeling by 7H Roofing',
    reverse: false,
  },
]

export const CONTACT_INFO = {
  primaryPhone: '(931) 201-2130',
  primaryPhoneHref: 'tel:+19312012130',
  email: '7hroofing@gmail.com',
  offices: [
    {
      id: 'lawrenceburg',
      city: 'Lawrenceburg, Tennessee',
      address: '52 Red Hill Center Rd',
      cityStateZip: 'Lawrenceburg, TN 38464',
      phone: '(931) 201-2130',
      href: 'tel:+19312012130',
      email: '7hroofing@gmail.com',
    },
    {
      id: 'pulaski',
      city: 'Pulaski, Tennessee',
      address: '2058 Bodenham Rd',
      cityStateZip: 'Pulaski, TN 38478',
      phone: '931-309-7409',
      href: 'tel:+19313097409',
      email: '7hroofing@gmail.com',
    },
    {
      id: 'huntsville',
      city: 'Huntsville, Alabama',
      address: '6316 Havenwood Dr SE',
      cityStateZip: 'Huntsville, AL 35802',
      phone: '256-512-7777',
      href: 'tel:+12565127777',
      email: '7hroofing@gmail.com',
    },
  ],
  licenses: {
    tn: 'TN License #9569',
    al: 'AL License #31755',
  },
  hours: '24 Hours | 7 Days a Week Emergency Outpost Services',
  established: 2006,
}

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Why 7H', href: '#comparison' },
  { label: 'Insurance', href: '#insurance' },
  { label: 'Service Areas', href: '#service-areas' },
]

export const FOOTER_LINKS = [
  { label: 'About Us', href: '#comparison' },
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#comparison' },
  { label: 'Insurance Claims', href: '#insurance' },
]

export const VALUE_PROPS = [
  '100% Free Professional Roof Assessments',
  'Comprehensive Long-Term Warranties',
  'Licensed & Fully Insured in TN & AL',
]

export const FORM_SERVICE_OPTIONS = [
  { value: 'roof-replacement', label: 'Roof Replacement', icon: Home },
  { value: 'storm-repair', label: 'Storm Repair / Tarping', icon: CloudLightning },
  { value: 'commercial', label: 'Commercial Solutions', icon: Building2 },
  { value: 'custom-design', label: 'Custom Roof Design', icon: Paintbrush },
  { value: 'remodeling', label: 'Remodeling', icon: Hammer },
]

export const FORM_PROPERTY_AGE_OPTIONS = [
  { value: 'under-10', label: 'Under 10 years', icon: Home },
  { value: '10-15', label: '10 to 15 years', icon: Calendar },
  { value: 'over-15', label: 'More than 15 years', icon: Clock },
  { value: 'not-sure', label: 'Not sure', icon: HelpCircle },
]

export const FORM_TIMELINE_OPTIONS = [
  { value: 'asap', label: 'ASAP / Emergency', icon: Zap },
  { value: '1-2-weeks', label: 'Within 1–2 Weeks', icon: CalendarClock },
  { value: '1-month', label: 'Within 1 Month', icon: Calendar },
  { value: 'researching', label: 'Just Researching', icon: Search },
]

export const COMPARISON_ROWS = [
  { us: 'Complimentary roof inspections & estimates', them: 'Paid inspections & hidden fees' },
  { us: 'Comprehensive insurance claim collaboration', them: 'No adjuster support or documentation' },
  { us: '19+ years protecting Middle Tennessee homes', them: 'Fly-by-night or out-of-area contractors' },
  { us: 'Fixed line-item pricing — no surprise charges', them: 'Vague quotes with add-on costs later' },
  { us: 'Licensed & insured in TN (#9569) & AL (#31755)', them: 'Unlicensed or underinsured crews' },
  { us: '24/7 emergency storm response & tarping', them: '"We\'ll call you back next week"' },
]

export const INSURANCE_STEPS = [
  { title: 'Assess & Document', description: 'Safely inspect structural conditions and document all visible damage with photo evidence.' },
  { title: 'Schedule Inspection', description: 'Book a free, certified 7H evaluation with our licensed roofing professionals.' },
  { title: 'Comprehensive Report', description: 'Receive an itemized structural damage report detailing every repair needed.' },
  { title: 'Insurance Collaboration', description: 'We work directly with your carrier adjusters to streamline your claim process.' },
  { title: 'Precision Rebuild', description: 'Swift repair execution using premium materials and expert installation techniques.' },
]

export const HERO_IMAGE = '/hero-bg.webp'
export const LOGO_IMAGE = '/Logo.png'
export const SHANE_IMAGE_ALT = 'Shane, owner of 7H Roofing and Construction'
