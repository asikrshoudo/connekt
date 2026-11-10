import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import { PillButton } from '../../components/ui/PillButton';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = { name: string; onUnblock: () => void };

export function BlockedBar({ name, onUnblock }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 16) + spacing.sm,
        },
      ]}
    >
      <AppText variant="footnote" tone="secondary" style={styles.text}>
        {`You blocked ${name}. You will not receive new messages from this contact.`}
      </AppText>
      <PillButton label="Unblock contact" variant="subtle" size="small" onPress={onUnblock} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
  },
  text: { textAlign: 'center', lineHeight: 18 },
});
