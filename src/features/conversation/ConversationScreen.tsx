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
import { usePermissionGate } from '../../core/permissions/usePermissionGate';
import type { Attachment, Message } from '../../types/chat';
import { messagePreview } from '../../utils/messagePreview';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import { getCurrentLocation, openInMaps, pickFile, pickFromLibrary, takePhoto } from './attachments';
import { buildTimeline } from './buildTimeline';
import { BlockedBar } from './BlockedBar';
import { ConversationHeader } from './ConversationHeader';
import { MessageComposer } from './MessageComposer';
import { MessageList } from './MessageList';
import { MessageMenuOverlay } from './MessageMenuOverlay';
import type { MessageMenuTarget } from './types';
import { useVoiceRecorder } from './useVoiceRecorder';

type Props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;

type ReplyTarget = { id: string; author: string; text: string };
type Notice = { title: string; message: string };
type AttachAction = 'library' | 'camera' | 'file' | 'location';

export function ConversationScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { getConversation, getMessages, isSample, markRead, send, react, deleteMessage, isBlocked, unblock } =
    useChats();
  const conversation = getConversation(conversationId);
  const contactName = conversation?.name ?? '';
  const messages = getMessages(conversationId);
  const rows = useMemo(() => buildTimeline(messages), [messages]);
  const blocked = isBlocked(conversationId);

  const { ensure, gate } = usePermissionGate();
  const recorder = useVoiceRecorder();

  const blurTargetRef = useRef<ComponentRef<typeof View>>(null);
  const [menu, setMenu] = useState<MessageMenuTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<Attachment | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

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
      text: messagePreview(message),
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

  const sendAttachments = (items: Attachment[]) => {
    items.forEach((attachment, index) => {
      send(conversationId, { text: '', attachment }, index === 0 ? replyTo?.id : undefined);
    });
    if (items.length > 0) setReplyTo(null);
  };

  const handleAttachment = async (action: AttachAction) => {
    try {
      if (action === 'library') {
        sendAttachments(await pickFromLibrary());
      } else if (action === 'file') {
        sendAttachments(await pickFile());
      } else if (action === 'camera') {
        if (await ensure('camera')) sendAttachments(await takePhoto());
      } else if (await ensure('location')) {
        try {
          setPendingLocation(await getCurrentLocation());
        } catch {
          setNotice({
            title: 'No location',
            message: 'Could not get your location. Make sure location is turned on.',
          });
        }
      }
    } catch {
      setNotice({ title: 'Something went wrong', message: 'Could not attach that. Please try again.' });
    }
  };

  // Close the sheet first so the system picker does not open on top of it.
  const runAttachment = (action: AttachAction) => {
    setAttachOpen(false);
    setTimeout(() => void handleAttachment(action), 250);
  };

  const startRecording = async () => {
    if (!(await ensure('microphone'))) return;
    try {
      await recorder.start();
    } catch {
      setNotice({ title: 'Could not record', message: 'Recording failed to start. Please try again.' });
    }
  };

  const finishRecording = async () => {
    const result = await recorder.stop();
    if (result) sendAttachments([{ kind: 'voice', uri: result.uri, durationMs: result.durationMs }]);
  };

  const cancelRecording = () => {
    void recorder.stop();
  };

  const handleOpen = (message: Message) => {
    const attachment = message.attachment;
    if (!attachment) return;
    if (attachment.kind === 'image' || attachment.kind === 'video') {
      navigation.navigate('MediaViewer', { uri: attachment.uri, kind: attachment.kind });
    } else if (attachment.kind === 'location') {
      openInMaps(attachment.latitude, attachment.longitude).catch(() =>
        setNotice({ title: 'No maps app', message: 'Install a maps app to open this location.' }),
      );
    } else if (attachment.kind === 'file') {
      setNotice({
        title: attachment.name,
        message: 'Opening files is not available yet. The file stays on this device.',
      });
    }
  };

  const handleSendText = (text: string) => {
    send(conversationId, { text }, replyTo?.id);
    setReplyTo(null);
  };

  return (
    <View style={styles.flex}>
      <BlurTargetView ref={blurTargetRef} style={styles.flex}>
        <Screen padBottom={false}>
          <ConversationHeader
            name={conversation.name}
            onBack={() => navigation.goBack()}
            onProfile={() => navigation.navigate('ContactProfile', { conversationId })}
          />
          <KeyboardAvoidingView behavior="padding" style={styles.flex}>
            {rows.length === 0 ? (
              <EmptyState title="No messages yet" message="Say hello to start the conversation." />
            ) : (
              <MessageList
                rows={rows}
                contactName={contactName}
                onMessageLongPress={setMenu}
                onMessageOpen={handleOpen}
                footer={
                  isSample ? (
                    <SampleDataNotice message="Sample conversation. Messages you type stay on this device and are not sent." />
                  ) : undefined
                }
              />
            )}
            {blocked ? (
              <BlockedBar name={contactName} onUnblock={() => unblock(conversationId)} />
            ) : (
            <MessageComposer
              onSendText={handleSendText}
              onAttach={() => setAttachOpen(true)}
              recording={recorder.recording}
              elapsedMs={recorder.elapsedMs}
              onStartRecording={() => void startRecording()}
              onCancelRecording={cancelRecording}
              onSendRecording={() => void finishRecording()}
              replyPreview={replyTo ? { author: replyTo.author, text: replyTo.text } : null}
              onCancelReply={() => setReplyTo(null)}
            />
            )}
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
        visible={attachOpen}
        actions={[
          { label: 'Photo or video', onPress: () => runAttachment('library') },
          { label: 'Camera', onPress: () => runAttachment('camera') },
          { label: 'File', onPress: () => runAttachment('file') },
          { label: 'Location', onPress: () => runAttachment('location') },
        ]}
        onClose={() => setAttachOpen(false)}
      />

      <ActionSheet
        visible={pendingLocation !== null}
        title="Share your location?"
        message={
          pendingLocation?.kind === 'location'
            ? `${pendingLocation.latitude.toFixed(5)}, ${pendingLocation.longitude.toFixed(5)}`
            : undefined
        }
        actions={[
          {
            label: 'Send location',
            onPress: () => {
              if (pendingLocation) sendAttachments([pendingLocation]);
              setPendingLocation(null);
            },
          },
        ]}
        onClose={() => setPendingLocation(null)}
      />

      <ActionSheet
        visible={deleteTarget !== null}
        title="Delete message?"
        message="This removes it from this device only."
        actions={[{ label: 'Delete', destructive: true, onPress: confirmDelete }]}
        onClose={() => setDeleteTarget(null)}
      />

      <ActionSheet
        visible={notice !== null}
        title={notice?.title}
        message={notice?.message}
        actions={[]}
        cancelLabel="OK"
        onClose={() => setNotice(null)}
      />

      {gate}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
