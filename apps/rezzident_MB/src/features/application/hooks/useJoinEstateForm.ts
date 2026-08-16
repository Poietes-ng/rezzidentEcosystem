import { useCallback, useState } from 'react';
import type { JoinEstateFormState, JoinEstateStep } from '../types/application.types';

const STEP_ORDER: JoinEstateStep[] = ['estate', 'personal', 'otp', 'address', 'face', 'pin'];

/** Drives the 6-step join-estate wizard — mirrors the internalStep state machine in rezzident_FE join-estate.tsx. */
export function useJoinEstateForm() {
  const [step, setStep] = useState<JoinEstateStep>('estate');
  const [form, setForm] = useState<JoinEstateFormState>({
    estateId: '',
    fullName: '',
    phone: '',
    otp: '',
    street: '',
    houseNumber: '',
    enableFaceId: false,
    faceCaptureUri: null,
    pin: '',
    confirmPin: '',
  });

  const setField = useCallback(<K extends keyof JoinEstateFormState>(field: K, value: JoinEstateFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const stepIndex = STEP_ORDER.indexOf(step);

  const next = useCallback(() => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx < STEP_ORDER.length - 1) setStep(STEP_ORDER[idx + 1]);
  }, [step]);

  const back = useCallback(() => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  }, [step]);

  return { step, stepIndex, totalSteps: STEP_ORDER.length, form, setField, next, back };
}
