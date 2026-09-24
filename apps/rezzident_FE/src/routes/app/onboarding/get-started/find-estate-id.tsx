import { createFileRoute } from '@tanstack/react-router'
import { QuickFinderGuide } from '#/features/auth/user-login/components/QuickFinderGuide'

export const Route = createFileRoute('/app/onboarding/get-started/find-estate-id')({
  component: QuickFinderGuide,
})
