import test from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { loadModule } from './module-harness.mjs';

function frame() {
  return { landmarks: Array.from({ length: 33 }, (_, i) => ({ x: 0.3 + i / 100, y: 0.2 + i / 100, z: 0.01, visibility: 1 })),
    worldLandmarks: Array.from({ length: 33 }, (_, i) => ({ x: i % 2 ? -0.2 : 0.2, y: -0.5 + i / 100, z: i / 100, visibility: 1 })) };
}
const rig = value => Object.fromEntries(['RightUpperArm', 'RightLowerArm', 'RightHand',
  'LeftUpperArm', 'LeftLowerArm', 'LeftHand', 'Spine'].map(key => [key, { x: value, y: 0, z: 0 }])
  .concat([['Hips', { rotation: { x: 0, y: 0, z: 0 } }]]));
async function solver(solve) {
  return loadModule('../deja-de-ser-npc/src/solver.js', {
    kalidokit: { Pose: { solve }, RestingDefault: { Pose: rig(0) } }
  });
}

test('validates input, passes world before image, disables legs and does not mutate input', async () => {
  let calls = 0;
  const input = frame();
  const before = structuredClone(input);
  const video = { videoWidth: 640, videoHeight: 480 };
  const { solvePose } = await solver((world, image, options) => {
    calls++;
    assert.deepEqual(JSON.parse(JSON.stringify(world)), input.worldLandmarks);
    assert.deepEqual(JSON.parse(JSON.stringify(image)), input.landmarks);
    assert.equal(options.runtime, 'mediapipe');
    assert.equal(options.enableLegs, false);
    assert.equal(options.video, video);
    return rig(1);
  });
  assert.equal(solvePose(null, video), null);
  assert.equal(solvePose({ landmarks: [] }, video), null);
  assert.equal(solvePose(input, video).Spine.x, 1);
  assert.equal(calls, 1);
  assert.deepEqual(input, before);
  input.worldLandmarks[0].x = NaN;
  assert.equal(solvePose(input, video), null);
});

test('holds only the obscured arm, copies cache and clears it after loss', async () => {
  let value = 0;
  const { solvePose } = await solver(() => rig(++value));
  const input = frame();
  const first = solvePose(input);
  first.RightUpperArm.x = 99;
  input.landmarks[13].visibility = 0.1;
  const held = solvePose(input);
  assert.equal(held.RightUpperArm.x, 1);
  assert.equal(held.LeftUpperArm.x, 2);
  assert.equal(solvePose(null), null);
  assert.equal(solvePose(input).RightUpperArm.x, 0);
});

test('bad library output and errors return null rather than poisoning later frames', async () => {
  const { solvePose } = await solver(() => { throw new Error('inference failure'); });
  assert.equal(solvePose(frame()), null);
  const invalid = await solver(() => rig(NaN));
  assert.equal(invalid.solvePose(frame()), null);
});

test('real pinned Kalidokit 1.1.5 accepts synthetic MediaPipe-shaped frames', {
  skip: !process.env.KALIDOKIT_MODULE && 'Set KALIDOKIT_MODULE to downloaded pinned CDN module'
}, async () => {
  const actual = await import(pathToFileURL(process.env.KALIDOKIT_MODULE));
  const { solvePose } = await loadModule('../deja-de-ser-npc/src/solver.js', { kalidokit: actual });
  const input = frame();
  const first = solvePose(input, { videoWidth: 640, videoHeight: 480 });
  assert.ok(first);
  assert.ok(Number.isFinite(first.Hips.rotation.z));
  input.worldLandmarks[13].z += 0.2;
  const second = solvePose(input);
  assert.notDeepEqual(first.RightUpperArm, second.RightUpperArm);
});
