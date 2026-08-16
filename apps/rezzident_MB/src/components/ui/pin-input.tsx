import React, { useRef, useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { cn } from '@/lib/cn';

/** Mirrors rezzident_FE/src/shared/components/ui/pin-input.tsx (dot-per-digit, underline). */
export interface PinInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  secure?: boolean;
  className?: string;
}

export function PinInput({ length = 4, value = '', onChange, className }: PinInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const setDigit = (digit: string, index: number) => {
    const chars = value.split('');
    chars[index] = digit;
    onChange?.(chars.join('').slice(0, length));
    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className={cn('flex-row items-center gap-4', className)}>
      {Array.from({ length }).map((_, index) => {
        const filled = Boolean(value[index]);
        const focused = focusedIndex === index;
        return (
          <Pressable
            key={index}
            onPress={() => inputRefs.current[index]?.focus()}
            className="relative h-[48px] w-[32px] items-center justify-center"
          >
            <TextInput
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={value[index] ?? ''}
              onChangeText={(t) => setDigit(t.slice(-1), index)}
              onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              maxLength={1}
              className="absolute inset-0 h-full w-full text-center text-transparent"
              caretHidden
            />
            <View pointerEvents="none" className="h-full w-full items-center justify-center">
              {filled ? <View className="size-2 rounded-full bg-actionDark" /> : null}
            </View>
            <View
              pointerEvents="none"
              className={cn('absolute bottom-0 left-0 h-[2px] w-full', focused ? 'bg-actionYellow' : 'bg-[#E5E5E5]')}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
