/* ================================================================
   Tarjetas de estudio — repaso activo + espaciado (Leitner)
   Cajas: 0 nueva · 1→+1d · 2→+3d · 3→+7d · 4→+14d
   Dominada = caja 3 o más. Fallar regresa la tarjeta a la caja 1.
   ================================================================ */

"use strict";

const DECKS = CARDS_DATA.decks;
const CARDS = CARDS_DATA.cards;
const BOX_DAYS = [0, 1, 3, 7, 14];
const SESSION_SIZE = 12;
const MAX_NEW_PER_DAY = 12;   // ritmo sostenible: en ~3 semanas se ven las 219 y quedan 7+ de consolidación

/* ---------- Fechas ---------- */
function ymd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayStr() { return ymd(new Date()); }
function addDays(s, n) {
  const [y, m, d] = s.split("-").map(Number);
  return ymd(new Date(y, m - 1, d + n));
}

function newAllowedToday() {
  const t = todayStr();
  const used = (state.intro && state.intro.d === t) ? state.intro.n : 0;
  return Math.max(0, MAX_NEW_PER_DAY - used);
}
function countNewIntro() {
  const t = todayStr();
  if (!state.intro || state.intro.d !== t) state.intro = { d: t, n: 0 };
  state.intro.n++;
}
function touchStreak() {
  const t = todayStr();
  if (state.streak && state.streak.last === t) return;
  const yesterday = addDays(t, -1);
  const n = (state.streak && state.streak.last === yesterday) ? state.streak.n + 1 : 1;
  state.streak = { last: t, n };
}

/* ---------- Estado ---------- */
const STORE_KEY = "tesis-cards-g7-v1";
let state = { p: {}, filter: "all", intro: null, streak: null };   // p: { cardId: { b: caja, due: fecha } }
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) state = Object.assign(state, JSON.parse(raw));
} catch (e) { /* la app funciona igual sin guardado */ }
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* sin persistencia */ }
}

/* ---------- Consultas ---------- */
function cardState(c) { return state.p[c.id] || null; }
function isDominada(c) { const s = cardState(c); return !!s && s.b >= 3; }
function isNew(c) { return !cardState(c); }
function isDue(c) { const s = cardState(c); return !!s && s.due <= todayStr(); }

function filteredCards() {
  if (state.filter === "all") return CARDS;
  if (state.filter === "crit") return CARDS.filter(c => c.crit);
  return CARDS.filter(c => c.deck === state.filter);
}

function buildQueue() {
  const pool = filteredCards();
  // repasos vencidos: los más antiguos primero, mezclando mazos dentro del mismo día
  const due = pool.filter(isDue)
    .map(c => ({ c, k: cardState(c).due + Math.random() }))
    .sort((a, b) => a.k < b.k ? -1 : 1)
    .map(x => x.c);
  const news = pool.filter(isNew);
  const orderedNews = news.filter(c => c.crit).concat(news.filter(c => !c.crit));
  const allowedNews = orderedNews.slice(0, newAllowedToday());
  return due.concat(allowedNews).slice(0, SESSION_SIZE);
}

/* ---------- Cabecera de progreso ---------- */
const LEVEL_INFO = {
  basico:     { label: "Básico",     cls: "lv-basico" },
  intermedio: { label: "Intermedio", cls: "lv-intermedio" },
  dificil:    { label: "Difícil",    cls: "lv-dificil" },
  extremo:    { label: "Extremo",    cls: "lv-extremo" },
};

function refreshTop() {
  const pool = filteredCards();
  const dom = pool.filter(isDominada).length;
  document.getElementById("sp-dom").textContent = dom;
  document.getElementById("sp-total").textContent = `/ ${pool.length} dominadas`;
  document.getElementById("sp-fill").style.width = pool.length ? (100 * dom / pool.length) + "%" : "0%";

  const due = pool.filter(isDue).length;
  const news = Math.min(pool.filter(isNew).length, newAllowedToday());
  const parts = [];
  if (due) parts.push(`${due} por repasar`);
  if (news) parts.push(`${news} nuevas`);
  let msg = parts.length ? "Para hoy: " + parts.join(" · ") : "🏆 Listo por hoy. Mañana hay más.";
  if (state.streak && state.streak.n >= 2 && state.streak.last === todayStr()) {
    msg += ` · 🔥 ${state.streak.n} días seguidos`;
  }
  document.getElementById("sp-today").textContent = msg;

  const n = buildQueue().length;
  const btn = document.getElementById("btn-study");
  btn.textContent = n ? `▶ Repasar (${n})` : "▶ Repasar";
  btn.disabled = n === 0;
}

