import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'

export interface PhoneInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'inputMode'
> {
  error?: boolean
  filled?: boolean
  prefix?: string
  wrapperClassName?: string
}

export function PhoneInput({
  id,
  value,
  defaultValue,
  error = false,
  filled,
  disabled = false,
  prefix = '+234',
  placeholder = 'Enter phone number',
  className,
  wrapperClassName,
  ...props
}: PhoneInputProps): ReactNode {
  const isFilled = filled ?? Boolean(value || defaultValue)

  return (
    <div
      className={cn(
        'flex h-[40px] w-full items-center border-b transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
        error
          ? 'border-b-errorRed focus-within:border-b-errorRed'
          : isFilled
            ? 'border-b-actionDark focus-within:border-b-actionYellow'
            : 'border-b-stoneEdge focus-within:border-b-actionYellow',
        wrapperClassName,
      )}
    >
      <span className="font-dmsans text-body-base text-actionDark pr-2.5 font-medium whitespace-nowrap select-none">
        {prefix}
      </span>
      <span className="bg-stoneEdge mr-2.5 h-[18px] w-[1px] shrink-0" aria-hidden="true" />
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'font-dmsans text-body-base text-actionDark placeholder:text-slateGray h-full min-w-0 flex-1 border-none bg-transparent px-0 py-2 outline-none',
          disabled && 'cursor-not-allowed',
          className,
        )}
        {...props}
      />
    </div>
  )
}
