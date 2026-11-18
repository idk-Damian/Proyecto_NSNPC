/**
 * ============================================================================
 * RESPONSABILIDAD: ANIMACIÓN (Cinemática inversa con Kalidokit)
 * ROL DUEÑO:       Desarrollador de Animación / Cinemática
 * CONTRATO:        solvePose(poseResult, videoElement) -> rig
 *                  (rotaciones por hueso, en el formato que devuelve Kalidokit)
 * ============================================================================
 * 
 * PASOS SUGERIDOS PARA LA IMPLEMENTACIÓN:
 * 1. Validar que poseResult contenga tanto landmarks como worldLandmarks válidos; si no, retornar null.
 * 2. PISTA: Invocar Kalidokit.Pose.solve(worldLandmarks, landmarks, { runtime: 'mediapipe', video, enableLegs }).
 * 3. OJO: Configurar enableLegs en false en el MVP (la mayoría de usuarios solo muestran medio cuerpo en webcam).
 * 4. PISTA: Probar primero que la API de Kalidokit resuelva correctamente con los landmarks de la versión actual de MediaPipe Tasks Vision.
 * 5. Retornar el objeto rig resultante con las rotaciones Euler de hombros, brazos, espina y caderas.
 */

import * as Kalidokit from 'kalidokit';

const ENABLE_LEGS = false;
const MIN_VISIBILITY = 0.5;
// Convención espejo de Kalidokit 1.1.5: índices MediaPipe izquierdos -> Right.
const ARM_POINTS = { Right: [11, 13, 15, 17, 19], Left: [12, 14, 16, 18, 20] };
let lastArms = {};

function validLandmarks(points) {
  return Array.isArray(points) && points.length === 33 && points.every(point => point
    && ['x', 'y', 'z'].every(axis => Number.isFinite(point[axis]))
    && (point.visibility === undefined || Number.isFinite(point.visibility)));
}

function finiteRig(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (value && typeof value === 'object') return Object.values(value).every(finiteRig);
  return value !== null && value !== undefined;
}

// Copias planas evitan que el consumidor modifique el estado retenido.
function copy(value) {
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copy(item)]));
  }
  return value;
}

/**
 * Resuelve las rotaciones de los huesos del esqueleto a partir de los puntos clave corporales.
 * @param {{ landmarks: Array, worldLandmarks: Array } | null} poseResult - Puntos clave 2D y 3D.
 * @param {HTMLVideoElement} videoElement - Elemento de video fuente para dimensiones.
 * @returns {object | null} Objeto rig con rotaciones por hueso o null si no hay datos.
 */
export function solvePose(poseResult, videoElement) {
  if (!validLandmarks(poseResult?.landmarks) || !validLandmarks(poseResult?.worldLandmarks)) {
    lastArms = {};
    return null;
  }
  const { landmarks, worldLandmarks } = poseResult;
  try {
    const rig = copy(Kalidokit.Pose.solve(worldLandmarks.map(point => ({ ...point })),
      landmarks.map(point => ({ ...point })), {
        runtime: 'mediapipe', video: videoElement, enableLegs: ENABLE_LEGS
      }));
    if (!rig?.Hips || !rig?.Spine) throw new Error('Rig incompleto');
    for (const [side, indices] of Object.entries(ARM_POINTS)) {
      const visible = indices.every(index => (landmarks[index].visibility ?? 0) >= MIN_VISIBILITY
        && (worldLandmarks[index].visibility ?? 0) >= MIN_VISIBILITY);
      for (const joint of ['UpperArm', 'LowerArm', 'Hand']) {
        const key = side + joint;
        if (!visible) {
          rig[key] = copy(lastArms[key] ?? {
            x: 0, y: 0, z: joint === 'UpperArm' ? (side === 'Right' ? -1.25 : 1.25) : 0
          });
        }
      }
    }
    const rotations = [rig.Spine, rig.Hips.rotation, ...Object.keys(ARM_POINTS)
      .flatMap(side => ['UpperArm', 'LowerArm', 'Hand'].map(joint => rig[side + joint]))];
    if (!rotations.every(rotation => rotation && ['x', 'y', 'z']
      .every(axis => Number.isFinite(rotation[axis]))) || !finiteRig(rig)) {
      throw new Error('Rig incompleto o no finito');
    }
    for (const [side, indices] of Object.entries(ARM_POINTS)) {
      if (indices.every(index => (landmarks[index].visibility ?? 0) >= MIN_VISIBILITY
          && (worldLandmarks[index].visibility ?? 0) >= MIN_VISIBILITY)) {
        for (const joint of ['UpperArm', 'LowerArm', 'Hand']) {
          const key = side + joint;
          lastArms[key] = copy(rig[key]);
        }
      }
    }
    return rig;
  } catch {
    lastArms = {};
    return null;
  }
}
