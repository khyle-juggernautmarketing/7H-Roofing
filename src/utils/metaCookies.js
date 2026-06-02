/** Read Meta browser cookies for Conversions API matching. */
export function getMetaBrowserCookies() {
  if (typeof document === 'undefined') return { fbp: undefined, fbc: undefined }

  const read = (name) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : undefined
  }

  return {
    fbp: read('_fbp'),
    fbc: read('_fbc'),
  }
}
