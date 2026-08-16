import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cn } from '@/lib/cn';

/**
 * Mirrors rezzident_FE/src/shared/components/ui/internet-status.tsx.
 * Drive `status` from NetInfo.addEventListener at the app-shell level
 * (see app/_layout.tsx) rather than each screen polling itself.
 */
export type InternetStatusValue = 'offline' | 'reconnected' | 'online';

export interface InternetStatusProps {
  status: InternetStatusValue;
  onReconnect?: () => void;
  className?: string;
}

export function InternetStatus({ status, onReconnect, className }: InternetStatusProps) {
  const [visible, setVisible] = React.useState(false);
  const translateY = useSharedValue(-60);

  React.useEffect(() => {
    if (status === 'offline' || status === 'reconnected') {
      setVisible(true);
      translateY.value = withTiming(0, { duration: 250 });
      if (status === 'reconnected') {
        const timer = setTimeout(() => {
          translateY.value = withTiming(-60, { duration: 250 });
          setTimeout(() => setVisible(false), 260);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = withTiming(-60, { duration: 250 });
      setVisible(false);
    }
  }, [status]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  if (!visible) return null;

  return (
    <Animated.View
      style={style}
      className={cn(
        'absolute left-0 right-0 top-0 z-50 flex-row items-center justify-center gap-3 px-md py-sm',
        status === 'offline' ? 'bg-red-500' : 'bg-green-500',
        className
      )}
    >
      <Feather name={status === 'offline' ? 'wifi-off' : 'wifi'} size={18} color="#fff" />
      <Text className="font-dmsans text-body-small font-medium text-white">
        {status === 'offline' ? 'No internet connection' : 'Connection restored'}
      </Text>
      {status === 'offline' && onReconnect ? (
        <Pressable onPress={onReconnect} className="ml-2 rounded-full border border-white/30 px-sm py-1">
          <Text className="font-dmsans text-caption font-semibold text-white">Reconnect</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
