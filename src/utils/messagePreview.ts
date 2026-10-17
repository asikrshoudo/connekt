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
  }
}
