import {
  Building2,
  CloudLightning,
  Droplets,
  Hammer,
  Home,
  Paintbrush,
} from 'lucide-react'

export const SERVICE_OPTIONS = [
  {
    value: 'residential-install',
    label: 'Residential Roof Installation / Replacement',
    icon: Home,
  },
  {
    value: 'storm-damage',
    label: 'Storm Damage Repair & Emergency Tarping',
    icon: CloudLightning,
  },
  {
    value: 'commercial',
    label: 'Commercial Roofing Solutions',
    icon: Building2,
  },
  {
    value: 'custom-design',
    label: 'Custom Roof Design Consultation',
    icon: Paintbrush,
  },
  {
    value: 'gutters',
    label: 'Gutter Systems & Maintenance',
    icon: Droplets,
  },
  {
    value: 'remodeling',
    label: 'Interior/Exterior Remodeling',
    icon: Hammer,
  },
]

export const PROPERTY_AGE_OPTIONS = [
  { value: 'under-10', label: 'Under 10 years' },
  { value: '10-15', label: '10–15 years' },
  { value: 'over-15', label: 'Over 15 years' },
  { value: 'not-sure', label: 'Not sure' },
]
