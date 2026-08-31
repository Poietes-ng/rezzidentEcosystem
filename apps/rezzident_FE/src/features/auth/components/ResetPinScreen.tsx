import { useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../../../shared/components/ui/button'
import { useAuthFlow } from '../context/AuthFlowContext'
import { cn } from '../../../shared/utils/cn'

export function ResetPinScreen() {
  const navigate = useNavigate()
  const { setPin, setLoginMethod } = useAuthFlow()
  const [pin1, setPin1] = useState(['', '', '', ''])
  const [pin2, setPin2] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(false)

  const pin1Refs = useRef<(HTMLInputElement | null)[]>([])
  const pin2Refs = useRef<(HTMLInputElement | null)[]>([])

  const pin1FilledCount = pin1.filter(Boolean).length
  const pin2FilledCount = pin2.filter(Boolean).length

  const activePin1Index = pin1FilledCount < 4 ? pin1FilledCount : -1
  const activePin2Index =
    pin1FilledCount === 4 && pin2FilledCount < 4 ? pin2FilledCount : -1

  const handlePin1Change = (index: number, value: string) => {
    const char = value.slice(-1)
    const newPin = [...pin1]
    newPin[index] = char
    setPin1(newPin)
    if (error) setError('')

    if (char && index < 3) {
      pin1Refs.current[index + 1]?.focus()
    } else if (char && index === 3) {
      pin2Refs.current[0]?.focus()
    }
  }

  const handlePin2Change = (index: number, value: string) => {
    const char = value.slice(-1)
    const newPin = [...pin2]
    newPin[index] = char
    setPin2(newPin)
    if (error) setError('')

    if (char && index < 3) {
      pin2Refs.current[index + 1]?.focus()
    }
  }

  const handlePin1KeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !pin1[index] && index > 0) {
      pin1Refs.current[index - 1]?.focus()
    }
  }

  const handlePin2KeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !pin2[index]) {
      if (index > 0) {
        pin2Refs.current[index - 1]?.focus()
      } else {
        pin1Refs.current[3]?.focus()
      }
    }
  }

  const pin1Str = pin1.join('')
  const pin2Str = pin2.join('')
  const isComplete = pin1Str.length === 4 && pin2Str.length === 4

  const handleReset = () => {
    if (!isComplete) return
    if (pin1Str !== pin2Str) {
      setError('PINs do not match. Please try again.')
      return
    }
    setPin(pin1Str)
    setShowSuccess(true)

    // Show transition overlay spinner after brief delay
    setTimeout(() => {
      setShowTransitionOverlay(true)
    }, 600)

    setTimeout(() => {
      setLoginMethod('phone')
      navigate({ to: '/sign-in' })
    }, 1800)
  }

  return (
    <div className="font-dmsans relative flex min-h-full w-full flex-col justify-between bg-white px-6 py-4">
      {/* ── Top Bar / Success Banner ── */}
      <div>
        {showSuccess ? (
          <div className="animate-in fade-in slide-in-from-top-2 mt-2 mb-6 flex items-center justify-center gap-2 rounded-[14px] bg-[#258750] px-4 py-3.5 text-white shadow-sm duration-200">
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span className="font-dmsans text-[14px] font-semibold">
              PIN updated successfully
            </span>
          </div>
        ) : (
          <div className="flex items-center pt-2 pb-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-actionDark flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-4xl">
                chevron_left
              </span>
            </button>
          </div>
        )}

        {/* ── Eyebrow & Heading ── */}
        <div className="mt-2 mb-8">
          <span className="font-dmsans block text-[12px] font-bold tracking-wider text-gray-400 uppercase">
            PIN RESET
          </span>
          <h1 className="font-dmsans text-actionDark mt-1 text-[28px] font-bold tracking-tight">
            Reset your PIN
          </h1>
          <p className="font-dmsans mt-1 text-[14px] text-gray-500">
            Set a 4-digit PIN for quick and secure access
          </p>
        </div>

        {/* ── Form Slots ── */}
        <div className="my-4 space-y-8">
          {/* Slot Row 1: Enter PIN */}
          <div>
            <span className="font-dmsans mb-3 block text-center text-[14px] text-gray-500">
              Enter PIN
            </span>
            <div className="flex justify-center gap-6">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = Boolean(pin1[index])
                const isActive = !error && index === activePin1Index

                return (
                  <div
                    key={index}
                    className="relative flex h-16 w-12 flex-col items-center justify-end"
                  >
                    <input
                      ref={(el) => {
                        pin1Refs.current[index] = el
                      }}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={pin1[index]}
                      onChange={(e) => handlePin1Change(index, e.target.value)}
                      onKeyDown={(e) => handlePin1KeyDown(index, e)}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="mb-2 flex h-8 items-center justify-center">
                      {isFilled ? (
                        <div
                          className={cn(
                            'h-4 w-4 scale-100 rounded-full transition-transform duration-150',
                            error ? 'bg-[#D92D20]' : 'bg-actionDark',
                          )}
                        />
                      ) : (
                        <div
                          className={cn(
                            'h-0.5 w-6 rounded-full',
                            error ? 'bg-[#D92D20]' : 'bg-[#D1D5DB]',
                          )}
                        />
                      )}
                    </div>
                    <div
                      className={cn(
                        'h-[2px] w-12 rounded-full transition-all',
                        error && 'bg-[#D92D20]',
                        !error && isFilled && 'bg-actionDark',
                        !error && isActive && 'h-[2.5px] bg-[#FFE022]',
                        !error && !isFilled && !isActive && 'bg-[#D1D5DB]',
                      )}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Slot Row 2: Confirm PIN */}
          <div>
            <span className="font-dmsans mb-3 block text-center text-[14px] text-gray-500">
              Confirm PIN
            </span>
            <div className="flex justify-center gap-6">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = Boolean(pin2[index])
                const isActive = !error && index === activePin2Index

                return (
                  <div
                    key={index}
                    className="relative flex h-16 w-12 flex-col items-center justify-end"
                  >
                    <input
                      ref={(el) => {
                        pin2Refs.current[index] = el
                      }}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={pin2[index]}
                      onChange={(e) => handlePin2Change(index, e.target.value)}
                      onKeyDown={(e) => handlePin2KeyDown(index, e)}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="mb-2 flex h-8 items-center justify-center">
                      {isFilled ? (
                        <div
                          className={cn(
                            'h-4 w-4 scale-100 rounded-full transition-transform duration-150',
                            error ? 'bg-[#D92D20]' : 'bg-actionDark',
                          )}
                        />
                      ) : (
                        <div
                          className={cn(
                            'h-0.5 w-6 rounded-full',
                            error ? 'bg-[#D92D20]' : 'bg-[#D1D5DB]',
                          )}
                        />
                      )}
                    </div>
                    <div
                      className={cn(
                        'h-[2px] w-12 rounded-full transition-all',
                        error && 'bg-[#D92D20]',
                        !error && isFilled && 'bg-actionDark',
                        !error && isActive && 'h-[2.5px] bg-[#FFE022]',
                        !error && !isFilled && !isActive && 'bg-[#D1D5DB]',
                      )}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {error && (
            <p className="font-dmsans pt-2 text-center text-[13px] font-medium text-[#D92D20]">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* ── Reset PIN CTA Button ── */}
      <div className="mt-8 pb-2">
        <Button
          type="button"
          onClick={handleReset}
          disabled={!isComplete}
          className={cn(
            'h-[52px] w-full rounded-[14px] text-[15px] font-medium transition-all',
            isComplete
              ? 'bg-actionDark text-white hover:bg-black'
              : 'cursor-not-allowed bg-[#D1CCC4] text-white hover:bg-[#D1CCC4]',
          )}
        >
          Reset PIN
        </Button>
      </div>

      {/* ── Transition Overlay Spinner (media_1788087142137.png) ── */}
      {showTransitionOverlay && (
        <div className="animate-in fade-in absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] duration-300">
          <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#FFE022] shadow-xl">
            <span className="bg-actionDark h-6 w-6 rounded-tl-sm rounded-tr-md rounded-bl-md" />
          </div>
        </div>
      )}
    </div>
  )
}
