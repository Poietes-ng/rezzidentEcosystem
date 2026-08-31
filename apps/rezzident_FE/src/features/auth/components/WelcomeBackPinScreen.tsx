import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthFlow } from '../context/AuthFlowContext'
import { cn } from '../../../shared/utils/cn'
import faceid from '../../../../public/assets/faceidpng.png'

export function WelcomeBackPinScreen() {
  const navigate = useNavigate()
  const { state, appendPinDigit, backspacePin, clearPin } = useAuthFlow()
  const [attemptCount, setAttemptCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState('5:00')
  const [noInternet, setNoInternet] = useState(false)

  // Monitor offline events + allow reconnect
  useEffect(() => {
    const handleOnline = () => setNoInternet(false)
    const handleOffline = () => setNoInternet(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleKeyPress = (digit: string) => {
    if (isLocked) return
    if (state.pin.length < 4) {
      appendPinDigit(digit)
    }
  }

  const handleReconnect = () => {
    setNoInternet(false)
  }

  // Mock auto-submit & error / lock handling
  useEffect(() => {
    if (state.pin.length === 4) {
      const timer = setTimeout(() => {
        // Trigger offline mock on '0000'
        if (state.pin === '0000') {
          setNoInternet(true)
          return
        }

        // Trigger lock on '9999'
        if (state.pin === '9999') {
          setIsLocked(true)
          setLockTimer('5:00')
          clearPin()
          return
        }

        if (state.pin === '1111') {
          // Invalid PIN trial
          const nextCount = attemptCount + 1
          setAttemptCount(nextCount)
          if (nextCount >= 3) {
            setIsLocked(true)
            setLockTimer('5:00')
          }
          clearPin()
          return
        }

        // Success redirect
        navigate({ to: '/splash' })
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [state.pin, attemptCount, clearPin, navigate])

  const currentActiveIndex =
    !isLocked && state.pin.length < 4 ? state.pin.length : -1

  return (
    <div className="font-dmsans flex min-h-full w-full flex-col justify-between bg-white px-6 py-4">
      {/* ── Top Bar ── */}
      <div>
        {!noInternet && (
          <>
            <div className="flex items-center gap-3 pt-2 pb-5">
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

              {/* Yellow Phone Badge */}
              <div className="text-actionDark inline-flex items-center gap-1.5 rounded-md bg-[#FFE022] px-4.5 py-1.5 text-[13px] font-bold">
                <span className="material-symbols-outlined text-[18px]">
                  call
                </span>
                <span className="">{state.maskedPhone || '••• 4593'}</span>
              </div>
            </div>

            {/* ── Heading & Subtitle ── */}
            <div className="mt-2 mb-8">
              <h1 className="font-dmsans text-actionDark text-[35px] font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="font-dmsans mt-1 text-[17px] text-[#8A8578]">
                Enter your PIN to sign in to your estate community.
              </p>
            </div>
          </>
        )}

        {/* ── No Internet Connection Card (media_1788087126655.png) ── */}
        {noInternet && (
          <div className="mt-2 mb-6 rounded-[20px] bg-[#C93B3B] p-5 text-white">
            <div className="flex items-center gap-2.5">
              <svg
                className="h-5 w-5 stroke-white"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
              </svg>
              <h3 className="font-dmsans text-[17px] font-bold text-white">
                No Internet connection
              </h3>
            </div>
            <p className="font-dmsans mt-2 text-[13px] leading-relaxed text-white/90">
              Unable to reach the server. Please check your Wi-Fi or mobile data
              and try again.
            </p>
            <button
              type="button"
              onClick={handleReconnect}
              className="font-dmsans mt-4 flex h-[48px] w-full items-center justify-center rounded-[14px] bg-white text-[15px] font-bold text-[#C93B3B] transition-all hover:bg-gray-50 active:scale-[0.99]"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* ── PIN Slot Indicators (Locked Red / Normal States) ── */}
        <div className="flex flex-col items-center justify-center">
          {isLocked ? (
            <span className="font-dmsans mb-4 text-[14px] font-medium text-[#D92D20]">
              Account locked. Try again in {lockTimer}
            </span>
          ) : (
            <span className="font-dmsans mb-4 text-[14px] text-gray-500">
              Enter PIN
            </span>
          )}

          <div className="flex items-center justify-center gap-6">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = Boolean(state.pin[index])
              const isActive = !isLocked && index === currentActiveIndex

              return (
                <div
                  key={index}
                  className="flex h-16 w-12 flex-col items-center justify-end"
                >
                  {/* Disc Bullet or Dash */}
                  <div className="mb-2 flex h-8 items-center justify-center">
                    {isFilled ? (
                      <div
                        className={cn(
                          'h-4 w-4 scale-100 rounded-full transition-transform duration-150',
                          isLocked ? 'bg-[#D92D20]' : 'bg-actionDark',
                        )}
                      />
                    ) : (
                      <div
                        className={cn(
                          'h-0.5 w-6 rounded-full',
                          isLocked ? 'bg-[#F87171]' : 'bg-[#D1D5DB]',
                        )}
                      />
                    )}
                  </div>
                  {/* Underline Bar */}
                  <div
                    className={cn(
                      'h-[2px] w-12 rounded-full transition-all',
                      isLocked && 'bg-[#F87171]',
                      !isLocked && isFilled && 'bg-actionDark',
                      !isLocked && isActive && 'h-[2.5px] bg-[#FFE022]',
                      !isLocked && !isFilled && !isActive && 'bg-[#D1D5DB]',
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Numeric Keypad ── */}
      <div className="my-auto pt-6">
        <div
          className={cn(
            'mx-auto grid max-w-[290px] grid-cols-3 place-items-center gap-x-5 gap-y-4 transition-opacity duration-200',
            isLocked && 'pointer-events-none opacity-20 select-none',
          )}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isLocked}
              onClick={() => handleKeyPress(String(num))}
              className={cn(
                'flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F9F9F8]',
                'font-dmsans text-actionDark text-[34px] font-bold transition-all duration-100',
                'select-none hover:bg-[#EFEFEF] active:scale-95',
              )}
            >
              {num}
            </button>
          ))}

          {/* Fingerprint Biometric Button */}
          <button
            type="button"
            disabled={isLocked}
            onClick={() => {
              if (isLocked) return
              clearPin()
              appendPinDigit('1')
              appendPinDigit('2')
              appendPinDigit('3')
              appendPinDigit('4')
            }}
            aria-label="Fingerprint biometrics"
            className="text-actionDark flex h-[72px] w-[72px] items-center justify-center rounded-full transition-all hover:bg-gray-100 active:scale-95"
          >
            <img src={faceid} alt="face-id-logo" />
          </button>

          {/* Zero Button */}
          <button
            type="button"
            disabled={isLocked}
            onClick={() => handleKeyPress('0')}
            className={cn(
              'flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F9F9F8]',
              'font-dmsans text-actionDark text-[34px] font-bold transition-all duration-100',
              'select-none hover:bg-[#EFEFEF] active:scale-95',
            )}
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            disabled={isLocked}
            onClick={backspacePin}
            aria-label="Delete digit"
            className="text-actionDark flex h-[72px] w-[72px] items-center justify-center rounded-full transition-all hover:bg-gray-100 active:scale-95"
          >
            <span className="material-symbols-outlined text-4xl">
              backspace
            </span>
          </button>
        </div>
      </div>

      {/* ── Footer Link ── */}
      <div className="mt-8 pb-2 text-center">
        <Link
          to="/account-recovery"
          className="font-dmsans text-actionDark decoration-actionDark text-[15px] font-medium underline underline-offset-4 hover:opacity-80"
        >
          {isLocked ? 'Reset your PIN' : 'Forgot your PIN?'}
        </Link>
      </div>
    </div>
  )
}
