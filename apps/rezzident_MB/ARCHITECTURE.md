# rezzident_MB — Architecture

Mirrors the feature-based "bulletproof" structure used in `apps/rezzident_FE`,
adapted for Expo Router + React Native + NativeWind. Same feature names
(`auth`, `application`), same design language, different rendering primitives
(no DOM here — Pressable/View/Text instead of button/div/span).

## Folder structure

```
apps/rezzident_MB/
├── src/
│   ├── app/                     # expo-router file-based routes (thin — no logic)
│   │   ├── index.tsx             # redirects to (application)/splash
│   │   ├── (application)/        # onboarding: splash → welcome → join-estate
│   │   ├── (auth)/                # sign-in: phone → otp → pin
│   │   └── (tabs)/                # authenticated app shell
│   ├── features/
│   │   ├── auth/                  # types/ api/ hooks/ components/ index.ts
│   │   └── application/           # types/ hooks/ components/ index.ts
│   ├── components/ui/             # design-system primitives (see below)
│   ├── lib/                       # api-client, secure-storage, cn()
│   └── types/api.types.ts         # re-exports @rezzident/shared-types
├── babel.config.js                # NEW — nativewind + expo preset
├── metro.config.js                # NEW — monorepo module resolution + nativewind
└── tailwind.config.js             # now imports @rezzident/design-tokens
```

## What moved to the repo root (`packages/`)

| Package | Contains | Why it's shared |
|---|---|---|
| `@rezzident/design-tokens` | colors, fontFamily, fontSize, spacing, radii | Same visual language on web and mobile — one file to rebrand, not two |
| `@rezzident/shared-types` | `ApiResponse`, `UserProfile`, `TokenResponse`, auth/estate payloads | The API contract is one thing regardless of which app calls it |

Both apps' `tailwind.config.js` / `package.json` now depend on these via the
pnpm workspace (`workspace:*`) — see the root `pnpm-workspace.yaml` this
adds. Anything that isn't plain data/types (actual `<Button>` components)
stays **app-local** in `components/ui/` — see the "why not one `ui` package"
note from our monorepo discussion: web renders DOM, RN renders native views,
so the components themselves can't be shared, only their tokens and API
contracts can.

## `features/auth` — phone → OTP → PIN

- `types/auth.types.ts` — re-exports the shared auth types, adds mobile-only
  `AuthStep` / `AuthFormState`
- `api/authQueries.ts` — `requestOtp`, `verifyOtp`, `setPin`, `loginWithPin`,
  `getCurrentUser`, all through the existing `lib/api-client.ts` (axios +
  secure-store token injection, already scaffolded)
- `hooks/useAuth.ts` — **kept as-is**, your existing Zustand + secure-storage
  store; it already did the right thing
- `hooks/useAuthForm.ts` — phone/OTP/PIN form state + validation, mirrors
  `rezzident_FE/features/auth/hooks/useAuthForm.ts` (which validates
  email/password instead, since web login is email-based)
- `components/AuthLayout.tsx`, `PhoneStep.tsx`, `OtpStep.tsx`, `PinStep.tsx`
- `app/(auth)/login.tsx` is now a thin screen that just sequences the three
  step components and calls `useAuthStore().setAuth()` on success

## `features/application` — splash, welcome, join-estate

- `SplashScreen` — animated logo, auto-navigates to welcome after 2.5s
  (same timing as FE)
- `WelcomeScreen` — 3-slide carousel. FE hand-rolls pointer-drag +
  scroll-snap on a `<div>`; RN's `FlatList` with `pagingEnabled` gives the
  same swipe behavior as a native primitive, so there's no custom gesture
  code to maintain here
- `JoinEstateFlow` — the 6-step wizard (Estate ID → Personal → OTP →
  Address → Face capture → PIN), state machine in
  `hooks/useJoinEstateForm.ts`. Face capture uses `expo-camera`
  (`CameraView` + `takePictureAsync`) as the native equivalent of FE's
  `getUserMedia` + `<canvas>` capture

## `components/ui` — design-system primitives ported so far

| Web (`rezzident_FE`) | Mobile equivalent | Notes |
|---|---|---|
| `button.tsx` (Radix Slot) | `button.tsx` (Pressable) | same 5 variants, same colors |
| `input.tsx` | `input.tsx` | underline style preserved |
| `pin-input.tsx` | `pin-input.tsx` | dot-per-digit + focus underline, same visual |
| `step-progress.tsx` | `step-progress.tsx` | 1:1 port |
| `switch.tsx` (Radix) | `switch.tsx` (RN `Switch`) | track colors matched |
| `select.tsx` (Radix popover) | `select.tsx` (Modal + FlatList) | no floating-popover primitive in RN; bottom-sheet-style modal is the native pattern |
| `alert-card.tsx` | `alert-card.tsx` | Feather icons instead of Material Symbols web font |
| `ErrorStateComponent.tsx` | `ErrorStateComponent.tsx` | 1:1 port |
| `internet-status.tsx` | `internet-status.tsx` | driven by `@react-native-community/netinfo`, mounted once in `app/_layout.tsx` instead of per-screen |

**Not yet ported** (chat/community feature UI, not needed for auth/onboarding):
`message-bubble.tsx`, `messaging-bar.tsx`, `file-upload.tsx`, `poll-card.tsx`,
`ad-placement.tsx`. Port these when the messaging/community feature gets its
mobile architecture pass.

## Responsiveness

- `useWindowDimensions()` drives an `isTablet` (`width >= 768`) check in
  `AuthLayout`, `WelcomeScreen`, and can be reused anywhere else a screen
  needs to change layout on larger devices
- On tablet-width screens, form content is capped at `max-w-[480px]` and
  centered — same rule FE applies at its `web:` (1024px) breakpoint for
  auth pages, just triggered earlier since phones-vs-tablets is the mobile
  equivalent split
- All spacing/type comes from the shared 8-point scale in
  `@rezzident/design-tokens`, so nothing is hand-pixel-measured per screen

## Fixed while here

- `babel.config.js` and `metro.config.js` didn't exist — added both.
  Without them: NativeWind's `className` prop wouldn't transform, and the
  `@/*` import alias (already used in your existing `useAuth.ts`) wouldn't
  resolve. `metro.config.js` also adds workspace `node_modules` resolution
  so `@rezzident/design-tokens` and `@rezzident/shared-types` resolve
  through the pnpm workspace symlinks.

## Still needed (not done here)

- Actual image assets (`src/assets/logo.png`, `onboarding-1/2/3.png`) —
  export from the SVGs in `rezzident_FE/public/assets/`
- Backend endpoints: `/auth/request-otp`, `/auth/verify-otp`,
  `/auth/set-pin`, `/auth/login-pin` assumed by `authQueries.ts` — confirm
  exact paths against `rezzident_BE`
- `(tabs)` screens are still scaffolds — next architecture pass
