// Weekly homework and the weekend test.
// A grown-up sets a week of lessons for a child (the site suggests them; the grown-up can change them).
// Homework for a lesson is the lesson itself: look at the pictures, then finish its practice set.
// From Saturday (or earlier, if the grown-up opens it) there is one test made from that week's lessons:
// questions the child has not met where possible, a mix of easy and harder ones, the same share per lesson.
// The test is marked only at the end, like a practice set, and wrong answers join "Try again".
//
// Kept apart from the learning record (its own key), like the sticker book: the answers themselves are
// ordinary attempts in the learning record; this file only remembers which lessons and questions a week has.
// Dates are local calendar days written 'YYYY-MM-DD'; a week runs Monday to Sunday and is named by its Monday.

export const WEEKLY_KEY = 'fern-maths.weekly.v1';
export const CHILDREN = ['A', 'B'];
export const PER_WEEK = Object.freeze([2, 3, 4, 5]);          // lessons a week the grown-up can ask for
export const TEST_SIZES = Object.freeze([10, 15, 20, 30]);
export const DEFAULTS = Object.freeze({ A: { perWeek: 4, testSize: 20 }, B: { perWeek: 3, testSize: 15 } });
export const DONE_ANSWERS = 10;      // this many answers to a lesson's questions in the week = homework done
export const WEAK_SHARE = 0.6;       // below this share right in the test, the lesson is suggested again
export const MAX_LESSONS = 8;
const KEEP_WEEKS = 30;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

// ---- dates ---------------------------------------------------------------------------------------
const parse = d => { const [y, m, n] = d.split('-').map(Number); return new Date(Date.UTC(y, m - 1, n)); };
const format = t => t.toISOString().slice(0, 10);
export const addDays = (d, n) => format(new Date(parse(d).getTime() + n * 86400000));
export const weekday = d => (parse(d).getUTCDay() + 6) % 7;            // Monday 0 … Sunday 6
export const weekStart = d => addDays(d, -weekday(d));
export const weekDays = id => Array.from({ length: 7 }, (_, i) => addDays(id, i));
// The week a new assignment is for: this week from Monday to Friday, next week at the weekend.
export const planningWeek = today => (weekday(today) >= 5 ? addDays(weekStart(today), 7) : weekStart(today));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function weekLabel(id) { // "16–22 Nov" or "30 Nov – 6 Dec"
  const a = parse(id), b = parse(addDays(id, 6));
  return a.getUTCMonth() === b.getUTCMonth() ? `${a.getUTCDate()}–${b.getUTCDate()} ${MONTHS[b.getUTCMonth()]}` : `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()]} – ${b.getUTCDate()} ${MONTHS[b.getUTCMonth()]}`;
}
export const DAY_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_ZH = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// ---- storage -------------------------------------------------------------------------------------
export const emptyStore = () => ({ version: 1, children: Object.fromEntries(CHILDREN.map(id => [id, { ...DEFAULTS[id], weeks: [] }])) });
const cleanTest = t => {
  if (!t || !Array.isArray(t.itemIds) || !t.itemIds.length || t.itemIds.length > 40 || new Set(t.itemIds).size !== t.itemIds.length || !t.itemIds.every(x => typeof x === 'string')) return null;
  const out = { itemIds: [...t.itemIds], drafts: {}, submitted: {}, finished: t.finished === true };
  for (const id of t.itemIds) {
    if (typeof t.drafts?.[id] === 'string' && t.drafts[id].length <= 160) out.drafts[id] = t.drafts[id];
    if (typeof t.submitted?.[id] === 'string') out.submitted[id] = t.submitted[id];
  }
  if (DAY.test(t.finishedOn || '')) out.finishedOn = t.finishedOn;
  if (t.started === true) out.started = true;
  return out;
};
const cleanWeek = w => {
  if (!w || !DAY.test(w.id || '') || weekday(w.id) !== 0 || !Array.isArray(w.lessonIds)) return null;
  const lessonIds = [...new Set(w.lessonIds.filter(x => typeof x === 'string'))].slice(0, MAX_LESSONS);
  if (!lessonIds.length) return null;
  return { id: w.id, lessonIds, assignedOn: DAY.test(w.assignedOn || '') ? w.assignedOn : w.id, openEarly: w.openEarly === true, test: cleanTest(w.test) };
};
export function sanitize(raw) {
  const store = emptyStore();
  if (!raw || raw.version !== 1) return store;
  for (const id of CHILDREN) {
    const c = raw.children?.[id];
    if (!c) continue;
    if (PER_WEEK.includes(c.perWeek)) store.children[id].perWeek = c.perWeek;
    if (TEST_SIZES.includes(c.testSize)) store.children[id].testSize = c.testSize;
    const seen = new Set();
    store.children[id].weeks = (Array.isArray(c.weeks) ? c.weeks : []).map(cleanWeek).filter(w => w && !seen.has(w.id) && seen.add(w.id)).sort((a, b) => a.id.localeCompare(b.id)).slice(-KEEP_WEEKS);
  }
  return store;
}
export function loadWeekly(storage = globalThis.localStorage) { try { return sanitize(JSON.parse(storage.getItem(WEEKLY_KEY) || 'null')); } catch { return emptyStore(); } }
export function saveWeekly(store, storage = globalThis.localStorage) { try { storage.setItem(WEEKLY_KEY, JSON.stringify(store)); return true; } catch { return false; } }

