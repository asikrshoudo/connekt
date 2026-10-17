import Constants from 'expo-constants';
import { Linking, ScrollView } from 'react-native';
import { TabScreen } from '../../components/layout/TabScreen';
import { TAB_BAR_CLEARANCE } from '../../components/navigation/tabBarMetrics';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import { spacing } from '../../core/theme/spacing';

export function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? 'Unknown';

  return (
    <TabScreen title="Settings" padForTabBar={false}>
      <ScrollView
        contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: TAB_BAR_CLEARANCE }}
      >
        <SettingsSection
          title="General"
          footer="Opens Android settings, where you can review what Connekt can access."
        >
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Permissions"
            onPress={() => void Linking.openSettings()}
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
