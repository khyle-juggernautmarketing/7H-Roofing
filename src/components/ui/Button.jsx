'use client'

const variants = {
  primary:
    'bg-[#E64646] text-white hover:bg-[#c93a3a] shadow-sm transition-all duration-200',
  outline: 'border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-50 bg-white',
  ghost: 'text-neutral-900 hover:bg-neutral-100',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  href,
  onClick,
  type = 'button',
  disabled,
}) {
  const classes = `inline-flex min-h-12 items-center justify-center rounded-lg px-6 text-sm font-semibold ${variants[variant]} ${className}`

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${classes} ${disabled ? 'opacity-70' : ''}`}>
      {children}
    </button>
  )
}
