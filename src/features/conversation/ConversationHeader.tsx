import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = { name: string; onBack: () => void; onProfile: () => void };

export function ConversationHeader({ name, onBack, onProfile }: Props) {
  const colors = useColors();
  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        hitSlop={8}
        style={styles.back}
      >
        <Ionicons name="chevron-back" size={28} color={colors.accent} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name}, view contact info`}
        onPress={onProfile}
        style={styles.profile}
      >
        <Avatar name={name} size={36} />
        <AppText variant="headline" numberOfLines={1} style={styles.name}>
          {name}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  profile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { flex: 1 },
});
