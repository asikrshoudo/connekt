import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { Avatar } from '../../../components/ui/Avatar';
import { radius } from '../../../core/theme/radius';
import { spacing } from '../../../core/theme/spacing';
import { useColors } from '../../../core/theme/ThemeProvider';

export function FirstImpressionScene() {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {/* Central Myth Workspace Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        {/* Workspace Header */}
        <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
          <View style={[styles.orgBadge, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="sparkles" size={15} color={colors.accent} />
          </View>
          <View style={styles.orgInfo}>
            <AppText variant="headline" numberOfLines={1}>
              Myth Workspace
            </AppText>
            <AppText variant="captionSmall" tone="secondary">
              Product & Design Hub
            </AppText>
          </View>
          <View style={styles.statusPill}>
            <View style={[styles.dot, { backgroundColor: colors.presenceOnline }]} />
            <AppText variant="captionSmall" style={{ color: colors.presenceOnline, fontWeight: '700' }}>
              LIVE
            </AppText>
          </View>
        </View>

        {/* Live Team Collaboration Block */}
        <View style={styles.activeProjectBlock}>
          <View style={styles.projectHeader}>
            <Ionicons name="git-branch-outline" size={16} color={colors.accent} />
            <AppText variant="subhead" style={styles.projectTitle}>
              Q4 Release & Platform Redesign
            </AppText>
          </View>
          <AppText variant="caption" tone="secondary" style={styles.projectDesc}>
            Team shipped 18 new UI components and live presence system.
          </AppText>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: '84%', backgroundColor: colors.accent },
              ]}
            />
          </View>
          <View style={styles.progressMeta}>
            <AppText variant="captionSmall" tone="muted">
              Sprint Progress
            </AppText>
            <AppText variant="captionSmall" style={{ color: colors.accent, fontWeight: '700' }}>
              84% Completed
            </AppText>
          </View>
        </View>

        {/* Live Activity Row */}
        <View
          style={[
            styles.activityRow,
            {
              backgroundColor: colors.surfaceContainer,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.avatarStack}>
            <Avatar name="Sarah Chen" size={28} />
            <Avatar name="Alex Rivera" size={28} style={{ marginLeft: -8 }} />
            <Avatar name="Marcus Reed" size={28} style={{ marginLeft: -8 }} />
          </View>
          <View style={styles.activityText}>
            <AppText variant="caption" numberOfLines={1}>
              <AppText variant="caption" style={{ fontWeight: '700' }}>3 team members</AppText> active in #design-core
            </AppText>
          </View>
          <View style={[styles.activeBadge, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="chatbubbles" size={13} color={colors.accent} />
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
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
    elevation: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  orgBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgInfo: {
    flex: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeProjectBlock: {
    gap: 6,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  projectTitle: {
    fontWeight: '700',
  },
  projectDesc: {
    lineHeight: 16,
  },
  progressTrack: {
    height: 5,
    width: '100%',
    borderRadius: 3,
    backgroundColor: 'rgba(150, 160, 185, 0.18)',
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityText: {
    flex: 1,
  },
  activeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
