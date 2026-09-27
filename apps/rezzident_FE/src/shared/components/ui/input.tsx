import * as React from 'react'
import { cn } from '../../utils/cn'

export interface InputStyle {
  shapeClass?: string
  // default
  textColor?: string
  bgColor?: string
  borderColor?: string
  borderWidth?: string
  // placeholder appearance
  placeholderColor?: string
  placeholderFontSize?: string // e.g. "16px" | "14px"
  placeholderFontWeight?: string // e.g. "400" | "500"
  placeholderTransform?: string // e.g. "capitalize" | "uppercase" | "none"
  // typing
  typingBorderColor?: string
  typingTextColor?: string
  // filled
  filledBorderColor?: string
  filledTextColor?: string
  // error
  errorBorderColor?: string
  errorTextColor?: string
  // disabled
  disabledBgColor?: string
  disabledTextColor?: string
  disabledBorderColor?: string
  disabledOpacity?: string
}

const defaultStyle: InputStyle = {
  shapeClass: 'h-[40px] px-0 py-2',
  textColor: '#1A1A1A', // actionDark
  bgColor: 'transparent',
  borderColor: '#E5E7EB', // gray-200
  borderWidth: '1px',
  placeholderColor: '#9A9488', // slateGray
  placeholderFontSize: '16px',
  placeholderFontWeight: '400', // normal
  placeholderTransform: 'capitalize',

  typingBorderColor: '#FFE022', // actionYellow
  typingTextColor: undefined,

  filledBorderColor: '#1A1A1A',
  filledTextColor: undefined,

  errorBorderColor: '#C92727', // errorRed
  errorTextColor: '#C92727',

  disabledBgColor: 'transparent',
  disabledTextColor: undefined,
  disabledBorderColor: undefined,
  disabledOpacity: '0.5',
}

function resolveVars(override?: InputStyle): React.CSSProperties {
  const r = { ...defaultStyle, ...override }

  const text = r.textColor ?? 'currentColor'
  const bg = r.bgColor ?? 'transparent'
  const border = r.borderColor ?? 'transparent'

  const vars: Record<string, string> = {
    '--inp-text': text,
    '--inp-bg': bg,
    '--inp-border': border,
    '--inp-border-w': r.borderWidth ?? '1px',
    '--inp-placeholder': r.placeholderColor ?? '#9A9488',
    '--inp-placeholder-size': r.placeholderFontSize ?? '16px',
    '--inp-placeholder-weight': r.placeholderFontWeight ?? '400',
    '--inp-placeholder-transform': r.placeholderTransform ?? 'capitalize',

    '--inp-typing-border': r.typingBorderColor ?? border,
    '--inp-typing-text': r.typingTextColor ?? text,

    '--inp-filled-border': r.filledBorderColor ?? border,
    '--inp-filled-text': r.filledTextColor ?? text,

    '--inp-error-border': r.errorBorderColor ?? border,
    '--inp-error-text': r.errorTextColor ?? text,

    '--inp-disabled-bg': r.disabledBgColor ?? bg,
    '--inp-disabled-text': r.disabledTextColor ?? text,
    '--inp-disabled-border': r.disabledBorderColor ?? border,
    '--inp-disabled-opacity': r.disabledOpacity ?? '1',
  }
  return vars
}

const styles = {
  base: 'flex w-full font-dmsans text-body-base transition-colors outline-none',
  structure: [
    'border-b-[length:var(--inp-border-w)]',
    'placeholder:text-[color:var(--inp-placeholder)]',
    'placeholder:text-[length:var(--inp-placeholder-size)]',
    'placeholder:font-[var(--inp-placeholder-weight)]',
    'placeholder:[text-transform:var(--inp-placeholder-transform)]',
  ].join(' '),

  interactive: [
    'bg-[color:var(--inp-bg)] text-[color:var(--inp-text)] border-b-[color:var(--inp-border)]',
    'focus-visible:border-b-[color:var(--inp-typing-border)] focus-visible:text-[color:var(--inp-typing-text)]',
  ].join(' '),

  filled: [
    'bg-[color:var(--inp-bg)] border-b-[color:var(--inp-filled-border)] text-[color:var(--inp-filled-text)]',
    'focus-visible:border-b-[color:var(--inp-typing-border)] focus-visible:text-[color:var(--inp-typing-text)]',
  ].join(' '),

  error: [
    'bg-[color:var(--inp-bg)] text-[color:var(--inp-error-text)] border-b-[color:var(--inp-error-border)]',
    'focus-visible:border-b-[color:var(--inp-error-border)] focus-visible:text-[color:var(--inp-error-text)]',
  ].join(' '),

  disabled:
    'cursor-not-allowed opacity-[var(--inp-disabled-opacity)] bg-[color:var(--inp-disabled-bg)] text-[color:var(--inp-disabled-text)] border-b-[color:var(--inp-disabled-border)]',
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  filled?: boolean
  inputStyle?: InputStyle
  /**
   * For password inputs: show/hide the eye toggle button.
   * Defaults to `true` when `type="password"`, ignored otherwise.
   * Pass `showPasswordToggle={false}` to suppress the icon entirely.
   */
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      style,
      type,
      error,
      filled,
      inputStyle,
      disabled,
      showPasswordToggle = true,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(false)

    const isPassword = type === 'password'
    const resolvedType = isPassword && visible ? 'text' : type
    const showToggle = isPassword && showPasswordToggle

    // Determine state
    // We auto-detect filled if the `filled` prop is undefined but a value is present.
    const isFilled = filled ?? Boolean(props.value || props.defaultValue)

    let stateClasses = styles.interactive
    if (disabled) stateClasses = styles.disabled
    else if (error) stateClasses = styles.error
    else if (isFilled) stateClasses = styles.filled

    // Resolve shape and inline styles
    const mergedConfig = { ...defaultStyle, ...inputStyle }
    const resolvedShapeClass = mergedConfig.shapeClass ?? ''
    const mergedStyle = { ...resolveVars(inputStyle), ...style }

    const classes = cn(
      styles.base,
      styles.structure,
      resolvedShapeClass,
      stateClasses,
      showToggle && 'pr-8', // Extra padding if icon is visible
      className,
    )

    const inputEl = (
      <input
        type={resolvedType}
        className={classes}
        style={mergedStyle}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )

    if (!showToggle) {
      return inputEl
    }

    return (
      <div className="relative flex items-center">
        {inputEl}
        <button
          type="button"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
          className="hover:text-actionDark absolute right-0 flex items-center justify-center text-gray-400 transition-colors focus-visible:outline-none"
        >
          <span className="material-symbols-outlined text-[20px] select-none">
            {visible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
