import { useRouter } from '@tanstack/react-router'
import { ErrorStateComponent } from '../ui/ErrorStateComponent'

interface AppErrorBoundaryProps {
  error: Error
}

export function AppErrorBoundary({ error }: AppErrorBoundaryProps) {
  const router = useRouter()
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
        : { onAction: () => router.invalidate() })}
    />
  )
}
