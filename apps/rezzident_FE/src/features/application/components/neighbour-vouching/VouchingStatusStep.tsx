import React, { useState } from 'react'
import { NeighbourCard } from './NeighbourCard'
import type { NeighbourVouch } from './neighbour-vouching.types'
import { Button } from '#/shared/components/ui'

export interface VouchingStatusStepProps {
  currentStep: number
  totalSteps: number
  vouchCount: 0 | 1 | 2
  neighbours: NeighbourVouch[]
  onRefresh: () => void
  onContinue: () => void
}

export function VouchingStatusStep({
  currentStep,
  totalSteps,
  vouchCount,
  neighbours,
  onRefresh,
  onContinue,
}: VouchingStatusStepProps): React.JSX.Element {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const isComplete = vouchCount === 2

  // Title and subtitle dynamic based on vouch count
  const getHeaderInfo = () => {
    switch (vouchCount) {
      case 0:
        return {
          title: 'Vouching status',
          subtitle:
            'You need at least 2 neighbours to vouch for you before you can access the app.',
        }
      case 1:
        return {
          title: 'Vouching status',
          subtitle: 'Almost there! 1 more neighbour needs to vouch for you.',
        }
      case 2:
      default:
        return {
          title: 'Vouching complete',
          subtitle: "Both neighbours have vouched for you. You're all set to continue!",
        }
    }
  }

  const { title, subtitle } = getHeaderInfo()

  const handleRefreshClick = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      onRefresh()
      setIsRefreshing(false)
    }, 600)
  }

  return (
    <div className="font-dmsans flex w-full flex-col px-6 pt-2 pb-8">
      {/* ── Top Content ── */}
      <div>
        {/* ── Section Title ── */}
        <span className="font-dmsans text-warmGray block text-[14px] font-semibold tracking-wider uppercase">
          Step {currentStep} of {totalSteps}
        </span>
        <h1 className="font-dmsans text-actionDark mt-1 text-[32px] leading-tight font-bold sm:text-[32px]">
          {title}
        </h1>
        <p className="text-warmGray mt-2 text-[16px] leading-relaxed">{subtitle}</p>

        {/* ── Vouching Progress Section ── */}
        <div className="mt-8">
          <span className="font-dmsans text-slateGray block text-[11px] font-semibold tracking-wider uppercase">
            Vouching Progress
          </span>
          <h2 className="font-dmsans text-actionDark mt-1 text-[16px] font-bold">
            {vouchCount} of 2 neighbours vouched
          </h2>

          {/* ── Neighbour Cards List ── */}
          <div className="divide-mutedOlive mt-4 divide-y">
            {neighbours.map((neighbour, index) => (
              <NeighbourCard
                key={neighbour.id}
                neighbour={neighbour}
                index={index}
                showDivider={index < neighbours.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mt-8">
        {isComplete ? (
          <Button
            type="button"
            onClick={onContinue}
            className="bg-actionDark hover:bg-actionDarkHover active:bg-actionDarkPressed h-[56px] w-full rounded-[12px] text-[16px] font-medium text-white transition-colors"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="bg-actionDark hover:bg-actionDarkHover active:bg-actionDarkPressed flex h-[56px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-medium text-white transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
            <span>{isRefreshing ? 'Checking...' : 'Refresh Status'}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
