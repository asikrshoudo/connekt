import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppearanceScreen } from '../../features/appearance/AppearanceScreen';
import { ArchivedChatsScreen } from '../../features/chats/ArchivedChatsScreen';
import { RestrictedChatsScreen } from '../../features/chats/RestrictedChatsScreen';
import { BlockedContactsScreen } from '../../features/contacts/BlockedContactsScreen';
import { MyQrScreen } from '../../features/contacts/MyQrScreen';
import { ConversationScreen } from '../../features/conversation/ConversationScreen';
import { ContactProfileScreen } from '../../features/contacts/ContactProfileScreen';
import { DevicesScreen } from '../../features/devices/DevicesScreen';
import { EditGroupScreen } from '../../features/groups/EditGroupScreen';
import { ForwardScreen } from '../../features/forward/ForwardScreen';
import { GroupInfoScreen } from '../../features/groups/GroupInfoScreen';
import { MediaViewerScreen } from '../../features/media/MediaViewerScreen';
import { NotificationsScreen } from '../../features/notifications/NotificationsScreen';
import { PinFlowScreen } from '../../features/security/PinFlowScreen';
import { StorageScreen } from '../../features/storage/StorageScreen';
import { PrivacySecurityScreen } from '../../features/security/PrivacySecurityScreen';
import { EditProfileScreen } from '../../features/profile/EditProfileScreen';
import { ProfileScreen } from '../../features/profile/ProfileScreen';
import { NewChatScreen } from '../../features/newchat/NewChatScreen';
import { NewGroupScreen } from '../../features/newchat/NewGroupScreen';
import { ScanScreen } from '../../features/scan/ScanScreen';
import { AddContactScreen } from '../../features/settings/AddContactScreen';
import { RequestDetailScreen } from '../../features/requests/RequestDetailScreen';
import { RequestsScreen } from '../../features/requests/RequestsScreen';
import { PermissionsScreen } from '../../features/settings/PermissionsScreen';
import { useColors } from '../theme/ThemeProvider';
import { RootTabs } from './RootTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const colors = useColors();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen name="Tabs" component={RootTabs} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="NewChat" component={NewChatScreen} />
      <Stack.Screen name="AddContact" component={AddContactScreen} />
      <Stack.Screen name="MediaViewer" component={MediaViewerScreen} />
      <Stack.Screen name="ContactProfile" component={ContactProfileScreen} />
      <Stack.Screen name="Requests" component={RequestsScreen} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
      <Stack.Screen name="NewGroup" component={NewGroupScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="ArchivedChats" component={ArchivedChatsScreen} />
      <Stack.Screen name="BlockedContacts" component={BlockedContactsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Appearance" component={AppearanceScreen} />
      <Stack.Screen name="MyQr" component={MyQrScreen} />
      <Stack.Screen name="EditGroup" component={EditGroupScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Storage" component={StorageScreen} />
      <Stack.Screen name="Devices" component={DevicesScreen} />
      <Stack.Screen name="RestrictedChats" component={RestrictedChatsScreen} />
      <Stack.Screen name="Forward" component={ForwardScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="PinFlow" component={PinFlowScreen} />
    </Stack.Navigator>
  );
}
