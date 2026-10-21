import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/ui/AppText';
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
  const [now, setNow] = useState(Date.now());

  const remaining = remainingLockoutMs(lock.lockedUntil, now);
  const lockedOut = remaining > 0;
  const useBiometric = lock.settings.biometric && lock.biometricAvailable;

  useEffect(() => {
    if (!lockedOut) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [lockedOut]);

  // Ask for the fingerprint once, as soon as the lock screen appears.
  useEffect(() => {
    if (useBiometric) void lock.unlockWithBiometric();
    // Only on first show.
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
      if (result === 'wrong') setError('Wrong PIN. Try again.');
    });
  };

  const message = lockedOut
    ? `Too many tries. Try again in ${formatDuration(remaining)}`
    : error || 'Enter your PIN';

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingTop: insets.top + spacing.xxl },
      ]}
    >
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={36} color={colors.textPrimary} />
        <AppText variant="heading">Connekt is locked</AppText>
        <AppText
          accessibilityLiveRegion="polite"
          tone={error || lockedOut ? 'primary' : 'secondary'}
          style={error || lockedOut ? { color: colors.destructive } : undefined}
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
              accessibilityLabel="Use fingerprint"
              onPress={() => void lock.unlockWithBiometric()}
            >
              <Ionicons name="finger-print" size={34} color={colors.accent} />
            </Pressable>
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, alignItems: 'center', gap: spacing.xxl },
  header: { alignItems: 'center', gap: spacing.sm },
});
