import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────
type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeContextValue {
  mode: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

// ─── Context (internal — never exported directly) ───────────────────────────
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// ─── Helpers ────────────────────────────────────────────────────────────────
function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
  return 'auto'
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'auto') return mode
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeToDOM(mode: ThemeMode, resolved: 'light' | 'dark') {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  if (mode === 'auto') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', mode)
  }
  root.style.colorScheme = resolved
}

// ─── Provider (exported — wraps the app) ────────────────────────────────────
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('auto')

  const resolved = resolveTheme(mode)

  // Initialise from localStorage on mount
  useEffect(() => {
    const initial = getInitialMode()
    setModeState(initial)
    applyThemeToDOM(initial, resolveTheme(initial))
  }, [])

  // Apply theme to DOM whenever mode changes
  useEffect(() => {
    applyThemeToDOM(mode, resolved)
    window.localStorage.setItem('theme', mode)
  }, [mode, resolved])

  // Listen for system preference changes when in auto mode
  useEffect(() => {
    if (mode !== 'auto') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeToDOM('auto', resolveTheme('auto'))
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light'
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme: resolved, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Consumer hook (exported — the "handset") ───────────────────────────────
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>')
  }
  return context
}

// ─── ThemeToggle UI component ───────────────────────────────────────────────
export function ThemeToggle() {
  const { mode, toggleMode } = useTheme()

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}
    </button>
  )
}
