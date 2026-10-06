import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import type {
  AccountStatus,
  QuickActionId,
} from '#/features/dashboard/user-dashboard/types/home.types'
import { QUICK_ACTION_ROUTES } from '#/features/dashboard/user-dashboard/types/home.types'
import { QuickActionTile } from '#/features/dashboard/user-dashboard/components/QuickActionTile'

export interface QuickActionsProps {
  accountStatus?: AccountStatus
  onActionClick?: (id: QuickActionId) => void
  onPanicClick?: () => void
  isPanicLoading?: boolean
}

function IdIcon(): ReactNode {
  return (
    <span className="material-symbols-outlined text-[26px]" aria-hidden="true">
      account_circle
    </span>
  )
}

function AliasIcon(): ReactNode {
  return (
    <span className="material-symbols-outlined text-[26px]" aria-hidden="true">
      masked_transitions
    </span>
  )
}

function VouchIcon(): ReactNode {
  return (
    <span className="material-symbols-outlined text-[26px]" aria-hidden="true">
      handshake
    </span>
  )
}

function PanicIcon(): ReactNode {
  return (
    <span className="material-symbols-outlined text-[26px]" aria-hidden="true">
      e911_emergency
    </span>
  )
}

export function QuickActions({
  accountStatus = 'active',
  onActionClick,
  onPanicClick,
  isPanicLoading = false,
}: QuickActionsProps): ReactNode {
  const navigate = useNavigate()
  const isDeactivated = accountStatus === 'deactivated'

  function handleTileClick(id: QuickActionId): void {
    if (id === 'panic') {
      onPanicClick?.()
    } else if (onActionClick) {
      onActionClick(id)
    } else {
      const route = QUICK_ACTION_ROUTES[id]
      if (route) {
        navigate({ to: route })
      }
    }
  }

  return (
    <section aria-label="Quick Actions" className="w-full">
      <div className="grid grid-cols-4 gap-3">
        <QuickActionTile
          id="id"
          label="ID"
          icon={<IdIcon />}
          disabled={isDeactivated}
          onClick={() => handleTileClick('id')}
        />

        <QuickActionTile
          id="alias"
          label="Alias"
          icon={<AliasIcon />}
          disabled={isDeactivated}
          onClick={() => handleTileClick('alias')}
        />

        <QuickActionTile
          id="vouch"
          label="Vouch"
          icon={<VouchIcon />}
          disabled={isDeactivated}
          onClick={() => handleTileClick('vouch')}
        />

        <QuickActionTile
          id="panic"
          label="Panic"
          icon={<PanicIcon />}
          tone="danger"
          disabled={false}
          loading={isPanicLoading}
          onClick={() => handleTileClick('panic')}
        />
      </div>
    </section>
  )
}
