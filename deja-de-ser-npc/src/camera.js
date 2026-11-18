/**
 * ============================================================================
 * RESPONSABILIDAD: DETECCIÓN (Captura de video desde la cámara web del usuario)
 * ROL DUEÑO:       Desarrollador de Cámara / Visión por Computador
 * CONTRATO:        startCamera(videoElement) -> Promise<void>
 * ============================================================================
 * 
 * Gestiona la inicialización de la webcam mediante navigator.mediaDevices.getUserMedia,
 * asocia el flujo de video al elemento HTML suministrado, configura reproducción
 * en silencio y en línea, y espera a que el video comience a reproducirse.
 */

/**
 * Inicializa la cámara web y asocia el flujo de video al elemento suministrado.
 * @param {HTMLVideoElement} videoElement - Elemento <video> donde se reproducirá la cámara.
 * @returns {Promise<void>} Promesa que se resuelve cuando el video está reproduciéndose.
 */
export async function startCamera(videoElement) {
  if (!videoElement) {
    throw new Error('No se proporcionó un elemento videoElement válido.');
  }

  if (!navigator?.mediaDevices?.getUserMedia) {
    throw new Error(
      'La API de cámara (navigator.mediaDevices.getUserMedia) no está disponible. ' +
      'Asegúrate de acceder a la aplicación desde localhost o bajo un contexto seguro https.'
    );
  }

  // Si ya existía un stream en el elemento de video, detener todos sus tracks antes de abrir otro
  if (videoElement.srcObject && typeof videoElement.srcObject.getTracks === 'function') {
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
  }

  const constraints = {
    audio: false,
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: 'user'
    }
  };

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    let mensaje;
    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        mensaje = 'Permiso denegado: el usuario no autorizó el acceso a la cámara web.';
        break;
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        mensaje = 'No se encontró ningún dispositivo de cámara conectado en el sistema.';
        break;
      case 'NotReadableError':
      case 'TrackStartError':
        mensaje = 'La cámara no se puede leer: es posible que esté en uso por otra aplicación o bloqueada por el sistema operativo.';
        break;
      default:
        mensaje = `Error inesperado al acceder a la cámara web: ${error.message || error.name || 'desconocido'}.`;
        break;
    }
    throw new Error(mensaje, { cause: error });
  }

  videoElement.srcObject = stream;
  videoElement.muted = true;
  videoElement.playsInline = true;

  // Esperar a que haya datos suficientes y comenzar la reproducción
  if (videoElement.readyState < 2) {
    await new Promise((resolve, reject) => {
      const onLoadedData = () => {
        cleanup();
        resolve();
      };
      const onError = (err) => {
        cleanup();
        reject(new Error('Error durante la carga de fotogramas del video de la cámara.', { cause: err }));
      };
      const cleanup = () => {
        videoElement.removeEventListener('loadeddata', onLoadedData);
        videoElement.removeEventListener('error', onError);
      };
      videoElement.addEventListener('loadeddata', onLoadedData, { once: true });
      videoElement.addEventListener('error', onError, { once: true });
    });
  }

  try {
    await videoElement.play();
  } catch (playError) {
    throw new Error(`No se pudo iniciar la reproducción del video de la cámara: ${playError.message}`, { cause: playError });
  }
}
