# 🎓 Plan de Tesis · G7 — Maestría en Data Science UPC

PWA de planificación del equipo (Sol, Michel y Jhely): calendario con la ruta
hasta el envío de la tesis (6 de septiembre) y el cronograma de capacitación
cruzada de los 6 bloques (septiembre – noviembre).

## ¿Qué incluye?

- 📆 **Calendario** de agosto a noviembre con el día actual resaltado, los días
  transcurridos tachados y cada actividad pintada por color (persona / ruta de
  tesis / PPT / hitos).
- 🛤️ **Ruta hasta el envío**: checklist de etapas (envío al asesor, rondas de
  feedback, correcciones, cierre y envío final).
- 🗣️ **Bloques de capacitación cruzada**: quién expone cada fin de semana, con
  el argumento central, los puntos obligatorios y las 3 preguntas de
  sustentación de cada bloque.
- 📄 Accesos directos al documento de tesis y a la carpeta compartida.
- ✍️ Cualquiera puede marcar días (hecho / enviado / feedback / ojo) y dejar
  notas **sin cuenta** — se guardan en el navegador de cada dispositivo
  (`localStorage`).
- 📲 **PWA instalable**: en el celular se agrega a la pantalla de inicio y se ve
  como una app nativa; funciona incluso sin conexión.

## Publicar en Netlify

Es un sitio 100% estático — no hay build.

1. En [Netlify](https://app.netlify.com) → **Add new site → Import an existing
   project** → conectar este repositorio de GitHub.
2. Build command: *(vacío)* · Publish directory: `.` (ya está configurado en
   `netlify.toml`).
3. Deploy. Cada push a la rama publicada actualiza el sitio automáticamente.

## Estructura

```
index.html            Página principal (todo el contenido)
css/styles.css        Estilos (mobile-first, responsive)
js/app.js             Datos del plan + calendario + marcas locales
manifest.webmanifest  Manifiesto PWA
sw.js                 Service worker (offline)
icons/                Íconos de la app
netlify.toml          Configuración de Netlify
```

## Editar el plan

Todas las fechas, fases, hitos y bloques viven al inicio de `js/app.js`
(constantes `PHASES`, `MILESTONES`, `SESSIONS`, `BLOCKS`, `ROUTE`). Basta
editar ahí y hacer push.
