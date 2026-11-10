import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar';
import { PillButton } from '../../components/ui/PillButton';
import { QrCode } from '../../components/ui/QrCode';
import type { RootStackParamList } from '../../core/navigation/types';
import { markExternalActivity } from '../../core/externalActivity';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { getOrCreateConnektId } from '../profile/identity';
import { useProfile } from '../profile/ProfileProvider';
import { encodeContactCard } from './contactCard';

type Props = NativeStackScreenProps<RootStackParamList, 'MyQr'>;

export function MyQrScreen({ navigation }: Props) {
  const colors = useColors();
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
    markExternalActivity();
    Share.share({ message: `Add me on Myth: ${link}` }).catch(() => undefined);
  };

  return (
    <Screen>
      <ScreenHeader title="My Contact QR Code" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Contact Badge Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Avatar name={profile.displayName} size={64} uri={profile.photoUri} presence="online" />
          <View style={styles.nameCol}>
            <AppText variant="title" style={styles.name}>
              {profile.displayName}
            </AppText>
            <AppText variant="captionSmall" tone="secondary">
              Scan to connect instantly on Myth
            </AppText>
          </View>

          {/* QR Container */}
          <View style={styles.qrCard}>
            {link ? (
              <QrCode value={link} size={220} />
            ) : (
              <AppText tone="muted">
                {failed ? 'Could not prepare your code. Please try again.' : 'Preparing code...'}
              </AppText>
            )}
          </View>
        </View>

        <AppText variant="footnote" tone="secondary" style={styles.note}>
          Peers who scan this get your profile identity. Identity keys remain strictly local to your device.
        </AppText>

        <View style={styles.actionWrap}>
          <PillButton
            size="large"
            label="Share contact invite link"
            variant="filled"
            icon="share-social-outline"
            onPress={share}
            disabled={!link}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  nameCol: {
    alignItems: 'center',
    gap: 2,
  },
  name: {
    fontWeight: '700',
  },
  qrCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  note: {
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 18,
  },
  actionWrap: {
    width: '100%',
    maxWidth: 340,
  },
});
