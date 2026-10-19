import type { Attachment, Conversation, Member, Message } from '../../types/chat';
import type { MessageRequest } from '../../types/request';
import { messagePreview } from '../../utils/messagePreview';

export const MAX_PINNED = 3;
export const MIN_GROUP_MEMBERS = 2;
export const MAX_GROUP_NAME = 40;

export type ChatsState = {
  conversations: Conversation[];
  pinnedIds: string[];
  messages: Record<string, Message[]>;
  requests: MessageRequest[];
  blockedIds: string[];
  blockedNames: Record<string, string>;
  mutedUntil: Record<string, number>;
  archivedIds: string[];
  restrictedIds: string[];
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
  | { type: 'leaveGroup'; id: string }
  | { type: 'mute'; id: string; until: number }
  | { type: 'unmute'; id: string }
  | { type: 'archive'; id: string }
  | { type: 'unarchive'; id: string }
  | { type: 'restrict'; id: string }
  | { type: 'unrestrict'; id: string }
  | { type: 'deleteChat'; id: string }
  | { type: 'updateGroup'; id: string; name: string; members: Member[] };

export type ChatListItem = {
  conversation: Conversation;
  pinned: boolean;
  muted: boolean;
  restricted: boolean;
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
    blockedNames: {},
    mutedUntil: {},
    archivedIds: [],
    restrictedIds: [],
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
    case 'blockRequest': {
      const request = state.requests.find((r) => r.id === action.id);
      return {
        ...state,
        requests: state.requests.filter((r) => r.id !== action.id),
        blockedIds: state.blockedIds.includes(action.id)
          ? state.blockedIds
          : [...state.blockedIds, action.id],
        blockedNames: { ...state.blockedNames, [action.id]: request?.name ?? 'Unknown' },
      };
    }
    case 'block': {
      if (state.blockedIds.includes(action.id)) return state;
      const name = state.conversations.find((c) => c.id === action.id)?.name ?? 'Unknown';
      return {
        ...state,
        blockedIds: [...state.blockedIds, action.id],
        blockedNames: { ...state.blockedNames, [action.id]: name },
      };
    }
    case 'unblock':
      return {
        ...state,
        blockedIds: state.blockedIds.filter((id) => id !== action.id),
        blockedNames: Object.fromEntries(
          Object.entries(state.blockedNames).filter(([id]) => id !== action.id),
        ),
      };
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
    case 'mute':
      return { ...state, mutedUntil: { ...state.mutedUntil, [action.id]: action.until } };
    case 'unmute':
      return {
        ...state,
        mutedUntil: Object.fromEntries(
          Object.entries(state.mutedUntil).filter(([id]) => id !== action.id),
        ),
      };
    case 'archive':
      if (state.archivedIds.includes(action.id)) return state;
      return {
        ...state,
        archivedIds: [...state.archivedIds, action.id],
        pinnedIds: state.pinnedIds.filter((id) => id !== action.id),
      };
    case 'unarchive':
      return { ...state, archivedIds: state.archivedIds.filter((id) => id !== action.id) };
    case 'restrict':
      if (state.restrictedIds.includes(action.id)) return state;
      return { ...state, restrictedIds: [...state.restrictedIds, action.id] };
    case 'unrestrict':
      return { ...state, restrictedIds: state.restrictedIds.filter((id) => id !== action.id) };
    case 'deleteChat':
      return {
        ...state,
        conversations: state.conversations.filter((c) => c.id !== action.id),
        pinnedIds: state.pinnedIds.filter((id) => id !== action.id),
        archivedIds: state.archivedIds.filter((id) => id !== action.id),
        restrictedIds: state.restrictedIds.filter((id) => id !== action.id),
        mutedUntil: Object.fromEntries(
          Object.entries(state.mutedUntil).filter(([id]) => id !== action.id),
        ),
        messages: Object.fromEntries(
          Object.entries(state.messages).filter(([id]) => id !== action.id),
        ),
      };
    case 'updateGroup': {
      const target = state.conversations.find((c) => c.id === action.id);
      if (!target || target.members === undefined) return state;
      const name = action.name.trim();
      const members = action.members.filter(
        (member, index, all) => all.findIndex((other) => other.id === member.id) === index,
      );
      if (name.length === 0 || name.length > MAX_GROUP_NAME) return state;
      if (members.length < MIN_GROUP_MEMBERS) return state;
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.id ? { ...c, name, members } : c,
        ),
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
                lastMessage: last ? messagePreview(last) : '',
                lastMessageAt: last ? last.sentAt : c.lastMessageAt,
              }
            : c,
        ),
      };
    }
  }
}

function toItem(state: ChatsState, conversation: Conversation, pinned: boolean, now: number): ChatListItem {
  return {
    conversation,
    pinned,
    muted: (state.mutedUntil[conversation.id] ?? 0) > now,
    restricted: state.restrictedIds.includes(conversation.id),
  };
}

export function selectChatList(state: ChatsState, now: number = Date.now()): ChatListItem[] {
  const visible = state.conversations.filter((c) => !state.archivedIds.includes(c.id));
  const byId = new Map(visible.map((c) => [c.id, c] as const));

  const pinned: ChatListItem[] = [];
  for (const id of state.pinnedIds) {
    const conversation = byId.get(id);
    if (conversation) pinned.push(toItem(state, conversation, true, now));
  }

  const rest = visible
    .filter((c) => !state.pinnedIds.includes(c.id))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
    .map((conversation) => toItem(state, conversation, false, now));

  return [...pinned, ...rest];
}

export function selectArchived(state: ChatsState, now: number = Date.now()): ChatListItem[] {
  return state.conversations
    .filter((c) => state.archivedIds.includes(c.id))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
    .map((conversation) => toItem(state, conversation, false, now));
}

export type BlockedEntry = { id: string; name: string };

export function selectBlocked(state: ChatsState): BlockedEntry[] {
  return state.blockedIds.map((id) => ({ id, name: state.blockedNames[id] ?? 'Unknown' }));
}
