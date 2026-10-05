export type LoginMethod = 'phone' | 'estate-id'

export type RecoveryMethod = 'phone' | 'email' | 'support'

export interface AuthFlowState {
  loginMethod: LoginMethod
  phoneNumber: string
  estateId: string
  rememberMe: boolean
  pin: string
  recoveryMethod: RecoveryMethod | null
  maskedPhone: string
  maskedEmail: string
}

export interface SupportChannel {
  id: string
  type: 'call' | 'chat' | 'email' | 'docs' | 'report'
  title: string
  responseTime?: string
  value: string
  description: string
  actionText?: string
  actionUrl?: string
}
