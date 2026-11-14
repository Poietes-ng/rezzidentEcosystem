/**
 * Formats remaining time in milliseconds into human-readable countdown text:
 * - >= 1 hour: "Xh Ym" (e.g., "23h 45m")
 * - < 1 hour and >= 60s: "Xm" (e.g., "45m")
 * - < 60s and > 0: "less than a minute"
 * - <= 0: "expired"
 */
export function formatTimeRemaining(remainingMs: number): string {
  if (remainingMs <= 0) {
    return 'expired'
  }

  const totalSeconds = Math.floor(remainingMs / 1000)
  if (totalSeconds < 60) {
    return 'less than a minute'
  }

  const totalMinutes = Math.floor(totalSeconds / 60)
  if (totalMinutes < 60) {
    return `${totalMinutes}m`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}
