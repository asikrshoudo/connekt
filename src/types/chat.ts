export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageAt: number;
  unreadCount: number;
};

export type Message = {
  id: string;
  conversationId: string;
  text: string;
  sentAt: number;
  direction: 'incoming' | 'outgoing';
};
