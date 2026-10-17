import type { Conversation } from '../../types/chat';

export const MAX_PINNED = 3;

export type ChatsState = {
  conversations: Conversation[];
  pinnedIds: string[];
};

export type ChatsAction = { type: 'pin'; id: string } | { type: 'unpin'; id: string };

export type ChatListItem = {
  conversation: Conversation;
  pinned: boolean;
};

export function createInitialState(
  conversations: Conversation[],
  pinnedIds: string[],
): ChatsState {
  const known = pinnedIds.filter((id) => conversations.some((c) => c.id === id));
  return { conversations, pinnedIds: known.slice(0, MAX_PINNED) };
}

export function chatsReducer(state: ChatsState, action: ChatsAction): ChatsState {
  switch (action.type) {
    case 'pin': {
      if (state.pinnedIds.includes(action.id)) return state;
      if (state.pinnedIds.length >= MAX_PINNED) return state;
      if (!state.conversations.some((c) => c.id === action.id)) return state;
      return { ...state, pinnedIds: [...state.pinnedIds, action.id] };
    }
    case 'unpin':
      return { ...state, pinnedIds: state.pinnedIds.filter((id) => id !== action.id) };
  }
}

export function selectChatList(state: ChatsState): ChatListItem[] {
  const byId = new Map(state.conversations.map((c) => [c.id, c] as const));

  const pinned: ChatListItem[] = [];
  for (const id of state.pinnedIds) {
    const conversation = byId.get(id);
    if (conversation) pinned.push({ conversation, pinned: true });
  }

  const rest: ChatListItem[] = state.conversations
    .filter((c) => !state.pinnedIds.includes(c.id))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
    .map((conversation) => ({ conversation, pinned: false }));

  return [...pinned, ...rest];
}
