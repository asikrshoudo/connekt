import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';
import type { IconName } from './iconTypes';

type Props = {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  disabled = false,
  destructive = false,
}: Props) {
  const colors = useColors();
  const interactive = onPress !== undefined && !disabled;

  const content = (
    <>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: destructive
              ? `${colors.destructive}18`
              : colors.surfaceContainerHigh,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={
            destructive
              ? colors.destructive
              : disabled
              ? colors.textMuted
              : colors.accent
          }
        />
      </View>
      <AppText
        variant="callout"
        tone={disabled ? 'muted' : 'primary'}
        style={[styles.label, destructive ? { color: colors.destructive } : null]}
      >
        {label}
      </AppText>
      {value ? (
        <AppText variant="footnote" tone="secondary" style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {interactive ? (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={styles.chevron} />
      ) : null}
    </>
  );

  if (!interactive) {
    return (
      <View
        accessible
        accessibilityLabel={disabled ? `${label}, not available yet` : `${label}, ${value ?? ''}`}
        style={styles.row}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceContainer }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontWeight: '500',
  },
  value: {
    fontWeight: '500',
  },
  chevron: {
    opacity: 0.7,
  },
});
