import type { Conversation, Message } from '../../types/chat';

const MAX_MESSAGE_HITS = 30;

export type MessageHit = { message: Message; conversation: Conversation };
export type SearchResults = { chats: Conversation[]; messages: MessageHit[] };

export type SearchRow =
  | { kind: 'header'; id: string; title: string }
  | { kind: 'chat'; id: string; conversation: Conversation }
  | { kind: 'message'; id: string; hit: MessageHit };

export function searchChats(
  query: string,
  conversations: Conversation[],
  messagesFor: (conversationId: string) => Message[],
): SearchResults {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) return { chats: [], messages: [] };

  const chats = conversations.filter((c) => c.name.toLowerCase().includes(needle));

  const messages: MessageHit[] = [];
  for (const conversation of conversations) {
    for (const message of messagesFor(conversation.id)) {
      if (message.text.toLowerCase().includes(needle)) {
        messages.push({ message, conversation });
      }
    }
  }
  messages.sort((a, b) => b.message.sentAt - a.message.sentAt);

  return { chats, messages: messages.slice(0, MAX_MESSAGE_HITS) };
}

export function buildSearchRows(results: SearchResults): SearchRow[] {
  const rows: SearchRow[] = [];

  if (results.chats.length > 0) {
    rows.push({ kind: 'header', id: 'header-chats', title: 'Chats' });
    for (const conversation of results.chats) {
      rows.push({ kind: 'chat', id: `chat-${conversation.id}`, conversation });
    }
  }

  if (results.messages.length > 0) {
    rows.push({ kind: 'header', id: 'header-messages', title: 'Messages' });
    for (const hit of results.messages) {
      rows.push({ kind: 'message', id: `message-${hit.message.id}`, hit });
    }
  }

  return rows;
}
