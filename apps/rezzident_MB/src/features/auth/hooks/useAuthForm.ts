import { useCallback, useState } from 'react';
import type { AuthFormState } from '../types/auth.types';

/**
 * Mirrors rezzident_FE/src/features/auth/hooks/useAuthForm.ts, adapted to
 * the phone -> OTP -> PIN fields the mobile flow actually collects
 * (web collects email/password/name instead).
 */
export function useAuthForm() {
  const [state, setState] = useState<AuthFormState>({
    phone: '',
    otp: '',
    pin: '',
    confirmPin: '',
    errors: {},
  });

  const setField = useCallback(<K extends keyof Omit<AuthFormState, 'errors'>>(field: K, value: string) => {
    setState((prev) => ({ ...prev, [field]: value, errors: { ...prev.errors, [field]: undefined } }));
  }, []);

  const validatePhone = useCallback((): boolean => {
    const valid = /^\+?[0-9]{10,14}$/.test(state.phone.trim());
    setState((prev) => ({ ...prev, errors: { ...prev.errors, phone: valid ? undefined : 'Enter a valid phone number' } }));
    return valid;
  }, [state.phone]);

  const validateOtp = useCallback((): boolean => {
    const valid = state.otp.trim().length === 4;
    setState((prev) => ({ ...prev, errors: { ...prev.errors, otp: valid ? undefined : 'Enter the 4-digit code' } }));
    return valid;
  }, [state.otp]);

  const validatePin = useCallback((): boolean => {
    const pinValid = state.pin.length === 4;
    const matchValid = state.pin === state.confirmPin;
    setState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        pin: pinValid ? undefined : 'PIN must be 4 digits',
        confirmPin: matchValid ? undefined : 'PINs do not match',
      },
    }));
    return pinValid && matchValid;
  }, [state.pin, state.confirmPin]);

  const reset = useCallback(() => setState({ phone: '', otp: '', pin: '', confirmPin: '', errors: {} }), []);

  return { ...state, setField, validatePhone, validateOtp, validatePin, reset };
}
