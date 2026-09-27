import { useState, useCallback } from 'react'
import { cn } from '../../utils/cn'
import { Input } from './input'
import type { InputProps, InputStyle } from './input'
import type React from 'react'

// ─── Field-level state ────────────────────────────────────────────────────────

export type FieldState = 'default' | 'active' | 'filled' | 'error' | 'disabled'

// ─── Sub-message colour map ───────────────────────────────────────────────────

const MESSAGE_STYLES: Record<Exclude<FieldState, 'default'> | 'helper', string> = {
  active: 'text-warningGold', // gold — focus guidance
  filled: 'text-successGreen', // green — confirmation
  error: 'text-errorRed', // red   — validation
  disabled: 'text-gray-300', // grey dimmed
  helper: 'text-gray-400', // neutral fallback
}

// ─── Shared base props (used by both variants) ────────────────────────────────

interface FormFieldBaseProps {
  /** Field label — always neutral grey, never changes colour with state */
  label?: string

  /**
   * Shown while the field is focused.
   * Gold colour. For `<Input>` fields this is auto-detected; for `children`
   * (Select/FileUpload) you control the state manually via `fieldState`.
   */
  activeMessage?: string

  /**
   * Shown when the field has a value and is not focused/errored.
   * Green colour. Pass `""` to suppress the message entirely.
   */
  filledMessage?: string

  /**
   * Validation error message — shown in red with `role="alert"`.
   * Takes priority over all other messages.
   */
  errorMessage?: string | null

  /**
   * Shown when the field is disabled. Grey colour.
   */
  disabledMessage?: string

  /**
   * Fallback helper shown in the default/idle state. Grey colour.
   * Hidden whenever a state-specific message takes priority.
   */
  helperText?: string

  /**
   * Manual state override for non-`<Input>` children (e.g. Select, FileUpload).
   * If omitted, `<FormField>` auto-detects from `errorMessage` / `disabled`.
   */
  fieldState?: FieldState

  /** Whether the field is disabled */
  disabled?: boolean

  /** Extra wrapper className */
  wrapperClassName?: string

  /** Extra label className */
  labelClassName?: string
}

// ─── Variant A: wraps <Input> ─────────────────────────────────────────────────

export interface FormFieldInputProps
  extends FormFieldBaseProps, Omit<InputProps, 'error' | 'filled' | 'disabled'> {
  /**
   * Required id — links `<label>` and `<input>` for a11y.
   * Also used as the prefix for aria-describedby.
   */
  id: string

  /** Override placeholder appearance tokens */
  inputStyle?: InputStyle

  /** No children — this variant renders its own <Input> */
  children?: never
}

// ─── Variant B: wraps arbitrary children (Select, FileUpload, etc.) ──────────

export interface FormFieldChildrenProps extends FormFieldBaseProps {
  /** Required id — used as label `htmlFor` and aria- prefix */
  id: string

  /**
   * Pass a `<Select>`, `<FileUpload>`, or any other control as a child.
   * `FormField` will provide the label and sub-message around it.
   * The child itself is responsible for its own error/focus visual treatment.
   */
  children: React.ReactNode

  /** Ignored when children are provided */
  inputStyle?: never
}

