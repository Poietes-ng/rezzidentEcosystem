import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

/**
 * CTABlock — fixed-bottom call-to-action area.
 *
 * Spec (07 App Frame & Layout):
 *   CTA Block Padding: 24px horizontal, 16px bottom
 *   Sits above the bottom safe area inset.
 */
export interface CTABlockProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export function CTABlock({ className, children, style, ...props }: CTABlockProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-lightCream px-cta-h',
        className
      )}
      style={[{ paddingBottom: Math.max(insets.bottom, 16) }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
