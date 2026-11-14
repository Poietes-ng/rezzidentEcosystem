import type { ReactNode } from 'react'
import type { AliasEmptyStateProps } from '../types/alias.types'

export function AliasEmptyState({ variant = 'card' }: AliasEmptyStateProps): ReactNode {
  if (variant === 'large') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="bg-stoneEdge/20 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
          <span
            className="material-symbols-outlined text-mutedOlive text-[40px]"
            aria-hidden="true"
          >
            masked_transitions
          </span>
        </div>
        <h3 className="font-dmsans text-heading-3 text-actionDark font-semibold">
          No active alias yet
        </h3>
        <p className="font-dmsans text-body-small text-warmGray mt-2 max-w-xs leading-normal">
          Your aliases will appear here once activated.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-3 flex items-center justify-center">
        <span className="material-symbols-outlined text-mutedOlive text-[32px]" aria-hidden="true">
          masked_transitions
        </span>
      </div>
      <h3 className="font-dmsans text-body-base text-actionDark font-semibold">
        No active alias yet.
      </h3>
      <p className="font-dmsans text-body-small text-warmGray mt-1 leading-normal">
        Your aliases will appear here once activated.
      </p>
    </div>
  )
}
