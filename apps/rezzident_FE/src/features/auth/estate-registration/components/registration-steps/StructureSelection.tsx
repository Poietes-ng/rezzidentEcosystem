import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
import type { UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'
import { FieldError } from '#/shared/components/ui/field-error'
import { SearchableSelect } from '#/shared/components/ui/searchable-select'
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

export function StructureSelection({ registration }: Props) {
  const { form, errors, updateField, structureTemplates, isLoadingTemplates } = registration

  return (
    <motion.div key="step3" variants={pageVariants} initial="enter" animate="center" exit="exit">
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Naming structure
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm leading-relaxed text-gray-500">
        Define how streets, blocks, and units are labeled within your estate.
      </p>

      <div className="gap-web-md flex flex-col">
        {/* Level Structure */}
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">
            Level Structure
          </label>
          <Select
            value={form.levelStructure}
            onValueChange={(val) => {
              updateField('levelStructure', val)
              updateField('estateStructure', '') // Reset — templates change per level
            }}
          >
            <SelectTrigger error={!!errors.levelStructure}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Level Structure</SelectItem>
              <SelectItem value="2">2 Level Structure</SelectItem>
              <SelectItem value="3">3 Level Structure</SelectItem>
              <SelectItem value="4">4 Level Structure</SelectItem>
              <SelectItem value="5">5 Level Structure</SelectItem>
              <SelectItem value="6">6 Level Structure</SelectItem>
            </SelectContent>
          </Select>
          <FieldError message={errors.levelStructure} />
        </div>

        {/* Estate Structure */}
        <div>
          <label className="font-dmsans text-web-sm mb-2 block text-gray-500">
            Estate Structure
          </label>
          <SearchableSelect
            value={form.estateStructure}
            onValueChange={(val) => updateField('estateStructure', val)}
            disabled={!form.levelStructure || isLoadingTemplates}
            error={!!errors.estateStructure}
            placeholder={isLoadingTemplates ? 'Loading...' : 'Select structure'}
            searchPlaceholder="Search"
            options={structureTemplates.map((tpl) => ({
              value: tpl.template_id,
              label: tpl.structure,
            }))}
          />
          {/* Show example address for selected template */}
          {form.estateStructure &&
            (() => {
              const selected = structureTemplates.find(
                (t) => t.template_id === form.estateStructure,
              )
              return selected ? (
                <p className="font-dmsans mt-2 text-[11px] text-gray-400">
                  <span className="font-medium">Example:</span> {selected.example_address}
                </p>
              ) : null
            })()}
          <FieldError message={errors.estateStructure} />
        </div>
      </div>
    </motion.div>
  )
}
