import type { Message } from '../types/chat';

// Short text for a message in lists and reply quotes.
export function messagePreview(message: Message): string {
  const attachment = message.attachment;
  if (!attachment) return message.text;
  switch (attachment.kind) {
    case 'image':
      return 'Photo';
    case 'video':
      return 'Video';
    case 'file':
      return attachment.name;
    case 'voice':
      return 'Voice message';
    case 'location':
      return 'Location';
    case 'album': {
      const total = attachment.items.length;
      const videos = attachment.items.filter((item) => item.kind === 'video').length;
      if (videos === 0) return `${total} photos`;
      if (videos === total) return `${total} videos`;
      return `${total} photos and videos`;
    }
  }
}
