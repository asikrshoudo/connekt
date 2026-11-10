import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { radius } from '../../core/theme/radius';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Message } from '../../types/chat';
import { countEmoji } from '../../utils/emoji';
import { AlbumBody } from './AlbumBody';
import { FileBody, LocationBody, MediaThumb, VoiceBody } from './AttachmentBodies';
import type { Rect, ReplyPreview } from './types';

const MAX_BIG_EMOJI = 3;
const EMOJI_SIZE: Record<number, number> = { 1: 52, 2: 40, 3: 32 };

type Props = {
  message: Message;
  reply: ReplyPreview | null;
  groupedWithPrevious?: boolean;
  onOpenMedia?: (index: number, rect: Rect) => void;
  onLongPress?: () => void;
};

type BubbleProps = {
  outgoing: boolean;
  groupedWithPrevious?: boolean;
  reply: ReplyPreview | null;
  children: ReactNode;
};

function Bubble({ outgoing, groupedWithPrevious, reply, children }: BubbleProps) {
  const colors = useColors();
  const textColor = outgoing ? colors.bubbleOutgoingText : colors.bubbleIncomingText;

  const bubbleRadius = outgoing
    ? {
        borderTopLeftRadius: radius.lg,
        borderBottomLeftRadius: radius.lg,
        borderTopRightRadius: groupedWithPrevious ? radius.xs : radius.lg,
        borderBottomRightRadius: radius.xs,
      }
    : {
        borderTopRightRadius: radius.lg,
        borderBottomRightRadius: radius.lg,
        borderTopLeftRadius: groupedWithPrevious ? radius.xs : radius.lg,
        borderBottomLeftRadius: radius.xs,
      };

  return (
    <View
      style={[
        styles.bubble,
        bubbleRadius,
        {
          backgroundColor: outgoing ? colors.bubbleOutgoing : colors.bubbleIncoming,
          borderColor: outgoing ? 'transparent' : colors.cardBorder,
          borderWidth: outgoing ? 0 : 1,
        },
      ]}
    >
      {reply ? (
        <View
          style={[
            styles.quote,
            {
              borderLeftColor: outgoing ? colors.onAccent : colors.accent,
              backgroundColor: outgoing ? 'rgba(255,255,255,0.12)' : colors.surfaceContainerHigh,
            },
          ]}
        >
          {reply.author ? (
            <AppText
              variant="captionSmall"
              style={[
                styles.author,
                { color: outgoing ? colors.onAccent : colors.accent },
              ]}
            >
              {reply.author}
            </AppText>
          ) : null}
          <AppText
            variant="footnote"
            numberOfLines={2}
            style={{ color: textColor, opacity: 0.88 }}
          >
            {reply.text}
          </AppText>
        </View>
      ) : null}
      {children}
    </View>
  );
}

export function MessageBody({
  message,
  reply,
  groupedWithPrevious = false,
  onOpenMedia,
  onLongPress,
}: Props) {
  const colors = useColors();
  const outgoing = message.direction === 'outgoing';
  const attachment = message.attachment;

  if (attachment?.kind === 'image' || attachment?.kind === 'video') {
    return <MediaThumb attachment={attachment} />;
  }

  if (attachment?.kind === 'album') {
    return <AlbumBody items={attachment.items} onOpen={onOpenMedia} onLongPress={onLongPress} />;
  }

  if (attachment) {
    return (
      <Bubble outgoing={outgoing} groupedWithPrevious={groupedWithPrevious} reply={reply}>
        {attachment.kind === 'voice' ? (
          <VoiceBody attachment={attachment} outgoing={outgoing} />
        ) : attachment.kind === 'file' ? (
          <FileBody attachment={attachment} outgoing={outgoing} />
        ) : (
          <LocationBody attachment={attachment} outgoing={outgoing} />
        )}
      </Bubble>
    );
  }

  const emojiCount = countEmoji(message.text);
  if (!reply && emojiCount >= 1 && emojiCount <= MAX_BIG_EMOJI) {
    const size = EMOJI_SIZE[emojiCount] ?? 32;
    return (
      <AppText style={{ fontSize: size, lineHeight: size * 1.3, includeFontPadding: false }}>
        {message.text}
      </AppText>
    );
  }

  return (
    <Bubble outgoing={outgoing} groupedWithPrevious={groupedWithPrevious} reply={reply}>
      <AppText
        variant="body"
        style={[
          styles.messageText,
          { color: outgoing ? colors.bubbleOutgoingText : colors.bubbleIncomingText },
        ]}
      >
        {message.text}
      </AppText>
    </Bubble>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  quote: {
    borderLeftWidth: 3,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 4,
    borderRadius: radius.xs,
    marginBottom: 6,
    gap: 1,
  },
  author: {
    fontWeight: '700',
  },
  messageText: {
    lineHeight: 21,
    fontSize: 15,
  },
});
