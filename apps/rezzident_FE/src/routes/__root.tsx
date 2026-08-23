import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { ErrorStateComponent } from '#/shared/components/ui/ErrorStateComponent'

import { ThemeProvider } from '#/shared/context/ThemeContext'
import { AuthProvider } from '#/features/auth/context/AuthContext'
import { DevelopmentBanner } from '#/shared/components/layout/DevelopmentBanner'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const SITE_URL = 'https://www.rezzident.co'
const OG_IMAGE =
  'https://res.cloudinary.com/tzdjufav/image/upload/v1/poietes/v1/try2.png'

// JSON-LD Structured Data for Google Rich Results & Sitelinks
const ORGANIZATION_SCHEMA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Poietes',
  url: SITE_URL,
  logo: 'https://res.cloudinary.com/tzdjufav/image/upload/v1/poietes/v1/poioteslogo.svg',
  description:
    'Rezzident Smart community living at your fingertips, Manage bills, visitors, and votes in one place, Report issues, and chat instantly.',
  foundingDate: '2025',
  sameAs: [
    'https://twitter.com/rezzident',
    'https://www.linkedin.com/company/poietes',
    'https://www.instagram.com/rezzident',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: `${SITE_URL}/contact`,
    availableLanguage: 'English',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NG',
    addressLocality: 'Abuja',
  },
  knowsAbout: [
    'software application',
    'mobile application',
    'web application',
    'smart community living',
    'estate management software',
    'residential community app',
    'manage bills',
    'manage visitors',
    'community voting',
    'report issues',
    'HOA software',
    'property management',
    'secure estate access',
    'digital community board',
    'resident chat',
  ],
})

const WEBSITE_SCHEMA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rezzident',
  url: SITE_URL,
  description:
    'Rezzident Smart community living at your fingertips, Manage bills, visitors, and votes in one place, Report issues, and chat instantly.',
  publisher: {
    '@type': 'Organization',
    name: 'Poietes',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Rezzident — Smart community living at your fingertips' },
      {
        name: 'description',
        content:
          'Rezzident Smart community living at your fingertips, Manage bills, visitors, and votes in one place, Report issues, and chat instantly.',
      },
      {
        name: 'keywords',
        content:
          'software application, mobile application, web application, smart community living, estate management software, residential community app, manage bills, manage visitors, community voting, report issues, HOA software, property management, secure estate access,digital community board,resident chat',
      },
      {
        name: 'robots',
        content:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'publisher', content: 'Poietes' },
      { name: 'author', content: 'Poietes' },
      { name: 'theme-color', content: '#fdc60a' },

      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Poietes' },
      {
        property: 'og:title',
        content: 'Rezzident - Smart community living at your fingertips.',
      },
      {
        property: 'og:description',
        content:
          'Rezzident Smart community living at your fingertips, Manage bills, visitors, and votes in one place, Report issues, and chat instantly.',
      },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: 'en_US' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Rezzident - Smart community living at your fingertips.',
      },
      {
        name: 'twitter:description',
        content:
          'Rezzident Smart community living at your fingertips, Manage bills, visitors, and votes in one place, Report issues, and chat instantly.',
      },
      { name: 'twitter:image', content: OG_IMAGE },
      { name: 'twitter:site', content: '@poietes' },
    ],
    links: [
      { rel: 'canonical', href: SITE_URL },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' } as any,
      {
        rel: 'preload',
        as: 'image',
        href: OG_IMAGE,
        fetchPriority: 'high',
      } as any,
    ],
  }),
  notFoundComponent: () => (
    <ErrorStateComponent
      statusCode="404"
      title="Page Not Found"
      description="The page you are looking for does not exist or has been moved."
      icon="search_off"
      actionText="Go Home"
      actionLink="/"
    />
  ),
  errorComponent: ({ error }) => {
    // If it's a 403 or permission error, we can show a specific message
    const isForbidden =
      error.message.includes('403') ||
      error.message.toLowerCase().includes('forbidden')
    if (isForbidden) {
      return (
        <ErrorStateComponent
          statusCode="403"
          title="Access Denied"
          description="You do not have permission to view this page."
          icon="lock"
          actionText="Go Back Home"
          actionLink="/"
        />
      )
    }
    return (
      <ErrorStateComponent
        statusCode="500"
        title="Something went wrong"
        description="We've encountered an unexpected error. Our team has been notified."
        icon="error"
        actionText="Try Again"
        onAction={() => window.location.reload()}
      />
    )
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="font-sans [overflow-wrap:anywhere] antialiased selection:bg-[rgba(79,184,178,0.24)]">
      <ThemeProvider>
        <AuthProvider>
          <DevelopmentBanner />
          <Outlet />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </AuthProvider>
      </ThemeProvider>
    </div>
  )
}
