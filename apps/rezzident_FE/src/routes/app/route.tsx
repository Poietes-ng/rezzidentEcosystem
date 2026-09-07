import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { ErrorStateComponent } from '../../shared/components/ui/ErrorStateComponent'

export const Route = createFileRoute('/app')({
  component: AppLayout,
  notFoundComponent: () => (
    <ErrorStateComponent
      statusCode="404"
      title="Page Not Found"
      description="The screen you're looking for doesn't exist."
      icon="search_off"
      actionText="Go to Welcome"
      actionLink="/app/welcome"
    />
  ),
  errorComponent: ({ error }) => {
    const isForbidden =
      error.message.includes('403') || error.message.toLowerCase().includes('forbidden')
    return (
      <ErrorStateComponent
        statusCode={isForbidden ? '403' : '500'}
        title={isForbidden ? 'Access Denied' : 'App Error'}
        description={
          isForbidden
            ? 'You do not have permission to view this screen.'
            : 'Something went wrong while loading this screen.'
        }
        icon={isForbidden ? 'lock' : 'error'}
        actionText={isForbidden ? 'Go Back' : 'Try Again'}
        {...(isForbidden
          ? { actionLink: '/app/welcome' }
          : { onAction: () => window.location.reload() })}
      />
    )
  },
})
