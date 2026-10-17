import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { EmptyState } from '../../components/feedback/EmptyState';
import { TabScreen } from '../../components/layout/TabScreen';
import { TAB_BAR_CLEARANCE } from '../../components/navigation/tabBarMetrics';
import { SearchField } from '../../components/ui/SearchField';
import { SectionHeader } from '../../components/ui/SectionHeader';
import type { RootStackParamList } from '../../core/navigation/types';
import { formatChatTime } from '../../utils/formatChatTime';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import { buildSearchRows, searchChats } from './searchChats';
import { SearchResultRow } from './SearchResultRow';

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, getMessages, isSample } = useChats();
  const [query, setQuery] = useState('');

  const conversations = useMemo(() => items.map((item) => item.conversation), [items]);
  const rows = useMemo(
    () => buildSearchRows(searchChats(query, conversations, getMessages)),
    [query, conversations, getMessages],
  );

  const hasQuery = query.trim().length > 0;
  const open = (conversationId: string) => navigation.navigate('Conversation', { conversationId });

  return (
    <TabScreen title="Search" padForTabBar={false}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search chats and messages" />
        {isSample ? <SampleDataNotice message="Searching sample data only." /> : null}
        {rows.length === 0 ? (
          <EmptyState
            title={hasQuery ? 'No results' : 'Search'}
            message={
              hasQuery ? `Nothing found for "${query.trim()}".` : 'Find people and messages.'
            }
          />
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(row) => row.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
            renderItem={({ item }) => {
              if (item.kind === 'header') return <SectionHeader title={item.title} />;
              if (item.kind === 'chat') {
                return (
                  <SearchResultRow
                    name={item.conversation.name}
                    subtitle={item.conversation.lastMessage}
                    time={formatChatTime(item.conversation.lastMessageAt)}
                    onPress={() => open(item.conversation.id)}
                  />
                );
              }
              return (
                <SearchResultRow
                  name={item.hit.conversation.name}
                  subtitle={item.hit.message.text}
                  time={formatChatTime(item.hit.message.sentAt)}
                  onPress={() => open(item.hit.conversation.id)}
                />
              );
            }}
          />
        )}
      </KeyboardAvoidingView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
