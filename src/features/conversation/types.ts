import type { Message } from '../../types/chat';

export type Rect = { x: number; y: number; width: number; height: number };

export type ReplyPreview = { author: string; text: string };

export type MessageMenuTarget = {
  message: Message;
  rect: Rect;
  reply: ReplyPreview | null;
};
