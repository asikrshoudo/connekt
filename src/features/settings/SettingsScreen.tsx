import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { ScrollView } from 'react-native';
import { TabScreen } from '../../components/layout/TabScreen';
import { TAB_BAR_CLEARANCE } from '../../components/navigation/tabBarMetrics';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const version = Constants.expoConfig?.version ?? 'Unknown';

  return (
    <TabScreen title="Settings" padForTabBar={false}>
      <ScrollView
        contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: TAB_BAR_CLEARANCE }}
      >
        <SettingsSection
          title="General"
          footer="Review and allow what Connekt can access on your phone."
        >
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Permissions"
            onPress={() => navigation.navigate('Permissions')}
          />
        </SettingsSection>

        <SettingsSection
          title="Coming soon"
          footer="These need an account and a server, which Connekt does not have yet."
        >
          <SettingsRow icon="person-outline" label="Account" value="Soon" disabled />
          <SettingsRow icon="notifications-outline" label="Notifications" value="Soon" disabled />
          <SettingsRow icon="lock-closed-outline" label="Privacy and security" value="Soon" disabled />
          <SettingsRow icon="phone-portrait-outline" label="Devices and sessions" value="Soon" disabled />
          <SettingsRow icon="cloud-outline" label="Storage and backup" value="Soon" disabled />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow icon="information-circle-outline" label="Version" value={version} />
          <SettingsRow icon="code-slash-outline" label="Made by" value="TheKami" />
        </SettingsSection>
      </ScrollView>
    </TabScreen>
  );
}
