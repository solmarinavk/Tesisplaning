# 🎓 Plan de Tesis · G7 — Maestría en Data Science UPC

PWA sencilla para el equipo (Sol, Michel y Jhely). Dos cosas nada más:

1. **✅ Lo que vamos logrando** — un registro de avances. Se escribe qué se
   logró, se elige la fecha y se agrega. Los días con avance quedan marcados
   con ✅ en el calendario.
2. **📆 Plan de estudio** — calendario con los 6 bloques de capacitación
   cruzada (un bloque por fin de semana, de septiembre a noviembre) y el
   contenido de cada bloque: argumento central, puntos obligatorios y las
   3 preguntas de sustentación.

Además: accesos directos al documento de tesis y a la carpeta compartida, y
un contador de días para el próximo bloque.

Todo se guarda en el navegador del dispositivo (`localStorage`) — **sin
cuentas ni contraseñas**. Es instalable como app en el celular (PWA) y
funciona sin conexión.

## Publicar en Netlify

Sitio 100% estático, no hay build.

1. [Netlify](https://app.netlify.com) → **Add new site → Import an existing project** → conectar este repositorio.
2. Build command: *(vacío)* · Publish directory: `.` (ya está en `netlify.toml`).
3. Cada push actualiza el sitio automáticamente.

## Estructura

```
index.html            Página principal
css/styles.css        Estilos (mobile-first)
js/app.js             Plan de estudio + calendario + avances
manifest.webmanifest  Manifiesto PWA
sw.js                 Service worker (offline)
icons/                Íconos de la app
netlify.toml          Configuración de Netlify
```

## Editar el plan

Al inicio de `js/app.js`:

- `SESSIONS` — qué fin de semana toca cada bloque
- `BLOCKS` — contenido de los 6 bloques
- `SEED_AVANCES` — avances con los que arranca la app la primera vez
