// SAMPLE DATA ONLY. These are not real people or real messages.
import type { Conversation } from '../../types/chat';

const ago = (minutes: number) => Date.now() - minutes * 60_000;

export const sampleConversations: Conversation[] = [
  { id: 'sample-1', name: 'Ayaan Rahman', lastMessage: 'Sounds good, see you at 6.', lastMessageAt: ago(4), unreadCount: 2 },
  { id: 'sample-2', name: 'Maya Chen', lastMessage: 'Sent the files over, let me know if anything is missing from the folder.', lastMessageAt: ago(38), unreadCount: 0 },
  { id: 'sample-3', name: 'Tanvir Hasan', lastMessage: 'Haha that was unreal', lastMessageAt: ago(95), unreadCount: 0 },
  { id: 'sample-4', name: 'Sara Whitfield', lastMessage: 'Can you call me when you are free?', lastMessageAt: ago(60 * 7), unreadCount: 120 },
  { id: 'sample-5', name: 'Rohan Mehta', lastMessage: 'Thanks!', lastMessageAt: ago(60 * 27), unreadCount: 0 },
  { id: 'sample-6', name: 'Lina Haddad', lastMessage: 'I will check and get back to you tomorrow morning.', lastMessageAt: ago(60 * 24 * 3), unreadCount: 1 },
  { id: 'sample-7', name: 'Farhan Karim', lastMessage: 'Okay', lastMessageAt: ago(60 * 24 * 12), unreadCount: 0 },
  { id: 'sample-8', name: 'Emily Park', lastMessage: 'Happy birthday!', lastMessageAt: ago(60 * 24 * 40), unreadCount: 0 },
];

export const samplePinnedIds: string[] = ['sample-1', 'sample-3'];
