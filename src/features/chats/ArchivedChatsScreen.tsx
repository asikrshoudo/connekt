import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { EmptyState } from '../../components/feedback/EmptyState';
import type { MenuItem } from '../../components/feedback/MenuCard';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import type { RootStackParamList } from '../../core/navigation/types';
import { ChatPopover } from './ChatPopover';
import { ConversationRow } from './ConversationRow';
import { useChats } from './ChatsProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'ArchivedChats'>;

type MenuState = { id: string; point: { x: number; y: number } };

export function ArchivedChatsScreen({ navigation }: Props) {
  const { archivedItems, unarchive, deleteChat } = useChats();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const menuItem = archivedItems.find((item) => item.conversation.id === menu?.id);
  const deleteItem = archivedItems.find((item) => item.conversation.id === deleteId);

  const menuItems: MenuItem[] = menuItem
    ? [
        {
          label: 'Unarchive',
          icon: 'arrow-undo-outline',
          onPress: () => {
            setMenu(null);
            unarchive(menuItem.conversation.id);
          },
        },
        {
          label: 'Delete chat',
          icon: 'trash-outline',
          destructive: true,
          onPress: () => {
            setMenu(null);
            setDeleteId(menuItem.conversation.id);
          },
        },
      ]
    : [];

  return (
    <Screen>
      <ScreenHeader title="Archived chats" onBack={() => navigation.goBack()} />
      <FlatList
        data={archivedItems}
        keyExtractor={(item) => item.conversation.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title="No archived chats"
            message="Archive a chat from the Chats list to keep it out of the way."
          />
        }
        renderItem={({ item }) => (
          <ConversationRow
            item={item}
            onPress={() =>
              navigation.navigate('Conversation', { conversationId: item.conversation.id })
            }
            onLongPress={(point) => setMenu({ id: item.conversation.id, point })}
          />
        )}
      />

      <ChatPopover
        visible={menuItem !== undefined}
        point={menu?.point ?? { x: 0, y: 0 }}
        items={menuItems}
        onClose={() => setMenu(null)}
      />

      <ConfirmDialog
        visible={deleteItem !== undefined}
        title="Are you sure?"
        message={`"${deleteItem?.conversation.name ?? ''}" and all its messages will be deleted from this device.`}
        confirmLabel="Yes, delete"
        cancelLabel="Never mind"
        destructive
        onConfirm={() => {
          if (deleteId) deleteChat(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </Screen>
  );
}
