import { createFileRoute } from '@tanstack/react-router'
import { AccountRecoveryChoiceScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/account-recovery')({
  component: AccountRecoveryChoiceScreen,
})
