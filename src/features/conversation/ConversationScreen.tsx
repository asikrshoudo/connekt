import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import type { RootStackParamList } from '../../core/navigation/types';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import { buildTimeline } from './buildTimeline';
import { ConversationHeader } from './ConversationHeader';
import { MessageComposer } from './MessageComposer';
import { MessageList } from './MessageList';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

export function ConversationScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { getConversation, getMessages, isSample, markRead, send } = useChats();
  const conversation = getConversation(conversationId);
  const messages = getMessages(conversationId);
  const rows = useMemo(() => buildTimeline(messages), [messages]);

  useEffect(() => {
    markRead(conversationId);
  }, [conversationId, markRead]);

  if (!conversation) {
    return (
      <Screen>
        <EmptyState
          title="Conversation not found"
          message="This conversation is no longer available."
        />
      </Screen>
    );
  }

  return (
    <Screen padBottom={false}>
      <ConversationHeader name={conversation.name} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        {rows.length === 0 ? (
          <EmptyState title="No messages yet" message="Say hello to start the conversation." />
        ) : (
          <MessageList
            rows={rows}
            footer={
              isSample ? (
                <SampleDataNotice message="Sample conversation. Messages you type stay on this device and are not sent." />
              ) : undefined
            }
          />
        )}
        <MessageComposer onSend={(text) => send(conversationId, text)} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
