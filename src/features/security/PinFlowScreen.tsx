import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AppText } from '../../components/ui/AppText';
import type { RootStackParamList } from '../../core/navigation/types';
import { spacing } from '../../core/theme/spacing';
import { useColors } from '../../core/theme/ThemeProvider';
import { formatDuration } from '../../utils/format';
import { useAppLock } from './AppLockProvider';
import { remainingLockoutMs } from './lockLogic';
import { PinPad } from './PinPad';
import { isWeakPin, PIN_LENGTH } from './pinPolicy';

type Props = NativeStackScreenProps<RootStackParamList, 'PinFlow'>;
type Step = 'verify' | 'new' | 'confirm';

const SCREEN_TITLES = {
  create: 'App lock',
  change: 'Change PIN',
  disable: 'Turn off app lock',
} as const;

const STEP_TITLES: Record<Step, string> = {
  verify: 'Enter your current PIN',
  new: 'Choose a new PIN',
  confirm: 'Enter the PIN again',
};

function useNow(until: number): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (until <= Date.now()) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [until]);
  return now;
}

export function PinFlowScreen({ route, navigation }: Props) {
  const { mode } = route.params;
  const colors = useColors();
  const lock = useAppLock();
  const [step, setStep] = useState<Step>(mode === 'create' ? 'new' : 'verify');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const now = useNow(lock.lockedUntil);
  const remaining = remainingLockoutMs(lock.lockedUntil, now);
  const lockedOut = step === 'verify' && remaining > 0;

  const fail = (message: string) => {
    setPin('');
    setError(message);
  };

  const complete = async (value: string) => {
    setBusy(true);
    try {
      if (step === 'verify') {
        const result = await lock.verifyPin(value);
        if (result !== 'ok') {
          fail(result === 'locked' ? 'Too many wrong tries.' : 'Wrong PIN. Try again.');
          return;
        }
        if (mode === 'disable') {
          await lock.disable();
          navigation.goBack();
          return;
        }
        setPin('');
        setStep('new');
        return;
      }

      if (step === 'new') {
        if (isWeakPin(value)) {
          fail('That PIN is too easy to guess. Try another.');
          return;
        }
        setFirstPin(value);
        setPin('');
        setStep('confirm');
        return;
      }

      if (value !== firstPin) {
        setFirstPin('');
        setStep('new');
        fail('The PINs did not match. Start again.');
        return;
      }
      if (mode === 'create') await lock.enable(value);
      else await lock.changePin(value);
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  const handleChange = (next: string) => {
    setError('');
    setPin(next);
    if (next.length === PIN_LENGTH) void complete(next);
  };

  const message = lockedOut ? `Try again in ${formatDuration(remaining)}` : error;

  return (
    <Screen>
      <ScreenHeader title={SCREEN_TITLES[mode]} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.header}>
          <AppText variant="heading">{STEP_TITLES[step]}</AppText>
          <AppText
            accessibilityLiveRegion="polite"
            variant="callout"
            tone="muted"
            style={message ? { color: colors.destructive } : undefined}
          >
            {message || `${PIN_LENGTH} digits`}
          </AppText>
        </View>
        <PinPad value={pin} onChange={handleChange} disabled={busy || lockedOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', gap: spacing.xxl, paddingTop: spacing.xxl },
  header: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
});
