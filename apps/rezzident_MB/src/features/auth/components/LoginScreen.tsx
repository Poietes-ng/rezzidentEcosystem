/**
 * Login screen — mobile. 3-step flow: Phone -> OTP -> PIN.
 * (Previously a static scaffold; now backed by features/auth.)
 */
import { useState } from 'react'
import { router } from 'expo-router'
import { PhoneStep, OtpStep, PinStep, useAuthForm, useAuthStore } from '@/features/auth'
import { loginWithPin } from '@/features/auth/api/authQueries'
import type { AuthStep } from '@/features/auth'

export default function LoginScreen() {
  const [step, setStep] = useState<AuthStep>('phone')
  const [phone, setPhone] = useState('')
  const form = useAuthForm()
  const setAuth = useAuthStore((s) => s.setAuth)

  if (step === 'phone') {
    return (
      <PhoneStep
        form={form}
        onSubmitted={(p) => {
          setPhone(p)
          setStep('otp')
        }}
      />
    )
  }

  if (step === 'otp') {
    return (
      <OtpStep
        phone={phone}
        form={form}
        purpose="login"
        onBack={() => setStep('phone')}
        onVerified={() => setStep('pin')}
      />
    )
  }

  return (
    <PinStep
      form={form}
      phone={phone}
      onBack={() => setStep('otp')}
      onPinSubmit={async (pin, ph) => {
        // Login flow: verify existing PIN via /auth/login/verify-pin.
        // The endpoint returns user + tokens, which we persist before navigating.
        const res = await loginWithPin(pin, ph)
        await setAuth(res.data.user, res.data.tokens)
      }}
      onComplete={() => router.replace('/(tabs)')}
    />
  )
}
