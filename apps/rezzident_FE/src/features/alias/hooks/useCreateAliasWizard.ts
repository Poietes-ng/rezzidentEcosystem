import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  DEFAULT_CREATE_PERMISSIONS,
  MAX_ALIAS_LIMIT,
  NAME_ERROR_MESSAGE,
  PHONE_INVALID_MESSAGE,
  PHONE_REGISTERED_MESSAGE,
  getLogicalStep,
} from '../constants/createWizard'
import { isValidAliasPhone, sanitizeAliasPhoneDigits } from '../utils/aliasPhone'
import { useAliases } from './useAliases'
import { useCheckAliasPhone } from './useCheckAliasPhone'
import { useCreateAlias } from './useCreateAlias'
import type { CreateWizardSubStep, UseCreateAliasWizardReturn } from '../constants/createWizard'
import type { AliasMember, AliasPermissions } from '../types/alias.types'

export type { CreateWizardSubStep, UseCreateAliasWizardReturn }
export { getLogicalStep }

export function useCreateAliasWizard(): UseCreateAliasWizardReturn {
  const navigate = useNavigate()
  const { data: aliasListData } = useAliases(false)
  const { checkPhone, isCheckingPhone } = useCheckAliasPhone()
  const { createAliasAccount, isCreatingAlias } = useCreateAlias()

  const [subStep, setSubStep] = useState<CreateWizardSubStep>('name')
  const [usedCustomRelationship, setUsedCustomRelationship] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [relationship, setRelationship] = useState('')
  const [customRelationship, setCustomRelationship] = useState('')
  const [permissions, setPermissions] = useState<AliasPermissions>({
    ...DEFAULT_CREATE_PERMISSIONS,
  })
  const [createdMember, setCreatedMember] = useState<AliasMember | null>(null)
  const [firstNameError, setFirstNameError] = useState<string | null>(null)
  const [lastNameError, setLastNameError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const isSubmittingRef = useRef(false)
  const hasCreatedRef = useRef(false)

  useEffect(() => {
    if (
      subStep !== 'success' &&
      !hasCreatedRef.current &&
      aliasListData &&
      aliasListData.members.length >= MAX_ALIAS_LIMIT
    ) {
      void navigate({ to: '/alias', replace: true })
    }
  }, [aliasListData, navigate, subStep])

  useEffect(() => {
    if (subStep !== 'success' || typeof window === 'undefined') return
    const onPopState = (): void => {
      void navigate({ to: '/alias', replace: true })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [navigate, subStep])

  function handleDone(): void {
    void navigate({ to: '/alias', replace: true })
  }

  function handleBack(): void {
    if (subStep === 'success') return handleDone()
    if (subStep === 'permissions') {
      return setSubStep(usedCustomRelationship ? 'custom-relationship' : 'relationship')
    }
    if (subStep === 'custom-relationship') return setSubStep('relationship')
    if (subStep === 'relationship') return setSubStep('name')
    void navigate({ to: '/alias' })
  }

  function handleFirstNameChange(value: string): void {
    setFirstName(value)
    if (firstNameError) setFirstNameError(null)
  }

  function handleLastNameChange(value: string): void {
    setLastName(value)
    if (lastNameError) setLastNameError(null)
  }

  function handlePhoneChange(rawValue: string): void {
    setPhoneDigits(sanitizeAliasPhoneDigits(rawValue))
    if (phoneError) setPhoneError(null)
  }

  function handlePermissionChange(key: keyof AliasPermissions, value: boolean): void {
    setPermissions((prev) => ({ ...prev, [key]: value }))
  }

  async function handleStep1Submit(): Promise<void> {
    if (isSubmittingRef.current || isCheckingPhone) return
    const isFirstValid = firstName.trim().length >= 2
    const isLastValid = lastName.trim().length >= 2
    setFirstNameError(isFirstValid ? null : NAME_ERROR_MESSAGE)
    setLastNameError(isLastValid ? null : NAME_ERROR_MESSAGE)
    if (!isValidAliasPhone(phoneDigits)) {
      setPhoneError(PHONE_INVALID_MESSAGE)
      return
    }
    isSubmittingRef.current = true
    try {
      const result = await checkPhone(phoneDigits)
      if (result.exists) {
        setPhoneError(PHONE_REGISTERED_MESSAGE)
        return
      }
      setPhoneError(null)
      if (isFirstValid && isLastValid) setSubStep('relationship')
    } finally {
      isSubmittingRef.current = false
    }
  }

  function handleOpenCustomRelationship(): void {
    setSubStep('custom-relationship')
  }

  function handleRelationshipContinue(): void {
    if (!relationship.trim()) return
    setUsedCustomRelationship(false)
    setSubStep('permissions')
  }

  function handleCustomRelationshipContinue(): void {
    const trimmed = customRelationship.trim()
    if (!trimmed) return
    setRelationship(trimmed)
    setUsedCustomRelationship(true)
    setSubStep('permissions')
  }

  async function handleCreateAliasSubmit(): Promise<void> {
    if (isSubmittingRef.current || isCreatingAlias || hasCreatedRef.current) {
      return
    }
    isSubmittingRef.current = true
    try {
      const created = await createAliasAccount({
        firstName,
        lastName,
        phoneNumber: phoneDigits,
        relationship,
        permissions,
      })
      hasCreatedRef.current = true
      setCreatedMember(created)
      setSubStep('success')
    } finally {
      isSubmittingRef.current = false
    }
  }

  return {
    subStep,
    logicalStep: getLogicalStep(subStep),
    firstName,
    lastName,
    phoneDigits,
    relationship,
    customRelationship,
    permissions,
    createdMember,
    firstNameError,
    lastNameError,
    phoneError,
    isCheckingPhone,
    isCreatingAlias,
    setRelationship,
    setCustomRelationship,
    handlePermissionChange,
    handleBack,
    handleDone,
    handleFirstNameChange,
    handleLastNameChange,
    handlePhoneChange,
    handleStep1Submit,
    handleOpenCustomRelationship,
    handleRelationshipContinue,
    handleCustomRelationshipContinue,
    handleCreateAliasSubmit,
  }
}
