import type { MediaItem, Message } from '../../types/chat';

export type SharedMedia = { key: string; item: MediaItem };
export type SharedItems = { media: SharedMedia[]; files: Message[] };

// Photos, videos and files from a chat, newest first. Albums are split into single photos.
export function collectShared(messages: Message[]): SharedItems {
  const media: SharedMedia[] = [];
  const files: Message[] = [];

  for (const message of [...messages].reverse()) {
    const attachment = message.attachment;
    if (!attachment) continue;
    if (attachment.kind === 'image' || attachment.kind === 'video') {
      media.push({ key: message.id, item: attachment });
    } else if (attachment.kind === 'album') {
      attachment.items.forEach((item, index) => {
        media.push({ key: `${message.id}-${index}`, item });
      });
    } else if (attachment.kind === 'file') {
      files.push(message);
    }
  }

  return { media, files };
}
