import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/features/home'

export const Route = createFileRoute('/(public)/home')({
    head: () => ({
        meta: [
            { title: 'About Rezzident — Our Mission, Team & Approach to Software Development' },
            {
                name: 'description',
                content: 'Learn about Rezzident — a growth engineering company building software solutions for businesses that think ahead. Meet our team and discover our mission to help ambitious companies scale through strategy, design, and technology.',
            },
            { property: 'og:title', content: 'About Rezzident — Our Mission, Team & Approach' },
            {
                property: 'og:description',
                content: 'Learn about Poietes — a growth engineering company building software solutions for businesses that think ahead.',
            },
            { property: 'og:url', content: 'https://www.rezzident.co/homepage' },
        ],
        links: [
            { rel: 'canonical', href: 'https://www.rezzident.co/homepage' },
        ],
    }),
    component: HomePage,
})