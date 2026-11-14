import { InviteExpiryText } from './InviteExpiryText'
import { InviteLinkField } from './InviteLinkField'
import type { ReactNode } from 'react'
import type { InviteLinkCardProps } from '../../types/alias.types'
import { Button } from '#/shared/components/ui'

export function InviteLinkCard({
  code,
  expiresAt,
  isExpired,
  copied,
  isSharing = false,
  isRegenerating = false,
  onCopy,
  onShare,
  onRegenerate,
  onExpire,
}: InviteLinkCardProps): ReactNode {
  return (
    <section className="flex flex-col gap-3.5 py-1" aria-labelledby="alias-account-link-heading">
      <div className="flex flex-col gap-1.5">
        <h2
          id="alias-account-link-heading"
          className="font-dmsans text-heading-3 text-actionDark leading-tight font-bold"
        >
          Alias account link
        </h2>
        <p className="font-dmsans text-warmGray text-[14px] leading-relaxed font-normal">
          {isExpired
            ? 'Your previous alias link has expired. Generate a new link to share with your alias so they can access your Rezzident account.'
            : 'Share this link with your alias to grant them access to your Rezzident account.'}
        </p>
      </div>

      <InviteLinkField code={code} isExpired={isExpired} copied={copied} onCopy={onCopy} />

      <InviteExpiryText expiresAt={expiresAt} onExpire={onExpire} />

      <div className="pt-1">
        {isExpired ? (
          <Button
            variant="primary"
            loading={isRegenerating}
            loadingText="Generating link..."
            onClick={onRegenerate}
            className="h-[52px] w-full rounded-2xl text-[16px] font-bold"
          >
            Re-generate Link
          </Button>
        ) : (
          <Button
            variant="primary"
            loading={isSharing}
            loadingText="Sharing..."
            onClick={onShare}
            className="h-[52px] w-full rounded-2xl text-[16px] font-bold"
          >
            Share Link
          </Button>
        )}
      </div>
    </section>
  )
}
