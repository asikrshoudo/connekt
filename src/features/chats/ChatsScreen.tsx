import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { EmptyState } from '../../components/feedback/EmptyState';
import { TabScreen } from '../../components/layout/TabScreen';
import { TAB_BAR_CLEARANCE } from '../../components/navigation/tabBarMetrics';
import type { RootStackParamList } from '../../core/navigation/types';
import { MAX_PINNED } from './chatsState';
import { ConversationRow } from './ConversationRow';
import { useChats } from './ChatsProvider';
import { SampleDataNotice } from './SampleDataNotice';

export function ChatsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, isSample, canPinMore, pin, unpin } = useChats();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [showLimit, setShowLimit] = useState(false);

  const menuItem = items.find((item) => item.conversation.id === menuId);

  const togglePin = (id: string, pinned: boolean) => {
    if (pinned) {
      unpin(id);
    } else if (canPinMore) {
      pin(id);
    } else {
      setShowLimit(true);
    }
  };

  return (
    <TabScreen title="Chats" padForTabBar={false}>
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
            onLongPress={() => setMenuId(item.conversation.id)}
            onTogglePin={() => togglePin(item.conversation.id, item.pinned)}
          />
        )}
      />

      <ActionSheet
        visible={menuItem !== undefined}
        title={menuItem?.conversation.name}
        actions={
          menuItem
            ? [
                {
                  label: menuItem.pinned ? 'Unpin' : 'Pin',
                  onPress: () => {
                    setMenuId(null);
                    togglePin(menuItem.conversation.id, menuItem.pinned);
                  },
                },
              ]
            : []
        }
        onClose={() => setMenuId(null)}
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
