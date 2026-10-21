import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  parseNotificationSettings,
  shouldNotify,
  type NotificationEvent,
} from './notificationSettings';

const event = (overrides: Partial<NotificationEvent>): NotificationEvent => ({
  kind: 'message',
  muted: false,
  restricted: false,
  blocked: false,
  ...overrides,
});

test('missing or broken data gives the defaults', () => {
  assert.deepEqual(parseNotificationSettings(null), DEFAULT_NOTIFICATION_SETTINGS);
  assert.deepEqual(parseNotificationSettings('nope'), DEFAULT_NOTIFICATION_SETTINGS);
  assert.deepEqual(parseNotificationSettings('5'), DEFAULT_NOTIFICATION_SETTINGS);
});

test('saved choices are kept and bad values are ignored', () => {
  const saved = JSON.stringify({ groups: false, reactions: true, sound: 'loud' });
  const parsed = parseNotificationSettings(saved);
  assert.equal(parsed.groups, false);
  assert.equal(parsed.reactions, true);
  assert.equal(parsed.sound, true);
  assert.equal(parsed.messages, true);
});

test('each kind follows its own switch', () => {
  const off = { ...DEFAULT_NOTIFICATION_SETTINGS, messages: false, groups: false };
  assert.equal(shouldNotify(off, event({ kind: 'message' })), false);
  assert.equal(shouldNotify(off, event({ kind: 'group' })), false);
  assert.equal(shouldNotify(off, event({ kind: 'request' })), true);
  assert.equal(shouldNotify(DEFAULT_NOTIFICATION_SETTINGS, event({ kind: 'reaction' })), false);
});

test('muted, restricted and blocked chats stay quiet', () => {
  const settings = DEFAULT_NOTIFICATION_SETTINGS;
  assert.equal(shouldNotify(settings, event({ muted: true })), false);
  assert.equal(shouldNotify(settings, event({ restricted: true })), false);
  assert.equal(shouldNotify(settings, event({ blocked: true })), false);
  assert.equal(shouldNotify(settings, event({})), true);
});
