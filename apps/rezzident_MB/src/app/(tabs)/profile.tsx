import { View, Text, SafeAreaView } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#212121', marginBottom: 8 }}>
          Profile
        </Text>
        <Text style={{ fontSize: 14, color: '#9e9e9e', textAlign: 'center' }}>
          Profile scaffold — settings, family tree, account management
        </Text>
      </View>
    </SafeAreaView>
  );
}
