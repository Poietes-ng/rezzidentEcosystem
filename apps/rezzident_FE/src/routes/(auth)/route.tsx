import { createFileRoute } from '@tanstack/react-router'
import { RegAuthLayout } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/(auth)')({
  component: RegAuthLayout,
})
