import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Conversation } from '../../types/chat';
import {
  chatsReducer,
  createInitialState,
  MAX_PINNED,
  selectChatList,
  type ChatListItem,
} from './chatsState';

type ChatsContextValue = {
  items: ChatListItem[];
  isSample: boolean;
  canPinMore: boolean;
  pin: (id: string) => void;
  unpin: (id: string) => void;
};

const ChatsContext = createContext<ChatsContextValue | null>(null);

type ProviderProps = {
  initialConversations: Conversation[];
  initialPinnedIds?: string[];
  isSample?: boolean;
  children: ReactNode;
};

export function ChatsProvider({
  initialConversations,
  initialPinnedIds = [],
  isSample = false,
  children,
}: ProviderProps) {
  const [state, dispatch] = useReducer(
    chatsReducer,
    createInitialState(initialConversations, initialPinnedIds),
  );

  const value = useMemo<ChatsContextValue>(
    () => ({
      items: selectChatList(state),
      isSample,
      canPinMore: state.pinnedIds.length < MAX_PINNED,
      pin: (id) => dispatch({ type: 'pin', id }),
      unpin: (id) => dispatch({ type: 'unpin', id }),
    }),
    [state, isSample],
  );

  return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>;
}

export function useChats(): ChatsContextValue {
  const value = useContext(ChatsContext);
  if (!value) throw new Error('useChats must be used inside ChatsProvider');
  return value;
}
