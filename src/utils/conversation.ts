import type { Conversation } from '../types/chat';

export function isGroup(conversation: Conversation): boolean {
  return conversation.members !== undefined;
}
