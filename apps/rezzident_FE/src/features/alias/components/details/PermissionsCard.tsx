import { PermissionRow } from './PermissionRow'
import type { ReactNode } from 'react'
import type { PermissionsCardProps } from '../../types/alias.types'
import { Card } from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export function PermissionsCard({
  permissions,
  onChange,
  disabled = false,
  isLoading = false,
}: PermissionsCardProps): ReactNode {
  return (
    <Card variant="flat" className="flex flex-col gap-4 rounded-xl p-5" aria-busy={isLoading}>
      <div>
        <h2
          id="set-permissions-title"
          className="font-dmsans text-body-base text-actionDark font-bold"
        >
          Set Permissions
        </h2>
        <p className="font-dmsans text-body-small text-warmGray mt-1 leading-relaxed font-normal">
          Control which features this alias can access within the app.
        </p>
      </div>

      <div
        role="group"
        aria-labelledby="set-permissions-title"
        className={cn('flex flex-col gap-2 pt-1', disabled && 'pointer-events-none select-none')}
      >
        {isLoading ? (
          <div className="flex flex-col gap-3 py-2" aria-hidden="true">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex w-full items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="bg-stoneEdge/30 h-5 w-5 animate-pulse rounded motion-reduce:animate-none" />
                  <div className="bg-stoneEdge/30 h-4 w-36 animate-pulse rounded motion-reduce:animate-none" />
                </div>
                <div className="bg-stoneEdge/30 h-6 w-11 animate-pulse rounded-full motion-reduce:animate-none" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <PermissionRow
              id="perm-visitor-code"
              icon="doorbell_3p"
              label="Generate visitor code"
              checked={permissions.visitorCode}
              onCheckedChange={(val) => onChange('visitorCode', val)}
              disabled={disabled}
            />
            <PermissionRow
              id="perm-estate-forum"
              icon="group_work"
              label="Estate forum"
              checked={permissions.forum}
              onCheckedChange={(val) => onChange('forum', val)}
              disabled={disabled}
            />
            <PermissionRow
              id="perm-pay-bills"
              icon="payments"
              label="Pay bills"
              checked={permissions.bills}
              onCheckedChange={(val) => onChange('bills', val)}
              disabled={disabled}
            />
          </>
        )}
      </div>
    </Card>
  )
}
