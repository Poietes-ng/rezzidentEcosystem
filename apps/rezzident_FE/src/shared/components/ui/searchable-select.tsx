import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'

/* ── Types ── */

export interface SearchableSelectOption {
  value: string
  label: string
  /** Optional untruncated version shown (wrapped) in the dropdown list.
   *  `label` is still what's shown in the trigger after selection. */
  fullLabel?: string
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

const PANEL_GAP = 4
const VIEWPORT_MARGIN = 8
const DESIRED_MAX_HEIGHT = 320

/**
 * A Select dropdown with a search/filter input at the top — matches
 * the pattern shown in the estate registration naming-structure step.
 *
 * Uses no extra dependencies (pure React + Radix-free). The dropdown
 * panel is portaled to <body> and positioned with `fixed` coordinates
 * so it's never affected by an ancestor's overflow/clipping, and its
 * position/height are clamped to the viewport so it can never spill
 * off-screen or trigger a page-level scrollbar.
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
  const [panelPos, setPanelPos] = React.useState<{
    left: number
    width: number
    top?: number
    bottom?: number
    maxHeight: number
  } | null>(null)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedLabel = options.find((o) => o.value === value)?.label

  const filtered = React.useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.fullLabel?.toLowerCase().includes(q),
    )
  }, [options, search])

  // Compute (and clamp) panel position/height so it never spills past the viewport
  const updatePosition = React.useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return

    const spaceBelow = window.innerHeight - rect.bottom - PANEL_GAP - VIEWPORT_MARGIN
    const spaceAbove = rect.top - PANEL_GAP - VIEWPORT_MARGIN

    if (spaceBelow >= DESIRED_MAX_HEIGHT || spaceBelow >= spaceAbove) {
      // Render below trigger, clamped to whatever room is actually there
      setPanelPos({
        left: rect.left,
        width: rect.width,
        top: rect.bottom + PANEL_GAP,
        maxHeight: Math.max(Math.min(DESIRED_MAX_HEIGHT, spaceBelow), 120),
      })
    } else {
      // Not enough room below — flip above the trigger instead
      setPanelPos({
        left: rect.left,
        width: rect.width,
        bottom: window.innerHeight - rect.top + PANEL_GAP,
        maxHeight: Math.max(Math.min(DESIRED_MAX_HEIGHT, spaceAbove), 120),
      })
    }
  }, [])

  React.useLayoutEffect(() => {
    if (open) updatePosition()
  }, [open, updatePosition])

  React.useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  // Close on outside click (checks both trigger container and portaled panel)
  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const insideTrigger = containerRef.current?.contains(target)
      const insidePanel = panelRef.current?.contains(target)
      if (!insideTrigger && !insidePanel) {
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
    <div ref={containerRef} className={cn('relative w-full min-w-0', className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!disabled) setOpen(!open)
        }}
        disabled={disabled}
        className={cn(
          'font-dmsans text-body-base text-actionDark flex h-[40px] w-full min-w-0 items-center justify-between bg-transparent px-0 py-2 transition-colors outline-none',
          'border-actionDark border-b',
          !selectedLabel && 'border-[#E5E5E5] text-gray-400',
          open && 'border-b-actionYellow',
          error && 'border-b-red-500',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {/* Trigger always shows the short/truncated label, even after selection */}
        <span className="min-w-0 flex-1 truncate pr-2 text-left">
          {selectedLabel || placeholder}
        </span>
        <span
          className={cn(
            'material-symbols-outlined shrink-0 text-[20px] text-gray-400 transition-transform',
            open && 'rotate-180',
          )}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown panel — portaled to <body>, fixed + clamped to viewport so it
          never spills past the screen edge and never triggers a page scrollbar */}
      {open &&
        panelPos &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              left: panelPos.left,
              width: panelPos.width,
              top: panelPos.top,
              bottom: panelPos.bottom,
              maxHeight: panelPos.maxHeight,
            }}
            className="animate-in fade-in-0 zoom-in-95 fixed z-50 flex flex-col overflow-hidden rounded-[12px] border border-black/5 bg-white shadow-sm"
          >
            {/* Search */}
            <div className="flex shrink-0 items-center gap-2 border-b border-black/5 px-3 py-2.5">
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

            {/* Options list — fills remaining space, hidden scrollbar */}
            <div className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto p-[6px] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        'font-dmsans text-body-small text-actionDark relative flex w-full cursor-default items-center rounded-[8px] py-[10px] pr-[36px] pl-[12px] text-left outline-none select-none',
                        'break-words whitespace-normal', // let full text wrap onto multiple lines
                        'hover:bg-menuHover focus:bg-menuHover',
                        isSelected && 'bg-menuHover',
                      )}
                    >
                      {/* Full text in the list; trigger keeps the truncated version */}
                      {opt.fullLabel ?? opt.label}
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
          </div>,
          document.body,
        )}
    </div>
  )
}
