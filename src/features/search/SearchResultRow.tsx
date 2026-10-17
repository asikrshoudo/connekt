import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = {
  name: string;
  subtitle: string;
  time: string;
  onPress: () => void;
};

export function SearchResultRow({ name, subtitle, time, onPress }: Props) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${subtitle}, ${time}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surface }]}
    >
      <Avatar name={name} size={44} />
      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <View style={styles.top}>
          <AppText variant="headline" numberOfLines={1} style={styles.name}>
            {name}
          </AppText>
          <AppText variant="footnote" tone="muted">
            {time}
          </AppText>
        </View>
        <AppText variant="callout" tone="secondary" numberOfLines={2}>
          {subtitle}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { flex: 1 },
});
