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
};

export function SettingsRow({ icon, label, value, onPress, disabled = false }: Props) {
  const colors = useColors();
  const interactive = onPress !== undefined && !disabled;

  const content = (
    <>
      <View style={[styles.iconBox, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name={icon} size={18} color={disabled ? colors.textMuted : colors.textPrimary} />
      </View>
      <AppText tone={disabled ? 'muted' : 'primary'} style={styles.label}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="callout" tone="muted">
          {value}
        </AppText>
      ) : null}
      {interactive ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
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
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceElevated }]}
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
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
});
