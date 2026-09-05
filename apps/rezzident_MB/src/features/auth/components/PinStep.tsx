import { View, Text } from 'react-native'
import { PinInput, Button } from '@/components/ui'
import { AuthLayout } from './AuthLayout'
import { useAuthForm } from '../hooks/useAuthForm'
import { setPin } from '../api/authQueries'
import { useAuthStore } from '../hooks/useAuth'
import { useState, useEffect } from 'react'

export interface PinStepProps {
  onComplete: () => void
  onBack: () => void
  form: ReturnType<typeof useAuthForm>
  phone: string
  /**
   * Override the default set-pin submission.
   * Use this when the caller needs a different endpoint (e.g. loginWithPin
   * on the login flow rather than setPin on the registration flow).
   * Receives the raw PIN value and must resolve when done.
   */
  onPinSubmit?: (pin: string, phone: string) => Promise<void>
}

/** Step 3 — set a 4-digit PIN used for subsequent quick sign-in. */
export function PinStep({ onComplete, onBack, form, phone, onPinSubmit }: PinStepProps) {
  const [stage, setStage] = useState<'create' | 'confirm'>('create')
  const [submitting, setSubmitting] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    if (stage === 'create' && form.pin.length === 4) {
      const timer = setTimeout(() => setStage('confirm'), 300)
      return () => clearTimeout(timer)
    }
  }, [form.pin, stage])

  useEffect(() => {
    if (stage === 'confirm' && form.confirmPin.length === 4) {
      const timer = setTimeout(() => handleNext(), 300)
      return () => clearTimeout(timer)
    }
  }, [form.confirmPin, stage])

  const handleNext = async () => {
    if (stage === 'create') {
      if (form.pin.length !== 4) {
        form.validatePin()
        return
      }
      setStage('confirm')
      return
    }
    if (!form.validatePin()) return
    setSubmitting(true)
    try {
      if (onPinSubmit) {
        // Caller-supplied handler (e.g. loginWithPin for the login flow).
        await onPinSubmit(form.pin, phone)
      } else {
        // Default: registration set-pin endpoint returns user + tokens.
        const res = await setPin({
          pin: form.pin,
          confirm_pin: form.confirmPin,
          phone_number: phone,
        })
        await setAuth(res.data.user, res.data.tokens)
      }
      onComplete()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title={stage === 'create' ? 'Create a PIN' : 'Confirm your PIN'}
      subtitle="You'll use this PIN to sign in quickly next time"
      onBack={stage === 'confirm' ? () => setStage('create') : onBack}
      footer={
        <Button variant="default" className="w-full" loading={submitting} onPress={handleNext}>
          {stage === 'create' ? 'Continue' : 'Confirm'}
        </Button>
      }
    >
      <View className="items-center gap-lg">
        {stage === 'create' ? (
          <PinInput length={4} value={form.pin} onChange={(v) => form.setField('pin', v)} />
        ) : (
          <PinInput
            length={4}
            value={form.confirmPin}
            onChange={(v) => form.setField('confirmPin', v)}
          />
        )}
        {(form.errors.pin || form.errors.confirmPin) && (
          <Text className="font-dmsans text-caption text-red-500">
            {form.errors.pin || form.errors.confirmPin}
          </Text>
        )}
      </View>
    </AuthLayout>
  )
}
