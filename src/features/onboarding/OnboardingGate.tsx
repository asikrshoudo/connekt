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
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import { useColors } from '../../core/theme/ThemeProvider';

const COMPLETED_KEY = 'myth.onboarding.complete.v1';
const LEGACY_PROFILE_KEY = 'connekt.profile.v1';
const LEGACY_IDENTITY_KEY = 'connekt.identity.v1';

const scenes = [
  {
    eyebrow: 'WELCOME TO MYTH',
    title: 'Communication, built for work.',
    description: 'A better space for teams to communicate, collaborate, and move forward together.',
  },
  {
    eyebrow: 'MEET',
    title: 'Every conversation, in context.',
    description: 'Bring project updates, direct messages, and team conversations into one clear space.',
  },
  {
    eyebrow: 'STAY CONNECTED',
    title: 'Work moves better together.',
    description: 'Keep teams close with conversations that make room for voice, video, and collaboration.',
  },
  {
    eyebrow: 'YOUR ORGANIZATION, CONNECTED',
    title: 'One workspace. Every conversation that matters.',
    description: 'Give people across teams and locations a shared place to make progress.',
  },
  {
    eyebrow: 'BUILT FOR TEAMS',
    title: 'Myth',
    description: 'Built for teams. Designed for work.',
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
  const [rise] = useState(() => new Animated.Value(10));

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
    rise.setValue(10);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 260, useNativeDriver: true }),
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
        <MythMark />
        {gate === 'error' ? (
          <>
            <AppText variant="headline">Could not load Myth</AppText>
            <AppText tone="secondary" style={styles.startupMessage}>
              Your onboarding preference could not be read from this device.
            </AppText>
            <Pressable accessibilityRole="button" onPress={() => void loadCompletion()}>
              <AppText variant="headline" style={{ color: colors.accent }}>Try again</AppText>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setGate('app')}>
              <AppText tone="muted" style={styles.continueOnce}>Continue once without saving</AppText>
            </Pressable>
          </>
        ) : null}
      </View>
    );
  }

  const current = scenes[scene];
  const isLast = scene === scenes.length - 1;
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
          paddingTop: insets.top + 10,
          paddingBottom: Math.max(insets.bottom, 18),
        },
      ]}
    >
      <View style={styles.top}>
        <View accessibilityLabel={`Onboarding ${scene + 1} of ${scenes.length}`} style={styles.progress}>
          {scenes.map((item, index) => (
            <View
              key={item.eyebrow}
              style={[
                styles.progressTrack,
                { backgroundColor: index <= scene ? colors.accent : colors.surfaceElevated },
              ]}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Explore Myth' : 'Skip onboarding'}
          hitSlop={12}
          onPress={() => void finish()}
          style={styles.skip}
        >
          <AppText variant="callout" tone="secondary">{isLast ? 'Explore' : 'Skip'}</AppText>
        </Pressable>
      </View>

      <Animated.View style={[styles.scene, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <ScrollView
          contentContainerStyle={styles.sceneContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.artwork}>
            <SceneArt index={scene} />
          </View>
          <View style={styles.copy}>
            <AppText variant="caption" style={[styles.eyebrow, { color: colors.accent }]}>
              {current.eyebrow}
            </AppText>
            <AppText variant={isLast ? 'largeTitle' : 'title'} style={styles.title}>
              {current.title}
            </AppText>
            <AppText variant="callout" tone="secondary" style={styles.description}>
              {current.description}
            </AppText>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {isLast ? (
            <>
              <ActionButton label="Sign in" onPress={() => showAuthNotice('sign in')} primary />
              <ActionButton label="Create account" onPress={() => showAuthNotice('account')} />
              <Pressable
                accessibilityRole="button"
                onPress={onContinue}
                style={styles.explore}
              >
                <AppText variant="footnote" tone="muted">Explore the local preview</AppText>
              </Pressable>
            </>
          ) : (
            <ActionButton label="Continue" onPress={onContinue} primary />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

function showAuthNotice(action: 'sign in' | 'account') {
  Alert.alert(
    action === 'sign in' ? 'Sign in is not connected yet' : 'Account creation is not connected yet',
    'No account or session was created. Authentication will be available when Myth is connected to its identity service.',
  );
}

function ActionButton({
  label,
  onPress,
  primary = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        {
          backgroundColor: primary ? colors.accent : colors.surface,
          borderColor: primary ? colors.accent : colors.border,
          opacity: pressed ? 0.84 : 1,
        },
      ]}
    >
      <AppText
        variant="headline"
        style={{ color: primary ? colors.onAccent : colors.textPrimary }}
      >
        {label}
      </AppText>
      {primary ? (
        <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
      ) : null}
    </Pressable>
  );
}

function MythMark() {
  const colors = useColors();
  return (
    <View style={[styles.mark, { backgroundColor: colors.accent }]}>
      <AppText variant="title" style={{ color: colors.onAccent, fontWeight: '800' }}>M</AppText>
    </View>
  );
}

function SceneArt({ index }: { index: number }) {
  const colors = useColors();
  if (index === 0) {
    return (
      <View style={styles.welcomeArt}>
        <View style={[styles.workspaceCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.miniIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="briefcase" size={18} color={colors.onAccent} />
          </View>
          <View style={styles.workspaceText}>
            <AppText variant="headline">A focused workspace</AppText>
            <AppText variant="footnote" tone="muted">People, projects, and progress</AppText>
          </View>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        </View>
        <View style={styles.teamOrbit}>
          <AvatarNode label="A" color="#7894ed" />
          <AvatarNode label="M" color="#4d9f8c" />
          <AvatarNode label="J" color="#d58a70" />
          <View style={[styles.orbitLine, { backgroundColor: colors.border }]} />
          <View style={[styles.orbitCore, { backgroundColor: colors.accent }]}>
            <Ionicons name="aperture" size={25} color={colors.onAccent} />
          </View>
        </View>
      </View>
    );
  }

  if (index === 1) {
    return (
      <View style={[styles.phone, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
        <View style={[styles.phoneScreen, { backgroundColor: colors.background }]}>
          <View style={styles.phoneHeader}>
            <View style={[styles.phoneDot, { backgroundColor: colors.accent }]} />
            <AppText variant="footnote" style={styles.phoneHeaderText}>Your conversations</AppText>
          </View>
          <ConversationPreview title="Product team" preview="The latest brief is ready" icon="people-outline" />
          <ConversationPreview title="Direct messages" preview="Pick up where you left off" icon="chatbubble-outline" />
          <ConversationPreview title="Project updates" preview="Everything in its place" icon="layers-outline" />
        </View>
      </View>
    );
  }

  if (index === 2) {
    return (
      <View style={[styles.callCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.callTop}>
          <View style={[styles.callAvatar, { backgroundColor: colors.accent }]}>
            <Ionicons name="people" size={26} color={colors.onAccent} />
          </View>
          <View style={[styles.callAvatarSmall, { backgroundColor: colors.success }]}>
            <Ionicons name="person" size={17} color="#ffffff" />
          </View>
        </View>
        <AppText variant="headline">Team conversation</AppText>
        <AppText variant="footnote" tone="muted">Voice · Video · Shared context</AppText>
        <View style={styles.callControls}>
          {(['mic-outline', 'videocam-outline', 'chatbubble-outline'] as const).map((icon) => (
            <View key={icon} style={[styles.control, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name={icon} size={18} color={colors.textPrimary} />
            </View>
          ))}
          <View style={[styles.control, { backgroundColor: colors.destructive }]}>
            <Ionicons name="call" size={18} color="#ffffff" />
          </View>
        </View>
      </View>
    );
  }

  if (index === 3) {
    return (
      <View style={styles.network}>
        <View style={[styles.networkLine, styles.lineOne, { backgroundColor: colors.border }]} />
        <View style={[styles.networkLine, styles.lineTwo, { backgroundColor: colors.border }]} />
        <View style={[styles.networkLine, styles.lineThree, { backgroundColor: colors.border }]} />
        <View style={[styles.networkCore, { backgroundColor: colors.accent }]}>
          <Ionicons name="aperture" size={25} color={colors.onAccent} />
        </View>
        <View style={[styles.networkNode, styles.nodeOne, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name="business" size={19} color={colors.accent} />
        </View>
        <View style={[styles.networkNode, styles.nodeTwo, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name="people" size={19} color={colors.accent} />
        </View>
        <View style={[styles.networkNode, styles.nodeThree, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name="location" size={19} color={colors.accent} />
        </View>
        <AvatarNode label="T" color="#4d9f8c" style={styles.networkAvatar} />
      </View>
    );
  }

  return (
    <View style={[styles.finalArt, { backgroundColor: colors.surface }]}>
      <MythMark />
      <View style={[styles.finalOrbit, { borderColor: colors.border }]} />
      <View style={[styles.finalOrbitInner, { borderColor: colors.border }]} />
    </View>
  );
}

function ConversationPreview({
  title,
  preview,
  icon,
}: {
  title: string;
  preview: string;
  icon: 'people-outline' | 'chatbubble-outline' | 'layers-outline';
}) {
  const colors = useColors();
  return (
    <View style={styles.conversationPreview}>
      <View style={[styles.conversationIcon, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name={icon} size={16} color={colors.accent} />
      </View>
      <View style={styles.conversationText}>
        <AppText variant="footnote" style={styles.conversationTitle}>{title}</AppText>
        <AppText variant="caption" tone="muted">{preview}</AppText>
      </View>
      <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
    </View>
  );
}

function AvatarNode({
  label,
  color,
  style,
}: {
  label: string;
  color: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.avatarNode, { backgroundColor: color }, style]}>
      <AppText variant="footnote" style={styles.avatarLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  top: { height: 38, flexDirection: 'row', alignItems: 'center', gap: 16 },
  progress: { flex: 1, flexDirection: 'row', gap: 5 },
  progressTrack: { height: 3, flex: 1, borderRadius: 2 },
  skip: { minWidth: 42, alignItems: 'flex-end' },
  scene: { flex: 1 },
  sceneContent: { flexGrow: 1, justifyContent: 'center', paddingBottom: 8 },
  artwork: { height: 292, alignItems: 'center', justifyContent: 'center' },
  copy: { gap: 12, paddingTop: 16, paddingBottom: 18 },
  eyebrow: { fontWeight: '700', letterSpacing: 1.15 },
  title: { maxWidth: 430 },
  description: { maxWidth: 400, lineHeight: 24 },
  footer: { gap: 10, paddingTop: 8, paddingBottom: 4 },
  action: {
    minHeight: 54,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 17,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  explore: { minHeight: 30, alignItems: 'center', justifyContent: 'center' },
  startup: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28, gap: 14 },
  startupMessage: { textAlign: 'center', maxWidth: 300 },
  continueOnce: { paddingTop: 8 },
  mark: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  welcomeArt: { width: '100%', maxWidth: 380, alignItems: 'center', gap: 28 },
  workspaceCard: {
    width: '100%',
    minHeight: 76,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  workspaceText: { flex: 1, gap: 3 },
  teamOrbit: { width: 228, height: 126, alignItems: 'center', justifyContent: 'center' },
  orbitLine: { position: 'absolute', width: 160, height: 1 },
  orbitCore: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarNode: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  avatarLabel: { color: '#ffffff', fontWeight: '700' },
  phone: {
    width: 236,
    height: 264,
    borderRadius: 30,
    padding: 8,
    borderWidth: 1,
    elevation: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  phoneScreen: { flex: 1, borderRadius: 23, paddingHorizontal: 13, paddingTop: 14 },
  phoneHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 15 },
  phoneDot: { width: 8, height: 8, borderRadius: 4 },
  phoneHeaderText: { fontWeight: '700' },
  conversationPreview: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11 },
  conversationIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  conversationText: { flex: 1, gap: 3 },
  conversationTitle: { fontWeight: '600' },
  unreadDot: { width: 6, height: 6, borderRadius: 3 },
  callCard: {
    width: '100%',
    maxWidth: 330,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 24,
    gap: 9,
  },
  callTop: { height: 90, width: 142, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  callAvatar: { width: 70, height: 70, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  callAvatarSmall: {
    position: 'absolute',
    right: 6,
    bottom: 3,
    width: 38,
    height: 38,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  callControls: { flexDirection: 'row', gap: 10, paddingTop: 10 },
  control: { width: 40, height: 40, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  network: { width: 280, height: 260, alignItems: 'center', justifyContent: 'center' },
  networkLine: { position: 'absolute', width: 1, height: 115 },
  lineOne: { transform: [{ rotate: '52deg' }] },
  lineTwo: { transform: [{ rotate: '-52deg' }] },
  lineThree: { transform: [{ rotate: '90deg' }] },
  networkCore: { width: 60, height: 60, borderRadius: 22, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  networkNode: { position: 'absolute', width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nodeOne: { top: 24, left: 44 },
  nodeTwo: { top: 24, right: 44 },
  nodeThree: { bottom: 21, alignSelf: 'center' },
  networkAvatar: { position: 'absolute', top: 109, right: 26, width: 34, height: 34, borderWidth: 2 },
  finalArt: { width: 208, height: 208, borderRadius: 72, alignItems: 'center', justifyContent: 'center' },
  finalOrbit: { position: 'absolute', width: 258, height: 258, borderRadius: 129, borderWidth: 1 },
  finalOrbitInner: { position: 'absolute', width: 236, height: 236, borderRadius: 118, borderWidth: 1, opacity: 0.45 },
});
