import type { Attachment, Conversation, Member, Message } from '../../types/chat';
import type { MessageRequest } from '../../types/request';
import { messagePreview } from '../../utils/messagePreview';

export const MAX_PINNED = 3;

export type ChatsState = {
  conversations: Conversation[];
  pinnedIds: string[];
  messages: Record<string, Message[]>;
  requests: MessageRequest[];
  blockedIds: string[];
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
      attachment?: Attachment;
    }
  | { type: 'react'; conversationId: string; messageId: string; emoji: string }
  | { type: 'deleteMessage'; conversationId: string; messageId: string }
  | { type: 'startChat'; id: string; name: string; now: number }
  | { type: 'acceptRequest'; id: string }
  | { type: 'declineRequest'; id: string }
  | { type: 'blockRequest'; id: string }
  | { type: 'block'; id: string }
  | { type: 'unblock'; id: string }
  | { type: 'createGroup'; id: string; name: string; members: Member[]; now: number }
  | { type: 'leaveGroup'; id: string };

export type ChatListItem = {
  conversation: Conversation;
  pinned: boolean;
};

export function createInitialState(
  conversations: Conversation[],
  pinnedIds: string[],
  messages: Record<string, Message[]>,
  requests: MessageRequest[] = [],
): ChatsState {
  const known = pinnedIds.filter((id) => conversations.some((c) => c.id === id));
  return {
    conversations,
    pinnedIds: known.slice(0, MAX_PINNED),
    messages,
    requests,
    blockedIds: [],
  };
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
        ...(action.attachment ? { attachment: action.attachment } : {}),
      };
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? { ...c, lastMessage: messagePreview(message), lastMessageAt: action.sentAt }
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
    case 'acceptRequest': {
      const request = state.requests.find((r) => r.id === action.id);
      if (!request) return state;
      const conversation: Conversation = {
        id: request.id,
        name: request.name,
        lastMessage: request.firstMessage,
        lastMessageAt: request.receivedAt,
        unreadCount: 1,
      };
      const first: Message = {
        id: request.id + '-m0',
        conversationId: request.id,
        text: request.firstMessage,
        sentAt: request.receivedAt,
        direction: 'incoming',
      };
      return {
        ...state,
        requests: state.requests.filter((r) => r.id !== action.id),
        conversations: [...state.conversations, conversation],
        messages: { ...state.messages, [request.id]: [first] },
      };
    }
    case 'declineRequest':
      return { ...state, requests: state.requests.filter((r) => r.id !== action.id) };
    case 'blockRequest':
      return {
        ...state,
        requests: state.requests.filter((r) => r.id !== action.id),
        blockedIds: state.blockedIds.includes(action.id)
          ? state.blockedIds
          : [...state.blockedIds, action.id],
      };
    case 'block':
      if (state.blockedIds.includes(action.id)) return state;
      return { ...state, blockedIds: [...state.blockedIds, action.id] };
    case 'unblock':
      return { ...state, blockedIds: state.blockedIds.filter((id) => id !== action.id) };
    case 'createGroup': {
      const conversation: Conversation = {
        id: action.id,
        name: action.name,
        lastMessage: '',
        lastMessageAt: action.now,
        unreadCount: 0,
        members: action.members,
      };
      return {
        ...state,
        conversations: [...state.conversations, conversation],
        messages: { ...state.messages, [action.id]: [] },
      };
    }
    case 'leaveGroup':
      return {
        ...state,
        conversations: state.conversations.filter((c) => c.id !== action.id),
        pinnedIds: state.pinnedIds.filter((id) => id !== action.id),
        messages: Object.fromEntries(
          Object.entries(state.messages).filter(([id]) => id !== action.id),
        ),
      };
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
                lastMessage: last ? messagePreview(last) : '',
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
