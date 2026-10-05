import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Navigation, Footer } from '#/shared/components/layout'

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
