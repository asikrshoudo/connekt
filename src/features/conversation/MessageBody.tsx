import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Message } from '../../types/chat';
import { countEmoji } from '../../utils/emoji';
import { AlbumBody } from './AlbumBody';
import { FileBody, LocationBody, MediaThumb, VoiceBody } from './AttachmentBodies';
import type { Rect, ReplyPreview } from './types';

const MAX_BIG_EMOJI = 3;
const EMOJI_SIZE: Record<number, number> = { 1: 56, 2: 44, 3: 36 };

type Props = {
  message: Message;
  reply: ReplyPreview | null;
  onOpenMedia?: (index: number, rect: Rect) => void;
  onLongPress?: () => void;
};

type BubbleProps = { outgoing: boolean; reply: ReplyPreview | null; children: ReactNode };

function Bubble({ outgoing, reply, children }: BubbleProps) {
  const colors = useColors();
  const textColor = outgoing ? colors.onAccent : colors.textPrimary;

  return (
    <View
      style={[
        styles.bubble,
        { backgroundColor: outgoing ? colors.bubbleOutgoing : colors.bubbleIncoming },
      ]}
    >
      {reply ? (
        <View
          style={[styles.quote, { borderLeftColor: outgoing ? colors.onAccent : colors.accent }]}
        >
          {reply.author ? (
            <AppText variant="footnote" style={[styles.author, { color: textColor }]}>
              {reply.author}
            </AppText>
          ) : null}
          <AppText variant="footnote" numberOfLines={2} style={{ color: textColor, opacity: 0.8 }}>
            {reply.text}
          </AppText>
        </View>
      ) : null}
      {children}
    </View>
  );
}

// The visual part of a message. Also used for the long-press menu preview.
export function MessageBody({ message, reply, onOpenMedia, onLongPress }: Props) {
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
      <Bubble outgoing={outgoing} reply={reply}>
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
    const size = EMOJI_SIZE[emojiCount] ?? 36;
    return (
      <AppText style={{ fontSize: size, lineHeight: size * 1.3, includeFontPadding: false }}>
        {message.text}
      </AppText>
    );
  }

  return (
    <Bubble outgoing={outgoing} reply={reply}>
      <AppText variant="callout" style={{ color: outgoing ? colors.onAccent : colors.textPrimary }}>
        {message.text}
      </AppText>
    </Bubble>
  );
}

const styles = StyleSheet.create({
  bubble: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  quote: { borderLeftWidth: 2, paddingLeft: 8, marginBottom: 6, gap: 1 },
  author: { fontWeight: '600' },
});
