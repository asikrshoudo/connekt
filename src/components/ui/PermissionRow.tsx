import type { ReactNode } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';
import type { IconName } from './iconTypes';

type Props = {
  icon: IconName;
  title: string;
  description: string;
  trailing: ReactNode;
};

export function PermissionRow({ icon, title, description, trailing }: Props) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name={icon} size={18} color={colors.textPrimary} />
      </View>
      <View style={styles.text}>
        <AppText>{title}</AppText>
        <AppText variant="footnote" tone="muted">
          {description}
        </AppText>
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
