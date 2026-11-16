# Deja de Ser NPC 

Esqueleto guía de aplicación web: una webcam detecta el cuerpo de una persona y un muñeco 3D en formato **VRM** copia sus movimientos en vivo en el navegador.

------
Roles, ramas y flujo de trabajo: ver el [README de la raíz](../README.md) y las guías en [docs/guias](../docs/guias/).
----

##  Estructura del Proyecto

```text
deja-de-ser-npc/
├── index.html              # Video oculto + contenedor del canvas + contenedor de la UI
├── README.md               # Documentación, roles, servidor local y flujo Git
├── .gitignore              # Ignora dependencias y temporales
├── assets/
│   ├── models/             # Archivos .vrm (vacío con un .gitkeep)
│   └── img/                # Recursos de imagen (con .gitkeep)
├── src/
│   ├── main.js             # Orquestador del bucle
│   ├── camera.js           # DETECCIÓN: Webcam
│   ├── pose.js             # DETECCIÓN: MediaPipe PoseLandmarker
│   ├── smoothing.js        # DETECCIÓN: Filtro One Euro
│   ├── solver.js           # ANIMACIÓN: Kalidokit
│   ├── scene.js            # ESCENA 3D: Three.js + Three-VRM
│   ├── avatars.js          # PERSONAJES: Lista de modelos VRM
│   └── ui.js               # INTERFAZ: HUD y controles
└── styles/
    └── main.css            # Reset mínimo y contenedores a pantalla completa
```

---

## Librerías y Compatibilidad (CDN + `importmap`)

Cargadas por CDN en `index.html` con versiones fijas y compatibles entre sí:
- **`three`** (`0.160.0`): Motor WebGL.
- **`three/addons/`** (`0.160.0`): Utilidades y cargadores (ej. `GLTFLoader`).
- **`@pixiv/three-vrm`** (`2.1.3`): Cargador y manipulador oficial de avatares VRM.
- **`@mediapipe/tasks-vision`** (`0.10.18`): Extracción de puntos corporales en el navegador.
- **`kalidokit`** (`1.1.5`): Solucionador de cinemática inversa.

---

## Cómo Correr el Proyecto con un Servidor Local

### ¿Por qué se requiere un servidor local?
No se puede abrir `index.html` con doble clic (`file:///`) por dos motivos:
1. **Acceso a la Cámara Web (`getUserMedia`):** El navegador exige un contexto seguro (**HTTPS** o **`http://localhost` / `http://127.0.0.1`**).
2. **Módulos ES (`import` / `export`):** Las políticas CORS de los navegadores bloquean la carga modular bajo el protocolo `file://`.

### Comandos para iniciar el servidor:

#### Opción A: Con Node.js (npx)
```bash
# Dentro de la carpeta deja-de-ser-npc/
npx serve .
# O alternativamente:
npx http-server . -p 8080
```
Abre en tu navegador `http://localhost:3000` (o el puerto indicado).

#### Opción B: Con Python
```bash
# Dentro de la carpeta deja-de-ser-npc/
python -m http.server 8000
# En Windows si usas el lanzador py:
py -m http.server 8000
```
Abre en tu navegador `http://localhost:8000`.

#### Opción C: Con VS Code
Instala la extensión **Live Server**, haz clic derecho sobre `deja-de-ser-npc/index.html` y pulsa **"Open with Live Server"**.

---
## Inicio rápido

1. `git clone <URL-DEL-REPO>`
2. `git checkout develop`
3. `cd deja-de-ser-npc`
4. `npx serve .` y abrir la dirección `localhost` que muestra (más opciones arriba).

## Roles y archivos

| Rol | Archivos |
|---|---|
| Detección | `src/camera.js`, `src/pose.js`, `src/smoothing.js` |
| Animación | `src/solver.js` |
| Escena 3D | `src/scene.js` |
| Personajes | `src/avatars.js` y `assets/models/` |
| Interfaz y pruebas | `src/ui.js` y `styles/main.css` |
| Líder | `src/main.js` |

## Ramas

- `main`: solo la versión final entregada. Nadie la toca.
- `develop`: donde se junta todo. Siempre debe abrir sin errores.
- `feature/<rol>-<tarea>`: cada uno trabaja en la suya, saliendo de `develop`.
- `release/1.0`: la crea el líder el jueves para la versión final; solo se corrigen bugs.

## Cómo subir tu trabajo

1. `git checkout develop`
2. `git pull`
3. `git checkout -b feature/<rol>-<tarea>`
4. Hacer commits chicos.
5. `git push -u origin feature/<rol>-<tarea>`
6. Abrir un Pull Request con base `develop` (nunca `main`). Cada PR lo revisa otra persona antes del merge.

## Guías por rol

Encuentra la guía de tu rol en [docs/guias](docs/guias/).