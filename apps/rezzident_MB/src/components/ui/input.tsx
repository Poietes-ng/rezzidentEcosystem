import * as React from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/lib/cn';

/** Mirrors rezzident_FE/src/shared/components/ui/input.tsx (underline style).
 *  Uses semantic colors from Rezzident Design System Foundations v1.0.0 */
export interface InputProps extends TextInputProps {
  error?: boolean;
  label?: string;
  errorText?: string;
  className?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, error, label, errorText, editable = true, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);

    return (
      <View className="w-full">
        {label ? <Text className="mb-2xs font-dmsans text-label font-medium uppercase text-actionDark">{label}</Text> : null}
        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor="#C0BAB0"
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            'h-[40px] w-full border-b bg-transparent px-0 py-2 font-dmsans text-body-base text-actionDark',
            focused ? 'border-b-actionYellow' : 'border-b-stoneEdge',
            !editable && 'opacity-50',
            error && 'border-b-errorRed text-errorRed',
            className
          )}
          {...props}
        />
        {error && errorText ? <Text className="mt-2xs font-dmsans text-caption text-errorRed">{errorText}</Text> : null}
      </View>
    );
  }
);
Input.displayName = 'Input';
