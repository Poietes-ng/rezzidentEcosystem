import { motion } from 'framer-motion'
import { pageVariants } from '../../hooks/animation'
import type { UseRegistrationFormReturn } from '../../hooks/useRegistrationForm'
import { FormField } from '#/shared/components/ui/form-field'
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

const LEVEL_OPTIONS = [1, 2, 3, 4, 5, 6]

/** Truncates text in the middle, e.g. "District, Phase…Unit Number" */
function truncateMiddle(text: string, maxLength = 32): string {
  if (text.length <= maxLength) return text

  const keep = maxLength - 1 // -1 for the ellipsis char
  const front = Math.ceil(keep / 2)
  const back = Math.floor(keep / 2)

  return `${text.slice(0, front)}…${text.slice(text.length - back)}`
}

export function StructureSelection({ registration }: Props) {
  const { form, errors, updateField, structureTemplates, isLoadingTemplates } = registration

  const templatesDisabled = !form.levelStructure || isLoadingTemplates
  const selectedTemplate = structureTemplates.find((t) => t.template_id === form.estateStructure)

  return (
    <motion.div
      key="step3"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className=""
    >
      <h1 className="font-dmsans text-web-h3 font-web-bold text-actionDark mb-2">
        Naming structure
      </h1>
      <p className="mb-web-md font-dmsans text-web-sm text-warmGray leading-relaxed">
        Define how streets, blocks, and units are labeled within your estate.
      </p>

      <div className="gap-web-md flex w-full flex-col">
        {/* Level Structure — children mode (Select) */}
        <FormField
          id="level-structure"
          label="Level Structure"
          errorMessage={errors.levelStructure}
          fieldState={errors.levelStructure ? 'error' : form.levelStructure ? 'filled' : 'default'}
          filledMessage=""
          helperText="How many levels your streets, blocks and units are split into"
        >
          <Select
            value={form.levelStructure}
            onValueChange={(val) => {
              updateField('levelStructure', val)
              updateField('estateStructure', '') // Reset — templates change per level
            }}
          >
            <SelectTrigger id="level-structure" error={!!errors.levelStructure}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {LEVEL_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} Level Structure
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* Estate Structure — children mode (SearchableSelect) */}
        <FormField
          id="estate-structure"
          label="Estate Structure"
          errorMessage={errors.estateStructure}
          fieldState={
            errors.estateStructure
              ? 'error'
              : templatesDisabled
                ? 'disabled'
                : form.estateStructure
                  ? 'filled'
                  : 'default'
          }
          disabledMessage={
            isLoadingTemplates ? 'Loading available structures…' : 'Select a level structure first'
          }
          // Example address for the chosen template (empty string hides the message)
          filledMessage={
            selectedTemplate
              ? `Example: ${selectedTemplate.example_address.replace(/^[^,]+/, form.estateName.trim() || 'Your Estate')}`
              : ''
          }
          helperText="Pick the naming format that matches your estate"
        >
          <div className="w-full min-w-0">
            <SearchableSelect
              value={form.estateStructure}
              onValueChange={(val) => updateField('estateStructure', val)}
              disabled={templatesDisabled}
              error={!!errors.estateStructure}
              placeholder={isLoadingTemplates ? 'Loading...' : 'Select structure'}
              searchPlaceholder="Search"
              options={structureTemplates.map((tpl) => ({
                value: tpl.template_id,
                label: truncateMiddle(tpl.structure),
                // Full text kept available for anything that wants the untruncated value
                fullLabel: tpl.structure,
              }))}
              className="w-full min-w-0"
            />
          </div>
        </FormField>
      </div>
    </motion.div>
  )
}
