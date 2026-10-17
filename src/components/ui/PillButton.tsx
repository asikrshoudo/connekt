import { Pressable, StyleSheet } from 'react-native';
import { radius } from '../../core/theme/radius';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'subtle';
  size?: 'small' | 'large';
};

export function PillButton({ label, onPress, variant = 'filled', size = 'small' }: Props) {
  const colors = useColors();
  const filled = variant === 'filled';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'large' ? styles.large : styles.small,
        { backgroundColor: filled ? colors.bubbleOutgoing : colors.surfaceElevated },
        pressed && { opacity: 0.8 },
      ]}
    >
      <AppText
        variant={size === 'large' ? 'headline' : 'callout'}
        style={{ color: filled ? colors.onAccent : colors.textPrimary }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  small: { height: 34, paddingHorizontal: 14 },
  large: { height: 50, paddingHorizontal: 28 },
});
