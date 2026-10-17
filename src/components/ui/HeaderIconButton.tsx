import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';
import { useColors } from '../../core/theme/ThemeProvider';
import type { IconName } from './iconTypes';

type Props = {
  icon: IconName;
  label: string;
  onPress: (event: GestureResponderEvent) => void;
};

export function HeaderIconButton({ icon, label, onPress }: Props) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
      ]}
    >
      <Ionicons name={icon} size={22} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
