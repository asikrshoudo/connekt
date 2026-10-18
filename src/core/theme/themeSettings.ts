export type ThemeId = 'core' | 'material';
export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeSettings = { themeId: ThemeId; mode: ThemeMode };

export const THEME_IDS: ThemeId[] = ['core', 'material'];
export const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];
export const DEFAULT_THEME_SETTINGS: ThemeSettings = { themeId: 'core', mode: 'dark' };

// Reads saved settings. Anything missing or broken falls back to the defaults.
export function parseThemeSettings(raw: string | null): ThemeSettings {
  if (!raw) return DEFAULT_THEME_SETTINGS;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return DEFAULT_THEME_SETTINGS;
    const record = value as Record<string, unknown>;
    const themeId =
      THEME_IDS.find((id) => id === record.themeId) ?? DEFAULT_THEME_SETTINGS.themeId;
    const mode = THEME_MODES.find((m) => m === record.mode) ?? DEFAULT_THEME_SETTINGS.mode;
    return { themeId, mode };
  } catch {
    return DEFAULT_THEME_SETTINGS;
  }
}

// "system" follows the phone. If the phone does not say, use dark.
export function resolveScheme(
  mode: ThemeMode,
  system: 'light' | 'dark' | null | undefined,
): 'light' | 'dark' {
  if (mode === 'system') return system === 'light' ? 'light' : 'dark';
  return mode;
}
