import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/features/home'

export const Route = createFileRoute('/(public)/')({
  head: () => ({
    meta: [
      { title: 'Rezzident — Smart community living at your fingertips.' },
      {
        name: 'description',
        content: 'Rezzident Smart community living at your fingertips, Manage bills, visitors, and votes in one place, Report issues, and chat instantly.',
      },
      { property: 'og:title', content: 'Rezzident — Smart community living at your fingertips.' },
      {
        property: 'og:description',
        content: 'Rezzident Smart community living at your fingertips, Manage bills, visitors, and votes in one place, Report issues, and chat instantly.',
      },
      { property: 'og:url', content: 'https://www.rezzident.co' },
    ],
    links: [
      { rel: 'canonical', href: 'https://www.rezzident.co' },
    ],
  }),
  component: HomePage,
})
