import { useRouter } from '@tanstack/react-router'
import { useAliases } from '../hooks/useAliases'
import { AliasEmptyState } from './AliasEmptyState'
import { AliasMemberRow } from './AliasMemberRow'
import { AliasPageLayout } from './AliasPageLayout'
import type { ReactNode } from 'react'
import { AlertCard, Card } from '#/shared/components/ui'

export function AliasViewAllPage(): ReactNode {
  const router = useRouter()
  const { data, isLoading, isError, refetch } = useAliases(true)

  const members = data?.members ?? []
  const isEmpty = !isLoading && !isError && members.length === 0
  const isPopulated = !isLoading && !isError && members.length > 0

  return (
    <AliasPageLayout title="Aliases" onBack={() => router.history.back()}>
      {/* ── Page Content ── */}
      <div className="flex flex-1 flex-col gap-5">
        {/* Error Banner */}
        {isError && (
          <AlertCard
            variant="error"
            title="Failed to load aliases"
            description="We encountered an issue loading your alias accounts. Please try again."
            action={{ label: 'Retry', onClick: refetch }}
          />
        )}

        {/* Single Combined Card: Description + Members List */}
        <Card variant="flat" className="flex flex-col rounded-xl p-5">
          <p className="font-dmsans text-body-small text-warmGray mb-4 leading-normal">
            View and manage the alias accounts linked to your profile.
          </p>

          {/* Loading skeletons */}
          {isLoading && (
            <div
              className="divide-stoneEdge/20 flex flex-col divide-y"
              aria-busy="true"
              aria-label="Loading all aliases"
            >
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3.5 px-1 py-3"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="bg-stoneEdge/30 h-12 w-12 shrink-0 animate-pulse rounded-xl motion-reduce:animate-none" />
                    <div className="flex flex-col gap-2">
                      <div className="bg-stoneEdge/30 h-4 w-36 animate-pulse rounded motion-reduce:animate-none" />
                      <div className="bg-stoneEdge/30 h-3 w-20 animate-pulse rounded motion-reduce:animate-none" />
                    </div>
                  </div>
                  <div className="bg-stoneEdge/30 h-4 w-4 shrink-0 animate-pulse rounded motion-reduce:animate-none" />
                </div>
              ))}
            </div>
          )}

          {/* Large Empty State */}
          {isEmpty && <AliasEmptyState variant="large" />}

          {/* Populated rows */}
          {isPopulated && (
            <div className="divide-stoneEdge/20 flex flex-col divide-y">
              {members.map((member) => (
                <AliasMemberRow key={member.id} member={member} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </AliasPageLayout>
  )
}
