import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
import type { EstateFormData, UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'
import { Input } from '#/shared/components/ui/input'
import { FileUpload } from '#/shared/components/ui/file-upload'
import { FieldError } from '#/shared/components/ui/field-error'

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
      <p className="mb-web-md font-dmsans text-web-sm leading-relaxed text-gray-500">
        Enter the name, phone number, email address, and NIN of 2 key stakeholders responsible for
        managing this estate.
      </p>

      <h3 className="font-dmsans text-web-base font-web-bold text-actionDark mb-4">
        Stakeholder {stakeholderNumber}
      </h3>
      <div className="flex flex-col gap-5">
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Full Name</label>
          <Input
            type="text"
            placeholder="Enter stakeholder's full name"
            value={form[nameKey] as string}
            onChange={(e) => updateField(nameKey, e.target.value as EstateFormData[typeof nameKey])}
            error={!!errors[nameKey]}
          />
          <FieldError message={errors[nameKey]} />
        </div>
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Phone Number</label>
          <div className="flex">
            <span className="inline-flex items-center border border-t-0 border-r-0 border-l-0 border-gray-300 bg-transparent px-3 whitespace-nowrap text-gray-500 sm:text-sm">
              +234
            </span>
            <Input
              type="tel"
              className="rounded-l-none"
              placeholder="Enter phone number"
              value={form[phoneKey] as string}
              onChange={(e) =>
                updateField(phoneKey, e.target.value as EstateFormData[typeof phoneKey])
              }
              error={!!errors[phoneKey]}
            />
          </div>
          <FieldError message={errors[phoneKey]} />
        </div>
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Email Address</label>
          <Input
            type="email"
            placeholder="Enter email address"
            value={form[emailKey] as string}
            onChange={(e) =>
              updateField(emailKey, e.target.value as EstateFormData[typeof emailKey])
            }
            error={!!errors[emailKey]}
          />
          <FieldError message={errors[emailKey]} />
        </div>
        <FileUpload
          label="Upload NIN"
          title="National Identification Number (NIN)"
          description="Upload a clear image of your NIN slip or card for verification. PDF, JPG & PNG · Max 5MB"
          value={form[ninKey] as File | null}
          onChange={(file) => updateField(ninKey, file as EstateFormData[typeof ninKey])}
        />
      </div>
    </motion.div>
  )
}
