import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = { name: string; you?: boolean };

export function MemberRow({ name, you = false }: Props) {
  const colors = useColors();
  const label = you ? 'You' : name;

  return (
    <View accessible accessibilityLabel={label} style={styles.row}>
      <Avatar name={label} size={38} presence={you ? 'online' : null} />
      <View style={styles.nameCol}>
        <AppText variant="headline" style={styles.name}>
          {label}
        </AppText>
        <AppText variant="captionSmall" tone="secondary">
          {you ? 'Workspace Owner' : 'Team Member'}
        </AppText>
      </View>
      {you ? (
        <View style={[styles.ownerBadge, { backgroundColor: colors.primaryContainer }]}>
          <AppText variant="captionSmall" style={{ color: colors.accent, fontWeight: '700' }}>
            YOU
          </AppText>
        </View>
      ) : null}
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
  nameCol: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontWeight: '600',
  },
  ownerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
});
