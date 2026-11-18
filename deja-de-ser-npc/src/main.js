/**
 * ============================================================================
 * RESPONSABILIDAD: ORQUESTADOR PRINCIPAL (Pipeline de inicialización y bucle)
 * ROL DUEÑO:       Líder del proyecto
 * ============================================================================
 * 
 * ORDEN DE EJECUCIÓN DEL PIPELINE:
 * 1. Iniciar escena 3D (initScene)
 * 2. Cargar avatar predeterminado (loadAvatar)
 * 3. Iniciar bucle de renderizado 3D (startRenderLoop)
 * 4. Iniciar interfaz de usuario (initUI)
 * 5. Iniciar cámara web (startCamera)
 * 6. Iniciar detector de posturas (createPoseDetector)
 * 7. Bucle de seguimiento (detectar -> suavizar -> resolver -> aplicar rig):
 *    - Si hay persona detectada: resolver y aplicar rig a los huesos.
 *    - Si no hay persona en cámara: applyRig(null) (el muñeco se queda quieto).
 */

import { startCamera } from './camera.js';
import { createPoseDetector } from './pose.js';
import { createLandmarkSmoother } from './smoothing.js';
import { solvePose } from './solver.js';
import { initScene, loadAvatar, applyRig, startRenderLoop } from './scene.js';
import { AVATARS } from './avatars.js';
import { initUI } from './ui.js';

async function bootstrap() {
  const videoElement = document.getElementById('webcam');
  const canvasContainer = document.getElementById('canvas-container');

  // 1. Iniciar escena 3D
  initScene(canvasContainer);

  // 2. Cargar avatar inicial
  if (AVATARS.length > 0 && AVATARS[0].url) {
    await loadAvatar(AVATARS[0].url);
  }

  // 3. Iniciar bucle de renderizado 3D
  startRenderLoop();

  // 4. Iniciar interfaz de usuario
  initUI({
    avatars: AVATARS,
    onSelectAvatar: async (url) => {
      await loadAvatar(url);
    },
    onToggleFullscreen: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
      } else {
        document.exitFullscreen().catch(() => { });
      }
    }
  });

  // 5. Iniciar cámara web
  await startCamera(videoElement);

  // 6. Iniciar detector de posturas
  const poseDetector = await createPoseDetector();
  const smoothImage = createLandmarkSmoother();
  const smoothWorld = createLandmarkSmoother();

  // 7. Bucle continuo de animación y detección
  function trackingLoop() {
    const timestampMs = performance.now();

    if (poseDetector) {
      // Detección
      const poseResult = poseDetector.detect(videoElement, timestampMs);

      if (poseResult && poseResult.landmarks) {
        // No mezclar coordenadas normalizadas con coordenadas métricas.
        const smoothedLandmarks = smoothImage(poseResult.landmarks, timestampMs);
        const smoothedWorld = smoothWorld(poseResult.worldLandmarks, timestampMs);

        // Resolver cinemática de huesos con Kalidokit
        const rig = solvePose(
          {
            landmarks: smoothedLandmarks,
            worldLandmarks: smoothedWorld
          },
          videoElement
        );

        // Mover el muñeco 3D
        applyRig(rig);
      } else {
        smoothImage(null);
        smoothWorld(null);
        // Si no hay persona en cámara, el muñeco se queda quieto
        applyRig(null);
        // Reiniciar la retención de brazos para no reutilizar otra persona.
        solvePose(null, videoElement);
      }
    }

    requestAnimationFrame(trackingLoop);
  }

  trackingLoop();
}

// Iniciar al cargar el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
