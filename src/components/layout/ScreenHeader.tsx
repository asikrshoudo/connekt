import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from '../ui/AppText';

type Props = { title: string; onBack: () => void; right?: React.ReactNode };

export function ScreenHeader({ title, onBack, right }: Props) {
  const colors = useColors();
  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [
          styles.back,
          {
            backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surfaceContainer,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
      </Pressable>
      <AppText variant="headline" numberOfLines={1} style={styles.title}>
        {title}
      </AppText>
      {right ? <View style={styles.right}>{right}</View> : <View style={styles.backPlaceholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    gap: spacing.md,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 38,
  },
  title: {
    flex: 1,
    fontWeight: '700',
    textAlign: 'center',
  },
  right: {
    minWidth: 38,
    alignItems: 'flex-end',
  },
});
