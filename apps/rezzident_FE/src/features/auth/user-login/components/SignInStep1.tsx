import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { BarcodeScannerModal } from './BarcodeScannerModal'
import type React from 'react'
import type { UseJoinEstateReturn } from '../hooks/useJoinEstate'
import { Button, Input } from '#/shared/components/ui'

interface Props {
  join: UseJoinEstateReturn
}

export function Step1EstateId({ join }: Props): React.JSX.Element {
  const { displayStep, totalSteps, estateId, setEstateId, handleNext, isStepValid } = join
  const [showScanner, setShowScanner] = useState(false)

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex min-h-0 flex-1 flex-col overflow-y-auto pt-16 duration-500">
      <span className="mb-2 block text-[11px] font-bold tracking-widest text-gray-400 uppercase">
        Step {displayStep} of {totalSteps}
      </span>
      <h1 className="font-dmsans text-actionDark mb-2 text-[32px] leading-tight font-bold">
        Enter your estate ID
      </h1>
      <p className="font-dmsan text-[14px] leading-relaxed text-gray-500">
        Your estate administrator will provide you with a unique code to join your community.
      </p>

      <div className="my-2xl">
        <label className="mb-2 block text-[12px] font-medium text-gray-400">Estate ID</label>
        <Input
          type="text"
          placeholder="e.g. RSZ-2024-LEKK"
          value={estateId}
          onChange={(e) => setEstateId(e.target.value)}
          className="focus-visible:border-actionYellow gap-[8px] rounded-none border-x-0 border-t-0 border-b border-gray-300 bg-transparent px-0 py-0! text-[15px] font-medium focus-visible:ring-0"
        />
        <p className="mt-2 text-[11px] text-gray-400">
          Usually found in your welcome letter or email
        </p>
      </div>

      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="bg-stoneEdge h-[1px] flex-1"></div>
        <span className="text-stoneEdge text-[12px]">or</span>
        <div className="bg-stoneEdge h-[1px] flex-1"></div>
      </div>

      <Button
        variant="secondary"
        buttonStyle={{
          hoverBgColor: 'transparent',
          bgColor: 'transparent',
        }}
        className="w-full"
        onClick={() => setShowScanner(true)}
      >
        <span className="material-symbols-outlined mr-2 text-[20px]">qr_code_scanner</span>
        Scan Estate Barcode
      </Button>

      {/* Barcode scanner modal */}
      {showScanner && (
        <BarcodeScannerModal
          onDetected={(code: string) => {
            setEstateId(code)
            setShowScanner(false)
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="my-8 text-center">
        <Link to="/app/onboarding/get-started/no-estate-id">
          <Button variant="ghost" buttonStyle={{ hoverBorderColor: 'transparent' }}>
            I don't have my estate ID
          </Button>
        </Link>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <Button variant="primary" onClick={handleNext} disabled={!isStepValid()} className="w-full">
          Continue
        </Button>
        <Link to="/app/login">
          <Button variant="secondary" className="w-full">
            I already have an account
          </Button>
        </Link>
        <p className="font-dmsans pt-6 pb-3 text-center text-[12px] font-normal text-[#9A9488]">
          By continuing, you agree to our{' '}
          <span className="hover:text-actionYellow cursor-pointer font-medium underline transition-colors duration-300 ease-in-out">
            Terms
          </span>
          {' & '}
          <span className="hover:text-actionYellow cursor-pointer font-medium underline transition-colors duration-300 ease-in-out">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  )
}
