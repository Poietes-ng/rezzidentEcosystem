import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '../../../shared/components/ui/button'
import { Checkbox } from '../../../shared/components/ui/checkbox'
import { useAuthFlow } from '../context/AuthFlowContext'
import { cn } from '../../../shared/utils/cn'
import logo from '../../../../public/assets/logo.svg'

function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

export function SignInPhoneScreen() {
  const navigate = useNavigate()
  const { state, setPhoneNumber, setRememberMe, setLoginMethod } = useAuthFlow()
  const [phone, setPhone] = useState(formatPhoneNumber(state.phoneNumber))
  const [remember, setRemember] = useState(state.rememberMe)
  const [error, setError] = useState('')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    if (error) setError('')
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = phone.replace(/\s/g, '')
    if (!raw.trim() || raw.length < 10) {
      setError('Please enter a valid phone number.')
      return
    }

    // Mock unregistered number check (e.g. 80137283929 from media_1788087111674.png)
    if (raw === '80137283929' || raw === '080137283929') {
      setError('This number is not registered to this estate.')
      return
    }

    setPhoneNumber(raw)
    setRememberMe(remember)
    setLoginMethod('phone')
    navigate({ to: '/welcome-back' })
  }

  return (
    <div className="font-dmsans flex min-h-full w-full flex-col justify-between bg-white px-6 py-4">
      {/* ── Top Bar ── */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLoginMethod('estate-id')}
              className="text-actionDark flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Back to Estate ID"
            >
              <span className="material-symbols-outlined text-4xl">
                chevron_left
              </span>
            </button>
            <img src={logo} alt="rezzident-logo" />
            <span className="font-dmsans text-actionDark text-[25px] font-bold tracking-tight">
              rezzident
            </span>
          </div>
          <Link
            to="/support"
            className="font-dmsans hover:text-actionDark text-[17px] font-extrabold text-[#9A9488] transition-colors"
          >
            Need Help?
          </Link>
        </div>

        {/* ── Illustration Card Placeholder ── */}
        <div className="my-3 flex h-[200px] w-full items-center justify-center rounded-[20px] bg-[#F9F9F8]">
          <span className="font-dmsans text-[15px] font-medium text-gray-400">
            Illustration
          </span>
        </div>

        {/* ── Heading & Subtitle ── */}
        <div className="mt-6 mb-5">
          <h1 className="font-dmsans text-actionDark text-[47px] font-bold tracking-tight">
            Log in to your account
          </h1>
          <p className="font-dmsans mt-1 text-[17px] font-normal text-[#9A9488]">
            Enter your number to continue to sign in to your estate community.
          </p>
        </div>

        {/* ── Form Inputs ── */}
        <form onSubmit={handleContinue} className="space-y-3">
          <div>
            <label className="font-dmsans block text-[15px] font-medium text-[#9A9488]">
              Phone Number
            </label>
            <div
              className={cn(
                'mt-1 flex items-center border-b pt-1 pb-2 transition-colors',
                error
                  ? 'border-b-[#D92D20]'
                  : 'border-[#E5E5E5] focus-within:border-b-2 focus-within:border-b-[#FFE022]',
              )}
            >
              <span className="font-dmsans text-actionDark mr-2 text-[17px] font-medium">
                +234
              </span>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                className="font-dmsans text-actionDark bg-transparent text-[17px] placeholder:text-[#9A9488] focus:outline-none"
              />
            </div>
            {error && (
              <p className="font-dmsans mt-1.5 text-[13px] text-[#D92D20]">
                {error}
              </p>
            )}
          </div>

          <div className="pt-1">
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              label={
                <span className="text-[13px] text-[#9A9488]">
                  Always remember me
                </span>
              }
            />
          </div>
        </form>
      </div>

      {/* ── Footer Actions ── */}
      <div className="mt-8 space-y-4 pb-2">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleContinue}
            className="bg-actionDark h-[52px] flex-1 rounded-[14px] text-[15px] font-medium text-white hover:bg-black"
          >
            Continue
          </Button>

          {/* Fingerprint Biometric Button */}
          <button
            type="button"
            onClick={() => {
              setPhoneNumber(phone.replace(/\s/g, '') || '8012345678')
              setLoginMethod('phone')
              navigate({ to: '/welcome-back' })
            }}
            aria-label="Fingerprint biometric login"
            className={cn(
              'flex h-[52px] w-[52px] items-center justify-center rounded-[14px] border border-[#E5E5E5] bg-[#FAFAFA]',
              'text-gray-700 transition-colors hover:bg-gray-100',
            )}
          >
            <span className="material-symbols-outlined text-4xl">
              ar_on_you
            </span>
          </button>
        </div>

        <div className="text-center">
          <Link
            to="/registration"
            className="font-dmsans text-actionDark decoration-actionDark text-[17px] font-semibold underline underline-offset-4 hover:opacity-80"
          >
            I don’t have an account
          </Link>
        </div>
      </div>
    </div>
  )
}
