import { View, Text } from 'react-native';
import { ScreenWrapper } from '@/components/layout';

export default function BillsScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <Text className="font-dmsans text-heading-2 font-semibold text-actionDark">
          Bills
        </Text>
        <Text className="mt-xs font-dmsans text-body-base text-warmGray">
          View and pay estate levies
        </Text>
      </View>
    </ScreenWrapper>
  );
}
