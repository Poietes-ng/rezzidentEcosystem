//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import boundaries from 'eslint-plugin-boundaries'

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
      // Features cannot import from other features — use shared instead
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // shared → can import from shared only
            { from: 'shared', allow: ['shared'] },
            // feature → can import from shared + own feature
            {
              from: 'feature',
              allow: [
                'shared',
                ['feature', { feature: '${from.feature}' }],
              ],
            },
            // routes → can import from shared + any feature
            { from: 'route', allow: ['shared', 'feature'] },
            // app → can import from anything
            { from: 'app', allow: ['shared', 'feature', 'route', 'app'] },
          ],
        },
      ],
    },
  },

  // ── Existing rules ──
  {
    rules: {
      'import/no-cycle': 'warn',
      'import/order': 'warn',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'no-console': 'warn',
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
]
