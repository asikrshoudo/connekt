import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { ConnectedTeamsScene } from './scenes/ConnectedTeamsScene';
import { ConversationsScene } from './scenes/ConversationsScene';
import { FirstImpressionScene } from './scenes/FirstImpressionScene';
import { GetStartedScene } from './scenes/GetStartedScene';
import { WorkspaceScene } from './scenes/WorkspaceScene';

const COMPLETED_KEY = 'myth.onboarding.complete.v1';
const LEGACY_PROFILE_KEY = 'connekt.profile.v1';
const LEGACY_IDENTITY_KEY = 'connekt.identity.v1';

const scenes = [
  {
    eyebrow: 'WELCOME TO MYTH',
    title: 'Work moves better together.',
    description:
      "One connected workspace for your team's conversations, collaboration, and everyday work.",
    Component: FirstImpressionScene,
  },
  {
    eyebrow: 'CONVERSATIONS',
    title: 'Every conversation, in context.',
    description:
      'Bring project updates, direct messages, and team conversations into one clear space.',
    Component: ConversationsScene,
  },
  {
    eyebrow: 'YOUR WORKSPACE',
    title: 'Organized for the way you work.',
    description:
      'Dedicated channels, cross-functional teams, and direct messages keep everyone aligned.',
    Component: WorkspaceScene,
  },
  {
    eyebrow: 'CONNECTED TEAMS',
    title: 'Where teams stay in sync.',
    description:
      'Real-time presence, voice huddles, and quick file sharing without context switching.',
    Component: ConnectedTeamsScene,
  },
  {
    eyebrow: 'GET STARTED',
    title: 'Your team. One workspace.',
    description:
      'Join modern teams collaborating with speed, focus, and clarity.',
    Component: GetStartedScene,
  },
] as const;

type Props = { children: ReactNode };
type GateState = 'loading' | 'onboarding' | 'app' | 'error';

async function resolveGateState(): Promise<'onboarding' | 'app'> {
  const [[, complete], [, profile], [, identity]] = await AsyncStorage.multiGet([
    COMPLETED_KEY,
    LEGACY_PROFILE_KEY,
    LEGACY_IDENTITY_KEY,
  ]);
  return complete === '1' || profile !== null || identity !== null ? 'app' : 'onboarding';
}

