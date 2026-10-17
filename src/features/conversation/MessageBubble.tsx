import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Message } from '../../types/chat';
import { formatClockTime } from '../../utils/dates';
import { countEmoji } from '../../utils/emoji';

// A message newer than this plays the entrance animation when it first appears.
const FRESH_MS = 1000;
const MAX_BIG_EMOJI = 3;
const EMOJI_SIZE: Record<number, number> = { 1: 56, 2: 44, 3: 36 };

const popIn = new Keyframe({
  from: { opacity: 0, transform: [{ translateY: 36 }, { scale: 0.86 }] },
  to: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
    easing: Easing.out(Easing.exp),
  },
}).duration(340);

type Props = {
  message: Message;
  groupedWithPrevious: boolean;
  showTime: boolean;
};

export function MessageBubble({ message, groupedWithPrevious, showTime }: Props) {
  const colors = useColors();
  const outgoing = message.direction === 'outgoing';
  const emojiCount = countEmoji(message.text);
  const emojiOnly = emojiCount >= 1 && emojiCount <= MAX_BIG_EMOJI;
  const fresh = Date.now() - message.sentAt < FRESH_MS;
  const emojiSize = EMOJI_SIZE[emojiCount] ?? 36;

  return (
    <Animated.View
      entering={fresh ? popIn : undefined}
      style={[
        styles.row,
        outgoing ? styles.rowOutgoing : styles.rowIncoming,
        {
          marginTop: groupedWithPrevious ? 2 : spacing.md,
          transformOrigin: outgoing ? 'right bottom' : 'left bottom',
        },
      ]}
    >
      {emojiOnly ? (
        <AppText
          style={{
            fontSize: emojiSize,
            lineHeight: emojiSize * 1.3,
            includeFontPadding: false,
          }}
        >
          {message.text}
        </AppText>
      ) : (
        <View
          style={[
            styles.bubble,
            { backgroundColor: outgoing ? colors.bubbleOutgoing : colors.bubbleIncoming },
          ]}
        >
          <AppText
            variant="callout"
            style={{ color: outgoing ? colors.onAccent : colors.textPrimary }}
          >
            {message.text}
          </AppText>
        </View>
      )}
      {showTime ? (
        <AppText variant="caption" tone="muted" style={styles.time}>
          {formatClockTime(message.sentAt)}
        </AppText>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.lg },
  rowOutgoing: { alignItems: 'flex-end' },
  rowIncoming: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  time: { marginTop: spacing.xs, marginHorizontal: spacing.xs },
});
