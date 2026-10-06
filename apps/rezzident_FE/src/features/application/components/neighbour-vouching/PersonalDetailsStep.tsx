import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button, Input } from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export interface PersonalDetailsStepProps {
  currentStep: number
  totalSteps: number
  firstName: string
  lastName: string
  phoneNumber: string
  onFirstNameChange: (val: string) => void
  onLastNameChange: (val: string) => void
  onPhoneNumberChange: (val: string) => void
  onNext: () => void
}

export function PersonalDetailsStep({
  currentStep,
  totalSteps,
  firstName,
  lastName,
  phoneNumber,
  onFirstNameChange,
  onLastNameChange,
  onPhoneNumberChange,
  onNext,
}: PersonalDetailsStepProps): ReactNode {
  const [submitted, setSubmitted] = useState(false)

  // Validate inputs
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  const isFirstNameValid = firstName.trim().length >= 2
  const isLastNameValid = lastName.trim().length >= 2
  const isPhoneValid = cleanPhone.length >= 10

  const firstNameError = submitted && !isFirstNameValid ? 'Please enter your first name.' : null
  const lastNameError = submitted && !isLastNameValid ? 'Please enter your last name.' : null
  const phoneError = submitted && !isPhoneValid ? 'Please enter a valid phone number.' : null

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmitted(true)
    if (isFirstNameValid && isLastNameValid && isPhoneValid) {
      onNext()
    }
  }

  const isFormComplete = isFirstNameValid && isLastNameValid && isPhoneValid

  return (
    <div className="font-dmsans flex w-full flex-col px-6 pt-2 pb-8">
      <div>
        {/* ── Section Title ── */}
        <span className="font-dmsans text-warmGray block text-[13px] font-semibold tracking-wider uppercase">
          STEP {currentStep} OF {totalSteps}
        </span>
        <h1 className="font-dmsans text-actionDark mt-1 text-[32px] leading-tight font-bold sm:text-[32px]">
          Your details
        </h1>
        <p className="text-warmGray mt-2 text-[16px] leading-relaxed">
          We need this to verify your identity
        </p>

        {/* ── Form Inputs ── */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="font-dmsans text-warmGray mb-1 block text-[14px] font-medium"
            >
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              className={cn(
                'placeholder:text-slateGray/70 h-[44px] border-b text-[15px]',
                firstNameError
                  ? 'border-b-errorRed text-actionDark focus-visible:border-b-errorRed'
                  : 'border-b-stoneEdge focus-visible:border-b-actionYellow',
              )}
              autoFocus
            />
            {firstNameError && (
              <p className="font-dmsans text-errorRed animate-in fade-in mt-1.5 text-[12px] font-normal">
                {firstNameError}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="font-dmsans text-warmGray mb-1 block text-[14px] font-medium"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              className={cn(
                'placeholder:text-slateGray/70 h-[44px] border-b text-[15px]',
                lastNameError
                  ? 'border-b-errorRed text-actionDark focus-visible:border-b-errorRed'
                  : 'border-b-stoneEdge focus-visible:border-b-actionYellow',
              )}
            />
            {lastNameError && (
              <p className="font-dmsans text-errorRed animate-in fade-in mt-1.5 text-[12px] font-normal">
                {lastNameError}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="font-dmsans text-warmGray mb-1 block text-[14px] font-medium"
            >
              Phone Number
            </label>
            <div
              className={cn(
                'flex items-center border-b transition-colors',
                phoneError
                  ? 'border-b-errorRed focus-within:border-b-errorRed'
                  : 'border-b-stoneEdge focus-within:border-b-actionYellow',
              )}
            >
              <span className="font-dmsans text-actionDark pr-2.5 text-[15px] font-bold">+234</span>
              <div className="bg-stoneEdge mr-2.5 h-[18px] w-[1px]" />
              <Input
                id="phoneNumber"
                type="tel"
                inputMode="numeric"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => onPhoneNumberChange(e.target.value)}
                className="font-dmsans text-actionDark placeholder:text-slateGray/70 h-[44px] flex-1 border-none bg-transparent px-0 text-[15px] outline-none focus-visible:border-none focus-visible:ring-0"
              />
            </div>
            {phoneError ? (
              <p className="font-dmsans text-errorRed animate-in fade-in mt-1.5 text-[12px] font-normal">
                {phoneError}
              </p>
            ) : (
              <p className="font-dmsans text-slateGray mt-1.5 text-[12px]">
                We'll send a verification code to this number
              </p>
            )}
          </div>
        </form>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        <Button
          type="button"
          onClick={() => handleSubmit()}
          className={cn(
            'h-[56px] w-full rounded-[14px] text-[16px] font-medium text-white transition-colors duration-200',
            isFormComplete
              ? 'bg-actionDark hover:bg-actionDarkHover active:bg-actionDarkPressed cursor-pointer'
              : 'bg-stoneEdge hover:bg-stoneEdge active:bg-stoneEdge cursor-not-allowed text-white',
          )}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
