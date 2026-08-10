# 12 — React Native Mobile (Parallel Development)

[← Previous: Frontend](./11-tanstack-start-frontend.md) | [Back to Index](./README.md) | [Next: Database Schema →](./13-database-schema.md)

---

## Strategy: Shared API Client, Separate UI

The mobile app and web app share the same FastAPI backend and the same TypeScript API client library. Only the UI layer is different.

```
┌──────────────────────────────────────────────┐
│             Monorepo (Turborepo)              │
│                                              │
│  apps/                                       │
│  ├── web/           ← TanStack Start         │
│  └── mobile/        ← React Native (Expo)    │
│                                              │
│  packages/                                   │
│  ├── api-client/    ← Shared TypeScript      │
│  │   ├── client.ts     Axios instance        │
│  │   ├── auth.ts       Auth API calls        │
│  │   ├── bills.ts      Bill queries          │
│  │   ├── visitors.ts   Visitor code CRUD     │
│  │   ├── household.ts  Family tree API       │
│  │   └── types.ts      Shared types          │
│  │                                           │
│  ├── shared-types/  ← TypeScript interfaces  │
│  └── shared-utils/  ← Formatters, validators │
│                                              │
│  package.json       ← Workspace root         │
│  turbo.json         ← Build orchestration    │
└──────────────────────────────────────────────┘
```

### Why Expo

| Feature | Expo | Raw React Native |
|---------|------|-----------------|
| Setup time | Minutes | Hours |
| OTA updates | ✅ `expo-updates` | Manual |
| Biometric auth | ✅ `expo-local-authentication` | Manual native module |
| Secure storage | ✅ `expo-secure-store` | Manual Keychain/Keystore |
| Push notifications | ✅ `expo-notifications` | Firebase setup required |
| Camera (selfie, QR scan) | ✅ `expo-camera` | Manual |
| File picker (CSV) | ✅ `expo-document-picker` | Manual |
| Build & distribute | `eas build` (cloud) | Xcode + Android Studio |

---

## Mobile Screen Map

```
paradise-estate-mobile/
├── app/                              # Expo Router (file-based routing)
│   ├── _layout.tsx                   # Root layout (font loading, providers)
│   │
│   ├── (onboarding)/                 # First-time user flow
│   │   ├── _layout.tsx              # Stack navigator
│   │   ├── welcome.tsx              # Splash + "Get Started"
│   │   ├── join-estate.tsx          # Enter Estate ID
│   │   ├── verify-phone.tsx         # Phone + OTP
│   │   ├── set-pin.tsx             # 4-digit PIN setup
│   │   └── biometric-setup.tsx     # "Enable Face ID?" (optional)
│   │
│   ├── (auth)/                       # Returning user login
│   │   ├── _layout.tsx
│   │   ├── login.tsx                # Phone → OTP → PIN
│   │   └── pin-unlock.tsx           # Quick unlock (PIN or biometric)
│   │
│   ├── (tabs)/                       # Main app (tab navigator)
│   │   ├── _layout.tsx              # Bottom tab bar
│   │   ├── index.tsx                # Dashboard (home tab)
│   │   ├── bills/
│   │   │   ├── index.tsx            # Bill list
│   │   │   └── [billId].tsx         # Bill detail + Paystack payment
│   │   ├── visitors/
│   │   │   ├── index.tsx            # Visitor code list
│   │   │   └── create.tsx           # Schedule visitor + QR code
│   │   ├── community.tsx            # Estate chat (WebSocket)
│   │   └── more.tsx                 # Settings, household, profile
│   │
│   ├── household/                    # Deep-linked screens
│   │   ├── index.tsx                # Family tree overview
│   │   ├── add-member.tsx           # Add managed member
│   │   └── permissions.tsx          # Edit member permissions
│   │
│   ├── verification/                 # Vouch request screens
│   │   ├── request.tsx              # "Ask neighbor to vouch"
│   │   └── vouch.tsx                # "Vouch for this resident?"
│   │
│   └── (admin)/                      # Admin-only screens (role-gated)
│       ├── verifications.tsx        # Pending verification queue
│       └── settings.tsx             # Estate settings
│
├── components/                       # Shared UI components
│   ├── PINInput.tsx                 # 4-dot PIN entry
│   ├── QRCode.tsx                   # QR code generator/scanner
│   ├── BiometricPrompt.tsx          # Face ID / fingerprint prompt
│   └── EstateIDInput.tsx            # Masked estate code input
│
├── hooks/                            # Custom hooks
│   ├── useAuth.ts                   # Auth state management
│   ├── useBiometric.ts             # Biometric availability check
│   └── usePushNotifications.ts     # FCM/APNs registration
│
├── app.json                          # Expo config
├── eas.json                          # EAS Build config
└── package.json
```

