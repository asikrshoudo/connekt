export type ContactCard = { id: string; name: string };

export const ID_PATTERN = /^[a-f0-9]{32}$/;

const PREFIX = 'connekt://contact?';
const MAX_NAME = 40;
const MAX_LENGTH = 400;

export function encodeContactCard(card: ContactCard): string {
  const name = card.name.trim().slice(0, MAX_NAME);
  return `${PREFIX}v=1&id=${encodeURIComponent(card.id)}&name=${encodeURIComponent(name)}`;
}

// Reads a Connekt contact link. Anything that is not a valid card gives null.
export function parseContactCard(text: string): ContactCard | null {
  const value = text.trim();
  if (value.length > MAX_LENGTH || !value.startsWith(PREFIX)) return null;

  const params: Record<string, string> = {};
  for (const part of value.slice(PREFIX.length).split('&')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    try {
      params[part.slice(0, index)] = decodeURIComponent(part.slice(index + 1));
    } catch {
      return null;
    }
  }

  const id = params.id ?? '';
  const name = (params.name ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, MAX_NAME);

  if (params.v !== '1' || !ID_PATTERN.test(id) || name.length === 0) return null;
  return { id, name };
}
