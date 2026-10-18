import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { typography } from '../../core/theme/typography';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength: number;
  multiline?: boolean;
  placeholder?: string;
};

export function ProfileField({
  label,
  value,
  onChangeText,
  maxLength,
  multiline = false,
  placeholder,
}: Props) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <AppText variant="footnote" tone="muted">
          {label.toUpperCase()}
        </AppText>
        <AppText variant="footnote" tone="muted">{`${value.length}/${maxLength}`}</AppText>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        style={[
          styles.input,
          typography.callout,
          multiline && styles.multiline,
          { backgroundColor: colors.surface, borderColor: colors.inputBorder, color: colors.textPrimary },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, gap: spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
});
