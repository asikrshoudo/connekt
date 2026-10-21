import { TIMEOUT_OPTIONS } from './lockLogic';

export type LockSettings = {
  enabled: boolean;
  biometric: boolean;
  timeoutMs: number;
  blockScreenshots: boolean;
};

export const DEFAULT_LOCK_SETTINGS: LockSettings = {
  enabled: false,
  biometric: false,
  timeoutMs: 60_000,
  blockScreenshots: false,
};

// Reads saved settings. Anything missing or broken falls back to the defaults.
export function parseLockSettings(raw: string | null): LockSettings {
  if (!raw) return DEFAULT_LOCK_SETTINGS;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return DEFAULT_LOCK_SETTINGS;
    const record = value as Record<string, unknown>;
    const timeout = TIMEOUT_OPTIONS.find((option) => option === record.timeoutMs);
    return {
      enabled: record.enabled === true,
      biometric: record.biometric === true,
      timeoutMs: timeout ?? DEFAULT_LOCK_SETTINGS.timeoutMs,
      blockScreenshots: record.blockScreenshots === true,
    };
  } catch {
    return DEFAULT_LOCK_SETTINGS;
  }
}
