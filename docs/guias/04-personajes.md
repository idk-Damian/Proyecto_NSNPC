# Guía: PERSONAJES

**Quiénes:** 2 personas (cupo 1 y cupo 2)
**Tus archivos:** `src/avatars.js` y la carpeta `assets/models/`
**Tu trabajo en una frase:** conseguir o crear 4 o 5 personajes que funcionen en nuestro proyecto, y dejar claro de dónde salió cada uno y bajo qué licencia.
**Casi no necesitas programar:** necesitas criterio, paciencia y creatividad.

---

## 1. Qué entregas

1. **4 o 5 archivos `.vrm`** dentro de `assets/models/`, todos probados.
2. **`src/avatars.js`** con la lista de personajes, con este formato:

```js
export const AVATARS = [
  { id: 'ejemplo', name: 'Nombre visible', url: './assets/models/ejemplo.vrm', license: 'CC BY 4.0' },
];
```

3. **Un archivo `assets/models/LICENCIAS.md`** con una tabla: archivo, de dónde salió (link), autor, licencia, si exige dar crédito, y versión VRM (0.x o 1.0). Avisen al líder para que lo apruebe en el PR.

## 2. Primero entiende esto (es lo que más confunde)

- **VRM** es un formato de personaje humanoide basado en glTF. **No es lo mismo** que un `.fbx` o `.glb` cualquiera.
- Un modelo de **Sketchfab** o de **Mixamo** casi siempre **NO viene en VRM**. Para usarlo hay que convertirlo (por ejemplo, con Blender y el complemento **"VRM Add-on for Blender"**), y eso toma tiempo.
- La opción más rápida y segura: **VRoid Studio** (crear tu propio personaje y exportarlo como VRM) o descargar modelos que **ya estén en VRM** con licencia que lo permita.

## 3. Pasos sugeridos

1. **Con el grupo, decidan qué personajes quieren** (propios, estilo anime, populares). Lleva 4 o 5 opciones a la votación.
2. **Empieza por lo más fácil:** crea 2 personajes con **VRoid Studio** y expórtalos como `.vrm`. Anota qué versión de VRM exporta.
3. Busca personajes ya hechos en VRM (VRoid Hub y otras fuentes). **Revisa la licencia de cada uno antes de descargar.** Muchos son "solo uso personal" o no permiten redistribuir.
4. Para personajes populares (de películas, juegos, etc.), lo más probable es que tengan derechos de autor. Para una demo escolar sin fines de lucro suele ser aceptable, pero **no se publican en internet**. Si hay duda, prefiere modelos propios o con licencia libre.
5. **Cuida el peso.** Apunta a menos de ~10 MB por modelo (VRoid permite reducir texturas al exportar). Modelos muy pesados tardan en cargar y ralentizan la demo.
6. **Nombra los archivos sin espacios ni tildes** y en minúsculas: `heroe-azul.vrm`.
7. **Prueba cada modelo en el proyecto** con ayuda de Escena 3D: que cargue, que se vea de frente y que se mueva bien al probar los giros.
8. Llena `avatars.js` y `LICENCIAS.md`.

## 4. Cómo verificar la licencia (no la asumas)

- Cada VRM trae su licencia **dentro del archivo**, en los metadatos (`vrm.meta`).
- Pídele a Escena 3D que haga `console.log(vrm.meta)` al cargarlo, o míralo en VRoid Studio/VRoid Hub.
- Anota en `LICENCIAS.md` lo que diga **el propio modelo**, no lo que recuerdes de la página.
- Si la licencia exige **dar crédito** (por ejemplo, CC BY), pon el crédito en `LICENCIAS.md` y avisa a Interfaz para mostrarlo en pantalla.
- En `avatars.js`, **no pongas una licencia que no hayas verificado**: escribe `'verificar'`.

## 5. Qué investigar

- [ ] **"VRoid Studio"** (vroid.com/en/studio): crear y exportar personajes. Mira las opciones de exportación (versión VRM, texturas).
- [ ] **"VRoid Hub"**: modelos de otros. Revisa las condiciones de uso de cada uno.
- [ ] **"vrm.dev licencia"**: qué significan los permisos de un VRM.
- [ ] **"Creative Commons CC BY / CC BY-NC / CC0"**: diferencia básica (crédito, uso comercial).
- [ ] **"VRM Add-on for Blender"** y **"Mixamo"**: solo si quieren convertir otros modelos a VRM.
- [ ] **"Sketchfab downloadable VRM license"**: cómo filtrar por licencia y por modelos descargables.

## 6. Problemas comunes

- El modelo **no carga**: puede no ser un VRM real (es un `.glb` renombrado).
- Carga pero **no se mueve bien**: esqueleto raro (personajes sin brazos, animales, muñecos muy estilizados). Necesitamos humanoides con brazos, torso y piernas.
- Aparece **de espaldas**: orientación VRM 0.x vs 1.0 (lo arregla Escena 3D).
- El archivo **pesa demasiado**: GitHub avisa desde ~50 MB y bloquea sobre 100 MB. Si algún modelo es grande, avisa al líder y busca otra forma de compartirlo (por ejemplo, un enlace de Drive).

## 7. Está lista cuando

- [ ] Hay 4 o 5 `.vrm` en `assets/models/` y **todos cargan** en el proyecto.
- [ ] `avatars.js` tiene la lista completa con `id`, `name`, `url` y `license`.
- [ ] `LICENCIAS.md` está llena y verificada.
- [ ] Probamos con el grupo que cada personaje se vea bien y se mueva.

## 8. Con quién coordinarte

- **Escena 3D:** para probar los modelos en el proyecto.
- **Interfaz:** los nombres que pongas en `avatars.js` aparecen en los botones.
- **Líder:** para aprobar `LICENCIAS.md` y resolver dudas de archivos pesados.

## 9. Cómo subir tu trabajo

```
git checkout develop
git pull
git checkout -b feature/personajes-<tarea>      # ej: feature/personajes-primeros-3
git add assets/models src/avatars.js
git commit -m "feat: agregar personajes vrm"
git push -u origin feature/personajes-<tarea>
```
Pull Request con **base: develop**. Correr el proyecto: `npx serve .` dentro de `deja-de-ser-npc`.

**Plazos:** lun 16 votación y arranque, mar 17 cada uno construye su parte (primer PR a `develop` al final del día), mié 18 integración y congelamiento de funciones, jue 19 solo bugs, pruebas con gente y release, vie 20 entrega.

---

## 10. Reparto de los 2 cupos

**Cupo 1: crear.** 2 o 3 personajes propios con VRoid Studio, exportados como `.vrm` y pesando poco. Le pasan al cupo 2 los datos de cada uno (nombre, versión VRM, créditos).

**Cupo 2: buscar y documentar.**
- 2 o 3 modelos ya hechos en VRM, **verificando la licencia en el propio modelo**.
- Es **dueño de `avatars.js` y de `assets/models/LICENCIAS.md`**: ahí registra los modelos de los dos.
- Coordina con Escena 3D la prueba de que todos cargan y se mueven bien.

Así evitan que los dos editen el mismo archivo a la vez.
