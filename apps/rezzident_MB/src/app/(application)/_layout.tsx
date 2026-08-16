/**
 * Application (onboarding) group — splash, welcome carousel, join-estate wizard.
 * Separate stack from (auth) because these screens run BEFORE a user picks
 * "sign in" vs "join estate" — (auth) is sign-in only.
 */
import { Stack } from 'expo-router';

export default function ApplicationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="join" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
