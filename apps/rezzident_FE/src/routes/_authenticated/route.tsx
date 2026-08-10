import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Navigation } from '#/shared/components/layout/Navigation'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    // Note: context requires router configuration to pass auth state.
    // We'll just rely on the component or a simpler check for now, or if auth context is provided to the router.
    // We'll leave it simple for this template phase.
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="relative min-h-screen bg-white">
      <Navigation />
      <Outlet />
    </div>
  )
}
