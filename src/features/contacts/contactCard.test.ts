import assert from 'node:assert/strict';
import { test } from 'node:test';
import { encodeContactCard, parseContactCard } from './contactCard';

const ID = '0123456789abcdef0123456789abcdef';

test('a card survives encode and parse', () => {
  const link = encodeContactCard({ id: ID, name: 'Maya Chen & Co' });
  assert.deepEqual(parseContactCard(link), { id: ID, name: 'Maya Chen & Co' });
});

test('other links and text are rejected', () => {
  assert.equal(parseContactCard('https://example.com'), null);
  assert.equal(parseContactCard('hello'), null);
  assert.equal(parseContactCard(''), null);
});

test('a bad id or empty name is rejected', () => {
  assert.equal(parseContactCard('connekt://contact?v=1&id=abc&name=Maya'), null);
  assert.equal(parseContactCard(`connekt://contact?v=1&id=${ID}&name=%20%20`), null);
  assert.equal(parseContactCard(`connekt://contact?v=2&id=${ID}&name=Maya`), null);
});

test('control characters are removed and long names are cut', () => {
  const clean = parseContactCard(`connekt://contact?v=1&id=${ID}&name=Ma%0Aya`);
  assert.equal(clean?.name, 'Maya');
  const long = parseContactCard(`connekt://contact?v=1&id=${ID}&name=${'x'.repeat(100)}`);
  assert.equal(long?.name.length, 40);
});

test('a broken percent escape is rejected', () => {
  assert.equal(parseContactCard(`connekt://contact?v=1&id=${ID}&name=%E0%A4%A`), null);
});
