/**
 * ============================================================================
 * RESPONSABILIDAD: DETECCIÓN (Inferencia y extracción de landmarks corporales)
 * ROL DUEÑO:       Desarrollador de Visión por Computador / IA
 * CONTRATO:        createPoseDetector() -> Promise<{ detect(videoElement, timestampMs) }>
 *                  detect devuelve { landmarks, worldLandmarks } o null si no hay persona
 * ============================================================================
 * 
 * Inicializa y administra el modelo PoseLandmarker de MediaPipe Tasks Vision.
 * Procesa fotogramas de video continuos para extraer las coordenadas de los 33
 * puntos clave corporales 2D y 3D en el espacio métrico real.
 */

import { FilesetResolver, PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';

// Constantes de configuración de MediaPipe PoseLandmarker
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm';
const NUM_POSES = 1;
const MIN_VISIBILITY = 0.5;

/**
 * Crea e inicializa el detector de posturas corporales basado en MediaPipe.
 * @returns {Promise<{ detect(videoElement: HTMLVideoElement, timestampMs: number): { landmarks: Array, worldLandmarks: Array } | null }>}
 */
export async function createPoseDetector() {
  const isDebug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';

  let debugCanvas = null;
  let debugCtx = null;
  let drawingUtils = null;

  if (isDebug) {
    debugCanvas = document.createElement('canvas');
    debugCanvas.width = 320;
    debugCanvas.height = 240;
    debugCanvas.style.position = 'fixed';
    debugCanvas.style.bottom = '10px';
    debugCanvas.style.right = '10px';
    debugCanvas.style.zIndex = '9999';
    debugCanvas.style.pointerEvents = 'none';
    debugCanvas.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    debugCanvas.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    document.body.appendChild(debugCanvas);
    debugCtx = debugCanvas.getContext('2d');
    drawingUtils = new DrawingUtils(debugCtx);
  }

  const vision = await FilesetResolver.forVisionTasks(WASM_URL);
  let poseLandmarker = null;
  let activeDelegate = 'GPU';

  try {
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numPoses: NUM_POSES
    });
  } catch (gpuError) {
    console.warn('[pose.js] Inicialización con GPU no disponible. Intentando con CPU...', gpuError);
    try {
      activeDelegate = 'CPU';
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'CPU'
        },
        runningMode: 'VIDEO',
        numPoses: NUM_POSES
      });
    } catch (cpuError) {
      throw new Error(
        `Fallo crítico: No se pudo inicializar PoseLandmarker ni con GPU ni con CPU: ${cpuError.message}`,
        { cause: cpuError }
      );
    }
  }

  console.info(`[pose.js] PoseLandmarker inicializado con delegate: ${activeDelegate}`);

  // Variables de control de estado entre fotogramas
  let lastVideoTime = -1;
  let lastResult = null;
  let lastTimestampMs = -1;
  let lastWarnTime = 0;
  let lastDebugLogTime = performance.now();
  let totalInferenceTime = 0;
  let inferenceCount = 0;

  function renderDebug(videoElement, landmarks) {
    if (!debugCtx || !debugCanvas) return;
    debugCtx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
    debugCtx.save();
    // Espejar horizontalmente para vista natural de espejo
    debugCtx.scale(-1, 1);
    debugCtx.translate(-debugCanvas.width, 0);
    debugCtx.drawImage(videoElement, 0, 0, debugCanvas.width, debugCanvas.height);

    if (landmarks && drawingUtils) {
      drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
        color: '#00ff88',
        lineWidth: 2
      });
      drawingUtils.drawLandmarks(landmarks, {
        color: '#ff0055',
        lineWidth: 1,
        radius: 2
      });
    }
    debugCtx.restore();
  }

  return {
    /**
     * Procesa un fotograma de video y detecta los puntos corporales.
     * @param {HTMLVideoElement} videoElement - Elemento de video fuente.
     * @param {number} timestampMs - Marca de tiempo del fotograma en milisegundos.
     * @returns {{ landmarks: Array, worldLandmarks: Array } | null}
     */
    detect(videoElement, timestampMs) {
      // 1. Si el video no está listo, devuelve null
      if (!videoElement || videoElement.readyState < 2 || videoElement.videoWidth === 0) {
        return null;
      }

      // 2. Si videoElement.currentTime no cambió desde la última llamada, devuelve el último resultado guardado
      if (videoElement.currentTime === lastVideoTime) {
        return lastResult;
      }
      lastVideoTime = videoElement.currentTime;

      // 3. Los timestamps que se pasan a detectForVideo deben ser SIEMPRE estrictamente crecientes
      let currentTimestamp = timestampMs;
      if (currentTimestamp <= lastTimestampMs) {
        currentTimestamp = lastTimestampMs + 1;
      }
      lastTimestampMs = currentTimestamp;

      // 4. Llama a detectForVideo dentro de try/catch
      let result = null;
      const startTime = performance.now();
      try {
        result = poseLandmarker.detectForVideo(videoElement, currentTimestamp);
      } catch (inferError) {
        const now = performance.now();
        if (now - lastWarnTime >= 5000) {
          console.warn('[pose.js] Error al ejecutar detectForVideo:', inferError);
          lastWarnTime = now;
        }
        lastResult = null;
        return null;
      }

      const durationMs = performance.now() - startTime;
      if (isDebug) {
        totalInferenceTime += durationMs;
        inferenceCount++;
        const now = performance.now();
        if (now - lastDebugLogTime >= 2000) {
          const avg = inferenceCount > 0 ? (totalInferenceTime / inferenceCount).toFixed(2) : '0.00';
          console.info(`[pose.js ?debug=1] Tiempo promedio de inferencia: ${avg} ms | Delegate activo: ${activeDelegate}`);
          lastDebugLogTime = now;
          totalInferenceTime = 0;
          inferenceCount = 0;
        }
      }

      // 5. Si no hay ninguna persona (landmarks vacío), devuelve null
      if (!result?.landmarks || result.landmarks.length === 0 || !result.landmarks[0] || result.landmarks[0].length === 0) {
        if (isDebug) {
          renderDebug(videoElement, null);
        }
        lastResult = null;
        return null;
      }

      const rawLandmarks = result.landmarks[0];
      const rawWorldLandmarks = result.worldLandmarks ? result.worldLandmarks[0] : null;

      // 6. Si los dos hombros (puntos 11 y 12) tienen visibility menor que MIN_VISIBILITY, devuelve null
      const leftShoulderVis = rawLandmarks[11]?.visibility ?? 0;
      const rightShoulderVis = rawLandmarks[12]?.visibility ?? 0;
      if (leftShoulderVis < MIN_VISIBILITY && rightShoulderVis < MIN_VISIBILITY) {
        if (isDebug) {
          renderDebug(videoElement, null);
        }
        lastResult = null;
        return null;
      }

      // 7. Devuelve { landmarks: result.landmarks[0], worldLandmarks: result.worldLandmarks[0] }
      const finalResult = {
        landmarks: rawLandmarks,
        worldLandmarks: rawWorldLandmarks
      };

      if (isDebug) {
        renderDebug(videoElement, rawLandmarks);
      }

      lastResult = finalResult;
      return finalResult;
    }
  };
}
