import { createFileRoute } from '@tanstack/react-router'
import { RegistrationForm } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/(auth)/registration')({
  head: () => ({
    meta: [
      { title: 'Register Your Estate — Rezzident' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: RegistrationForm,
})
