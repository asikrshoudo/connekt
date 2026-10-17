import type { Message } from '../../types/chat';
import { dayDifference } from '../../utils/dates';
import { formatDayLabel } from '../../utils/formatDayLabel';
import { messagePreview } from '../../utils/messagePreview';

const GROUP_WINDOW_MS = 5 * 60_000;

export type ReplyRef = { direction: Message['direction']; text: string } | { missing: true };

export type TimelineRow =
  | { type: 'separator'; id: string; label: string }
  | {
      type: 'message';
      id: string;
      message: Message;
      reply: ReplyRef | null;
      groupedWithPrevious: boolean;
      showTime: boolean;
    };

function sameDay(a: number, b: number): boolean {
  return dayDifference(a, b) === 0;
}

// Takes messages oldest to newest, returns rows newest first (for an inverted list).
export function buildTimeline(messages: Message[]): TimelineRow[] {
  const rows: TimelineRow[] = [];
  const byId = new Map(messages.map((m) => [m.id, m] as const));

  messages.forEach((message, index) => {
    const previous = index > 0 ? messages[index - 1] : undefined;
    const next = index < messages.length - 1 ? messages[index + 1] : undefined;

    const newDay = !previous || !sameDay(previous.sentAt, message.sentAt);
    if (newDay) {
      rows.push({
        type: 'separator',
        id: `day-${message.id}`,
        label: formatDayLabel(message.sentAt),
      });
    }

    const groupedWithPrevious =
      !newDay &&
      previous !== undefined &&
      previous.direction === message.direction &&
      message.sentAt - previous.sentAt < GROUP_WINDOW_MS;

    const groupedWithNext =
      next !== undefined &&
      sameDay(message.sentAt, next.sentAt) &&
      next.direction === message.direction &&
      next.sentAt - message.sentAt < GROUP_WINDOW_MS;

    let reply: ReplyRef | null = null;
    if (message.replyToId) {
      const original = byId.get(message.replyToId);
      reply = original
        ? { direction: original.direction, text: messagePreview(original) }
        : { missing: true };
    }

    rows.push({
      type: 'message',
      id: message.id,
      message,
      reply,
      groupedWithPrevious,
      showTime: !groupedWithNext,
    });
  });

  return rows.reverse();
}
