import * as React from 'react'
import { cn } from '../../utils/cn'

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: React.ReactNode
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, id, checked, defaultChecked, onChange, ...props },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <label
        htmlFor={inputId}
        className="group inline-flex cursor-pointer items-center gap-2 select-none"
      >
        <div className="relative flex items-center justify-center">
          <input
            id={inputId}
            type="checkbox"
            ref={ref}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-[4px] border border-[#D0D5DD] bg-white transition-all',
              'peer-focus-visible:ring-actionYellow peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1',
              'peer-checked:border-actionDark peer-checked:bg-actionDark',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              className,
            )}
          >
            <svg
              className="h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
          </div>
        </div>
        {label && (
          <span className="font-dmsans text-actionDark text-[14px] transition-colors group-hover:text-black">
            {label}
          </span>
        )}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
