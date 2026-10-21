import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  formatTimeout,
  lockoutDelayMs,
  remainingLockoutMs,
  shouldLockAfter,
} from './lockLogic';
import { DEFAULT_LOCK_SETTINGS, parseLockSettings } from './lockSettings';
import { isValidPinFormat, isWeakPin } from './pinPolicy';

test('a PIN must be exactly 6 digits', () => {
  assert.equal(isValidPinFormat('482915'), true);
  assert.equal(isValidPinFormat('48291'), false);
  assert.equal(isValidPinFormat('4829150'), false);
  assert.equal(isValidPinFormat('48a915'), false);
});

test('easy PINs are rejected', () => {
  assert.equal(isWeakPin('111111'), true);
  assert.equal(isWeakPin('123456'), true);
  assert.equal(isWeakPin('654321'), true);
  assert.equal(isWeakPin('482915'), false);
});

test('the app locks only after the chosen time in the background', () => {
  assert.equal(shouldLockAfter(null, 1000, 500), false);
  assert.equal(shouldLockAfter(0, 29_999, 30_000), false);
  assert.equal(shouldLockAfter(0, 30_000, 30_000), true);
});

test('wrong PINs lead to longer waits', () => {
  assert.equal(lockoutDelayMs(4), 0);
  assert.equal(lockoutDelayMs(5), 30_000);
  assert.equal(lockoutDelayMs(6), 60_000);
  assert.equal(lockoutDelayMs(20), 900_000);
  assert.equal(remainingLockoutMs(1000, 400), 600);
  assert.equal(remainingLockoutMs(1000, 2000), 0);
});

test('timeouts are written in plain words', () => {
  assert.equal(formatTimeout(30_000), '30 seconds');
  assert.equal(formatTimeout(60_000), '1 minute');
  assert.equal(formatTimeout(300_000), '5 minutes');
  assert.equal(formatTimeout(3_600_000), '1 hour');
});

test('lock settings fall back to safe defaults', () => {
  assert.deepEqual(parseLockSettings(null), DEFAULT_LOCK_SETTINGS);
  assert.deepEqual(parseLockSettings('nope'), DEFAULT_LOCK_SETTINGS);
  const saved = JSON.stringify({ enabled: true, biometric: true, timeoutMs: 300000 });
  assert.deepEqual(parseLockSettings(saved), {
    enabled: true,
    biometric: true,
    timeoutMs: 300_000,
    blockScreenshots: false,
  });
  assert.equal(parseLockSettings(JSON.stringify({ timeoutMs: 123 })).timeoutMs, 60_000);
});
