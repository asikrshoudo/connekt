import { StyleSheet, View } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import { AppText } from '../ui/AppText';

type Props = { title: string; message: string };

export function EmptyState({ title, message }: Props) {
  return (
    <View style={styles.root}>
      <AppText variant="headline">{title}</AppText>
      <AppText tone="secondary" style={styles.message}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  message: { textAlign: 'center' },
});
