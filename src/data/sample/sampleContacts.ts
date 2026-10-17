// SAMPLE DATA ONLY. These are not real people.
import type { Contact } from '../../types/contact';
import { isGroup } from '../../utils/conversation';
import { sampleConversations } from './sampleConversations';

const extra: Contact[] = [
  { id: 'contact-1', name: 'Noah Williams' },
  { id: 'contact-2', name: 'Zara Ahmed' },
  { id: 'contact-3', name: 'Kabir Das' },
  { id: 'contact-4', name: 'Olivia Brown' },
  { id: 'contact-5', name: 'Imran Chowdhury' },
];

export const sampleContacts: Contact[] = [
  ...sampleConversations.filter((c) => !isGroup(c)).map(({ id, name }) => ({ id, name })),
  ...extra,
].sort((a, b) => a.name.localeCompare(b.name));
