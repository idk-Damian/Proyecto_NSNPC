/**
 * ============================================================================
 * RESPONSABILIDAD: DETECCIÓN (Filtro One Euro para suavizado de landmarks)
 * ROL DUEÑO:       Desarrollador de Procesamiento de Señales / Algoritmos
 * CONTRATO:        smoothLandmarks(landmarks) -> landmarks suavizados
 * ============================================================================
 * 
 * PASOS SUGERIDOS PARA LA IMPLEMENTACIÓN:
 * 1. Implementar la fórmula del filtro adaptativo One Euro (1€ Filter) con parámetros minCutoff, beta y dCutoff.
 * 2. Mantener un almacén de estados previos (posición, derivada temporal y marca de tiempo) por cada punto clave.
 * 3. PISTA: Aplicar el filtro One Euro a landmarks (2D normalizados) y considerar filtros separados si se procesan worldLandmarks (3D métricos).
 * 4. Si la entrada de landmarks es null o está vacía, reiniciar los estados de los filtros y devolver null.
 * 5. Devolver un nuevo arreglo de puntos con las coordenadas x, y, z filtradas manteniendo la estructura esperada.
 */

/**
 * Aplica el filtro One Euro sobre una lista de coordenadas para eliminar temblores.
 * @param {Array<{ x: number, y: number, z?: number }> | null} landmarks - Coordenadas crudas.
 * @returns {Array<{ x: number, y: number, z?: number }> | null} Coordenadas suavizadas o null.
 */
export function createLandmarkSmoother({ minCutoff = 1, beta = 0.05, dCutoff = 1 } = {}) {
  if (![minCutoff, dCutoff].every(value => Number.isFinite(value) && value > 0)
      || !Number.isFinite(beta) || beta < 0) {
    throw new RangeError('Los cortes deben ser positivos y beta no negativo.');
  }
  let states = [];
  let lastTime = null;
  const alpha = (cutoff, dt) => 1 / (1 + 1 / (2 * Math.PI * cutoff * dt));

  // Cada instancia pertenece a un único espacio de coordenadas.
  return function smooth(landmarks, timestampMs = performance.now()) {
    if (!Array.isArray(landmarks) || landmarks.length === 0
        || !landmarks.every(point => point && Number.isFinite(point.x)
          && Number.isFinite(point.y) && (point.z === undefined || Number.isFinite(point.z)))
        || !Number.isFinite(timestampMs)) {
      states = [];
      lastTime = null;
      return null;
    }
    if (states.length !== landmarks.length || lastTime === null || timestampMs < lastTime) {
      states = landmarks.map(() => ({}));
      lastTime = null;
    }
    const dt = lastTime === null ? null : (timestampMs - lastTime) / 1000;
    const output = landmarks.map((point, index) => {
      const result = { ...point };
      for (const axis of ['x', 'y', 'z']) {
        if (point[axis] === undefined) {
          delete states[index][axis];
          continue;
        }
        const value = point[axis];
        const previous = states[index][axis];
        if (!previous || dt === null) {
          states[index][axis] = { raw: value, filtered: value, derivative: 0 };
        } else if (dt > 0) {
          const derivative = previous.derivative
            + alpha(dCutoff, dt) * ((value - previous.raw) / dt - previous.derivative);
          states[index][axis] = {
            raw: value,
            filtered: previous.filtered + alpha(minCutoff + beta * Math.abs(derivative), dt)
              * (value - previous.filtered),
            derivative
          };
        }
        result[axis] = states[index][axis].filtered;
      }
      return result;
    });
    lastTime = timestampMs;
    return output;
  };
}

// Se conserva el contrato original para consumidores de un solo flujo.
export const smoothLandmarks = createLandmarkSmoother();
