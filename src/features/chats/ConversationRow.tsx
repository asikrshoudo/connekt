import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { Avatar, type PresenceStatus } from '../../components/ui/Avatar';
import { UnreadBadge } from '../../components/ui/UnreadBadge';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { isGroup } from '../../utils/conversation';
import { formatChatTime } from '../../utils/formatChatTime';
import type { ChatListItem } from './chatsState';

type Props = {
  item: ChatListItem;
  onPress: () => void;
  onLongPress: (point: { x: number; y: number }) => void;
  onTogglePin?: () => void;
};

function getPresence(id: string): PresenceStatus {
  const sum = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  if (sum % 3 === 0) return 'online';
  if (sum % 3 === 1) return 'away';
  return 'offline';
}

export function ConversationRow({ item, onPress, onLongPress, onTogglePin }: Props) {
  const colors = useColors();
  const { conversation, pinned, muted, restricted } = item;
  const time = formatChatTime(conversation.lastMessageAt);
  const unread = conversation.unreadCount;
  const isGroupChat = isGroup(conversation);
  const presence = isGroupChat ? null : getPresence(conversation.id);

  const label = [
    conversation.name,
    unread > 0 ? `${unread} unread messages` : null,
    conversation.lastMessage,
    time,
    pinned ? 'pinned' : null,
    muted ? 'muted' : null,
    restricted ? 'restricted' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityActions={
        onTogglePin
          ? [{ name: 'togglePin', label: pinned ? 'Unpin chat' : 'Pin chat' }]
          : undefined
      }
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'togglePin') onTogglePin?.();
      }}
      onPress={onPress}
      onLongPress={(event) =>
        onLongPress({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
      }
      style={({ pressed }) => [
        styles.row,
        pinned && { backgroundColor: `${colors.accent}08` },
        pressed && { backgroundColor: colors.surfaceContainerHigh },
      ]}
    >
      {pinned ? (
        <View style={[styles.pinnedBar, { backgroundColor: colors.accent }]} />
      ) : null}

      <Avatar
        name={conversation.name}
        group={isGroupChat}
        presence={presence}
        size={50}
      />

      <View style={[styles.body, { borderBottomColor: colors.border }]}>
        <View style={styles.topLine}>
          <View style={styles.nameRow}>
            {isGroupChat ? (
              <Ionicons
                name="people"
                size={14}
                color={colors.accent}
                style={styles.channelIcon}
              />
            ) : null}
            <AppText variant="headline" numberOfLines={1} style={styles.name}>
              {conversation.name}
            </AppText>
          </View>

          <View style={styles.metaRow}>
            {pinned ? (
              <View style={[styles.statusIconBadge, { backgroundColor: colors.primaryContainer }]}>
                <Ionicons name="pin" size={11} color={colors.accent} />
              </View>
            ) : null}
            {muted ? (
              <Ionicons name="notifications-off" size={13} color={colors.textMuted} />
            ) : null}
            {restricted ? (
              <Ionicons name="eye-off" size={13} color={colors.textMuted} />
            ) : null}
            <AppText
              variant="caption"
              style={[
                styles.time,
                { color: unread > 0 ? colors.accent : colors.textMuted, fontWeight: unread > 0 ? '700' : '500' },
              ]}
            >
              {time}
            </AppText>
          </View>
        </View>

        <View style={styles.bottomLine}>
          <AppText
            variant="callout"
            numberOfLines={2}
            style={[
              styles.preview,
              {
                color: unread > 0 ? colors.textPrimary : colors.textSecondary,
                fontWeight: unread > 0 ? '500' : '400',
              },
            ]}
          >
            {conversation.lastMessage || 'No messages yet'}
          </AppText>
          {unread > 0 ? <UnreadBadge count={unread} muted={muted || restricted} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: spacing.lg,
    alignItems: 'center',
    position: 'relative',
    minHeight: 74,
  },
  pinnedBar: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 3.5,
    borderTopRightRadius: radius.xs,
    borderBottomRightRadius: radius.xs,
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelIcon: {
    marginRight: 2,
  },
  name: {
    flex: 1,
    fontWeight: '600',
    fontSize: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIconBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  time: {
    letterSpacing: 0.2,
  },
  bottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  preview: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 18,
  },
});
