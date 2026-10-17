// SAMPLE DATA ONLY. These are not real people or real messages.
import type { Conversation, Member } from '../../types/chat';
import { messagePreview } from '../../utils/messagePreview';
import { sampleMessages } from './sampleMessages';

type Seed = { id: string; name: string; unreadCount: number; members?: Member[] };

const seeds: Seed[] = [
  { id: 'sample-1', name: 'Ayaan Rahman', unreadCount: 2 },
  { id: 'sample-2', name: 'Maya Chen', unreadCount: 0 },
  { id: 'sample-3', name: 'Tanvir Hasan', unreadCount: 0 },
  { id: 'sample-4', name: 'Sara Whitfield', unreadCount: 120 },
  { id: 'sample-5', name: 'Rohan Mehta', unreadCount: 0 },
  { id: 'sample-6', name: 'Lina Haddad', unreadCount: 1 },
  { id: 'sample-7', name: 'Farhan Karim', unreadCount: 0 },
  { id: 'sample-8', name: 'Emily Park', unreadCount: 0 },
  {
    id: 'sample-group-1',
    name: 'Weekend Plans',
    unreadCount: 3,
    members: [
      { id: 'sample-1', name: 'Ayaan Rahman' },
      { id: 'sample-2', name: 'Maya Chen' },
      { id: 'sample-3', name: 'Tanvir Hasan' },
      { id: 'sample-4', name: 'Sara Whitfield' },
    ],
  },
];

export const sampleConversations: Conversation[] = seeds.map((seed) => {
  const list = sampleMessages[seed.id] ?? [];
  const last = list[list.length - 1];
  const text = last ? messagePreview(last) : '';
  const lastMessage = last?.senderName ? `${last.senderName}: ${text}` : text;
  return { ...seed, lastMessage, lastMessageAt: last ? last.sentAt : 0 };
});

export const samplePinnedIds: string[] = ['sample-1', 'sample-3'];
