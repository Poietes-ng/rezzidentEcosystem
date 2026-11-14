import { useEffect, useRef } from 'react'
import { colors } from '@rezzident/design-tokens'
import { formatAliasPhoneDisplay } from '../../utils/aliasPhone'
import type { FormEvent, ReactNode } from 'react'
import type { CreateAliasNameStepProps } from '../../types/alias.types'
import { Button, Input, PhoneInput } from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export function CreateAliasNameStep({
  firstName,
  lastName,
  phoneDigits,
  firstNameError,
  lastNameError,
  phoneError,
  isCheckingPhone,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onSubmit,
}: CreateAliasNameStepProps): ReactNode {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const isFormFilled =
    firstName.trim().length > 0 && lastName.trim().length > 0 && phoneDigits.length > 0

  const formattedPhone = formatAliasPhoneDisplay(phoneDigits)

  function handleFormSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (!isFormFilled || isCheckingPhone) return
    onSubmit()
  }

  return (
    <form onSubmit={handleFormSubmit} noValidate className="flex flex-1 flex-col justify-between">
      <div className="flex flex-col">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-dmsans text-heading-2 text-actionDark mt-1 font-bold tracking-tight outline-none"
        >
          {'What\u2019s the alias name?'}
        </h2>
        <p className="font-dmsans text-body-base text-warmGray mt-2 font-normal">
          {"We'll use this to personalize their experience"}
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {/* First Name */}
          <div className="flex flex-col">
            <label
              htmlFor="alias-first-name"
              className="font-dmsans text-warmGray mb-1.5 block text-[14px] font-medium"
            >
              First Name
            </label>
            <Input
              id="alias-first-name"
              type="text"
              placeholder={'Enter alias\u2019s first name'}
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              error={Boolean(firstNameError)}
              filled={firstName.trim().length > 0}
              inputStyle={{
                placeholderTransform: 'none',
                borderColor: colors.stoneEdge,
                errorTextColor: colors.actionDark,
              }}
              aria-invalid={firstNameError ? 'true' : undefined}
              aria-describedby={firstNameError ? 'alias-first-name-error' : undefined}
            />
            {firstNameError && (
              <p
                id="alias-first-name-error"
                role="alert"
                className="font-dmsans text-errorRed mt-1.5 text-[12px] leading-tight font-normal"
              >
                {firstNameError}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label
              htmlFor="alias-last-name"
              className="font-dmsans text-warmGray mb-1.5 block text-[14px] font-medium"
            >
              Last Name
            </label>
            <Input
              id="alias-last-name"
              type="text"
              placeholder={'Enter alias\u2019s last name'}
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              error={Boolean(lastNameError)}
              filled={lastName.trim().length > 0}
              inputStyle={{
                placeholderTransform: 'none',
                borderColor: colors.stoneEdge,
                errorTextColor: colors.actionDark,
              }}
              aria-invalid={lastNameError ? 'true' : undefined}
              aria-describedby={lastNameError ? 'alias-last-name-error' : undefined}
            />
            {lastNameError && (
              <p
                id="alias-last-name-error"
                role="alert"
                className="font-dmsans text-errorRed mt-1.5 text-[12px] leading-tight font-normal"
              >
                {lastNameError}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label
              htmlFor="alias-phone-number"
              className="font-dmsans text-warmGray mb-1.5 block text-[14px] font-medium"
            >
              Phone Number
            </label>
            <PhoneInput
              id="alias-phone-number"
              placeholder="Enter phone number"
              value={formattedPhone}
              onChange={(e) => onPhoneChange(e.target.value)}
              error={Boolean(phoneError)}
              filled={phoneDigits.length > 0}
              aria-describedby="alias-phone-number-msg"
            />
            {phoneError ? (
              <p
                id="alias-phone-number-msg"
                role="alert"
                className="font-dmsans text-errorRed mt-1.5 text-[12px] leading-tight font-normal"
              >
                {phoneError}
              </p>
            ) : (
              <p
                id="alias-phone-number-msg"
                className="font-dmsans text-mutedOlive mt-2 text-[12px] leading-relaxed font-normal"
              >
                We'll send a verification code to this number during the alias sign in.
              </p>
            )}
          </div>
        </div>

        {/* Continue CTA */}
        <div className="mt-8">
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormFilled}
            aria-disabled={!isFormFilled || isCheckingPhone}
            loading={isCheckingPhone}
            className={cn('w-full text-[16px] font-semibold')}
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Terms & Privacy Policy footer */}
      <p className="font-dmsans text-warmGray pt-10 pb-2 text-center text-[12px] font-normal">
        By continuing, you agree to our{' '}
        <span className="text-warmGray underline underline-offset-2">Terms</span> &amp;{' '}
        <span className="text-warmGray underline underline-offset-2">Privacy Policy</span>
      </p>
    </form>
  )
}
