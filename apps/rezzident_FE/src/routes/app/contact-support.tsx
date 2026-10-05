import { createFileRoute } from '@tanstack/react-router'
import { ContactSupportScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/contact-support')({
  component: ContactSupportScreen,
})
