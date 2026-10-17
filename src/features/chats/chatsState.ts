import type { Conversation, Message } from '../../types/chat';

export const MAX_PINNED = 3;

export type ChatsState = {
  conversations: Conversation[];
  pinnedIds: string[];
  messages: Record<string, Message[]>;
};

export type ChatsAction =
  | { type: 'pin'; id: string }
  | { type: 'unpin'; id: string }
  | { type: 'markRead'; id: string }
  | {
      type: 'send';
      conversationId: string;
      messageId: string;
      text: string;
      sentAt: number;
      replyToId?: string;
    }
  | { type: 'react'; conversationId: string; messageId: string; emoji: string }
  | { type: 'deleteMessage'; conversationId: string; messageId: string }
  | { type: 'startChat'; id: string; name: string; now: number };

export type ChatListItem = {
  conversation: Conversation;
  pinned: boolean;
};

export function createInitialState(
  conversations: Conversation[],
  pinnedIds: string[],
  messages: Record<string, Message[]>,
): ChatsState {
  const known = pinnedIds.filter((id) => conversations.some((c) => c.id === id));
  return { conversations, pinnedIds: known.slice(0, MAX_PINNED), messages };
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
    case 'markRead': {
      const target = state.conversations.find((c) => c.id === action.id);
      if (!target || target.unreadCount === 0) return state;
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.id ? { ...c, unreadCount: 0 } : c,
        ),
      };
    }
    case 'send': {
      if (!state.conversations.some((c) => c.id === action.conversationId)) return state;
      const message: Message = {
        id: action.messageId,
        conversationId: action.conversationId,
        text: action.text,
        sentAt: action.sentAt,
        direction: 'outgoing',
        ...(action.replyToId ? { replyToId: action.replyToId } : {}),
      };
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? { ...c, lastMessage: action.text, lastMessageAt: action.sentAt }
            : c,
        ),
        messages: {
          ...state.messages,
          [action.conversationId]: [...(state.messages[action.conversationId] ?? []), message],
        },
      };
    }
    case 'react': {
      const list = state.messages[action.conversationId];
      if (!list) return state;
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.conversationId]: list.map((m) =>
            m.id !== action.messageId
              ? m
              : { ...m, reaction: m.reaction === action.emoji ? undefined : action.emoji },
          ),
        },
      };
    }
    case 'startChat': {
      if (state.conversations.some((c) => c.id === action.id)) return state;
      const conversation: Conversation = {
        id: action.id,
        name: action.name,
        lastMessage: '',
        lastMessageAt: action.now,
        unreadCount: 0,
      };
      return {
        ...state,
        conversations: [...state.conversations, conversation],
        messages: { ...state.messages, [action.id]: [] },
      };
    }
    case 'deleteMessage': {
      const list = state.messages[action.conversationId];
      if (!list) return state;
      const remaining = list.filter((m) => m.id !== action.messageId);
      const last = remaining[remaining.length - 1];
      return {
        ...state,
        messages: { ...state.messages, [action.conversationId]: remaining },
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? {
                ...c,
                lastMessage: last ? last.text : '',
                lastMessageAt: last ? last.sentAt : c.lastMessageAt,
              }
            : c,
        ),
      };
    }
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
