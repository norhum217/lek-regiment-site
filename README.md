# Legion Erzherzog Karl — Campaign Register

Esta es la versión "real" de la web: en lugar de tener los datos pegados dentro
del HTML, la página los lee en directo de tus Google Sheets cada vez que
alguien la abre. Cuando actualizas la hoja, la web se actualiza sola — no
tienes que volver a pedirme nada.

No necesitas saber programar para ponerla en marcha. Sigue los pasos en orden.

---

## Parte 1 — Publicar tus hojas como CSV

Tienes que hacer esto **una vez por cada pestaña** de tu Google Sheet (Mušketýři,
Střelci, Legionáři, CO/XO, Recruitment Tracker, Depot). Son 6 en total.

1. Abre el Google Sheet.
2. Haz clic en la pestaña que quieres publicar (por ejemplo "MUŠKETÝŘI") para
   que sea la hoja activa.
3. Ve a **Archivo → Compartir → Publicar en la Web**.
4. En el primer desplegable, elige **esa hoja concreta** (no "Todo el
   documento").
5. En el segundo desplegable, elige **"Valores separados por comas (.csv)"**.
6. Pulsa **Publicar** y confirma.
7. Te dará un enlace largo — cópialo. Ese es el que necesitas.
8. Repite con las otras 5 pestañas.

Guarda los 6 enlaces en algún sitio (un bloc de notas) — los vas a pegar en el
paso 3.

> ⚠️ Importante: si más adelante **renombras** una pestaña o **añades filas
> por arriba** de forma que la estructura de columnas cambie, ese enlace deja
> de funcionar bien y hay que revisar el parser correspondiente (dímelo y lo
> ajustamos).

---

## Parte 2 — Crear tu cuenta y repositorio en GitHub

GitHub es donde va a vivir el código de la web, y es gratis.

1. Ve a [github.com](https://github.com) y crea una cuenta (si no tienes).
2. Arriba a la derecha, pulsa el botón **+** → **New repository**.
3. Ponle un nombre, por ejemplo `lek-regiment-site`.
4. Déjalo en **Public** (necesario para el plan gratuito de GitHub Pages).
5. No marques ninguna casilla adicional (README, .gitignore, etc.) — vamos a
   subir los archivos ya hechos.
6. Pulsa **Create repository**.

## Parte 3 — Subir los archivos

En la página de tu repositorio recién creado:

1. Pulsa **uploading an existing file** (o el botón **Add file → Upload
   files**).
2. Arrastra estos archivos y carpetas tal cual te los doy:
   - `index.html`
   - `config.js`
   - la carpeta `js/` completa (con `parsers.js` y `data-loader.js` dentro)
   - `README.md` (opcional, es solo para ti)
3. Antes de subir, **edita `config.js`** — puedes hacerlo directamente en tu
   ordenador antes de arrastrarlo, o después editándolo en GitHub (ver
   siguiente paso). Ahí es donde pegas los 6 enlaces del Paso 1.
4. Pulsa **Commit changes** (el botón verde) para confirmar la subida.

### Cómo editar `config.js` más adelante

Cada vez que quieras cambiar un enlace:
1. Entra en tu repositorio en GitHub.
2. Abre `config.js`.
3. Pulsa el icono del lápiz (✏️) arriba a la derecha del archivo.
4. Pega tus enlaces reemplazando los `"PASTE_..._HERE"`.
5. Baja y pulsa **Commit changes**.

No hace falta terminal, ni Git instalado, ni nada — todo desde el navegador.

---

## Parte 4 — Activar GitHub Pages (publicar la web)

1. En tu repositorio, ve a **Settings** (arriba).
2. En el menú de la izquierda, busca **Pages**.
3. En "Branch", selecciona `main` y la carpeta `/ (root)`.
4. Pulsa **Save**.
5. Espera 1-2 minutos. GitHub te dará una URL como:
   `https://tu-usuario.github.io/lek-regiment-site/`
6. Esa es tu web, ya en vivo. Puedes compartir ese enlace con quien quieras.

---

## Parte 5 — Comprobar que todo funciona

1. Abre la URL que te dio GitHub Pages.
2. Deberías ver una pantalla de carga breve ("Loading the muster roll…") y
   luego la web con tus datos reales.
3. Si algo falla, verás un aviso rojo arriba diciendo que no pudo cargar los
   datos. Lo más probable:
   - Algún enlace en `config.js` sigue como `"PASTE_..._HERE"`.
   - Publicaste la hoja equivocada o en el formato equivocado (tiene que ser
     CSV, no "Página web").
   - El enlace de una pestaña concreta caducó o cambiaste el nombre de la
     pestaña (vuelve a publicarla).

Para depurar con más detalle: en el navegador, clic derecho → **Inspeccionar**
→ pestaña **Console**. Ahí verá el error exacto si algo no carga.

---

## Cómo lo actualizas a partir de ahora

**Para los datos (kills, muertes, ascensos, reclutamiento, depot):** no
tienes que hacer nada aquí. Edita tu Google Sheet como siempre — la web lee
los datos en directo cada vez que alguien la visita.

**Para los resultados de batalla:** de momento siguen siendo manuales. Edita
`index.html`, busca el texto `const BATTLES = [` y añade un bloque nuevo
copiando el formato del que ya hay. Súbelo a GitHub (edítalo directamente ahí
con el lápiz ✏️, igual que con `config.js`) y se publica solo en 1-2 minutos.

**Para cambios de diseño o nuevas pestañas:** vuelve a este chat, o si te
animas, usa Claude Code apuntando a este mismo repositorio.

---

## Estructura de archivos

```
lek-regiment-site/
├── index.html          → la web (diseño + lógica de renderizado)
├── config.js            → AQUÍ pegas los enlaces de tus 6 hojas
├── js/
│   ├── parsers.js        → traduce las filas de cada hoja a datos limpios
│   └── data-loader.js    → hace fetch() de las hojas y llama a los parsers
└── README.md            → esta guía
```

## Si algo se rompe

Los parsers dependen de que las columnas de tus hojas sigan en el mismo sitio
(qué columna es "K", cuál es "Rank", etc.). Si reorganizas una hoja y algo dej
a de funcionar, pásame el CSV actualizado en el chat y te devuelvo la parte de
`js/parsers.js` corregida para pegar en GitHub.
