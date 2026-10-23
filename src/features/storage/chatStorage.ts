import type { Conversation, Message } from '../../types/chat';

export type ChatStorageRow = {
  id: string;
  name: string;
  photos: number;
  videos: number;
  files: number;
  voice: number;
  bytes: number;
};

// Counts the media in each chat. Bytes only count files Connekt keeps in its own folders;
// photos and videos picked from the gallery are not copied, so they add nothing.
export function summarizeChatStorage(
  conversations: Conversation[],
  messagesByChat: Record<string, Message[]>,
  isAppFile: (uri: string) => boolean,
  sizeOf: (uri: string) => number,
): ChatStorageRow[] {
  const rows: ChatStorageRow[] = [];

  for (const conversation of conversations) {
    const row: ChatStorageRow = {
      id: conversation.id,
      name: conversation.name,
      photos: 0,
      videos: 0,
      files: 0,
      voice: 0,
      bytes: 0,
    };

    for (const message of messagesByChat[conversation.id] ?? []) {
      const attachment = message.attachment;
      if (!attachment || attachment.kind === 'location') continue;
      const parts = attachment.kind === 'album' ? attachment.items : [attachment];
      for (const part of parts) {
        if (part.kind === 'image') row.photos += 1;
        else if (part.kind === 'video') row.videos += 1;
        else if (part.kind === 'file') row.files += 1;
        else row.voice += 1;
        if (isAppFile(part.uri)) row.bytes += sizeOf(part.uri);
      }
    }

    if (row.photos + row.videos + row.files + row.voice > 0) rows.push(row);
  }

  return rows.sort((a, b) => b.bytes - a.bytes);
}

function count(n: number, one: string, many: string): string | null {
  if (n === 0) return null;
  return n === 1 ? `1 ${one}` : `${n} ${many}`;
}

export function describeCounts(row: ChatStorageRow): string {
  return [
    count(row.photos, 'photo', 'photos'),
    count(row.videos, 'video', 'videos'),
    count(row.files, 'file', 'files'),
    count(row.voice, 'voice message', 'voice messages'),
  ]
    .filter((part): part is string => part !== null)
    .join(', ');
}
