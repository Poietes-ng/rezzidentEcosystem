/**
 * Shared display helpers for activity logs.
 * Kept in a separate module so they can be imported by both the page
 * component and any sub-components without circular references.
 */

export const TYPE_LABELS: Record<string, string> = {
  user_login: 'Login',
  pin_locked: 'PIN Locked',
  bill_created: 'Bill',
  payment_received: 'Payment',
  invoice_created: 'Invoice',
  visitor_code: 'Visitor Code',
  visitor_arrival: 'Arrival',
  visitor_departure: 'Departure',
  staff_created: 'Staff',
  expense_created: 'Expense',
  expense_approved: 'Expense Approved',
  verification_submitted: 'Verification',
  verification_approved: 'Verified',
  role_changed: 'Role Change',
  estate_created: 'Estate',
  subaccount_created: 'Subaccount',
}

export const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  user_login: { bg: 'rgba(79,184,178,0.12)', text: 'var(--lagoon-deep)', dot: 'var(--lagoon)' },
  pin_locked: { bg: 'rgba(196,126,42,0.12)', text: '#a06820', dot: '#c47e2a' },
  bill_created: { bg: 'rgba(47,106,74,0.12)', text: 'var(--palm)', dot: 'var(--palm)' },
  payment_received: { bg: 'rgba(47,106,74,0.18)', text: 'var(--palm)', dot: 'var(--palm)' },
  visitor_arrival: {
    bg: 'rgba(79,184,178,0.12)',
    text: 'var(--lagoon-deep)',
    dot: 'var(--lagoon)',
  },
  visitor_departure: {
    bg: 'rgba(23,58,64,0.08)',
    text: 'var(--sea-ink-soft)',
    dot: 'var(--sea-ink-soft)',
  },
  role_changed: { bg: 'rgba(196,71,71,0.1)', text: '#9f3030', dot: '#c44747' },
  estate_created: { bg: 'rgba(196,71,71,0.08)', text: '#9f3030', dot: '#c44747' },
  default: { bg: 'rgba(65,97,102,0.1)', text: 'var(--sea-ink-soft)', dot: 'var(--sea-ink-soft)' },
}

export function typeStyle(type: string) {
  return TYPE_COLORS[type] ?? TYPE_COLORS.default
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
