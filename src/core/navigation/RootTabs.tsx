import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FloatingTabBar } from '../../components/navigation/FloatingTabBar';
import { CallsScreen } from '../../features/calls/CallsScreen';
import { ChatsScreen } from '../../features/chats/ChatsScreen';
import { SearchScreen } from '../../features/search/SearchScreen';
import { SettingsScreen } from '../../features/settings/SettingsScreen';

export type TabParamList = {
  Chats: undefined;
  Search: undefined;
  Calls: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export function RootTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
