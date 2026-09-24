import { useJoinEstate } from '../hooks/useJoinEstate'
import { Step1EstateId } from './SignInStep1'
import { Step2PersonalDetails } from './SignInStep2'
import { Step3Otp } from './SignInStep3'
import { Step4Address } from './SignInStep4'
import { Step5FacialCapture } from './SignInStep5'
import { Step6PinSetup } from './SignInStep6'
import type React from 'react'

export function JoinEstateFlow(): React.JSX.Element {
  const join = useJoinEstate()
  const { internalStep, displayStep, totalSteps, handleBack } = join

  return (
    <div className="flex h-dvh w-full flex-col bg-white px-6">
      <section className="font-dmsans flex w-full flex-col bg-white pt-[36.51px]">
        {/* Header */}
        <div className="flex flex-col">
          <button
            onClick={handleBack}
            className="text-actionDark flex w-fit items-center justify-start pb-6.5"
          >
            <span className="material-symbols-outlined text-[18.96px]!">arrow_back_ios_new</span>
          </button>

          {/* Progress Bar */}
          <div className="relative h-1.5 w-full max-w-full overflow-hidden rounded-full bg-gray-200 px-6!">
            <div
              className="bg-actionDark absolute top-0 left-0 h-full transition-all duration-300"
              style={{ width: `${(displayStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="hide-scrollbar min-h-0 overflow-y-auto">
        <div className="flex flex-col">
          {internalStep === 1 && <Step1EstateId join={join} />}
          {internalStep === 2 && <Step2PersonalDetails join={join} />}
          {internalStep === 3 && <Step3Otp join={join} />}
          {internalStep === 4 && <Step4Address join={join} />}
          {internalStep === 5 && <Step5FacialCapture join={join} />}
          {internalStep === 6 && <Step6PinSetup join={join} />}
        </div>
      </div>
    </div>
  )
}
