import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'
import type {
  AuthFlowState,
  LoginMethod,
  RecoveryMethod,
} from '../types/auth-flow.types'

interface AuthFlowContextValue {
  state: AuthFlowState
  setLoginMethod: (method: LoginMethod) => void
  setPhoneNumber: (phone: string) => void
  setEstateId: (id: string) => void
  setRememberMe: (remember: boolean) => void
  setPin: (pin: string) => void
  appendPinDigit: (digit: string) => void
  backspacePin: () => void
  clearPin: () => void
  setRecoveryMethod: (method: RecoveryMethod | null) => void
  resetFlow: () => void
}

const DEFAULT_AUTH_FLOW_STATE: AuthFlowState = {
  loginMethod: 'estate-id',
  phoneNumber: '',
  estateId: '',
  rememberMe: false,
  pin: '',
  recoveryMethod: null,
  maskedPhone: '••• 4593',
  maskedEmail: 's•••••@rezzident.co',
}

const AuthFlowContext = createContext<AuthFlowContextValue | undefined>(
  undefined,
)

export function AuthFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthFlowState>(DEFAULT_AUTH_FLOW_STATE)

  const setLoginMethod = useCallback((loginMethod: LoginMethod) => {
    setState((prev) => ({ ...prev, loginMethod }))
  }, [])

  const setPhoneNumber = useCallback((phoneNumber: string) => {
    const cleanDigits = phoneNumber.replace(/\D/g, '')
    const last4 = cleanDigits.slice(-4) || '4593'
    setState((prev) => ({
      ...prev,
      phoneNumber,
      maskedPhone: `••• ${last4}`,
    }))
  }, [])

  const setEstateId = useCallback((estateId: string) => {
    setState((prev) => ({ ...prev, estateId }))
  }, [])

  const setRememberMe = useCallback((rememberMe: boolean) => {
    setState((prev) => ({ ...prev, rememberMe }))
  }, [])

  const setPin = useCallback((pin: string) => {
    setState((prev) => ({ ...prev, pin: pin.slice(0, 4) }))
  }, [])

  const appendPinDigit = useCallback((digit: string) => {
    setState((prev) => {
      if (prev.pin.length >= 4) return prev
      return { ...prev, pin: prev.pin + digit }
    })
  }, [])

  const backspacePin = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pin: prev.pin.slice(0, -1),
    }))
  }, [])

  const clearPin = useCallback(() => {
    setState((prev) => ({ ...prev, pin: '' }))
  }, [])

  const setRecoveryMethod = useCallback(
    (recoveryMethod: RecoveryMethod | null) => {
      setState((prev) => ({ ...prev, recoveryMethod }))
    },
    [],
  )

  const resetFlow = useCallback(() => {
    setState(DEFAULT_AUTH_FLOW_STATE)
  }, [])

  const value = useMemo(
    () => ({
      state,
      setLoginMethod,
      setPhoneNumber,
      setEstateId,
      setRememberMe,
      setPin,
      appendPinDigit,
      backspacePin,
      clearPin,
      setRecoveryMethod,
      resetFlow,
    }),
    [
      state,
      setLoginMethod,
      setPhoneNumber,
      setEstateId,
      setRememberMe,
      setPin,
      appendPinDigit,
      backspacePin,
      clearPin,
      setRecoveryMethod,
      resetFlow,
    ],
  )

  return (
    <AuthFlowContext.Provider value={value}>
      {children}
    </AuthFlowContext.Provider>
  )
}

export function useAuthFlow() {
  const context = useContext(AuthFlowContext)
  if (!context) {
    throw new Error('useAuthFlow must be used within an AuthFlowProvider')
  }
  return context
}
