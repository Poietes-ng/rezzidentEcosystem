import { createFileRoute } from '@tanstack/react-router'
import { AdminSignInForm } from '#/features/auth/admin-login'

export const Route = createFileRoute('/(auth)/admin-login')({
  head: () => ({
    meta: [
      { title: 'Admin Login — Rezzident' },
      {
        name: 'description',
        content: 'Sign in to your estate dashboard',
      },
    ],
  }),
  component: AdminSignInForm,
})
