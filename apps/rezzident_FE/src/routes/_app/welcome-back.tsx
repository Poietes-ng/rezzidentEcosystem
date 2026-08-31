import { createFileRoute } from '@tanstack/react-router'
import { WelcomeBackPinScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/welcome-back')({
  component: WelcomeBackPinScreen,
})
