import type { LeadFormData } from '@/types/lead'

export const SERVICE_LABELS: Record<string, string> = {
  'roof-replacement': 'Roof Replacement',
  'storm-repair': 'Storm Repair / Tarping',
  commercial: 'Commercial Solutions',
  'custom-design': 'Custom Roof Design',
  remodeling: 'Remodeling',
}

export const PROPERTY_AGE_LABELS: Record<string, string> = {
  'under-10': 'Under 10 years',
  '10-15': '10 to 15 years',
  'over-15': 'More than 15 years',
  'not-sure': 'Not sure',
}

export const TIMELINE_LABELS: Record<string, string> = {
  asap: 'ASAP / Emergency',
  '1-2-weeks': 'Within 1–2 Weeks',
  '1-month': 'Within 1 Month',
  researching: 'Just Researching',
}

export function labelForService(value: string): string {
  return SERVICE_LABELS[value] ?? value
}

export function labelForPropertyAge(value: string): string {
  return PROPERTY_AGE_LABELS[value] ?? value
}

export function labelForTimeline(value: string): string {
  return TIMELINE_LABELS[value] ?? value
}

export type LeadWebhookFields = Pick<
  LeadFormData,
  'service' | 'propertyAge' | 'timeline' | 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'consent'
>

export function buildLeadWebhookPayload(
  data: LeadWebhookFields,
  extras: { leadId?: string; submittedAt?: string; source?: string } = {},
) {
  const fullName = `${data.firstName} ${data.lastName}`.trim()
  return {
    type: 'lead' as const,
    leadId: extras.leadId,
    service: data.service,
    serviceLabel: labelForService(data.service),
    propertyAge: data.propertyAge,
    propertyAgeLabel: labelForPropertyAge(data.propertyAge),
    timeline: data.timeline,
    timelineLabel: labelForTimeline(data.timeline),
    inspectionTimeline: data.timeline,
    inspectionTimelineLabel: labelForTimeline(data.timeline),
    firstName: data.firstName,
    lastName: data.lastName,
    fullName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    consent: data.consent,
    source: extras.source ?? '7h-roofing-landing',
    submittedAt: extras.submittedAt ?? new Date().toISOString(),
  }
}
