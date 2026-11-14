import { Link } from '@tanstack/react-router'
import { AliasAvatar } from './AliasAvatar'
import type { ReactNode } from 'react'
import type { AliasMemberRowProps } from '../types/alias.types'
import { Badge } from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export function AliasMemberRow({ member, to }: AliasMemberRowProps): ReactNode {
  const isDeactivated = member.status === 'deactivated'
  const fullName = `${member.firstName} ${member.lastName}`.trim()
  const accessibleName = `${fullName}, ${member.relationship}${isDeactivated ? ', Deactivated' : ''}`
  const destination = to || `/alias/${member.id}`

  return (
    <Link
      to={destination}
      aria-label={accessibleName}
      data-to={to}
      className={cn(
        'group flex w-full items-center justify-between gap-3.5 rounded-xl px-1 py-3 transition-colors',
        'hover:bg-stoneEdge/10 active:bg-stoneEdge/20 focus-visible:ring-actionDark focus-visible:ring-2 focus-visible:outline-none',
        'cursor-pointer text-left no-underline select-none',
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <AliasAvatar
          firstName={member.firstName}
          lastName={member.lastName}
          photoUrl={member.photoUrl}
          size="sm"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <span className="font-dmsans text-body-base text-actionDark truncate leading-tight font-bold">
            {fullName}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-dmsans text-body-small text-warmGray truncate leading-tight">
              {member.relationship}
            </span>
            {isDeactivated && <Badge variant="deactivated">Deactivated</Badge>}
          </div>
        </div>
      </div>
      <span
        className="material-symbols-outlined text-actionDark shrink-0 text-[20px] font-bold transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        chevron_right
      </span>
    </Link>
  )
}
