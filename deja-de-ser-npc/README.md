# Deja de Ser NPC 🎭

Esqueleto guía de aplicación web: una webcam detecta el cuerpo de una persona y un muñeco 3D en formato **VRM** copia sus movimientos en vivo en el navegador.

---

## 👥 Asignación por Roles, Archivos y Contratos

| Rol | Archivo(s) | Contrato / Función Exportada |
|---|---|---|
| **Lead Developer / Arquitecto** | `src/main.js` | Orquestador del pipeline completo. Si no hay persona, envía `applyRig(null)` para dejar quieto al avatar. |
| **Desarrollador de Cámara** | `src/camera.js` | `startCamera(videoElement) -> Promise<void>` |
| **Desarrollador de Visión por Computador / IA** | `src/pose.js` | `createPoseDetector() -> Promise<{ detect(videoElement, timestampMs) }>` (devuelve `{ landmarks, worldLandmarks }` o `null`). |
| **Desarrollador de Procesamiento de Señales** | `src/smoothing.js` | `smoothLandmarks(landmarks) -> landmarks` |
| **Desarrollador de Animación / Cinemática** | `src/solver.js` | `solvePose(poseResult, videoElement) -> rig` |
| **Desarrollador 3D / WebGL** | `src/scene.js` | `initScene(container)`, `loadAvatar(url) -> Promise<void>`, `applyRig(rig)`, `startRenderLoop()` |
| **Diseñador 3D / Gestor de Assets** | `src/avatars.js` | `export const AVATARS = [{ id, name, url, license }]` |
| **Desarrollador Frontend / UI** | `src/ui.js` | `initUI({ avatars, onSelectAvatar, onToggleFullscreen })` |

---

## 📁 Estructura del Proyecto

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

## 📦 Librerías y Compatibilidad (CDN + `importmap`)

Cargadas por CDN en `index.html` con versiones fijas y compatibles entre sí:
- **`three`** (`0.160.0`): Motor WebGL.
- **`three/addons/`** (`0.160.0`): Utilidades y cargadores (ej. `GLTFLoader`).
- **`@pixiv/three-vrm`** (`2.1.3`): Cargador y manipulador oficial de avatares VRM.
- **`@mediapipe/tasks-vision`** (`0.10.18`): Extracción de puntos corporales en el navegador.
- **`kalidokit`** (`1.1.5`): Solucionador de cinemática inversa.

---

## 🚀 Cómo Correr el Proyecto con un Servidor Local

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

## 🌿 Flujo de Trabajo Git (Git Flow)

Este proyecto sigue la convención de ramas **Git Flow**:

- **`main`**: Rama de producción con código estable. **No se hacen commits directos en `main`**.
- **`develop`**: Rama base de integración y desarrollo activo.
- **`feature/<nombre>`**: Ramas creadas a partir de `develop` para desarrollar cada módulo o funcionalidad; se fusionan de vuelta a `develop`.
- **`release/<versión>`**: Ramas creadas desde `develop` para congelar código y realizar pruebas finales antes de fusionar en `main` (con tag) y en `develop`.
- **`hotfix/<nombre>`**: Parches urgentes creados desde `main` y fusionados en `main` y `develop`.

### Comandos habituales:

```bash
# 1. Iniciar una nueva funcionalidad desde develop
git checkout develop
git checkout -b feature/nombre-de-la-funcionalidad

# 2. Hacer commits de los avances
git add .
git commit -m "feat(modulo): descripción del avance"

# 3. Integrar la funcionalidad en develop
git checkout develop
git merge --no-ff feature/nombre-de-la-funcionalidad

# 4. Eliminar la rama feature local
git branch -d feature/nombre-de-la-funcionalidad
```
