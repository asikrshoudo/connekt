import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { spacing } from '../../core/theme/spacing';

type Props = { name: string; you?: boolean };

export function MemberRow({ name, you = false }: Props) {
  const label = you ? 'You' : name;
  return (
    <View accessible accessibilityLabel={label} style={styles.row}>
      <Avatar name={label} size={36} />
      <AppText style={styles.name}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  name: { flex: 1 },
});
