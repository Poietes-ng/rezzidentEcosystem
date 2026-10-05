import { Button } from '../../../../shared/components/ui/button'
import { Input } from '../../../../shared/components/ui/input'
import { cn } from '../../../../shared/utils/cn'
import type { UseJoinEstateReturn } from '../useJoinEstate'

interface Props {
  join: UseJoinEstateReturn
}

export function Step4Address({ join }: Props) {
  const {
    displayStep,
    totalSteps,
    street,
    setStreet,
    houseNumber,
    setHouseNumber,
    handleNext,
    isStepValid,
  } = join

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-1 flex-col duration-500">
      <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
        Step {displayStep} of {totalSteps}
      </span>
      <h1 className="font-cabinet text-actionDark mb-3 text-[32px] leading-tight font-bold">
        Where do you live?
      </h1>
      <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
        This helps us connect you to your community
      </p>

      <div className="mb-6">
        <label className="mb-2 block text-[12px] font-medium text-gray-400">Street</label>
        <Input
          type="text"
          placeholder="e.g. Admiralty Way"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="focus-visible:border-actionDark h-[52px] rounded-none border-x-0 border-t-0 border-b border-gray-300 bg-transparent px-0 text-[15px] font-medium focus-visible:ring-0"
        />
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-[12px] font-medium text-gray-400">House Number</label>
        <Input
          type="text"
          placeholder="e.g. Block C, Unit 7"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          className="focus-visible:border-actionDark h-[52px] rounded-none border-x-0 border-t-0 border-b border-gray-300 bg-transparent px-0 text-[15px] font-medium focus-visible:ring-0"
        />
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
