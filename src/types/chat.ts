export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageAt: number;
  unreadCount: number;
};

export type Attachment =
  | { kind: 'image'; uri: string; width: number; height: number }
  | { kind: 'video'; uri: string; width: number; height: number; durationMs: number }
  | { kind: 'file'; uri: string; name: string; size: number | null }
  | { kind: 'voice'; uri: string; durationMs: number }
  | { kind: 'location'; latitude: number; longitude: number };

export type OutgoingContent = { text: string; attachment?: Attachment };

export type Message = {
  id: string;
  conversationId: string;
  text: string;
  sentAt: number;
  direction: 'incoming' | 'outgoing';
  reaction?: string;
  replyToId?: string;
  attachment?: Attachment;
};
