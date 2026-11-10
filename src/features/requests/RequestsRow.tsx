import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { UnreadBadge } from '../../components/ui/UnreadBadge';
import { radius } from '../../core/theme/radius';
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
      style={({ pressed }) => [
        styles.row,
        pressed && { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor: colors.primaryContainer,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Ionicons name="mail-unread-outline" size={22} color={colors.accent} />
      </View>
      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <AppText variant="headline" style={styles.label}>
          Message requests
        </AppText>
        <UnreadBadge count={count} />
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    minHeight: 68,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
    fontWeight: '600',
  },
});
