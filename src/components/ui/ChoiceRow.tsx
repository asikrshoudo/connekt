import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { AppText } from './AppText';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  swatches?: string[];
};

export function ChoiceRow({ label, selected, onPress, swatches }: Props) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceElevated }]}
    >
      {swatches ? (
        <View style={styles.swatches}>
          {swatches.map((color, index) => (
            <View
              key={index}
              style={[styles.swatch, { backgroundColor: color, borderColor: colors.border }]}
            />
          ))}
        </View>
      ) : null}
      <AppText style={styles.label}>{label}</AppText>
      {selected ? <Ionicons name="checkmark" size={22} color={colors.accent} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  swatches: { flexDirection: 'row', gap: 4 },
  swatch: { width: 18, height: 18, borderRadius: 9, borderWidth: 1 },
  label: { flex: 1 },
});
