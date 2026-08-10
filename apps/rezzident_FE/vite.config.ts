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
}))

export default config