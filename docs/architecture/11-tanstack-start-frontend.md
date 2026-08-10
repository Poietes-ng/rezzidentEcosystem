# 11 — TanStack Start Frontend Architecture

[← Previous: Security](./10-security-architecture.md) | [Back to Index](./README.md) | [Next: React Native Mobile →](./12-react-native-mobile.md)

---

## Why TanStack Start

| Feature | TanStack Start | Current (React + Vite SPA) | Next.js |
|---------|---------------|---------------------------|---------|
| SSR (SEO, fast first paint) | ✅ | ❌ | ✅ |
| Type-safe routing | ✅ (end-to-end) | ❌ | Partial |
| File-based routing | ✅ | ❌ | ✅ |
| Server functions | ✅ (explicit) | ❌ | ✅ (implicit) |
| TanStack Query integration | Native | Manual | Manual |
| Client-first philosophy | ✅ | ✅ | ❌ (server-first) |
| Deployment flexibility | Docker/Node/Edge | Static host | Vercel-optimized |
| Bundle size | Smaller | Baseline | Larger |

### Key Advantage for Nigerian Users
- **SSR:** First paint happens server-side → users see content before JavaScript downloads
- **On slow 3G/4G connections**, this means the dashboard appears in ~400ms instead of ~2000ms
- **Loaders:** Data is fetched during SSR, not after hydration — no spinner on first visit

---

## Project Structure

```
app/rezzident_FE/
├── src/
│   ├── routes/                              # File-based routes — THIN
│   │   ├── __root.tsx                       # Root layout: <html>, <head>, providers
│   │   ├── index.tsx                        # "/" → Landing/marketing page
│   │   │
│   │   ├── (auth)/                          # Public auth routes (no login required)
│   │   │   ├── route.tsx                    # Auth layout (centered card design)
│   │   │   ├── registration.tsx             # Step-by-step estate registration
│   │   │   ├── join-estate.tsx              # Enter estate code
│   │   │   ├── verify-otp.tsx               # OTP input screen
│   │   │   └── set-pin.tsx                  # PIN setup
│   │   │
│   │   ├── _authenticated/                  # Protected routes (auth guard)
│   │   │   ├── route.tsx                    # beforeLoad: verify JWT via FastAPI
│   │   │   │
│   │   │   ├── _resident/                   # Resident-specific routes
│   │   │   │   ├── route.tsx                # Resident layout (bottom nav)
│   │   │   │   ├── dashboard.tsx            # Resident home
│   │   │   │   ├── bills.tsx                # Bill list
│   │   │   │   ├── bills.$billId.tsx        # Bill detail + pay
│   │   │   │   ├── visitors.tsx             # Visitor code management
│   │   │   │   ├── visitors.create.tsx      # Create visitor code
│   │   │   │   ├── community.tsx            # Estate community chat
│   │   │   │   ├── household.tsx            # Family tree / managed members
│   │   │   │   └── profile.tsx              # User profile + settings
│   │   │   │
│   │   │   │
│   │   │   ├── (public)/                    # web page route(LandingPage, About, Registration Guide, etc)
│   │   │   │   ├── route.tsx                # web page layout (sidebar nav)
│   │   │   │   ├── home.tsx                 # landing page
│   │   │   │   ├── about.tsx                # about page
│   │   │   │   ├── registration-guide.tsx   # estate registration guide page
│   │   │   │   └── blog.tsx                 # blog
│   │   │   │
│   │   │   ├── _admin/                      # Admin-specific routes
│   │   │   │   ├── route.tsx                # Admin layout (sidebar nav)
│   │   │   │   ├── dashboard.tsx            # Admin overview
│   │   │   │   ├── residents.tsx            # Resident management
│   │   │   │   ├── verifications.tsx        # Pending verification queue
│   │   │   │   ├── bills.tsx                # Bill creation + tracking
│   │   │   │   ├── expenses.tsx             # Expense management
│   │   │   │   ├── visitors.tsx             # Visitor log
│   │   │   │   ├── settings.tsx             # Estate settings
│   │   │   │   └── activity-log.tsx         # Audit trail
│   │   │   │
│   │   │   └── _app/                        # web application routes
│   │   │       ├── route.tsx                # app layout
│   │   │       ├── welcome.tsx              # Landing page
│   │   │       ├── splash.tsx               # app preview overview
│   │   │       ├── join.tsx                 # join estate page
│   │   │       └── index.tsx                # route source code
│   │   │
│   │   └── api/                             # Server-only API routes
│   │       └── webhooks/
│   │           └── paystack.ts              # Paystack webhook handler
│   │
│   ├── features/                            # Feature modules (business logic)
│   │   ├── auth/
│   │   │   ├── api/authQueries.ts           # Login, register, OTP mutations
│   │   │   ├── components/
│   │   │   │   ├── RegistrationForm.tsx     # registration page components
│   │   │   │   ├── JoinEstateForm.tsx       # join estate page components
│   │   │   │   ├── OTPInput.tsx             # otp input page components
│   │   │   │   ├── PINSetup.tsx             # pin setup page components
│   │   │   │   └── NINVerification.tsx      # nin verification page components
│   │   │   ├── hooks/useAuth.ts
│   │   │   ├── types/auth.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── application/
│   │   │   ├── api/applicationQueries.ts
│   │   │   ├── components/
│   │   │   │   ├── Welcome.tsx
│   │   │   │   ├── Splash.tsx
│   │   │   │   └── Join.tsx
│   │   │   └── index.ts
│   │   │
│   │   │
│   │   ├── bills/
│   │   │   ├── api/billQueries.ts
│   │   │   ├── components/
│   │   │   │   ├── BillList.tsx
│   │   │   │   ├── BillCard.tsx
│   │   │   │   └── PaymentModal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── visitors/
│   │   │   ├── api/visitorQueries.ts
│   │   │   ├── components/
│   │   │   │   ├── VisitorCodeList.tsx
│   │   │   │   ├── CreateVisitorForm.tsx
│   │   │   │   └── QRCodeDisplay.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── household/
│   │   │   ├── api/householdQueries.ts
│   │   │   ├── components/
│   │   │   │   ├── HouseholdOverview.tsx
│   │   │   │   ├── AddMemberForm.tsx
│   │   │   │   └── PermissionsEditor.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── verification/
│   │   │   ├── api/verificationQueries.ts
│   │   │   ├── components/
│   │   │   │   ├── VerificationQueue.tsx
│   │   │   │   └── VouchRequest.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── dashboard/
│   │
│   ├── server/                              # Server-only code (NOT in client bundle)
│   │   └── functions/
│   │       ├── session.ts                   # Read/write httpOnly session cookie
│   │       └── upload.ts                    # S3 signed URL generation
│   │
│   ├── shared/
│   │   ├── lib/
│   │   │   ├── apiClient.ts                 # Axios → FastAPI with envelope unwrap
│   │   │   └── queryClient.ts               # TanStack Query client config
│   │   ├── types/
│   │   │   └── api.types.ts                 # ApiResponse<T> matching FastAPI envelope
│   │   ├── components/
│   │   │   ├── ui/                          # shadcn/ui components
│   │   │   └── layout/
│   │   │       ├── ResidentLayout.tsx
│   │   │       ├── AdminLayout.tsx
│   │   │       └── FirmLayout.tsx
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── constants/
│   │       └── config.ts                    # API_BASE_URL from env
│   │
│   ├── app/
│   │   ├── providers.tsx                    # QueryClient, Theme, Auth providers
│   │   └── styles/
│   │       ├── index.css
│   │       └── fonts.css
│   │
│   ├── router.tsx                           # createRouter() config
│   ├── routeTree.gen.ts                     # AUTO-GENERATED (never edit)
│   ├── entry-client.tsx                     # hydrateRoot()
│   └── entry-server.tsx                     # SSR handler
│
├── public/
├── app.config.ts                            # TanStack Start + Nitro config
├── package.json
└── tsconfig.json
```

