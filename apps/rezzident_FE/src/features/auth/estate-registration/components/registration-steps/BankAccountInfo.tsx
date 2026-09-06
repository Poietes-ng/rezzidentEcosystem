import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
import { NIGERIAN_BANKS } from '../../hooks/useRegistrationForm'
import type { UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'
import { Input } from '#/shared/components/ui/input'
import { FieldError } from '#/shared/components/ui/field-error'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '#/shared/components/ui/select'

interface Props {
  registration: UseRegistrationFormReturn
}

export function BankAccountInfo({ registration }: Props) {
  const { form, errors, updateField } = registration

  return (
    <motion.div key="step5" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Bank account info
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm leading-relaxed text-gray-500">
        Provide your estate information below to get your community set up on Rezzident.
      </p>

      <div className="flex flex-col gap-5">
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Account Number</label>
          <Input
            type="text"
            placeholder="Enter your account number"
            maxLength={10}
            value={form.bankAccountNumber}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '')
              updateField('bankAccountNumber', digits)
            }}
            error={!!errors.bankAccountNumber}
          />
          <FieldError message={errors.bankAccountNumber} />
        </div>
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Bank Name</label>
          <Select value={form.bankName} onValueChange={(val) => updateField('bankName', val)}>
            <SelectTrigger error={!!errors.bankName}>
              <SelectValue placeholder="Select bank" />
            </SelectTrigger>
            <SelectContent>
              {NIGERIAN_BANKS.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.bankName} />
        </div>
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Account Name</label>
          <Input
            type="text"
            placeholder="Enter your account name"
            value={form.bankAccountName}
            onChange={(e) => updateField('bankAccountName', e.target.value)}
            error={!!errors.bankAccountName}
          />
          <FieldError message={errors.bankAccountName} />
        </div>
      </div>
    </motion.div>
  )
}
