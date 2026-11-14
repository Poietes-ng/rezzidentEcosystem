import { useEffect, useRef } from 'react'
import { colors } from '@rezzident/design-tokens'
import { useInviteLink } from '../../hooks/useInviteLink'
import { useToastState } from '../../hooks/useToastState'
import { InviteLinkField } from '../details/InviteLinkField'
import type { ReactNode } from 'react'
import type { CreateAliasSuccessStepProps } from '../../types/alias.types'
import { Button, Toast } from '#/shared/components/ui'

export function CreateAliasSuccessStep({
  inviteCode,
  onDone,
}: CreateAliasSuccessStepProps): ReactNode {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { open, message, variant, show, close } = useToastState()

  const { copied, isSharing, handleCopy, handleShare } = useInviteLink({
    code: inviteCode,
    isExpired: false,
    showToast: show,
  })

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="flex flex-1 flex-col pt-4">
      <Toast open={open} message={message} variant={variant} onClose={close} />

      {/* Big Green Check */}
      <div className="flex flex-col items-center">
        <div
          className="bg-successGreen/20 flex h-[120px] w-[120px] items-center justify-center rounded-full"
          aria-hidden="true"
        >
          <div className="bg-successGreen flex h-[80px] w-[80px] items-center justify-center rounded-full">
            <span className="material-symbols-outlined text-[40px] font-bold text-white">
              check
            </span>
          </div>
        </div>

        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-dmsans text-heading-2 text-actionDark mt-7 max-w-[260px] text-center font-bold tracking-tight outline-none"
        >
          Alias created successfully
        </h2>

        <p className="font-dmsans text-body-base text-warmGray mt-3 max-w-[290px] text-center leading-relaxed font-normal">
          Share the link below with your alias to complete their account setup.
        </p>
      </div>

      {/* Invite Link Box + Expiry */}
      <div className="mt-7 flex flex-col">
        <InviteLinkField
          code={inviteCode}
          isExpired={false}
          copied={copied}
          onCopy={() => {
            void handleCopy()
          }}
        />
        <p className="font-dmsans text-slateGray mt-2.5 text-[14px] font-normal">
          Link expires in 24 hours
        </p>
      </div>

      {/* Share Code + Done Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outlined"
          loading={isSharing}
          loadingText="Sharing..."
          onClick={() => {
            void handleShare()
          }}
          buttonStyle={{
            bgColor: colors.lightCream,
            textColor: colors.actionDark,
            borderColor: colors.chatArea,
            hoverBgColor: colors.offWhite,
            pressedBgColor: colors.chatArea,
          }}
          className="w-full text-[16px] font-semibold"
        >
          Share Code
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={onDone}
          className="w-full text-[16px] font-semibold"
        >
          Done
        </Button>
      </div>
    </div>
  )
}
