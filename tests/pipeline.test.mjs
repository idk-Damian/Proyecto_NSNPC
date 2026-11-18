import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './module-harness.mjs';
import { createLandmarkSmoother } from '../deja-de-ser-npc/src/smoothing.js';

test('tracking smooths both spaces independently and resets after loss', async () => {
  const points = x => [{ x, y: x, z: x }];
  const frames = [0, 1, null, 2].map(x => x === null ? null
    : { landmarks: points(x), worldLandmarks: points(100 + x) });
  const rigs = [];
  let next;
  let now = 0;
  await loadModule('../deja-de-ser-npc/src/main.js', {
    './camera.js': { startCamera: async () => {} },
    './pose.js': { createPoseDetector: async () => ({ detect: () => frames.shift() }) },
    './smoothing.js': { createLandmarkSmoother },
    './solver.js': { solvePose: value => value },
    './scene.js': { initScene() {}, loadAvatar() {}, startRenderLoop() {}, applyRig: rig => rigs.push(rig) },
    './avatars.js': { AVATARS: [] },
    './ui.js': { initUI() {} }
  }, {
    document: { readyState: 'complete', getElementById() {} },
    performance: { now: () => (now += 100) },
    requestAnimationFrame: callback => { next = callback; }
  });
  await new Promise(resolve => setImmediate(resolve));
  next(); next(); next();
  assert.equal(rigs[0].worldLandmarks[0].x, 100);
  assert.ok(rigs[1].landmarks[0].x > 0 && rigs[1].landmarks[0].x < 1);
  assert.ok(rigs[1].worldLandmarks[0].x > 100 && rigs[1].worldLandmarks[0].x < 101);
  assert.equal(rigs[2], null);
  assert.equal(rigs[3].landmarks[0].x, 2);
  assert.equal(rigs[3].worldLandmarks[0].x, 102);
});
