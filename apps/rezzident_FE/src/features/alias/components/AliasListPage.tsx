import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { useAliases } from '../hooks/useAliases'
import { AliasEmptyState } from './AliasEmptyState'
import { AliasMemberRow } from './AliasMemberRow'
import { AliasPageLayout } from './AliasPageLayout'
import { CreateAliasCard } from './CreateAliasCard'
import { PrimaryAccountCard } from './PrimaryAccountCard'
import { WhatIsAliasModal } from './WhatIsAliasModal'
import type { ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'
import { AlertCard, Card } from '#/shared/components/ui'

export function AliasListPage(): ReactNode {
  const router = useRouter()
  const { data, isLoading, isError, refetch } = useAliases()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const members = data?.members ?? []
  const isEmpty = !isLoading && !isError && members.length === 0
  const isPopulated = !isLoading && !isError && members.length > 0

  return (
    <AliasPageLayout
      title="Alias"
      unit={data?.primaryAccount?.unit}
      isLoadingUnit={isLoading}
      onBack={() => router.history.back()}
    >
      {/* ── Page Content ── */}
      <div className="flex flex-1 flex-col gap-[16px]">
        {/* Error Banner if fetch failed */}
        {isError && (
          <AlertCard
            variant="error"
            title="Failed to load aliases"
            description="We encountered an issue loading your alias accounts. Please try again."
            action={{ label: 'Retry', onClick: refetch }}
          />
        )}

        {/* 1. Primary Account Card */}
        <PrimaryAccountCard account={data?.primaryAccount ?? null} isLoading={isLoading} />

        {/* 2. Create an alias Card */}
        <CreateAliasCard
          memberCount={members.length}
          maxLimit={10}
          onOpenWhatIsAliasModal={() => setIsModalOpen(true)}
          isLoading={isLoading}
        />

        {/* 3. Aliases Card */}
        <Card variant="flat" className="flex flex-col gap-2 rounded-xl p-5">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-dmsans text-body-base text-actionDark font-bold">Aliases</h2>
            {isEmpty ? (
              <span
                aria-disabled="true"
                className="font-dmsans text-body-small text-mutedOlive flex items-center gap-1 font-medium select-none"
              >
                View all
                <span
                  className="material-symbols-outlined text-[18px] font-bold"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </span>
            ) : (
              <Link
                to="/alias/all"
                className={cn(
                  'font-dmsans text-body-small text-actionDark flex items-center gap-1 font-semibold transition-opacity hover:opacity-80',
                  isLoading && 'pointer-events-none opacity-40',
                )}
              >
                View all
                <span
                  className="material-symbols-outlined text-[18px] font-bold"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </Link>
            )}
          </div>

          {/* Skeletons while loading */}
          {isLoading && (
            <div
              className="divide-stoneEdge/20 flex flex-col divide-y"
              aria-busy="true"
              aria-label="Loading aliases"
            >
              {[0, 1, 2].map((idx) => (
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

          {/* Empty state inside card */}
          {isEmpty && <AliasEmptyState variant="card" />}

          {/* Populated rows with dividers */}
          {isPopulated && (
            <div className="divide-stoneEdge/30 flex flex-col divide-y">
              {members.map((member) => (
                <AliasMemberRow key={member.id} member={member} />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── "What is Alias?" Modal ── */}
      <WhatIsAliasModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AliasPageLayout>
  )
}
