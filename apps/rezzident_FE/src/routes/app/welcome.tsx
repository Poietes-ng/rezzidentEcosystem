import { createFileRoute } from '@tanstack/react-router'
import { WelcomeScreen } from '#/features/application/components/welcome'

export const Route = createFileRoute('/app/welcome')({
  component: WelcomeScreen,
})
