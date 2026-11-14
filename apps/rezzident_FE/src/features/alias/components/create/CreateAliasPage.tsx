import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCreateAliasWizard } from '../../hooks/useCreateAliasWizard'
import { AliasPageLayout } from '../AliasPageLayout'
import { CreateAliasCustomRelationshipStep } from './CreateAliasCustomRelationshipStep'
import { CreateAliasNameStep } from './CreateAliasNameStep'
import { CreateAliasPermissionsStep } from './CreateAliasPermissionsStep'
import { CreateAliasRelationshipStep } from './CreateAliasRelationshipStep'
import { CreateAliasSuccessStep } from './CreateAliasSuccessStep'
import type { ReactNode } from 'react'
import { StepProgress } from '#/shared/components/ui'

export function CreateAliasPage(): ReactNode {
  const prefersReducedMotion = useReducedMotion()
  const wizard = useCreateAliasWizard()

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }

  const enterInitial = prefersReducedMotion ? false : { opacity: 0, x: 24 }
  const exitTarget = prefersReducedMotion
    ? { opacity: 0, transition: { duration: 0 } }
    : { opacity: 0, x: -24, transition: { duration: 0.15 } }

  const isSuccess = wizard.subStep === 'success'

  return (
    <AliasPageLayout title={isSuccess ? '' : 'Create Alias'} onBack={wizard.handleBack}>
      <div className="flex flex-1 flex-col">
        {!isSuccess && (
          <StepProgress currentStep={wizard.logicalStep} totalSteps={3} className="mb-5" />
        )}

        <AnimatePresence mode="wait">
          {wizard.subStep === 'name' && (
            <motion.div
              key="create-alias-name"
              initial={enterInitial}
              animate={{ opacity: 1, x: 0, transition }}
              exit={exitTarget}
              className="flex flex-1 flex-col"
            >
              <CreateAliasNameStep
                firstName={wizard.firstName}
                lastName={wizard.lastName}
                phoneDigits={wizard.phoneDigits}
                firstNameError={wizard.firstNameError}
                lastNameError={wizard.lastNameError}
                phoneError={wizard.phoneError}
                isCheckingPhone={wizard.isCheckingPhone}
                onFirstNameChange={wizard.handleFirstNameChange}
                onLastNameChange={wizard.handleLastNameChange}
                onPhoneChange={wizard.handlePhoneChange}
                onSubmit={() => {
                  void wizard.handleStep1Submit()
                }}
              />
            </motion.div>
          )}

          {wizard.subStep === 'relationship' && (
            <motion.div
              key="create-alias-relationship"
              initial={enterInitial}
              animate={{ opacity: 1, x: 0, transition }}
              exit={exitTarget}
              className="flex flex-1 flex-col"
            >
              <CreateAliasRelationshipStep
                relationship={wizard.relationship}
                onRelationshipChange={wizard.setRelationship}
                onSelectOthers={wizard.handleOpenCustomRelationship}
                onContinue={wizard.handleRelationshipContinue}
              />
            </motion.div>
          )}

          {wizard.subStep === 'custom-relationship' && (
            <motion.div
              key="create-alias-custom-relationship"
              initial={enterInitial}
              animate={{ opacity: 1, x: 0, transition }}
              exit={exitTarget}
              className="flex flex-1 flex-col"
            >
              <CreateAliasCustomRelationshipStep
                customRelationship={wizard.customRelationship}
                onCustomRelationshipChange={wizard.setCustomRelationship}
                onContinue={wizard.handleCustomRelationshipContinue}
              />
            </motion.div>
          )}

          {wizard.subStep === 'permissions' && (
            <motion.div
              key="create-alias-permissions"
              initial={enterInitial}
              animate={{ opacity: 1, x: 0, transition }}
              exit={exitTarget}
              className="flex flex-1 flex-col"
            >
              <CreateAliasPermissionsStep
                permissions={wizard.permissions}
                isSubmitting={wizard.isCreatingAlias}
                onPermissionChange={wizard.handlePermissionChange}
                onSubmit={() => {
                  void wizard.handleCreateAliasSubmit()
                }}
              />
            </motion.div>
          )}

          {wizard.subStep === 'success' && wizard.createdMember?.invite && (
            <motion.div
              key="create-alias-success"
              initial={enterInitial}
              animate={{ opacity: 1, x: 0, transition }}
              exit={exitTarget}
              className="flex flex-1 flex-col"
            >
              <CreateAliasSuccessStep
                inviteCode={wizard.createdMember.invite.code}
                onDone={wizard.handleDone}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AliasPageLayout>
  )
}
