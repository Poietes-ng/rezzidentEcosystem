import { motion } from 'framer-motion'
import { NIGERIAN_STATES, NIGERIA_STATE_LGA_MAP } from '../../utils/nigeria-data'
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

export function EstateDetails({ registration }: Props) {
  const { form, errors, updateField } = registration

  return (
    <motion.div key="step1" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Fill in estate details
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm text-warmGray leading-relaxed">
        Provide your estate information below to get your community set up on Rezzident.
      </p>

      <div className="gap-web-md flex flex-col">
        {/* Estate Name */}
        <FormField
          id="estate-name"
          label="Estate Name"
          placeholder="Enter your estate name"
          value={form.estateName}
          onChange={(e) => updateField('estateName', e.target.value)}

          // shown when input is focused (active) → gold colour
          activeMessage="Type your estate's official registered name"

          // shown when the field has a value (filled) → green colour
          filledMessage=""

          // shown when there's a validation error → red colour + role="alert"
          errorMessage={errors.estateName}

          // shown when disabled → grey dimmed colour
          disabledMessage="This field cannot be edited"

          // fallback shown in the default/idle state → grey colour
          helperText="As it appears in official documents"
        />

        {/* Estate Address */}
        <FormField
          id="estate-address"
          label="Estate Address"
          type="text"
          placeholder="Enter your estate address"
          value={form.estateAddress}
          onChange={(e) => updateField('estateAddress', e.target.value)}
          errorMessage={errors.estateAddress}
        />

        {/* State Located — children mode (Select) */}
        <FormField
          id="state-located"
          label="State Located"
          errorMessage={errors.stateLocated}
          fieldState={errors.stateLocated ? 'error' : form.stateLocated ? 'filled' : 'default'}
          filledMessage=""
          helperText="The state your estate is located in"
        >
          <Select
            value={form.stateLocated}
            onValueChange={(val) => {
              updateField('stateLocated', val)
              updateField('lgaLocated', '')
            }}
          >
            <SelectTrigger id="state-located" error={!!errors.stateLocated}>
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
        </FormField>

        {/* LGA Located — children mode (Select, depends on state) */}
        <FormField
          id="lga-located"
          label="Local Government Area (LGA)"
          errorMessage={errors.lgaLocated}
          fieldState={
            errors.lgaLocated
              ? 'error'
              : !form.stateLocated
                ? 'disabled'
                : form.lgaLocated
                  ? 'filled'
                  : 'default'
          }
          disabledMessage="Select a state first"
          filledMessage=""
          helperText="The local government area within your state"
        >
          <Select
            value={form.lgaLocated}
            onValueChange={(val) => updateField('lgaLocated', val)}
            disabled={!form.stateLocated}
          >
            <SelectTrigger id="lga-located" error={!!errors.lgaLocated}>
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
        </FormField>
      </div>
    </motion.div>
  )
}
