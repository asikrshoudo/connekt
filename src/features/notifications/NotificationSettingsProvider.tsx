import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  parseNotificationSettings,
  type NotificationSettings,
} from './notificationSettings';

// Stored on this device only: which notifications you want, as plain text.
const STORAGE_KEY = 'connekt.notifications.v1';

type Value = {
  settings: NotificationSettings;
  update: (change: Partial<NotificationSettings>) => void;
};

const NotificationSettingsContext = createContext<Value | null>(null);

export function NotificationSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (active) setSettings(parseNotificationSettings(raw));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((change: Partial<NotificationSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...change };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ settings, update }), [settings, update]);
  return (
    <NotificationSettingsContext.Provider value={value}>
      {children}
    </NotificationSettingsContext.Provider>
  );
}

export function useNotificationSettings(): Value {
  const value = useContext(NotificationSettingsContext);
  if (!value) {
    throw new Error('useNotificationSettings must be used inside NotificationSettingsProvider');
  }
  return value;
}
