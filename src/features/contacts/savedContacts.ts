import type { Contact } from '../../types/contact';
import { ID_PATTERN } from './contactCard';

const MAX_NAME = 40;

// Reads the saved contacts. Broken or invalid entries are skipped.
export function parseSavedContacts(raw: string | null): Contact[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    const result: Contact[] = [];
    for (const entry of value) {
      if (typeof entry !== 'object' || entry === null) continue;
      const record = entry as Record<string, unknown>;
      const id = typeof record.id === 'string' ? record.id : '';
      const name = typeof record.name === 'string' ? record.name.trim().slice(0, MAX_NAME) : '';
      if (!ID_PATTERN.test(id) || name.length === 0 || seen.has(id)) continue;
      seen.add(id);
      result.push({ id, name });
    }
    return result;
  } catch {
    return [];
  }
}
