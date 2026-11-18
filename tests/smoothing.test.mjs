import test from 'node:test';
import assert from 'node:assert/strict';
import * as smoothing from '../deja-de-ser-npc/src/smoothing.js';

test('legacy smoother returns copies and resets on empty input', () => {
  smoothing.smoothLandmarks(null);
  const input = [{ x: 0, y: 1, z: 2, visibility: 0.9 }];
  const output = smoothing.smoothLandmarks(input);
  assert.deepEqual(output, input);
  assert.notEqual(output, input);
  assert.notEqual(output[0], input[0]);
  assert.equal(smoothing.smoothLandmarks([]), null);
});

test('One Euro smooths each coordinate and preserves metadata without mutation', () => {
  const smooth = smoothing.createLandmarkSmoother({ beta: 0 });
  smooth([{ x: 0, y: 0, z: 0 }], 0);
  const point = { x: 1, y: 2, z: -1, visibility: 0.2 };
  const [result] = smooth([point], 100);
  const alpha = 1 / (1 + 1 / (2 * Math.PI * 0.1));
  assert.ok(Math.abs(result.x - alpha) < 1e-12);
  assert.equal(result.y, 2 * result.x);
  assert.equal(result.z, -result.x);
  assert.equal(result.visibility, 0.2);
  assert.equal(point.x, 1);
});

test('separate streams, resets and repeated timestamps cannot contaminate each other', () => {
  const image = smoothing.createLandmarkSmoother();
  const world = smoothing.createLandmarkSmoother();
  image([{ x: 0, y: 0 }], 0);
  assert.equal(world([{ x: 100, y: 100 }], 0)[0].x, 100);
  assert.equal(image([{ x: 1, y: 1 }], 0)[0].x, 0);
  assert.equal(image(null), null);
  assert.equal(image([{ x: 1, y: 1 }], 100)[0].x, 1);
  assert.equal(image([{ x: 2, y: 2 }, { x: 3, y: 3 }], 200)[0].x, 2);
  assert.equal(image([{ x: NaN, y: 0 }], 300), null);
});

test('adaptive cutoff reduces fast-motion lag and invalid configuration is rejected', () => {
  const fixed = smoothing.createLandmarkSmoother({ beta: 0 });
  const adaptive = smoothing.createLandmarkSmoother({ beta: 1 });
  for (const smooth of [fixed, adaptive]) smooth([{ x: 0, y: 0 }], 0);
  assert.ok(adaptive([{ x: 1, y: 1 }], 16)[0].x > fixed([{ x: 1, y: 1 }], 16)[0].x);
  assert.throws(() => smoothing.createLandmarkSmoother({ minCutoff: 0 }), RangeError);
});

test('frozen input and optional z preserve independent metadata', () => {
  const smooth = smoothing.createLandmarkSmoother({ beta: 0 });
  const input = Object.freeze([Object.freeze({ x: 0, y: 0, visibility: 0.8, presence: 0.9 })]);
  const [first] = smooth(input, 0);
  assert.notEqual(first, input[0]);
  const [next] = smooth([{ ...input[0], x: 1, z: 2 }], 100);
  assert.equal(next.visibility, 0.8);
  assert.equal(next.presence, 0.9);
  assert.equal(next.z, 2);
});
