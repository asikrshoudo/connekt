import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type { Conversation, Message, OutgoingContent } from '../../types/chat';
import type { MessageRequest } from '../../types/request';
import {
  chatsReducer,
  createInitialState,
  MAX_PINNED,
  selectChatList,
  type ChatListItem,
} from './chatsState';

const NO_MESSAGES: Message[] = [];

type ChatsContextValue = {
  items: ChatListItem[];
  isSample: boolean;
  canPinMore: boolean;
  pin: (id: string) => void;
  unpin: (id: string) => void;
  markRead: (id: string) => void;
  send: (conversationId: string, content: OutgoingContent, replyToId?: string) => void;
  react: (conversationId: string, messageId: string, emoji: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  startChat: (id: string, name: string) => void;
  requests: MessageRequest[];
  isBlocked: (id: string) => boolean;
  acceptRequest: (id: string) => void;
  declineRequest: (id: string) => void;
  blockRequest: (id: string) => void;
  block: (id: string) => void;
  unblock: (id: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  getMessages: (id: string) => Message[];
};

const ChatsContext = createContext<ChatsContextValue | null>(null);

type ProviderProps = {
  initialConversations: Conversation[];
  initialMessages?: Record<string, Message[]>;
  initialPinnedIds?: string[];
  initialRequests?: MessageRequest[];
  isSample?: boolean;
  children: ReactNode;
};

export function ChatsProvider({
  initialConversations,
  initialMessages = {},
  initialPinnedIds = [],
  initialRequests = [],
  isSample = false,
  children,
}: ProviderProps) {
  const [state, dispatch] = useReducer(
    chatsReducer,
    createInitialState(initialConversations, initialPinnedIds, initialMessages, initialRequests),
  );
  const counter = useRef(0);

  const pin = useCallback((id: string) => dispatch({ type: 'pin', id }), []);
  const unpin = useCallback((id: string) => dispatch({ type: 'unpin', id }), []);
  const markRead = useCallback((id: string) => dispatch({ type: 'markRead', id }), []);
  const send = useCallback((conversationId: string, content: OutgoingContent, replyToId?: string) => {
    counter.current += 1;
    dispatch({
      type: 'send',
      conversationId,
      text: content.text,
      attachment: content.attachment,
      replyToId,
      messageId: `local-${Date.now()}-${counter.current}`,
      sentAt: Date.now(),
    });
  }, []);
  const react = useCallback(
    (conversationId: string, messageId: string, emoji: string) =>
      dispatch({ type: 'react', conversationId, messageId, emoji }),
    [],
  );
  const deleteMessage = useCallback(
    (conversationId: string, messageId: string) =>
      dispatch({ type: 'deleteMessage', conversationId, messageId }),
    [],
  );

  const startChat = useCallback(
    (id: string, name: string) => dispatch({ type: 'startChat', id, name, now: Date.now() }),
    [],
  );

  const acceptRequest = useCallback((id: string) => dispatch({ type: 'acceptRequest', id }), []);
  const declineRequest = useCallback((id: string) => dispatch({ type: 'declineRequest', id }), []);
  const blockRequest = useCallback((id: string) => dispatch({ type: 'blockRequest', id }), []);
  const block = useCallback((id: string) => dispatch({ type: 'block', id }), []);
  const unblock = useCallback((id: string) => dispatch({ type: 'unblock', id }), []);

  const value = useMemo<ChatsContextValue>(
    () => ({
      items: selectChatList(state),
      isSample,
      canPinMore: state.pinnedIds.length < MAX_PINNED,
      pin,
      unpin,
      markRead,
      send,
      react,
      deleteMessage,
      startChat,
      requests: state.requests,
      isBlocked: (id) => state.blockedIds.includes(id),
      acceptRequest,
      declineRequest,
      blockRequest,
      block,
      unblock,
      getConversation: (id) => state.conversations.find((c) => c.id === id),
      getMessages: (id) => state.messages[id] ?? NO_MESSAGES,
    }),
    [
      state,
      isSample,
      pin,
      unpin,
      markRead,
      send,
      react,
      deleteMessage,
      startChat,
      acceptRequest,
      declineRequest,
      blockRequest,
      block,
      unblock,
    ],
  );

  return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>;
}

export function useChats(): ChatsContextValue {
  const value = useContext(ChatsContext);
  if (!value) throw new Error('useChats must be used inside ChatsProvider');
  return value;
}
