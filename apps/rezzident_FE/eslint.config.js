// @ts-check
import { tanstackConfig } from '@tanstack/eslint-config'
import boundaries from 'eslint-plugin-boundaries'
import importX from 'eslint-plugin-import-x'

export default [
  ...tanstackConfig,
  // ── Boundary enforcement: features/X cannot import from features/Y ──
  {
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared/*' },
        { type: 'feature', pattern: 'src/features/*', capture: ['feature'] },
        { type: 'route', pattern: 'src/routes/*' },
        { type: 'app', pattern: 'src/app*' },
      ],
      'boundaries/ignore': ['**/*.test.*', '**/*.spec.*'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'shared' } },
              allow: [{ to: { element: { type: 'shared' } } }],
            },
            {
              from: { element: { type: 'feature' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                {
                  to: {
                    element: {
                      type: 'feature',
                      captured: { feature: '{{from.feature}}' },
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: 'route' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'feature' } } },
              ],
            },
            {
              from: { element: { type: 'app' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'feature' } } },
                { to: { element: { type: 'route' } } },
                { to: { element: { type: 'app' } } },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    plugins: {
      'import-x': importX,
    },
    rules: {
      'import-x/no-cycle': 'warn',
      'import-x/order': 'warn',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'no-console': 'warn',
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js', 'tailwind.config.js', 'scripts/**', '.output/**', '.vinxi/**', 'dist/**'],
  },
]
