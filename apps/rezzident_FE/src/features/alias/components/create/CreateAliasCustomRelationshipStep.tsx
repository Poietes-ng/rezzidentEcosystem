import { useEffect, useRef } from 'react'
import { colors } from '@rezzident/design-tokens'
import { CUSTOM_RELATIONSHIP_MAX_LENGTH } from '../../constants/relationships'
import type { FormEvent, ReactNode } from 'react'
import type { CreateAliasCustomRelationshipStepProps } from '../../types/alias.types'
import { Button, Input } from '#/shared/components/ui'

export function CreateAliasCustomRelationshipStep({
  customRelationship,
  onCustomRelationshipChange,
  onContinue,
}: CreateAliasCustomRelationshipStepProps): ReactNode {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const trimmed = customRelationship.trim()
  const isValid = trimmed.length > 0 && trimmed.length <= CUSTOM_RELATIONSHIP_MAX_LENGTH

  function handleFormSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (!isValid) return
    onContinue()
  }

  return (
    <form onSubmit={handleFormSubmit} noValidate className="flex flex-1 flex-col">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-dmsans text-heading-2 text-actionDark mt-1 font-bold tracking-tight outline-none"
      >
        Enter custom relationship
      </h2>
      <p className="font-dmsans text-body-base text-warmGray mt-2 font-normal">
        Describe how this alias is related to you
      </p>

      <div className="mt-8 flex flex-col">
        <label
          htmlFor="alias-custom-relationship"
          className="font-dmsans text-warmGray mb-1.5 block text-[14px] font-medium"
        >
          Relationship
        </label>
        <Input
          id="alias-custom-relationship"
          type="text"
          placeholder="e.g. Driver, Nanny, Guardian"
          maxLength={CUSTOM_RELATIONSHIP_MAX_LENGTH}
          value={customRelationship}
          onChange={(e) => onCustomRelationshipChange(e.target.value)}
          filled={isValid}
          inputStyle={{
            placeholderTransform: 'none',
            borderColor: colors.stoneEdge,
          }}
        />
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
          aria-disabled={!isValid}
          className="w-full text-[16px] font-semibold"
        >
          Continue
        </Button>
      </div>
    </form>
  )
}
