import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../utils/cn'

/*
 * HOW TO EDIT A BUTTON
 *
 *   1. Change a variant for the whole app  -> edit `variantDefaults` below.
 *   2. Change one button only              -> <Button buttonStyle={{ bgColor: "red" }} />
 *   3. Last-second one-off                 -> <Button style={{ marginTop: 8 }} />
 *
 * Strongest wins:  style prop  >  buttonStyle  >  variantDefaults
 * (className is for extra Tailwind classes; see report.md for the full story.)
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outlined'

export interface ButtonStyle {
  /** Optional Tailwind classes. The typed fields below are stronger and win over this. */
  shapeClass?: string

  // ── Size & spacing (CSS values as strings: "56px", "1rem", "16px 24px") ──
  width?: string
  height?: string
  minHeight?: string
  padding?: string // shorthand: "16px 24px" = 16 top/bottom, 24 left/right
  margin?: string // shorthand: "0 8px"
  gap?: string // space between icon and text inside the label
  radius?: string // corner roundness: "12px", "9999px" for a pill

  // ── Text ──
  fontFamily?: string
  fontSize?: string
  fontWeight?: string // "400", "600", "700"
  lineHeight?: string
  letterSpacing?: string // "0.02em"
  textTransform?: React.CSSProperties['textTransform'] // "uppercase" | "none" ...

  // ── Underline (real text-decoration underline) ──
  underline?: boolean
  underlineColor?: string
  underlineWidth?: string // e.g. "1px"
  underlineOffset?: string // e.g. "4px"
  hoverUnderlineColor?: string
  pressedUnderlineColor?: string
  loadingUnderlineColor?: string
  disabledUnderlineColor?: string

  // ── Border under the text only (the "ghost" look) ──
  textBorderBottomWidth?: string
  textBorderBottomColor?: string
  hoverTextBorderBottomColor?: string
  pressedTextBorderBottomColor?: string
  disabledTextBorderBottomColor?: string

  // ── Button border ──
  borderWidth?: string
  borderStyle?: React.CSSProperties['borderStyle'] // "solid" | "dashed" ...

  // ── Effects ──
  shadow?: string // CSS box-shadow: "0 2px 8px rgba(0,0,0,0.15)"
  hoverShadow?: string
  pressedShadow?: string
  transitionDuration?: string // "150ms"

  // ── Keyboard focus ring (shows when tabbing, not when clicking) ──
  focusRingColor?: string
  focusRingWidth?: string
  focusRingOffset?: string

  // ── Colours per state ──
  // default
  textColor?: string
  bgColor?: string
  borderColor?: string
  // hover
  hoverTextColor?: string
  hoverBgColor?: string
  hoverBorderColor?: string
  // pressed
  pressedTextColor?: string
  pressedBgColor?: string
  pressedBorderColor?: string
  // loading
  loadingTextColor?: string
  loadingBgColor?: string
  loadingBorderColor?: string
  loadingOpacity?: string
  // disabled
  disabledTextColor?: string
  disabledBgColor?: string
  disabledBorderColor?: string
  disabledOpacity?: string // e.g. "0.5"
}

// Shared by the three "solid" variants so we don't repeat ourselves.
const solidShape: ButtonStyle = {
  height: '56px',
  minHeight: '56px',
  padding: '16px 24px',
  radius: '12px',
  fontWeight: '600',
}

// Per-variant defaults, using the same keys as the override prop
const variantDefaults: Record<ButtonVariant, ButtonStyle> = {
  primary: {
    ...solidShape,
    bgColor: '#1A1A1A', // actionDark
    textColor: '#FFFFFF',
    borderColor: 'transparent',
    hoverBgColor: '#2E2E2E', // actionDarkHover
    pressedBgColor: '#050505', // actionDarkPressed
    disabledBgColor: '#D4D0C8', // actionDarkDisabled
    disabledTextColor: '#FFFFFF',
  },
  secondary: {
    ...solidShape,
    bgColor: '#FAFAF5', // actionDisabled
    textColor: '#1A1A1A', // actionDark
    borderColor: '#E5E7EB',
    hoverBgColor: '#EBEBE4',
    pressedBgColor: '#9A9488',
    disabledOpacity: '0.5',
    disabledBgColor: '#E8E5DF',
    disabledTextColor: '#C0BAB0',
  },
  outlined: {
    ...solidShape,
    bgColor: '#FFFFFF',
    textColor: '#FFE022', // actionYellow
    borderColor: '#FFE022', // actionYellow
    hoverBgColor: '#FFFDE7',
    pressedBgColor: '#FFF9C4',
    disabledOpacity: '0.5',
  },
  ghost: {
    padding: '8px 12px',
    radius: '8px',
    fontWeight: '600',
    bgColor: 'transparent',
    textColor: '#1A1A1A', // actionDark
    hoverTextColor: '#FFE022',
    disabledTextColor: '#D4D0C8',
    borderColor: 'transparent',
    textBorderBottomWidth: '1px',
    textBorderBottomColor: '#1A1A1A',
    hoverTextBorderBottomColor: '#FFE022',
    disabledTextBorderBottomColor: '#D4D0C8',
    disabledOpacity: '0.5',
  },
}