/* ---------- Chips de mazos ---------- */
function buildChips() {
  const wrap = document.getElementById("chips");
  wrap.innerHTML = "";
  const defs = [{ id: "all", icon: "🃏", name: "Todas" }, { id: "crit", icon: "🔴", name: "Críticas" }].concat(DECKS);
  for (const d of defs) {
    const pool = d.id === "all" ? CARDS : d.id === "crit" ? CARDS.filter(c => c.crit) : CARDS.filter(c => c.deck === d.id);
    const dom = pool.filter(isDominada).length;
    const btn = document.createElement("button");
    btn.className = "chip-f" + (state.filter === d.id ? " active" : "");
    btn.innerHTML = `<span></span><small></small>`;
    btn.querySelector("span").textContent = `${d.icon} ${d.name}`;
    btn.querySelector("small").textContent = `${dom}/${pool.length}`;
    btn.addEventListener("click", () => {
      state.filter = d.id;
      save();
      buildChips();
      refreshTop();
    });
    wrap.appendChild(btn);
  }
}

/* ---------- Sesión de estudio ---------- */
let queue = [], idx = 0, okCount = 0, failCount = 0;
const requeued = new Set();

const overlay = document.getElementById("study-overlay");
const scAnswer = document.getElementById("sc-answer");
const gradeRow = document.getElementById("grade-row");
const revealBtn = document.getElementById("btn-reveal");

function startSession() {
  queue = buildQueue();
  if (!queue.length) return;
  idx = 0; okCount = 0; failCount = 0; requeued.clear();
  document.getElementById("study-done").classList.add("hidden");
  document.getElementById("study-card").classList.remove("hidden");
  document.querySelector(".study-actions").classList.remove("hidden");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  showCard();
}

function deckOf(c) { return DECKS.find(d => d.id === c.deck); }

function showCard() {
  const c = queue[idx];
  const left = queue.length - idx;
  document.getElementById("st-count").textContent = left === 1 ? "última" : `${left} por ver`;
  document.getElementById("st-bar-fill").style.width = (100 * idx / queue.length) + "%";

  const meta = document.getElementById("sc-meta");
  meta.innerHTML = "";
  const d = deckOf(c);
  const tag = document.createElement("span");
  tag.className = "sc-deck";
  tag.textContent = `${d.icon} ${d.name}`;
  meta.appendChild(tag);
  const lv = LEVEL_INFO[c.level];
  const pill = document.createElement("span");
  pill.className = `sc-level ${lv.cls}`;
  pill.textContent = lv.label;
  meta.appendChild(pill);
  if (c.crit) {
    const cr = document.createElement("span");
    cr.className = "sc-crit";
    cr.textContent = "🔴 crítica";
    meta.appendChild(cr);
  }

  document.getElementById("sc-question").textContent = c.q;

  scAnswer.innerHTML = "";
  // primero lo esencial (contra eso te autocalificas), después la respuesta completa
  if (c.idea) {
    const box = document.createElement("div");
    box.className = "sc-idea";
    const t = document.createElement("strong");
    t.textContent = "💡 Lo esencial: ";
    box.appendChild(t);
    box.appendChild(document.createTextNode(c.idea));
    scAnswer.appendChild(box);
    const lbl = document.createElement("p");
    lbl.className = "sc-full-label";
    lbl.textContent = "Respuesta completa (para decir en voz alta):";
    scAnswer.appendChild(lbl);
  }
  for (const para of c.a.split("\n\n")) {
    const p = document.createElement("p");
    p.textContent = para;
    scAnswer.appendChild(p);
  }
  scAnswer.classList.add("hidden");
  gradeRow.classList.add("hidden");
  revealBtn.classList.remove("hidden");
  document.getElementById("study-card").scrollTop = 0;
}

revealBtn.addEventListener("click", () => {
  scAnswer.classList.remove("hidden");
  revealBtn.classList.add("hidden");
  gradeRow.classList.remove("hidden");
});

function grade(ok) {
  const c = queue[idx];
  const today = todayStr();
  const s = cardState(c);
  if (!s) countNewIntro();            // primera vez que se estudia esta tarjeta
  touchStreak();
  if (ok) {
    const b = Math.min((s ? s.b : 0) + 1, 4);
    state.p[c.id] = { b, due: addDays(today, BOX_DAYS[b]) };
    okCount++;
  } else {
    // lapso suave: baja dos cajas en vez de volver a cero (una dominada olvidada no borra todo el avance)
    state.p[c.id] = { b: Math.max(1, (s ? s.b : 1) - 2), due: today };
    failCount++;
    if (!requeued.has(c.id)) {        // las falladas vuelven al final de la sesión, una vez
      requeued.add(c.id);
      queue.push(c);
    }
  }
  save();
  idx++;
  if (idx < queue.length) showCard();
  else endSession();
}
document.getElementById("btn-ok").addEventListener("click", () => grade(true));
document.getElementById("btn-fail").addEventListener("click", () => grade(false));

