import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './module-harness.mjs';

test('loss of person clears retained rotations without changing camera startup', async () => {
  const events = [];
  const frame = { landmarks: [{ x: 0, y: 0 }], worldLandmarks: [] };
  const frames = [frame, null];
  const video = {};
  let next;
  await loadModule('../deja-de-ser-npc/src/main.js', {
    './camera.js': { startCamera: async value => { assert.equal(value, video); events.push('camera'); } },
    './pose.js': { createPoseDetector: async () => ({ detect: () => frames.shift() }) },
    './smoothing.js': { smoothLandmarks: points => points },
    './solver.js': { solvePose: (value, source) => { assert.equal(source, video); events.push(value); return value; } },
    './scene.js': { initScene() {}, loadAvatar() {}, startRenderLoop() {}, applyRig() {} },
    './avatars.js': { AVATARS: [] }, './ui.js': { initUI() {} }
  }, {
    document: { readyState: 'complete', getElementById: () => video },
    requestAnimationFrame: callback => { next = callback; }
  });
  await new Promise(resolve => setImmediate(resolve));
  next();
  assert.equal(events[0], 'camera');
  assert.equal(events[1].landmarks, frame.landmarks);
  assert.equal(events[2], null);
});