// ---- weeks ---------------------------------------------------------------------------------------
export const weekOf = (store, childId, id) => store.children[childId].weeks.find(w => w.id === id) || null;
// The week the child sees: the current week if it has homework, otherwise the newest earlier week whose
// test is not finished yet (so a test missed at the weekend is still there on Monday), otherwise nothing.
export function activeWeek(store, childId, today) {
  const now = weekStart(today), weeks = store.children[childId].weeks, current = weeks.find(w => w.id === now);
  if (current) return current;
  return [...weeks].reverse().find(w => w.id < now && !w.test?.finished && w.id >= addDays(now, -14)) || null;
}
export function setWeek(store, childId, { id, lessonIds, assignedOn }) {
  const c = store.children[childId], old = c.weeks.find(w => w.id === id);
  if (old?.test?.started) return false; // the paper is already in use: its lessons stay
  const week = cleanWeek({ id, lessonIds, assignedOn, openEarly: old?.openEarly });
  if (!week) return false;
  c.weeks = [...c.weeks.filter(w => w.id !== id), week].sort((a, b) => a.id.localeCompare(b.id)).slice(-KEEP_WEEKS);
  return true;
}
export function removeWeek(store, childId, id) {
  const c = store.children[childId], old = c.weeks.find(w => w.id === id);
  if (!old || old.test?.started) return false;
  c.weeks = c.weeks.filter(w => w.id !== id);
  return true;
}
// The test opens on the Saturday of its week and stays open afterwards; a grown-up can open it sooner.
export const testOpen = (week, today) => !!week && (week.openEarly || today >= addDays(week.id, 5));

// ---- suggesting a week ------------------------------------------------------------------------------
// path: the child's lessons in course order [{ lessonId, practised }]; retry: lessons to do again first
// (last week's weak ones). Returns up to `count` lesson ids.
export function suggestLessons({ path = [], count = 3, retry = [], skip = [] }) {
  const out = [], no = new Set(skip);
  for (const id of retry) if (!no.has(id) && !out.includes(id) && path.some(p => p.lessonId === id) && out.length < count) out.push(id);
  for (const p of path) { if (out.length >= count) break; if (!p.practised && !no.has(p.lessonId) && !out.includes(p.lessonId)) out.push(p.lessonId); }
  return out;
}
// A day for each lesson, spread over the school days that are left (Monday–Friday; a week set at the
// weekend for itself puts everything on Saturday). Returns [{ lessonId, day }] with day 0 = Monday.
export function schedule(lessonIds, { weekId, assignedOn } = {}) {
  const from = weekId && assignedOn && assignedOn > weekId ? (assignedOn > addDays(weekId, 6) ? 5 : weekday(assignedOn)) : 0;
  const days = []; for (let d = from; d <= 4; d++) days.push(d);
  if (!days.length) days.push(5);
  const n = lessonIds.length, len = days.length;
  const slot = i => (n > len ? Math.floor(i * len / n) : n === 2 ? (i ? Math.floor(len / 2) : 0) : Math.round(i * (len - 1) / Math.max(1, n - 1))); // 2 → Mon, Wed; 3 → Mon, Wed, Fri
  return lessonIds.map((lessonId, i) => ({ lessonId, day: days[slot(i)] }));
}

