# Guía: DETECCIÓN

## Estado de la implementación

El filtro One Euro está implementado. `createLandmarkSmoother({ minCutoff, beta,
dCutoff })` crea un flujo independiente; recibe puntos y un timestamp opcional
en milisegundos. `smoothLandmarks(landmarks)` conserva el contrato original.
`main.js` usa instancias separadas para puntos normalizados y métricos y las
reinicia al perder la persona. No modifica los puntos de MediaPipe ni su visibilidad.

Pruebas desde la raíz (Node 24, sin instalar dependencias):
`node --experimental-vm-modules --test tests/*.test.mjs`.
El algoritmo sigue la [referencia original](https://gery.casiez.net/1euro/).
Los valores iniciales son `minCutoff=1`, `beta=0.05`, `dCutoff=1`;
deben calibrarse en el equipo de entrega. Pendiente: grabar 2–3 fotogramas
reales con consentimiento y validar webcam, vibración y rendimiento en ese equipo.
Las pruebas sintéticas no sustituyen esa validación; los temas de escena/avatar
siguen fuera de este cambio.

**Quiénes:** 2 personas (cupo 1: el líder; cupo 2: por votación)
**Tus archivos:** `src/camera.js`, `src/pose.js`, `src/smoothing.js`
**Tu trabajo en una frase:** que la cámara "vea" a la persona y entregue sus 33 puntos del cuerpo, sin temblores, a los demás.

---

## 1. Qué entregas

Los demás dependen de que tus funciones cumplan estos contratos (no cambies las firmas):

| Archivo | Función | Devuelve |
|---|---|---|
| `camera.js` | `startCamera(videoElement)` | `Promise<void>` (cuando el video ya está reproduciendo) |
| `pose.js` | `createPoseDetector()` | `Promise<{ detect(videoElement, timestampMs) }>` |
| `pose.js` | `detect(...)` | `{ landmarks, worldLandmarks }` o `null` si no hay persona |
| `smoothing.js` | `smoothLandmarks(landmarks)` | los mismos puntos, suavizados |

- `landmarks`: 33 puntos 2D normalizados (x, y de 0 a 1 sobre la imagen).
- `worldLandmarks`: 33 puntos 3D en metros, con el centro en las caderas. **Kalidokit usa estos para calcular los giros**, así que también deben suavizarse.

Puntos que más usaremos (índices MediaPipe): hombros 11 y 12, codos 13 y 14, muñecas 15 y 16, caderas 23 y 24, rodillas 25 y 26, tobillos 27 y 28.

## 2. Pasos sugeridos

1. **`camera.js`:** pedir la cámara con `navigator.mediaDevices.getUserMedia`, asignarla a `videoElement.srcObject` y esperar a que empiece a reproducir. Resolución 640x480 alcanza.
2. **`pose.js`:** cargar MediaPipe con `FilesetResolver.forVisionTasks(...)` y crear un `PoseLandmarker` con el modelo **lite**, `runningMode: 'VIDEO'` y `numPoses: 1`.
3. En `detect()`, llamar a `detectForVideo(video, timestampMs)` y devolver `landmarks[0]` y `worldLandmarks[0]`. Si no hay persona, devolver `null`.
4. **Plan B de rendimiento:** intentar `delegate: 'GPU'` y, si falla, usar `'CPU'`.
5. **`smoothing.js`:** implementar el **filtro One Euro**. Usa filtros **separados** para `landmarks` y para `worldLandmarks`. Un filtro por cada coordenada (x, y, z) de cada punto.
6. **Una sola persona:** empieza con `numPoses: 1`. Si el muñeco "salta" de una persona a otra, elige a la persona más grande o más cercana al centro.
7. **Ignorar puntos dudosos:** cada punto trae `visibility`. Si es muy baja, no te fíes de ese punto.

## 3. Qué investigar

Busca estos temas (en este orden):

- [ ] **"MediaPipe Pose Landmarker web"**: la guía oficial para JavaScript (ai.google.dev/edge/mediapipe). Mira el ejemplo con `detectForVideo`.
- [ ] **"getUserMedia MDN"**: permisos y errores comunes de cámara.
- [ ] **"One Euro Filter"**: el artículo original (Casiez, Roussel y Vogel, 2012) y los dos parámetros: `minCutoff` (quita temblor cuando estás quieto) y `beta` (evita el retraso cuando te mueves rápido).
- [ ] **"MediaPipe DrawingUtils"**: para dibujar el esqueleto sobre el video y depurar.
- [ ] **"MediaPipe pose landmarks index"**: qué punto es cuál.

## 4. Problemas comunes

- La cámara **solo funciona en `localhost` o `https`**, no abriendo el archivo con doble clic.
- Los timestamps que pasas a `detectForVideo` deben ser **siempre crecientes**.
- No llames a `detect()` si el video aún no está listo (`readyState < 2`): devuelve `null`.
- Si el muñeco se ve lento: baja la resolución del video o confirma que estás usando el modelo `lite`.
- Si el muñeco tiembla: baja `minCutoff`. Si se ve con retraso al moverse rápido: sube `beta`.

## 5. Cómo probar tu parte sin esperar a los demás

- Haz `console.log(result)` y confirma que llegan 33 puntos.
- Dibuja el esqueleto sobre el video con `DrawingUtils` en un canvas aparte (solo para depurar; no debe quedar activo en la entrega final).
- **Pásale a Animación un JSON con 2 o 3 fotogramas reales** (`landmarks` y `worldLandmarks`) para que prueben Kalidokit sin esperar.

## 6. Está lista cuando

- [ ] Al moverte frente a la cámara, la consola muestra los 33 puntos cambiando.
- [ ] Si sales de cámara, `detect()` devuelve `null` sin errores.
- [ ] Quieto, los puntos casi no vibran (con el suavizado aplicado a ambos arreglos).
- [ ] Funciona en el PC que usaremos en la casa abierta, sin congelarse.

## 7. Con quién coordinarte

- **Animación:** reciben tus `landmarks` y `worldLandmarks`. Avísales cuando tengas la primera versión.
- **Interfaz:** necesita saber si hay persona detectada (se conecta en `main.js`).

## 8. Cómo subir tu trabajo

```
git checkout develop
git pull
git checkout -b feature/deteccion-<tarea>      # ej: feature/deteccion-camara
# ...trabajas y haces commits chicos...
git push -u origin feature/deteccion-<tarea>
```
Luego abre un Pull Request en GitHub con **base: develop** (no `main`). Antes del PR, la página debe abrir sin errores en la consola. Correr el proyecto: `npx serve .` dentro de `deja-de-ser-npc`.

**Plazos:** lun 16 votación y arranque, mar 17 cada uno construye su parte (primer PR a `develop` al final del día), mié 18 integración y congelamiento de funciones, jue 19 solo bugs, pruebas con gente y release, vie 20 entrega.

---

## 10. Reparto de los 2 cupos

**Cupo 1 (líder):** `camera.js` y `pose.js` (cámara, MediaPipe lite, plan B GPU→CPU, una sola persona e ignorar puntos de baja visibilidad).

**Cupo 2:** `smoothing.js`.
- Filtro One Euro para `landmarks` **y** para `worldLandmarks` (filtros separados).
- Ajustar `minCutoff` y `beta` probando con una persona real.
- En cuanto `pose.js` funcione, **sacar un JSON con 2 o 3 fotogramas reales** y dárselo a Animación. Es lo que más los desbloquea.

Como son archivos distintos, casi no habrá conflictos. Háganse `git pull` de `develop` antes de cada PR.
