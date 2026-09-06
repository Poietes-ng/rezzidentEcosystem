import { motion } from 'framer-motion'
import { NIGERIAN_STATES, NIGERIA_STATE_LGA_MAP } from '../../utils/nigeria-data'
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

export function EstateDetails({ registration }: Props) {
  const { form, errors, updateField } = registration

  return (
    <motion.div key="step1" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Fill in estate details
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm leading-relaxed text-gray-500">
        Provide your estate information below to get your community set up on Rezzident.
      </p>

      <div className="gap-web-md flex flex-col">
        {/* Estate Name */}
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Estate Name</label>
          <Input
            type="text"
            placeholder="Enter your estate name"
            value={form.estateName}
            onChange={(e) => updateField('estateName', e.target.value)}
            error={!!errors.estateName}
          />
          <FieldError message={errors.estateName} />
        </div>

        {/* Estate Address */}
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">Estate Address</label>
          <Input
            type="text"
            placeholder="Enter your estate address"
            value={form.estateAddress}
            onChange={(e) => updateField('estateAddress', e.target.value)}
            error={!!errors.estateAddress}
          />
          <FieldError message={errors.estateAddress} />
        </div>

        {/* State Located */}
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">State Located</label>
          <Select
            value={form.stateLocated}
            onValueChange={(val) => {
              updateField('stateLocated', val)
              updateField('lgaLocated', '')
            }}
          >
            <SelectTrigger error={!!errors.stateLocated}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {NIGERIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.stateLocated} />
        </div>

        {/* LGA Located */}
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">
            Local Government Area (LGA)
          </label>
          <Select
            value={form.lgaLocated}
            onValueChange={(val) => updateField('lgaLocated', val)}
            disabled={!form.stateLocated}
          >
            <SelectTrigger error={!!errors.lgaLocated}>
              <SelectValue placeholder="Select LGA" />
            </SelectTrigger>
            <SelectContent>
              {form.stateLocated &&
                (NIGERIA_STATE_LGA_MAP[form.stateLocated] ?? []).map((lga) => (
                  <SelectItem key={lga} value={lga}>
                    {lga}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.lgaLocated} />
        </div>
      </div>
    </motion.div>
  )
}
