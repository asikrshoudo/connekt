import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../core/theme/ThemeProvider';
import { useAppLock } from './AppLockProvider';
import { LockScreen } from './LockScreen';

// Covers the app with the lock screen. Every time the app locks, the screens below are
// rebuilt, so menus and dialogs that were open are closed.
export function AppLockGate({ children }: { children: ReactNode }) {
  const colors = useColors();
  const { ready, locked } = useAppLock();
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    if (locked) setEpoch((value) => value + 1);
  }, [locked]);

  return (
    <View style={styles.flex}>
      <View
        key={epoch}
        style={styles.flex}
        importantForAccessibility={locked ? 'no-hide-descendants' : 'auto'}
        accessibilityElementsHidden={locked}
      >
        {children}
      </View>
      {!ready ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      ) : locked ? (
        <LockScreen />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
