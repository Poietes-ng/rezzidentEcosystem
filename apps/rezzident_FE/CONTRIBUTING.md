# Contributing to Rezzident

Thank you for your interest in contributing to Rezzident! This document explains how to contribute effectively, the code style we follow, and the architectural rules that keep the codebase healthy.

> **First time?** Start by reading the [Restructuring Guide](./docs/RESTRUCTURING_GUIDE.md) to understand our Feature-Based Architecture before writing any code.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Code Style Guide](#code-style-guide)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Adding a New Feature](#adding-a-new-feature)
- [Adding a New Route](#adding-a-new-route)
- [Working with Shared Code](#working-with-shared-code)
- [Working with Assets](#working-with-assets)
- [Testing](#testing)
- [Common Pitfalls](#common-pitfalls)

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x (comes with Node)
- **Git** ≥ 2.x
- A code editor with TypeScript support (VS Code recommended)

### Recommended VS Code Extensions

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- TypeScript Error Translator (`mattpocock.ts-error-translator`)

---

## Development Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/<your-username>/rezzidentEcosystem.git
cd ezzidentEcosystem

# 3. Add the upstream remote
git remote add upstream https://github.com/poietes/ezzidentEcosystem.git

# 4. Install dependencies
npm install

# 5. Start the dev server
npm run dev

# 6. The app will be available at http://localhost:3000
```

### Available Scripts

| Command                   | Description                                 |
| ---------------------------| ---------------------------------------------|
| `npm run dev`             | Start development server on port 3000       |
| `npm run build`           | Build for production                        |
| `npm run preview`         | Preview the production build                |
| `npm run test`            | Run tests with Vitest                       |
| `npm run lint`            | Check for lint errors                       |
| `npm run format`          | Format code with Prettier + ESLint auto-fix |
| `npm run check`           | Check formatting without modifying files    |
| `npm run generate-routes` | Regenerate TanStack Router route tree       |

---

## Project Architecture

We follow the **Feature-Based Architecture** pattern (also known as [Bulletproof React](https://github.com/alan2207/bulletproof-react)). The key idea: **organise by what the code does for the user (feature), not what it is technically (component, hook, etc.)**.

### Directory Structure Overview

```
src/
├── routes/          # URL → page mapping (thin: loader + component only)
├── features/        # Business domains (home, auth, products, etc.)
├── shared/          # Cross-cutting code (UI primitives, layout, utils)
├── server/          # TanStack Start server functions
├── styles/          # Global CSS
├── router.tsx       # Router configuration
└── routeTree.gen.ts # Auto-generated (never edit)
```

### The 5 Import Rules

These are **non-negotiable**. Every PR is checked against them.

```
1. routes/       → CAN import from features/ and shared/
2. features/X/   → CAN import from shared/ and features/X/ (itself)
3. features/X/   → CANNOT import from features/Y/ (another feature)
4. shared/        → CAN import from shared/ only (never features/)
5. server/        → CAN import from shared/ only
```

If two features need to share something, move it to `shared/`.

### The Barrel Export Rule

Every feature has an `index.ts` that acts as its public API. **Always import from the barrel:**

```tsx
// ✅ Correct
import { HomePage } from '#/features/home'

// ❌ Wrong — reaching into feature internals
import { HeroSection } from '#/features/home/components/HeroSection'
```

---

## Code Style Guide

### General Principles

1. **Readability over cleverness** — Write code that a junior developer can understand.
2. **Explicit over implicit** — Name things clearly. `getUserById` not `get`.
3. **Small files** — If a file exceeds ~250 lines, consider splitting it.
4. **No dead code** — Don't commit commented-out code. Use git history instead.

### TypeScript

#### Prefer `interface` over `type` for object shapes

```tsx
// ✅ Preferred
interface User {
  id: string
  name: string
  email: string
}

// ❌ Avoid for object shapes
type User = {
  id: string
  name: string
  email: string
}
```

Use `type` for unions, intersections, and computed types:

```tsx
// ✅ Correct use of type
type ThemeMode = 'light' | 'dark' | 'auto'
type ButtonVariant = 'primary' | 'secondary' | 'ghost'
```

#### Always type function parameters and return values for exports

```tsx
// ✅ Explicit return type for exported functions
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// Internal/private helper functions don't need explicit return types
function doubleIt(n: number) {
  return n * 2
}
```

#### Use `import type` for type-only imports

```tsx
// ✅ Correct — makes it clear this is erased at runtime
import type { User } from '#/features/auth'

// ❌ Avoid — import looks like a runtime dependency
import { User } from '#/features/auth'
```

#### No `any` — use `unknown` and narrow

```tsx
// ✅ Safe
function parseResponse(data: unknown): User {
  if (typeof data === 'object' && data !== null && 'id' in data) {
    return data as User
  }
  throw new Error('Invalid user data')
}

// ❌ Dangerous
function parseResponse(data: any): User {
  return data
}
```

### React Components

#### Use function declarations for components

```tsx
// ✅ Preferred — hoisted, clear in stack traces
export function HeroSection() {
  return <section>...</section>
}

// ❌ Avoid for top-level components
const HeroSection = () => {
  return <section>...</section>
}
```

Arrow functions are fine for:
- Inline callbacks: `onClick={() => setOpen(true)}`
- Array methods: `items.map((item) => <li key={item.id}>{item.name}</li>)`
- Small internal helpers within a component

#### Props interface naming

```tsx
// ✅ Name props after the component
interface HeroSectionProps {
  title: string
  subtitle?: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  // ...
}
```

#### Destructure props in the function signature

```tsx
// ✅ Destructure in signature
export function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

// ❌ Avoid — harder to read
export function Card(props: CardProps) {
  return (
    <div>
      <h2>{props.title}</h2>
      {props.children}
    </div>
  )
}
```

#### One component per file

Each `.tsx` file should export **one** main component. Small sub-components used only within that file are fine to keep in the same file, but should not be exported.

```tsx
// HeroSection.tsx

// ✅ Internal helper — not exported
function AnimatedBadge({ text }: { text: string }) {
  return <span className="badge">{text}</span>
}

// ✅ Main component — exported
export function HeroSection() {
  return (
    <section>
      <AnimatedBadge text="2026" />
      {/* ... */}
    </section>
  )
}
```

### Hooks

#### Naming: always start with `use`

```tsx
// ✅ Correct
export function useMediaQuery(query: string): boolean { ... }
export function useAuth(): AuthContextValue { ... }
export function useScrollAnimation(ref: RefObject<HTMLElement>): boolean { ... }

// ❌ Wrong — not a valid hook name
export function getMediaQuery(query: string): boolean { ... }
```

#### Extract complex logic into custom hooks

If a component has more than 2-3 `useState` + `useEffect` combos related to the same concern, extract them:

```tsx
// ❌ Before — too much state logic in the component
function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => { /* validation */ }, [email, password])
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    // ...20 lines of submit logic
  }
  
  return <form>...</form>
}

// ✅ After — logic extracted into a hook
function SignInForm() {
  const { email, setEmail, password, setPassword, errors, isSubmitting, handleSubmit } = useAuthForm()
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### Context

#### Always provide a custom consumer hook

```tsx
// ✅ Complete context module
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // ...state logic
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook with error boundary
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>')
  }
  return context
}
```

**Never export the raw context object.** Only export the Provider and the consumer hook.

### Styling (Tailwind CSS)

#### Use Tailwind utility classes directly

```tsx
// ✅ Tailwind utilities in className
<button className="rounded-full bg-[#FF6730] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#e55a28]">
  Submit
</button>
```

#### Use the `cn()` utility for conditional classes

```tsx
import { cn } from '#/shared/utils/cn'

<button className={cn(
  "rounded-full px-6 py-3 text-sm font-semibold transition-all",
  variant === 'primary' && "bg-[#FF6730] text-white hover:bg-[#e55a28]",
  variant === 'secondary' && "border border-gray-200 text-gray-900 hover:bg-gray-50",
  disabled && "opacity-50 cursor-not-allowed"
)}>
  {children}
</button>
```

#### Colour tokens

Use our brand colours consistently:

| Colour | Hex | Usage |
|--------|-----|-------|
| Primary Orange | `#FF6730` | CTAs, links, accents |
| Primary Yellow | `#FDC60A` | Secondary CTAs, highlights |
| Dark Text | `#1A1A1A` | Headings, primary text |
| Muted Text | `#818181` | Descriptions, secondary text |
| Background | `#FFFFFF` | Page background |
| Light BG | `#FAFAFA` | Card backgrounds, sections |

#### No inline styles unless animating

```tsx
// ✅ OK — dynamic animation values
<div style={{
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
  transition: 'all 0.8s ease-out',
}}>

// ❌ Avoid — use Tailwind instead
<div style={{ padding: '16px', fontSize: '14px', color: '#818181' }}>
```

### File Naming Conventions

| Type           | Convention                                      | Example                              |
| ----------------| -------------------------------------------------| --------------------------------------|
| Components     | `PascalCase.tsx`                                | `HeroSection.tsx`                    |
| Hooks          | `camelCase.ts` (starts with `use`)              | `useAuth.ts`                         |
| Context        | `PascalCase.tsx` (ends with `Context`)          | `ThemeContext.tsx`                   |
| Utils          | `camelCase.ts`                                  | `cn.ts`, `formatDate.ts`             |
| Type files     | `kebab-case.types.ts`                           | `auth.types.ts`                      |
| Constants      | `camelCase.ts` (contents use `SCREAMING_SNAKE`) | `config.ts`                          |
| Assets         | `kebab-case`                                    | `poiotes-logo.svg`                   |
| Route files    | `kebab-case.tsx`                                | `sign-in.tsx`, `$productId.tsx`      |
| CSS files      | `kebab-case.css`                                | `globals.css`                        |
| Test files     | `*.test.ts(x)` or `*.spec.ts(x)`                | `useAuth.test.ts`                    |
| Barrel exports | `index.ts`                                      | Always `index.ts`, never `index.tsx` |

---

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|------|------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | CSS/formatting changes (no logic change) |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `chore` | Build tooling, dependency updates, config changes |
| `perf` | Performance improvement |

### Scope

Use the feature name or `shared`:

```bash
feat(auth): add Google OAuth sign-in button
fix(home): fix hero section animation delay on mobile
refactor(shared): extract ThemeToggle into ThemeContext provider
style(home): adjust FAQ section spacing on tablet
docs: add restructuring guide
chore: update TanStack dependencies to latest
```

### Rules

- **Lowercase** the description (no capital first letter)
- **No period** at the end
- Use **imperative mood**: "add feature" not "added feature" or "adds feature"
- Keep the first line under **72 characters**

---

## Pull Request Process

### 1. Create a branch

```bash
# Sync with upstream first
git fetch upstream
git checkout -b feat/your-feature-name upstream/main
```

Branch naming:
- `feat/description` — new feature
- `fix/description` — bug fix
- `refactor/description` — refactoring
- `docs/description` — documentation

### 2. Make your changes

- Follow the [Code Style Guide](#code-style-guide)
- Follow the [Architecture Rules](#project-architecture)
- Write tests for new features
- Update documentation if needed

### 3. Self-review checklist

Before opening a PR, verify:

- [ ] **Architecture**: No cross-feature imports (`features/X` → `features/Y`)
- [ ] **Barrel exports**: All new public components/hooks are exported from `index.ts`
- [ ] **Thin routes**: Route files are under 20 lines (loader + component only)
- [ ] **No dead code**: No commented-out code blocks
- [ ] **No `any`**: All types are explicit
- [ ] **`import type`**: Type-only imports use `import type`
- [ ] **Naming**: Files and variables follow naming conventions
- [ ] **Assets**: New images/icons have descriptive kebab-case names
- [ ] **Lint passes**: `npm run lint` reports no errors
- [ ] **Format passes**: `npm run check` reports no issues
- [ ] **Tests pass**: `npm run test` passes
- [ ] **Build succeeds**: `npm run build` completes without errors

### 4. Open the PR

- Title follows commit convention: `feat(auth): add Google OAuth`
- Description explains **what** and **why** (not just what files changed)
- Link any related issues
- Add screenshots for UI changes

### 5. Review and merge

- At least **one approval** required
- All CI checks must pass
- Squash merge into `main`

---

## Adding a New Feature

Let's say you're adding a `pricing` feature:

### Step 1: Create the folder structure

```bash
mkdir -p src/features/pricing/{components,api,types,hooks}
```

### Step 2: Define your types

```tsx
// src/features/pricing/types/pricing.types.ts

export interface PricingPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  isPopular?: boolean
}
```

### Step 3: Create your API layer

```tsx
// src/features/pricing/api/pricingQueries.ts
import { apiClient } from '#/shared/lib/apiClient'
import type { PricingPlan } from '../types/pricing.types'
import type { ApiResponse } from '#/shared/types/api.types'

export async function getPricingPlans(): Promise<ApiResponse<PricingPlan[]>> {
  const response = await apiClient.get('/api/v1/pricing')
  return response.data
}
```

### Step 4: Build your components

```tsx
// src/features/pricing/components/PricingPage.tsx
import type { PricingPlan } from '../types/pricing.types'

interface PricingPageProps {
  plans: PricingPlan[]
}

export function PricingPage({ plans }: PricingPageProps) {
  return (
    <section>
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </section>
  )
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div className={cn("rounded-2xl border p-6", plan.isPopular && "border-[#FF6730]")}>
      <h3>{plan.name}</h3>
      <p>${plan.price}/{plan.interval}</p>
    </div>
  )
}
```

### Step 5: Create the barrel export

```tsx
// src/features/pricing/index.ts
export { PricingPage } from './components/PricingPage'
export { getPricingPlans } from './api/pricingQueries'
export type { PricingPlan } from './types/pricing.types'
```

### Step 6: Wire up the route

```tsx
// src/routes/pricing.tsx
import { createFileRoute } from '@tanstack/react-router'
import { PricingPage, getPricingPlans } from '#/features/pricing'

export const Route = createFileRoute('/pricing')({
  loader: async () => {
    const response = await getPricingPlans()
    return response.data
  },
  component: PricingRoute,
})

function PricingRoute() {
  const plans = Route.useLoaderData()
  return <PricingPage plans={plans} />
}
```

---

## Adding a New Route

TanStack Router uses **file-based routing**. The file path = the URL path.

### Basic route

```
src/routes/pricing.tsx     →  /pricing
src/routes/about.tsx       →  /about
```

### Nested routes

```
src/routes/products/
├── route.tsx              →  Layout for all /products/* pages
├── index.tsx              →  /products
└── $productId.tsx         →  /products/:productId (dynamic)
```

### Route groups (no URL segment)

```
src/routes/(auth)/
├── route.tsx              →  Shared layout (e.g., centred card)
├── sign-in.tsx            →  /sign-in
└── sign-up.tsx            →  /sign-up
```

### Pathless layouts (guards)

```
src/routes/_authenticated/
├── route.tsx              →  Auth guard (beforeLoad check)
├── dashboard.tsx          →  /dashboard
└── profile.tsx            →  /profile
```

After creating a new route file, TanStack Router auto-regenerates `routeTree.gen.ts`. You should see this happen automatically during `npm run dev`.

---

## Working with Shared Code

### When to add to `shared/`

Ask yourself: **"Is this used by 2+ features AND contains no business logic?"**

- ✅ `Button`, `Modal`, `useDebounce` → `shared/`
- ❌ `PricingCard`, `useAuthForm` → stays in its feature

### Adding a shared component

```tsx
// src/shared/components/ui/Badge.tsx
import { cn } from '#/shared/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variant === 'default' && "bg-gray-100 text-gray-800",
      variant === 'success' && "bg-green-100 text-green-800",
      variant === 'warning' && "bg-yellow-100 text-yellow-800",
    )}>
      {children}
    </span>
  )
}
```

### Adding a shared hook

```tsx
// src/shared/hooks/useClickOutside.ts
import { useEffect, type RefObject } from 'react'

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, handler])
}
```

---

## Working with Assets

### File naming

- Use **kebab-case**: `hero-background.png`, not `HeroBackground.png`
- Use **descriptive names**: `notification-bell.png`, not `Layer_11.png`
- **No spaces**: `stars-decoration.png`, not `stars copy.png`

### Directory structure

```
shared/assets/
├── images/
│   ├── logos/           # Brand logos
│   ├── hero/            # Hero section imagery
│   └── testimonials/    # Testimonial photos
├── icons/               # SVG icons and icon data
├── videos/              # Video files
└── fonts/               # Font files (.woff2, .ttf)
```

### Importing

```tsx
// Use the # path alias
import Logo from '#/shared/assets/images/logos/poiotes-logo.svg'
import MenuIcon from '#/shared/assets/icons/menu.svg'
```

### Feature-specific assets

If an asset is used by only one feature, it can live in that feature:

```
features/auth/assets/geometric-pattern.svg
```

---

## Testing

We use [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/).

### Test file location

Place test files next to the code they test:

```
features/auth/
├── components/
│   ├── SignInForm.tsx
│   └── SignInForm.test.tsx     ← test lives next to component
├── hooks/
│   ├── useAuthForm.ts
│   └── useAuthForm.test.ts    ← test lives next to hook
```

### Running tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npx vitest

# Run tests for a specific file
npx vitest SignInForm
```

### Writing tests

```tsx
// features/auth/components/SignInForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { SignInForm } from './SignInForm'

describe('SignInForm', () => {
  it('renders email and password fields', () => {
    render(<SignInForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('submits with valid credentials', async () => {
    const user = userEvent.setup()
    render(<SignInForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    // Assert expected behavior
  })
})
```

---

## Common Pitfalls

### ❌ Importing `react-router-dom`

We use TanStack Router, not React Router. If you see `react-router-dom` imports, they're from the old codebase and need to be migrated.

```tsx
// ❌ Old — do not use
import { Link, useLocation } from 'react-router-dom'

// ✅ New — use TanStack Router
import { Link, useRouter } from '@tanstack/react-router'
```

### ❌ Fat route files

Route files should be thin. If your route file is more than ~20 lines, move logic to the feature.

### ❌ Cross-feature imports

```tsx
// ❌ features/home importing from features/auth
import { useAuth } from '#/features/auth/hooks/useAuth'

// ✅ Import from the barrel if absolutely needed
import { useAuth } from '#/features/auth'

// ✅✅ Better: if home needs auth state, get it via props or context
```

### ❌ Putting business logic in `shared/`

`shared/` is for **generic, reusable** code. If a component knows about pricing plans or user profiles, it belongs in a feature.

### ❌ Skipping the barrel export

Every new public component or hook MUST be added to the feature's `index.ts`.

---

## Questions?

If something in this guide is unclear or you're unsure where code should go, open a Discussion on GitHub or ask in the team chat. We'd rather you ask than put code in the wrong place!

---

*Last updated: July 2026*
