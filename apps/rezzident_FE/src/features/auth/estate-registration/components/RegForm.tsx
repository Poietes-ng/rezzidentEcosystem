import { AnimatePresence, motion } from 'framer-motion'
import { useRegistrationForm } from '../hooks/useRegistrationForm'
import { EstateDetails } from './registration-steps/EstateDetails'
import { StructureExamples } from './registration-steps/StructureExamples'
import { StructureSelection } from './registration-steps/StructureSelection'
import { NumberOfUnits } from './registration-steps/NumberOfUnits'
import { BankAccountInfo } from './registration-steps/BankAccountInfo'
import { Stakeholder } from './registration-steps/Stakeholder'
import { ImportResidents } from './registration-steps/ImportResidents'
import { RegSuccessPage } from './registration-steps/RegSuccessPage'
import { StepProgress } from '#/shared/components/ui/step-progress'
import { Button } from '#/shared/components/ui/button'
import { ServerDowntimeError } from '#/shared/components/ui/server-downtime-error'

export function RegistrationForm() {
  const registration = useRegistrationForm()
  const {
    subStep,
    logicalStep,
    totalLogicalSteps,
    submitError,
    showRedirect,
    isSubmitting,
    handleBack,
    handleNext,
    handleCompleteSetup,
  } = registration

  return (
    <div className="flex flex-col">
      <div className="bg-menuHover sticky top-0 z-10 flex w-full flex-1 flex-col">
        {/* Go Back */}
        <button
          onClick={handleBack}
          className="font-dmsans text-actionDark mt-1.5 mb-[63px] inline-flex items-center gap-1 self-start text-base font-medium hover:opacity-70"
        >
          <span className="material-symbols-outlined text-[13px]!">arrow_back_ios_new</span>
          Go Back
        </button>

        {/* Step Progress */}
        <StepProgress
          currentStep={logicalStep}
          totalSteps={totalLogicalSteps}
          className="mb-web-lg"
        />
      </div>

      <div className="relative w-full flex-5">
        {/* API submit error (only for network/server errors) */}
        {submitError && (
          <ServerDowntimeError
            className="mb-4"
            title="Registration Failed"
            description={submitError}
            buttonText="Retry Registration"
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Dynamic form content */}
        <div className="">
          <AnimatePresence mode="wait">
            {subStep === 1 && <EstateDetails registration={registration} />}
            {subStep === 2 && <StructureExamples registration={registration} />}
            {subStep === 3 && <StructureSelection registration={registration} />}
            {subStep === 4 && <NumberOfUnits registration={registration} />}
            {subStep === 5 && <BankAccountInfo registration={registration} />}
            {subStep === 6 && <Stakeholder registration={registration} stakeholderNumber={1} />}
            {subStep === 7 && <Stakeholder registration={registration} stakeholderNumber={2} />}
            {subStep === 8 && <ImportResidents registration={registration} />}
            {subStep === 9 && <RegSuccessPage />}
          </AnimatePresence>
        </div>

        {/* Redirecting Overlay */}
        <AnimatePresence>
          {showRedirect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <h2 className="font-dmsans text-web-h1 font-web-medium flex items-center justify-center text-center text-white">
                Redirecting to your dashboard...
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue / Submit button */}
        {subStep < 9 && (
          <div className="mt-web-lg mb-xl">
            {subStep === 8 ? (
              <div className="flex gap-4">
                <Button variant="secondary" className="w-full flex-1" onClick={handleCompleteSetup}>
                  Skip
                </Button>
                <Button className="w-full flex-1" onClick={handleCompleteSetup}>
                  Complete Setup
                </Button>
              </div>
            ) : (
              <Button
                className="mt-8 w-full text-[14px]"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Please Wait...
                  </span>
                ) : subStep === 2 ? (
                  'Proceed to Create Structure'
                ) : subStep === 7 ? (
                  'continue'
                ) : (
                  'Continue'
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
