import * as React from 'react'
import { cn } from '../../utils/cn'

/* ── Types ── */

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
}

/**
 * A Select dropdown with a search/filter input at the top — matches
 * the pattern shown in the estate registration naming-structure step.
 *
 * Uses no extra dependencies (pure React + Radix-free).
 */
export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search',
  disabled = false,
  error = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedLabel = options.find((o) => o.value === value)?.label

  const filtered = React.useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, search])

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Focus search when dropdown opens
  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  function handleSelect(val: string) {
    onValueChange(val)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) setOpen(!open)
        }}
        disabled={disabled}
        className={cn(
          'font-dmsans text-body-base text-actionDark flex h-[40px] w-full items-center justify-between bg-transparent px-0 py-2 transition-colors outline-none',
          'border-b border-[#E5E5E5]',
          !selectedLabel && 'text-gray-400',
          open && 'border-b-actionYellow',
          error && 'border-b-red-500',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <span
          className={cn(
            'material-symbols-outlined text-[20px] text-gray-400 transition-transform',
            open && 'rotate-180',
          )}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="animate-in fade-in-0 zoom-in-95 absolute top-[calc(100%+4px)] right-0 left-0 z-50 max-h-[320px] overflow-hidden rounded-[12px] border border-black/5 bg-white shadow-lg">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-black/5 px-3 py-2.5">
            <span className="material-symbols-outlined text-[18px] text-gray-400">search</span>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="font-dmsans text-body-small text-actionDark w-full bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Options list */}
          <div className="max-h-[260px] overflow-y-auto p-[6px]">
            {filtered.length === 0 ? (
              <div className="font-dmsans text-web-xs px-3 py-3 text-center text-gray-400">
                No results found.
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'font-dmsans text-body-small text-actionDark relative flex w-full cursor-default items-center rounded-[8px] py-[10px] pr-[36px] pl-[12px] outline-none select-none',
                      'hover:bg-gray-50 focus:bg-gray-50',
                      isSelected && 'bg-gray-50',
                    )}
                  >
                    {opt.label}
                    {isSelected && (
                      <span className="absolute right-[12px] flex h-[20px] w-[20px] items-center justify-center">
                        <span className="material-symbols-outlined text-actionDark text-[18px]">
                          check
                        </span>
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
