export type Profile = {
  displayName: string;
  about: string;
  photoUri: string | null;
};

export const MAX_NAME = 40;
export const MAX_ABOUT = 140;

export const DEFAULT_PROFILE: Profile = { displayName: 'You', about: '', photoUri: null };

// Reads saved profile text. Anything missing or broken falls back to safe defaults.
export function parseProfile(raw: string | null): Profile {
  if (!raw) return DEFAULT_PROFILE;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return DEFAULT_PROFILE;
    const record = value as Record<string, unknown>;
    const name =
      typeof record.displayName === 'string' ? record.displayName.trim().slice(0, MAX_NAME) : '';
    return {
      displayName: name || DEFAULT_PROFILE.displayName,
      about: typeof record.about === 'string' ? record.about.slice(0, MAX_ABOUT) : '',
      photoUri: typeof record.photoUri === 'string' ? record.photoUri : null,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}
