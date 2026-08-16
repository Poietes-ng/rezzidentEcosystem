import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native';

/** Mirrors rezzident_FE/src/shared/components/ui/switch.tsx track colors. */
export function Switch(props: RNSwitchProps) {
  return (
    <RNSwitch
      trackColor={{ false: '#E5E5E5', true: '#1A1A1A' }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#E5E5E5"
      {...props}
    />
  );
}
