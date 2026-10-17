// SAMPLE DATA ONLY. These are not real people or real messages.
import type { Conversation } from '../../types/chat';
import { sampleMessages } from './sampleMessages';

const people = [
  { id: 'sample-1', name: 'Ayaan Rahman', unreadCount: 2 },
  { id: 'sample-2', name: 'Maya Chen', unreadCount: 0 },
  { id: 'sample-3', name: 'Tanvir Hasan', unreadCount: 0 },
  { id: 'sample-4', name: 'Sara Whitfield', unreadCount: 120 },
  { id: 'sample-5', name: 'Rohan Mehta', unreadCount: 0 },
  { id: 'sample-6', name: 'Lina Haddad', unreadCount: 1 },
  { id: 'sample-7', name: 'Farhan Karim', unreadCount: 0 },
  { id: 'sample-8', name: 'Emily Park', unreadCount: 0 },
];

export const sampleConversations: Conversation[] = people.map((person) => {
  const list = sampleMessages[person.id] ?? [];
  const last = list[list.length - 1];
  return {
    ...person,
    lastMessage: last ? last.text : '',
    lastMessageAt: last ? last.sentAt : 0,
  };
});

export const samplePinnedIds: string[] = ['sample-1', 'sample-3'];
