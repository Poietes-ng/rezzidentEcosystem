import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(({ mode }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    devtools(),
    tailwindcss(),
    viteReact(),
    ...(mode === 'analyze'
      ? [
          import('vite-bundle-analyzer').then((m) =>
            m.analyzer({ analyzerMode: 'static', fileName: 'bundle-report' }),
          ),
        ]
      : []),
  ],
  server: {
    // Covers every current ngrok domain suffix so a fresh free-tier
    // subdomain never trips Vite's "Blocked request" host check.
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.io', '.ngrok.app'],

    // Three cases:
    // 1. VITE_PUBLIC_HOST set → demoing through ngrok, HMR must go out over wss
    //    on 443 to the tunnel domain.
    // 2. VITE_HMR_PORT set (no public host) → normal Docker dev, browser on
    //    the same machine, connects back on the mapped host port.
    // 3. Neither set → running outside Docker, Vite's default HMR is fine.
    hmr: process.env.VITE_PUBLIC_HOST
      ? {
          protocol: 'wss',
          clientPort: 443,
          host: process.env.VITE_PUBLIC_HOST,
        }
      : process.env.VITE_HMR_PORT
        ? {
            clientPort: Number(process.env.VITE_HMR_PORT),
            host: process.env.VITE_HMR_HOST ?? 'localhost',
          }
        : true,
  },
}))

export default config
