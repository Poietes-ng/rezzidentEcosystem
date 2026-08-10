import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '#/features/about'

export const Route = createFileRoute('/(public)/about')({
  head: () => ({
    meta: [
      { title: 'About Rezzident — Rezzident — Smart community living at your fingertips.' },
      {
        name: 'description',
        content: 'Rezzident — Smart community living at your fingertips, Manage bills, visitors, and votes in one place, Report issues, and chat instantly.',
      },
      { property: 'og:title', content: 'About Rezzident — Our Mission, Team & Approach' },
      {
        property: 'og:description',
        content: 'Rezzident — Smart community living at your fingertips.',
      },
      { property: 'og:url', content: 'https://www.rezzident.co/about' },
    ],
    links: [
      { rel: 'canonical', href: 'https://www.rezzident.co/about' },
    ],
  }),
  component: AboutPage,
})
