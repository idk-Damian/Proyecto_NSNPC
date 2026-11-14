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

/**
 * Resuelve las rotaciones de los huesos del esqueleto a partir de los puntos clave corporales.
 * @param {{ landmarks: Array, worldLandmarks: Array } | null} poseResult - Puntos clave 2D y 3D.
 * @param {HTMLVideoElement} videoElement - Elemento de video fuente para dimensiones.
 * @returns {object | null} Objeto rig con rotaciones por hueso o null si no hay datos.
 */
export function solvePose(poseResult, videoElement) {
  // TODO: Resolver cinemática de huesos con Kalidokit.Pose.solve
  return null;
}
