import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = {
  name: string;
  action: 'remove' | 'add';
  onPress: () => void;
  disabled?: boolean;
};

export function EditableMemberRow({ name, action, onPress, disabled = false }: Props) {
  const colors = useColors();
  const remove = action === 'remove';
  return (
    <View style={styles.row}>
      <Avatar name={name} size={36} />
      <AppText style={styles.name}>{name}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={remove ? `Remove ${name}` : `Add ${name}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        hitSlop={8}
        onPress={onPress}
        style={disabled ? styles.disabled : undefined}
      >
        <Ionicons
          name={remove ? 'remove-circle' : 'add-circle'}
          size={28}
          color={remove ? colors.destructive : colors.accent}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  name: { flex: 1 },
  disabled: { opacity: 0.35 },
});
