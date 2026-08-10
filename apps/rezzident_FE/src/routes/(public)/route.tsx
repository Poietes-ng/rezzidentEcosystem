import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Navigation } from '#/shared/components/layout/Navigation'
import Footer from '#/shared/components/layout/Footer'

export const Route = createFileRoute('/(public)')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="relative min-h-screen bg-white">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  )
}