---

## Key Mobile-Specific Features

### 1. PIN Unlock Screen

```
┌──────────────────────────┐
│                          │
│     🏢 Paradise Estate   │
│                          │
│     Enter your PIN       │
│                          │
│     ● ● ○ ○              │
│                          │
│   [1] [2] [3]           │
│   [4] [5] [6]           │
│   [7] [8] [9]           │
│   [ ] [0] [⌫]           │
│                          │
│   Use Face ID instead?   │
│                          │
│   Forgot PIN?            │
│                          │
└──────────────────────────┘
```

### 2. QR Code for Visitors

```
┌──────────────────────────┐
│                          │
│  Visitor Code: VIS-4839  │
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │    [QR CODE]       │  │
│  │                    │  │
│  └────────────────────┘  │
│                          │
│  Visitor: "John Doe"     │
│  Valid: 2:00 PM - 5:00 PM│
│  Purpose: Delivery       │
│                          │
│  [Share via WhatsApp]    │
│  [Copy Code]             │
│                          │
└──────────────────────────┘
```

### 3. Gate QR Scanner (Security Guard)

```
┌──────────────────────────┐
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │    [CAMERA VIEW]   │  │
│  │    Scan visitor     │  │
│  │    QR code          │  │
│  │                    │  │
│  └────────────────────┘  │
│                          │
│  Or enter code manually: │
│  [VIS-____]              │
│                          │
│  ✅ VALID                │
│  Visitor: John Doe       │
│  Host: Mary Adebayo      │
│  House: A101             │
│  Valid until: 5:00 PM    │
│                          │
│  [Log Entry] [Deny]      │
│                          │
└──────────────────────────┘
```

---

## Offline Support

Nigerian mobile networks can be unreliable. The app should work offline for key features:

| Feature | Offline Behavior |
|---------|-----------------|
| View dashboard | ✅ Cached data (last sync) |
| View bills | ✅ Cached |
| Pay bills | ❌ Requires connection (Paystack) |
| View visitor codes | ✅ Cached + QR renders offline |
| Create visitor codes | ⚠️ Queued, syncs when online |
| Community chat | ⚠️ Queued messages, syncs when online |
| Biometric/PIN unlock | ✅ Fully offline (device-level) |

---

## Push Notifications

| Event | Notification | Priority |
|-------|-------------|----------|
| Visitor arrived at gate | "🚪 Your visitor John Doe has arrived" | **HIGH** |
| Bill due in 3 days | "💰 Electricity bill (₦45,000) due on July 20" | MEDIUM |
| Bill overdue | "⚠️ Security levy is overdue" | HIGH |
| Payment confirmed | "✅ Payment of ₦45,000 received" | MEDIUM |
| Verification approved | "🎉 Your account has been verified!" | HIGH |
| Vouch request | "👋 John Smith is asking you to verify them" | MEDIUM |
| New estate announcement | "📢 New announcement from your estate" | MEDIUM |
| PIN lockout alert | "🔒 Your account was locked (5 failed PIN attempts)" | **HIGH** |

---

## Build & Distribution

```
Development:
  npx expo start                    # Local dev server

Preview builds:
  eas build -p ios --profile preview
  eas build -p android --profile preview

Production:
  eas build -p ios --profile production
  eas build -p android --profile production

Distribution:
  eas submit -p ios                 # App Store
  eas submit -p android             # Play Store

OTA updates (no App Store review):
  eas update --branch production    # Push JS/asset changes instantly
```

---

[← Previous: Frontend](./11-tanstack-start-frontend.md) | [Back to Index](./README.md) | [Next: Database Schema →](./13-database-schema.md)