// Merge two style objects, but IGNORE keys whose value is `undefined`.
// (A plain `{...a, ...b}` would let `{ bgColor: undefined }` wipe out the default.)
function mergeStyles(base: ButtonStyle, override?: ButtonStyle): ButtonStyle {
  if (!override) return { ...base }
  const defined = Object.fromEntries(
    Object.entries(override).filter(([, value]) => value !== undefined),
  )
  return { ...base, ...defined }
}

// PART 1 - values that never change with hover/press: plain inline styles.
// Keys that are `undefined` are skipped by React, so unset fields do nothing.
function resolveInline(r: ButtonStyle): React.CSSProperties {
  return {
    width: r.width,
    height: r.height,
    minHeight: r.minHeight,
    padding: r.padding,
    margin: r.margin,
    borderRadius: r.radius,
    borderStyle: r.borderStyle,
    fontFamily: r.fontFamily,
    fontSize: r.fontSize,
    fontWeight: r.fontWeight,
    lineHeight: r.lineHeight,
    letterSpacing: r.letterSpacing,
    textTransform: r.textTransform,
    transitionDuration: r.transitionDuration,
  }
}

// PART 2 - values that DO change with state (hover, pressed, ...): CSS variables.
// Inline styles can't do :hover, so we store every state's value in a variable
// and let the Tailwind classes below pick the right one.
// Every fallback is resolved here: pressed -> hover -> default, loading/disabled -> default
function resolveVars(r: ButtonStyle): React.CSSProperties {
  const text = r.textColor ?? '#ffe023'
  const bg = r.bgColor ?? '#3d23ff'
  const border = r.borderColor ?? 'transparent'
  const underline = r.underlineColor ?? 'currentColor'
  const textBorder = r.textBorderBottomColor ?? 'transparent'
  const shadow = r.shadow ?? 'none'

  const hoverText = r.hoverTextColor ?? text
  const hoverBg = r.hoverBgColor ?? bg
  const hoverBorder = r.hoverBorderColor ?? border
  const hoverUnderline = r.hoverUnderlineColor ?? underline
  const hoverTextBorder = r.hoverTextBorderBottomColor ?? textBorder
  const hoverShadow = r.hoverShadow ?? shadow

  const vars: Record<string, string> = {
    '--btn-text': text,
    '--btn-bg': bg,
    '--btn-border': border,
    '--btn-border-w': r.borderWidth ?? '1px',
    '--btn-deco': r.underline ? 'underline' : 'none',
    '--btn-underline': underline,
    '--btn-underline-w': r.underlineWidth ?? '1px',
    '--btn-underline-offset': r.underlineOffset ?? '4px',
    '--btn-text-border-w': r.textBorderBottomWidth ?? '0px',
    '--btn-text-border': textBorder,
    '--btn-shadow': shadow,

    '--btn-hover-text': hoverText,
    '--btn-hover-bg': hoverBg,
    '--btn-hover-border': hoverBorder,
    '--btn-hover-underline': hoverUnderline,
    '--btn-hover-text-border': hoverTextBorder,
    '--btn-hover-shadow': hoverShadow,

    '--btn-pressed-text': r.pressedTextColor ?? hoverText,
    '--btn-pressed-bg': r.pressedBgColor ?? hoverBg,
    '--btn-pressed-border': r.pressedBorderColor ?? hoverBorder,
    '--btn-pressed-underline': r.pressedUnderlineColor ?? hoverUnderline,
    '--btn-pressed-text-border': r.pressedTextBorderBottomColor ?? hoverTextBorder,
    '--btn-pressed-shadow': r.pressedShadow ?? hoverShadow,

    '--btn-loading-text': r.loadingTextColor ?? text,
    '--btn-loading-bg': r.loadingBgColor ?? bg,
    '--btn-loading-border': r.loadingBorderColor ?? border,
    '--btn-loading-underline': r.loadingUnderlineColor ?? underline,
    '--btn-loading-opacity': r.loadingOpacity ?? '1',

    '--btn-disabled-text': r.disabledTextColor ?? text,
    '--btn-disabled-bg': r.disabledBgColor ?? bg,
    '--btn-disabled-border': r.disabledBorderColor ?? border,
    '--btn-disabled-underline': r.disabledUnderlineColor ?? underline,
    '--btn-disabled-text-border': r.disabledTextBorderBottomColor ?? textBorder,
    '--btn-disabled-opacity': r.disabledOpacity ?? '1',

    '--btn-focus-ring': r.focusRingColor ?? '#2563EB',
    '--btn-focus-ring-w': r.focusRingWidth ?? '2px',
    '--btn-focus-ring-offset': r.focusRingOffset ?? '2px',
  }
  return vars
}

