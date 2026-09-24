import { useState } from 'react'
import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
import type { EstateFormData, UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'
import { FormField } from '#/shared/components/ui/form-field'
import { Input } from '#/shared/components/ui/input'
import { cn } from '#/shared/utils/cn'
import { FileUpload } from '#/shared/components/ui/file-upload'

interface Props {
  registration: UseRegistrationFormReturn
  stakeholderNumber: 1 | 2
}

export function Stakeholder({ registration, stakeholderNumber }: Props) {
  const { form, errors, updateField } = registration

  const nameKey = `stakeholder${stakeholderNumber}Name` as keyof EstateFormData
  const phoneKey = `stakeholder${stakeholderNumber}Phone` as keyof EstateFormData
  const emailKey = `stakeholder${stakeholderNumber}Email` as keyof EstateFormData
  const ninKey = `stakeholder${stakeholderNumber}Nin` as keyof EstateFormData

  // The phone row has a +234 prefix, so it renders <Input> itself (children mode)
  // and we track focus here to drive the gold "active" message.
  const [phoneFocused, setPhoneFocused] = useState(false)
  const phoneId = `stakeholder-${stakeholderNumber}-phone`
  const phoneError = errors[phoneKey]
  const phoneValue = form[phoneKey] as string
  const phoneState = phoneError
    ? 'error'
    : phoneFocused
      ? 'active'
      : phoneValue
        ? 'filled'
        : 'default'

  return (
    <motion.div
      key={`step${stakeholderNumber === 1 ? 6 : 7}`}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Management details
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm text-warmGray leading-relaxed">
        Enter the name, phone number, email address, and NIN of 2 key stakeholders responsible for
        managing this estate.
      </p>

      <h3 className="font-dmsans text-web-base font-web-bold text-actionDark mb-4">
        Stakeholder {stakeholderNumber}
      </h3>

      <div className="flex flex-col gap-5">
        {/* Full Name — Input mode */}
        <FormField
          id={`stakeholder-${stakeholderNumber}-name`}
          label="Full Name"
          type="text"
          placeholder="Enter stakeholder's full name"
          value={form[nameKey] as string}
          onChange={(e) => updateField(nameKey, e.target.value as EstateFormData[typeof nameKey])}
          errorMessage={errors[nameKey]}
          activeMessage="Enter the stakeholder's legal full name"
          helperText="As it appears on their government-issued ID"
        />

        {/* Phone Number — children mode (+234 prefix + Input) */}
        <FormField
          id={phoneId}
          label="Phone Number"
          errorMessage={phoneError}
          fieldState={phoneState}
          activeMessage="Enter 10-digit number without the leading zero"
          filledMessage=""
          helperText="Nigerian mobile number, e.g. 8012345678"
        >
          <div className="flex items-stretch">
            <span
              className={cn(
                'font-dmsans text-body-base inline-flex items-center border-b px-0 pr-3 whitespace-nowrap text-gray-500 transition-colors',
                phoneError
                  ? 'border-b-errorRed'
                  : phoneFocused
                    ? 'border-b-actionYellow'
                    : 'border-b-gray-200',
              )}
            >
              +234
            </span>
            <Input
              id={phoneId}
              type="tel"
              placeholder="Enter phone number"
              value={phoneValue}
              onChange={(e) =>
                updateField(phoneKey, e.target.value as EstateFormData[typeof phoneKey])
              }
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              error={Boolean(phoneError)}
              filled={Boolean(phoneValue)}
              aria-describedby={`${phoneId}-msg`}
              aria-invalid={phoneError ? 'true' : undefined}
              className="min-w-0 flex-1"
            />
          </div>
        </FormField>

        {/* Email Address — Input mode */}
        <FormField
          id={`stakeholder-${stakeholderNumber}-email`}
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          value={form[emailKey] as string}
          onChange={(e) => updateField(emailKey, e.target.value as EstateFormData[typeof emailKey])}
          errorMessage={errors[emailKey]}
          activeMessage="We'll use this to send important estate notifications"
          helperText="Must be an active email address"
        />

        {/* NIN Upload — children mode (FileUpload) */}
        <FormField
          id={`stakeholder-${stakeholderNumber}-nin`}
          label="Upload NIN"
          errorMessage={errors[ninKey]}
          fieldState={errors[ninKey] ? 'error' : form[ninKey] ? 'filled' : 'default'}
          filledMessage="NIN document uploaded successfully"
          helperText="PDF, JPG & PNG · Max 5MB"
        >
          <FileUpload
            title="National Identification Number (NIN)"
            description="Upload a clear image of your NIN slip or card for verification. PDF, JPG & PNG · Max 5MB"
            value={form[ninKey] as File | null}
            onChange={(file) => updateField(ninKey, file as EstateFormData[typeof ninKey])}
            error={errors[ninKey]}
          />
        </FormField>
      </div>
    </motion.div>
  )
}
