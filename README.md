# Deja de Ser NPC

## 1. Qué es
Una webcam detecta el cuerpo de una persona y un muñeco 3D en formato VRM copia sus movimientos en vivo (proyecto para una casa abierta en colegios).

## 2. Cómo correrlo
1. `git clone https://github.com/idk-Damian/Proyecto_NSNPC.git`
2. `git checkout develop`
3. `cd deja-de-ser-npc`
4. `npx serve .`
5. Abrir la dirección `localhost` que muestra.

> La cámara solo funciona en `localhost` o `https`.

## 3. Roles y archivos

| Rol | Archivos |
|---|---|
| Detección | `src/camera.js`, `src/pose.js`, `src/smoothing.js` |
| Animación | `src/solver.js` |
| Escena 3D | `src/scene.js` |
| Personajes | `src/avatars.js` y `assets/models/` |
| Interfaz y pruebas | `src/ui.js` y `styles/main.css` |
| Líder | `src/main.js` |

## 4. Ramas
- `main`: Solo la versión final entregada, nadie la toca.
- `develop`: Donde se junta todo, siempre debe abrir sin errores.
- `feature/<rol>-<tarea>`: Cada uno trabaja en la suya, saliendo de `develop`.
- `release/*`: La crea el líder el jueves para la versión final.

## 5. Cómo subir tu trabajo
1. `git checkout develop`
2. `git pull`
3. `git checkout -b feature/<rol>-<tarea>`
4. Hacer commits chicos.
5. `git push -u origin feature/<rol>-<tarea>`
6. Crear Pull Request con base `develop` (nunca `main`). Cada PR lo revisa otra persona antes del merge.

## 6. Guías por rol
Encuentra la guía correspondiente a tu rol en [docs/guias/](docs/guias/).
