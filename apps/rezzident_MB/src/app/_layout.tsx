/**
 * Root layout — Expo Router entry.
 * Wraps entire app with providers.
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { InternetStatus, type InternetStatusValue } from '@/components/ui';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function useInternetStatus(): InternetStatusValue {
  const [status, setStatus] = useState<InternetStatusValue>('online');

  useEffect(() => {
    let wasOffline = false;
    return NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      if (!online) {
        wasOffline = true;
        setStatus('offline');
      } else if (wasOffline) {
        wasOffline = false;
        setStatus('reconnected');
      } else {
        setStatus('online');
      }
    });
  }, []);

  return status;
}

export default function RootLayout() {
  const internetStatus = useInternetStatus();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <InternetStatus status={internetStatus} />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(application)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
