export type CallRecord = {
  id: string;
  conversationId: string;
  direction: 'incoming' | 'outgoing';
  kind: 'voice' | 'video';
  missed: boolean;
  at: number;
};
