import { createFileRoute } from '@tanstack/react-router'
import { VerifyPhoneOtpScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/verify-phone')({
  component: VerifyPhoneOtpScreen,
})
