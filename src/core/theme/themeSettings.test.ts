import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_THEME_SETTINGS, parseThemeSettings, resolveScheme } from './themeSettings';

test('missing or broken data gives the defaults', () => {
  assert.deepEqual(parseThemeSettings(null), DEFAULT_THEME_SETTINGS);
  assert.deepEqual(parseThemeSettings('nope'), DEFAULT_THEME_SETTINGS);
  assert.deepEqual(parseThemeSettings('7'), DEFAULT_THEME_SETTINGS);
});

test('valid settings are kept', () => {
  const saved = JSON.stringify({ themeId: 'material', mode: 'light' });
  assert.deepEqual(parseThemeSettings(saved), { themeId: 'material', mode: 'light' });
});

test('unknown theme or mode falls back', () => {
  const saved = JSON.stringify({ themeId: 'pink', mode: 'sepia' });
  assert.deepEqual(parseThemeSettings(saved), DEFAULT_THEME_SETTINGS);
});

test('system mode follows the phone and defaults to dark', () => {
  assert.equal(resolveScheme('system', 'light'), 'light');
  assert.equal(resolveScheme('system', 'dark'), 'dark');
  assert.equal(resolveScheme('system', null), 'dark');
  assert.equal(resolveScheme('light', 'dark'), 'light');
});
