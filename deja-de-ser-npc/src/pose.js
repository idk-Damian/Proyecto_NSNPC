/**
 * ============================================================================
 * RESPONSABILIDAD: DETECCIÓN (Inferencia y extracción de landmarks corporales)
 * ROL DUEÑO:       Desarrollador de Visión por Computador / IA
 * CONTRATO:        createPoseDetector() -> Promise<{ detect(videoElement, timestampMs) }>
 *                  detect devuelve { landmarks, worldLandmarks } o null si no hay persona
 * ============================================================================
 * 
 * PASOS SUGERIDOS PARA LA IMPLEMENTACIÓN:
 * 1. Inicializar el motor WASM de MediaPipe con FilesetResolver.forVisionTasks.
 * 2. Instanciar PoseLandmarker.createFromOptions cargando el modelo lite (pose_landmarker_lite.task).
 * 3. Configurar runningMode en "VIDEO" y numPoses en 1.
 * 4. PISTA: Configurar aceleración por hardware intentando primero con delegate: "GPU", y si falla o no es soportado, usar "CPU".
 * 5. En el método detect(videoElement, timestampMs), ejecutar poseLandmarker.detectForVideo.
 * 6. Devolver { landmarks: result.landmarks[0], worldLandmarks: result.worldLandmarks[0] } si se detecta una persona, o null si no hay detección.
 */

import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

/**
 * Crea e inicializa el detector de posturas corporales basado en MediaPipe.
 * @returns {Promise<{ detect(videoElement: HTMLVideoElement, timestampMs: number): { landmarks: Array, worldLandmarks: Array } | null }>}
 */
export async function createPoseDetector() {
  // TODO: Inicializar FilesetResolver y PoseLandmarker con el modelo lite y delegate GPU/CPU

  return {
    /**
     * Procesa un fotograma de video y detecta los puntos corporales.
     * @param {HTMLVideoElement} videoElement - Elemento de video fuente.
     * @param {number} timestampMs - Marca de tiempo del fotograma.
     * @returns {{ landmarks: Array, worldLandmarks: Array } | null}
     */
    detect(videoElement, timestampMs) {
      // TODO: Ejecutar detectForVideo y retornar { landmarks, worldLandmarks } o null
      return null;
    }
  };
}
