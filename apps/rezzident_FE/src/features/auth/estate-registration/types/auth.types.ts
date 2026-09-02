export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  initials: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
  confirmPassword: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
