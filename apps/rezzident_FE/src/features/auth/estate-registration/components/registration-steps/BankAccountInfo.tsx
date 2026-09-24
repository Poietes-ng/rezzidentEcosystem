import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
import { NIGERIAN_BANKS } from '../../hooks/useRegistrationForm'
import type { UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'
import { FormField } from '#/shared/components/ui/form-field'
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
        Provide your estate bank account details below.
      </p>

      <div className="flex flex-col gap-5">
        {/* Account Number — Input mode */}
        <FormField
          id="bank-account-number"
          label="Account Number"
          type="text"
          placeholder="Enter your account number"
          maxLength={10}
          value={form.bankAccountNumber}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '')
            updateField('bankAccountNumber', digits)
          }}
          errorMessage={errors.bankAccountNumber}
          activeMessage="Enter your 10-digit NUBAN account number"
          helperText="10 digits, numbers only"
        />

        {/* Bank Name — children mode (Select) */}
        <FormField
          id="bank-name"
          label="Bank Name"
          errorMessage={errors.bankName}
          fieldState={errors.bankName ? 'error' : form.bankName ? 'filled' : 'default'}
          filledMessage={form.bankName ? `${form.bankName} selected` : ''}
          helperText="Select the bank that holds your estate account"
        >
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
        </FormField>

        {/* Account Name — Input mode */}
        <FormField
          id="bank-account-name"
          label="Account Name"
          type="text"
          placeholder="Enter your account name"
          value={form.bankAccountName}
          onChange={(e) => updateField('bankAccountName', e.target.value)}
          errorMessage={errors.bankAccountName}
          filledMessage=""
          helperText="As it appears on your bank statement"
        />
      </div>
    </motion.div>
  )
}
