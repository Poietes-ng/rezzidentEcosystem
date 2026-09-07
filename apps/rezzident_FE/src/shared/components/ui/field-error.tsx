interface FieldErrorProps {
  /** The error message to display. If empty/null/undefined, nothing renders. */
  message?: string | null
  className?: string
}

/**
 * Inline field validation error — renders a red error message directly below a form field.
 *
 * Pattern: matches the sign-in form style (red text, small font, directly below the input border).
 *
 * Usage:
 * ```tsx
 * <Input value={value} onChange={...} />
 * <FieldError message={errors.fieldName} />
 * ```
 */
export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null

  return (
    <p
      className={`font-dmsans mt-1.5 text-[12px] leading-tight text-red-500 ${className ?? ''}`}
      role="alert"
    >
      {message}
    </p>
  )
}
