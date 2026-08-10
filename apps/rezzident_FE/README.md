
  # Rezzident Ecosystem

  This repo serve as the official website for poietes organization, it utilizes the tanstack ecosystem of type-safe and it's framework-agnostic libraries, including:

  - TanStack Query – data fetching/caching
  - TanStack Router – type-safe routing
  - TanStack Table – headless table/datagrid logic
  - TanStack Form – form state management
  - TanStack Virtual – list/grid virtualization
  - TanStack Start – a full-stack framework

  This project's foundation will be built on TanStack Start with the Feature-Based Architecture System, also known as [Bulletproof React](https://github.com/alan2207/bulletproof-react).
  
  ## Tanstack Start
  A full-stack React [framework](https://tanstack.com/start/latest/docs/framework/react/getting-started) built on top of TanStack Router. It adds things a router alone doesn't have:

  - Server-side rendering (SSR)
  - Full-document SSR streaming
  - Server functions (RPC-style server/client code)
  - API routes

  ## Project Architecture: Feature-Based (Bulletproof React)
  ***Origin & Philosophy***
  Popularized by [Bulletproof React (28k+ GitHub stars)](https://github.com/alan2207/bulletproof-react), this is the most widely recommended pattern in the React community for production applications. The core idea: organize by what the code does for the user (feature), not what it is technically (component, hook, etc.).

  Every feature is a self-contained module with its own components, hooks, services, and types. Features communicate through explicit public APIs (barrel exports). This means you can add, modify, or delete an entire feature by touching only one folder.

  ***Core idea***: A feature folder is a mini-application. Everything that feature needs lives inside it.

  ### KeyNote of structure
  ***Think of the whole frontend as a restaurant.***

    - routes/ is the front-of-house menu board. It just says what page you're on and what to show — it doesn't cook anything. When you visit /pricing, the route file's job is just: "go fetch the pricing data, then hand it to the pricing page component."

    - features/ is the kitchen, organized by station. There's a pricing station, a products station, an auth station. Each one has everything it needs to do its job — its own components, its own way of fetching its own data — and nobody from another station reaches into it directly.

    - shared/ is the walk-in fridge and shared equipment — the stuff every station uses (buttons, the network client, date formatters). No station "owns" it; everyone pulls from it.

    - server/ is the one locked cabinet with the safe combination — used only for the rare thing a waiter (the browser) genuinely can't handle themselves, like reading a cookie the browser can't peek at.
    The FastAPI backend is a completely separate restaurant across the street that actually grows the food (owns the database). Your kitchen calls over there for ingredients — it never grows its own.

  ```
    src/
    ├── routes/                              # ★ THIN — loader + composition only, no business logic
    │   ├── __root.tsx                        # Root layout: <html>, providers, global error boundary
    │   ├── index.tsx                         # "/"
    │   ├── pricing.tsx                       # "/pricing" — loader + <PricingPage/>
    │   │
    │   ├── products/
    │   │   ├── route.tsx                     # Optional shared layout for /products/*
    │   │   ├── index.tsx                     # "/products"
    │   │   └── $productId.tsx                # "/products/:productId"
    │   │
    │   ├── (auth)/                           # Route GROUP — no URL segment, just organizes files
    │   │   ├── route.tsx                     # Shared centered-card auth layout
    │   │   ├── sign-in.tsx                   # "/sign-in"
    │   │   └── sign-up.tsx                   # "/sign-up"
    │   │
    │   └── _authenticated/                   # Pathless layout — guards every nested route at once
    │       ├── route.tsx                     # beforeLoad: verify session → redirect if unauthenticated
    │       ├── dashboard.tsx                 # "/dashboard"
    │       └── profile.tsx                   # "/profile"
    │
    ├── features/                             # ★ THE CORE
    │   │
    │   ├── auth/
    │   │   ├── components/
    │   │   │   ├── SignInForm.tsx
    │   │   │   ├── SignUpForm.tsx
    │   │   │   └── AuthGuard.tsx             # Optional extra client-side check inside protected pages
    │   │   ├── hooks/
    │   │   │   └── useAuth.ts                # Reads session state, exposes login()/logout()
    │   │   ├── api/
    │   │   │   └── authQueries.ts            # POST /api/v1/auth/login, /register, /logout
    │   │   ├── types/
    │   │   │   └── auth.types.ts             # User, LoginPayload, RegisterPayload
    │   │   └── index.ts                      # ★ PUBLIC API — barrel export
    │   │
    │   ├── pricing/
    │   │   ├── api/
    │   │   │   └── getPricingPlans.ts        # GET /api/v1/pricing → called from route loader
    │   │   ├── components/
    │   │   │   └── PricingPage.tsx           # Presentational, receives loader data as props
    │   │   ├── types/
    │   │   │   └── pricing.types.ts
    │   │   └── index.ts
    │   │
    │   ├── products/
    │   │   ├── api/
    │   │   │   └── productQueries.ts         # GET /api/v1/products?skip=&limit=
    │   │   ├── components/
    │   │   │   ├── ProductList.tsx
    │   │   │   └── ProductDetail.tsx
    │   │   ├── types/
    │   │   │   └── product.types.ts
    │   │   └── index.ts
    │   │
    │   └── dashboard/
    │       ├── api/
    │       ├── components/
    │       ├── hooks/
    │       └── index.ts
    │
    ├── server/                               # ★ ONLY what the client genuinely cannot do itself
    │   └── functions/
    │       ├── session.ts                    # createServerFn — reads httpOnly session cookie during SSR
    │       └── secureUpload.ts               # createServerFn — signs uploads using a server-only secret
    │
    ├── shared/                               # Cross-cutting, no business logic
    │   ├── components/
    │   │   ├── ui/                           # shadcn/ui primitives (Button, Input, Modal, Card…)
    │   │   └── layout/                       # Header, Footer, Sidebar, PageWrapper
    │   ├── hooks/
    │   │   ├── useMediaQuery.ts
    │   │   └── useDebounce.ts
    │   ├── utils/
    │   │   ├── cn.ts
    │   │   └── validators.ts
    │   ├── types/
    │   │   └── api.types.ts                  # ★ ApiResponse<T>, Paginated<T> — mirrors FastAPI envelope
    │   ├── lib/
    │   │   ├── apiClient.ts                  # ★ Axios instance → FastAPI, envelope unwrap, guard-aware errors
    │   │   └── queryClient.ts                # TanStack Query client (only if cross-route sharing is needed)
    │   ├── constants/
    │   │   └── config.ts                     # API_BASE_URL, APP_NAME, ENVIRONMENT
    │   └── assets/
    │
    ├── router.tsx                            # createRouter() — defaultStaleTime, defaultPreload
    ├── routeTree.gen.ts                      # ★ AUTO-GENERATED — never hand-edit, git-ignorable
    ├── entry-client.tsx
    └── entry-server.tsx
  ```


  
  
  ## Welcome to your new TanStack Start app! 
  
  # Getting Started
  
  To run this application:
  
  ```bash
  npm install
  npm run dev
  ```
  
  # Building For Production
  
  To build this application for production:
  
  ```bash
  npm run build
  ```
  
  ## Testing
  
  This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:
  
  ```bash
  npm run test
  ```
  
  ## Styling
  
  This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.
  
  ### Removing Tailwind CSS
  
  If you prefer not to use Tailwind CSS:
  
  1. Remove the demo pages in `src/routes/demo/`
  2. Replace the Tailwind import in `src/styles.css` with your own styles
  3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
  4. Uninstall the packages: `npm install @tailwindcss/vite tailwindcss -D`
  
  ## Linting & Formatting
  
  
  This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:
  
  ```bash
  npm run lint
  npm run format
  npm run check
  ```
  
  
  
  ## Routing
  
  This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.
  
  ### Adding A Route
  
  To add a new route to your application just add a new file in the `./src/routes` directory.
  
  TanStack will automatically generate the content of the route file for you.
  
  Now that you have two routes you can use a `Link` component to navigate between them.
  
  ### Adding Links
  
  To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.
  
  ```tsx
  import { Link } from "@tanstack/react-router";
  ```
  
  Then anywhere in your JSX you can use it like so:
  
  ```tsx
  <Link to="/about">About</Link>
  ```
  
  This will create a link that will navigate to the `/about` route.
  
  More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).
  
  ### Using A Layout
  
  In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.
  
  Here is an example layout that includes a header:
  
  ```tsx
  import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
  
  export const Route = createRootRoute({
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'My App' },
      ],
    }),
    shellComponent: ({ children }) => (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <header>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
            </nav>
          </header>
          {children}
          <Scripts />
        </body>
      </html>
    ),
  })
  ```
  
  More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).
  
  ## Server Functions
  
  TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.
  
  ```tsx
  import { createServerFn } from '@tanstack/react-start'
  
  const getServerTime = createServerFn({
    method: 'GET',
  }).handler(async () => {
    return new Date().toISOString()
  })
  
  // Use in a component
  function MyComponent() {
    const [time, setTime] = useState('')
    
    useEffect(() => {
      getServerTime().then(setTime)
    }, [])
    
    return <div>Server time: {time}</div>
  }
  ```
  
  ## API Routes
  
  You can create API routes by using the `server` property in your route definitions:
  
  ```tsx
  import { createFileRoute } from '@tanstack/react-router'
  import { json } from '@tanstack/react-start'
  
  export const Route = createFileRoute('/api/hello')({
    server: {
      handlers: {
        GET: () => json({ message: 'Hello, World!' }),
      },
    },
  })
  ```
  
  ## Data Fetching
  
  There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.
  
  For example:
  
  ```tsx
  import { createFileRoute } from '@tanstack/react-router'
  
  export const Route = createFileRoute('/people')({
    loader: async () => {
      const response = await fetch('https://swapi.dev/api/people')
      return response.json()
    },
    component: PeopleComponent,
  })
  
  function PeopleComponent() {
    const data = Route.useLoaderData()
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    )
  }
  ```
  
  Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).
  
  # Demo files
  
  Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.
  
  # Learn More
  
  You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
  
  For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
