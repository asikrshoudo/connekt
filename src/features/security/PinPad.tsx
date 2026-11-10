import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { PIN_LENGTH } from './pinPolicy';

const KEY = 72;
const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

type Props = {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
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
        {
          backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surface,
          borderColor: colors.cardBorder,
        },
        disabled && styles.dim,
      ]}
    >
      <AppText variant="title" style={styles.digitText}>
        {digit}
      </AppText>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      {/* PIN Progress Indicator Dots */}
      <View
        accessible
        accessibilityLabel={`${value.length} of ${PIN_LENGTH} digits entered`}
        style={styles.dots}
      >
        {Array.from({ length: PIN_LENGTH }, (_, index) => {
          const filled = index < value.length;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  borderColor: filled ? colors.accent : colors.border,
                  backgroundColor: filled ? colors.accent : 'transparent',
                },
              ]}
            />
          );
        })}
      </View>

      {/* Number Pad Grid */}
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
            style={({ pressed }) => [
              styles.slot,
              pressed && styles.pressed,
              disabled && styles.dim,
            ]}
          >
            <Ionicons name="backspace-outline" size={26} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.md,
    height: 24,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  pad: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  key: {
    width: KEY,
    height: KEY,
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  digitText: {
    fontSize: 26,
    fontWeight: '600',
  },
  slot: {
    width: KEY,
    height: KEY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.7,
  },
});
