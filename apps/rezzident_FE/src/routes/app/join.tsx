import { createFileRoute } from '@tanstack/react-router'
import { JoinEstateFlow } from '#/features/auth/users-sign-in'

export const Route = createFileRoute('/app/join')({
  component: JoinEstateFlow,
})
