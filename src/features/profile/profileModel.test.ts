import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_PROFILE, MAX_NAME, parseProfile } from './profileModel';

test('missing or broken data gives the default profile', () => {
  assert.deepEqual(parseProfile(null), DEFAULT_PROFILE);
  assert.deepEqual(parseProfile('not json'), DEFAULT_PROFILE);
  assert.deepEqual(parseProfile('42'), DEFAULT_PROFILE);
});

test('valid data is kept and trimmed', () => {
  const profile = parseProfile(
    JSON.stringify({ displayName: '  Shoudo  ', about: 'hi', photoUri: 'file:///a.jpg' }),
  );
  assert.equal(profile.displayName, 'Shoudo');
  assert.equal(profile.about, 'hi');
  assert.equal(profile.photoUri, 'file:///a.jpg');
});

test('an empty name falls back and a long name is cut', () => {
  assert.equal(parseProfile(JSON.stringify({ displayName: '   ' })).displayName, 'You');
  const long = 'x'.repeat(MAX_NAME + 20);
  assert.equal(parseProfile(JSON.stringify({ displayName: long })).displayName.length, MAX_NAME);
});
