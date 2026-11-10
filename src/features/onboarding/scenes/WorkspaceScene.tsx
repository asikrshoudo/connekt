import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { radius } from '../../../core/theme/radius';
import { spacing } from '../../../core/theme/spacing';
import { useColors } from '../../../core/theme/ThemeProvider';

type ChannelItem = { name: string; unread?: number; active?: boolean; isPrivate?: boolean };

const TEAMS: { team: string; icon: string; channels: ChannelItem[] }[] = [
  {
    team: 'Product & Engineering',
    icon: 'code-slash',
    channels: [
      { name: 'mobile-core', active: true, unread: 3 },
      { name: 'releases', isPrivate: true },
    ],
  },
  {
    team: 'Design & Research',
    icon: 'color-palette',
    channels: [
      { name: 'design-system', unread: 1 },
      { name: 'user-feedback' },
    ],
  },
  {
    team: 'Operations & Strategy',
    icon: 'briefcase',
    channels: [{ name: 'announcements' }],
  },
];

export function WorkspaceScene() {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        {/* Workspace Banner */}
        <View style={[styles.orgBar, { borderBottomColor: colors.border }]}>
          <View style={[styles.orgLogo, { backgroundColor: colors.accent }]}>
            <AppText variant="headline" style={{ color: colors.onAccent, fontWeight: '800' }}>
              M
            </AppText>
          </View>
          <View style={styles.orgDetails}>
            <AppText variant="headline" style={styles.orgName}>
              Acme Engineering
            </AppText>
            <AppText variant="captionSmall" tone="secondary">
              3 Departments · 28 Members
            </AppText>
          </View>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </View>

        {/* Team & Channel Hierarchy */}
        <View style={styles.teamsList}>
          {TEAMS.map((item) => (
            <View key={item.team} style={styles.teamSection}>
              <View style={styles.teamHeader}>
                <Ionicons name={item.icon as any} size={13} color={colors.accent} />
                <AppText variant="captionSmall" style={[styles.teamTitle, { color: colors.textSecondary }]}>
                  {item.team.toUpperCase()}
                </AppText>
              </View>

              <View style={styles.channelsList}>
                {item.channels.map((ch) => (
                  <View
                    key={ch.name}
                    style={[
                      styles.channelRow,
                      ch.active && {
                        backgroundColor: colors.chipActiveBackground,
                      },
                    ]}
                  >
                    <Ionicons
                      name={ch.isPrivate ? 'lock-closed' : 'chatbubble'}
                      size={13}
                      color={ch.active ? colors.accent : colors.textMuted}
                    />
                    <AppText
                      variant="callout"
                      style={[
                        styles.channelText,
                        {
                          color: ch.active ? colors.accent : colors.textPrimary,
                          fontWeight: ch.active ? '700' : '400',
                        },
                      ]}
                    >
                      {ch.name}
                    </AppText>

                    {ch.unread ? (
                      <View style={[styles.unreadBadge, { backgroundColor: colors.accent }]}>
                        <AppText variant="captionSmall" style={{ color: colors.onAccent, fontWeight: '700' }}>
                          {ch.unread}
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ))}
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
  card: {
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
  orgBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  orgLogo: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgDetails: {
    flex: 1,
  },
  orgName: {
    fontWeight: '700',
  },
  teamsList: {
    padding: spacing.md,
    gap: spacing.md,
  },
  teamSection: {
    gap: 4,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
    marginBottom: 2,
  },
  teamTitle: {
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  channelsList: {
    gap: 2,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.md,
    gap: 8,
  },
  channelText: {
    flex: 1,
    fontSize: 14,
  },
  unreadBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 18,
    alignItems: 'center',
  },
});
