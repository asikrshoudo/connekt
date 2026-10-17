import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConversationScreen } from '../../features/conversation/ConversationScreen';
import { MediaViewerScreen } from '../../features/media/MediaViewerScreen';
import { NewChatScreen } from '../../features/newchat/NewChatScreen';
import { ScanScreen } from '../../features/scan/ScanScreen';
import { AddContactScreen } from '../../features/settings/AddContactScreen';
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
    </Stack.Navigator>
  );
}
