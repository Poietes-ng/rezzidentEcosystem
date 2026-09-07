import { Outlet, useLocation } from '@tanstack/react-router'
import { AppFrame } from './AppFrame'
import { HomeIndicator } from './HomeIndicator'

export function AppLayout() {
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
