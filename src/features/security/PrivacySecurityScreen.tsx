import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import { ToggleRow } from '../../components/ui/ToggleRow';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { useAppLock } from './AppLockProvider';
import { formatTimeout, TIMEOUT_OPTIONS } from './lockLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacySecurity'>;

export function PrivacySecurityScreen({ navigation }: Props) {
  const lock = useAppLock();
  const { settings, biometricAvailable } = lock;
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [biometricFailed, setBiometricFailed] = useState(false);

  const toggleBiometric = async (on: boolean) => {
    if (!on) {
      lock.setBiometric(false);
      return;
    }
    if (await lock.confirmBiometric()) lock.setBiometric(true);
    else setBiometricFailed(true);
  };

  return (
    <Screen>
      <ScreenHeader title="Privacy and security" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.lg }}>
        <SettingsSection
          title="App lock"
          footer="App lock hides Connekt behind your PIN. It does not encrypt your chats. Your PIN is kept as a hash in Android's secure storage, and wrong tries make you wait."
        >
          <SettingsRow
            icon="lock-closed-outline"
            label="App lock"
            value={settings.enabled ? 'On' : 'Off'}
            onPress={() =>
              navigation.navigate('PinFlow', { mode: settings.enabled ? 'disable' : 'create' })
            }
          />
          {settings.enabled ? (
            <SettingsRow
              icon="keypad-outline"
              label="Change PIN"
              onPress={() => navigation.navigate('PinFlow', { mode: 'change' })}
            />
          ) : null}
          {settings.enabled ? (
            <SettingsRow
              icon="timer-outline"
              label="Lock after"
              value={formatTimeout(settings.timeoutMs)}
              onPress={() => setTimeoutOpen(true)}
            />
          ) : null}
          {settings.enabled && biometricAvailable ? (
            <ToggleRow
              icon="finger-print"
              label="Fingerprint or face"
              description="Unlock with your phone's biometrics. The PIN always works too."
              value={settings.biometric}
              onChange={(on) => void toggleBiometric(on)}
            />
          ) : null}
        </SettingsSection>

        <SettingsSection title="Screen privacy">
          <ToggleRow
            icon="eye-off-outline"
            label="Hide in recents and block screenshots"
            description="Connekt shows blank in the recent apps list, and screenshots and screen recording are blocked."
            value={settings.blockScreenshots}
            onChange={lock.setBlockScreenshots}
          />
        </SettingsSection>
      </ScrollView>

      <ActionSheet
        visible={timeoutOpen}
        title="Lock after"
        message="How long Connekt can stay in the background before it asks for your PIN."
        actions={TIMEOUT_OPTIONS.map((ms) => ({
          label: `${formatTimeout(ms)}${ms === settings.timeoutMs ? '  ✓' : ''}`,
          onPress: () => {
            lock.setTimeoutMs(ms);
            setTimeoutOpen(false);
          },
        }))}
        onClose={() => setTimeoutOpen(false)}
      />

      <ActionSheet
        visible={biometricFailed}
        title="Could not confirm"
        message="Your fingerprint or face was not confirmed, so it stays off. You can still use your PIN."
        actions={[]}
        cancelLabel="OK"
        onClose={() => setBiometricFailed(false)}
      />
    </Screen>
  );
}
