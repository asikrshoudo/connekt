import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

export function NewGroupRow({ onPress }: { onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="New group"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surface }]}
    >
      <View style={[styles.icon, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name="people" size={22} color={colors.textPrimary} />
      </View>
      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <AppText variant="headline">New group</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
