import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';
import { radius } from '../../core/theme/radius';
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
        {
          backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surfaceContainer,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
