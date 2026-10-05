import { createFileRoute } from '@tanstack/react-router'
import { VerifyEmailOtpScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/verify-email')({
  component: VerifyEmailOtpScreen,
})
