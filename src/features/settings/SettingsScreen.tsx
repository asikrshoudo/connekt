import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { ScrollView } from 'react-native';
import { TabScreen } from '../../components/layout/TabScreen';
import { TAB_BAR_CLEARANCE } from '../../components/navigation/tabBarMetrics';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import type { RootStackParamList } from '../../core/navigation/types';
import { useChats } from '../chats/ChatsProvider';
import { ProfileCard } from '../profile/ProfileCard';
import { useAppLock } from '../security/AppLockProvider';
import { themeNames } from '../../core/theme/palettes';
import { spacing } from '../../core/theme/spacing';
import { useThemeSettings } from '../../core/theme/ThemeProvider';

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { archivedItems, restrictedItems, blockedList } = useChats();
  const { settings } = useThemeSettings();
  const appLock = useAppLock();
  const version = Constants.expoConfig?.version ?? 'Unknown';

  return (
    <TabScreen title="Settings" padForTabBar={false}>
      <ScrollView
        contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: TAB_BAR_CLEARANCE }}
      >
        <ProfileCard onPress={() => navigation.navigate('Profile')} />

        <SettingsSection
          title="General"
          footer="Review and allow what Connekt can access on your phone."
        >
          <SettingsRow
            icon="color-palette-outline"
            label="Appearance"
            value={themeNames[settings.themeId]}
            onPress={() => navigation.navigate('Appearance')}
          />
          <SettingsRow
            icon="lock-closed-outline"
            label="Privacy and security"
            value={appLock.settings.enabled ? 'On' : 'Off'}
            onPress={() => navigation.navigate('PrivacySecurity')}
          />
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            onPress={() => navigation.navigate('Notifications')}
          />
          <SettingsRow
            icon="cloud-outline"
            label="Storage and backup"
            onPress={() => navigation.navigate('Storage')}
          />
          <SettingsRow
            icon="phone-portrait-outline"
            label="Devices and sessions"
            onPress={() => navigation.navigate('Devices')}
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Permissions"
            onPress={() => navigation.navigate('Permissions')}
          />
          <SettingsRow
            icon="archive-outline"
            label="Archived chats"
            value={archivedItems.length > 0 ? String(archivedItems.length) : undefined}
            onPress={() => navigation.navigate('ArchivedChats')}
          />
          <SettingsRow
            icon="eye-off-outline"
            label="Restricted chats"
            value={restrictedItems.length > 0 ? String(restrictedItems.length) : undefined}
            onPress={() => navigation.navigate('RestrictedChats')}
          />
          <SettingsRow
            icon="ban-outline"
            label="Blocked contacts"
            value={blockedList.length > 0 ? String(blockedList.length) : undefined}
            onPress={() => navigation.navigate('BlockedContacts')}
          />
        </SettingsSection>

        <SettingsSection
          title="Coming soon"
          footer="These need an account and a server, which Connekt does not have yet."
        >
          <SettingsRow icon="person-outline" label="Account" value="Soon" disabled />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow icon="information-circle-outline" label="Version" value={version} />
          <SettingsRow icon="code-slash-outline" label="Made by" value="TheKami" />
        </SettingsSection>
      </ScrollView>
    </TabScreen>
  );
}
