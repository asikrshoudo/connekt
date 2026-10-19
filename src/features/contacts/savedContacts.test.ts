import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseSavedContacts } from './savedContacts';

const ID = '0123456789abcdef0123456789abcdef';

test('missing or broken data gives an empty list', () => {
  assert.deepEqual(parseSavedContacts(null), []);
  assert.deepEqual(parseSavedContacts('nope'), []);
  assert.deepEqual(parseSavedContacts('{}'), []);
});

test('valid contacts are kept, invalid and duplicate ones are skipped', () => {
  const raw = JSON.stringify([
    { id: ID, name: ' Maya ' },
    { id: ID, name: 'Maya again' },
    { id: 'short', name: 'Bad id' },
    { id: 'fedcba9876543210fedcba9876543210', name: '' },
    42,
  ]);
  assert.deepEqual(parseSavedContacts(raw), [{ id: ID, name: 'Maya' }]);
});
