import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { formatShortDate } from '../../utils/dates';
import { getFirstOpened, getOrCreateConnektId } from '../profile/identity';
import { useAppLock } from '../security/AppLockProvider';
import { shortId } from './deviceFormat';
import { readDeviceInfo } from './deviceInfo';

type Props = NativeStackScreenProps<RootStackParamList, 'Devices'>;

export function DevicesScreen({ navigation }: Props) {
  const colors = useColors();
  const lock = useAppLock();
  const device = useMemo(() => readDeviceInfo(), []);
  const [connektId, setConnektId] = useState<string | null>(null);
  const [since, setSince] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    getOrCreateConnektId()
      .then((id) => {
        if (active) setConnektId(id);
      })
      .catch(() => undefined);
    getFirstOpened()
      .then((time) => {
        if (active) setSince(time);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const sinceText = since ? `${formatShortDate(since)}, ${new Date(since).getFullYear()}` : '...';

  return (
    <Screen>
      <ScreenHeader title="Devices and sessions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Ionicons name="phone-portrait" size={44} color={colors.textPrimary} />
          <AppText variant="heading" style={styles.center}>
            {device.name}
          </AppText>
          <View style={styles.status}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <AppText variant="footnote" tone="secondary">
              This device, active now
            </AppText>
          </View>
        </View>

        <SettingsSection title="This device">
          <SettingsRow
            icon="logo-android"
            label="Android"
            value={device.androidVersion || 'Unknown'}
          />
          <SettingsRow
            icon="information-circle-outline"
            label="Connekt version"
            value={Constants.expoConfig?.version ?? 'Unknown'}
          />
          <SettingsRow icon="calendar-outline" label="Using Connekt since" value={sinceText} />
          <SettingsRow
            icon="finger-print-outline"
            label="Connekt ID"
            value={connektId ? shortId(connektId) : '...'}
          />
          <SettingsRow icon="person-outline" label="Signed in as" value="No account yet" />
        </SettingsSection>

        <SettingsSection
          title="Security"
          footer="App lock keeps other people on this phone out of Connekt."
        >
          <SettingsRow
            icon="lock-closed-outline"
            label="App lock"
            value={lock.settings.enabled ? 'On' : 'Off'}
            onPress={() => navigation.navigate('PrivacySecurity')}
          />
        </SettingsSection>

        <View>
          <SectionHeader title="Linked devices" />
          <AppText tone="secondary" style={styles.text}>
            No other devices are linked. Linking a phone, tablet or computer needs an account and
            a server, which Connekt does not have yet.
          </AppText>
        </View>
        <SettingsSection footer="When linking is available, every device that can read your chats will be listed here, and you will be able to remove any of them.">
          <SettingsRow icon="qr-code-outline" label="Link a device" value="Soon" disabled />
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl, gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  center: { textAlign: 'center', paddingHorizontal: spacing.xl },
  status: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
});
