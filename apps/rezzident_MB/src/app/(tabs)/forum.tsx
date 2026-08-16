import { View, Text } from 'react-native';
import { ScreenWrapper } from '@/components/layout';

export default function ForumScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <Text className="font-dmsans text-heading-2 font-semibold text-actionDark">
          Forum
        </Text>
        <Text className="mt-xs font-dmsans text-body-base text-warmGray">
          Community discussions coming soon
        </Text>
      </View>
    </ScreenWrapper>
  );
}
