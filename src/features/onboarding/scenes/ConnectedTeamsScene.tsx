import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { Avatar } from '../../../components/ui/Avatar';
import { radius } from '../../../core/theme/radius';
import { spacing } from '../../../core/theme/spacing';
import { useColors } from '../../../core/theme/ThemeProvider';

export function ConnectedTeamsScene() {
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
        {/* Huddle Header */}
        <View style={[styles.huddleHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.liveIndicator}>
            <View style={[styles.pulseDot, { backgroundColor: colors.presenceOnline }]} />
            <AppText variant="captionSmall" style={{ color: colors.presenceOnline, fontWeight: '700' }}>
              LIVE HUDDLE
            </AppText>
          </View>
          <AppText variant="headline" style={styles.huddleTitle}>
            Design & Architecture Sync
          </AppText>
          <AppText variant="captionSmall" tone="secondary">
            3 team members connected
          </AppText>
        </View>

        {/* Participant Cards Grid */}
        <View style={styles.participantsGrid}>
          {/* Participant 1 - Speaking */}
          <View
            style={[
              styles.participantTile,
              styles.activeSpeakerTile,
              {
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.accent,
              },
            ]}
          >
            <Avatar name="Marcus Reed" size={42} presence="online" />
            <View style={styles.participantMeta}>
              <AppText variant="subhead" numberOfLines={1}>
                Marcus Reed
              </AppText>
              <AppText variant="captionSmall" tone="secondary">
                Lead Architect
              </AppText>
            </View>
            <View style={[styles.speakerBadge, { backgroundColor: colors.accent }]}>
              <Ionicons name="volume-high" size={12} color={colors.onAccent} />
              <AppText variant="captionSmall" style={{ color: colors.onAccent, fontWeight: '700' }}>
                Speaking
              </AppText>
            </View>
          </View>

          {/* Participant 2 */}
          <View
            style={[
              styles.participantTile,
              {
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Avatar name="Sarah Chen" size={42} presence="online" />
            <View style={styles.participantMeta}>
              <AppText variant="subhead" numberOfLines={1}>
                Sarah Chen
              </AppText>
              <AppText variant="captionSmall" tone="secondary">
                Principal Designer
              </AppText>
            </View>
            <View style={styles.micStatus}>
              <Ionicons name="mic" size={15} color={colors.textSecondary} />
            </View>
          </View>

          {/* Participant 3 */}
          <View
            style={[
              styles.participantTile,
              {
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Avatar name="Alex Rivera" size={42} presence="online" />
            <View style={styles.participantMeta}>
              <AppText variant="subhead" numberOfLines={1}>
                Alex Rivera
              </AppText>
              <AppText variant="captionSmall" tone="secondary">
                Mobile Engineer
              </AppText>
            </View>
            <View style={styles.micStatus}>
              <Ionicons name="mic-off" size={15} color={colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Huddle Action Controls Bar */}
        <View style={[styles.controlsBar, { backgroundColor: colors.surfaceContainerHigh }]}>
          <View style={[styles.controlBtn, { backgroundColor: colors.accent }]}>
            <Ionicons name="mic" size={17} color={colors.onAccent} />
          </View>
          <View style={[styles.controlBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="videocam-outline" size={17} color={colors.textPrimary} />
          </View>
          <View style={[styles.controlBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="desktop-outline" size={17} color={colors.textPrimary} />
          </View>
          <View style={[styles.controlBtn, { backgroundColor: `${colors.destructive}20` }]}>
            <Ionicons name="call" size={17} color={colors.destructive} />
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
  huddleHeader: {
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    gap: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  huddleTitle: {
    fontWeight: '700',
  },
  participantsGrid: {
    gap: spacing.sm,
  },
  participantTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  activeSpeakerTile: {
    borderWidth: 1.5,
  },
  participantMeta: {
    flex: 1,
    gap: 1,
  },
  speakerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  micStatus: {
    padding: 6,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
