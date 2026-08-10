/**
 * Home tab — dashboard.
 */

import { View, Text, SafeAreaView, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#212121',
            marginBottom: 4,
          }}
        >
          Good morning
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#9e9e9e',
            marginBottom: 24,
          }}
        >
          Dashboard scaffold — widgets will be built in feature phase
        </Text>

        {/* Quick stats */}
        <View style={{ gap: 12 }}>
          {[
            { label: 'Outstanding Bills', value: '—', color: '#ff9800' },
            { label: 'Visitors Today', value: '—', color: '#2196f3' },
            { label: 'Notifications', value: '—', color: '#4caf50' },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: stat.color,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text style={{ fontSize: 12, color: '#9e9e9e', marginBottom: 4 }}>
                {stat.label}
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#212121' }}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
