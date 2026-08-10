import { useState, useEffect } from 'react'

/**
 * Delays updating a value until a specified time has passed since the last change.
 * Useful for search inputs, API calls, and other scenarios where you want to
 * wait for the user to stop typing before acting.
 *
 * @param value — The value to debounce
 * @param delay — Delay in milliseconds (default: 300)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 500)
 *
 * useEffect(() => {
 *   // Only fires 500ms after the user stops typing
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 * ```
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