// Full static strings so Tailwind can detect them.
// Only ONE state's paint classes are applied at a time, so nothing conflicts.
const underlineShape =
  '[text-decoration-line:var(--btn-deco)] underline-offset-[var(--btn-underline-offset)] decoration-[length:var(--btn-underline-w)]'

const styles = {
  base:
    'group relative inline-flex items-center justify-center whitespace-nowrap font-dmsans font-medium text-body-base ' +
    'transition-[color,background-color,border-color,box-shadow,text-decoration-color] ' +
    'focus-visible:[outline:var(--btn-focus-ring-w)_solid_var(--btn-focus-ring)] focus-visible:[outline-offset:var(--btn-focus-ring-offset)]',
  structure: `border-[length:var(--btn-border-w)] [box-shadow:var(--btn-shadow)] ${underlineShape}`,
  interactive: [
    'cursor-pointer',
    'bg-[color:var(--btn-bg)] text-[color:var(--btn-text)] border-[color:var(--btn-border)] decoration-[color:var(--btn-underline)]',
    'hover:bg-[color:var(--btn-hover-bg)] hover:text-[color:var(--btn-hover-text)] hover:border-[color:var(--btn-hover-border)] hover:decoration-[color:var(--btn-hover-underline)] hover:[box-shadow:var(--btn-hover-shadow)]',
    'active:bg-[color:var(--btn-pressed-bg)] active:text-[color:var(--btn-pressed-text)] active:border-[color:var(--btn-pressed-border)] active:decoration-[color:var(--btn-pressed-underline)] active:[box-shadow:var(--btn-pressed-shadow)]',
  ].join(' '),
  loading:
    'pointer-events-none cursor-wait bg-[color:var(--btn-loading-bg)] text-[color:var(--btn-loading-text)] border-[color:var(--btn-loading-border)] decoration-[color:var(--btn-loading-underline)] opacity-[var(--btn-loading-opacity)]',
  disabled:
    'pointer-events-none cursor-not-allowed bg-[color:var(--btn-disabled-bg)] text-[color:var(--btn-disabled-text)] border-[color:var(--btn-disabled-border)] decoration-[color:var(--btn-disabled-underline)] opacity-[var(--btn-disabled-opacity)]',

  // The label <span> sits inside a real <button>. A parent's underline does not
  // pass into an inline-flex child, so the label gets its own underline + text-border.
  label: `col-start-1 row-start-1 inline-flex items-center justify-center transition-colors border-b-(length:--btn-text-border-w) ${underlineShape}`,
  labelInteractive: [
    'border-b-(--btn-text-border) decoration-[color:var(--btn-underline)]',
    'group-hover:border-b-(--btn-hover-text-border) group-hover:decoration-[color:var(--btn-hover-underline)]',
    'group-active:border-b-(--btn-pressed-text-border) group-active:decoration-[color:var(--btn-pressed-underline)]',
  ].join(' '),
  labelLoading: 'invisible',
  labelDisabled:
    'border-b-(--btn-disabled-text-border) decoration-[color:var(--btn-disabled-underline)]',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: ButtonVariant
  loading?: boolean
  loadingText?: string
  buttonStyle?: ButtonStyle
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      style,
      variant = 'primary',
      asChild = false,
      loading = false,
      loadingText = 'Please wait...',
      buttonStyle,
      disabled,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    // disabled wins over loading
    const stateClasses = disabled ? styles.disabled : loading ? styles.loading : styles.interactive

    // One merged config: variant defaults + this button's overrides
    const config = mergeStyles(variantDefaults[variant], buttonStyle)

    const classes = cn(styles.base, styles.structure, config.shapeClass, stateClasses, className)

    // Strongest last: variables -> inline fields -> the `style` prop
    const mergedStyle: React.CSSProperties = {
      ...resolveVars(config),
      ...resolveInline(config),
      ...style,
    }

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={classes}
          style={mergedStyle}
          aria-disabled={disabled || loading}
          onClick={loading ? undefined : onClick}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-busy={loading}
        onClick={loading ? undefined : onClick}
        className={classes}
        style={mergedStyle}
        {...props}
      >
        {/* Label and loading text share one grid cell, so the button is always
            as wide as the longer of the two and never resizes when loading starts */}
        <span className="inline-grid">
          <span
            className={cn(
              styles.label,
              disabled
                ? styles.labelDisabled
                : loading
                  ? styles.labelLoading
                  : styles.labelInteractive,
            )}
            style={{ gap: config.gap }}
          >
            {children}
          </span>
          {loading && (
            <span
              className="col-start-1 row-start-1 inline-flex items-center justify-center"
              style={{ gap: config.gap }}
            >
              {loadingText}
            </span>
          )}
        </span>
      </button>
    )
  },
)
Button.displayName = 'Button'
