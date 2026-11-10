import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

export function NewGroupRow({ onPress }: { onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="New team group"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor: colors.primaryContainer,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Ionicons name="people" size={20} color={colors.accent} />
      </View>
      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <AppText variant="headline" style={styles.title}>
          New team group
        </AppText>
        <AppText variant="captionSmall" tone="secondary">
          Create a channel or collaboration group
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    minHeight: 64,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  title: {
    fontWeight: '600',
  },
});
