import { createFileRoute } from '@tanstack/react-router'
import { AccountRecoveryChoiceScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/account-recovery')({
  component: AccountRecoveryChoiceScreen,
})
