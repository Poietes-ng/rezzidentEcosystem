import { View, Text, Pressable } from 'react-native'
import { PinInput, Button } from '@/components/ui'
import { AuthLayout } from './AuthLayout'
import { useAuthForm } from '../hooks/useAuthForm'
import { verifyOtp, requestOtp } from '../api/authQueries'
import { useState, useEffect } from 'react'

export interface OtpStepProps {
  phone: string
  /** Determines which backend endpoint is hit: login or registration OTP verification. */
  purpose?: 'registration' | 'login'
  /** Called once the OTP is accepted by the server — no payload; tokens come from set-pin. */
  onVerified: () => void
  onBack: () => void
  form: ReturnType<typeof useAuthForm>
}

/** Step 2 — OTP verification. */
export function OtpStep({ phone, purpose = 'registration', onVerified, onBack, form }: OtpStepProps) {
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (form.otp.length === 6) {
      const timer = setTimeout(() => {
        handleVerify()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [form.otp])

  const handleVerify = async () => {
    if (!form.validateOtp()) return
    setSubmitting(true)
    try {
      await verifyOtp({ phone_number: phone, otp_code: form.otp.trim(), purpose })
      // /auth/register/verify-otp returns { phone_number, verified } — no tokens.
      // Simply advance to the PIN step on HTTP success; tokens are issued by set-pin.
      onVerified()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Verify your number"
      subtitle={`Enter the 6-digit code sent to ${phone}`}
      onBack={onBack}
      footer={
        <Button variant="default" className="w-full" loading={submitting} onPress={handleVerify}>
          Verify
        </Button>
      }
    >
      <View className="items-center gap-lg">
        <PinInput length={6} value={form.otp} onChange={(v) => form.setField('otp', v)} />
        {form.errors.otp ? (
          <Text className="font-dmsans text-caption text-red-500">{form.errors.otp}</Text>
        ) : null}
        <Pressable onPress={() => requestOtp({ phone_number: phone })}>
          <Text className="font-dmsans text-body-small font-medium text-actionDark underline">
            Resend code
          </Text>
        </Pressable>
      </View>
    </AuthLayout>
  )
}
