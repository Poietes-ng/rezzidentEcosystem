import { View, Text } from 'react-native';
import { Input, Button } from '@/components/ui';
import { AuthLayout } from './AuthLayout';
import { useAuthForm } from '../hooks/useAuthForm';
import { requestOtp } from '../api/authQueries';
import { useState } from 'react';

export interface PhoneStepProps {
  onSubmitted: (phone: string) => void;
  form: ReturnType<typeof useAuthForm>;
}

/** Step 1 of the mobile login flow — mirrors the login screen in FE application/components/login.tsx, adapted to phone entry. */
export function PhoneStep({ onSubmitted, form }: PhoneStepProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!form.validatePhone()) return;
    setSubmitting(true);
    try {
      await requestOtp({ phone_number: form.phone.trim() });
      onSubmitted(form.phone.trim());
    } catch {
      form.setField('phone', form.phone); // keep value; error surfaced via form.errors below in a real impl
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your phone number to sign in"
      footer={
        <Button variant="default" className="w-full" loading={submitting} onPress={handleContinue}>
          Continue
        </Button>
      }
    >
      <Input
        label="Phone Number"
        placeholder="e.g. 08012345678"
        keyboardType="phone-pad"
        autoComplete="tel"
        value={form.phone}
        onChangeText={(v) => form.setField('phone', v)}
        error={Boolean(form.errors.phone)}
        errorText={form.errors.phone}
      />
    </AuthLayout>
  );
}
