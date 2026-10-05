import { createFileRoute } from '@tanstack/react-router'
import { SignInScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/login')({
  component: SignInScreen,
})

export { SignInScreen as LoginScreen }
