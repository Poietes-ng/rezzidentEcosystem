# Rezzident Mobile — `rezzident_MB`

Estate Management SaaS Platform — React Native Mobile App (V2)

## Tech Stack

- **Framework**: Expo SDK 52 + Expo Router v4
- **Styling**: NativeWind (Tailwind for RN)
- **Data Fetching**: TanStack Query v5
- **State**: Zustand
- **Auth Storage**: expo-secure-store (encrypted)
- **Biometrics**: expo-local-authentication
- **Language**: TypeScript 5.7

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server
npm run dev

# 3. Scan QR code with Expo Go
# or press 'i' for iOS simulator / 'a' for Android emulator
```

## Project Structure

```
rezzident_MB/
├── app.json                     # Expo config (icons, splash, permissions)
├── tailwind.config.js           # NativeWind + brand colors
├── src/
│   ├── global.css               # NativeWind entry
│   ├── app/                     # Expo Router (file-based)
│   │   ├── _layout.tsx          # Root (providers, status bar)
│   │   ├── (auth)/              # Auth screens (login, register)
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   └── (tabs)/              # Main app tabs
│   │       ├── _layout.tsx      # Bottom tab nav
│   │       ├── index.tsx        # Home / Dashboard
│   │       ├── visitors.tsx     # Visitor management
│   │       ├── bills.tsx        # Bills & payments
│   │       └── profile.tsx      # User profile
│   ├── components/ui/           # Reusable UI components
│   ├── features/                # Feature modules
│   │   └── auth/
│   │       ├── api/             # Auth API calls
│   │       ├── hooks/           # Auth state (Zustand + secure-store)
│   │       └── components/      # Auth UI components
│   ├── hooks/                   # Shared hooks
│   ├── lib/                     # API client, secure storage
│   ├── types/                   # Shared type definitions
│   ├── constants/               # App constants
│   └── assets/                  # Images, fonts, icons
└── package.json
```

## Auth Flow (Mobile-Specific)

1. **First launch**: Onboarding → Register (Phone + OTP + PIN)
2. **Returning user**: PIN unlock screen (or biometric)
3. **Biometric**: Face ID / Touch ID unlocks the stored JWT
4. **Token refresh**: Automatic via API client interceptor
5. **All tokens**: Stored encrypted via `expo-secure-store`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run build:preview` | Build preview APK/IPA |
| `npm run build:production` | Build production release |
