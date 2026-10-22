import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { EmptyState } from '../../components/feedback/EmptyState';
import type { MenuItem } from '../../components/feedback/MenuCard';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { ChatPopover } from './ChatPopover';
import { ConversationRow } from './ConversationRow';
import { useChats } from './ChatsProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'RestrictedChats'>;

type MenuState = { id: string; point: { x: number; y: number } };

export function RestrictedChatsScreen({ navigation }: Props) {
  const { restrictedItems, unrestrict, deleteChat } = useChats();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const menuItem = restrictedItems.find((item) => item.conversation.id === menu?.id);
  const deleteItem = restrictedItems.find((item) => item.conversation.id === deleteId);

  const menuItems: MenuItem[] = menuItem
    ? [
        {
          label: 'Unrestrict',
          icon: 'eye-outline',
          onPress: () => {
            setMenu(null);
            unrestrict(menuItem.conversation.id);
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
      <ScreenHeader title="Restricted chats" onBack={() => navigation.goBack()} />
      <FlatList
        data={restrictedItems}
        keyExtractor={(item) => item.conversation.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={
          <AppText variant="footnote" tone="muted" style={styles.note}>
            Restricted chats are hidden from your Chats list and never notify you. Restricting is
            saved on this device only for now.
          </AppText>
        }
        ListEmptyComponent={
          <EmptyState
            title="No restricted chats"
            message="Restrict a chat from the Chats list to move it here."
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

const styles = StyleSheet.create({
  note: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
});
