import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { UnreadBadge } from '../../components/ui/UnreadBadge';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = { count: number; onPress: () => void };

export function RequestsRow({ count, onPress }: Props) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Message requests, ${count}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surface }]}
    >
      <View style={[styles.icon, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name="mail-unread-outline" size={24} color={colors.textPrimary} />
      </View>
      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <AppText variant="headline" style={styles.label}>
          Message requests
        </AppText>
        <UnreadBadge count={count} />
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg },
  icon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { flex: 1 },
});
