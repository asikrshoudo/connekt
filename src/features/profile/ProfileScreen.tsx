import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { useProfile } from './ProfileProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { profile } = useProfile();

  return (
    <Screen>
      <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Avatar name={profile.displayName} size={112} uri={profile.photoUri} />
          <AppText variant="title">{profile.displayName}</AppText>
          {profile.about ? (
            <AppText tone="secondary" style={styles.about}>
              {profile.about}
            </AppText>
          ) : (
            <AppText tone="muted">No bio yet</AppText>
          )}
        </View>
        <View style={styles.actions}>
          <PillButton
            size="large"
            label="Edit profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
        </View>
        <AppText variant="footnote" tone="muted" style={styles.note}>
          Your profile is saved on this device only. No one else can see it yet, because Connekt
          has no server.
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl, gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  about: { textAlign: 'center', paddingHorizontal: spacing.xl },
  actions: { paddingHorizontal: spacing.lg },
  note: { paddingHorizontal: spacing.xl },
});
