import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDeviceName, shortId } from './deviceFormat';

test('the brand is added in front of the model', () => {
  assert.equal(formatDeviceName('xiaomi', 'Redmi 10 Prime'), 'Xiaomi Redmi 10 Prime');
  assert.equal(formatDeviceName('samsung', 'SM-A515F'), 'Samsung SM-A515F');
});

test('the brand is not repeated when the model already starts with it', () => {
  assert.equal(formatDeviceName('Redmi', 'Redmi 10 Prime'), 'Redmi 10 Prime');
  assert.equal(formatDeviceName('google', 'Google Pixel 8'), 'Google Pixel 8');
});

test('missing details still give a readable name', () => {
  assert.equal(formatDeviceName('', ''), 'This phone');
  assert.equal(formatDeviceName('oppo', ''), 'Oppo');
  assert.equal(formatDeviceName('', 'X1'), 'X1');
});

test('long ids are shortened and short ones are kept', () => {
  assert.equal(shortId('0123456789abcdef0123456789abcdef'), '0123...cdef');
  assert.equal(shortId('abc'), 'abc');
});
