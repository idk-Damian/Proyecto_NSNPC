# Guía: ESCENA 3D

**Quiénes:** 2 personas (cupo 1 y cupo 2)
**Tu archivo:** `src/scene.js`
**Tu trabajo en una frase:** mostrar en pantalla un personaje 3D que se mueva con los giros que le lleguen, sin que se congele.

---

## 1. Qué entregas

| Archivo | Función | Qué hace |
|---|---|---|
| `scene.js` | `initScene(container)` | crea escena, cámara, luces y renderizador dentro del contenedor |
| `scene.js` | `loadAvatar(url)` | carga un `.vrm` y lo pone en la escena (quita el anterior si había) |
| `scene.js` | `applyRig(rig)` | aplica las rotaciones del `rig` a los huesos del VRM; con `null`, el muñeco se queda quieto |
| `scene.js` | `startRenderLoop()` | dibuja la escena en cada fotograma |

### Acuerdo con Animación (importante)

- `solver.js` (Animación) entrega el `rig` **ya corregido** (signos, espejo).
- Ustedes solo lo **aplican** a los huesos. No arreglen ejes ni signos aquí.

## 2. Cómo se reparten (2 cupos)

**Cupo 1: lo que todos necesitan desde el día 1**
- `initScene`, `loadAvatar`, `applyRig` y el bucle de render.
- Meta del primer día: ver un VRM en pantalla, con luz y cámara.

**Cupo 2: lo que lo hace lucir bien y fluido**
- Fondo temático, luces, encuadre de la cámara.
- **Rendimiento:** que corra bien en laptops con gráficos integrados.

**Para no pisarse en el mismo archivo:**
- Cada uno trabaja en **funciones separadas** (por ejemplo, el cupo 2 en funciones como `setupLights`, `setupBackground`).
- Si prefieren un archivo aparte para el cupo 2 (por ejemplo `src/environment.js`), **avisen al líder antes de crearlo**.
- Hagan `git pull` de `develop` antes de cada PR.

## 3. Pasos sugeridos

**Cupo 1**
1. Crear `THREE.Scene`, `PerspectiveCamera` y `WebGLRenderer`, y añadir el canvas al contenedor.
2. Usar `GLTFLoader` con `VRMLoaderPlugin` para cargar el `.vrm`. El modelo queda en `gltf.userData.vrm`.
3. Orientar el modelo con `VRMUtils.rotateVRM0(vrm)` (rota solo los modelos VRM 0.x, así funcionan ambas versiones).
4. En `applyRig`, tomar cada hueso con `vrm.humanoid.getNormalizedBoneNode('rightUpperArm')` (y similares) y aplicarle la rotación del `rig`. Suavizar con `quaternion.slerp(...)` para que no se vea brusco.
5. En el bucle, llamar `vrm.update(delta)` en cada fotograma.
6. Al cambiar de personaje: quitar el anterior de la escena y liberar memoria con `VRMUtils.deepDispose(...)`.

**Cupo 2**
1. Luces: una ambiental y una direccional bastan.
2. Fondo: color, degradado o una imagen liviana.
3. Encuadre: la cámara debe mostrar el cuerpo completo del muñeco.
4. Rendimiento: limitar el `pixelRatio` (por ejemplo, `Math.min(devicePixelRatio, 2)`), evitar sombras pesadas y mantener la escena simple.
5. Medir los fotogramas por segundo y apuntar a **unos 30**.

## 4. Correspondencia de nombres (rig → hueso VRM)

| Clave del `rig` | Hueso VRM |
|---|---|
| `Hips` | `hips` |
| `Spine` | `spine` |
| `RightUpperArm` / `RightLowerArm` | `rightUpperArm` / `rightLowerArm` |
| `LeftUpperArm` / `LeftLowerArm` | `leftUpperArm` / `leftLowerArm` |
| `RightUpperLeg` / `RightLowerLeg` | `rightUpperLeg` / `rightLowerLeg` |
| `LeftUpperLeg` / `LeftLowerLeg` | `leftUpperLeg` / `leftLowerLeg` |

Confirmen los nombres exactos en la documentación de three-vrm.

## 5. Qué investigar

- [ ] **Three.js manual "Creating a scene"** (threejs.org/docs): lo mínimo para empezar.
- [ ] **"three-vrm GitHub"** (pixiv/three-vrm): README y ejemplos. Busquen el ejemplo de humanoide.
- [ ] **"VRMUtils rotateVRM0"** y **"getNormalizedBoneNode"**.
- [ ] **"three.js dispose memory"**: por qué hay que liberar memoria al cambiar de modelo.
- [ ] **"three.js performance tips"**: pixelRatio, sombras, número de luces.

## 6. Problemas comunes

- El modelo aparece **de espaldas**: orientación VRM 0.x vs 1.0 (ver `rotateVRM0`).
- El modelo es **gigante o diminuto**: ajustar la cámara, no el modelo.
- Se **congela al cambiar de personaje** varias veces: falta liberar memoria del anterior.
- La página va lenta: bajar `pixelRatio`, quitar sombras, probar un modelo con menos polígonos.
- Los materiales se ven rarísimos: confirmar `renderer.outputColorSpace = THREE.SRGBColorSpace`.

## 7. Cómo probar sin esperar a los demás

- Pídanle a **Personajes** un `.vrm` y cárguenlo directamente.
- Prueben `applyRig` a mano desde la consola, con un `rig` inventado que mueva un brazo.

## 8. Está lista cuando

- [ ] Un `.vrm` se ve completo en pantalla, bien iluminado y de frente.
- [ ] `applyRig` mueve brazos y torso, y con `null` el muñeco queda quieto.
- [ ] Cambiar de personaje varias veces no ralentiza ni rompe nada.
- [ ] Corre a unos 30 fps en el PC de la demo.

## 9. Con quién coordinarte

- **Animación:** el `rig` que aplican viene de ellos.
- **Personajes:** los modelos `.vrm` que van a cargar.
- **Interfaz:** el botón de cambio de personaje llama a `loadAvatar`.

## 10. Cómo subir tu trabajo

```
git checkout develop
git pull
git checkout -b feature/escena-<tarea>      # ej: feature/escena-cargar-vrm
git push -u origin feature/escena-<tarea>
```
Pull Request con **base: develop**. Correr el proyecto: `npx serve .` dentro de `deja-de-ser-npc`.

**Plazos:** lun 16 votación y arranque, mar 17 cada uno construye su parte (primer PR a `develop` al final del día), mié 18 integración y congelamiento de funciones, jue 19 solo bugs, pruebas con gente y release, vie 20 entrega.
