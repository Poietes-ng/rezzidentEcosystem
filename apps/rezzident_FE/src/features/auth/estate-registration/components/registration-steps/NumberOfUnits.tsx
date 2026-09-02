import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
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

export function NumberOfUnits({ registration }: Props) {
  const { form, errors, updateField } = registration

  return (
    <motion.div key="step4" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Number of units
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm leading-relaxed text-gray-500">
        Specify the number of units available in your estate.
      </p>

      <div>
        <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Number of Units</label>
        <Select
          value={form.numberOfUnits}
          onValueChange={(val) => {
            updateField('numberOfUnits', val)
            if (val !== 'Custom') updateField('customNumberOfUnits', '')
          }}
        >
          <SelectTrigger error={!!errors.numberOfUnits}>
            <SelectValue placeholder="Select number of units" />
          </SelectTrigger>
          <SelectContent>
            {['200', '300', '400', '500', '600', '800', '900', '1000', 'Custom'].map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={errors.numberOfUnits} />
      </div>

      {form.numberOfUnits === 'Custom' && (
        <div className="mt-5">
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Custom Units</label>
          <Input
            type="number"
            min="1"
            placeholder="Enter custom units"
            value={form.customNumberOfUnits}
            onChange={(e) => updateField('customNumberOfUnits', e.target.value)}
            error={!!errors.customNumberOfUnits}
          />
          <FieldError message={errors.customNumberOfUnits} />
        </div>
      )}
    </motion.div>
  )
}
