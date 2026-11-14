/**
 * Copies text to the system clipboard.
 * Uses navigator.clipboard.writeText where available, falling back to document.execCommand('copy').
 * Safe for SSR (guards window/navigator) and guaranteed never to throw.
 * Returns true if the text was successfully written to the clipboard, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false
  }

  // Modern navigator.clipboard API
  if (typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to legacy fallback
    }
  }

  // Document fallback for older environments or restricted contexts
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '-9999px'
    textArea.setAttribute('readonly', '')
    textArea.setAttribute('aria-hidden', 'true')
    document.body.appendChild(textArea)
    textArea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch {
    return false
  }
}
