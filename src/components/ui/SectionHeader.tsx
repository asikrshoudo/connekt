import { StyleSheet, View } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import { AppText } from './AppText';

export function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.root}>
      <AppText variant="footnote" tone="muted" style={styles.text}>
        {title.toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xs },
  text: { letterSpacing: 0.5 },
});
