import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { EmptyState } from '../../components/feedback/EmptyState';
import type { MenuItem } from '../../components/feedback/MenuCard';
import { TabScreen } from '../../components/layout/TabScreen';
import { TAB_BAR_CLEARANCE } from '../../components/navigation/tabBarMetrics';
import { HeaderIconButton } from '../../components/ui/HeaderIconButton';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { ChatPopover } from './ChatPopover';
import { MAX_PINNED } from './chatsState';
import { ConversationRow } from './ConversationRow';
import { useChats } from './ChatsProvider';
import { SampleDataNotice } from './SampleDataNotice';

type Point = { x: number; y: number };
type MenuState = { id: string; point: Point };

export function ChatsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, isSample, canPinMore, pin, unpin, markRead } = useChats();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [plusPoint, setPlusPoint] = useState<Point | null>(null);
  const [showLimit, setShowLimit] = useState(false);

  const menuItem = menu ? items.find((item) => item.conversation.id === menu.id) : undefined;

  const togglePin = (id: string, pinned: boolean) => {
    if (pinned) {
      unpin(id);
    } else if (canPinMore) {
      pin(id);
    } else {
      setShowLimit(true);
    }
  };

  const menuItems: MenuItem[] = [];
  if (menuItem) {
    const { conversation, pinned } = menuItem;
    menuItems.push({
      label: pinned ? 'Unpin' : 'Pin',
      icon: pinned ? 'pin-outline' : 'pin',
      onPress: () => {
        setMenu(null);
        togglePin(conversation.id, pinned);
      },
    });
    if (conversation.unreadCount > 0) {
      menuItems.push({
        label: 'Mark as read',
        icon: 'checkmark-done-outline',
        onPress: () => {
          setMenu(null);
          markRead(conversation.id);
        },
      });
    }
  }

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
              setPlusPoint({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
            }
          />
        </View>
      }
    >
      <FlatList
        data={items}
        keyExtractor={(item) => item.conversation.id}
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE, flexGrow: 1 }}
        ListHeaderComponent={isSample ? <SampleDataNotice /> : undefined}
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
        visible={menu !== null && menuItems.length > 0}
        point={menu?.point ?? { x: 0, y: 0 }}
        items={menuItems}
        onClose={() => setMenu(null)}
      />

      <ChatPopover
        visible={plusPoint !== null}
        point={plusPoint ?? { x: 0, y: 0 }}
        items={plusItems}
        onClose={() => setPlusPoint(null)}
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
