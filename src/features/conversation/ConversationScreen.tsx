import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurTargetView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import type { RootStackParamList } from '../../core/navigation/types';
import type { Message } from '../../types/chat';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import { buildTimeline } from './buildTimeline';
import { ConversationHeader } from './ConversationHeader';
import { MessageComposer } from './MessageComposer';
import { MessageList } from './MessageList';
import { MessageMenuOverlay } from './MessageMenuOverlay';
import type { MessageMenuTarget } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

type ReplyTarget = { id: string; author: string; text: string };

export function ConversationScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { getConversation, getMessages, isSample, markRead, send, react, deleteMessage } =
    useChats();
  const conversation = getConversation(conversationId);
  const contactName = conversation?.name ?? '';
  const messages = getMessages(conversationId);
  const rows = useMemo(() => buildTimeline(messages), [messages]);

  const blurTargetRef = useRef<ComponentRef<typeof View>>(null);
  const [menu, setMenu] = useState<MessageMenuTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);

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

  const closeMenu = () => setMenu(null);

  const handleReact = (emoji: string) => {
    if (!menu) return;
    react(conversationId, menu.message.id, emoji);
    closeMenu();
  };

  const handleReply = () => {
    if (!menu) return;
    const { message } = menu;
    setReplyTo({
      id: message.id,
      author: message.direction === 'outgoing' ? 'You' : contactName,
      text: message.text,
    });
    closeMenu();
  };

  const handleCopy = () => {
    if (!menu) return;
    void Clipboard.setStringAsync(menu.message.text);
    closeMenu();
  };

  const handleDelete = () => {
    if (!menu) return;
    setDeleteTarget(menu.message);
    closeMenu();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMessage(conversationId, deleteTarget.id);
    if (replyTo?.id === deleteTarget.id) setReplyTo(null);
    setDeleteTarget(null);
  };

  const handleSend = (text: string) => {
    send(conversationId, text, replyTo?.id);
    setReplyTo(null);
  };

  return (
    <View style={styles.flex}>
      <BlurTargetView ref={blurTargetRef} style={styles.flex}>
        <Screen padBottom={false}>
          <ConversationHeader name={conversation.name} onBack={() => navigation.goBack()} />
          <KeyboardAvoidingView behavior="padding" style={styles.flex}>
            {rows.length === 0 ? (
              <EmptyState title="No messages yet" message="Say hello to start the conversation." />
            ) : (
              <MessageList
                rows={rows}
                contactName={contactName}
                onMessageLongPress={setMenu}
                footer={
                  isSample ? (
                    <SampleDataNotice message="Sample conversation. Messages you type stay on this device and are not sent." />
                  ) : undefined
                }
              />
            )}
            <MessageComposer
              onSend={handleSend}
              replyPreview={replyTo ? { author: replyTo.author, text: replyTo.text } : null}
              onCancelReply={() => setReplyTo(null)}
            />
          </KeyboardAvoidingView>
        </Screen>
      </BlurTargetView>

      {menu ? (
        <MessageMenuOverlay
          target={menu}
          blurTarget={blurTargetRef}
          onClose={closeMenu}
          onReact={handleReact}
          onReply={handleReply}
          onCopy={handleCopy}
          onDelete={handleDelete}
        />
      ) : null}

      <ActionSheet
        visible={deleteTarget !== null}
        title="Delete message?"
        message="This removes it from this device only."
        actions={[{ label: 'Delete', destructive: true, onPress: confirmDelete }]}
        onClose={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
