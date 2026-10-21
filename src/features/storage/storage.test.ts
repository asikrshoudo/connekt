import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Conversation, Message } from '../../types/chat';
import { formatFileSize } from '../../utils/format';
import { describeCounts, summarizeChatStorage } from './chatStorage';

const chat = (id: string): Conversation => ({
  id,
  name: id,
  lastMessage: '',
  lastMessageAt: 0,
  unreadCount: 0,
});

const withAttachment = (id: string, attachment: Message['attachment']): Message => ({
  id: `${id}-${Math.random()}`,
  conversationId: id,
  text: '',
  sentAt: 1,
  direction: 'outgoing',
  attachment,
});

test('media is counted per chat and only app files add bytes', () => {
  const messages = {
    a: [
      withAttachment('a', { kind: 'image', uri: 'content://gallery/1', width: 1, height: 1 }),
      withAttachment('a', { kind: 'file', uri: 'file:///cache/doc.pdf', name: 'doc.pdf', size: 10 }),
      withAttachment('a', { kind: 'voice', uri: 'file:///cache/v.m4a', durationMs: 1000 }),
      withAttachment('a', { kind: 'location', latitude: 1, longitude: 2 }),
    ],
    b: [],
  };
  const rows = summarizeChatStorage(
    [chat('a'), chat('b')],
    messages,
    (uri) => uri.startsWith('file:///cache'),
    () => 500,
  );
  assert.equal(rows.length, 1);
  const row = rows[0];
  assert.ok(row);
  assert.equal(row.photos, 1);
  assert.equal(row.files, 1);
  assert.equal(row.voice, 1);
  assert.equal(row.bytes, 1000);
  assert.equal(describeCounts(row), '1 photo, 1 file, 1 voice message');
});

test('chats with the most stored data come first', () => {
  const file = (id: string) =>
    withAttachment(id, { kind: 'file', uri: `file:///cache/${id}`, name: id, size: null });
  const rows = summarizeChatStorage(
    [chat('small'), chat('big')],
    { small: [file('small')], big: [file('big'), file('big')] },
    () => true,
    () => 100,
  );
  assert.deepEqual(
    rows.map((row) => row.id),
    ['big', 'small'],
  );
});

test('sizes are written in plain units', () => {
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(2048), '2 KB');
  assert.equal(formatFileSize(5 * 1024 * 1024), '5.0 MB');
  assert.equal(formatFileSize(3 * 1024 * 1024 * 1024), '3.0 GB');
});
