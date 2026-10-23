import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Attachment, MediaItem, Message } from '../../types/chat';
import { messagePreview } from '../../utils/messagePreview';
import { collectShared } from '../contacts/sharedMedia';
import { albumLayout, groupMedia } from './albums';

const photo = (n: number): MediaItem => ({
  kind: 'image',
  uri: `file:///p${n}.jpg`,
  width: 10,
  height: 10,
});
const video = (n: number): MediaItem => ({
  kind: 'video',
  uri: `file:///v${n}.mp4`,
  width: 10,
  height: 10,
  durationMs: 1000,
});
const message = (attachment: Attachment, id = 'm'): Message => ({
  id,
  conversationId: 'c',
  text: '',
  sentAt: 1,
  direction: 'outgoing',
  attachment,
});

test('a single photo stays a single photo', () => {
  assert.deepEqual(groupMedia([photo(1)]), [photo(1)]);
});

test('two or more photos and videos become one album', () => {
  const grouped = groupMedia([photo(1), video(2), photo(3)]);
  assert.equal(grouped.length, 1);
  const first = grouped[0];
  assert.ok(first && first.kind === 'album');
  assert.equal(first.items.length, 3);
});

test('files and voice messages are not put into the album', () => {
  const file: Attachment = { kind: 'file', uri: 'file:///a.pdf', name: 'a.pdf', size: 1 };
  const grouped = groupMedia([photo(1), file, photo(2)]);
  assert.equal(grouped.length, 2);
  assert.equal(grouped[0]?.kind, 'album');
  assert.equal(grouped[1]?.kind, 'file');
});

test('every tile fits inside the album frame', () => {
  for (const count of [1, 2, 3, 4, 5, 8, 10]) {
    const layout = albumLayout(count, 250);
    for (const tile of layout.tiles) {
      assert.ok(tile.x >= 0 && tile.y >= 0);
      assert.ok(tile.x + tile.width <= layout.width);
      assert.ok(tile.y + tile.height <= layout.height);
    }
  }
});

test('at most four tiles show, and the rest is counted', () => {
  assert.equal(albumLayout(2, 250).tiles.length, 2);
  assert.equal(albumLayout(3, 250).tiles.length, 3);
  assert.equal(albumLayout(4, 250).hidden, 0);
  const many = albumLayout(10, 250);
  assert.equal(many.tiles.length, 4);
  assert.equal(many.hidden, 6);
});

test('an album is described in the chat list', () => {
  assert.equal(messagePreview(message({ kind: 'album', items: [photo(1), photo(2), photo(3)] })), '3 photos');
  assert.equal(messagePreview(message({ kind: 'album', items: [video(1), video(2)] })), '2 videos');
  assert.equal(
    messagePreview(message({ kind: 'album', items: [photo(1), video(2)] })),
    '2 photos and videos',
  );
});

test('shared media lists every photo of an album on its own', () => {
  const shared = collectShared([
    message({ kind: 'album', items: [photo(1), photo(2), photo(3)] }, 'a'),
    message(photo(4), 'b'),
  ]);
  assert.equal(shared.media.length, 4);
  assert.equal(shared.files.length, 0);
});
