# Guía: ANIMACIÓN

## Estado de la implementación

`solvePose` valida ambos arreglos de 33 puntos y llama a Kalidokit 1.1.5 con
`runtime: 'mediapipe'`, puntos métricos primero y `enableLegs: false`.
Conserva el último brazo fiable si su visibilidad baja de 0.5 en cualquiera
de los dos espacios. Sin historial usa reposo; sin persona o con datos inválidos
devuelve `null` y borra el historial. `main.js` notifica la pérdida de persona.
Entradas y valores retenidos no se comparten con el consumidor.

Se conserva la convención espejo nativa de Kalidokit: los índices MediaPipe
11/13/15 controlan `Right*`, y 12/14/16 controlan `Left*`. No se añade otro
intercambio ni inversión de signos o escala. La conversión específica de VRM
0.x/1.x deberá comprobarse con Escena 3D antes de cambiar esta convención.
Referencia: [fuente oficial](https://github.com/yeemachine/kalidokit).

Pruebas sin dependencias: `node --experimental-vm-modules --test tests/*.test.mjs`.
Para la prueba real de biblioteca, descargar el mismo módulo CDN 1.1.5 del
importmap fuera del repositorio y definir `KALIDOKIT_MODULE` con su ruta absoluta
antes del comando. Sin esa variable la prueba se marca omitida explícitamente.
Los datos de prueba son sintéticos, no capturas reales: quedan pendientes el JSON
de webcam, la validación visual de lateralidad y el ensayo en el equipo final.
Los temas de escena y avatares no se implementan aquí.

**Quiénes:** 2 personas
**Tu archivo:** `src/solver.js`
**Tu trabajo en una frase:** convertir los puntos del cuerpo en giros de huesos que el muñeco pueda copiar.
**Es el camino crítico del proyecto:** si esto no funciona, no hay muñeco que se mueva.

---

## 1. Qué entregas

| Archivo | Función | Recibe | Devuelve |
|---|---|---|---|
| `solver.js` | `solvePose(poseResult, videoElement)` | `{ landmarks, worldLandmarks }` y el elemento de video | un objeto `rig` con rotaciones por hueso, o `null` si no hay datos |

El `rig` es el formato que devuelve **Kalidokit**: claves como `Hips`, `Spine`, `RightUpperArm`, `RightLowerArm`, `LeftUpperArm`, `LeftLowerArm`, y piernas si están activadas. Con `console.log(rig)` confirmen los nombres exactos.

### Acuerdo con Escena 3D (importante)

- **Ustedes** (solver.js) entregan el `rig` **ya corregido**: signos, espejo, escala.
- **Escena 3D** (scene.js) solo toma ese `rig` y lo aplica a los huesos del VRM.
- Si algo sale al revés, se arregla en `solver.js`. Así cada uno toca un solo archivo.

## 2. Pasos sugeridos

1. **Primero, la prueba clave (el primer día):** confirmar que **Kalidokit funciona con la versión actual de MediaPipe** (`@mediapipe/tasks-vision`). Muchos ejemplos de Kalidokit usan una versión anterior (Holistic). Si falla, avisen enseguida al líder.
2. Llamar a `Kalidokit.Pose.solve(worldLandmarks, landmarks, { runtime: 'mediapipe', video, enableLegs: false })`. Primer argumento: puntos 3D. Segundo: puntos 2D.
3. Dejar `enableLegs` en **`false`** para el MVP (en un stand muchas veces no se ven las piernas y meten ruido). Se activa en una constante fácil de cambiar.
4. Decidir si el muñeco **imita como un espejo** (levantas la mano derecha y él levanta la izquierda de la pantalla) o no. Para un stand suele sentirse más natural como espejo. Pruébenlo con gente y decidan.
5. Si un punto tiene `visibility` baja, mantener el último valor bueno en vez de dejar que el brazo salte.
6. Para el MVP: **brazos y torso**. Las piernas y las manos son extras.
7. Si no hay datos (`null`), devolver `null`: así `applyRig(null)` deja al muñeco quieto.

## 3. Qué investigar

- [ ] **"Kalidokit GitHub"** (yeemachine/kalidokit): el README y los ejemplos. Fíjense en qué recibe `Pose.solve`.
- [ ] **"Kalidokit VRM three.js example"**: cómo aplican el `rig` a un VRM. Ojo: usa una versión vieja de three-vrm, la lógica sirve pero la API cambió.
- [ ] **"MediaPipe Pose Landmarker worldLandmarks"**: qué significan los datos 3D y en qué unidades están.
- [ ] **"Euler angles vs quaternions"**: por qué el muñeco a veces se retuerce. Basta con entender la idea.
- [ ] **"VRM 0.x vs 1.0 coordinate system"**: los ejes cambian entre versiones y puede invertir izquierda/derecha.

## 4. Problemas comunes

- El brazo derecho mueve el izquierdo: **espejo/lateralidad**. Se arregla en `solver.js`.
- El brazo gira al revés o hacia atrás: probablemente un **signo** (multiplicar por -1 un eje).
- El muñeco se "desarma" o gira raro: datos con `visibility` baja o puntos fuera de cámara.
- Kalidokit devuelve movimientos muy bruscos: el suavizado del líder ayuda, y también se puede amortiguar el valor final.
- Los ejemplos de internet no coinciden con la versión instalada: **confíen en `console.log` del `rig` real**, no en el ejemplo.

## 5. Plan B (si Kalidokit no se deja conectar)

Calcular los giros de los brazos **a mano con vectores**: dirección hombro→codo y codo→muñeca, y convertirlas en ángulos. Es más trabajo, pero solo necesitamos brazos y torso para el MVP. Avisen al líder ese mismo día si van por este camino.

## 6. Cómo probar sin esperar a los demás

- Pídanle al líder (Detección) un **JSON con 2 o 3 fotogramas reales** de `landmarks` y `worldLandmarks`, y llamen `solvePose` con eso.
- Con `console.log(rig)` verifiquen que los valores cambian de forma lógica al levantar un brazo.

## 7. Está lista cuando

- [ ] Con datos reales, `solvePose` devuelve un `rig` sin errores.
- [ ] Al levantar un brazo frente a la cámara, los números de ese brazo cambian en el sentido correcto.
- [ ] Izquierda y derecha coinciden con lo que decidimos (espejo o no).
- [ ] Sin persona, devuelve `null` y no se rompe nada.

## 8. Con quién coordinarte

- **Escena 3D (cupo 1):** aplica su `rig` al VRM. Pruébenlo juntos en cuanto tengan algo que probar.
- **Líder (Detección):** de ahí vienen sus datos.

## 9. Cómo subir tu trabajo

```
git checkout develop
git pull
git checkout -b feature/animacion-<tarea>      # ej: feature/animacion-brazos
git push -u origin feature/animacion-<tarea>
```
Pull Request con **base: develop**. Correr el proyecto: `npx serve .` dentro de `deja-de-ser-npc`. Como son 2 en el mismo archivo, repartan por funciones (por ejemplo, uno brazos y torso, otro suavizado del rig y piernas) y hagan `git pull` de `develop` antes de cada PR.

**Plazos:** lun 16 votación y arranque, mar 17 cada uno construye su parte (primer PR a `develop` al final del día), mié 18 integración y congelamiento de funciones, jue 19 solo bugs, pruebas con gente y release, vie 20 entrega.

---

## 10. Reparto de los 2 cupos

**Cupo 1:** el núcleo de `solvePose`.
- La prueba clave de Kalidokit con MediaPipe actual.
- Brazos y torso con `enableLegs: false`.

**Cupo 2:** lo que lo deja bien.
- Espejo/lateralidad, signos y puntos de baja visibilidad (mantener el último valor bueno).
- Probar con el JSON de fotogramas que entrega Detección.
- **Plan B** (giros de brazos con vectores) solo si Kalidokit no se deja conectar.
- Piernas, solo si el MVP ya está listo.

Es el mismo archivo (`solver.js`): repártanse por funciones (por ejemplo, `solveUpperBody` y `fixRig`) y hagan `git pull` de `develop` antes de cada PR.
