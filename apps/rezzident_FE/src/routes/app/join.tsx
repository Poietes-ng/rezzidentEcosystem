import { createFileRoute } from '@tanstack/react-router'
import { JoinEstateFlow } from '#/features/auth/user-login'

export const Route = createFileRoute('/app/join')({
  component: JoinEstateFlow,
})
