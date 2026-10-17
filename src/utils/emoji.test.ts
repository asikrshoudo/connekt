import assert from 'node:assert/strict';
import { test } from 'node:test';
import { countEmoji } from './emoji';

test('counts emoji-only text', () => {
  assert.equal(countEmoji('😂'), 1);
  assert.equal(countEmoji('😂😂😂'), 3);
  assert.equal(countEmoji('❤️'), 1);
  assert.equal(countEmoji('👍🏽'), 1);
  assert.equal(countEmoji('🇧🇩'), 1);
});

test('returns 0 for text that is not only emoji', () => {
  assert.equal(countEmoji('hi 😂'), 0);
  assert.equal(countEmoji('hello'), 0);
  assert.equal(countEmoji(''), 0);
});
