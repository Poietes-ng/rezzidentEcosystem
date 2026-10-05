import { useAuthFlow } from '../context/AuthFlowContext'
import { SignInPhoneScreen } from './SignInPhoneScreen'
import { SignInEstateIdScreen } from './SignInEstateIdScreen'

export function SignInScreen() {
  const { state } = useAuthFlow()

  if (state.loginMethod === 'estate-id') {
    return <SignInEstateIdScreen />
  }

  return <SignInPhoneScreen />
}
