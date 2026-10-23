import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fitRect, pageIndex, shrinkRect } from './viewerGeometry';

test('a wide photo fits the screen width and is centred', () => {
  assert.deepEqual(fitRect(400, 200, 100, 100), { x: 0, y: 25, width: 100, height: 50 });
});

test('a tall photo fits the screen height and is centred', () => {
  assert.deepEqual(fitRect(200, 400, 100, 100), { x: 25, y: 0, width: 50, height: 100 });
});

test('a photo with no size fills the screen', () => {
  assert.deepEqual(fitRect(0, 0, 100, 200), { x: 0, y: 0, width: 100, height: 200 });
});

test('shrinking keeps the same centre', () => {
  assert.deepEqual(shrinkRect({ x: 0, y: 0, width: 100, height: 100 }, 0.5), {
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
});

test('the page number follows the scroll offset and stays in range', () => {
  assert.equal(pageIndex(0, 300, 5), 0);
  assert.equal(pageIndex(310, 300, 5), 1);
  assert.equal(pageIndex(10_000, 300, 5), 4);
  assert.equal(pageIndex(-50, 300, 5), 0);
  assert.equal(pageIndex(100, 0, 5), 0);
});
