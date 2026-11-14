import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type { CreateAliasCardProps } from '../types/alias.types'
import { Button, Card } from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export function CreateAliasCard({
  memberCount,
  maxLimit = 10,
  onOpenWhatIsAliasModal,
  isLoading = false,
  to = '/alias/create',
}: CreateAliasCardProps): ReactNode {
  const navigate = useNavigate()
  const isMaxReached = memberCount >= maxLimit

  function handleClick(): void {
    if (isMaxReached || isLoading) return
    void navigate({ to })
  }

  return (
    <Card variant="flat" className="flex flex-col gap-3.5 rounded-xl p-5">
      <div className="flex items-center gap-1.5">
        <h2 className="font-dmsans text-body-base text-actionDark font-semibold">
          Create an alias
        </h2>
        <button
          type="button"
          onClick={onOpenWhatIsAliasModal}
          aria-label="What is Alias?"
          aria-haspopup="dialog"
          className="text-actionDark focus-visible:ring-actionDark flex items-center justify-center rounded-full p-0.5 transition-colors hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
        >
          <span
            className="material-symbols-outlined text-actionDark text-[18px]"
            aria-hidden="true"
          >
            help
          </span>
        </button>
      </div>

      <p className="font-dmsans text-body-small text-warmGray leading-normal">
        Create and manage trusted accounts for members of your household.
      </p>

      {/* Maximum reached state warning and progress bar */}
      {isMaxReached && !isLoading && (
        <div className="flex flex-col gap-2 pt-1">
          <p
            role="alert"
            className="font-dmsans text-errorRed text-body-small leading-normal font-medium"
          >
            You've reached the maximum of 10 aliases. Remove an existing alias to create a new one.
          </p>

          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-dmsans text-body-small text-actionDark font-medium">
                Aliases created {memberCount} of {maxLimit}
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={memberCount}
              aria-valuemin={0}
              aria-valuemax={maxLimit}
              aria-label="Aliases created"
              className="bg-stoneEdge/40 h-[6px] w-full overflow-hidden rounded-full"
            >
              <div className="bg-actionDark h-full w-full rounded-full transition-all duration-300" />
            </div>
          </div>
        </div>
      )}

      {/* Create New Alias Button */}
      <Button
        variant="primary"
        disabled={isMaxReached}
        aria-disabled={isMaxReached || isLoading}
        onClick={handleClick}
        data-to={to}
        className={cn(
          'mt-1 h-[52px] w-full rounded-2xl text-[16px] font-bold',
          isLoading && 'pointer-events-none',
        )}
      >
        Create New Alias
      </Button>
    </Card>
  )
}
