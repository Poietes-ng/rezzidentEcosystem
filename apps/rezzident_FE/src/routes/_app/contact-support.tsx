import { createFileRoute } from '@tanstack/react-router'
import { ContactSupportScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/contact-support')({
  component: ContactSupportScreen,
})
