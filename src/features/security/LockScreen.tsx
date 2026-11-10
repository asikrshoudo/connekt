import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
import { radius } from '../../core/theme/radius';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { formatDuration } from '../../utils/format';
import { useAppLock } from './AppLockProvider';
import { remainingLockoutMs } from './lockLogic';
import { PinPad } from './PinPad';
import { PIN_LENGTH } from './pinPolicy';

export function LockScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const lock = useAppLock();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());

  const remaining = remainingLockoutMs(lock.lockedUntil, now);
  const lockedOut = remaining > 0;
  const useBiometric = lock.settings.biometric && lock.biometricAvailable;

  useEffect(() => {
    if (!lockedOut) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [lockedOut]);

  useEffect(() => {
    if (useBiometric) void lock.unlockWithBiometric();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (next: string) => {
    setError('');
    setPin(next);
    if (next.length < PIN_LENGTH) return;
    void lock.unlockWithPin(next).then((result) => {
      if (result === 'ok') return;
      setPin('');
      setNow(Date.now());
      if (result === 'wrong') setError('Incorrect PIN. Try again.');
    });
  };

  const message = lockedOut
    ? `Too many attempts. Try again in ${formatDuration(remaining)}`
    : error || 'Enter your 6-digit security PIN';

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingTop: insets.top + spacing.xxl },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.lockIconBox,
            {
              backgroundColor: colors.surfaceContainer,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Ionicons name="lock-closed" size={32} color={colors.accent} />
        </View>
        <AppText variant="title" style={styles.title}>
          Myth Workspace Locked
        </AppText>
        <AppText
          accessibilityLiveRegion="polite"
          variant="callout"
          tone={error || lockedOut ? 'primary' : 'secondary'}
          style={[styles.message, error || lockedOut ? { color: colors.destructive } : undefined]}
        >
          {message}
        </AppText>
      </View>

      <PinPad
        value={pin}
        onChange={handleChange}
        disabled={lockedOut}
        leftAction={
          useBiometric ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Unlock with biometric"
              onPress={() => void lock.unlockWithBiometric()}
              style={styles.biometricBtn}
            >
              <Ionicons name="finger-print" size={32} color={colors.accent} />
            </Pressable>
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  lockIconBox: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  biometricBtn: {
    padding: 8,
  },
});
