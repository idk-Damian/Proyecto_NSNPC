/**
 * ============================================================================
 * RESPONSABILIDAD: DETECCIÓN (Captura de video desde la cámara web del usuario)
 * ROL DUEÑO:       Desarrollador de Cámara / Visión por Computador
 * CONTRATO:        startCamera(videoElement) -> Promise<void>
 * ============================================================================
 * 
 * PASOS SUGERIDOS PARA LA IMPLEMENTACIÓN:
 * 1. Comprobar que navigator.mediaDevices y getUserMedia estén disponibles en el navegador.
 * 2. Solicitar permisos de cámara con restricciones recomendadas (ej. 640x480, facingMode: 'user', audio: false).
 * 3. Asignar el MediaStream obtenido a la propiedad srcObject del videoElement.
 * 4. Esperar a que el video cargue sus metadatos (evento 'loadedmetadata').
 * 5. Iniciar la reproducción mediante videoElement.play() y resolver la promesa.
 */

/**
 * Inicializa la cámara web y asocia el flujo de video al elemento suministrado.
 * @param {HTMLVideoElement} videoElement - Elemento <video> donde se reproducirá la cámara.
 * @returns {Promise<void>}
 */
export async function startCamera(videoElement) {
  // TODO: Implementar captura de cámara con navigator.mediaDevices.getUserMedia
  return Promise.resolve();
}
