import { View, ScrollView, KeyboardAvoidingView, Platform, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

/**
 * ScreenWrapper — wraps every screen with the correct safe areas,
 * content margins, and keyboard avoidance from the Rezzident Design System.
 *
 * Spec (07 App Frame & Layout):
 *   Content Margins: 24px left / 24px right
 *   Background: #FFFFFC (lightCream)
 *   Status Bar: 54px iOS safe area
 *   Bottom Safe Area: 21px
 *
 * This is the GLOBAL fix for content hitting the status bar.
 * Every screen should use <ScreenWrapper> instead of raw <View>.
 */
export interface ScreenWrapperProps extends ViewProps {
  /** Set false to remove horizontal padding (e.g. for full-bleed screens) */
  padded?: boolean;
  /** Set false to disable SafeAreaView (e.g. inside a modal) */
  safe?: boolean;
  /** Which safe area edges to respect. Default: all */
  edges?: Edge[];
  /** Wrap content in ScrollView for long content */
  scroll?: boolean;
  /** Enable keyboard avoidance for forms */
  keyboardAware?: boolean;
  className?: string;
  /** className for the inner content container */
  contentClassName?: string;
  children: React.ReactNode;
}

export function ScreenWrapper({
  padded = true,
  safe = true,
  edges = ['top', 'left', 'right', 'bottom'],
  scroll = false,
  keyboardAware = false,
  className,
  contentClassName,
  children,
  ...props
}: ScreenWrapperProps) {
  const content = (
    <View
      className={cn(
        'flex-1',
        padded && 'px-content-margin',
        contentClassName
      )}
    >
      {children}
    </View>
  );

  const scrollableContent = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const keyboardContent = keyboardAware ? (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {scrollableContent}
    </KeyboardAvoidingView>
  ) : (
    scrollableContent
  );

  if (safe) {
    return (
      <SafeAreaView
        className={cn('flex-1 bg-lightCream', className)}
        edges={edges}
        {...props}
      >
        {keyboardContent}
      </SafeAreaView>
    );
  }

  return (
    <View className={cn('flex-1 bg-lightCream', className)} {...props}>
      {keyboardContent}
    </View>
  );
}
