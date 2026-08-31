import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '../../../shared/components/ui/button'
import { useAuthFlow } from '../context/AuthFlowContext'
import { cn } from '../../../shared/utils/cn'
import logo from '../../../../public/assets/logo.svg'

export function SignInEstateIdScreen() {
  const navigate = useNavigate()
  const { state, setEstateId, setLoginMethod } = useAuthFlow()
  const [estateCode, setEstateCode] = useState(state.estateId)
  const [error, setError] = useState('')

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = estateCode.trim()
    if (!clean) {
      setError('Please enter your estate ID')
      return
    }

    // Mock invalid / not found estate check (e.g. 'RSZ-20' from media_1788087111675.png)
    if (clean === 'RSZ-20' || clean.length < 8) {
      setError('Estate code not found. Please verify and try again.')
      return
    }

    setEstateId(clean)
    setLoginMethod('phone')
  }

  return (
    <div className="font-dmsans flex min-h-full w-full flex-col justify-between bg-white px-6 py-4">
      {/* ── Top Bar ── */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-4">
          <div className="flex items-center gap-1.5">
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
            Enter your estate ID to join your residential community.
          </p>
        </div>

        {/* ── Form Inputs (Red Underline on Error) ── */}
        <form onSubmit={handleNext} className="space-y-3">
          <div>
            <label className="font-dmsans block text-[15px] font-medium text-[#9A9488]">
              Estate ID
            </label>
            <div
              className={cn(
                'mt-1 flex items-center border-b pt-1 pb-2 transition-colors',
                error
                  ? 'border-b-[#D92D20]'
                  : 'border-[#E5E5E5] focus-within:border-b-2 focus-within:border-b-[#FFE022]',
              )}
            >
              <input
                type="text"
                value={estateCode}
                onChange={(e) => {
                  setEstateCode(e.target.value.toUpperCase())
                  if (error) setError('')
                }}
                placeholder="e.g. RSZ-2024-ABCD"
                className="font-dmsans text-actionDark w-full bg-transparent text-[17px] uppercase placeholder:text-[#9A9488] placeholder:normal-case focus:outline-none"
              />
            </div>
            {error ? (
              <p className="font-dmsans mt-1.5 text-[13px] text-[#D92D20]">
                {error}
              </p>
            ) : (
              <p className="font-dmsans mt-1.5 text-[13px] text-[#9A9488]">
                Usually found in your welcome letter or email
              </p>
            )}
          </div>
        </form>
      </div>

      {/* ── Footer Actions ── */}
      <div className="mt-8 space-y-4 pb-2">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleNext}
            className="bg-actionDark h-[52px] flex-1 rounded-[14px] text-[15px] font-medium text-white hover:bg-black"
          >
            Next
          </Button>

          <button
            type="button"
            onClick={() => {
              setEstateCode('RSZ-2024-DEMO')
              setEstateId('RSZ-2024-DEMO')
              setLoginMethod('phone')
            }}
            aria-label="Scan QR Code"
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
