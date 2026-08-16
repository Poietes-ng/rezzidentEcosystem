import * as React from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { cn } from '@/lib/cn';

/**
 * Shared auth layout — back arrow, title/subtitle, scrollable body, fixed footer.
 * Fully NativeWind. No StyleSheet.create.
 */
export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, onBack, children, footer }: AuthLayoutProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView className="flex-1 bg-lightCream" edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className={cn(
              'flex-1 px-6 pt-2 w-full',
              isTablet && 'self-center max-w-[480px]'
            )}
          >
            {/* Back arrow — same style as JoinEstateFlow */}
            <Pressable
              onPress={onBack ?? (() => router.back())}
              className="mt-[25px] mb-[25px] self-start"
              hitSlop={12}
            >
              <MaterialIcons name="arrow-back-ios-new" size={22} color="#1A1A1A" />
            </Pressable>

            <Text className="mb-1 font-dmsans text-[28px] leading-8 text-actionDark">
              {title}
            </Text>
            {subtitle ? (
              <Text className="mb-6 font-dmsans text-body-base text-warmGray">
                {subtitle}
              </Text>
            ) : null}

            <View className="flex-1">{children}</View>
          </View>
        </ScrollView>

        {footer ? (
          <View
            className={cn(
              'px-6 pb-5 pt-4 w-full',
              isTablet && 'self-center max-w-[480px]'
            )}
          >
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
