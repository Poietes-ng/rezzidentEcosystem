import { useNavigate, useParams } from '@tanstack/react-router'
import { CONFIRM_MODAL_CONFIGS } from '../../constants/confirmModals'
import { useAliasDetails } from '../../hooks/useAliasDetails'
import { useAliasDetailsActions } from '../../hooks/useAliasDetailsActions'
import { useInviteLink } from '../../hooks/useInviteLink'
import { usePermissionsDraft } from '../../hooks/usePermissionsDraft'
import { getAliasUiState, resolveAliasStatus } from '../../utils/aliasUiState'
import { AliasPageLayout } from '../AliasPageLayout'
import { AliasActionBar } from './AliasActionBar'
import { AliasProfileCard } from './AliasProfileCard'
import { ConfirmActionModal } from './ConfirmActionModal'
import { InviteLinkCard } from './InviteLinkCard'
import { PermissionsCard } from './PermissionsCard'
import type { ReactNode } from 'react'
import { AlertCard, Toast } from '#/shared/components/ui'

export function AliasDetailsPage(): ReactNode {
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const aliasId = params.aliasId ?? ''

  const { data, isLoading, isError, notFound, refetch } = useAliasDetails(aliasId)

  const { draft, isDirty, toggle, reset, setSaved } = usePermissionsDraft(data?.member.permissions)

  const {
    activeModal,
    openModal,
    closeModal,
    toast,
    isSubmitting,
    handleUpdatePermissions,
    handleConfirmModal,
    handleRegenerateInvite,
  } = useAliasDetailsActions({
    aliasId,
    draft,
    setSaved,
    resetDraft: reset,
  })

  const memberStatus = data?.member ? resolveAliasStatus(data.member) : undefined
  const uiState = memberStatus ? getAliasUiState(memberStatus, isDirty) : null

  const inviteCode = data?.member.invite?.code ?? ''
  const inviteExpiresAt = data?.member.invite?.expiresAt ?? ''
  const isInviteExpired = memberStatus === 'expired'

  const { copied, isSharing, handleCopy, handleShare } = useInviteLink({
    code: inviteCode,
    isExpired: isInviteExpired,
    showToast: (msg, variant) => toast.show(msg, variant),
  })

  const currentMember = data
    ? { ...data.member, permissions: draft, status: memberStatus ?? data.member.status }
    : null

  const modalConfig = activeModal ? CONFIRM_MODAL_CONFIGS[activeModal] : null

  return (
    <AliasPageLayout title="Alias Details" unit={data?.primaryAccount.unit}>
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-5 px-4 pt-4 pb-28 md:max-w-[560px] md:px-0">
        {isLoading && (
          <div role="status" aria-label="Loading alias details" className="flex flex-col gap-4">
            <div className="bg-stoneEdge/20 h-44 w-full animate-pulse rounded-2xl" />
            <div className="bg-stoneEdge/20 h-48 w-full animate-pulse rounded-2xl" />
          </div>
        )}

        {isError && (
          <AlertCard
            variant="error"
            title="Couldn't load alias details"
            description="Something went wrong while retrieving the details for this alias. Please check your connection and try again."
            action={{
              label: 'Try Again',
              onClick: () => {
                void refetch()
              },
            }}
          />
        )}

        {notFound && (
          <AlertCard
            variant="warning"
            title="Alias not found"
            description="We couldn't find an alias account matching this link. It may have been removed or you may have followed an incorrect address."
            action={{
              label: 'Back to Aliases',
              onClick: () => {
                void navigate({ to: '/alias' })
              },
            }}
          />
        )}

        {data && currentMember && (
          <>
            <AliasProfileCard member={currentMember} />

            {(memberStatus === 'pending' || memberStatus === 'expired') && (
              <InviteLinkCard
                code={inviteCode}
                expiresAt={inviteExpiresAt}
                isExpired={isInviteExpired}
                copied={copied}
                isSharing={isSharing}
                onCopy={handleCopy}
                onShare={handleShare}
                onRegenerate={handleRegenerateInvite}
              />
            )}

            <PermissionsCard
              permissions={draft}
              disabled={uiState?.isSwitchesLocked ?? true}
              onChange={toggle}
            />

            {memberStatus && (
              <AliasActionBar
                status={memberStatus}
                isDirty={isDirty}
                isUpdating={isSubmitting}
                onUpdatePermissions={handleUpdatePermissions}
                onDeactivate={() => openModal('deactivate')}
                onReactivate={() => openModal('reactivate')}
                onDelete={() => openModal('delete')}
                onCancelProcess={() => openModal('cancel-invite')}
              />
            )}
          </>
        )}
      </div>

      {modalConfig && (
        <ConfirmActionModal
          open={Boolean(activeModal)}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmLabel={modalConfig.confirmLabel}
          tone={modalConfig.tone}
          cancelLabel={modalConfig.cancelLabel}
          isLoading={isSubmitting}
          onConfirm={handleConfirmModal}
          onClose={closeModal}
        />
      )}

      <Toast
        open={toast.isOpen}
        onClose={toast.hide}
        message={toast.message}
        variant={toast.variant}
      />
    </AliasPageLayout>
  )
}
