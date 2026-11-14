import { useNavigate, useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export interface AliasPageLayoutProps {
  title: string
  unit?: string | null
  isLoadingUnit?: boolean
  onBack?: () => void
  children: ReactNode
}

export function AliasPageLayout({
  title,
  unit,
  isLoadingUnit = false,
  onBack,
  children,
}: AliasPageLayoutProps): ReactNode {
  const router = useRouter()
  const navigate = useNavigate()

  function handleBack(): void {
    if (onBack) {
      onBack()
      return
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.history.back()
    } else {
      void navigate({ to: '/alias' })
    }
  }

  return (
    <div className="bg-lightCream font-dmsans flex min-h-screen w-full items-start justify-center">
      <main className="bg-lightCream relative flex min-h-screen w-full max-w-[768px] flex-col overflow-x-hidden px-4 pt-6 pb-12 md:px-6">
        {/* ── Top Header ── */}
        <header className="relative mb-6 flex flex-col items-center justify-center">
          <div className="relative flex min-h-[40px] w-full items-center justify-center">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back"
              className="text-actionDark hover:bg-stoneEdge/20 focus-visible:ring-actionDark absolute left-0 flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span
                className="material-symbols-outlined text-[26px] font-medium"
                aria-hidden="true"
              >
                chevron_left
              </span>
            </button>
            {title ? (
              <h1 className="font-dmsans text-body-base text-actionDark font-bold">{title}</h1>
            ) : null}
          </div>
          {isLoadingUnit ? (
            <div
              className="bg-stoneEdge/30 mt-3 h-5 w-32 animate-pulse rounded motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : unit ? (
            <p className="font-dmsans text-body-base text-actionDark mt-3 font-semibold tracking-normal">
              {unit}
            </p>
          ) : null}
        </header>

        {children}
      </main>
    </div>
  )
}
