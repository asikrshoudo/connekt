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
        {
          backgroundColor: colors.surface,
          borderColor: colors.cardBorder,
        },
        pressed && { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      <Avatar
        name={profile.displayName}
        size={54}
        uri={profile.photoUri}
        presence="online"
      />
      <View style={styles.text}>
        <View style={styles.nameRow}>
          <AppText variant="headline" numberOfLines={1} style={styles.name}>
            {profile.displayName}
          </AppText>
          <View style={[styles.statusChip, { backgroundColor: colors.primaryContainer }]}>
            <AppText variant="captionSmall" style={{ color: colors.accent, fontWeight: '700' }}>
              YOU
            </AppText>
          </View>
        </View>
        <AppText variant="callout" tone="secondary" numberOfLines={1}>
          {profile.about || 'Set your status or bio'}
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
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  text: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontWeight: '700',
  },
  statusChip: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
});
