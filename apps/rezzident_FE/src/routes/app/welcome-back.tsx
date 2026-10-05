import { createFileRoute } from '@tanstack/react-router'
import { WelcomeBackPinScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/welcome-back')({
  component: WelcomeBackPinScreen,
})
