import { BOOKING_TIMEZONE } from './constants'

type CstParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  weekday: number // 0 Sun … 6 Sat
}

export function getCstParts(date: Date): CstParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BOOKING_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  })

  const parts = formatter.formatToParts(date)
  const map: Record<string, string> = {}
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value
  }

  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    weekday: weekdayMap[map.weekday] ?? 0,
  }
}

export function formatCstDateKey(date: Date): string {
  const p = getCstParts(date)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

export function formatCstDisplay(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: BOOKING_TIMEZONE,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatCstTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: BOOKING_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/** Build UTC Date for a CST wall-clock moment (handles DST via formatter iteration). */
export function cstToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour + 6, minute, 0))
  for (let offsetHours = 4; offsetHours <= 7; offsetHours++) {
    const candidate = new Date(Date.UTC(year, month - 1, day, hour + offsetHours, minute, 0))
    const p = getCstParts(candidate)
    if (p.year === year && p.month === month && p.day === day && p.hour === hour && p.minute === minute) {
      return candidate
    }
  }
  return guess
}

export function addMinutesUtc(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000)
}

export function nowInCst(): CstParts {
  return getCstParts(new Date())
}
