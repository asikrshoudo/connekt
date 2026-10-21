import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Linking, ScrollView } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { PermissionRow } from '../../components/ui/PermissionRow';
import { PillButton } from '../../components/ui/PillButton';
import { SettingsRow } from '../../components/ui/SettingsRow';
import { SettingsSection } from '../../components/ui/SettingsSection';
import { ToggleRow } from '../../components/ui/ToggleRow';
import { markExternalActivity } from '../../core/externalActivity';
import type { RootStackParamList } from '../../core/navigation/types';
import { permissionInfo } from '../../core/permissions/permissionInfo';
import { usePermissions } from '../../core/permissions/PermissionsProvider';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { useNotificationSettings } from './NotificationSettingsProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const PACKAGE_NAME = 'com.thekami.connekt';

function openAndroidNotificationSettings() {
  markExternalActivity();
  Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', [
    { key: 'android.provider.extra.APP_PACKAGE', value: PACKAGE_NAME },
  ]).catch(() => Linking.openSettings());
}

export function NotificationsScreen({ navigation }: Props) {
  const colors = useColors();
  const { settings, update } = useNotificationSettings();
  const { statuses, request } = usePermissions();
  const state = statuses.notifications;
  const info = permissionInfo.notifications;

  const trailing =
    state === 'granted' ? (
      <Ionicons name="checkmark-circle" size={24} color={colors.success} />
    ) : state === 'blocked' ? (
      <PillButton label="Settings" variant="subtle" onPress={() => void Linking.openSettings()} />
    ) : (
      <PillButton label="Allow" onPress={() => void request('notifications')} />
    );

  return (
    <Screen>
      <ScreenHeader title="Notifications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl, gap: spacing.lg }}>
        <SettingsSection
          title="Permission"
          footer="Connekt cannot send notifications yet, because it has no server. Your choices below are saved on this device and will apply once messages can arrive."
        >
          <PermissionRow
            icon={info.icon}
            title="Notifications"
            description={
              state === 'granted'
                ? 'Allowed on this phone.'
                : 'Needed to show alerts for new messages.'
            }
            trailing={trailing}
          />
        </SettingsSection>

        <SettingsSection title="Notify me about">
          <ToggleRow
            icon="chatbubble-outline"
            label="Messages"
            description="One-to-one chats"
            value={settings.messages}
            onChange={(on) => update({ messages: on })}
          />
          <ToggleRow
            icon="people-outline"
            label="Groups"
            description="Messages in group chats"
            value={settings.groups}
            onChange={(on) => update({ groups: on })}
          />
          <ToggleRow
            icon="mail-unread-outline"
            label="Message requests"
            description="People you do not know yet"
            value={settings.requests}
            onChange={(on) => update({ requests: on })}
          />
          <ToggleRow
            icon="happy-outline"
            label="Reactions"
            description="When someone reacts to your message"
            value={settings.reactions}
            onChange={(on) => update({ reactions: on })}
          />
        </SettingsSection>

        <SettingsSection
          title="Style"
          footer="Chats you mute, restrict or block never notify you, whatever you choose here."
        >
          <ToggleRow
            icon="text-outline"
            label="Show message preview"
            description="Show the message text in the notification"
            value={settings.showPreview}
            onChange={(on) => update({ showPreview: on })}
          />
          <ToggleRow
            icon="volume-high-outline"
            label="Sound"
            value={settings.sound}
            onChange={(on) => update({ sound: on })}
          />
          <ToggleRow
            icon="phone-portrait-outline"
            label="Vibration"
            value={settings.vibrate}
            onChange={(on) => update({ vibrate: on })}
          />
        </SettingsSection>

        <SettingsSection footer="Opens Android's own notification settings for Connekt.">
          <SettingsRow
            icon="settings-outline"
            label="Android notification settings"
            onPress={openAndroidNotificationSettings}
          />
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}
