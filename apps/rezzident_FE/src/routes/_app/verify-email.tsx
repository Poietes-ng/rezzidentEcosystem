import { createFileRoute } from '@tanstack/react-router'
import { VerifyEmailOtpScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/verify-email')({
  component: VerifyEmailOtpScreen,
})
