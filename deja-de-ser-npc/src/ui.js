/**
 * ============================================================================
 * RESPONSABILIDAD: INTERFAZ (Controles de usuario y retroalimentación en pantalla)
 * ROL DUEÑO:       Desarrollador Frontend / UI
 * CONTRATO:        initUI({ avatars, onSelectAvatar, onToggleFullscreen })
 * ============================================================================
 * 
 * PASOS SUGERIDOS PARA LA IMPLEMENTACIÓN:
 * 1. PISTA: Crear e inyectar en #ui-container el selector o lista de personajes disponibles recibidos en avatars.
 * 2. Vincular el cambio de selección para llamar al callback onSelectAvatar(selectedUrl).
 * 3. PISTA: Crear el botón de alternar pantalla completa y vincularlo a onToggleFullscreen().
 * 4. PISTA: Construir indicadores visuales que reflejen el estado real de la cámara (activa / inactiva / error).
 * 5. PISTA: Construir indicadores visuales que reflejen el estado real de detección (persona detectada / buscando).
 */

/**
 * Inicializa la interfaz de usuario en el contenedor #ui-container.
 * @param {object} options - Opciones de inicialización.
 * @param {Array<{ id: string, name: string, url: string, license: string }>} options.avatars - Lista de avatares.
 * @param {(url: string) => void} options.onSelectAvatar - Callback al elegir un avatar.
 * @param {() => void} options.onToggleFullscreen - Callback al alternar pantalla completa.
 */
export function initUI({ avatars = [], onSelectAvatar, onToggleFullscreen }) {
  // TODO: Montar elementos del HUD (selector de avatar, botón fullscreen e indicadores de estado)
}
