import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

export function SampleDataNotice() {
  const colors = useColors();
  return (
    <View style={[styles.box, { backgroundColor: colors.surface }]}>
      <AppText variant="footnote" tone="muted">
        Sample data. These are not real messages.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
});
