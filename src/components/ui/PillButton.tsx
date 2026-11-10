import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';
import type { IconName } from './iconTypes';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'subtle' | 'outline' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

export function PillButton({
  label,
  onPress,
  variant = 'filled',
  size = 'small',
  disabled = false,
  loading = false,
  icon,
  style,
}: Props) {
  const colors = useColors();

  const getBackgroundColor = (pressed: boolean) => {
    if (variant === 'filled') {
      return pressed ? colors.accent : colors.primary;
    }
    if (variant === 'tonal') {
      return pressed ? colors.chipActiveBackground : colors.primaryContainer;
    }
    if (variant === 'subtle') {
      return pressed ? colors.surfaceContainerHighest : colors.surfaceElevated;
    }
    // outline
    return pressed ? colors.surfaceContainer : 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'filled') return colors.onPrimary;
    if (variant === 'tonal') return colors.onPrimaryContainer;
    if (variant === 'outline') return colors.accent;
    return colors.textPrimary;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colors.accent;
    if (variant === 'subtle') return colors.border;
    return 'transparent';
  };

  const textColor = getTextColor();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.base,
        size === 'large' ? styles.large : size === 'medium' ? styles.medium : styles.small,
        {
          backgroundColor: getBackgroundColor(pressed),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' || variant === 'subtle' ? 1 : 0,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={size === 'large' ? 20 : 16}
              color={textColor}
              style={styles.icon}
            />
          ) : null}
          <AppText
            variant={size === 'large' ? 'headline' : size === 'medium' ? 'callout' : 'footnote'}
            style={[styles.label, { color: textColor }]}
          >
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    height: 36,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  medium: {
    height: 44,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  large: {
    height: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  label: {
    fontWeight: '600',
  },
  icon: {
    marginRight: 2,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
