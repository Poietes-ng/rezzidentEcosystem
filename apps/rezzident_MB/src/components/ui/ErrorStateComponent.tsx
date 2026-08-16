import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from './button';

/** Mirrors rezzident_FE/src/shared/components/ui/ErrorStateComponent.tsx */
export interface ErrorStateComponentProps {
  statusCode: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ComponentProps<typeof Feather>['name'];
}

export function ErrorStateComponent({
  statusCode,
  title,
  description,
  actionText = 'Go Home',
  onAction,
  icon = 'alert-circle',
}: ErrorStateComponentProps) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-xl py-4xl">
      <View className="mb-2xl h-32 w-32 items-center justify-center rounded-full bg-white shadow">
        <Feather name={icon} size={56} color="#1A1A1A" />
      </View>
      <View className="mb-2xs rounded-full bg-actionDark px-sm py-2xs">
        <Text className="text-[11px] font-bold text-actionYellow">{statusCode}</Text>
      </View>
      <Text className="mb-md text-center font-cabinet text-heading-1 text-actionDark">{title}</Text>
      <Text className="mb-2xl text-center font-dmsans text-body-base text-gray-500">{description}</Text>
      {onAction ? (
        <Button variant="default" onPress={onAction} className="min-w-[200px]">
          {actionText}
        </Button>
      ) : null}
    </View>
  );
}
