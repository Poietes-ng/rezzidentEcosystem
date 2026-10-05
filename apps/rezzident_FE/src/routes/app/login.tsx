import { createFileRoute } from '@tanstack/react-router'
import { LoginScreen } from '#/features/application/components/login'

export const Route = createFileRoute('/app/login')({
  component: LoginScreen,
})
