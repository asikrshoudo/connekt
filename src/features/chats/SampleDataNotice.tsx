import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = { message?: string };

export function SampleDataNotice({ message = 'Sample preview data. Real data is kept strictly on-device.' }: Props) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: colors.surfaceContainer,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
      <AppText variant="captionSmall" tone="secondary" style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  text: {
    flex: 1,
    lineHeight: 16,
  },
});
