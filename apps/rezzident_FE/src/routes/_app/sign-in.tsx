import { createFileRoute } from '@tanstack/react-router'
import { SignInScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/sign-in')({
  component: SignInScreen,
})
