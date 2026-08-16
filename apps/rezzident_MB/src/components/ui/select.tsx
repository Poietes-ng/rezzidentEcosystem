import * as React from 'react';
import { View, Text, Pressable, Modal, FlatList, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@/lib/cn';

/**
 * Mirrors rezzident_FE/src/shared/components/ui/select.tsx visually
 * (underline trigger, rounded sheet for options) but there is no Radix
 * equivalent in RN, so options render in a bottom Modal instead of a
 * floating popover — the correct native pattern for touch UIs.
 *
 * NativeWind only — no StyleSheet.create.
 * Note: rounded-t-2xl = 16px top border radius on the bottom sheet.
 */
export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: boolean;
  label?: string;
  className?: string;
}

export function Select({ value, placeholder = 'Select...', options, onChange, error, label, className }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <View className="w-full">
        {label ? (
          <Text className="mb-2xs font-dmsans text-label font-medium uppercase text-actionDark">
            {label}
          </Text>
        ) : null}
        <Pressable
          onPress={() => setOpen(true)}
          className={cn(
            'h-[40px] w-full flex-row items-center justify-between border-b px-0',
            error ? 'border-b-errorRed' : 'border-b-stoneEdge',
            className
          )}
        >
          <Text className={cn('font-dmsans text-body-base', selected ? 'text-actionDark' : 'text-mutedOlive')}>
            {selected ? selected.label : placeholder}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#8A8578" />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/30" onPress={() => setOpen(false)} />
        {/* rounded-t-2xl = 16px top border radius — bottom sheet design */}
        <SafeAreaView className="rounded-t-2xl bg-white">
          <View className="max-h-[320px]">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{ padding: 12 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between rounded-lg px-3 py-3 active:bg-offWhite"
                >
                  <Text className="font-dmsans text-body-small text-actionDark">{item.label}</Text>
                  {item.value === value ? (
                    <MaterialCommunityIcons name="check" size={18} color="#1A1A1A" />
                  ) : null}
                </Pressable>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
