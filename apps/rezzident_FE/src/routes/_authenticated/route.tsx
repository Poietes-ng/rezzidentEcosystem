import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Navigation } from '#/shared/components/layout/Navigation'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout(): ReactNode {
  const location = useLocation()
  const isUserDashboard =
    location.pathname === '/user-dashboard' || location.pathname.startsWith('/user-dashboard/')

  return (
    <div className="relative min-h-screen bg-white">
      {!isUserDashboard && <Navigation />}
      <Outlet />
    </div>
  )
}