// ---- the test paper ------------------------------------------------------------------------------
// lessons: [{ id, items: [{ id, stage, depth }] }] in homework order; seen: Map/obj itemId → times the child
// has met the question (attempts and practice sets). Each lesson gets the same share of `size` (earlier
// lessons take the remainder). Within a lesson: questions not met before first, then the least met; and a
// mix of depths where the lesson has them (about 2 plain : 2 another angle : 1 challenge), easy to hard.
export function buildTest({ lessons, seen = {}, size = 20 }) {
  const met = id => (seen instanceof Map ? seen.get(id) : seen[id]) || 0;
  const usable = lessons.map(l => ({ id: l.id, pool: l.items.filter(i => i.stage === 'practice') })).filter(l => l.pool.length);
  if (!usable.length) return [];
  const total = Math.min(size, usable.reduce((n, l) => n + l.pool.length, 0));
  const quota = usable.map((l, k) => Math.floor(total / usable.length) + (k < total % usable.length ? 1 : 0));
  // a lesson with a small bank gives its spare places to the others
  let spare = 0; quota.forEach((q, k) => { if (q > usable[k].pool.length) { spare += q - usable[k].pool.length; quota[k] = usable[k].pool.length; } });
  for (let k = 0; spare > 0 && k < usable.length * 40; k++) { const j = k % usable.length; if (quota[j] < usable[j].pool.length) { quota[j]++; spare--; } }
  const out = [];
  usable.forEach((l, k) => {
    const rank = l.pool.map((item, position) => ({ item, position })).sort((a, b) => met(a.item.id) - met(b.item.id) || a.position - b.position);
    const want = quota[k], depth = r => r.item.depth || 1, fresh = rank.filter(r => !met(r.item.id));
    const share = [Math.ceil(want * 0.4), Math.round(want * 0.4), 0]; share[2] = Math.max(0, want - share[0] - share[1]);
    const picked = [];
    // New questions matter more than the mix: take each depth's share from the new ones, top up with other
    // new ones (easier first), and only then repeat the questions met least often.
    [1, 2, 3].forEach((d, n) => picked.push(...fresh.filter(r => depth(r) === d).slice(0, share[n])));
    for (const r of [...fresh].sort((a, b) => depth(a) - depth(b) || a.position - b.position)) { if (picked.length >= want) break; if (!picked.includes(r)) picked.push(r); }
    for (const r of rank) { if (picked.length >= want) break; if (!picked.includes(r)) picked.push(r); }
    picked.sort((a, b) => (a.item.depth || 1) - (b.item.depth || 1) || a.position - b.position);
    out.push(...picked.slice(0, want).map(r => r.item.id));
  });
  return out;
}
// Marks per lesson. lessonOf(itemId) → lesson id; right(itemId) → true when the test answer was correct.
export function scoreTest(test, lessonOf, right) {
  const by = new Map(); let correct = 0;
  for (const id of test.itemIds) {
    const l = lessonOf(id), row = by.get(l) || { lessonId: l, total: 0, correct: 0 };
    row.total++; if (right(id)) { row.correct++; correct++; }
    by.set(l, row);
  }
  const lessons = [...by.values()].map(r => ({ ...r, weak: r.correct / r.total < WEAK_SHARE }));
  return { total: test.itemIds.length, correct, lessons, weak: lessons.filter(r => r.weak).map(r => r.lessonId) };
}
