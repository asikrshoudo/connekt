import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { EmptyState } from '../../components/feedback/EmptyState';
import { TabScreen } from '../../components/layout/TabScreen';
import { TAB_BAR_CLEARANCE } from '../../components/navigation/tabBarMetrics';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import type { RootStackParamList } from '../../core/navigation/types';
import type { CallRecord } from '../../types/call';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import { CallRow } from './CallRow';
import { useCalls } from './CallsProvider';

type Filter = 'all' | 'missed';

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'missed', label: 'Missed' },
];

export function CallsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { calls, isSample } = useCalls();
  const { getConversation } = useChats();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<CallRecord | null>(null);

  const visibleCalls = useMemo(() => {
    const sorted = [...calls].sort((a, b) => b.at - a.at);
    return filter === 'missed' ? sorted.filter((call) => call.missed) : sorted;
  }, [calls, filter]);

  const nameOf = (call: CallRecord) => getConversation(call.conversationId)?.name ?? 'Unknown';

  return (
    <TabScreen title="Calls" padForTabBar={false}>
      <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
      <FlatList
        data={visibleCalls}
        keyExtractor={(call) => call.id}
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE, flexGrow: 1 }}
        ListHeaderComponent={
          isSample ? (
            <SampleDataNotice message="Sample call history. Calling is not available in this version." />
          ) : undefined
        }
        ListEmptyComponent={
          <EmptyState
            title={filter === 'missed' ? 'No missed calls' : 'No calls yet'}
            message="Calling is not available in this version."
          />
        }
        renderItem={({ item }) => (
          <CallRow call={item} name={nameOf(item)} onPress={() => setSelected(item)} />
        )}
      />

      <ActionSheet
        visible={selected !== null}
        title={selected ? nameOf(selected) : undefined}
        message="Calling is not available in this version."
        actions={
          selected
            ? [
                {
                  label: 'Message',
                  onPress: () => {
                    const conversationId = selected.conversationId;
                    setSelected(null);
                    navigation.navigate('Conversation', { conversationId });
                  },
                },
              ]
            : []
        }
        cancelLabel="Close"
        onClose={() => setSelected(null)}
      />
    </TabScreen>
  );
}
