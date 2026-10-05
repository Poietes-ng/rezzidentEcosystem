import { createFileRoute } from '@tanstack/react-router'
import { ResetPinScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/reset-pin')({
  component: ResetPinScreen,
})
