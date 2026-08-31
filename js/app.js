/* ================================================================
   Plan de Tesis · G7 — Maestría en Data Science UPC
   Dos cosas: el plan de estudio (6 bloques) y el registro de avances.
   Todo se guarda en el navegador del dispositivo. Sin cuentas.
   ================================================================ */

"use strict";

/* ---------- Fechas (siempre en hora local) ---------- */

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MONTH_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

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
  return Math.round((parseYmd(toStr) - parseYmd(fromStr)) / 86400000);
}
function fmtLong(s) {
  const d = parseYmd(s);
  const n = DAY_NAMES[d.getDay()];
  return `${n.charAt(0).toUpperCase() + n.slice(1)} ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
}
function fmtShort(s) {
  const d = parseYmd(s);
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

/* ---------- El plan de estudio ---------- */

const PEOPLE = {
  michel: { name: "Michel", cls: "michel" },
  sol:    { name: "Sol",    cls: "sol" },
  jhely:  { name: "Jhely",  cls: "jhely" },
};

// Cada fin de semana: un bloque (o PPT si no expone nadie)
const SESSIONS = [
  { days: ["2026-09-12", "2026-09-13"], block: 1, who: "michel" },
  { days: ["2026-09-19", "2026-09-20"], block: 2, who: "sol" },
  { days: ["2026-09-26", "2026-09-27"], block: 3, who: "jhely" },
  { days: ["2026-10-03", "2026-10-04"], block: 0 },
  { days: ["2026-10-10", "2026-10-11"], block: 4, who: "michel" },
  { days: ["2026-10-17", "2026-10-18"], block: 0 },
  { days: ["2026-10-24", "2026-10-25"], block: 5, who: "jhely" },
  { days: ["2026-10-31", "2026-11-01"], block: 6, who: "sol" },
];

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

// Avances con los que arranca la app la primera vez
const SEED_AVANCES = [
  { d: "2026-08-24", t: "Le compartimos el documento al asesor" },
  { d: "2026-08-28", t: "Turnitin respondió: todo bien 🎉" },
];

/* ---------- Estado guardado ---------- */

const STORE_KEY = "tesis-plan-g7-v2";
let state = { avances: null, blocks: {} };
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) state = Object.assign(state, JSON.parse(raw));
} catch (e) { /* storage bloqueado: la app igual funciona */ }

if (!Array.isArray(state.avances)) {
  state.avances = SEED_AVANCES.map((a, i) => ({ id: "seed" + i, d: a.d, t: a.t }));
}

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* sin persistencia */ }
}

/* ---------- Portada ---------- */

function buildHero() {
  const today = todayStr();
  document.getElementById("hero-date").textContent = fmtLong(today);

  const wrap = document.getElementById("hero-pills");
  wrap.innerHTML = "";

  const next = SESSIONS.find(s => s.block > 0 && s.days[1] >= today);
  if (next) {
    const d = daysBetween(today, next.days[0]);
    const who = PEOPLE[next.who].name;
    if (d <= 0) {
      wrap.appendChild(pill("pill-next", "🎤", `¡Este finde! Bloque ${next.block} — expone ${who}`));
    } else {
      wrap.appendChild(pill("pill-next", d, `día${d === 1 ? "" : "s"} para el Bloque ${next.block} — expone ${who}`));
    }
  }

  const done = BLOCKS.filter(b => state.blocks[b.n]).length;
  wrap.appendChild(pill(done === BLOCKS.length ? "pill-done" : "pill-count",
    `${done}/6`, done === BLOCKS.length ? "¡Los 6 bloques expuestos! 🏆" : "bloques expuestos"));
}

function pill(cls, num, lbl) {
  const el = document.createElement("div");
  el.className = `pill ${cls}`;
  el.innerHTML = `<span class="pill-num"></span><span class="pill-lbl"></span>`;
  el.querySelector(".pill-num").textContent = num;
  el.querySelector(".pill-lbl").textContent = lbl;
  return el;
}

/* ---------- Avances ---------- */

function sortedAvances() {
  return state.avances.slice().sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));
}

function buildAvances() {
  const ul = document.getElementById("avances-list");
  ul.innerHTML = "";
  const list = sortedAvances();

  if (list.length === 0) {
    const li = document.createElement("li");
    li.className = "av-empty";
    li.textContent = "Todavía no hay avances registrados. Agrega el primero arriba ☝️";
    ul.appendChild(li);
    return;
  }

  for (const a of list) {
    const li = document.createElement("li");
    li.className = "av-item";

    const date = document.createElement("span");
    date.className = "av-date";
    date.textContent = fmtShort(a.d);

    const text = document.createElement("span");
    text.className = "av-text";
    text.textContent = a.t;

    const del = document.createElement("button");
    del.className = "av-del";
    del.type = "button";
    del.textContent = "✕";
    del.title = "Borrar este avance";
    del.setAttribute("aria-label", "Borrar avance");
    del.addEventListener("click", () => {
      state.avances = state.avances.filter(x => x.id !== a.id);
      save();
      buildAvances();
      buildCalendar();
    });

    li.append(date, text, del);
    ul.appendChild(li);
  }
}

function addAvance() {
  const textEl = document.getElementById("av-text");
  const dateEl = document.getElementById("av-date");
  const t = textEl.value.trim();
  if (!t) { textEl.focus(); return; }

  state.avances.push({
    id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
    d: dateEl.value || todayStr(),
    t,
  });
  save();

  textEl.value = "";
  dateEl.value = todayStr();
  buildAvances();
  buildCalendar();
}

document.getElementById("av-add").addEventListener("click", addAvance);
document.getElementById("av-text").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addAvance();
});

/* ---------- Calendario ---------- */

// Desde el mes actual (si es antes de septiembre) hasta noviembre de 2026
function calendarMonths() {
  const now = new Date();
  const nowKey = now.getFullYear() * 12 + now.getMonth();
  const startKey = Math.min(nowKey, 2026 * 12 + 8);  // septiembre 2026
  const endKey = 2026 * 12 + 10;                     // noviembre 2026
  const out = [];
  for (let k = startKey; k <= endKey; k++) out.push([Math.floor(k / 12), k % 12]);
  return out;
}

function sessionFor(dateStr) {
  return SESSIONS.find(s => s.days.includes(dateStr)) || null;
}
function hasAvance(dateStr) {
  return state.avances.some(a => a.d === dateStr);
}

function buildCalendar() {
  const wrap = document.getElementById("months");
  wrap.innerHTML = "";
  const today = todayStr();

  for (const [year, month] of calendarMonths()) {
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

    const lead = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
    for (let i = 0; i < lead; i++) {
      const e = document.createElement("div");
      e.className = "day empty";
      grid.appendChild(e);
    }

    const total = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= total; d++) {
      grid.appendChild(buildDay(ymd(new Date(year, month, d)), d, today));
    }

    monthEl.appendChild(grid);
    wrap.appendChild(monthEl);
  }
}

function buildDay(dateStr, dayNum, today) {
  const session = sessionFor(dateStr);
  const el = document.createElement(session ? "button" : "div");
  el.className = "day";
  el.dataset.date = dateStr;

  const num = document.createElement("span");
  num.className = "dnum";
  num.textContent = dayNum;
  el.appendChild(num);

  if (session) {
    if (session.block > 0) {
      el.classList.add(`p-${session.who}`);
      const chip = document.createElement("span");
      chip.className = `chip chip-${session.who}`;
      chip.textContent = state.blocks[session.block] ? "✓" : "B" + session.block;
      el.appendChild(chip);
      if (state.blocks[session.block]) el.classList.add("block-done");
      el.title = `Bloque ${session.block} — expone ${PEOPLE[session.who].name}`;
    } else {
      el.classList.add("p-ppt");
      const chip = document.createElement("span");
      chip.className = "chip chip-ppt";
      chip.textContent = "PPT";
      el.appendChild(chip);
      el.title = "Fin de semana para avanzar el PPT";
    }
    el.addEventListener("click", () => {
      const target = session.block > 0
        ? document.getElementById("bloque-" + session.block)
        : document.getElementById("bloques");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if (session.block > 0) {
        target.classList.add("flash");
        setTimeout(() => target.classList.remove("flash"), 1200);
      }
    });
  }

  if (dateStr < today) el.classList.add("past");
  if (dateStr === today) el.classList.add("today");

  if (hasAvance(dateStr)) {
    const dot = document.createElement("span");
    dot.className = "av-dot";
    dot.textContent = "✅";
    el.appendChild(dot);
  }

  return el;
}

/* ---------- Bloques ---------- */

function buildBlocks() {
  const wrap = document.getElementById("blocks");
  wrap.innerHTML = "";

  for (const b of BLOCKS) {
    const who = PEOPLE[b.who];
    const card = document.createElement("article");
    card.className = `block-card c-${who.cls}` + (state.blocks[b.n] ? " is-done" : "");
    card.id = "bloque-" + b.n;
    card.innerHTML = `
      <div class="block-head">
        <div class="block-when">${b.when}</div>
        <h3 class="block-title">Bloque ${b.n}. ${b.title}</h3>
        <div class="block-meta">
          <span class="presenter pr-${who.cls}">🎤 ${who.name}</span>
          <label class="done-toggle">
            <input type="checkbox" ${state.blocks[b.n] ? "checked" : ""}>
            <span>Ya se expuso</span>
          </label>
        </div>
      </div>
      <details>
        <summary>Ver contenido</summary>
        <div class="block-detail">
          <p class="covers"><strong>Cubre:</strong> ${b.covers}</p>
          <div>
            <h4>Argumento central</h4>
            <p class="argumento">${b.argument}</p>
          </div>
          <div>
            <h4>Puntos obligatorios</h4>
            <ul>${b.points.map(p => `<li>${p}</li>`).join("")}</ul>
          </div>
          <div>
            <h4>3 preguntas que debe responder sin dudar</h4>
            <ul>${b.questions.map(q => `<li>${q}</li>`).join("")}</ul>
          </div>
        </div>
      </details>`;

    card.querySelector(".done-toggle input").addEventListener("change", (e) => {
      if (e.target.checked) state.blocks[b.n] = true;
      else delete state.blocks[b.n];
      save();
      card.classList.toggle("is-done", e.target.checked);
      buildHero();
      buildCalendar();
    });

    wrap.appendChild(card);
  }
}

/* ---------- Instalar como app ---------- */

const iosSheet = document.getElementById("ios-sheet");
const iosBackdrop = document.getElementById("ios-backdrop");
function closeIos() {
  iosSheet.classList.add("hidden");
  iosBackdrop.classList.add("hidden");
}
document.getElementById("btn-ios-help").addEventListener("click", () => {
  iosSheet.classList.remove("hidden");
  iosBackdrop.classList.remove("hidden");
});
document.getElementById("ios-close").addEventListener("click", closeIos);
iosBackdrop.addEventListener("click", closeIos);

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

/* ---------- Borrar todo ---------- */

document.getElementById("btn-reset").addEventListener("click", () => {
  if (confirm("¿Borrar los avances registrados y las marcas de los bloques en este dispositivo?")) {
    state = { avances: [], blocks: {} };
    save();
    renderAll();
  }
});

/* ---------- Service worker ---------- */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* sin SW, la app sigue */ });
  });
}

/* ---------- Arranque ---------- */

function renderAll() {
  buildHero();
  buildAvances();
  buildCalendar();
  buildBlocks();
}

document.getElementById("av-date").value = todayStr();
renderAll();

// Si la app queda abierta y cambia el día, refrescar
setInterval(() => {
  if (document.getElementById("hero-date").textContent !== fmtLong(todayStr())) renderAll();
}, 60000);
