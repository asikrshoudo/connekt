import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList } from 'react-native';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import type { RootStackParamList } from '../../core/navigation/types';
import { formatChatTime } from '../../utils/formatChatTime';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import { SearchResultRow } from '../search/SearchResultRow';

type Props = NativeStackScreenProps<RootStackParamList, 'Requests'>;

export function RequestsScreen({ navigation }: Props) {
  const { requests, isSample } = useChats();

  return (
    <Screen>
      <ScreenHeader title="Message requests" onBack={() => navigation.goBack()} />
      <FlatList
        data={requests}
        keyExtractor={(request) => request.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={
          isSample ? (
            <SampleDataNotice message="Sample requests. These are not real messages." />
          ) : undefined
        }
        ListEmptyComponent={
          <EmptyState
            title="No message requests"
            message="Messages from people you do not know will appear here."
          />
        }
        renderItem={({ item }) => (
          <SearchResultRow
            name={item.name}
            subtitle={item.firstMessage}
            time={formatChatTime(item.receivedAt)}
            onPress={() => navigation.navigate('RequestDetail', { requestId: item.id })}
          />
        )}
      />
    </Screen>
  );
}
