import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isReplySwipe, MAX_OFFSET, REPLY_THRESHOLD, resistedOffset } from './swipeLogic';

test('a short drag follows the finger exactly', () => {
  assert.equal(resistedOffset(20), 20);
  assert.equal(resistedOffset(-30), -30);
  assert.equal(resistedOffset(REPLY_THRESHOLD), REPLY_THRESHOLD);
});

test('past the threshold the message moves less than the finger', () => {
  const far = resistedOffset(REPLY_THRESHOLD + 40);
  assert.ok(far > REPLY_THRESHOLD);
  assert.ok(far < REPLY_THRESHOLD + 40);
});

test('the message never moves past the maximum, in either direction', () => {
  assert.equal(resistedOffset(1000), MAX_OFFSET);
  assert.equal(resistedOffset(-1000), -MAX_OFFSET);
});

test('a reply starts only after a long enough drag, left or right', () => {
  assert.equal(isReplySwipe(REPLY_THRESHOLD - 1), false);
  assert.equal(isReplySwipe(REPLY_THRESHOLD), true);
  assert.equal(isReplySwipe(-REPLY_THRESHOLD), true);
  assert.equal(isReplySwipe(-10), false);
});
