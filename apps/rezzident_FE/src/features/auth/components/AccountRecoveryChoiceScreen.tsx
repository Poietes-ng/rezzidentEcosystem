import { useNavigate } from '@tanstack/react-router'
import { useAuthFlow } from '../context/AuthFlowContext'
import { cn } from '../../../shared/utils/cn'

export function AccountRecoveryChoiceScreen() {
  const navigate = useNavigate()
  const { setRecoveryMethod } = useAuthFlow()

  const handleSelectMethod = (method: 'phone' | 'email') => {
    setRecoveryMethod(method)
    if (method === 'phone') {
      navigate({ to: '/verify-phone' })
    } else {
      navigate({ to: '/verify-email' })
    }
  }

  return (
    <div className="font-dmsans flex min-h-full w-full flex-col bg-white px-6 py-4">
      {/* ── Top Bar ── */}
      <div className="relative flex items-center justify-center pt-2 pb-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-actionDark absolute left-0 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-4xl">
            chevron_left
          </span>
        </button>
        <h2 className="font-dmsans text-actionDark text-[16px] font-semibold">
          Account recovery
        </h2>
      </div>

      {/* ── Title ── */}
      <div className="mt-4 mb-6">
        <h1 className="font-dmsans text-actionDark text-[26px] leading-snug font-bold tracking-tight">
          How would you like to recover your account?
        </h1>
      </div>

      {/* ── Option Cards ── */}
      <div className="space-y-4">
        {/* Option 1: Registered Phone */}
        <button
          type="button"
          onClick={() => handleSelectMethod('phone')}
          className={cn(
            'w-full rounded-[20px] bg-[#F9F9F8] p-5 text-left transition-all duration-150',
            'focus-visible:ring-actionYellow hover:bg-[#F2F2F0] focus:outline-none focus-visible:ring-2 active:scale-[0.99]',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-dmsans text-actionDark text-[16px] font-bold">
              I still have my registered phone number
            </h3>
            <span className="material-symbols-outlined text-black">
              chevron_right
            </span>
          </div>
          <p className="font-dmsans mt-2 text-[14px] leading-relaxed text-gray-500">
            We’ll send a verification code to your phone number.
          </p>
        </button>

        {/* Option 2: No Longer Have Access */}
        <button
          type="button"
          onClick={() => handleSelectMethod('email')}
          className={cn(
            'w-full rounded-[20px] bg-[#F9F9F8] p-5 text-left transition-all duration-150',
            'focus-visible:ring-actionYellow hover:bg-[#F2F2F0] focus:outline-none focus-visible:ring-2 active:scale-[0.99]',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-dmsans text-actionDark text-[16px] font-bold">
              I no longer have access to my phone number
            </h3>
            <span className="material-symbols-outlined text-black">
              chevron_right
            </span>
          </div>
          <p className="font-dmsans mt-2 text-[14px] leading-relaxed text-gray-500">
            Recover your account through email verification or by contacting
            support.
          </p>
        </button>
      </div>
    </div>
  )
}
