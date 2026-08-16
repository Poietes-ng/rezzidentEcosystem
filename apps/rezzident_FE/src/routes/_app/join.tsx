import { createFileRoute } from '@tanstack/react-router'
import { JoinEstateFlow } from '#/features/application/components/join-estate'

export const Route = createFileRoute('/_app/join')({
  component: JoinEstateFlow,
})
