import { useEffect, useRef } from 'react'
import {
  ALIAS_FREQUENT_RELATIONSHIPS,
  ALIAS_SELECT_RELATIONSHIPS,
} from '../../constants/relationships'
import type { ReactNode } from 'react'
import type { CreateAliasRelationshipStepProps } from '../../types/alias.types'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export function CreateAliasRelationshipStep({
  relationship,
  onRelationshipChange,
  onSelectOthers,
  onContinue,
}: CreateAliasRelationshipStepProps): ReactNode {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  function handleSelectValueChange(value: string): void {
    if (value === 'Others') {
      onSelectOthers()
      return
    }
    onRelationshipChange(value)
  }

  const hasSelection = relationship.trim().length > 0

  return (
    <div className="flex flex-1 flex-col">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-dmsans text-heading-2 text-actionDark mt-1 font-bold tracking-tight outline-none"
      >
        {'What\u2019s your relationship with the alias?'}
      </h2>
      <p className="font-dmsans text-body-base text-warmGray mt-2 font-normal">
        {"We'll use this to personalize their experience"}
      </p>

      {/* Relationship Select */}
      <div className="mt-8 flex flex-col">
        <label
          id="alias-relationship-label"
          htmlFor="alias-relationship-select"
          className="font-dmsans text-warmGray mb-1.5 block text-[14px] font-medium"
        >
          Relationship
        </label>
        <Select value={relationship} onValueChange={handleSelectValueChange}>
          <SelectTrigger
            id="alias-relationship-select"
            aria-labelledby="alias-relationship-label"
            className="border-b-stoneEdge data-[placeholder]:border-b-stoneEdge data-[placeholder]:text-slateGray"
          >
            <SelectValue placeholder="Select relationship">{relationship || undefined}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ALIAS_SELECT_RELATIONSHIPS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Frequently Used Chips */}
      <div className="mt-7 flex flex-col">
        <span
          id="frequently-used-heading"
          className="font-dmsans text-warmGray mb-3 text-[12px] font-medium tracking-wider uppercase"
        >
          FREQUENTLY USED
        </span>
        <div
          role="group"
          aria-labelledby="frequently-used-heading"
          className="flex flex-wrap gap-2.5"
        >
          {ALIAS_FREQUENT_RELATIONSHIPS.map((chip) => {
            const isSelected = relationship === chip
            return (
              <button
                key={chip}
                type="button"
                aria-pressed={isSelected}
                data-selected={isSelected ? 'true' : undefined}
                onClick={() => onRelationshipChange(chip)}
                className={cn(
                  'font-dmsans bg-offWhite text-actionDark border-stoneEdge hover:border-actionDark/40 focus-visible:ring-actionDark rounded-full border px-4 py-2 text-[14px] font-normal transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  isSelected && 'border-stoneEdge bg-offWhite font-medium',
                )}
              >
                {chip}
              </button>
            )
          })}
        </div>
      </div>

      {/* Continue button appears once a relationship is selected */}
      {hasSelection && (
        <div className="mt-8">
          <Button
            type="button"
            variant="primary"
            onClick={onContinue}
            className="w-full text-[16px] font-semibold"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  )
}
