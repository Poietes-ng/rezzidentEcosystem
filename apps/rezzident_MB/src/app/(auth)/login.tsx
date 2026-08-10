/**
 * Login screen — mobile.
 * 3-step flow: Phone → OTP → PIN
 */

import { View, Text, SafeAreaView } from 'react-native';

export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: '#388e3c',
            marginBottom: 8,
          }}
        >
          Welcome back
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#9e9e9e',
            textAlign: 'center',
          }}
        >
          Login screen scaffold — auth components will be built in feature phase
        </Text>
      </View>
    </SafeAreaView>
  );
}
