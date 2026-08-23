/// <reference types="vitest" />
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'

/**
 * Vitest configuration — separate from vite.config.ts
 *
 * WHY SEPARATE?
 * The main vite.config.ts includes the TanStack Router plugin
 * which auto-generates routes on startup. That plugin fails if
 * there are route conflicts (which is a separate issue to fix).
 * Tests don't need routing — they test isolated components and
 * utilities. So we skip the router plugin entirely here.
 */
export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      '#': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: [],
  },
})
