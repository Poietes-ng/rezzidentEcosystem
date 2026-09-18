import type React from 'react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { ErrorStateComponent } from '#/shared/components/ui'

export function AppErrorBoundary({ error, reset }: ErrorComponentProps): React.JSX.Element {
  const router = useRouter()
  const isForbidden =
    error?.message?.includes('403') || error?.message?.toLowerCase().includes('forbidden')

  if (isForbidden) {
    return (
      <ErrorStateComponent
        statusCode="403"
        title="Access Denied"
        description="You do not have permission to view this screen."
        icon="lock"
        actionText="Go Back"
        actionLink="/app/welcome"
      />
    )
  }

  return (
    <ErrorStateComponent
      statusCode="500"
      title="App Error"
      description="Something went wrong while loading this screen."
      icon="error"
      actionText="Try Again"
      onAction={() => {
        reset?.()
        router.invalidate()
      }}
    />
  )
}
