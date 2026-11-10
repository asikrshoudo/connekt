import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius } from '../../core/theme/radius';
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
      style={({ pressed }) => [
        styles.row,
        selected && { backgroundColor: `${colors.accent}08` },
        pressed && { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      {swatches ? (
        <View style={styles.swatches}>
          {swatches.map((color, index) => (
            <View
              key={index}
              style={[styles.swatch, { backgroundColor: color, borderColor: colors.cardBorder }]}
            />
          ))}
        </View>
      ) : null}
      <AppText
        variant="callout"
        style={[
          styles.label,
          {
            color: selected ? colors.accent : colors.textPrimary,
            fontWeight: selected ? '700' : '500',
          },
        ]}
      >
        {label}
      </AppText>
      {selected ? (
        <View style={[styles.checkCircle, { backgroundColor: colors.accent }]}>
          <Ionicons name="checkmark" size={13} color={colors.onAccent} />
        </View>
      ) : (
        <View style={[styles.uncheckCircle, { borderColor: colors.border }]} />
      )}
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
  swatches: {
    flexDirection: 'row',
    gap: 4,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: {
    flex: 1,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});
