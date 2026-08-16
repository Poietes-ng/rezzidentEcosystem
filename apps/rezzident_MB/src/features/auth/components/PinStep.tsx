import { View, Text } from 'react-native';
import { PinInput, Button } from '@/components/ui';
import { AuthLayout } from './AuthLayout';
import { useAuthForm } from '../hooks/useAuthForm';
import { setPin } from '../api/authQueries';
import { useState } from 'react';

export interface PinStepProps {
  onComplete: () => void;
  onBack: () => void;
  form: ReturnType<typeof useAuthForm>;
}

/** Step 3 — set a 4-digit PIN used for subsequent quick sign-in. */
export function PinStep({ onComplete, onBack, form }: PinStepProps) {
  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [submitting, setSubmitting] = useState(false);

  const handleNext = async () => {
    if (stage === 'create') {
      if (form.pin.length !== 4) {
        form.validatePin();
        return;
      }
      setStage('confirm');
      return;
    }
    if (!form.validatePin()) return;
    setSubmitting(true);
    try {
      await setPin({ pin: form.pin, confirm_pin: form.confirmPin });
      onComplete();
    } finally {
      setSubmitting(false);
    }
  };

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
          <PinInput length={4} value={form.confirmPin} onChange={(v) => form.setField('confirmPin', v)} />
        )}
        {(form.errors.pin || form.errors.confirmPin) && (
          <Text className="font-dmsans text-caption text-red-500">{form.errors.pin || form.errors.confirmPin}</Text>
        )}
      </View>
    </AuthLayout>
  );
}
