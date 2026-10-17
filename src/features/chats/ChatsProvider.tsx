import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type { Conversation, Message } from '../../types/chat';
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
  send: (conversationId: string, text: string, replyToId?: string) => void;
  react: (conversationId: string, messageId: string, emoji: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  getMessages: (id: string) => Message[];
};

const ChatsContext = createContext<ChatsContextValue | null>(null);

type ProviderProps = {
  initialConversations: Conversation[];
  initialMessages?: Record<string, Message[]>;
  initialPinnedIds?: string[];
  isSample?: boolean;
  children: ReactNode;
};

export function ChatsProvider({
  initialConversations,
  initialMessages = {},
  initialPinnedIds = [],
  isSample = false,
  children,
}: ProviderProps) {
  const [state, dispatch] = useReducer(
    chatsReducer,
    createInitialState(initialConversations, initialPinnedIds, initialMessages),
  );
  const counter = useRef(0);

  const pin = useCallback((id: string) => dispatch({ type: 'pin', id }), []);
  const unpin = useCallback((id: string) => dispatch({ type: 'unpin', id }), []);
  const markRead = useCallback((id: string) => dispatch({ type: 'markRead', id }), []);
  const send = useCallback((conversationId: string, text: string, replyToId?: string) => {
    counter.current += 1;
    dispatch({
      type: 'send',
      conversationId,
      text,
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
      getConversation: (id) => state.conversations.find((c) => c.id === id),
      getMessages: (id) => state.messages[id] ?? NO_MESSAGES,
    }),
    [state, isSample, pin, unpin, markRead, send, react, deleteMessage],
  );

  return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>;
}

export function useChats(): ChatsContextValue {
  const value = useContext(ChatsContext);
  if (!value) throw new Error('useChats must be used inside ChatsProvider');
  return value;
}
