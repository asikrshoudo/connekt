import type { MenuItem } from '../../components/feedback/MenuCard';
import { isGroup } from '../../utils/conversation';
import type { ChatListItem } from './chatsState';

export type ChatMenuActions = {
  togglePin: () => void;
  markRead: () => void;
  mute: () => void;
  unmute: () => void;
  archive: () => void;
  toggleRestrict: () => void;
  askBlock: () => void;
  unblock: () => void;
  askDelete: () => void;
};

export function buildChatMenu(
  item: ChatListItem,
  blocked: boolean,
  actions: ChatMenuActions,
): MenuItem[] {
  const menu: MenuItem[] = [];

  menu.push({
    label: item.pinned ? 'Unpin' : 'Pin',
    icon: item.pinned ? 'pin-outline' : 'pin',
    onPress: actions.togglePin,
  });

  if (item.conversation.unreadCount > 0) {
    menu.push({ label: 'Mark as read', icon: 'checkmark-done-outline', onPress: actions.markRead });
  }

  menu.push(
    item.muted
      ? { label: 'Unmute', icon: 'notifications-outline', onPress: actions.unmute }
      : { label: 'Mute', icon: 'notifications-off-outline', onPress: actions.mute },
  );

  menu.push({ label: 'Archive', icon: 'archive-outline', onPress: actions.archive });

  if (!isGroup(item.conversation)) {
    menu.push({
      label: item.restricted ? 'Unrestrict' : 'Restrict',
      icon: item.restricted ? 'eye-outline' : 'eye-off-outline',
      onPress: actions.toggleRestrict,
    });
    menu.push(
      blocked
        ? { label: 'Unblock', icon: 'checkmark-circle-outline', onPress: actions.unblock }
        : { label: 'Block', icon: 'ban-outline', onPress: actions.askBlock, destructive: true },
    );
  }

  menu.push({
    label: 'Delete chat',
    icon: 'trash-outline',
    onPress: actions.askDelete,
    destructive: true,
  });

  return menu;
}
