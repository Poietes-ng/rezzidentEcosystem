import { createFileRoute } from '@tanstack/react-router'
import { VerifyPhoneOtpScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/verify-phone')({
  component: VerifyPhoneOtpScreen,
})