---

## FastAPI Integration

### API Client

```typescript
// shared/lib/apiClient.ts

import axios from 'axios';

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,  // Send session cookies
  timeout: 10000,         // 10s timeout
});

// Unwrap FastAPI's standard envelope { status, status_code, message, data }
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle fastapi-guard 429 (rate limit) and 403 (blocked)
    // These don't match the app envelope format
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait and try again.');
    }
    if (error.response?.status === 403) {
      throw new Error('Access denied.');
    }
    throw error;
  }
);
```

### Type-Safe Envelope

```typescript
// shared/types/api.types.ts

// Matches FastAPI's response format exactly
export interface ApiResponse<T> {
  status: boolean;
  status_code: number;
  message: string;
  data: T | null;
}

export interface Paginated<T> {
  items: T[];
  skip: number;
  limit: number;
  total: number;
}
```

---

## Deployment

TanStack Start uses **Nitro** as its server engine, which can be configured for Docker/Node.js:

```typescript
// app.config.ts

import { defineConfig } from '@tanstack/react-start/config'

export default defineConfig({
  server: {
    preset: 'node-server',  // Runs as Node.js HTTP server
    // Other options: 'vercel', 'netlify', 'cloudflare-workers'
  },
})
```

In Docker, it runs as a Node.js process on port 3000, with Nginx reverse-proxying to it.

---

[← Previous: Security](./10-security-architecture.md) | [Back to Index](./README.md) | [Next: React Native Mobile →](./12-react-native-mobile.md)
