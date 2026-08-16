import * as React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import { cn } from '@/lib/cn';

/**
 * Mirrors rezzident_FE/src/shared/components/ui/button.tsx
 * Matches Rezzident Design System Foundations v1.0.0 — 03 Interactive Button States
 *
 * Spec: border-radius 12px (rounded-xl), min-height 56px, padding 16px 24px,
 *       font DM Sans Medium 16px, 8pt grid.
 *
 * NativeWind only — no StyleSheet.create.
 * Note: rounded-xl = 12px which matches the spec exactly.
 */
export type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'accent' | 'outline-gold';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  className?: string;
  textClassName?: string;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const containerVariants: Record<ButtonVariant, string> = {
  default:
    'rounded-xl bg-actionDark active:bg-actionDarkPressed disabled:bg-stoneEdge',
  secondary:
    'rounded-xl bg-white border border-stoneEdge active:bg-offWhite disabled:opacity-50',
  ghost:
    'bg-transparent disabled:opacity-50',
  accent:
    'rounded-xl bg-actionYellow active:bg-actionYellowPressed disabled:bg-stoneEdge',
  'outline-gold':
    'rounded-xl bg-white border border-actionYellow active:bg-offWhite disabled:opacity-50',
};

const textVariants: Record<ButtonVariant, string> = {
  default: 'text-white',
  secondary: 'text-actionDark',
  ghost: 'text-actionDark underline',
  accent: 'text-actionDark',
  'outline-gold': 'text-actionYellow',
};

const disabledTextVariants: Record<ButtonVariant, string> = {
  default: 'text-warmGray',
  secondary: 'text-mutedOlive',
  ghost: 'text-mutedOlive',
  accent: 'text-warmGray',
  'outline-gold': 'text-mutedOlive',
};

export const Button = React.forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(
  ({ className, textClassName, variant = 'default', loading, loadingText = 'Please wait', disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'flex-row items-center justify-center',
          variant !== 'ghost' && 'h-[56px] min-h-[56px] px-6',
          containerVariants[variant],
          className
        )}
        style={variant !== 'ghost' ? { borderRadius: 12 } : undefined}
        {...props}
      >
        {loading ? (
          <>
            <ActivityIndicator
              color={variant === 'default' ? '#FFFFFF' : '#1A1A1A'}
              style={{ marginRight: 8 }}
            />
            <Text className={cn('font-dmsans text-body-base font-medium', textVariants[variant], textClassName)}>
              {loadingText}
            </Text>
          </>
        ) : typeof children === 'string' ? (
          <Text
            className={cn(
              'font-dmsans text-body-base font-medium',
              isDisabled ? disabledTextVariants[variant] : textVariants[variant],
              textClassName
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
Button.displayName = 'Button';