export function OnboardingGate({ children }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [gate, setGate] = useState<GateState>('loading');
  const [scene, setScene] = useState(0);
  const [fade] = useState(() => new Animated.Value(0));
  const [rise] = useState(() => new Animated.Value(12));

  const loadCompletion = useCallback(async () => {
    setGate('loading');
    try {
      setGate(await resolveGateState());
    } catch {
      setGate('error');
    }
  }, []);

  useEffect(() => {
    let active = true;
    resolveGateState()
      .then((next) => {
        if (active) setGate(next);
      })
      .catch(() => {
        if (active) setGate('error');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (gate !== 'onboarding') return;
    fade.setValue(0);
    rise.setValue(12);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start();
  }, [fade, gate, rise, scene]);

  const finish = async () => {
    try {
      await AsyncStorage.setItem(COMPLETED_KEY, '1');
      setGate('app');
    } catch {
      Alert.alert(
        'Could not save your choice',
        'Myth could not save onboarding on this device. Please try again.',
      );
    }
  };

  if (gate === 'app') return children;

  if (gate === 'loading' || gate === 'error') {
    return (
      <View style={[styles.startup, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={[styles.mark, { backgroundColor: colors.accent }]}>
          <AppText style={{ color: colors.onAccent, fontWeight: '800', fontSize: 24 }}>M</AppText>
        </View>
        {gate === 'error' ? (
          <>
            <AppText variant="headline">Could not load Myth</AppText>
            <AppText tone="secondary" style={styles.startupMessage}>
              Your onboarding preference could not be read from this device.
            </AppText>
            <Pressable accessibilityRole="button" onPress={() => void loadCompletion()}>
              <AppText variant="headline" style={{ color: colors.accent }}>
                Try again
              </AppText>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setGate('app')}>
              <AppText tone="muted" style={styles.continueOnce}>
                Continue once without saving
              </AppText>
            </Pressable>
          </>
        ) : null}
      </View>
    );
  }

  const current = scenes[scene];
  const isLast = scene === scenes.length - 1;
  const SceneComponent = current.Component;

  const onContinue = () => {
    if (isLast) void finish();
    else setScene((value) => value + 1);
  };

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 8,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      {/* Top Header / Progress Track */}
      <View style={styles.top}>
        <View accessibilityLabel={`Step ${scene + 1} of ${scenes.length}`} style={styles.progress}>
          {scenes.map((item, index) => (
            <View
              key={item.eyebrow}
              style={[
                styles.progressTrack,
                {
                  backgroundColor: index <= scene ? colors.accent : colors.surfaceContainerHigh,
                },
              ]}
            />
          ))}
        </View>

        {!isLast ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            hitSlop={12}
            onPress={() => void finish()}
            style={styles.skip}
          >
            <AppText variant="footnote" style={{ color: colors.textSecondary, fontWeight: '600' }}>
              Skip
            </AppText>
          </Pressable>
        ) : null}
      </View>

      {/* Animated Scene Content */}
      <Animated.View style={[styles.scene, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <ScrollView
          contentContainerStyle={styles.sceneContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Visual Composition */}
          <View style={styles.artwork}>
            <SceneComponent />
          </View>

          {/* Copy Block */}
          <View style={styles.copy}>
            <View style={[styles.eyebrowBadge, { backgroundColor: colors.primaryContainer }]}>
              <AppText
                variant="captionSmall"
                style={[styles.eyebrow, { color: colors.accent }]}
              >
                {current.eyebrow}
              </AppText>
            </View>
            <AppText variant="largeTitle" style={styles.title}>
              {current.title}
            </AppText>
            <AppText variant="body" tone="secondary" style={styles.description}>
              {current.description}
            </AppText>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          {isLast ? (
            <View style={styles.finalActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create an account"
                onPress={() => showAuthNotice('account')}
                style={({ pressed }) => [
                  styles.primaryAction,
                  { backgroundColor: colors.accent },
                  pressed && styles.pressed,
                ]}
              >
                <AppText variant="headline" style={{ color: colors.onAccent, fontWeight: '700' }}>
                  Create an account
                </AppText>
                <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Sign in"
                onPress={() => showAuthNotice('sign in')}
                style={({ pressed }) => [
                  styles.secondaryAction,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <AppText variant="headline" style={{ color: colors.textPrimary, fontWeight: '600' }}>
                  Sign in
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Explore the preview"
                onPress={onContinue}
                style={styles.exploreBtn}
              >
                <AppText variant="footnote" tone="secondary" style={styles.exploreText}>
                  Explore the preview workspace →
                </AppText>
              </Pressable>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue"
              onPress={onContinue}
              style={({ pressed }) => [
                styles.primaryAction,
                { backgroundColor: colors.accent },
                pressed && styles.pressed,
              ]}
            >
              <AppText variant="headline" style={{ color: colors.onAccent, fontWeight: '700' }}>
                Continue
              </AppText>
              <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
            </Pressable>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

function showAuthNotice(action: 'sign in' | 'account') {
  Alert.alert(
    action === 'sign in' ? 'Sign in is coming soon' : 'Account creation is coming soon',
    'Myth currently operates in local workspace mode. Real backend cloud authentication will be available in an upcoming release.',
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  top: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  progressTrack: {
    height: 3.5,
    flex: 1,
    borderRadius: radius.pill,
  },
  skip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scene: {
    flex: 1,
  },
  sceneContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  artwork: {
    minHeight: 290,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: spacing.sm,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  eyebrowBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  eyebrow: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  description: {
    lineHeight: 22,
    maxWidth: 380,
  },
  footer: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  finalActions: {
    gap: spacing.sm,
  },
  primaryAction: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  secondaryAction: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  exploreBtn: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreText: {
    fontWeight: '600',
  },
  startup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  startupMessage: {
    textAlign: 'center',
    maxWidth: 300,
  },
  continueOnce: {
    paddingTop: spacing.sm,
  },
  mark: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
