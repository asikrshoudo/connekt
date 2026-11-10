import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { Avatar } from '../../../components/ui/Avatar';
import { radius } from '../../../core/theme/radius';
import { spacing } from '../../../core/theme/spacing';
import { useColors } from '../../../core/theme/ThemeProvider';

export function ConversationsScene() {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.window,
          {
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        {/* Channel Header */}
        <View style={[styles.channelHeader, { borderBottomColor: colors.border }]}>
          <View style={[styles.channelIcon, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="chatbubbles" size={14} color={colors.accent} />
          </View>
          <View style={styles.channelMeta}>
            <AppText variant="headline" style={styles.channelName}>
              #product-redesign
            </AppText>
            <AppText variant="captionSmall" tone="secondary">
              12 team members active
            </AppText>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.surfaceContainer }]}>
            <AppText variant="captionSmall" style={{ color: colors.accent, fontWeight: '700' }}>
              PUBLIC
            </AppText>
          </View>
        </View>

        {/* Message Stream */}
        <View style={styles.messages}>
          {/* Incoming Message 1 */}
          <View style={styles.incomingGroup}>
            <Avatar name="Sarah Chen" size={32} presence="online" />
            <View style={styles.bubbleCol}>
              <View style={styles.senderHeader}>
                <AppText variant="captionSmall" style={styles.senderName}>
                  Sarah Chen
                </AppText>
                <AppText variant="captionSmall" tone="muted">
                  10:42 AM
                </AppText>
              </View>
              <View
                style={[
                  styles.incomingBubble,
                  {
                    backgroundColor: colors.bubbleIncoming,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <AppText variant="callout" style={{ color: colors.bubbleIncomingText }}>
                  Final design tokens for Myth v2 are ready. We aligned on high-contrast surfaces! 🎨
                </AppText>
              </View>
            </View>
          </View>

          {/* Outgoing Message with Reply */}
          <View style={styles.outgoingGroup}>
            <View style={styles.bubbleColRight}>
              <View
                style={[
                  styles.outgoingBubble,
                  {
                    backgroundColor: colors.bubbleOutgoing,
                  },
                ]}
              >
                {/* Embedded Reply Preview */}
                <View
                  style={[
                    styles.replyQuote,
                    {
                      borderLeftColor: colors.onAccent,
                      backgroundColor: 'rgba(255, 255, 255, 0.14)',
                    },
                  ]}
                >
                  <AppText variant="captionSmall" style={{ color: colors.onAccent, fontWeight: '700' }}>
                    Sarah Chen
                  </AppText>
                  <AppText
                    variant="caption"
                    numberOfLines={1}
                    style={{ color: colors.onAccent, opacity: 0.85 }}
                  >
                    Final design tokens for Myth v2 are ready...
                  </AppText>
                </View>
                <AppText variant="callout" style={{ color: colors.bubbleOutgoingText }}>
                  Reviewing now! Spacing and typography hierarchy look exceptional.
                </AppText>
              </View>

              <View style={styles.outgoingMeta}>
                <AppText variant="captionSmall" tone="muted">
                  10:44 AM
                </AppText>
                <Ionicons name="checkmark-done" size={13} color={colors.accent} />
              </View>
            </View>
          </View>

          {/* Reaction Bar Pill */}
          <View
            style={[
              styles.reactionPill,
              {
                backgroundColor: colors.surfaceContainerHigh,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <AppText style={styles.reactionText}>🚀 4   👏 2   ✨ 6</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  window: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  channelIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelMeta: {
    flex: 1,
  },
  channelName: {
    fontWeight: '700',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  messages: {
    padding: spacing.md,
    gap: spacing.md,
  },
  incomingGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  bubbleCol: {
    flex: 1,
    gap: 3,
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  senderName: {
    fontWeight: '700',
  },
  incomingBubble: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderTopLeftRadius: radius.xs,
    borderWidth: 1,
  },
  outgoingGroup: {
    alignItems: 'flex-end',
    width: '100%',
  },
  bubbleColRight: {
    maxWidth: '86%',
    alignItems: 'flex-end',
    gap: 3,
  },
  outgoingBubble: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderBottomRightRadius: radius.xs,
    gap: 6,
  },
  replyQuote: {
    borderLeftWidth: 3,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  outgoingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 2,
  },
  reactionPill: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginTop: -8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  reactionText: {
    fontSize: 12,
  },
});
