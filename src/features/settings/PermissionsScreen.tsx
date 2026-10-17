import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import { PermissionRow } from '../../components/ui/PermissionRow';
import { PillButton } from '../../components/ui/PillButton';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { permissionInfo } from '../../core/permissions/permissionInfo';
import { usePermissions } from '../../core/permissions/PermissionsProvider';
import { PERMISSION_ORDER, type PermState } from '../../core/permissions/types';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Permissions'>;

function openNfcSettings() {
  Linking.sendIntent('android.settings.NFC_SETTINGS').catch(() => Linking.openSettings());
}

export function PermissionsScreen({ navigation }: Props) {
  const colors = useColors();
  const { statuses, nfc, request, requestAll } = usePermissions();
  const allGranted = PERMISSION_ORDER.every((id) => statuses[id] === 'granted');

  const done = <Ionicons name="checkmark-circle" size={24} color={colors.success} />;

  const trailingFor = (state: PermState, onAllow: () => void) => {
    if (state === 'granted') return done;
    if (state === 'blocked') {
      return <PillButton label="Settings" variant="subtle" onPress={() => void Linking.openSettings()} />;
    }
    return <PillButton label="Allow" onPress={onAllow} />;
  };

  return (
    <Screen>
      <ScreenHeader title="Permissions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppText tone="secondary" style={styles.intro}>
          Connekt asks only for what a feature needs, and only when you choose. There is no server
          yet, so nothing leaves your phone.
        </AppText>

        {allGranted ? null : (
          <View style={styles.cta}>
            <PillButton size="large" label="Review all" onPress={() => void requestAll()} />
          </View>
        )}

        <SettingsSection>
          {PERMISSION_ORDER.map((id) => (
            <PermissionRow
              key={id}
              icon={permissionInfo[id].icon}
              title={permissionInfo[id].title}
              description={permissionInfo[id].description}
              trailing={trailingFor(statuses[id], () => void request(id))}
            />
          ))}
          {nfc === 'unsupported' ? null : (
            <PermissionRow
              key="nfc"
              icon="radio-outline"
              title="NFC"
              description={
                nfc === 'enabled'
                  ? 'NFC is on. Tap to add contacts will use it later.'
                  : 'NFC is off. Turn it on to use tap to add contacts later.'
              }
              trailing={
                nfc === 'enabled' ? (
                  done
                ) : (
                  <PillButton label="Turn on" variant="subtle" onPress={openNfcSettings} />
                )
              }
            />
          )}
        </SettingsSection>

        <SettingsSection footer="Opens Android settings, where you can change any permission.">
          <SettingsRow
            icon="settings-outline"
            label="Open Android settings"
            onPress={() => void Linking.openSettings()}
          />
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl, gap: spacing.lg },
  intro: { paddingHorizontal: spacing.lg },
  cta: { paddingHorizontal: spacing.lg },
});
