import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurTargetView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ActionSheet } from '../../components/feedback/ActionSheet';
import { useToast } from '../../components/feedback/ToastProvider';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Screen } from '../../components/layout/Screen';
import type { RootStackParamList } from '../../core/navigation/types';
import { usePermissionGate } from '../../core/permissions/usePermissionGate';
import type { Attachment, Message } from '../../types/chat';
import { isGroup } from '../../utils/conversation';
import { messagePreview } from '../../utils/messagePreview';
import { useChats } from '../chats/ChatsProvider';
import { SampleDataNotice } from '../chats/SampleDataNotice';
import {
  getCurrentLocation,
  openFile,
  openInMaps,
  pickFile,
  pickFromLibrary,
  takePhoto,
} from './attachments';
import { AttachPanel, type AttachAction } from './AttachPanel';
import { groupMedia } from './albums';
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

export function ConversationScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { getConversation, getMessages, isSample, markRead, send, react, deleteMessage, isBlocked, unblock } =
    useChats();
  const conversation = getConversation(conversationId);
  const contactName = conversation?.name ?? '';
  const messages = getMessages(conversationId);
  const rows = useMemo(() => buildTimeline(messages), [messages]);
  const blocked = isBlocked(conversationId);
  const group = conversation ? isGroup(conversation) : false;
  const memberCount = (conversation?.members?.length ?? 0) + 1;

  const { ensure, gate } = usePermissionGate();
  const recorder = useVoiceRecorder();
  const toast = useToast();

  const blurTargetRef = useRef<ComponentRef<typeof View>>(null);
  const [menu, setMenu] = useState<MessageMenuTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const [attachAnchor, setAttachAnchor] = useState<number | null>(null);
  const [pendingLocation, setPendingLocation] = useState<Attachment | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    markRead(conversationId);
  }, [conversationId, markRead]);

  // Back closes the message menu first instead of leaving the chat.
  useEffect(() => {
    if (!menu) return undefined;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setMenu(null);
      return true;
    });
    return () => subscription.remove();
  }, [menu]);

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

  const startReply = (message: Message) => {
    setReplyTo({
      id: message.id,
      author: message.direction === 'outgoing' ? 'You' : (message.senderName ?? contactName),
      text: messagePreview(message),
    });
  };

  const handleReply = () => {
    if (!menu) return;
    startReply(menu.message);
    closeMenu();
  };

  const handleForward = () => {
    if (!menu) return;
    const messageId = menu.message.id;
    closeMenu();
    navigation.navigate('Forward', { conversationId, messageId });
  };

  const handleCopy = () => {
    if (!menu) return;
    void Clipboard.setStringAsync(menu.message.text);
    toast.show('Copied');
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

  const sendAttachments = (picked: Attachment[]) => {
    const items = groupMedia(picked);
    items.forEach((attachment, index) => {
      send(conversationId, { text: '', attachment }, index === 0 ? replyTo?.id : undefined);
    });
    if (items.length > 0) setReplyTo(null);
  };

  const handleAttachment = async (action: AttachAction) => {
    try {
      if (action === 'photos' || action === 'videos') {
        sendAttachments(await pickFromLibrary(action === 'photos' ? 'images' : 'videos'));
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

  const sendRecent = (items: Attachment[]) => {
    setAttachAnchor(null);
    sendAttachments(items);
  };

  // Asks for photo access first, then reopens the panel where it was.
  const needMedia = () => {
    const anchor = attachAnchor;
    setAttachAnchor(null);
    void ensure('media').then((granted) => {
      if (granted) setAttachAnchor(anchor);
    });
  };

  // Close the panel first so the system picker does not open on top of it.
  const runAttachment = (action: AttachAction) => {
    setAttachAnchor(null);
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
      openFile(attachment).catch(() =>
        setNotice({
          title: attachment.name,
          message:
            'This file could not be opened. You may need an app that can open this type of file, or the file is no longer on this device.',
        }),
      );
    }
  };

  const handleOpenAlbumItem = (message: Message, index: number) => {
    const attachment = message.attachment;
    if (attachment?.kind !== 'album') return;
    const item = attachment.items[index];
    if (item) navigation.navigate('MediaViewer', { uri: item.uri, kind: item.kind });
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
            group={group}
            subtitle={group ? `${memberCount} members` : undefined}
            onProfile={() => {
              if (group) navigation.navigate('GroupInfo', { conversationId });
              else navigation.navigate('ContactProfile', { conversationId });
            }}
          />
          <KeyboardAvoidingView behavior="padding" style={styles.flex}>
            {rows.length === 0 ? (
              <EmptyState title="No messages yet" message="Say hello to start the conversation." />
            ) : (
              <MessageList
                rows={rows}
                contactName={contactName}
                showSenders={group}
                onMessageLongPress={setMenu}
                onMessageOpen={handleOpen}
                onMessageOpenMedia={handleOpenAlbumItem}
                onMessageReply={startReply}
                canReply={!blocked}
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
              onAttach={(anchorY) => setAttachAnchor(anchorY)}
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
          onForward={handleForward}
          onCopy={handleCopy}
          onDelete={handleDelete}
        />
      ) : null}

      <AttachPanel
        visible={attachAnchor !== null}
        anchorY={attachAnchor ?? 0}
        onChoose={runAttachment}
        onSendMedia={sendRecent}
        onNeedMedia={needMedia}
        onClose={() => setAttachAnchor(null)}
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
