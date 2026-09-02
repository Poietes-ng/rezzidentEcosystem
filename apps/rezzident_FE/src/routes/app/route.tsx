import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { AppFrame } from '../../shared/components/layout/AppFrame'
import { HomeIndicator } from '../../shared/components/layout/HomeIndicator'

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
        onAction={() => window.location.reload()}
      />
    )
  },
})

function AppLayout() {
  const location = useLocation()
  const isSplash = location.pathname === '/app/splash'

  if (isSplash) {
    return <Outlet />
  }

  return (
    <AppFrame>
      {/* The actual mobile screens will render here */}
      <Outlet />
      <HomeIndicator />
    </AppFrame>
  )
}
