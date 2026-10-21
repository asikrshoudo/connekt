import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Switch, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';
import type { IconName } from './iconTypes';

type Props = {
  icon: IconName;
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function ToggleRow({ icon, label, description, value, onChange }: Props) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name={icon} size={18} color={colors.textPrimary} />
      </View>
      <View style={styles.text}>
        <AppText>{label}</AppText>
        {description ? (
          <AppText variant="footnote" tone="muted">
            {description}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.disabled, true: colors.accent }}
        thumbColor={colors.onAccent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
