# Guía: INTERFAZ Y PRUEBAS

**Quiénes:** 2 personas (cupo 1 y cupo 2)
**Tu archivo:** `src/ui.js` (y `styles/main.css` para los estilos)
**Tu trabajo en una frase:** que cualquier visitante entienda en 3 segundos qué hacer, y comprobar que todo funcione antes del día de la casa abierta.

---

## 1. Qué entregas

| Archivo | Función | Qué hace |
|---|---|---|
| `ui.js` | `initUI({ avatars, onSelectAvatar, onToggleFullscreen })` | construye los botones, las instrucciones y los indicadores |

- `avatars`: la lista de personajes (viene de `avatars.js`).
- `onSelectAvatar(url)`: se llama cuando alguien elige otro personaje.
- `onToggleFullscreen()`: se llama al pulsar el botón de pantalla completa.

### Estado real de cámara y detección

Para mostrar si hay cámara y si se detecta a una persona, `ui.js` necesita avisos de los demás módulos. La idea es que `initUI` **devuelva un objeto con funciones**, por ejemplo `setCameraStatus(ok)` y `setPoseDetected(true/false)`. **Ponte de acuerdo con el líder**: él conecta esas funciones en `main.js`.

## 2. Pasos sugeridos

**Interfaz**
1. **Selector de personajes:** botones o tarjetas con el nombre. Mejor botones grandes que una lista desplegable pequeña.
2. **Pantalla completa:** botón que use la API de Fullscreen. Solo funciona tras un clic del usuario.
3. **Instrucciones en pantalla**, cortas y grandes, tipo: "Párate a 2 metros, muestra los brazos y muévete".
4. **Pantalla de espera:** cuando no hay nadie frente a la cámara, un mensaje llamativo, tipo "¡Ponte frente a la cámara y deja de ser NPC!".
5. **Indicadores reales** de cámara y detección. No deben estar en verde por defecto.
6. Que se lea **desde 2 o 3 metros** (letra grande, buen contraste) y que no tape al muñeco.
7. Si algún personaje exige crédito de licencia, muéstralo en pantalla (pregunta a Personajes).

**Pruebas (de martes a jueves)**
1. Probar con **personas distintas**: niños, adultos, diferentes alturas, ropa holgada y ajustada.
2. Probar con **distinta luz** y a **distintas distancias**.
3. Anotar en una **tabla simple**: qué probaste, qué pasó, quién lo debe arreglar.
4. Pasar los problemas al responsable del módulo correspondiente.

## 3. Plan B: video de respaldo

Graba un video corto de la demo funcionando, por si el día de la casa abierta falla la cámara o el PC.
- En Windows: **Win + G** (Xbox Game Bar) o **OBS Studio**.
- Los videos pesan, así que **no los subas al repo**: guárdalos en Drive y descárgalos en el PC de la demo.

## 4. Lista para el día de la casa abierta (ensayo del jueves)

- [ ] El PC y el cargador funcionan, y la pantalla o proyector se ve bien.
- [ ] La cámara está bien ubicada y los permisos del navegador ya están aceptados.
- [ ] El navegador abre el proyecto en pantalla completa (F11) y sin otras pestañas pesadas.
- [ ] Hay buena luz y el fondo detrás del visitante está despejado.
- [ ] Hay marca en el piso a 2 o 3 metros de la cámara.
- [ ] Alguien sabe cómo reiniciar todo rápido.
- [ ] El video de respaldo está listo y descargado en el PC.
- [ ] Hicimos un **ensayo completo cronometrado**.

## 5. Qué investigar

- [ ] **"Fullscreen API MDN"**: `requestFullscreen` y `exitFullscreen`.
- [ ] **"HTML CSS overlay position fixed"**: cómo poner la interfaz encima del canvas 3D (ya hay una base en `main.css`).
- [ ] **"CSS tamaño de fuente legible a distancia"** y contraste de colores.
- [ ] **"Chrome kiosk mode"**: abrir el navegador a pantalla completa sin barras (opcional).
- [ ] **"OBS Studio grabar pantalla"**: para el video de respaldo.

## 6. Problemas comunes

- El botón de pantalla completa **no hace nada**: el navegador exige que sea tras un clic del usuario.
- La interfaz **tapa al muñeco** o bloquea los clics: revisa el orden de capas (`z-index`) y `pointer-events` en el CSS.
- Los textos **no se leen de lejos**: aumenta el tamaño y el contraste.
- En el PC de la demo **se ve distinto**: prueba con la misma resolución de pantalla que se usará.

## 7. Está lista cuando

- [ ] Se puede cambiar de personaje con un clic, sin romper nada.
- [ ] La pantalla completa funciona.
- [ ] Un visitante nuevo entiende qué hacer sin que se lo expliquen.
- [ ] La pantalla de espera aparece cuando no hay nadie.
- [ ] El ensayo completo del jueves salió sin errores y el video de respaldo existe.

## 8. Con quién coordinarte

- **Líder:** conecta tus funciones de estado en `main.js`.
- **Personajes:** nombres y créditos de los personajes.
- **Escena 3D:** el cambio de personaje llama a `loadAvatar`.
- **Todos:** reportas los fallos que encuentres al probar.

## 9. Cómo subir tu trabajo

```
git checkout develop
git pull
git checkout -b feature/interfaz-<tarea>      # ej: feature/interfaz-selector
git push -u origin feature/interfaz-<tarea>
```
Pull Request con **base: develop**. Correr el proyecto: `npx serve .` dentro de `deja-de-ser-npc`.

**Plazos:** lun 16 votación y arranque, mar 17 cada uno construye su parte (primer PR a `develop` al final del día), mié 18 integración y congelamiento de funciones, jue 19 solo bugs, pruebas con gente y release, vie 20 entrega.

---

## 10. Reparto de los 2 cupos

**Cupo 1: la interfaz (`ui.js` y `styles/main.css`).**
- Selector de personajes y pantalla completa.
- Instrucciones, pantalla de espera e indicadores reales.

**Cupo 2: pruebas y stand (casi sin código).**
- Plan de pruebas y la tabla de resultados.
- Video de respaldo.
- Checklist del stand y ensayo completo del jueves.
- Si sobra tiempo: cartel, QR o guion para recibir a los visitantes.

Este cupo es ideal si prefieres organizar y probar más que programar. Reportan los fallos a quien tenga el módulo.
