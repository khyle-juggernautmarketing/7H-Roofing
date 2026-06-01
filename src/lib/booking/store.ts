import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export type StoredAppointment = {
  id: string
  startUtc: string
  leadId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  service: string
  createdAt: string
}

type AppointmentFile = {
  appointments: StoredAppointment[]
}

const memoryStore: StoredAppointment[] = []

async function getStorePath(): Promise<string> {
  if (process.env.VERCEL) {
    return '/tmp/7h-appointments.json'
  }
  return process.env.APPOINTMENTS_FILE || path.join(process.cwd(), 'data', 'appointments.json')
}

async function ensureDataDir(filePath: string) {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
}

export async function loadAppointments(): Promise<StoredAppointment[]> {
  const filePath = await getStorePath()
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as AppointmentFile
    return Array.isArray(parsed.appointments) ? parsed.appointments : []
  } catch {
    return [...memoryStore]
  }
}

async function saveAppointments(appointments: StoredAppointment[]): Promise<void> {
  memoryStore.length = 0
  memoryStore.push(...appointments)

  const filePath = await getStorePath()
  try {
    await ensureDataDir(filePath)
    await fs.writeFile(filePath, JSON.stringify({ appointments }, null, 2), 'utf8')
  } catch (err) {
    console.error('Could not persist appointments to disk', err)
  }
}

export async function addAppointment(
  entry: Omit<StoredAppointment, 'id' | 'createdAt'>,
  isStillAvailable: (existing: StoredAppointment[]) => boolean,
): Promise<StoredAppointment | null> {
  const appointments = await loadAppointments()
  if (!isStillAvailable(appointments)) return null
  const record: StoredAppointment = {
    ...entry,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  }
  appointments.push(record)
  await saveAppointments(appointments)
  return record
}

export async function addAppointmentIfAvailable(
  entry: Omit<StoredAppointment, 'id' | 'createdAt'>,
  startUtc: string,
): Promise<StoredAppointment | null> {
  const { isValidBookableStart } = await import('./slots')
  return addAppointment(entry, (existing) => isValidBookableStart(startUtc, existing))
}
