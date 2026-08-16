import { View, Text } from 'react-native';
import { cn } from '@/lib/cn';

/** Mirrors rezzident_FE/src/shared/components/ui/step-progress.tsx */
export interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  showLabel?: boolean;
}

export function StepProgress({ currentStep, totalSteps, className, showLabel = true }: StepProgressProps) {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <View className={cn('w-full gap-3', className)}>
      <View className="h-1 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
        <View className="h-full rounded-full bg-actionDark" style={{ width: `${percentage}%` }} />
      </View>
      {showLabel ? (
        <Text className="font-dmsans text-[11px] font-medium uppercase tracking-wider text-gray-400">
          Step {currentStep} of {totalSteps}
        </Text>
      ) : null}
    </View>
  );
}
