import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type TabItemConfig = {
  label: string;
  icon: IconName;
  iconFocused: IconName;
};

export const tabConfig: Record<string, TabItemConfig> = {
  Chats: { label: 'Inbox', icon: 'chatbubbles-outline', iconFocused: 'chatbubbles' },
  Search: { label: 'Search', icon: 'search-outline', iconFocused: 'search' },
  Calls: { label: 'Calls', icon: 'call-outline', iconFocused: 'call' },
  Settings: { label: 'Settings', icon: 'settings-outline', iconFocused: 'settings' },
};
