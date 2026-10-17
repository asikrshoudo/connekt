import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { AppText } from '../../components/ui/AppText';
import { UnreadBadge } from '../../components/ui/UnreadBadge';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { formatChatTime } from '../../utils/formatChatTime';
import type { ChatListItem } from './chatsState';

type Props = {
  item: ChatListItem;
  onPress: () => void;
  onLongPress: () => void;
  onTogglePin: () => void;
};

export function ConversationRow({ item, onPress, onLongPress, onTogglePin }: Props) {
  const colors = useColors();
  const { conversation, pinned } = item;
  const time = formatChatTime(conversation.lastMessageAt);
  const unread = conversation.unreadCount;

  const label = [
    conversation.name,
    unread > 0 ? `${unread} unread messages` : null,
    conversation.lastMessage,
    time,
    pinned ? 'pinned' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityActions={[{ name: 'togglePin', label: pinned ? 'Unpin chat' : 'Pin chat' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'togglePin') onTogglePin();
      }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surface }]}
    >
      <Avatar name={conversation.name} />
      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <View style={styles.topLine}>
          <AppText variant="headline" numberOfLines={1} style={styles.name}>
            {conversation.name}
          </AppText>
          {pinned ? <Ionicons name="pin" size={13} color={colors.textMuted} /> : null}
          <AppText variant="footnote" tone={unread > 0 ? 'primary' : 'muted'}>
            {time}
          </AppText>
        </View>
        <View style={styles.bottomLine}>
          <AppText variant="callout" tone="secondary" numberOfLines={2} style={styles.preview}>
            {conversation.lastMessage}
          </AppText>
          {unread > 0 ? <UnreadBadge count={unread} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingLeft: spacing.lg, alignItems: 'center' },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { flex: 1 },
  bottomLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  preview: { flex: 1 },
});