export type FormFieldProps = FormFieldInputProps | FormFieldChildrenProps

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * `FormField` — single building block for every form field in the app.
 *
 * **Two usage modes:**
 *
 * ### Mode A — wraps `<Input>` (focus auto-detected)
 * ```tsx
 * <FormField
 *   id="estate-name"
 *   label="Estate Name"
 *   placeholder="e.g. Lekki Gardens"
 *   value={form.estateName}
 *   onChange={(e) => updateField('estateName', e.target.value)}
 *   activeMessage="Type your estate's official registered name"
 *   filledMessage="Looks good!"
 *   errorMessage={errors.estateName}
 *   helperText="As it appears in official documents"
 *   // Override placeholder appearance:
 *   inputStyle={{ placeholderFontSize: '14px', placeholderTransform: 'none' }}
 * />
 * ```
 *
 * ### Mode B — wraps Select / FileUpload / any control
 * Pass `fieldState` manually since focus cannot be auto-detected.
 * ```tsx
 * <FormField
 *   id="bank-name"
 *   label="Bank Name"
 *   errorMessage={errors.bankName}
 *   fieldState={errors.bankName ? 'error' : form.bankName ? 'filled' : 'default'}
 *   helperText="Select the bank that holds your estate account"
 * >
 *   <Select value={form.bankName} onValueChange={(v) => updateField('bankName', v)}>
 *     <SelectTrigger error={!!errors.bankName}>
 *       <SelectValue placeholder="Select bank" />
 *     </SelectTrigger>
 *     <SelectContent>...</SelectContent>
 *   </Select>
 * </FormField>
 *
 * <FormField
 *   id="nin-upload"
 *   label="Upload NIN"
 *   errorMessage={errors.stakeholder1Nin}
 *   fieldState={errors.stakeholder1Nin ? 'error' : form.stakeholder1Nin ? 'filled' : 'default'}
 *   filledMessage="NIN document uploaded"
 * >
 *   <FileUpload
 *     title="National Identification Number (NIN)"
 *     description="PDF, JPG & PNG · Max 5MB"
 *     value={form.stakeholder1Nin}
 *     onChange={(file) => updateField('stakeholder1Nin', file)}
 *   />
 * </FormField>
 * ```
 *
 * ### State priority (highest → lowest)
 * 1. `disabled`  → shows `disabledMessage`
 * 2. `error`     → shows `errorMessage`  (role="alert")
 * 3. `active`    → shows `activeMessage` (auto on focus for Input; manual for children)
 * 4. `filled`    → shows `filledMessage`
 * 5. `default`   → shows `helperText`
 *
 * ### Label
 * Always neutral grey — never changes colour with state.
 *
 * ### Placeholder defaults (Input mode only)
 * - color: `slateGray` (#9A9488)
 * - size: `16px`
 * - weight: `400` (normal)
 * - transform: `capitalize`
 * Override any of these via `inputStyle={{ placeholderColor, placeholderFontSize, ... }}`
 */
export function FormField(props: FormFieldProps): React.JSX.Element {
  const {
    id,
    label,
    activeMessage,
    filledMessage,
    errorMessage,
    disabledMessage,
    helperText,
    fieldState,
    disabled,
    wrapperClassName,
    labelClassName,
  } = props

  // ── Focus tracking (Input mode only) ───────────────────────────────────────
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (!('children' in props)) {
        ;(props).onFocus?.(e)
      }
    },
    [props],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      if (!('children' in props)) {
        ;(props).onBlur?.(e)
      }
    },
    [props],
  )

  // ── Derive state ────────────────────────────────────────────────────────────
  const hasError = Boolean(errorMessage)
  const isChildrenMode = 'children' in props && Boolean(props.children)

  // For Input mode we use isFocused; for children mode the caller passes fieldState
  const isFilled = isChildrenMode
    ? false // children mode: caller controls via fieldState
    : Boolean((props as FormFieldInputProps).value ?? (props as FormFieldInputProps).defaultValue)

  const resolvedState: FieldState =
    fieldState ??
    (disabled
      ? 'disabled'
      : hasError
        ? 'error'
        : isFocused && !isChildrenMode
          ? 'active'
          : isFilled
            ? 'filled'
            : 'default')

  // ── Pick sub-message ────────────────────────────────────────────────────────
  let subMessage: string | null | undefined
  let subStyle = MESSAGE_STYLES.helper
  let isAlert = false

  switch (resolvedState) {
    case 'disabled':
      subMessage = disabledMessage ?? helperText
      subStyle = MESSAGE_STYLES.disabled
      break
    case 'error':
      subMessage = errorMessage
      subStyle = MESSAGE_STYLES.error
      isAlert = true
      break
    case 'active':
      subMessage = activeMessage ?? helperText
      subStyle = MESSAGE_STYLES.active
      break
    case 'filled':
      // filledMessage="" deliberately suppresses the message
      subMessage = filledMessage !== undefined ? filledMessage : helperText
      subStyle = MESSAGE_STYLES.filled
      break
    default:
      subMessage = helperText
      subStyle = MESSAGE_STYLES.helper
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  const labelEl = label ? (
    <label
      htmlFor={id}
      className={cn(
        'font-dmsans text-warmGray mb-2 block text-[14px] leading-none font-medium tracking-[1px]',
        labelClassName,
      )}
    >
      {label}
    </label>
  ) : null

  const subMessageEl = subMessage ? (
    <p
      id={`${id}-msg`}
      role={isAlert ? 'alert' : undefined}
      className={cn('font-dmsans mt-1.5 text-[12px] leading-tight transition-colors', subStyle)}
    >
      {subMessage}
    </p>
  ) : null

  // ── Children mode (Select / FileUpload / anything) ──────────────────────────
  if (isChildrenMode) {
    return (
      <div className={cn('flex flex-col', wrapperClassName)}>
        {labelEl}
        {(props as FormFieldChildrenProps).children}
        {subMessageEl}
      </div>
    )
  }

  // ── Input mode ──────────────────────────────────────────────────────────────
  const {
    id: _id,
    label: _label,
    activeMessage: _activeMessage,
    filledMessage: _filledMessage,
    errorMessage: _errorMessage,
    disabledMessage: _disabledMessage,
    helperText: _helperText,
    fieldState: _fieldState,
    wrapperClassName: _wrapperClassName,
    labelClassName: _labelClassName,
    inputStyle,
    className,
    value,
    defaultValue,
    onFocus: _onFocus,
    onBlur: _onBlur,
    ...inputProps
  } = props as FormFieldInputProps & {
    onFocus?: React.FocusEventHandler<HTMLInputElement>
    onBlur?: React.FocusEventHandler<HTMLInputElement>
  }

  return (
    <div className={cn('flex flex-col', wrapperClassName)}>
      {labelEl}
      <Input
        id={id}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        error={hasError}
        filled={resolvedState === 'filled'}
        inputStyle={inputStyle}
        className={className}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={subMessage ? `${id}-msg` : undefined}
        aria-invalid={hasError ? 'true' : undefined}
        {...inputProps}
      />
      {subMessageEl}
    </div>
  )
}
