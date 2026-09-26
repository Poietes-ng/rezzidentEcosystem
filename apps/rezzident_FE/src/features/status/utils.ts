export const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; dot: string; icon: string }
> = {
  operational: { bg: 'rgba(47,106,74,0.12)', text: 'var(--palm)', dot: 'var(--palm)', icon: '✓' },
  degraded: { bg: 'rgba(196,126,42,0.12)', text: '#a06820', dot: '#c47e2a', icon: '⚠' },
  partial_outage: { bg: 'rgba(196,71,71,0.1)', text: '#9f3030', dot: '#c44747', icon: '⚠' },
  major_outage: { bg: 'rgba(196,71,71,0.15)', text: '#9f3030', dot: '#c44747', icon: '✖' },
  not_configured: {
    bg: 'rgba(23,58,64,0.08)',
    text: 'var(--sea-ink-soft)',
    dot: 'var(--sea-ink-soft)',
    icon: '?',
  },
}

export function getStatusStyle(status: string) {
  return STATUS_COLORS[status] ?? STATUS_COLORS.not_configured
}

export function formatStatus(status: string) {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
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
