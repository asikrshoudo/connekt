export type Member = { id: string; name: string };

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageAt: number;
  unreadCount: number;
  // Present only for group chats.
  members?: Member[];
};

export type ImageItem = { kind: 'image'; uri: string; width: number; height: number };

export type VideoItem = {
  kind: 'video';
  uri: string;
  width: number;
  height: number;
  durationMs: number;
};

export type MediaItem = ImageItem | VideoItem;

export type Attachment =
  | MediaItem
  | { kind: 'file'; uri: string; name: string; size: number | null }
  | { kind: 'voice'; uri: string; durationMs: number }
  | { kind: 'location'; latitude: number; longitude: number }
  | { kind: 'album'; items: MediaItem[] };

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
  forwarded?: boolean;
  // Name of the sender, used in group chats.
  senderName?: string;
};
