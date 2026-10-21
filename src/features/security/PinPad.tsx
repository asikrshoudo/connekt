import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { PIN_LENGTH } from './pinPolicy';

const KEY = 76;
const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

type Props = {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  // Shown bottom left, for example a fingerprint button.
  leftAction?: ReactNode;
};

export function PinPad({ value, onChange, disabled = false, leftAction }: Props) {
  const colors = useColors();

  const press = (digit: string) => {
    if (disabled || value.length >= PIN_LENGTH) return;
    onChange(value + digit);
  };

  const erase = () => {
    if (disabled || value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  const key = (digit: string) => (
    <Pressable
      key={digit}
      accessibilityRole="button"
      accessibilityLabel={digit}
      disabled={disabled}
      onPress={() => press(digit)}
      style={({ pressed }) => [
        styles.key,
        { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
        disabled && styles.dim,
      ]}
    >
      <AppText variant="title">{digit}</AppText>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <View
        accessible
        accessibilityLabel={`${value.length} of ${PIN_LENGTH} digits entered`}
        style={styles.dots}
      >
        {Array.from({ length: PIN_LENGTH }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { borderColor: colors.textMuted },
              index < value.length && { backgroundColor: colors.textPrimary },
            ]}
          />
        ))}
      </View>

      <View style={styles.pad}>
        {ROWS.map((row) => (
          <View key={row.join('')} style={styles.row}>
            {row.map(key)}
          </View>
        ))}
        <View style={styles.row}>
          <View style={styles.slot}>{leftAction}</View>
          {key('0')}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete"
            disabled={disabled}
            onPress={erase}
            style={[styles.slot, disabled && styles.dim]}
          >
            <Ionicons name="backspace-outline" size={28} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing.xxl },
  dots: { flexDirection: 'row', gap: spacing.lg },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5 },
  pad: { gap: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.xl },
  key: { width: KEY, height: KEY, borderRadius: KEY / 2, alignItems: 'center', justifyContent: 'center' },
  slot: { width: KEY, height: KEY, alignItems: 'center', justifyContent: 'center' },
  dim: { opacity: 0.4 },
});
