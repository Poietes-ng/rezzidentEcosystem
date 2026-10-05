import { createFileRoute } from '@tanstack/react-router'
import { RegistrationCriteria } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/(auth)/registration-criteria')({
  head: () => ({
    meta: [
      { title: 'Registration — Rezzident' },
      {
        name: 'description',
        content: '',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [{ rel: 'canonical', href: 'https://www.Rezzident.co/registration/' }],
  }),
  component: RegistrationCriteria,
})
