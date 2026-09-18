import React from 'react'
import type { NeighbourVouch } from './neighbour-vouching.types'
import { cn } from '#/shared/utils/cn'

export interface NeighbourCardProps {
  neighbour: NeighbourVouch
  index: number
  showDivider?: boolean
}

export function NeighbourCard({
  neighbour,
  index,
  showDivider = true,
}: NeighbourCardProps): React.JSX.Element {
  const isVouched = neighbour.status === 'vouched'

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-3.5">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          {isVouched && neighbour.avatarUrl ? (
            <img
              src={neighbour.avatarUrl}
              alt={neighbour.name}
              className="h-11 w-11 rounded-lg object-cover shadow-xs"
            />
          ) : (
            <div className="bg-offWhite text-slateGray flex h-11 w-11 items-center justify-center rounded-lg">
              <span className="text-warningGold text-[16px] font-medium">—</span>
            </div>
          )}

          {/* Name & Unit */}
          <div className="flex flex-col">
            <span className="font-dmsans text-actionDark text-[15px] leading-tight font-bold">
              {isVouched ? neighbour.name : 'Awaiting'}
            </span>
            <span className="font-dmsans text-warmGray mt-0.5 text-[13px] leading-tight">
              {isVouched ? neighbour.unit : `Neighbour ${index + 1}`}
            </span>
          </div>
        </div>

        {/* Right: Status Badge */}
        <div>
          {isVouched ? (
            <div className="text-successGreen flex items-center gap-1 text-[14px] font-medium">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Vouched</span>
            </div>
          ) : (
            <span className="border-warningGold/40 bg-inputBg/60 font-dmsans text-warningGold inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-medium">
              Pending
            </span>
          )}
        </div>
      </div>

      {showDivider && <div className="bg-stoneEdge/30 h-[1px] w-full" />}
    </div>
  )
}
