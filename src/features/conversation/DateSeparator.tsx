import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

export function DateSeparator({ label }: { label: string }) {
  const colors = useColors();

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.surfaceContainer,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <AppText
          variant="captionSmall"
          style={[styles.text, { color: colors.textSecondary }]}
        >
          {label}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
