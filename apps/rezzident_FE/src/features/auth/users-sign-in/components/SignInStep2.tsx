import { Button } from '../../../../shared/components/ui/button'
import { Input } from '../../../../shared/components/ui/input'
import type { UseJoinEstateReturn } from '../useJoinEstate'

interface Props {
  join: UseJoinEstateReturn
}

export function Step2PersonalDetails({ join }: Props) {
  const {
    displayStep,
    totalSteps,
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    handleNext,
    isStepValid,
  } = join

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-1 flex-col duration-500">
      <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
        Step {displayStep} of {totalSteps}
      </span>
      <h1 className="font-cabinet text-actionDark mb-3 text-[32px] leading-tight font-bold">
        What's your name?
      </h1>
      <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
        We'll use this to personalize your experience
      </p>

      <div className="mb-6">
        <label className="mb-2 block text-[12px] font-medium text-gray-400">Full Name</label>
        <Input
          type="text"
          placeholder="e.g. Adaeze Okonkwo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="focus-visible:border-actionYellow h-[52px] rounded-none border-x-0 border-t-0 border-b border-gray-300 bg-transparent px-0 text-[15px] font-medium focus-visible:ring-0"
        />
      </div>

      <div className="mb-2">
        <label className="mb-2 block text-[12px] font-medium text-gray-400">Phone Number</label>
        <div className="focus-within:border-actionYellow flex items-center border-b border-gray-300 transition-colors">
          <span className="text-actionDark mr-2 text-[15px] font-medium whitespace-nowrap">
            +234
          </span>
          <div className="mr-2 h-[20px] w-[1px] bg-gray-300"></div>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="h-[52px] rounded-none border-none bg-transparent px-0 text-[15px] font-medium focus-visible:ring-0"
          />
        </div>
      </div>
      <p className="mb-8 text-[11px] text-gray-400">
        We'll send a verification code to this number
      </p>

      <div className="mt-auto">
        <Button onClick={handleNext} disabled={!isStepValid()} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  )
}
