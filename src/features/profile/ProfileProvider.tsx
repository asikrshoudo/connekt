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
import { DEFAULT_PROFILE, parseProfile, type Profile } from './profileModel';

// Stored on this device only, as plain text: display name, bio and photo location.
const STORAGE_KEY = 'connekt.profile.v1';

type ProfileContextValue = { profile: Profile; save: (profile: Profile) => void };

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (active) setProfile(parseProfile(raw));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback((next: Profile) => {
    setProfile(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const value = useMemo(() => ({ profile, save }), [profile, save]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside ProfileProvider');
  return value;
}
