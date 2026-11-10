import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/ui/AppText';
import { radius } from '../../../core/theme/radius';
import { spacing } from '../../../core/theme/spacing';
import { useColors } from '../../../core/theme/ThemeProvider';

export function GetStartedScene() {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        {/* Ambient Ring */}
        <View
          style={[
            styles.glowRing,
            {
              borderColor: `${colors.accent}20`,
            },
          ]}
        />
        <View
          style={[
            styles.glowRingInner,
            {
              borderColor: `${colors.accent}40`,
            },
          ]}
        />

        {/* Central Myth Emblem */}
        <View
          style={[
            styles.emblem,
            {
              backgroundColor: colors.accent,
              shadowColor: colors.accent,
            },
          ]}
        >
          <AppText style={styles.emblemText}>M</AppText>
        </View>
      </View>

      {/* Feature Highlights Grid */}
      <View style={styles.badgesContainer}>
        {[
          { icon: 'shield-checkmark', title: 'Privacy First', desc: 'Secure local storage' },
          { icon: 'flash', title: 'Instant Speed', desc: 'Real-time performance' },
          { icon: 'people', title: 'Team Sync', desc: 'One connected hub' },
        ].map((feature) => (
          <View
            key={feature.title}
            style={[
              styles.featureBadge,
              {
                backgroundColor: colors.surfaceContainer,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Ionicons name={feature.icon as any} size={15} color={colors.accent} />
            <View style={styles.badgeTextCol}>
              <AppText variant="captionSmall" style={[styles.badgeTitle, { color: colors.textPrimary }]}>
                {feature.title}
              </AppText>
              <AppText variant="captionSmall" tone="secondary">
                {feature.desc}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  brandContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 1.5,
  },
  glowRingInner: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 1,
  },
  emblem: {
    width: 80,
    height: 80,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  emblemText: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '800',
    includeFontPadding: false,
    letterSpacing: -1,
  },
  badgesContainer: {
    width: '100%',
    maxWidth: 340,
    gap: spacing.xs + 2,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  badgeTextCol: {
    flex: 1,
  },
  badgeTitle: {
    fontWeight: '700',
  },
});
