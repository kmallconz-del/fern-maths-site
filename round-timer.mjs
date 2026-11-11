// Gentle practice timing. Off by default; the parent turns it on per child in 家长中心.
// Each round of 5 questions has its own time (B 72 s and A 60 s per question). A round's clock starts
// when the child first works on one of its questions, and counts only while the page is open in front.
// At half time and at the end, Ferny pops up in a corner for a few seconds. Nothing is locked or marked
// wrong. Every finished set's time is kept for the parent, whether or not the timer is shown.
import { fernyArt } from './intro.mjs';

const SETTINGS_KEY = 'fern-maths.settings.v1', LOG_KEY = 'fern-maths.timing.v1';
export const PER_QUESTION = { A: 60, B: 72 };
const HALF = 'Halfway through the time for this round. You’re doing great!';
const END = 'Time’s up for this round. Finish this one, then take a little rest.';

export function loadSettings() {
  try { const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); return { timer: { A: s.timer?.A === true, B: s.timer?.B === true } }; }
  catch { return { timer: { A: false, B: false } }; }
}
export function saveSettings(s) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); return true; } catch { return false; } }
export function loadTimingLog() {
  try { const v = JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); return Array.isArray(v) ? v.filter(r => r && typeof r.seconds === 'number') : []; } catch { return []; }
}
function addTimingRecord(rec) { try { localStorage.setItem(LOG_KEY, JSON.stringify([...loadTimingLog().slice(-199), rec])); } catch {} }

let live = null; // the set being practised: { sheet, childId, enabled, rounds: [{ elapsed, total, half, end }], current, active }

export function attachTimer(sheet, childId, enabled) {
  if (!live || live.sheet !== sheet) live = { sheet, childId, enabled, rounds: [], current: -1, active: 0 };
  else live.enabled = enabled;
  paintBar();
}
// The child is working on question number `index` (from 0): its round becomes the running one.
export function touchQuestion(index) {
  if (!live || index < 0 || live.sheet.finished) return;
  const r = Math.floor(index / 5);
  if (!live.rounds[r]) { const q = Math.min(5, live.sheet.itemIds.length - r * 5); live.rounds[r] = { elapsed: 0, total: q * PER_QUESTION[live.childId], half: false, end: false }; }
  if (live.current !== r) { live.current = r; paintBar(); }
}
// Called when the set is finished: keep its time for the parent.
export function recordFinishedSet(sheet) {
  if (!live || live.sheet !== sheet || !live.active) return;
  addTimingRecord({ childId: live.childId, lessonId: sheet.lessonId, kind: sheet.kind || 'set', questions: sheet.itemIds.length, seconds: live.active, rounds: live.rounds.map(r => r?.elapsed || 0), timer: live.enabled, at: new Date().toISOString() });
}

function paintBar() {
  const el = document.querySelector('[data-round-timer]');
  if (!el) return;
  if (!live?.enabled || live.current < 0 || live.sheet.finished) { el.hidden = true; return; }
  const rd = live.rounds[live.current], left = Math.max(0, 1 - rd.elapsed / rd.total);
  el.hidden = false;
  el.querySelector('[data-round-label]').textContent = `Round ${live.current + 1}`;
  el.querySelector('[data-rt-fill]').style.width = `${Math.round(left * 1000) / 10}%`;
  el.classList.toggle('over', left === 0);
}

export function showFerny(message) {
  document.querySelector('.ferny-pop')?.remove();
  const pop = document.createElement('div');
  pop.className = 'ferny-pop'; pop.setAttribute('role', 'status');
  pop.innerHTML = `<p class="ferny-bubble">${message}</p>${fernyArt()}`;
  document.body.appendChild(pop);
  requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add('in')));
  setTimeout(() => { pop.classList.remove('in'); setTimeout(() => pop.remove(), 600); }, 5500);
}

setInterval(() => {
  if (!live || live.current < 0 || live.sheet.finished || document.visibilityState !== 'visible' || !document.querySelector('.practice-list [data-sheet-input]')) return;
  const rd = live.rounds[live.current];
  live.active++; rd.elapsed++;
  if (live.enabled) {
    if (!rd.half && rd.elapsed >= rd.total / 2) { rd.half = true; showFerny(HALF); }
    if (!rd.end && rd.elapsed >= rd.total) { rd.end = true; showFerny(END); }
  }
  paintBar();
}, 1000);
