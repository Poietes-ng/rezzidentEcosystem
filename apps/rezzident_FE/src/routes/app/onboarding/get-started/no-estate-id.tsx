import { createFileRoute } from '@tanstack/react-router'
import IDontHaveEstatePrefix from '#/features/auth/user-login/components/IDontHaveEstatePrefix'

export const Route = createFileRoute('/app/onboarding/get-started/no-estate-id')({
  component: IDontHaveEstatePrefix,
})
