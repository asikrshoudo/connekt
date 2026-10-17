import type { Message } from '../../types/chat';

export type SharedItems = { media: Message[]; files: Message[] };

// Photos, videos and files from a chat, newest first.
export function collectShared(messages: Message[]): SharedItems {
  const newestFirst = [...messages].reverse();
  return {
    media: newestFirst.filter(
      (m) => m.attachment?.kind === 'image' || m.attachment?.kind === 'video',
    ),
    files: newestFirst.filter((m) => m.attachment?.kind === 'file'),
  };
}
