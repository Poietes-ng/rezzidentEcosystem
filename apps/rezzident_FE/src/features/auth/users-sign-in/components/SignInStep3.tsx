import { Button } from '../../../../shared/components/ui/button'
import { PinInput } from '../../../../shared/components/ui/pin-input'
import { cn } from '../../../../shared/utils/cn'
import type { UseJoinEstateReturn } from '../useJoinEstate'

interface Props {
  join: UseJoinEstateReturn
}

export function Step3Otp({ join }: Props) {
  const { displayStep, totalSteps, phoneNumber, otp, setOtp, handleNext, isStepValid } = join

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-1 flex-col duration-500">
      <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
        Step {displayStep} of {totalSteps}
      </span>
      <h1 className="font-cabinet text-actionDark mb-3 text-[32px] leading-tight font-bold">
        Verify your number
      </h1>
      <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
        We sent a 4-digit code to +234 {phoneNumber || '801 234 XXXX'}
      </p>

      <div className="mb-8 flex justify-center">
        <PinInput length={4} value={otp} onChange={setOtp} className="gap-6" />
      </div>

      <div className="mb-8 text-center">
        <p className="text-[13px] font-medium text-gray-500">
          Didn't receive a code?{' '}
          <button className="text-actionDark font-bold underline decoration-gray-300 underline-offset-4">
            Resend
          </button>
        </p>
      </div>

      <div className="mt-auto">
        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={cn(
            'h-[52px] w-full rounded-2xl text-[15px] font-medium transition-colors',
            isStepValid()
              ? 'bg-actionDark hover:bg-actionDark/90 text-white'
              : 'bg-[#D3D0C9] text-white',
          )}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
