/**
 * Login screen — mobile. 3-step flow: Phone -> OTP -> PIN.
 * (Previously a static scaffold; now backed by features/auth.)
 */
import { useState } from 'react';
import { router } from 'expo-router';
import { PhoneStep, OtpStep, PinStep, useAuthForm, useAuthStore } from '@/features/auth';
import type { AuthStep } from '@/features/auth';

export default function LoginScreen() {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const form = useAuthForm();
  const setAuth = useAuthStore((s) => s.setAuth);

  if (step === 'phone') {
    return (
      <PhoneStep
        form={form}
        onSubmitted={(p) => {
          setPhone(p);
          setStep('otp');
        }}
      />
    );
  }

  if (step === 'otp') {
    return (
      <OtpStep
        phone={phone}
        form={form}
        onBack={() => setStep('phone')}
        onVerified={async (result) => {
          await setAuth(result.user, result.tokens);
          router.replace('/(tabs)');
        }}
      />
    );
  }

  return (
    <PinStep
      form={form}
      onBack={() => setStep('otp')}
      onComplete={() => router.replace('/(tabs)')}
    />
  );
}