function endSession() {
  document.getElementById("study-card").classList.add("hidden");
  document.querySelector(".study-actions").classList.add("hidden");
  const done = document.getElementById("study-done");
  done.classList.remove("hidden");
  const dom = CARDS.filter(isDominada).length;
  document.getElementById("sd-summary").textContent =
    `${okCount} bien · ${failCount} por reforzar — Llevan ${dom} de ${CARDS.length} dominadas.`;
  refreshTop(); buildChips(); refreshBrowse();
}

function closeSession() {
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
  refreshTop(); buildChips(); refreshBrowse();
}
document.getElementById("st-close").addEventListener("click", closeSession);
document.getElementById("btn-exit").addEventListener("click", closeSession);
document.getElementById("btn-again").addEventListener("click", startSession);
document.getElementById("btn-study").addEventListener("click", startSession);

/* ---------- Explorar todas ---------- */
function stateDotCls(c) {
  if (isDominada(c)) return "st-dom";
  if (isNew(c)) return "st-new";
  return "st-learn";
}

function buildBrowse() {
  const wrap = document.getElementById("browse");
  wrap.innerHTML = "";
  for (const d of DECKS) {
    const det = document.createElement("details");
    det.className = "browse-deck";
    det.dataset.deck = d.id;
    const sum = document.createElement("summary");
    sum.innerHTML = `<span></span><small></small>`;
    sum.querySelector("span").textContent = `${d.icon} ${d.name}`;
    det.appendChild(sum);
    // el contenido se arma recién cuando se abre el mazo (219 tarjetas pesan en celulares modestos)
    det.addEventListener("toggle", () => {
      if (det.open && !det.dataset.filled) {
        det.dataset.filled = "1";
        det.appendChild(buildBrowseList(d.id));
      }
    });
    wrap.appendChild(det);
  }
  refreshBrowse();
}

function buildBrowseList(deckId) {
  const list = document.createElement("div");
  list.className = "browse-list";
  for (const c of CARDS.filter(x => x.deck === deckId)) {
    const item = document.createElement("details");
    item.className = "browse-card";
    item.dataset.card = c.id;
    const s = document.createElement("summary");
    const dot = document.createElement("i");
    dot.className = `st-dot ${stateDotCls(c)}`;
    s.appendChild(dot);
    s.appendChild(document.createTextNode((c.crit ? "🔴 " : "") + c.q));
    item.appendChild(s);
    const body = document.createElement("div");
    body.className = "browse-answer";
    if (c.idea) {
      const box = document.createElement("div");
      box.className = "sc-idea";
      const t = document.createElement("strong");
      t.textContent = "💡 ";
      box.appendChild(t);
      box.appendChild(document.createTextNode(c.idea));
      body.appendChild(box);
    }
    for (const para of c.a.split("\n\n")) {
      const p = document.createElement("p");
      p.textContent = para;
      body.appendChild(p);
    }
    item.appendChild(body);
    list.appendChild(item);
  }
  return list;
}

function refreshBrowse() {
  document.querySelectorAll(".browse-deck").forEach(det => {
    const pool = CARDS.filter(c => c.deck === det.dataset.deck);
    det.querySelector("summary small").textContent = `${pool.filter(isDominada).length}/${pool.length}`;
  });
  document.querySelectorAll(".browse-card").forEach(el => {
    const c = CARDS.find(x => x.id === el.dataset.card);
    if (c) el.querySelector(".st-dot").className = `st-dot ${stateDotCls(c)}`;
  });
}

/* ---------- Reset ---------- */
document.getElementById("btn-reset-cards").addEventListener("click", () => {
  if (confirm("¿Reiniciar tu progreso de tarjetas en este dispositivo? Los avances del plan no se tocan.")) {
    state.p = {};
    state.intro = null;
    state.streak = null;
    save();
    refreshTop(); buildChips(); refreshBrowse();
  }
});

/* ---------- Arranque ---------- */
document.getElementById("cierre-text").textContent = CARDS_DATA.tips.cierre;
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
buildChips();
refreshTop();
buildBrowse();
