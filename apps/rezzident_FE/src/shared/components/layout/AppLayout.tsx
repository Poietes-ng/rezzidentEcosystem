import { Outlet, useLocation } from '@tanstack/react-router'
import { AppFrame } from './AppFrame'
import { HomeIndicator } from './HomeIndicator'
import { AuthFlowProvider } from '#/features/auth/estate-registration'

export function AppLayout(): React.JSX.Element {
  const location = useLocation()
  const isSplash = location.pathname === '/app/splash'

  if (isSplash) {
    return <Outlet />
  }

  return (
    <AuthFlowProvider>
      <AppFrame>
        {/* The actual mobile screens will render here */}
        <Outlet />
        <HomeIndicator />
      </AppFrame>
    </AuthFlowProvider>
  )
}
