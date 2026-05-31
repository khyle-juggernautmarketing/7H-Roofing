const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g
const HTML_TAG = /<[^>]*>/g

export function sanitizeInput(value, maxLen = 500) {
  return String(value ?? '')
    .replace(CONTROL_CHARS, '')
    .replace(HTML_TAG, '')
    .trim()
    .slice(0, maxLen)
}

export function maskEmail(email) {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***@***'
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}***@${domain}`
}

export function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '***-****'
  return `***-***-${digits.slice(-4)}`
}

export function maskAddress(address) {
  if (!address) return ''
  if (address.length <= 8) return '***'
  return `${address.slice(0, 6)}…`
}

export function maskForLog(data) {
  return {
    service: data.service,
    propertyAge: data.propertyAge,
    timeline: data.timeline,
    firstName: data.firstName ? `${data.firstName[0]}***` : '',
    lastName: data.lastName ? `${data.lastName[0]}***` : '',
    email: maskEmail(data.email || ''),
    phone: maskPhone(data.phone || ''),
    address: maskAddress(data.address || ''),
    consent: data.consent,
  }
}
