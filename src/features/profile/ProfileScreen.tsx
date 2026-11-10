import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { useProfile } from './ProfileProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const colors = useColors();
  const { profile } = useProfile();

  return (
    <Screen>
      <ScreenHeader
        title="Profile"
        onBack={() => navigation.goBack()}
        right={
          <PillButton
            size="small"
            variant="tonal"
            label="Edit"
            onPress={() => navigation.navigate('EditProfile')}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Hero */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.avatarWrapper}>
            <Avatar
              name={profile.displayName}
              size={100}
              uri={profile.photoUri}
              presence="online"
            />
          </View>
          <View style={styles.heroInfo}>
            <AppText variant="title" style={styles.name}>
              {profile.displayName}
            </AppText>
            <View style={[styles.badge, { backgroundColor: colors.primaryContainer }]}>
              <Ionicons name="shield-checkmark" size={13} color={colors.accent} />
              <AppText variant="captionSmall" style={{ color: colors.accent, fontWeight: '700' }}>
                LOCAL IDENTITY
              </AppText>
            </View>
          </View>

          {profile.about ? (
            <View
              style={[
                styles.bioBox,
                {
                  backgroundColor: colors.surfaceContainer,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <AppText variant="callout" tone="secondary" style={styles.bioText}>
                {profile.about}
              </AppText>
            </View>
          ) : (
            <AppText variant="footnote" tone="muted" style={styles.emptyBio}>
              No status or bio set yet.
            </AppText>
          )}

          <View style={styles.actionRow}>
            <PillButton
              label="Edit profile"
              variant="filled"
              size="medium"
              icon="create-outline"
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.flexBtn}
            />
            <PillButton
              label="My QR code"
              variant="subtle"
              size="medium"
              icon="qr-code-outline"
              onPress={() => navigation.navigate('MyQr')}
              style={styles.flexBtn}
            />
          </View>
        </View>

        {/* Privacy & Storage Note Card */}
        <View
          style={[
            styles.privacyCard,
            {
              backgroundColor: colors.surfaceContainer,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Ionicons name="lock-closed" size={18} color={colors.accent} />
          <View style={styles.privacyText}>
            <AppText variant="captionSmall" style={[styles.privacyTitle, { color: colors.textPrimary }]}>
              Device Encrypted Identity
            </AppText>
            <AppText variant="caption" tone="secondary" style={styles.privacyDesc}>
              Your profile data is stored on this device. External peers can view it when you exchange contact QR codes or direct invites.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  heroCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarWrapper: {
    marginBottom: spacing.xs,
  },
  heroInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  bioBox: {
    width: '100%',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  bioText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBio: {
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  flexBtn: {
    flex: 1,
  },
  privacyCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  privacyText: {
    flex: 1,
    gap: 2,
  },
  privacyTitle: {
    fontWeight: '700',
  },
  privacyDesc: {
    lineHeight: 18,
  },
});
