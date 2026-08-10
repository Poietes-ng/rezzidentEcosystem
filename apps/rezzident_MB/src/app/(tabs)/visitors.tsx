import { View, Text, SafeAreaView } from 'react-native';

export default function VisitorsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#212121', marginBottom: 8 }}>
          Visitors
        </Text>
        <Text style={{ fontSize: 14, color: '#9e9e9e', textAlign: 'center' }}>
          Visitor management scaffold — generate codes, track entries
        </Text>
      </View>
    </SafeAreaView>
  );
}
