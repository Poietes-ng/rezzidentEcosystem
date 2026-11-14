import { useEffect, useRef } from 'react'
import { PermissionRow } from '../details/PermissionRow'
import type { ReactNode } from 'react'
import type { CreateAliasPermissionsStepProps } from '../../types/alias.types'
import { Button, Card } from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export function CreateAliasPermissionsStep({
  permissions,
  isSubmitting,
  onPermissionChange,
  onSubmit,
}: CreateAliasPermissionsStepProps): ReactNode {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  function handleCreateClick(): void {
    if (isSubmitting) return
    onSubmit()
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2
        id="create-alias-permissions-heading"
        ref={headingRef}
        tabIndex={-1}
        className="font-dmsans text-heading-2 text-actionDark mt-1 font-bold tracking-tight outline-none"
      >
        Set alias permissions
      </h2>
      <p className="font-dmsans text-body-base text-warmGray mt-2 leading-relaxed font-normal">
        Control which features this alias can access within the app.
      </p>

      <Card variant="flat" className="mt-8 flex flex-col gap-2 rounded-xl p-5">
        <div
          role="group"
          aria-labelledby="create-alias-permissions-heading"
          className={cn('flex flex-col gap-2', isSubmitting && 'pointer-events-none select-none')}
        >
          <PermissionRow
            id="create-perm-visitor-code"
            icon="doorbell_3p"
            label="Generate visitor code"
            checked={permissions.visitorCode}
            onCheckedChange={(val) => onPermissionChange('visitorCode', val)}
            disabled={isSubmitting}
          />
          <PermissionRow
            id="create-perm-estate-forum"
            icon="group_work"
            label="Estate forum"
            checked={permissions.forum}
            onCheckedChange={(val) => onPermissionChange('forum', val)}
            disabled={isSubmitting}
          />
          <PermissionRow
            id="create-perm-pay-bills"
            icon="payments"
            label="Pay bills"
            checked={permissions.bills}
            onCheckedChange={(val) => onPermissionChange('bills', val)}
            disabled={isSubmitting}
          />
        </div>
      </Card>

      <div className="mt-8">
        <Button
          type="button"
          variant="primary"
          loading={isSubmitting}
          aria-disabled={isSubmitting}
          onClick={handleCreateClick}
          className="w-full text-[16px] font-semibold"
        >
          Create Alias
        </Button>
      </div>
    </div>
  )
}
