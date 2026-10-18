import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { useProfile } from './ProfileProvider';

export function ProfileCard({ onPress }: { onPress: () => void }) {
  const colors = useColors();
  const { profile } = useProfile();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${profile.displayName}, your profile`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
      ]}
    >
      <Avatar name={profile.displayName} size={60} uri={profile.photoUri} />
      <View style={styles.text}>
        <AppText variant="heading" numberOfLines={1}>
          {profile.displayName}
        </AppText>
        <AppText variant="callout" tone="secondary" numberOfLines={1}>
          {profile.about || 'Add a short bio'}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  text: { flex: 1, gap: 2 },
});
