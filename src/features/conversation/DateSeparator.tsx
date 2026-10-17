import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';

export function DateSeparator({ label }: { label: string }) {
  return (
    <View style={styles.root}>
      <AppText variant="footnote" tone="muted">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xs },
});
