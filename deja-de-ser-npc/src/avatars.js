/**
 * ============================================================================
 * RESPONSABILIDAD: PERSONAJES (Catálogo y metadatos de avatares VRM)
 * ROL DUEÑO:       Diseñador 3D / Gestor de Assets
 * CONTRATO:        export const AVATARS = [{ id, name, url, license }]
 * ============================================================================
 * 
 * PASOS SUGERIDOS PARA LA IMPLEMENTACIÓN:
 * 1. Colocar los archivos de avatares en formato .vrm dentro de assets/models/.
 * 2. PISTA: No inventar licencias sin verificar; leer la licencia y términos de uso directamente del metadato del archivo VRM (sección meta).
 * 3. Registrar cada modelo en la lista AVATARS con su id, nombre legible, ruta relativa y licencia.
 */

// Formato de cada avatar: { id: string, name: string, url: string, license: string }
// Ejemplo de avatar registrado:
// {
//   id: 'alicia-solid',
//   name: 'Alicia Solid',
//   url: './assets/models/AliciaSolid.vrm',
//   license: 'CC BY 4.0'
// }

export const AVATARS = [];
