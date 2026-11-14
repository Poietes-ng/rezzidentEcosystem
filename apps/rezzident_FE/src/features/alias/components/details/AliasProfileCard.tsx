import { AliasAvatar } from '../AliasAvatar'
import { PhotoPlaceholder } from './PhotoPlaceholder'
import type { ReactNode } from 'react'
import type { AliasProfileCardProps } from '../../types/alias.types'
import { Badge, Card } from '#/shared/components/ui'

export function AliasProfileCard({ member, isLoading = false }: AliasProfileCardProps): ReactNode {
  const fullName = member ? `${member.firstName} ${member.lastName}`.trim() : ''
  const isPendingOrExpired = member?.status === 'pending' || member?.status === 'expired'

  return (
    <Card variant="flat" className="flex flex-col gap-4 rounded-xl p-5" aria-busy={isLoading}>
      <h2 className="font-dmsans text-body-base text-actionDark font-bold">Alias Profile</h2>

      {isLoading ? (
        <div className="flex w-full items-start gap-4" aria-hidden="true">
          <div className="bg-stoneEdge/30 h-[160px] w-[120px] shrink-0 animate-pulse rounded-2xl motion-reduce:animate-none" />
          <div className="flex flex-1 flex-col items-start">
            <div className="flex items-center gap-2">
              <div className="bg-stoneEdge/30 h-7 w-14 animate-pulse rounded-md motion-reduce:animate-none" />
              <div className="bg-stoneEdge/30 h-5 w-16 animate-pulse rounded-md motion-reduce:animate-none" />
            </div>
            <div className="bg-stoneEdge/30 mt-5 h-5 w-40 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-stoneEdge/30 mt-2.5 h-4 w-20 animate-pulse rounded motion-reduce:animate-none" />
            <div className="bg-stoneEdge/30 mt-2 h-4 w-16 animate-pulse rounded motion-reduce:animate-none" />
          </div>
        </div>
      ) : (
        <div className="flex w-full items-start gap-4">
          {isPendingOrExpired ? (
            <PhotoPlaceholder />
          ) : (
            <AliasAvatar
              photoUrl={member?.photoUrl}
              firstName={member?.firstName}
              lastName={member?.lastName}
              size="lg"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <div className="flex items-center gap-2">
              <Badge variant="alias">Alias</Badge>
              {member?.status === 'deactivated' && <Badge variant="deactivated">Deactivated</Badge>}
              {member?.status === 'active' && <Badge variant="active">Active</Badge>}
              {isPendingOrExpired && <Badge variant="pending">Pending</Badge>}
            </div>
            <h3 className="font-dmsans text-body-large text-actionDark mt-5 truncate leading-tight font-bold">
              {fullName}
            </h3>
            <p className="font-dmsans text-actionDark mt-2.5 text-[15px] font-normal">
              {member?.relationship}
            </p>
            {!isPendingOrExpired && member?.tier && (
              <p className="font-dmsans text-actionDark mt-2 text-[15px] font-normal">
                {member.tier}
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
