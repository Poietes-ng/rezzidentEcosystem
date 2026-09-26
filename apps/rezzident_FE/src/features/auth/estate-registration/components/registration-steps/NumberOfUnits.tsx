import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
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

const UNIT_OPTIONS = ['200', '300', '400', '500', '600', '800', '900', '1000', 'Custom']

export function NumberOfUnits({ registration }: Props) {
  const { form, errors, updateField } = registration

  return (
    <motion.div key="step4" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Number of units
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm text-warmGray leading-relaxed">
        Specify the number of units available in your estate.
      </p>

      <div className="flex flex-col gap-5">
        {/* Number of Units — children mode (Select) */}
        <FormField
          id="number-of-units"
          label="Number of Units"
          errorMessage={errors.numberOfUnits}
          fieldState={errors.numberOfUnits ? 'error' : form.numberOfUnits ? 'filled' : 'default'}
          filledMessage={
            form.numberOfUnits === 'Custom' ? 'Enter the exact number of units below' : ''
          }
          helperText="Choose Custom if your estate's total isn't listed"
        >
          <Select
            value={form.numberOfUnits}
            onValueChange={(val) => {
              updateField('numberOfUnits', val)
              if (val !== 'Custom') updateField('customNumberOfUnits', '')
            }}
          >
            <SelectTrigger id="number-of-units" error={!!errors.numberOfUnits}>
              <SelectValue placeholder="Select number of units" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* Custom Units — Input mode */}
        {form.numberOfUnits === 'Custom' && (
          <FormField
            id="custom-number-of-units"
            label="Custom Units"
            type="number"
            min="1"
            placeholder="Enter custom units"
            value={form.customNumberOfUnits}
            onChange={(e) => updateField('customNumberOfUnits', e.target.value)}
            errorMessage={errors.customNumberOfUnits}
            activeMessage="Enter the exact number of units in your estate"
            filledMessage=""
            helperText="Whole number, at least 1"
          />
        )}
      </div>
    </motion.div>
  )
}
