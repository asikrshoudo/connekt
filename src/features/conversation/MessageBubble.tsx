import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Message } from '../../types/chat';
import { formatClockTime } from '../../utils/dates';
import { messagePreview } from '../../utils/messagePreview';
import type { ReplyRef } from './buildTimeline';
import { MessageBody } from './MessageBody';
import type { MessageMenuTarget, Rect, ReplyPreview } from './types';

type Props = {
  message: Message;
  reply: ReplyRef | null;
  contactName: string;
  showSender: boolean;
  groupedWithPrevious: boolean;
  showTime: boolean;
  onLongPress: (target: MessageMenuTarget) => void;
  onOpen: (message: Message, rect: Rect) => void;
  onOpenMedia: (message: Message, index: number, rect: Rect) => void;
};

function toPreview(reply: ReplyRef | null, contactName: string): ReplyPreview | null {
  if (!reply) return null;
  if ('missing' in reply) return { author: '', text: 'Original message unavailable' };
  return {
    author: reply.direction === 'outgoing' ? 'You' : (reply.author ?? contactName),
    text: reply.text,
  };
}

export function MessageBubble({
  message,
  reply,
  contactName,
  showSender,
  groupedWithPrevious,
  showTime,
  onLongPress,
  onOpen,
  onOpenMedia,
}: Props) {
  const colors = useColors();
  const ref = useRef<ComponentRef<typeof View>>(null);
  const outgoing = message.direction === 'outgoing';
  const preview = toPreview(reply, contactName);

  const handleLongPress = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      onLongPress({ message, rect: { x, y, width, height }, reply: preview });
    });
  };

  // A single photo or video opens from where it sits in the chat.
  const handleOpen = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      onOpen(message, { x, y, width, height });
    });
  };

  return (
    <View
      style={[
        styles.row,
        outgoing ? styles.rowOutgoing : styles.rowIncoming,
        { marginTop: groupedWithPrevious ? 2 : spacing.md },
      ]}
    >
      {showSender && !outgoing && message.senderName ? (
        <AppText variant="footnote" tone="secondary" style={styles.sender}>
          {message.senderName}
        </AppText>
      ) : null}
      {message.forwarded ? (
        <View style={styles.forwarded}>
          <Ionicons name="arrow-redo" size={12} color={colors.textMuted} />
          <AppText variant="caption" tone="muted">
            Forwarded
          </AppText>
        </View>
      ) : null}
      <Pressable
        ref={ref}
        collapsable={false}
        onPress={
          message.attachment && message.attachment.kind !== 'album' ? handleOpen : undefined
        }
        onLongPress={handleLongPress}
        delayLongPress={250}
        accessibilityLabel={`${message.forwarded ? 'Forwarded. ' : ''}${outgoing ? 'You' : (message.senderName ?? contactName)}: ${messagePreview(message)}`}
        accessibilityHint="Double tap and hold for options"
        style={styles.pressable}
      >
        <MessageBody
          message={message}
          reply={preview}
          onOpenMedia={(index, rect) => onOpenMedia(message, index, rect)}
          onLongPress={handleLongPress}
        />
      </Pressable>
      {message.reaction ? (
        <View
          style={[
            styles.reaction,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.background },
          ]}
        >
          <Text style={styles.reactionEmoji}>{message.reaction}</Text>
        </View>
      ) : null}
      {showTime ? (
        <AppText variant="caption" tone="muted" style={styles.time}>
          {formatClockTime(message.sentAt)}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.lg },
  rowOutgoing: { alignItems: 'flex-end' },
  rowIncoming: { alignItems: 'flex-start' },
  pressable: { maxWidth: '78%' },
  sender: { marginBottom: 2, marginHorizontal: spacing.sm },
  forwarded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
    marginHorizontal: spacing.sm,
  },
  reaction: {
    marginTop: -8,
    marginHorizontal: spacing.sm,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionEmoji: { fontSize: 13, lineHeight: 16, includeFontPadding: false },
  time: { marginTop: spacing.xs, marginHorizontal: spacing.xs },
});
