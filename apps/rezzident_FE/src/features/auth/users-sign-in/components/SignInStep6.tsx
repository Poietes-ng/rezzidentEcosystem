import { Button } from '../../../../shared/components/ui/button'
import { Switch } from '../../../../shared/components/ui/switch'
import { PinInput } from '../../../../shared/components/ui/pin-input'
import type { UseJoinEstateReturn } from '../useJoinEstate'

interface Props {
  join: UseJoinEstateReturn
}

export function Step6PinSetup({ join }: Props) {
  const {
    displayStep,
    totalSteps,
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    enableFaceId,
    setEnableFaceId,
    handleNext,
    isStepValid,
  } = join

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-1 flex-col duration-500">
      <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
        Step {displayStep} of {totalSteps}
      </span>
      <h1 className="font-cabinet text-actionDark mb-3 text-[32px] leading-tight font-bold">
        Create your PIN
      </h1>
      <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
        Set a 4-digit PIN for quick and secure access
      </p>

      <div className="mb-8 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center">
          <span className="mb-4 text-[12px] text-gray-400">Enter PIN</span>
          <PinInput length={4} value={pin} onChange={setPin} className="gap-6" />
        </div>

        <div className="flex flex-col items-center">
          <span className="mb-4 text-[12px] text-gray-400">Confirm PIN</span>
          <PinInput length={4} value={confirmPin} onChange={setConfirmPin} className="gap-6" />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between py-4">
        <div className="text-actionDark flex items-center gap-2 text-[14px] font-medium">
          <span className="material-symbols-outlined text-[20px]">ar_on_you</span>
          Enable Face ID
        </div>
        <Switch
          checked={enableFaceId}
          onCheckedChange={setEnableFaceId}
          className="data-[state=checked]:bg-actionDark h-[24px] w-[42px] border-none shadow-none focus-visible:ring-0 data-[state=unchecked]:bg-gray-200"
        />
      </div>

      <div className="mt-auto">
        <Button onClick={handleNext} disabled={!isStepValid()} className="w-full">
          Complete Setup
        </Button>
      </div>
    </div>
  )
}
