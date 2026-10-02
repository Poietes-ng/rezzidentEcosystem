import type { ReactNode } from 'react'
import type { AccountStatus } from '#/features/dashboard/user-dashboard/types/home.types'

export interface VisitorCodeCardProps {
  accountStatus?: AccountStatus
  onGenerateCode?: () => void
  onViewHistory?: () => void
}

export function VisitorCodeCard({
  accountStatus = 'active',
  onGenerateCode,
  onViewHistory,
}: VisitorCodeCardProps): ReactNode {
  const isDeactivated = accountStatus === 'deactivated'

  function handleGenerateCode(): void {
    if (isDeactivated) return
    onGenerateCode?.()
  }

  return (
    <section
      aria-label="Visitor Code Management"
      className="bg-actionDark relative w-full overflow-hidden rounded-[24px] p-5 text-white shadow-xs"
    >
      {/* Decorative olive arc in bottom-left corner */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[26px] w-[42px]"
        viewBox="0 0 42 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0C18 1 34 10 42 26H0V0Z" fill="#4E4826" />
      </svg>

      {/* Header row: Having a visitor? & View history */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-dmsans text-[18px] leading-[24px] font-semibold text-white">
            Having a visitor?
          </h2>
          <p className="font-dmsans mt-1 text-[14px] leading-[20px] text-white">
            Generate a code for them.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewHistory}
          aria-label="View visitation history"
          className="font-dmsans flex shrink-0 items-center gap-0.5 text-[14px] font-medium text-white transition-all duration-150 hover:text-white active:scale-95"
        >
          View history
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            chevron_right
          </span>
        </button>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        disabled={isDeactivated}
        aria-disabled={isDeactivated}
        onClick={handleGenerateCode}
        className={[
          'font-dmsans relative z-10 mt-5 flex h-[52px] w-full items-center justify-center rounded-[14px] text-[16px] font-semibold transition-all duration-150',
          'bg-actionYellow text-actionDark hover:bg-actionYellowHover active:bg-actionYellowPressed',
          isDeactivated
            ? 'hover:bg-actionYellow cursor-not-allowed opacity-40 active:scale-100'
            : 'cursor-pointer active:scale-[0.98]',
        ].join(' ')}
      >
        Generate Visitor Code
      </button>
    </section>
  )
}
