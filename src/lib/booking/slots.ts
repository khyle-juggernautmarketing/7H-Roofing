import {
  BLOCK_DURATION_MINUTES,
  BUSINESS_LAST_START_HOUR,
  BUSINESS_LAST_START_MINUTE,
  BUSINESS_START_HOUR,
  MAX_DAYS_AHEAD,
  SLOT_INTERVAL_MINUTES,
  WEEKDAY_INDICES,
} from './constants'
import type { StoredAppointment } from './store'
import { addMinutesUtc, cstToUtc, formatCstDateKey, getCstParts, nowInCst } from './cst'

export type SlotOption = {
  startUtc: string
  label: string
  value: string
}

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd
}

function isSlotWithinBusinessHours(start: Date): boolean {
  const end = addMinutesUtc(start, BLOCK_DURATION_MINUTES)
  const sp = getCstParts(start)
  const ep = getCstParts(end)

  if (!WEEKDAY_INDICES.includes(sp.weekday)) return false

  const startMins = sp.hour * 60 + sp.minute
  const endMins = ep.hour * 60 + ep.minute
  const openMins = BUSINESS_START_HOUR * 60
  const closeMins = 18 * 60

  return startMins >= openMins && endMins <= closeMins
}

function isSlotBlockedByAppointments(start: Date, appointments: StoredAppointment[]): boolean {
  const end = addMinutesUtc(start, BLOCK_DURATION_MINUTES)
  for (const apt of appointments) {
    const aptStart = new Date(apt.startUtc)
    const aptEnd = addMinutesUtc(aptStart, BLOCK_DURATION_MINUTES)
    if (rangesOverlap(start, end, aptStart, aptEnd)) return true
  }
  return false
}

export function getBookableDateKeys(): string[] {
  const today = nowInCst()
  const keys: string[] = []
  const anchor = cstToUtc(today.year, today.month, today.day, 12, 0)

  for (let d = 0; d <= MAX_DAYS_AHEAD; d++) {
    const probe = new Date(anchor.getTime() + d * 86_400_000)
    const p = getCstParts(probe)
    if (!WEEKDAY_INDICES.includes(p.weekday)) continue
    keys.push(formatCstDateKey(probe))
  }

  return [...new Set(keys)]
}

export function generateSlotsForDate(dateKey: string, appointments: StoredAppointment[]): SlotOption[] {
  const [y, m, d] = dateKey.split('-').map(Number)
  const slots: SlotOption[] = []
  const firstMins = BUSINESS_START_HOUR * 60
  const lastMins = BUSINESS_LAST_START_HOUR * 60 + BUSINESS_LAST_START_MINUTE
  const now = new Date()

  for (let mins = firstMins; mins <= lastMins; mins += SLOT_INTERVAL_MINUTES) {
    const hour = Math.floor(mins / 60)
    const minute = mins % 60
    const start = cstToUtc(y, m, d, hour, minute)

    if (!isSlotWithinBusinessHours(start)) continue
    if (start <= now) continue
    if (isSlotBlockedByAppointments(start, appointments)) continue

    const label = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(start)

    slots.push({
      startUtc: start.toISOString(),
      label,
      value: start.toISOString(),
    })
  }

  return slots
}

export function isValidBookableStart(startUtc: string, appointments: StoredAppointment[]): boolean {
  const start = new Date(startUtc)
  if (Number.isNaN(start.getTime())) return false

  const dateKey = formatCstDateKey(start)
  if (!getBookableDateKeys().includes(dateKey)) return false
  if (!isSlotWithinBusinessHours(start)) return false
  if (isSlotBlockedByAppointments(start, appointments)) return false

  const slots = generateSlotsForDate(dateKey, appointments)
  return slots.some((s) => s.startUtc === start.toISOString())
}
