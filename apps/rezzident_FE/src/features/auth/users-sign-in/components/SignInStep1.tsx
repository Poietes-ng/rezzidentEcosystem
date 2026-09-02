import { Button } from '../../../../shared/components/ui/button'
import { Input } from '../../../../shared/components/ui/input'
import type { UseJoinEstateReturn } from '../useJoinEstate'

interface Props {
  join: UseJoinEstateReturn
}

export function Step1EstateId({ join }: Props) {
  const { displayStep, totalSteps, estateId, setEstateId, handleNext, isStepValid } = join

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-1 flex-col duration-500">
      <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
        Step {displayStep} of {totalSteps}
      </span>
      <h1 className="font-cabinet text-actionDark mb-3 text-[32px] leading-tight font-bold">
        Enter your estate ID
      </h1>
      <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
        Your estate administrator will provide you with a unique code to join your community.
      </p>

      <div className="mb-2">
        <label className="mb-2 block text-[12px] font-medium text-gray-400">Estate ID</label>
        <Input
          type="text"
          placeholder="e.g. RSZ-2024-LEKK"
          value={estateId}
          onChange={(e) => setEstateId(e.target.value)}
          className="focus-visible:border-actionYellow h-[52px] rounded-none border-x-0 border-t-0 border-b border-gray-300 bg-transparent px-0 text-[15px] font-medium focus-visible:ring-0"
        />
      </div>
      <p className="mb-8 text-[11px] text-gray-400">
        Usually found in your welcome letter or email
      </p>

      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="h-[1px] flex-1 bg-gray-100"></div>
        <span className="text-[12px] text-gray-400">or</span>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>

      <Button variant="secondary" className="mb-8 w-full">
        <span className="material-symbols-outlined mr-2 text-[20px]">qr_code_scanner</span>
        Scan Estate Barcode
      </Button>

      <div className="mb-8 text-center">
        <a
          href="#"
          className="text-actionDark text-[13px] font-bold underline decoration-gray-300 underline-offset-4"
        >
          I don't have my estate ID
        </a>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <Button onClick={handleNext} disabled={!isStepValid()} className="w-full">
          Continue
        </Button>
        <Button variant="secondary" className="mb-6 w-full">
          I already have an account
        </Button>
        <p className="text-center text-[10px] text-gray-400">
          By continuing, you agree to our{' '}
          <span className="underline decoration-gray-300">Terms</span> &{' '}
          <span className="underline decoration-gray-300">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
