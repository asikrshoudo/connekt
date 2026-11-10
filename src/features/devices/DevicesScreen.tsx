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
import { radius } from '../../core/theme/radius';
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
        {/* Active Device Hero */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={[styles.deviceIconBox, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="phone-portrait" size={28} color={colors.accent} />
          </View>
          <AppText variant="headline" style={styles.center}>
            {device.name}
          </AppText>
          <View style={styles.status}>
            <View style={[styles.dot, { backgroundColor: colors.presenceOnline }]} />
            <AppText variant="captionSmall" style={{ color: colors.presenceOnline, fontWeight: '700' }}>
              PRIMARY ACTIVE DEVICE
            </AppText>
          </View>
        </View>

        <SettingsSection title="Device Specifications">
          <SettingsRow
            icon="logo-android"
            label="Operating system"
            value={device.androidVersion ? `Android ${device.androidVersion}` : 'Mobile OS'}
          />
          <SettingsRow
            icon="information-circle-outline"
            label="Myth client build"
            value={Constants.expoConfig?.version ?? '1.0.0'}
          />
          <SettingsRow icon="calendar-outline" label="Workspace session initialized" value={sinceText} />
          <SettingsRow
            icon="finger-print-outline"
            label="Device identity key"
            value={connektId ? shortId(connektId) : '...'}
          />
          <SettingsRow icon="person-outline" label="Account status" value="Local workspace profile" />
        </SettingsSection>

        <SettingsSection
          title="Security & Lock"
          footer="Protects access to your local workspace using your PIN or device biometrics."
        >
          <SettingsRow
            icon="lock-closed-outline"
            label="App lock protection"
            value={lock.settings.enabled ? 'Active' : 'Disabled'}
            onPress={() => navigation.navigate('PrivacySecurity')}
          />
        </SettingsSection>

        <View>
          <SectionHeader title="Connected Sessions" />
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Ionicons name="laptop-outline" size={22} color={colors.textMuted} />
            <AppText variant="footnote" tone="secondary" style={styles.infoText}>
              No desktop or tablet sessions connected. Multi-device sync will be enabled with team cloud authentication.
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
    gap: spacing.sm,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  deviceIconBox: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  center: {
    textAlign: 'center',
    fontWeight: '700',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  infoCard: {
    marginHorizontal: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
  },
});
