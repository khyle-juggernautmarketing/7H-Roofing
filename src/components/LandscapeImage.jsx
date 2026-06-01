import Image from 'next/image'

/**
 * Displays wide landscape photos without harsh cropping in short boxes.
 */
export function LandscapeImage({
  src,
  alt,
  priority = false,
  sizes = '100vw',
  className = '',
  aspectClass = 'aspect-[16/9] sm:aspect-[21/9]',
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-neutral-100 ${aspectClass} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-center"
      />
    </div>
  )
}
