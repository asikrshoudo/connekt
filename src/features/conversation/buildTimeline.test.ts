import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Message } from '../../types/chat';
import { buildTimeline } from './buildTimeline';

const message = (id: string, direction: Message['direction'], sentAt: number): Message => ({
  id,
  conversationId: 'c',
  text: id,
  sentAt,
  direction,
});

test('groups close messages from one sender and adds a day separator', () => {
  const noon = new Date(2026, 0, 10, 12, 0).getTime();
  const rows = buildTimeline([
    message('a', 'incoming', noon),
    message('b', 'incoming', noon + 60_000),
    message('c', 'outgoing', noon + 120_000),
  ]);

  // Newest first, the day separator comes last.
  assert.deepEqual(
    rows.map((row) => row.type),
    ['message', 'message', 'message', 'separator'],
  );
  const second = rows[1];
  assert.ok(second && second.type === 'message' && second.groupedWithPrevious);
});

test('replies point to the original message', () => {
  const noon = new Date(2026, 0, 10, 12, 0).getTime();
  const reply: Message = { ...message('r', 'outgoing', noon + 1000), replyToId: 'a' };
  const rows = buildTimeline([message('a', 'incoming', noon), reply]);
  const newest = rows[0];
  assert.ok(newest && newest.type === 'message' && newest.reply !== null);
});
