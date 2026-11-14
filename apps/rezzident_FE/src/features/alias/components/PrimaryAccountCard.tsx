import { AliasAvatar } from './AliasAvatar'
import type { ReactNode } from 'react'
import type { PrimaryAccountCardProps } from '../types/alias.types'
import { Badge, Card } from '#/shared/components/ui'

export function PrimaryAccountCard({
  account,
  isLoading = false,
}: PrimaryAccountCardProps): ReactNode {
  return (
    <Card variant="flat" className="flex flex-col gap-4 rounded-xl p-5" aria-busy={isLoading}>
      <h2 className="font-dmsans text-body-base text-actionDark font-bold">Primary account</h2>

      {isLoading ? (
        <div className="flex w-full items-start gap-4" aria-hidden="true">
          {/* Photo skeleton */}
          <div className="bg-stoneEdge/30 h-[160px] w-[120px] shrink-0 animate-pulse rounded-2xl motion-reduce:animate-none" />
          <div className="flex flex-1 flex-col items-start">
            {/* Yellow tag skeleton */}
            <div className="bg-stoneEdge/30 h-7 w-11 animate-pulse rounded-md motion-reduce:animate-none" />
            {/* Name skeleton */}
            <div className="bg-stoneEdge/30 mt-5 h-5 w-44 animate-pulse rounded motion-reduce:animate-none" />
            {/* Tier skeleton */}
            <div className="bg-stoneEdge/30 mt-4 h-4 w-16 animate-pulse rounded motion-reduce:animate-none" />
          </div>
        </div>
      ) : (
        <div className="flex w-full items-start gap-4">
          <AliasAvatar photoUrl={account?.photoUrl} fullName={account?.name} size="lg" />
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <Badge variant="yellow">You</Badge>
            <h3 className="font-dmsans text-body-large text-actionDark mt-5 truncate leading-tight font-bold">
              {account?.name}
            </h3>
            <p className="font-dmsans text-actionDark mt-4 text-[15px] font-normal">
              {account?.tier}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
