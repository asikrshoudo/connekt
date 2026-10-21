import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ScreenCapture from 'expo-screen-capture';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import { isExternalActivityActive, markExternalActivity } from '../../core/externalActivity';
import { remainingLockoutMs, shouldLockAfter } from './lockLogic';
import { DEFAULT_LOCK_SETTINGS, parseLockSettings, type LockSettings } from './lockSettings';
import {
  checkPin,
  hasPin,
  readAttempts,
  recordFailure,
  removePin,
  resetAttempts,
  savePin,
} from './pinStore';

// Only the lock settings are stored here, as plain text. The PIN itself is in pinStore.
const STORAGE_KEY = 'connekt.lock.v1';

export type PinResult = 'ok' | 'wrong' | 'locked';

type AppLockValue = {
  ready: boolean;
  locked: boolean;
  settings: LockSettings;
  lockedUntil: number;
  biometricAvailable: boolean;
  unlockWithPin: (pin: string) => Promise<PinResult>;
  unlockWithBiometric: () => Promise<boolean>;
  verifyPin: (pin: string) => Promise<PinResult>;
  confirmBiometric: () => Promise<boolean>;
  enable: (pin: string) => Promise<void>;
  changePin: (pin: string) => Promise<void>;
  disable: () => Promise<void>;
  setTimeoutMs: (ms: number) => void;
  setBiometric: (on: boolean) => void;
  setBlockScreenshots: (on: boolean) => void;
};

const AppLockContext = createContext<AppLockValue | null>(null);

export function AppLockProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LockSettings>(DEFAULT_LOCK_SETTINGS);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(true);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const backgroundedAt = useRef<number | null>(null);

  const persist = useCallback((next: LockSettings) => {
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const refreshBiometric = useCallback(async () => {
    try {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = hardware && (await LocalAuthentication.isEnrolledAsync());
      setBiometricAvailable(enrolled);
    } catch {
      setBiometricAvailable(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let loaded = parseLockSettings(await AsyncStorage.getItem(STORAGE_KEY));
        // If the PIN is gone (for example cleared data), do not lock the user out.
        if (loaded.enabled && !(await hasPin())) {
          loaded = { ...loaded, enabled: false, biometric: false };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
        }
        const attempts = await readAttempts();
        if (!active) return;
        setSettings(loaded);
        setLockedUntil(attempts.lockedUntil);
        setLocked(loaded.enabled);
      } catch {
        if (active) setLocked(false);
      } finally {
        if (active) setReady(true);
      }
    })();
    void refreshBiometric();
    return () => {
      active = false;
    };
  }, [refreshBiometric]);

  useEffect(() => {
    if (!ready) return undefined;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        backgroundedAt.current = Date.now();
      } else if (state === 'active') {
        const since = backgroundedAt.current;
        backgroundedAt.current = null;
        void refreshBiometric();
        if (
          settings.enabled &&
          !isExternalActivityActive() &&
          shouldLockAfter(since, Date.now(), settings.timeoutMs)
        ) {
          setLocked(true);
        }
      }
    });
    return () => subscription.remove();
  }, [ready, settings.enabled, settings.timeoutMs, refreshBiometric]);

  useEffect(() => {
    if (!ready) return;
    const run = settings.blockScreenshots
      ? ScreenCapture.preventScreenCaptureAsync()
      : ScreenCapture.allowScreenCaptureAsync();
    run.catch(() => undefined);
  }, [ready, settings.blockScreenshots]);

  const verifyPin = useCallback(async (pin: string): Promise<PinResult> => {
    const now = Date.now();
    const attempts = await readAttempts();
    if (remainingLockoutMs(attempts.lockedUntil, now) > 0) {
      setLockedUntil(attempts.lockedUntil);
      return 'locked';
    }
    if (await checkPin(pin)) {
      await resetAttempts();
      setLockedUntil(0);
      return 'ok';
    }
    const next = await recordFailure(now);
    setLockedUntil(next.lockedUntil);
    return next.lockedUntil > now ? 'locked' : 'wrong';
  }, []);

  const unlockWithPin = useCallback(
    async (pin: string): Promise<PinResult> => {
      const result = await verifyPin(pin);
      if (result === 'ok') setLocked(false);
      return result;
    },
    [verifyPin],
  );

  const confirmBiometric = useCallback(async (): Promise<boolean> => {
    markExternalActivity(30_000);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Connekt',
        cancelLabel: 'Use PIN',
        disableDeviceFallback: true,
      });
      return result.success;
    } catch {
      return false;
    }
  }, []);

  const unlockWithBiometric = useCallback(async (): Promise<boolean> => {
    if (!settings.biometric) return false;
    const ok = await confirmBiometric();
    if (ok) setLocked(false);
    return ok;
  }, [settings.biometric, confirmBiometric]);

  const enable = useCallback(
    async (pin: string) => {
      await savePin(pin);
      persist({ ...settings, enabled: true });
      setLocked(false);
    },
    [settings, persist],
  );

  const changePin = useCallback(async (pin: string) => {
    await savePin(pin);
  }, []);

  const disable = useCallback(async () => {
    await removePin();
    persist({ ...settings, enabled: false, biometric: false });
    setLocked(false);
  }, [settings, persist]);

  const value = useMemo<AppLockValue>(
    () => ({
      ready,
      locked,
      settings,
      lockedUntil,
      biometricAvailable,
      unlockWithPin,
      unlockWithBiometric,
      verifyPin,
      confirmBiometric,
      enable,
      changePin,
      disable,
      setTimeoutMs: (timeoutMs) => persist({ ...settings, timeoutMs }),
      setBiometric: (biometric) => persist({ ...settings, biometric }),
      setBlockScreenshots: (blockScreenshots) => persist({ ...settings, blockScreenshots }),
    }),
    [
      ready,
      locked,
      settings,
      lockedUntil,
      biometricAvailable,
      unlockWithPin,
      unlockWithBiometric,
      verifyPin,
      confirmBiometric,
      enable,
      changePin,
      disable,
      persist,
    ],
  );

  return <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>;
}

export function useAppLock(): AppLockValue {
  const value = useContext(AppLockContext);
  if (!value) throw new Error('useAppLock must be used inside AppLockProvider');
  return value;
}
