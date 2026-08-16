/**
 * Home tab — dashboard.
 */
import { View, Text, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/components/layout';

export default function HomeScreen() {
  return (
    <ScreenWrapper scroll>
      <Text className="mb-2xs font-dmsans text-heading-1 font-semibold text-actionDark">
        Good morning
      </Text>
      <Text className="mb-xl font-dmsans text-body-base text-warmGray">
        Dashboard scaffold — widgets will be built in feature phase
      </Text>

      {/* Quick stats */}
      <View className="gap-sm">
        {[
          { label: 'Outstanding Bills', value: '—', color: '#D4A030' },
          { label: 'Visitors Today', value: '—', color: '#FFE022' },
          { label: 'Notifications', value: '—', color: '#2DB84E' },
        ].map((stat) => (
          <View
            key={stat.label}
            className="rounded-btn bg-white p-md"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: stat.color,
              borderRadius: 12,
            }}
          >
            <Text className="mb-2xs font-dmsans text-caption text-warmGray">
              {stat.label}
            </Text>
            <Text className="font-dmsans text-heading-2 font-bold text-actionDark">
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
}
