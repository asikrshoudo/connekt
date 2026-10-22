import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { EmptyState } from '../../components/feedback/EmptyState';
import type { MenuItem } from '../../components/feedback/MenuCard';
import { TabScreen } from '../../components/layout/TabScreen';
import { TAB_BAR_CLEARANCE } from '../../components/navigation/tabBarMetrics';
import { HeaderIconButton } from '../../components/ui/HeaderIconButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { RequestsRow } from '../requests/RequestsRow';
import { buildChatMenu } from './chatMenuItems';
import { ChatPopover } from './ChatPopover';
import { MAX_PINNED, type ChatListItem } from './chatsState';
import { ConversationRow } from './ConversationRow';
import { useChats } from './ChatsProvider';
import { SampleDataNotice } from './SampleDataNotice';

type Point = { x: number; y: number };
type MenuState = { id: string; point: Point };

const HOUR = 60 * 60 * 1000;
const WEEK = 7 * 24 * HOUR;

export function ChatsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const chats = useChats();
  const { items, isSample, requests, isBlocked } = chats;

  const [menu, setMenu] = useState<MenuState | null>(null);
  const [plusPoint, setPlusPoint] = useState<Point | null>(null);
  const [showLimit, setShowLimit] = useState(false);
  const [muteId, setMuteId] = useState<string | null>(null);
  const [blockId, setBlockId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [restrictId, setRestrictId] = useState<string | null>(null);

  const find = (id: string | null): ChatListItem | undefined =>
    id ? items.find((item) => item.conversation.id === id) : undefined;

  const menuItem = find(menu?.id ?? null);
  const muteItem = find(muteId);
  const blockItem = find(blockId);
  const deleteItem = find(deleteId);
  const restrictItem = find(restrictId);

  const togglePin = (id: string, pinned: boolean) => {
    if (pinned) chats.unpin(id);
    else if (chats.canPinMore) chats.pin(id);
    else setShowLimit(true);
  };

  const menuFor = (item: ChatListItem): MenuItem[] => {
    const id = item.conversation.id;
    const run = (action: () => void) => () => {
      setMenu(null);
      action();
    };
    return buildChatMenu(item, isBlocked(id), {
      togglePin: run(() => togglePin(id, item.pinned)),
      markRead: run(() => chats.markRead(id)),
      mute: run(() => setMuteId(id)),
      unmute: run(() => chats.unmute(id)),
      archive: run(() => chats.archive(id)),
      toggleRestrict: run(() => (item.restricted ? chats.unrestrict(id) : setRestrictId(id))),
      askBlock: run(() => setBlockId(id)),
      unblock: run(() => chats.unblock(id)),
      askDelete: run(() => setDeleteId(id)),
    });
  };

  const applyMute = (durationMs: number | null) => {
    if (muteId) chats.mute(muteId, durationMs);
    setMuteId(null);
  };

  const plusItems: MenuItem[] = [
    {
      label: 'New chat',
      icon: 'chatbubble-outline',
      onPress: () => {
        setPlusPoint(null);
        navigation.navigate('NewChat');
      },
    },
    {
      label: 'New group',
      icon: 'people-outline',
      onPress: () => {
        setPlusPoint(null);
        navigation.navigate('NewGroup');
      },
    },
    {
      label: 'Add contact',
      icon: 'person-add-outline',
      onPress: () => {
        setPlusPoint(null);
        navigation.navigate('AddContact');
      },
    },
  ];

  return (
    <TabScreen
      title="Chats"
      padForTabBar={false}
      headerRight={
        <View style={styles.actions}>
          <HeaderIconButton
            icon="scan-outline"
            label="Scan QR code"
            onPress={() => navigation.navigate('Scan')}
          />
          <HeaderIconButton
            icon="add"
            label="New chat or contact"
            onPress={(event) =>
              setPlusPoint({
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY - event.nativeEvent.locationY + 40,
              })
            }
          />
        </View>
      }
    >
      <FlatList
        data={items}
        keyExtractor={(item) => item.conversation.id}
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE, flexGrow: 1 }}
        ListHeaderComponent={
          <>
            {isSample ? <SampleDataNotice /> : null}
            {requests.length > 0 ? (
              <RequestsRow
                count={requests.length}
                onPress={() => navigation.navigate('Requests')}
              />
            ) : null}
          </>
        }
        ListEmptyComponent={
          <EmptyState title="No conversations yet" message="Your conversations will appear here." />
        }
        renderItem={({ item }) => (
          <ConversationRow
            item={item}
            onPress={() =>
              navigation.navigate('Conversation', { conversationId: item.conversation.id })
            }
            onLongPress={(point) => setMenu({ id: item.conversation.id, point })}
            onTogglePin={() => togglePin(item.conversation.id, item.pinned)}
          />
        )}
      />

      <ChatPopover
        visible={menuItem !== undefined}
        point={menu?.point ?? { x: 0, y: 0 }}
        items={menuItem ? menuFor(menuItem) : []}
        onClose={() => setMenu(null)}
      />

      <ChatPopover
        visible={plusPoint !== null}
        point={plusPoint ?? { x: 0, y: 0 }}
        items={plusItems}
        alignRight
        onClose={() => setPlusPoint(null)}
      />

      <ActionSheet
        visible={muteItem !== undefined}
        title="Mute chat"
        message="Notifications are not active yet. A muted chat shows a muted icon."
        actions={[
          { label: '8 hours', onPress: () => applyMute(8 * HOUR) },
          { label: '1 week', onPress: () => applyMute(WEEK) },
          { label: 'Always', onPress: () => applyMute(null) },
        ]}
        onClose={() => setMuteId(null)}
      />

      <ActionSheet
        visible={blockItem !== undefined}
        title={`Block ${blockItem?.conversation.name ?? ''}?`}
        message="Blocking is saved on this device only for now."
        actions={[
          {
            label: 'Block',
            destructive: true,
            onPress: () => {
              if (blockId) chats.block(blockId);
              setBlockId(null);
            },
          },
        ]}
        onClose={() => setBlockId(null)}
      />

      <ActionSheet
        visible={restrictItem !== undefined}
        title={`Restrict ${restrictItem?.conversation.name ?? ''}?`}
        message="This chat moves out of your Chats list. Find it again in Settings, Restricted chats. It will not notify you. Saved on this device only for now."
        actions={[
          {
            label: 'Restrict',
            onPress: () => {
              if (restrictId) chats.restrict(restrictId);
              setRestrictId(null);
            },
          },
        ]}
        onClose={() => setRestrictId(null)}
      />

      <ConfirmDialog
        visible={deleteItem !== undefined}
        title="Are you sure?"
        message={`"${deleteItem?.conversation.name ?? ''}" and all its messages will be deleted from this device.`}
        confirmLabel="Yes, delete"
        cancelLabel="Never mind"
        destructive
        onConfirm={() => {
          if (deleteId) chats.deleteChat(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />

      <ActionSheet
        visible={showLimit}
        title="Pin limit reached"
        message={`You can pin up to ${MAX_PINNED} chats. Unpin one to pin another.`}
        actions={[]}
        cancelLabel="OK"
        onClose={() => setShowLimit(false)}
      />
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: spacing.sm },
});
