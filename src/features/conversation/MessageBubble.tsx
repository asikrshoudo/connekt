import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import type { Message } from '../../types/chat';
import { formatClockTime } from '../../utils/dates';

type Props = {
  message: Message;
  groupedWithPrevious: boolean;
  showTime: boolean;
};

export function MessageBubble({ message, groupedWithPrevious, showTime }: Props) {
  const colors = useColors();
  const outgoing = message.direction === 'outgoing';

  return (
    <View
      style={[
        styles.row,
        outgoing ? styles.rowOutgoing : styles.rowIncoming,
        { marginTop: groupedWithPrevious ? 2 : spacing.md },
      ]}
    >
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
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  time: { marginTop: spacing.xs, marginHorizontal: spacing.xs },
});
