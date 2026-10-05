import React, { useRef, useState } from 'react'
import { cn } from '../../utils/cn'

export interface PinInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function PinInput({ length = 4, value = '', onChange, className }: PinInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const inputValue = e.target.value
    // Allow only numeric or alphanumeric, currently taking just 1 char
    const char = inputValue.slice(-1)

    const newValue = value.split('')
    newValue[index] = char
    const finalValue = newValue.join('')

    onChange?.(finalValue)

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else {
        const newValue = value.split('')
        newValue[index] = ''
        onChange?.(newValue.join(''))
      }
    }
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {Array.from({ length }).map((_, index) => {
        const char = value[index]
        const isFocused = focusedIndex === index
        const isFilled = Boolean(char)

        return (
          <div key={index} className="relative flex h-[48px] w-[32px] items-center justify-center">
            <input
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              maxLength={2}
              value={char || ''}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              className="absolute inset-0 h-full w-full bg-transparent text-center text-transparent caret-transparent outline-none"
              aria-label={`Digit ${index + 1} of ${length}`}
            />
            {/* Display Dot if filled */}
            <div className="pointer-events-none flex h-full w-full items-center justify-center">
              {isFilled ? <div className="size-[8px] rounded-full bg-[#1A1A1A]" /> : null}
            </div>
            {/* Bottom line */}
            <div
              className={cn(
                'pointer-events-none absolute bottom-0 left-0 h-[2px] w-full transition-colors',
                isFocused ? 'bg-[#FFE022]' : 'bg-[#E5E5E5]',
              )}
            />
          </div>
        )
      })}
    </div>
  )
}
