import { promises as fs } from 'fs'
import path from 'path'
import type { LeadFormData } from '@/types/lead'
import { buildLeadWebhookPayload } from '@/lib/leadWebhook'
import { sendWebhook } from '@/lib/webhook/sendWebhook'

export const PENDING_LEAD_DELAY_MS = 10 * 60 * 1000

export type PendingLeadStatus = 'pending' | 'booked' | 'sent_fallback'

export type PendingLeadRecord = {
  leadId: string
  status: PendingLeadStatus
  createdAt: string
  sendAfter: string
  data: Pick<
    LeadFormData,
    'service' | 'propertyAge' | 'timeline' | 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'consent'
  >
}

type PendingLeadsFile = { leads: PendingLeadRecord[] }

const memoryLeads: PendingLeadRecord[] = []

async function getStorePath(): Promise<string> {
  if (process.env.VERCEL) return '/tmp/7h-pending-leads.json'
  return process.env.PENDING_LEADS_FILE || path.join(process.cwd(), 'data', 'pending-leads.json')
}

async function loadAll(): Promise<PendingLeadRecord[]> {
  const filePath = await getStorePath()
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as PendingLeadsFile
    return Array.isArray(parsed.leads) ? parsed.leads : []
  } catch {
    return [...memoryLeads]
  }
}

async function saveAll(leads: PendingLeadRecord[]): Promise<void> {
  memoryLeads.length = 0
  memoryLeads.push(...leads)
  const filePath = await getStorePath()
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, JSON.stringify({ leads }, null, 2), 'utf8')
  } catch (err) {
    console.error('Could not persist pending leads', err)
  }
}

export async function savePendingLead(
  leadId: string,
  data: PendingLeadRecord['data'],
): Promise<PendingLeadRecord> {
  const leads = await loadAll()
  const now = Date.now()
  const record: PendingLeadRecord = {
    leadId,
    status: 'pending',
    createdAt: new Date(now).toISOString(),
    sendAfter: new Date(now + PENDING_LEAD_DELAY_MS).toISOString(),
    data,
  }
  const filtered = leads.filter((l) => l.leadId !== leadId)
  filtered.push(record)
  await saveAll(filtered)
  return record
}

export async function getPendingLead(leadId: string): Promise<PendingLeadRecord | null> {
  const leads = await loadAll()
  return leads.find((l) => l.leadId === leadId) ?? null
}

export async function markLeadBooked(leadId: string): Promise<boolean> {
  const leads = await loadAll()
  const lead = leads.find((l) => l.leadId === leadId)
  if (!lead) return false
  if (lead.status !== 'pending') return lead.status === 'booked'
  lead.status = 'booked'
  await saveAll(leads)
  return true
}

async function markLeadSentFallback(leadId: string): Promise<boolean> {
  const leads = await loadAll()
  const lead = leads.find((l) => l.leadId === leadId)
  if (!lead) return false
  lead.status = 'sent_fallback'
  await saveAll(leads)
  return true
}

export async function trySendFallbackWebhook(leadId: string): Promise<'sent' | 'skipped' | 'not_found' | 'failed'> {
  const leads = await loadAll()
  const lead = leads.find((l) => l.leadId === leadId)
  if (!lead) return 'not_found'
  if (lead.status !== 'pending') return 'skipped'

  const now = Date.now()
  if (now < new Date(lead.sendAfter).getTime()) return 'skipped'

  const payload = {
    ...buildLeadWebhookPayload(lead.data, { leadId, source: '7h-roofing-landing' }),
    bookingStatus: 'form_only' as const,
    calendarCompleted: false,
    fallbackReason: 'calendar_not_completed_within_10_minutes',
  }

  const result = await sendWebhook(payload, 'lead-form-fallback')
  if (!result.ok) return 'failed'

  await markLeadSentFallback(leadId)
  return 'sent'
}

export async function processDuePendingLeads(): Promise<number> {
  const leads = await loadAll()
  const now = Date.now()
  let sent = 0

  for (const lead of leads) {
    if (lead.status !== 'pending') continue
    if (now < new Date(lead.sendAfter).getTime()) continue
    const outcome = await trySendFallbackWebhook(lead.leadId)
    if (outcome === 'sent') sent += 1
  }

  return sent
}
