import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { usePermissions } from '../../core/permissions/PermissionsProvider';
import { spacing } from '../../core/theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'AddContact'>;

export function AddContactScreen({ navigation }: Props) {
  const { nfc } = usePermissions();

  return (
    <Screen>
      <ScreenHeader title="Add contact" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingTop: spacing.sm, gap: spacing.lg }}>
        <SettingsSection footer="Adding people by username, code or NFC needs an account and a server, which Connekt does not have yet.">
          <SettingsRow
            icon="scan-outline"
            label="Scan QR code"
            onPress={() => navigation.navigate('Scan')}
          />
          <SettingsRow icon="qr-code-outline" label="My QR code" value="Soon" disabled />
          <SettingsRow icon="at-outline" label="Username" value="Soon" disabled />
          {nfc === 'unsupported' ? null : (
            <SettingsRow icon="radio-outline" label="Tap phones (NFC)" value="Soon" disabled />
          )}
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}
