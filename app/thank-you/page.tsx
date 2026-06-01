import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Phone } from 'lucide-react'
import { MetaPixel } from '@/components/MetaPixel'
import { BRAND_NAME, CONTACT_INFO, LOGO_IMAGE } from '@/utils/siteData'

type Props = { searchParams: Promise<{ date?: string; time?: string; name?: string }> }

export const metadata = {
  title: `Thank You | ${BRAND_NAME}`,
  robots: { index: false, follow: false },
}

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams
  const date = params.date?.trim() ?? ''
  const time = params.time?.trim() ?? ''
  const name = params.name?.trim() ?? ''

  return (
    <main className="min-h-screen bg-neutral-50">
      <MetaPixel event="Schedule" />
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src={LOGO_IMAGE} alt={BRAND_NAME} width={120} height={48} className="h-10 w-auto object-contain" />
          </Link>
          <a
            href={CONTACT_INFO.primaryPhoneHref}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#E64646] px-4 text-sm font-semibold text-white hover:bg-[#c93a3a]"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {CONTACT_INFO.primaryPhone}
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card-lg">
          <div className="bg-[#E64646] px-6 py-8 text-center text-white sm:px-10">
            <CheckCircle2 className="mx-auto h-14 w-14" strokeWidth={2} aria-hidden />
            <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">You&apos;re All Set!</h1>
            <p className="mt-2 text-white/90">
              {name ? `Thanks, ${name.split(' ')[0]}. ` : ''}
              Your free roof assessment request and appointment are confirmed.
            </p>
          </div>

          <div className="space-y-6 px-6 py-8 sm:px-10">
            {(date || time) && (
              <div className="rounded-xl border border-[#E64646]/20 bg-[#E64646]/5 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E64646]">Your appointment</p>
                {date && <p className="mt-2 text-lg font-bold text-neutral-900">{date}</p>}
                {time && (
                  <p className="mt-1 text-neutral-700">
                    <span className="font-semibold">{time}</span> Central (CST)
                  </p>
                )}
                <p className="mt-3 text-sm text-neutral-600">
                  We&apos;ve blocked a 90-minute window for your visit. Our team will confirm details if needed.
                </p>
              </div>
            )}

            <ul className="space-y-3 text-sm text-neutral-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#E64646]" aria-hidden />
                Please expect a 7H representative reach out in a few minutes from now to confirm details for your scheduled time.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#E64646]" aria-hidden />
                For urgent storm damage, call us anytime at{' '}
                <a href={CONTACT_INFO.primaryPhoneHref} className="font-semibold text-[#E64646] hover:underline">
                  {CONTACT_INFO.primaryPhone}
                </a>
                .
              </li>
            </ul>

            <Link
              href="/"
              className="flex min-h-12 w-full items-center justify-center rounded-lg border-2 border-neutral-900 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
