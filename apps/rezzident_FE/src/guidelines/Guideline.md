# Rezzident Frontend — Developer Guide

> **First time?** Start by reading the [Restructuring Guide](../docs/RESTRUCTURING_GUIDE.md) to understand our Feature-Based Architecture before writing any code.

---

## Table of Contents

| #   | Section                                               | What You'll Learn                                             |
| -----| -------------------------------------------------------| ---------------------------------------------------------------|
| 1   | [General Principles](#1-general-principles)           | Core philosophy and rules                                     |
| 2   | [Getting Started](#2-getting-started)                 | Scripts, setup, directory layout, and File Naming Conventions |
| 3   | [Architecture Rules](#3-architecture-rules)           | Import rules, barrel exports, thin routes                     |
| 4   | [Design System Tokens](#4-design-system-tokens)       | App vs Web typography, colors, spacing                        |
| 5   | [Shared UI Components](#5-shared-ui-components)       | Button, Input, Select, FileUpload, etc.                       |
| 6   | [Building Forms](#6-building-forms)                   | Form fields, multi-step flows, transitions                    |
| 7   | [Code Style Guide](#7-code-style-guide)               | TypeScript, React, hooks, context patterns                    |
| 8   | [Styling (Tailwind CSS)](#8-styling-tailwind-css)     | Utility classes, cn(), no inline styles                       |
| 9   | [Working with Assets](#9-working-with-assets)         | Naming, directory structure, imports                          |
| 10  | [Adding a New Feature](#10-adding-a-new-feature)      | Step-by-step walkthrough                                      |
| 11  | [Adding a New Route](#11-adding-a-new-route)          | File-based routing with TanStack                              |
| 12  | [Commit & PR Conventions](#12-commit--pr-conventions) | Conventional commits, branch naming, checklist                |
| 13  | [Testing](#13-testing)                                | Vitest + Testing Library patterns                             |
| 14  | [Common Pitfalls](#14-common-pitfalls)                | Mistakes to avoid                                             |
| 15  | [Quick Tips](#15-quick-tips)                          | Essential shortcuts and gotchas                               |

---

## 1. General Principles

1. **Readability over cleverness** — Write code that a junior developer can understand.
2. **Explicit over implicit** — Name things clearly. `getUserById` not `get`.
3. **Small files** — If a file exceeds ~250 lines, consider splitting it.
4. **No dead code** — Don't commit commented-out code. Use git history instead.
5. **Named exports only** — Every component uses `export function X()`. Never `export default`.
6. **Use design tokens** — `text-actionDark` not `text-[#1A1A1A]`. Only use hex for colors not in the token set.

---

## 2. Getting Started

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | Check for lint errors |
| `npm run format` | Format code with Prettier + ESLint auto-fix |
| `npm run check` | Check formatting without modifying files |
| `npm run generate-routes` | Regenerate TanStack Router route tree |

### Directory Structure

```
src/
├── routes/              # URL → page mapping (thin: loader + component only)
│   ├── (auth)/          # Auth route group (registration, sign-in)
│   ├── (public)/        # Public marketing pages
│   ├── _authenticated/  # Guarded routes (dashboard, profile)
│   └── app/             # In-app views (splash, chat, etc.)
├── features/            # Business domains
│   ├── application/     # Core app (splash, chat, settings)
│   ├── auth/            # Authentication (registration, login)
│   ├── home/            # Landing page
│   └── about/           # About page
├── shared/              # Cross-cutting code
│   ├── components/ui/   # UI primitives (Button, Input, Select...)
│   ├── components/layout/ # Layout components (Header, Footer...)
│   ├── hooks/           # Shared hooks (useClickOutside...)
│   ├── utils/           # Utilities (cn.ts, formatDate.ts...)
│   ├── context/         # Shared context (ThemeContext...)
│   ├── assets/          # Images, icons, fonts, videos
│   └── types/           # Shared type definitions
├── server/              # TanStack Start server functions
├── styles/              # Global CSS
├── router.tsx           # Router configuration
└── routeTree.gen.ts     # Auto-generated (never edit)
```

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | `PascalCase.tsx` | `HeroSection.tsx` |
| Hooks | `camelCase.ts` (starts with `use`) | `useAuth.ts` |
| Context | `PascalCase.tsx` (ends with `Context`) | `ThemeContext.tsx` |
| Utils | `camelCase.ts` | `cn.ts`, `formatDate.ts` |
| Type files | `kebab-case.types.ts` | `auth.types.ts` |
| Constants | `camelCase.ts` (SCREAMING_SNAKE inside) | `config.ts` |
| Assets | `kebab-case` | `poiotes-logo.svg` |
| Route files | `kebab-case.tsx` | `sign-in.tsx` |
| Barrel exports | `index.ts` | Always `index.ts`, never `index.tsx` |

---

## 3. Architecture Rules

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

### The Thin Route Rule

Route files should be **under 20 lines**. They contain only a `loader` and a `component`:

```tsx
// ✅ Good route file (~10 lines)
import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '#/features/auth'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayout,
})
```

If your route file is growing, move the logic into the feature component.

### Import Paths

Always use the `#/` alias. Never use relative paths like `../../../shared/`:

```tsx
// ✅ Correct
import { Button } from '#/shared/components/ui/button'
import { RegistrationForm } from '#/features/auth'

// ❌ Wrong
import { Button } from '../../../shared/components/ui/button'
```

---

## 4. Design System Tokens

We maintain **two token sets** in `tailwind.config.js`:
- **App tokens** — for mobile/tablet views (`features/application/`, `features/home/`)
- **Web tokens** — for desktop views (`features/auth/`, `routes/(public)/`)

**Never delete or rename existing tokens** — add new ones with the `web-` prefix.

### Typography — App (mobile/tablet)

| Class | Size | Weight | Use |
|-------|------|--------|-----|
| `text-display` | 32px/34px | 700 | App hero headlines |
| `text-heading-1` | 28px/32px | 600 | Page titles |
| `text-heading-2` | 24px/28px | 600 | Section headings |
| `text-heading-3` | 20px/24px | 500 | Sub-headings |
| `text-body-large` | 18px/24px | 400 | Large body |
| `text-body-base` | 16px/20px | 400 | Default body |
| `text-body-small` | 14px/18px | 400 | Small text |
| `text-caption` | 14px/16px | 400 | Captions |
| `text-label` | 14px/16px | 500 | Form labels |

### Typography — Web (desktop)

| Class | Size | Weight | Use |
|-------|------|--------|-----|
| `text-web-display` | 56px/62px | 700 | Hero headlines (landing pages) |
| `text-web-h1` | 40px/48px | 700 | Page titles |
| `text-web-h2` | 32px/40px | 600 | Section headings |
| `text-web-h3` | 24px/32px | 600 | Sub-headings |
| `text-web-h4` | 20px/28px | 500 | Card titles |
| `text-web-lg` | 18px/28px | 400 | Large body text |
| `text-web-base` | 16px/26px | 400 | Body text |
| `text-web-sm` | 14px/22px | 400 | Small text, descriptions |
| `text-web-xs` | 12px/18px | 400 | Captions, fine print |
| `text-web-label` | 14px/20px | 500 | Form labels |
| `text-web-overline` | 11px/16px | 600 | "STEP 1 OF 3", badges |

### When to use which?

```tsx
// ❌ Wrong — using app tokens in a desktop auth page
<h1 className="text-heading-1">Fill in estate details</h1>

// ✅ Correct — web tokens for desktop views
<h1 className="text-web-h1 font-web-bold text-actionDark">Fill in estate details</h1>
<p className="text-web-sm text-gray-500">Provide your estate information below</p>

// ✅ Correct — app tokens for mobile app views
<h1 className="text-heading-1 text-actionDark">Welcome back</h1>
```

### Font Weights

| App Class | Web Class | Value |
|-----------|-----------|-------|
| `font-normal` | `font-web-regular` | 400 |
| `font-medium` | `font-web-medium` | 500 |
| `font-semibold` | `font-web-semibold` | 600 |
| `font-bold` | `font-web-bold` | 700 |

### Spacing

| App | Value | Web | Value |
|-----|-------|-----|-------|
| `p-2xs` | 4px | — | — |
| `p-xs` | 8px | `p-web-xs` | 8px |
| `p-sm` | 12px | `p-web-sm` | 16px |
| `p-md` | 16px | `p-web-md` | 24px |
| `p-lg` | 20px | `p-web-lg` | 32px |
| `p-xl` | 24px | `p-web-xl` | 48px |
| `p-2xl` | 32px | `p-web-2xl` | 64px |
| `p-3xl` | 40px | `p-web-3xl` | 80px |
| `p-4xl` | 48px | `p-web-4xl` | 96px |
| `p-5xl` | 64px | `p-web-5xl` | 120px |

> Web spacing is more generous — desktop screens have more room. These work with all spacing utilities: `p-`, `m-`, `gap-`, `space-x-`, etc.

### Responsive Breakpoints

We have a custom `web:` breakpoint for desktop auth/public pages. Use it alongside the standard Tailwind breakpoints:

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile (default) |
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `web:` | 1024px | **Desktop — auth, public pages** |
| `lg:` | 1024px | Desktop (legacy, same as `web:`) |
| `xl:` | 1280px | Large desktop |
| `1xl:` | 1280px | Extra large |
| `2xl:` | 1440px | Wide screens |

#### Usage — Mobile-first with web override

```tsx
// Padding that scales for desktop
<div className="px-md web:px-web-lg">
  {/* 16px on mobile, 32px on desktop */}
</div>

// Typography that scales
<h1 className="text-heading-1 web:text-web-h1">
  {/* 28px on mobile, 40px on desktop */}
</h1>

// Spacing that adapts
<div className="gap-sm web:gap-web-md">
  {/* 12px gap on mobile, 24px on desktop */}
</div>

// Hiding/showing elements
<div className="hidden web:block">
  {/* Only visible on desktop */}
</div>
```

#### When to use `web:` vs `lg:`

- **`web:`** — Use in `features/auth/`, `routes/(public)/`, and any desktop-specific layout
- **`lg:`** — Use in `features/application/`, `features/home/` for general responsive behavior

They have the same breakpoint (1024px), but `web:` makes intent clear.

#### ⚠️ Don't use `text-web-*` in Buttons

The `text-web-sm` class includes `fontWeight: 400` which overrides the Button's built-in `font-medium` (500). For buttons, use plain `text-[14px]` for size-only adjustment:

```tsx
// ❌ Wrong — text-web-sm overrides the Button's font-medium
<Button className="text-web-sm">Get Started</Button>

// ✅ Correct — text-[14px] adjusts only font-size
<Button className="w-full h-[52px] text-[14px]">Get Started</Button>
```

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `actionYellow` | `#FFE022` | Primary CTAs, highlights, branding |
| `actionYellowHover` | `#F0D010` | Hover state for yellow buttons |
| `actionDark` | `#1A1A1A` | Dark text, dark buttons, overlays |
| `actionDarkHover` | `#2A2A2A` | Hover for dark buttons |
| `chatArea` | `#F2F0E8` | Chat background |
| `receiverBubble` | `#F2F1ED` | Received message bubbles |
| `deletedBubble` | `#F5F4F0` | Deleted message placeholder |
| `menuHover` | `#FAFAF5` | Menu item hover, auth page backgrounds |
| `inputBg` | `#FFF9CC` | Powered badge background, input focus |

### Font Families

| Class | Font | Usage |
|-------|------|-------|
| `font-dmsans` | DM Sans | Primary — all body text, labels, buttons |
| `font-cabinet` | Cabinet Grotesk | Brand — logo text, special headings |
| `font-satoshi` | Satoshi | Feature — AboutPage section titles |

---

## 5. Shared UI Components

All components live in `src/shared/components/ui/`. Import using the path alias:

```tsx
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
```

### Component Reference

| Component | File | Description |
|-----------|------|-------------|
| [Button](#button) | `button.tsx` | Primary action button with variants |
| [Input](#input) | `input.tsx` | Text input with flushed bottom-border |
| [Select](#select) | `select.tsx` | Radix-based custom dropdown |
| [StepProgress](#stepprogress) | `step-progress.tsx` | Full-width progress bar with label |
| [FileUpload](#fileupload) | `file-upload.tsx` | File picker with preview |
| [PinInput](#pininput) | `pin-input.tsx` | Verification code input |
| [Switch](#switch) | `switch.tsx` | Toggle switch |
| [AlertCard / ModalAlert](#alertcard--modalalert) | `alert-card.tsx` | Inline and modal alerts |
| [InternetStatus](#internetstatus) | `internet-status.tsx` | Connectivity banner |

---

### Button

Variants: `default`, `secondary`, `ghost`, `accent`, `outlineGold`

```tsx
import { Button } from '#/shared/components/ui/button'

// Primary dark button (most common in forms)
<Button className="h-[52px] w-full rounded-[12px] bg-actionDark text-white hover:bg-actionDark/90">
  Continue
</Button>

// With variant
<Button variant="accent">Save Changes</Button>
<Button variant="ghost">Cancel</Button>
```

### Input

Flushed bottom-border style. Supports `error` prop for validation.

```tsx
import { Input } from '#/shared/components/ui/input'

<div>
  <label className="mb-2 block font-dmsans text-web-sm text-gray-500">Estate Name</label>
  <Input
    type="text"
    placeholder="Enter your estate name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>

// With error state
<Input type="email" error placeholder="Invalid email" />
```

### Select

Uses `@radix-ui/react-select`. Renders a **custom dropdown** (not the native browser select). Uses Material icon `expand_more` as chevron and `check` for selected items.

```tsx
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '#/shared/components/ui/select'

<Select value={state} onValueChange={setState}>
  <SelectTrigger>
    <SelectValue placeholder="Select state" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="lagos">Lagos</SelectItem>
    <SelectItem value="abuja">FCT Abuja</SelectItem>
    <SelectItem value="rivers">Rivers</SelectItem>
  </SelectContent>
</Select>
```

### StepProgress

Full-width progress bar with uppercase `STEP X OF Y` label.

```tsx
import { StepProgress } from '#/shared/components/ui/step-progress'

// With label (default)
<StepProgress currentStep={2} totalSteps={3} />

// Without label
<StepProgress currentStep={1} totalSteps={5} showLabel={false} />
```

### FileUpload

File picker with icon, title, description, and upload/remove actions.

```tsx
import { FileUpload } from '#/shared/components/ui/file-upload'

<FileUpload
  label="Upload NIN"
  title="National Identification Number (NIN)"
  description="Upload a clear image. PDF, JPG & PNG · Max 5MB"
  accept=".pdf,.jpg,.jpeg,.png"
  maxSizeMB={5}
  value={ninFile}
  onChange={(file) => setNinFile(file)}
/>
```

### PinInput

4-digit verification code input.

```tsx
import { PinInput } from '#/shared/components/ui/pin-input'

<PinInput length={4} onComplete={(code) => verifyCode(code)} />
```

### Switch

Toggle switch for settings.

```tsx
import { Switch } from '#/shared/components/ui/switch'

<Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
```

### AlertCard / ModalAlert

Inline alerts and modal overlay alerts.

```tsx
import { AlertCard, ModalAlert } from '#/shared/components/ui/alert-card'

// Inline alert
<AlertCard variant="success" title="Estate registered!" description="You can now invite residents." />

// Modal alert
<ModalAlert
  open={showModal}
  onClose={() => setShowModal(false)}
  icon="check_circle"
  title="Registration Complete"
  description="Your estate has been set up."
  primaryAction={{ label: "Go to Dashboard", onClick: goToDashboard }}
/>
```

### InternetStatus

Connectivity banner (offline/reconnected).

```tsx
import { InternetStatus } from '#/shared/components/ui/internet-status'

<InternetStatus status="offline" onReconnect={() => window.location.reload()} />
```

---

## 6. Building Forms

### Form field pattern

Always pair a `<label>` with an input. Use the **web typography tokens** for desktop views:

```tsx
<div>
  <label className="mb-2 block font-dmsans text-web-sm text-gray-500">
    Field Label
  </label>
  <Input type="text" placeholder="Placeholder text" value={val} onChange={...} />
</div>
```

### Multi-step form pattern

Use `useState` to track sub-steps. Map sub-steps to logical steps for the progress bar:

```tsx
const [subStep, setSubStep] = useState(1)
const totalLogicalSteps = 3

// Map sub-steps → logical steps (what the user sees)
function subStepToLogical(sub: number): number {
  if (sub === 1) return 1              // Step 1 of 3
  if (sub === 2 || sub === 3) return 2 // Step 2 of 3 (has sub-steps)
  return 3                             // Step 3 of 3
}

// In JSX
<StepProgress currentStep={subStepToLogical(subStep)} totalSteps={totalLogicalSteps} />
```

### Step transitions with Framer Motion

Use `AnimatePresence` for smooth page transitions between steps:

```tsx
import { AnimatePresence, motion } from 'framer-motion'

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
}

<AnimatePresence mode="wait">
  {subStep === 1 && (
    <motion.div key="step1" variants={pageVariants} initial="enter" animate="center" exit="exit">
      {/* Step 1 content */}
    </motion.div>
  )}
  {subStep === 2 && (
    <motion.div key="step2" variants={pageVariants} initial="enter" animate="center" exit="exit">
      {/* Step 2 content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Go Back navigation

```tsx
function handleBack() {
  if (subStep > 1) {
    setSubStep((s) => s - 1)
  } else {
    navigate({ to: '/registration-criteria' })
  }
}

<button
  onClick={handleBack}
  className="mb-8 inline-flex items-center gap-1 self-start font-dmsans text-web-sm font-web-medium text-actionDark"
>
  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
  Go Back
</button>
```

---

## 7. Code Style Guide

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
type User = { id: string; name: string; email: string }
```

Use `type` for unions, intersections, and computed types:

```tsx
type ThemeMode = 'light' | 'dark' | 'auto'
type ButtonVariant = 'primary' | 'secondary' | 'ghost'
```

#### Always type function parameters and return values for exports

```tsx
// ✅ Explicit return type for exported functions
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
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
function parseResponse(data: any): User { return data }
```

### React Components

#### Use function declarations (not arrow functions)

```tsx
// ✅ Preferred — hoisted, clear in stack traces
export function HeroSection() {
  return <section>...</section>
}

// ❌ Avoid for top-level components
const HeroSection = () => { return <section>...</section> }
```

Arrow functions are fine for: inline callbacks, array methods, small internal helpers.

#### Props interface naming

```tsx
interface HeroSectionProps {
  title: string
  subtitle?: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  // ...
}
```

#### One component per file

Each `.tsx` file should export **one** main component. Small sub-components used only within that file are fine to keep but should not be exported.

### Hooks

#### Always start with `use`

```tsx
export function useMediaQuery(query: string): boolean { ... }
export function useAuth(): AuthContextValue { ... }
```

#### Extract complex logic into custom hooks

If a component has more than 2-3 `useState` + `useEffect` combos for the same concern, extract them.

### Context

#### Always provide a custom consumer hook

```tsx
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // ...state logic
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within <ThemeProvider>')
  return context
}
```

**Never export the raw context object.** Only export the Provider and the consumer hook.

---

## 8. Styling (Tailwind CSS)

### Use Tailwind utility classes directly

```tsx
<button className="rounded-full bg-actionYellow px-6 py-3 text-sm font-semibold text-actionDark transition-all hover:bg-actionYellowHover">
  Submit
</button>
```

### Use `cn()` for conditional classes

```tsx
import { cn } from '#/shared/utils/cn'

<button className={cn(
  "rounded-full px-6 py-3 text-sm font-semibold transition-all",
  variant === 'primary' && "bg-actionDark text-white hover:bg-actionDarkHover",
  variant === 'secondary' && "border border-gray-200 text-gray-900 hover:bg-gray-50",
  disabled && "opacity-50 cursor-not-allowed"
)}>
  {children}
</button>
```

### No inline styles unless animating

```tsx
// ✅ OK — dynamic animation values
<div style={{ opacity: isVisible ? 1 : 0, transform: `translateY(${offset}px)` }}>

// ❌ Avoid — use Tailwind instead
<div style={{ padding: '16px', fontSize: '14px', color: '#818181' }}>
```

---

## 9. Working with Assets

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

## 10. Adding a New Feature

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

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const response = await apiClient.get('/api/v1/pricing')
  return response.data
}
```

### Step 4: Build your components

```tsx
// src/features/pricing/components/PricingPage.tsx
import type { PricingPlan } from '../types/pricing.types'

export function PricingPage({ plans }: { plans: PricingPlan[] }) {
  return (
    <section>
      {plans.map((plan) => <PricingCard key={plan.id} plan={plan} />)}
    </section>
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
  loader: async () => getPricingPlans(),
  component: PricingRoute,
})

function PricingRoute() {
  const plans = Route.useLoaderData()
  return <PricingPage plans={plans} />
}
```

---

## 11. Adding a New Route

TanStack Router uses **file-based routing**. The file path = the URL path.

### Basic routes

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
├── route.tsx              →  Shared layout (e.g., side hero + form)
├── registration-criteria.tsx  →  /registration-criteria
└── registration.tsx       →  /registration
```

### Pathless layouts (guards)

```
src/routes/_authenticated/
├── route.tsx              →  Auth guard (beforeLoad check)
├── dashboard.tsx          →  /dashboard
└── profile.tsx            →  /profile
```

After creating a new route file, TanStack Router auto-regenerates `routeTree.gen.ts` during `npm run dev`.

---

## 12. Commit & PR Conventions

### Commit format

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type | When to use |
|------|------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `refactor` | Code change (no bug fix or feature) |
| `style` | CSS/formatting changes (no logic) |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `chore` | Build tooling, deps, config |
| `perf` | Performance improvement |

### Scope

Use the feature name or `shared`:

```bash
feat(auth): add Google OAuth sign-in button
fix(home): fix hero animation delay on mobile
refactor(shared): extract ThemeToggle into ThemeContext
```

### Rules

- **Lowercase** the description
- **No period** at the end
- **Imperative mood**: "add feature" not "added feature"
- Keep the first line under **72 characters**

### Branch naming

- `feat/description` — new feature
- `fix/description` — bug fix
- `refactor/description` — refactoring
- `docs/description` — documentation

### PR Self-Review Checklist

Before opening a PR, verify:

- [ ] No cross-feature imports (`features/X` → `features/Y`)
- [ ] All new public components/hooks exported from `index.ts`
- [ ] Route files under 20 lines
- [ ] No commented-out code
- [ ] No `any` — all types explicit
- [ ] Type-only imports use `import type`
- [ ] Files and variables follow naming conventions
- [ ] New assets have descriptive kebab-case names
- [ ] `npm run lint` — no errors
- [ ] `npm run build` — completes without errors

---

## 13. Testing

We use [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/).

### Test file location

Place test files **next to the code they test**:

```
features/auth/
├── components/
│   ├── SignInForm.tsx
│   └── SignInForm.test.tsx     ← here
├── hooks/
│   ├── useAuthForm.ts
│   └── useAuthForm.test.ts    ← here
```

### Running tests

```bash
npm run test           # Run all tests
npx vitest             # Watch mode
npx vitest SignInForm  # Specific file
```

### Writing tests

```tsx
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
})
```

---

## 14. Common Pitfalls

### ❌ Importing `react-router-dom`

We use TanStack Router, not React Router:

```tsx
// ❌ Old
import { Link, useLocation } from 'react-router-dom'

// ✅ New
import { Link, useRouter } from '@tanstack/react-router'
```

### ❌ Fat route files

Route files should be thin. If your route file is more than ~20 lines, move logic to the feature.

### ❌ Cross-feature imports

```tsx
// ❌ Wrong
import { useAuth } from '#/features/auth/hooks/useAuth'

// ✅ Import from barrel
import { useAuth } from '#/features/auth'
```

### ❌ Putting business logic in `shared/`

`shared/` is for **generic, reusable** code. If a component knows about pricing plans or user profiles, it belongs in a feature.

### ❌ Using raw HTML inputs

```tsx
// ❌ Wrong — unstyled, inconsistent
<input type="text" placeholder="Name" />
<select><option>Lagos</option></select>

// ✅ Correct — use shared UI components
<Input type="text" placeholder="Name" />
<Select><SelectTrigger>...</SelectTrigger>...</Select>
```

### ❌ Hardcoding colors

```tsx
// ❌ Wrong
<div className="bg-[#1A1A1A] text-[#FFE022]">

// ✅ Correct — use tokens
<div className="bg-actionDark text-actionYellow">
```

### ❌ Using app tokens in web views

```tsx
// ❌ Wrong — app tokens on a desktop auth page
<h1 className="text-heading-1">Welcome</h1>

// ✅ Correct — web tokens for desktop
<h1 className="text-web-h1 font-web-bold">Welcome</h1>
```

---

## 15. Quick Tips

| Tip | Details |
|-----|---------|
| 🎨 **Material Icons** | We use Material Symbols Outlined. Browse at [fonts.google.com/icons](https://fonts.google.com/icons). Usage: `<span className="material-symbols-outlined text-[20px]">icon_name</span>` |
| 🔧 **cn() utility** | Always use `cn()` from `#/shared/utils/cn` for conditional class merging. It handles conflicting Tailwind classes correctly. |
| 📦 **Named exports** | Every component: `export function X()`. Never `export default`. Barrel: `export { X } from './X'`. |
| 📱 **App vs Web tokens** | `features/application/` → `text-body-base`, `text-heading-1`. Desktop auth/public → `text-web-base`, `text-web-h1`. |
| 📏 **Thin routes** | Route files must be under 20 lines. All UI/state/logic goes in the feature component. |
| 🎯 **Design tokens** | `text-actionDark` not `text-[#1A1A1A]`. Only use hex for unlisted colors. |
| 📝 **Form inputs** | Use `Input` and `Select` components. Never raw `<input>` or `<select>`. |
| 🎬 **Framer Motion** | Import from `framer-motion` for page transitions and carousels. |
| 📁 **File uploads** | Use `FileUpload` from `shared/components/ui/file-upload.tsx`. Don't build custom file inputs. |
| 🔗 **Import paths** | Always `#/shared/...` or `#/features/auth`. Never relative `../../../`. |
| 🚫 **No default exports** | `export function Component()` not `export default function Component()`. |
| 📂 **One component per file** | Each `.tsx` exports one main component. Internal helpers stay unexported. |

---

## Questions?

If something in this guide is unclear or you're unsure where code should go, open a Discussion on GitHub or ask in the team chat. We'd rather you ask than put code in the wrong place!

---

*Last updated: August 2026*