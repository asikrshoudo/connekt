import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { PillButton } from '../../components/ui/PillButton';
import { QrCode } from '../../components/ui/QrCode';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { getOrCreateConnektId } from '../profile/identity';
import { useProfile } from '../profile/ProfileProvider';
import { encodeContactCard } from './contactCard';

type Props = NativeStackScreenProps<RootStackParamList, 'MyQr'>;

export function MyQrScreen({ navigation }: Props) {
  const { profile } = useProfile();
  const [id, setId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getOrCreateConnektId()
      .then(setId)
      .catch(() => setFailed(true));
  }, []);

  const link = id ? encodeContactCard({ id, name: profile.displayName }) : null;

  const share = () => {
    if (!link) return;
    Share.share({ message: `Add me on Connekt: ${link}` }).catch(() => undefined);
  };

  return (
    <Screen>
      <ScreenHeader title="My QR code" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="title">{profile.displayName}</AppText>

        {link ? (
          <QrCode value={link} size={260} />
        ) : (
          <AppText tone="muted">
            {failed ? 'Could not prepare your code. Please try again.' : 'Preparing your code...'}
          </AppText>
        )}

        <AppText variant="footnote" tone="muted" style={styles.note}>
          Anyone who scans this gets your name and a random Connekt ID. It has no phone number or
          email, and it does not prove who you are.
        </AppText>

        {profile.displayName === 'You' ? (
          <View style={styles.hint}>
            <AppText variant="footnote" tone="secondary" style={styles.note}>
              Your name is still "You". Set your real name so friends can recognise you.
            </AppText>
            <PillButton
              label="Edit profile"
              variant="subtle"
              onPress={() => navigation.navigate('EditProfile')}
            />
          </View>
        ) : null}

        <PillButton size="large" label="Share my contact link" onPress={share} disabled={!link} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  note: { textAlign: 'center' },
  hint: { alignItems: 'center', gap: spacing.sm },
});
