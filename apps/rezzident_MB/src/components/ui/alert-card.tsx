import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cn } from '@/lib/cn';

/** Mirrors rezzident_FE/src/shared/components/ui/alert-card.tsx
 *  Uses semantic colors from Rezzident Design System Foundations v1.0.0
 */
export type AlertCardVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertCardProps {
  variant: AlertCardVariant;
  title: string;
  description?: string;
  onDismiss?: () => void;
  action?: { label: string; onPress: () => void };
  className?: string;
}

const variantStyles: Record<AlertCardVariant, { bg: string; border: string; iconColor: string; icon: React.ComponentProps<typeof Feather>['name'] }> = {
  success: { bg: 'bg-successGreen/10', border: 'border-successGreen/30', iconColor: '#2DB84E', icon: 'check-circle' },
  error:   { bg: 'bg-errorRed/10',     border: 'border-errorRed/30',     iconColor: '#C92727', icon: 'alert-circle' },
  warning: { bg: 'bg-warningGold/10',   border: 'border-warningGold/30',  iconColor: '#D4A030', icon: 'alert-triangle' },
  info:    { bg: 'bg-actionYellow/10',   border: 'border-actionYellow/30', iconColor: '#FFE022', icon: 'info' },
};

export function AlertCard({ variant, title, description, onDismiss, action, className }: AlertCardProps) {
  const style = variantStyles[variant];
  return (
    <View className={cn('flex-row items-start gap-3 rounded-md border p-md', style.bg, style.border, className)}>
      <Feather name={style.icon} size={20} color={style.iconColor} style={{ marginTop: 2 }} />
      <View className="flex-1 gap-1">
        <Text className="font-dmsans text-body-small font-semibold text-actionDark">{title}</Text>
        {description ? <Text className="font-dmsans text-caption text-warmGray">{description}</Text> : null}
        {action ? (
          <Pressable onPress={action.onPress} className="mt-1 self-start">
            <Text className="font-dmsans text-caption font-semibold text-actionDark underline">{action.label}</Text>
          </Pressable>
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Feather name="x" size={18} color="#8A8578" />
        </Pressable>
      ) : null}
    </View>
  );
}
