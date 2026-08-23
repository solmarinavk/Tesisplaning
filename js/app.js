/* ================================================================
   Plan de Tesis · G7 — Maestría en Data Science UPC
   Todo es estático y visual. Las marcas se guardan en localStorage.
   ================================================================ */

"use strict";

/* ---------- Utilidades de fecha (siempre en hora local) ---------- */

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function ymd(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function parseYmd(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function todayStr() { return ymd(new Date()); }
function daysBetween(fromStr, toStr) {
  const ms = parseYmd(toStr) - parseYmd(fromStr);
  return Math.round(ms / 86400000);
}
function fmtLong(s) {
  const d = parseYmd(s);
  const dayName = DAY_NAMES[d.getDay()];
  const cap = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  return `${cap} ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
}

/* ---------- Datos del plan ---------- */

const PEOPLE = {
  michel: { name: "Michel", cls: "michel" },
  sol:    { name: "Sol",    cls: "sol" },
  jhely:  { name: "Jhely",  cls: "jhely" },
  libre:  { name: "Equipo", cls: "libre" },
};

// Fases de la ruta de tesis (rangos de días, sin traslapes para pintar el calendario)
const PHASES = [
  { from: "2026-08-22", to: "2026-08-24", label: "Cierre del borrador",
    note: "Afinar el documento para compartirlo al asesor el lunes 24." },
  { from: "2026-08-25", to: "2026-08-26", label: "Espera de feedback 1",
    note: "El asesor revisa el documento durante la semana." },
  { from: "2026-08-27", to: "2026-08-30", label: "Correcciones ronda 1",
    note: "Jueves a domingo: aplicar el feedback del asesor y reenviarle el documento (dom 30 o lun 31)." },
  { from: "2026-08-31", to: "2026-09-04", label: "Feedback 2 + últimas correcciones",
    note: "El asesor revisa de nuevo; el equipo va cerrando las últimas correcciones hasta el sábado 5." },
  { from: "2026-09-05", to: "2026-09-05", label: "🔒 Cierre total del documento",
    note: "Hoy se cierra todo. Nada nuevo entra después de este día." },
];

// Hitos puntuales (se dibujan con borde rojo en el calendario)
const MILESTONES = [
  { date: "2026-08-24", emoji: "📤", title: "Se comparte el documento al asesor" },
  { date: "2026-08-30", emoji: "📤", title: "Reenvío al asesor (dom 30 o lun 31)" },
  { date: "2026-09-05", emoji: "🔒", title: "Cierre total del documento" },
  { date: "2026-09-06", emoji: "🎓", title: "ENVÍO DE LA TESIS", final: true },
];

// Fase transversal: preparación del PPT (después del bloque 3, hasta el 1 de noviembre)
const PPT_PHASE = { from: "2026-09-28", to: "2026-11-01", label: "Preparación del PPT de sustentación" };

// Sesiones de fin de semana (capacitación cruzada)
const SESSIONS = [
  { days: ["2026-09-12", "2026-09-13"], block: 1, who: "michel", chip: "B1" },
  { days: ["2026-09-19", "2026-09-20"], block: 2, who: "sol",    chip: "B2" },
  { days: ["2026-09-26", "2026-09-27"], block: 3, who: "jhely",  chip: "B3" },
  { days: ["2026-10-03", "2026-10-04"], block: 0, who: "libre",  chip: "PPT" },
  { days: ["2026-10-10", "2026-10-11"], block: 4, who: "michel", chip: "B4" },
  { days: ["2026-10-17", "2026-10-18"], block: 0, who: "libre",  chip: "PPT" },
  { days: ["2026-10-24", "2026-10-25"], block: 5, who: "jhely",  chip: "B5" },
  { days: ["2026-10-31", "2026-11-01"], block: 6, who: "sol",    chip: "B6" },
];

// Contenido de los bloques (del plan de capacitación cruzada)
const BLOCKS = [
  {
    n: 1, who: "michel", when: "Sáb 12 – Dom 13 de septiembre",
    title: "El problema, la brecha y los objetivos",
    covers: "Capítulo 1 completo y la síntesis del estado del arte.",
    argument: "No existe un instrumento validado y publicado que operacionalice el riesgo operativo del personal de seguridad privada en el contexto latinoamericano, pese a existir desarrollos equivalentes para minería artesanal en Chile y combate de incendios forestales en México. Esa es la brecha que la tesis cierra.",
    points: [
      "Por qué el problema importa: contexto normativo peruano, cifras de incidencia del Callao y el riesgo bidireccional del agente.",
      "Los seis objetivos específicos y qué sección responde a cada uno (lo primero que revisa un jurado).",
      "Por qué la brecha se reformuló: no es que la empresa carezca de categorías internas, es que no existe instrumento publicado para el sector.",
      "La pregunta de investigación en sus dos mitades: cuánta señal existe y cómo se mide sin sobreestimarla.",
    ],
    questions: [
      "¿Por qué esta tesis y no un proyecto de consultoría?",
      "¿Cómo sabe que no existe un instrumento previo? ¿Qué buscó y dónde?",
      "¿Qué objetivo específico responde cada capítulo?",
    ],
  },
  {
    n: 2, who: "sol", when: "Sáb 19 – Dom 20 de septiembre",
    title: "El instrumento y la validación por juicio experto",
    covers: "Operacionalización, validación por juicio de expertos y hallazgos cualitativos transversales.",
    argument: "Se construyó un instrumento de catorce variables y se validó con siete jueces expertos en dos criterios, pertinencia y claridad, mediante el coeficiente V de Aiken con intervalos de confianza por método score. Es la contribución principal de la tesis.",
    points: [
      "Cómo se calcula la V de Aiken y por qué se prefiere a los índices de acuerdo: permite contraste estadístico.",
      "Por qué se usan intervalos y no la estimación puntual, y por qué Wald es inapropiado sobre una variable acotada.",
      "El criterio de dos niveles adoptado, y por qué el contraste direccional usa el intervalo al 90% y no al 95%.",
      "Por qué siete jueces no es una limitación: es la práctica habitual del área.",
      "Los hallazgos cualitativos: el código encubierto por radio, el artefacto de registro entre aplicaciones y la explicación experta del patrón de antigüedad.",
    ],
    questions: [
      "¿Por qué V de Aiken y no teoría de respuesta al ítem?",
      "Con siete jueces, ¿sus intervalos no son demasiado anchos para concluir algo?",
      "¿Qué habría concluido si no hubiera consultado a los expertos?",
    ],
  },
  {
    n: 3, who: "jhely", when: "Sáb 26 – Dom 27 de septiembre",
    title: "Los datos y el pipeline",
    covers: "Secciones 4.1 a 4.4 y la parte metodológica de pseudonimización.",
    argument: "Se construyó un pipeline reproducible sobre once tablas y más de ochenta millones de registros, con 41/41 y 30/30 chequeos de integridad conformes, y trece defectos de procesamiento identificados y corregidos.",
    points: [
      "Las tres familias disjuntas de código de personal y su verificación cruzada: 6 coincidencias sobre 211,424 y 4,362 registros.",
      "La consecuencia permanente: no existe vínculo confiable agente-turno, y eso determina qué variables son construibles.",
      "Calidad del dato: 10.52% de coordenadas centinela, velocidad no confiable, y continuidad operativa vs. movilidad espacial.",
      "La segmentación de turnos: de 16,054 turnos con máximos de 161 días a 106,699 turnos con mediana de 11.98 horas.",
      "La tabla de brecha de operacionalización: catorce validadas, tres construibles.",
    ],
    questions: [
      "¿Cómo garantiza que la pseudonimización no rompió la integridad referencial?",
      "¿Por qué descartó la variable de permanencia en zona si los expertos la valoraron con consenso unánime?",
      "¿Qué haría falta para construir las diez variables restantes?",
    ],
  },
  {
    n: 4, who: "michel", when: "Sáb 10 – Dom 11 de octubre",
    title: "El etiquetado y los cinco sesgos",
    covers: "Secciones 4.5 y 4.6, y el protocolo de evaluación del Capítulo 3.",
    argument: "La evaluación ingenua de este problema infla el desempeño en más de treinta puntos porcentuales. Se identificaron y corrigieron cinco sesgos, cada uno con su magnitud medida. Es la sección que un jurado va a recordar.",
    points: [
      "La reconciliación del número real de eventos: de 2,447 a 301 a 54, y por qué los 508 positivos originales no eran independientes.",
      "El sesgo de asignación al evento más próximo: nueve eventos con 199 a 479 observaciones que desaparecían; detectado dos veces.",
      "La confusión de identidad de dispositivo: recall inicial de 72.22% y por qué activó sospecha en lugar de celebración.",
      "La prueba sintética: 35% de recall sin señal real, cuando lo esperable era 5%.",
      "El sesgo de comparaciones múltiples: 1 − 0.95²⁹ da 77.6% frente al 81.48% observado. La coincidencia es el argumento.",
    ],
    questions: [
      "¿Cómo supo que el 72.22% estaba mal?",
      "La fuga por identidad ya está descrita en la literatura desde 2017. ¿Qué aporta usted?",
      "¿Cómo garantiza que no queda un sexto sesgo sin detectar?",
    ],
  },
  {
    n: 5, who: "jhely", when: "Sáb 24 – Dom 25 de octubre",
    title: "Los modelos y sus resultados",
    covers: "Secciones 4.7 a 4.13.",
    argument: "Se compararon tres familias de modelos bajo el protocolo corregido. En el umbral operativo el recall es de 31.5% para el clasificador recurrente y 38.9% para el ensamble de árboles, con intervalos superpuestos y volumen de alertas equivalente.",
    points: [
      "El autoencoder y por qué las cuatro configuraciones convergieron: razón de medianas estable en 1.38 = techo del enfoque.",
      "La varianza de inicialización: de 5.6% a 31.5% en el percentil 99.9 solo por promediar diez semillas.",
      "Por qué el ensamble de árboles gana en umbrales intermedios: ya incorpora promediado por construcción.",
      "La validación de robustez: distribución nula de media 4.63% y máximo 11.11%, con el observado fuera del rango completo.",
      "La simulación de alertas: por qué el percentil 99.9 es el único umbral operativamente viable (17 incidentes diarios).",
    ],
    questions: [
      "¿Por qué un modelo de árboles le gana a su arquitectura profunda?",
      "Un recall de 31.5%, ¿sirve para algo?",
      "¿Qué significa exactamente que la ganancia por ensamble crezca hacia la cola?",
    ],
  },
  {
    n: 6, who: "sol", when: "Sáb 31 oct – Dom 1 de noviembre",
    title: "El cierre argumental",
    covers: "Secciones 4.14, 4.15 y Capítulo 5 completo.",
    argument: "La hipótesis original se rechaza en sus dos componentes, y el resultado de mayor alcance es que el límite del problema está en la infraestructura de datos y no en el algoritmo.",
    points: [
      "El régimen temporal: 3 eventos anticipados, 51 simultáneos, 0 tardíos, y la corrección del criterio que mezclaba dos poblaciones.",
      "Cómo se declara el rechazo de la hipótesis sin que suene a fracaso: es el desenlace normal de un contraste.",
      "La triangulación: los expertos señalan catorce variables, la infraestructura permite tres; ambas fuentes convergen en el mismo límite.",
      "La brecha de validez de constructo: se mide activación de botón y se habla de riesgo operativo. Declararla antes de que la señalen.",
      "Las cinco recomendaciones a la organización y por qué la primera habilitaría seis variables de una sola vez.",
    ],
    questions: [
      "Si su hipótesis se rechaza, ¿cuál es el aporte de la tesis?",
      "Si el botón de pánico ya existe y es instantáneo, ¿qué agrega su modelo?",
      "¿Qué recomendación daría si la empresa solo pudiera hacer una cosa?",
    ],
  },
];

// Etapas de la ruta (checklist)
const ROUTE = [
  { id: "r1", when: "Sáb 22 – Lun 24 ago", title: "Cierre del borrador", desc: "Afinar el documento completo para compartirlo al asesor.", },
  { id: "r2", when: "Lun 24 ago", title: "📤 Compartir el documento al asesor", desc: "Se envía la versión completa para su revisión.", milestone: true },
  { id: "r3", when: "Mar 25 – Mié 26 ago", title: "Espera de feedback 1", desc: "El asesor revisa durante la semana. Marcar el día que devuelva feedback en el calendario 📩." },
  { id: "r4", when: "Jue 27 – Dom 30 ago", title: "Correcciones ronda 1", desc: "Aplicar todo el feedback del asesor." },
  { id: "r5", when: "Dom 30 – Lun 31 ago", title: "📤 Reenviar al asesor", desc: "Devolver el documento corregido para segunda revisión.", milestone: true },
  { id: "r6", when: "Lun 31 ago – Vie 4 sep", title: "Feedback 2 + últimas correcciones", desc: "El asesor revisa de nuevo; el equipo cierra las correcciones finales." },
  { id: "r7", when: "Sáb 5 sep", title: "🔒 Cierre total del documento", desc: "Nada nuevo entra después de este día.", milestone: true },
  { id: "r8", when: "Dom 6 sep", title: "🎓 ENVÍO DE LA TESIS", desc: "¡Entrega oficial!", milestone: true },
  { id: "r9", when: "12 sep – 1 nov", title: "Capacitación cruzada (6 bloques)", desc: "Un bloque por fin de semana. Ver sección Bloques." },
  { id: "r10", when: "28 sep – 1 nov", title: "Preparación del PPT", desc: "En paralelo a los bloques, se arma la presentación de sustentación." },
];

const SEND_DATE = "2026-09-06";

/* ---------- Estado local (localStorage) ---------- */

const STORE_KEY = "tesis-plan-g7-v1";
let state = { markers: {}, notes: {}, route: {} };
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) state = Object.assign(state, JSON.parse(raw));
} catch (e) { /* modo privado o storage bloqueado: la app sigue funcionando */ }

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* sin persistencia */ }
}

const MARKER_EMOJI = { hecho: "✅", enviado: "📤", feedback: "📩", ojo: "⚠️" };

/* ---------- Consultas por día ---------- */

function inRange(dateStr, from, to) { return dateStr >= from && dateStr <= to; }

function phaseFor(dateStr) {
  return PHASES.find(p => inRange(dateStr, p.from, p.to)) || null;
}
function sessionFor(dateStr) {
  return SESSIONS.find(s => s.days.includes(dateStr)) || null;
}
function milestonesFor(dateStr) {
  return MILESTONES.filter(m => m.date === dateStr);
}
function inPpt(dateStr) {
  return inRange(dateStr, PPT_PHASE.from, PPT_PHASE.to);
}

/* ---------- Render: calendario ---------- */

const CAL_MONTHS = [[2026, 7], [2026, 8], [2026, 9], [2026, 10]]; // ago, sep, oct, nov

function buildCalendar() {
  const wrap = document.getElementById("months");
  wrap.innerHTML = "";
  const today = todayStr();

  for (const [year, month] of CAL_MONTHS) {
    const monthEl = document.createElement("div");
    monthEl.className = "month";
    const title = document.createElement("h3");
    title.textContent = `${MONTH_NAMES[month]} ${year}`;
    monthEl.appendChild(title);

    const wd = document.createElement("div");
    wd.className = "weekdays";
    for (const w of ["L", "M", "X", "J", "V", "S", "D"]) {
      const s = document.createElement("span");
      s.textContent = w;
      wd.appendChild(s);
    }
    monthEl.appendChild(wd);

    const grid = document.createElement("div");
    grid.className = "grid";

    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7; // lunes = 0
    for (let i = 0; i < lead; i++) {
      const e = document.createElement("div");
      e.className = "day empty";
      grid.appendChild(e);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = ymd(new Date(year, month, d));
      grid.appendChild(buildDay(dateStr, d, today));
    }

    monthEl.appendChild(grid);
    wrap.appendChild(monthEl);
  }
}

function buildDay(dateStr, dayNum, today) {
  const btn = document.createElement("button");
  btn.className = "day";
  btn.dataset.date = dateStr;

  const num = document.createElement("span");
  num.className = "dnum";
  num.textContent = dayNum;
  btn.appendChild(num);

  const session = sessionFor(dateStr);
  const phase = phaseFor(dateStr);
  const miles = milestonesFor(dateStr);

  if (session) {
    btn.classList.add(session.who === "libre" ? "p-ppt" : `p-${session.who}`);
    const chip = document.createElement("span");
    chip.className = `chip chip-${session.who === "libre" ? "ppt" : session.who}`;
    chip.textContent = session.chip;
    btn.appendChild(chip);
  } else if (phase) {
    btn.classList.add("p-tesis");
  } else if (inPpt(dateStr)) {
    btn.classList.add("p-ppt");
  }

  if (miles.length) {
    const isFinal = miles.some(m => m.final);
    btn.classList.add(isFinal ? "p-final" : "p-hito");
    const em = document.createElement("span");
    em.className = "emoji";
    em.textContent = miles[miles.length - 1].emoji;
    btn.appendChild(em);
  }

  if (dateStr < today) btn.classList.add("past");
  if (dateStr === today) btn.classList.add("today");

  // marcas del equipo
  const mk = state.markers[dateStr];
  if (mk && MARKER_EMOJI[mk]) {
    const badge = document.createElement("span");
    badge.className = "marker-badge";
    badge.textContent = MARKER_EMOJI[mk];
    btn.appendChild(badge);
  }
  if (state.notes[dateStr]) {
    const ind = document.createElement("span");
    ind.className = "note-ind";
    ind.textContent = "📝";
    btn.appendChild(ind);
  }

  btn.addEventListener("click", () => openSheet(dateStr));
  return btn;
}

/* ---------- Render: hero ---------- */

function buildHero() {
  const today = todayStr();
  document.getElementById("hero-date").textContent = fmtLong(today);

  const cd = document.getElementById("hero-countdown");
  cd.innerHTML = "";

  const toSend = daysBetween(today, SEND_DATE);
  if (toSend > 0) {
    cd.appendChild(pill("count-envio", toSend, `día${toSend === 1 ? "" : "s"} para el envío de la tesis (dom 6 sep)`));
  } else if (toSend === 0) {
    cd.appendChild(pill("count-envio", "¡HOY!", "Se envía la tesis 🎓"));
  } else {
    cd.appendChild(pill("count-done", "✔", "Tesis enviada el 6 de septiembre"));
  }

  // próxima sesión de bloque
  const next = SESSIONS.find(s => s.block > 0 && s.days[1] >= today);
  if (next) {
    const d = daysBetween(today, next.days[0]);
    const who = PEOPLE[next.who].name;
    const lbl = d <= 0
      ? `¡Este finde! Bloque ${next.block} — expone ${who}`
      : `día${d === 1 ? "" : "s"} para el Bloque ${next.block} — expone ${who}`;
    cd.appendChild(pill("count-next", d <= 0 ? "🎤" : d, lbl));
  } else if (today > "2026-11-01") {
    cd.appendChild(pill("count-done", "🏆", "Los 6 bloques están completos"));
  }

  // fase actual
  const ph = document.getElementById("hero-phase");
  const phase = phaseFor(today);
  const session = sessionFor(today);
  const miles = milestonesFor(today);

  if (miles.length) {
    ph.innerHTML = `<strong>${miles[0].emoji} ${miles[0].title}</strong>`;
  } else if (session && session.block > 0) {
    const b = BLOCKS.find(x => x.n === session.block);
    ph.innerHTML = `<strong>🎤 Fin de semana de exposición: Bloque ${session.block}</strong>
      <span class="phase-note">${b.title} — expone ${PEOPLE[session.who].name}</span>`;
  } else if (session) {
    ph.innerHTML = `<strong>🖥️ Fin de semana libre de bloques</strong>
      <span class="phase-note">Avanzar el PPT de sustentación.</span>`;
  } else if (phase) {
    ph.innerHTML = `<strong>📍 Etapa actual: ${phase.label}</strong>
      <span class="phase-note">${phase.note}</span>`;
  } else if (inPpt(today)) {
    ph.innerHTML = `<strong>📍 Etapa actual: ${PPT_PHASE.label}</strong>
      <span class="phase-note">En paralelo a los bloques de los fines de semana.</span>`;
  } else if (today < "2026-08-22") {
    ph.innerHTML = `<strong>El plan arranca el sábado 22 de agosto.</strong>`;
  } else {
    ph.innerHTML = `<strong>🏆 Plan completado.</strong> <span class="phase-note">¡A sustentar con todo!</span>`;
  }
}

function pill(cls, num, lbl) {
  const el = document.createElement("div");
  el.className = `count-pill ${cls}`;
  el.innerHTML = `<span class="num">${num}</span><span class="lbl">${lbl}</span>`;
  return el;
}

/* ---------- Render: timeline / ruta ---------- */

function buildTimeline() {
  const ol = document.getElementById("timeline");
  ol.innerHTML = "";
  for (const step of ROUTE) {
    const li = document.createElement("li");
    li.className = "tl-item" + (step.milestone ? " milestone" : "") + (state.route[step.id] ? " done" : "");
    li.innerHTML = `
      <div class="tl-card">
        <input type="checkbox" ${state.route[step.id] ? "checked" : ""} aria-label="Marcar etapa como completada">
        <div class="tl-body">
          <div class="tl-when">${step.when}</div>
          <div class="tl-title">${step.title}</div>
          <div class="tl-desc">${step.desc}</div>
        </div>
      </div>`;
    li.querySelector("input").addEventListener("change", (e) => {
      state.route[step.id] = e.target.checked;
      if (!e.target.checked) delete state.route[step.id];
      save();
      li.classList.toggle("done", e.target.checked);
    });
    ol.appendChild(li);
  }
}

/* ---------- Render: bloques ---------- */

function buildBlocks() {
  const wrap = document.getElementById("blocks");
  wrap.innerHTML = "";
  for (const b of BLOCKS) {
    const who = PEOPLE[b.who];
    const card = document.createElement("article");
    card.className = `block-card c-${who.cls}`;
    card.innerHTML = `
      <div class="block-head">
        <div class="block-when">📅 ${b.when}</div>
        <h3 class="block-title">Bloque ${b.n}. ${b.title}</h3>
        <span class="presenter pr-${who.cls}">🎤 Expone: ${who.name}</span>
      </div>
      <details>
        <summary>Ver contenido del bloque</summary>
        <div class="block-detail">
          <p class="covers"><strong>Cubre:</strong> ${b.covers}</p>
          <div>
            <h4>Argumento central</h4>
            <p class="argumento">“${b.argument}”</p>
          </div>
          <div>
            <h4>Puntos obligatorios</h4>
            <ul>${b.points.map(p => `<li>${p}</li>`).join("")}</ul>
          </div>
          <div>
            <h4>3 preguntas de sustentación</h4>
            <ul>${b.questions.map(q => `<li>${q}</li>`).join("")}</ul>
          </div>
        </div>
      </details>`;
    wrap.appendChild(card);
  }
}

/* ---------- Sheet de día ---------- */

let sheetDate = null;
const sheet = document.getElementById("sheet");
const backdrop = document.getElementById("sheet-backdrop");
const noteEl = document.getElementById("sheet-note");

function openSheet(dateStr) {
  sheetDate = dateStr;
  document.getElementById("sheet-date").textContent = fmtLong(dateStr);

  const evWrap = document.getElementById("sheet-events");
  evWrap.innerHTML = "";
  const events = [];

  for (const m of milestonesFor(dateStr)) {
    events.push({ cls: "ev-hito", html: `${m.emoji} ${m.title}` });
  }
  const session = sessionFor(dateStr);
  if (session) {
    if (session.block > 0) {
      const b = BLOCKS.find(x => x.n === session.block);
      events.push({
        cls: `ev-${session.who}`,
        html: `🎤 <strong>Bloque ${session.block}: ${b.title}</strong>
               <div class="ev-sub">Expone ${PEOPLE[session.who].name} · 40 min (25 exposición + 15 preguntas)</div>`,
      });
    } else {
      events.push({ cls: "ev-ppt", html: `🖥️ Fin de semana sin bloque <div class="ev-sub">Avanzar el PPT de sustentación</div>` });
    }
  }
  const phase = phaseFor(dateStr);
  if (phase) {
    events.push({ cls: "ev-tesis", html: `📍 ${phase.label} <div class="ev-sub">${phase.note}</div>` });
  }
  if (!session && !phase && inPpt(dateStr)) {
    events.push({ cls: "ev-ppt", html: `🖥️ ${PPT_PHASE.label}` });
  }

  if (events.length === 0) {
    evWrap.innerHTML = `<p class="sheet-empty">Sin actividades planificadas este día.</p>`;
  } else {
    for (const ev of events) {
      const div = document.createElement("div");
      div.className = `sheet-event ${ev.cls}`;
      div.innerHTML = ev.html;
      evWrap.appendChild(div);
    }
  }

  // estado de marcas
  const current = state.markers[dateStr] || "";
  document.querySelectorAll("#marker-row .marker").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.marker === current && current !== "");
  });
  noteEl.value = state.notes[dateStr] || "";

  sheet.classList.remove("hidden");
  backdrop.classList.remove("hidden");
}

function closeSheet() {
  sheet.classList.add("hidden");
  backdrop.classList.add("hidden");
  sheetDate = null;
  buildCalendar(); // refrescar badges
}

document.getElementById("sheet-close").addEventListener("click", closeSheet);
backdrop.addEventListener("click", closeSheet);

document.querySelectorAll("#marker-row .marker").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!sheetDate) return;
    const val = btn.dataset.marker;
    if (val === "" || state.markers[sheetDate] === val) {
      delete state.markers[sheetDate];
    } else {
      state.markers[sheetDate] = val;
    }
    save();
    const current = state.markers[sheetDate] || "";
    document.querySelectorAll("#marker-row .marker").forEach(b => {
      b.classList.toggle("active", b.dataset.marker === current && current !== "");
    });
  });
});

noteEl.addEventListener("input", () => {
  if (!sheetDate) return;
  const v = noteEl.value.trim();
  if (v) state.notes[sheetDate] = v;
  else delete state.notes[sheetDate];
  save();
});

/* ---------- Instrucciones de instalación ---------- */

const iosSheet = document.getElementById("ios-sheet");
const iosBackdrop = document.getElementById("ios-backdrop");
document.getElementById("btn-ios-help").addEventListener("click", () => {
  iosSheet.classList.remove("hidden");
  iosBackdrop.classList.remove("hidden");
});
function closeIos() {
  iosSheet.classList.add("hidden");
  iosBackdrop.classList.add("hidden");
}
document.getElementById("ios-close").addEventListener("click", closeIos);
iosBackdrop.addEventListener("click", closeIos);

/* ---------- Reset ---------- */

document.getElementById("btn-reset").addEventListener("click", () => {
  if (confirm("¿Borrar todas las marcas y notas guardadas en este dispositivo?")) {
    state = { markers: {}, notes: {}, route: {} };
    save();
    buildCalendar();
    buildTimeline();
  }
});

/* ---------- PWA: instalación y service worker ---------- */

let deferredPrompt = null;
const installBtn = document.getElementById("btn-install");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* sin SW, la app sigue */ });
  });
}

/* ---------- Arranque ---------- */

function renderAll() {
  buildHero();
  buildCalendar();
  buildTimeline();
  buildBlocks();
}
renderAll();

// si la app queda abierta y cambia el día, refrescar
setInterval(() => {
  const shown = document.getElementById("hero-date").textContent;
  if (shown !== fmtLong(todayStr())) renderAll();
}, 60000);
