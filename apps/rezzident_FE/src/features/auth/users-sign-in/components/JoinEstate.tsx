import { useJoinEstate } from '../hooks/useJoinEstate'
import { Step1EstateId } from './SignInStep1'
import { Step2PersonalDetails } from './SignInStep2'
import { Step3Otp } from './SignInStep3'
import { Step4Address } from './SignInStep4'
import { Step5FacialCapture } from './SignInStep5'
import { Step6PinSetup } from './SignInStep6'

export function JoinEstateFlow() {
  const join = useJoinEstate()
  const { internalStep, displayStep, totalSteps, handleBack } = join

  return (
    <div className="font-dmsans flex h-screen w-full flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col px-6 pt-12 pb-4">
        <button
          onClick={handleBack}
          className="text-actionDark mb-6 flex w-fit items-center justify-start"
        >
          <span className="material-symbols-outlined text-[24px]">chevron_left</span>
        </button>

        {/* Progress Bar */}
        <div className="relative h-[4px] w-full max-w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-actionDark absolute top-0 left-0 h-full transition-all duration-300"
            style={{ width: `${(displayStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pb-8">
        {internalStep === 1 && <Step1EstateId join={join} />}
        {internalStep === 2 && <Step2PersonalDetails join={join} />}
        {internalStep === 3 && <Step3Otp join={join} />}
        {internalStep === 4 && <Step4Address join={join} />}
        {internalStep === 5 && <Step5FacialCapture join={join} />}
        {internalStep === 6 && <Step6PinSetup join={join} />}
      </div>
    </div>
  )
}
