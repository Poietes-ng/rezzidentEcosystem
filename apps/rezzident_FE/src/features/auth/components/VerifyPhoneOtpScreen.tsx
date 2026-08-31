import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../../../shared/components/ui/button'
import { useAuthFlow } from '../context/AuthFlowContext'
import { cn } from '../../../shared/utils/cn'

export function VerifyPhoneOtpScreen() {
  const navigate = useNavigate()
  const { state } = useAuthFlow()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [timer, setTimer] = useState(59)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleOtpChange = (index: number, value: string) => {
    const char = value.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = char
    setOtp(newOtp)
    if (error) setError('')

    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').trim().slice(0, 4)
    if (!pasted) return
    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    if (error) setError('')
    const nextIndex = Math.min(pasted.length, 3)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleResend = () => {
    if (timer > 0) return
    setIsResending(true)
    setError('')
    setTimeout(() => {
      setTimer(59)
      setIsResending(false)
    }, 600)
  }

  const isComplete = otp.every((digit) => digit.length > 0)
  const filledCount = otp.filter(Boolean).length
  const activeIndex = filledCount < 4 ? filledCount : -1

  const handleVerify = () => {
    if (!isComplete) return
    // Mock error validation trigger (e.g. if code is '3815' simulate incorrect code or pass)
    const code = otp.join('')
    if (code === '3815') {
      setError('Incorrect code. Please try again.')
      return
    }
    if (code === '0000') {
      setError('OTP expired. Resend OTP.')
      return
    }
    navigate({ to: '/reset-pin' })
  }

  const displayTarget = state.phoneNumber
    ? `+234 ${state.phoneNumber.replace(/^(\+234|0)/, '').slice(0, 3)} ${state.phoneNumber.slice(-7, -4)} XXXX`
    : '+234 801 234 XXXX'

  return (
    <div className="font-dmsans flex min-h-full w-full flex-col justify-between bg-white px-6 py-4">
      {/* ── Top Bar ── */}
      <div>
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

        {/* ── Eyebrow & Heading ── */}
        <div className="mt-2 mb-8">
          <span className="font-dmsans block text-[12px] font-bold tracking-wider text-gray-400 uppercase">
            ACCOUNT RECOVERY
          </span>
          <h1 className="font-dmsans text-actionDark mt-1 text-[28px] font-bold tracking-tight">
            Verify your number
          </h1>
          <p className="font-dmsans mt-1 text-[14px] text-gray-500">
            We sent a 4-digit code to {displayTarget}
          </p>
        </div>

        {/* ── 4-Digit OTP Slots (Normal, Active & Error States) ── */}
        <div className="my-8 flex justify-center gap-6" onPaste={handlePaste}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = Boolean(otp[index])
            const isActive = index === activeIndex

            return (
              <div
                key={index}
                className="relative flex h-16 w-12 flex-col items-center justify-end"
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                {/* Numeric Digit or Dash */}
                <div className="mb-2 flex h-8 items-center justify-center">
                  {isFilled ? (
                    <span
                      className={cn(
                        'font-dmsans text-[28px] font-bold transition-colors',
                        error ? 'text-[#D92D20]' : 'text-actionDark',
                      )}
                    >
                      {otp[index]}
                    </span>
                  ) : (
                    <div
                      className={cn(
                        'h-0.5 w-6 rounded-full',
                        error ? 'bg-[#D92D20]' : 'bg-[#D1D5DB]',
                      )}
                    />
                  )}
                </div>
                {/* Underline Bar */}
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

        {/* ── Resend Code Row ── */}
        <div className="text-center">
          <p className="font-dmsans text-[14px] text-gray-600">
            Didn't receive a code?{' '}
            {timer > 0 ? (
              <span className="font-medium text-gray-400">
                Resend in {timer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-actionDark decoration-actionDark font-bold underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            )}
          </p>
        </div>

        {/* ── Error Message ── */}
        {error && (
          <div className="mt-4 text-center">
            <p className="font-dmsans text-[13px] font-medium text-[#D92D20]">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* ── Verify Button (Active & Disabled States) ── */}
      <div className="mt-8 pb-2">
        <Button
          type="button"
          onClick={handleVerify}
          disabled={!isComplete}
          className={cn(
            'h-[52px] w-full rounded-[14px] text-[15px] font-medium transition-all',
            isComplete
              ? 'bg-actionDark text-white hover:bg-black'
              : 'cursor-not-allowed bg-[#D1CCC4] text-white hover:bg-[#D1CCC4]',
          )}
        >
          Verify
        </Button>
      </div>
    </div>
  )
}
