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
import { useColorScheme } from 'react-native';
import { darkColors, type ColorTokens } from './colors';
import { palettes } from './palettes';
import {
  DEFAULT_THEME_SETTINGS,
  parseThemeSettings,
  resolveScheme,
  type ThemeId,
  type ThemeMode,
  type ThemeSettings,
} from './themeSettings';

// Stored on this device only: the chosen theme and mode, as plain text.
const STORAGE_KEY = 'connekt.theme.v1';

type ThemeContextValue = {
  colors: ColorTokens;
  isDark: boolean;
  settings: ThemeSettings;
  setThemeId: (id: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
  isDark: true,
  settings: DEFAULT_THEME_SETTINGS,
  setThemeId: () => undefined,
  setMode: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (active) setSettings(parseThemeSettings(raw));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((next: ThemeSettings) => {
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const scheme = resolveScheme(settings.mode, system);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: palettes[settings.themeId][scheme],
      isDark: scheme === 'dark',
      settings,
      setThemeId: (themeId) => update({ ...settings, themeId }),
      setMode: (mode) => update({ ...settings, mode }),
    }),
    [settings, scheme, update],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useColors(): ColorTokens {
  return useContext(ThemeContext).colors;
}

export function useThemeSettings() {
  const { isDark, settings, setThemeId, setMode } = useContext(ThemeContext);
  return { isDark, settings, setThemeId, setMode };
}

// Forces the dark palette of the chosen theme, for screens drawn over a camera or video.
export function DarkScope({ children }: { children: ReactNode }) {
  const parent = useContext(ThemeContext);
  const value = useMemo<ThemeContextValue>(
    () => ({ ...parent, colors: palettes[parent.settings.themeId].dark, isDark: true }),
    [parent],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
