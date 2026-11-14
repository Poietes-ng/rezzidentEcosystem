import type { ReactNode } from 'react'
import type { WhatIsAliasModalProps } from '../types/alias.types'
import { Modal } from '#/shared/components/ui'

export function WhatIsAliasModal({ open, onClose }: WhatIsAliasModalProps): ReactNode {
  return (
    <Modal open={open} onClose={onClose} titleId="what-is-alias-title" className="max-w-[360px]">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl">
        {/* Header with Title and Close X */}
        <div className="flex items-center justify-between">
          <h2
            id="what-is-alias-title"
            className="font-dmsans text-heading-3 text-actionDark font-bold"
          >
            What is Alias?
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-actionDark hover:bg-stoneEdge/20 focus-visible:ring-actionDark flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* Explanatory Paragraph — copied exactly from the Figma frame */}
        <p className="font-dmsans text-body-small text-warmGray text-left leading-relaxed">
          Alias allows you to create secondary accounts for trusted family members or other
          residents living with you. Each alias can access authorized estate services based on the
          permissions you grant. You can update or revoke access at any time, ensuring convenience
          without compromising security.
        </p>

        {/* Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="bg-actionDark hover:bg-actionDarkHover active:bg-actionDarkPressed font-dmsans text-body-base focus-visible:ring-actionDark mt-2 flex w-full items-center justify-center rounded-xl py-3.5 font-semibold text-white shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Done
        </button>
      </div>
    </Modal>
  )
}
