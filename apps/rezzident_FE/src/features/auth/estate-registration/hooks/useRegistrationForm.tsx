import { useNavigate } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { registerEstate, fetchStructureTemplates } from '../api/estate'
import { INITIAL_FORM } from '../types/reg-form.types'
import { subStepToLogical, validateStep } from '../types/reg-validation.type'
import type React from 'react'
import type { StructureTemplate } from '../api/estate'
import type { EstateFormData, FieldErrors } from '../types/reg-form.types'

export type { EstateFormData, FieldErrors } from '../types/reg-form.types'
export { NIGERIAN_BANKS, STRUCTURE_PAGES } from '../types/reg-form.types'

export function useRegistrationForm() {
  const navigate = useNavigate()
  const [subStep, setSubStep] = useState(1)
  const [form, setForm] = useState<EstateFormData>(INITIAL_FORM)
  const [structurePage, setStructurePage] = useState(0)
  const [showRedirect, setShowRedirect] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [structureTemplates, setStructureTemplates] = useState<StructureTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)

  const logicalStep = subStepToLogical(subStep)
  const totalLogicalSteps = 4

  const updateField = useCallback(
    <TKey extends keyof EstateFormData>(key: TKey, value: EstateFormData[TKey]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
      // Clear the specific field error when user edits it
      setErrors((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
      setSubmitError('')
    },
    [],
  )

  /* ── Fetch structure templates when level changes ── */

  useEffect(() => {
    if (!form.levelStructure) {
      setStructureTemplates([])
      return
    }

    const levelCount = parseInt(form.levelStructure, 10)
    if (isNaN(levelCount)) return

    setIsLoadingTemplates(true)
    fetchStructureTemplates(levelCount)
      .then((res) => {
        setStructureTemplates(res.data)
      })
      .catch(() => {
        // Silently fail — user can still proceed
        setStructureTemplates([])
      })
      .finally(() => setIsLoadingTemplates(false))
  }, [form.levelStructure])

  /* ── Backend submission ── */

  async function handleSubmitRegistration() {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const units =
        form.numberOfUnits === 'Custom'
          ? parseInt(form.customNumberOfUnits, 10)
          : parseInt(form.numberOfUnits, 10)

      await registerEstate({
        name: form.estateName.trim(),
        address: form.estateAddress.trim(),
        state: form.stateLocated,
        local_government: form.lgaLocated,
        management_type: 'community',
        structure_template_id: form.estateStructure || null,
        number_of_units: isNaN(units) ? null : units,
        settlement_account_number: form.bankAccountNumber.trim() || null,
        settlement_bank_name: form.bankName || null,
        settlement_account_name: form.bankAccountName.trim() || null,
        stakeholders: [
          {
            full_name: form.stakeholder1Name.trim(),
            phone_number: `+234${form.stakeholder1Phone.replace(/\s/g, '')}`,
            email: form.stakeholder1Email.trim(),
            role_title: 'stakeholder',
            is_primary: true,
          },
          {
            full_name: form.stakeholder2Name.trim(),
            phone_number: `+234${form.stakeholder2Phone.replace(/\s/g, '')}`,
            email: form.stakeholder2Email.trim(),
            role_title: 'stakeholder',
            is_primary: false,
          },
        ],
      })

      // Move to step 8 (import residents — optional)
      setSubStep(8)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Navigation ── */

  function handleNext() {
    const stepErrors = validateStep(subStep, form)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})

    // At step 7 (last required step), submit to backend
    if (subStep === 7) {
      handleSubmitRegistration()
      return
    }

    if (subStep < 9) {
      setSubStep((s) => s + 1)
    }
  }

  function handleBack() {
    setErrors({})
    setSubmitError('')
    if (subStep > 1) {
      setSubStep((s) => s - 1)
    } else {
      navigate({ to: '/registration-criteria' })
    }
  }

  /* ── Redirect after success ── */

  useEffect(() => {
    if (subStep === 9) {
      const overlayTimer = setTimeout(() => {
        setShowRedirect(true)
        const navTimer = setTimeout(() => {
          navigate({ to: '/app/splash' })
        }, 1500)
        return () => clearTimeout(navTimer)
      }, 3000)
      return () => clearTimeout(overlayTimer)
    }
  }, [subStep, navigate])

  /* ── Complete setup (from step 8) ── */

  function handleCompleteSetup() {
    setSubStep(9)
  }

  /* ── CSV download ── */

  function handleDownloadTemplate(e: React.MouseEvent) {
    e.preventDefault()
    let csvContent = 'data:text/csv;charset=utf-8,'

    if (form.levelStructure === '1') {
      csvContent += 'Full Name,House No.,Phone Number\n'
      csvContent += 'John Doe,14,+234 801 234 5678\n'
      csvContent += 'Jane Smith,27,+234 802 345 6789\n'
    } else {
      csvContent += 'Full Name,Block,Unit,Phone Number\n'
      csvContent += 'John Doe,A,12,+234 801 234 5678\n'
      csvContent += 'Jane Smith,B,5,+234 802 345 6789\n'
    }

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'residents_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    // state
    subStep,
    form,
    structurePage,
    setStructurePage,
    showRedirect,
    errors,
    isSubmitting,
    submitError,
    structureTemplates,
    isLoadingTemplates,
    logicalStep,
    totalLogicalSteps,
    // setters / actions
    updateField,
    setSubStep,
    handleNext,
    handleBack,
    handleCompleteSetup,
    handleDownloadTemplate,
  }
}

export type UseRegistrationFormReturn = ReturnType<typeof useRegistrationForm>
