// Sticker book: small rewards a child collects, drawn in the crayon style of the intro.
// Kept apart from the learning record (its own localStorage key) and never used to judge mastery.
// Rules (a parent decision, 2026-11-05): one sticker the first time a lesson's practice set is finished,
// one more if every answer was right, one a day for fixing a lesson's tricky questions, and stickers a
// grown-up gives for paper practice. No leaderboard, no comparing children, nothing for speed, no streaks.
import { crayon } from './intro.mjs';

export const STICKER_KEY = 'fern-maths.stickers.v1';
export const GOALS = Object.freeze([5, 10, 15, 20]);
export const KINDS = Object.freeze({
  set: { title: 'Finished a set', zh: '做完一组练习' },
  perfect: { title: 'Every answer right', zh: '一组全对' },
  fix: { title: 'Fixed the tricky ones', zh: '错题全改对' },
  paper: { title: 'Paper practice', zh: '纸上练习（家长发）' },
  parent: { title: 'From a grown-up', zh: '家长的鼓励' },
});
const CHILDREN = ['A', 'B'];
const empty = () => ({ version: 1, children: Object.fromEntries(CHILDREN.map(id => [id, { earned: [], goal: 10, redeemed: [] }])) });
export const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function loadStickers() {
  const out = empty();
  try {
    const s = JSON.parse(localStorage.getItem(STICKER_KEY) || 'null');
    if (!s || s.version !== 1) return out;
    for (const id of CHILDREN) {
      const c = s.children?.[id] || {};
      out.children[id].earned = (Array.isArray(c.earned) ? c.earned : []).filter(e => e && typeof e.key === 'string' && KINDS[e.kind])
        .map(e => ({ key: e.key, kind: e.kind, lessonId: typeof e.lessonId === 'string' ? e.lessonId : null, date: typeof e.date === 'string' ? e.date : '', note: typeof e.note === 'string' ? e.note.slice(0, 80) : '' }));
      out.children[id].goal = GOALS.includes(c.goal) ? c.goal : 10;
      out.children[id].redeemed = (Array.isArray(c.redeemed) ? c.redeemed : []).filter(r => r && typeof r.date === 'string').map(r => ({ date: r.date, count: Math.max(0, Number(r.count) || 0) }));
    }
  } catch { /* unreadable: start an empty book without touching the learning record */ }
  return out;
}
export function saveStickers(store) { try { localStorage.setItem(STICKER_KEY, JSON.stringify(store)); return true; } catch { return false; } }

// One sticker per key: asking twice for the same key gives nothing the second time.
export function award(store, childId, { key, kind, lessonId = null, note = '' }) {
  const c = store.children[childId];
  if (!c || !KINDS[kind] || typeof key !== 'string' || c.earned.some(e => e.key === key)) return null;
  const e = { key, kind, lessonId, date: localDay(), note };
  c.earned.push(e);
  return e;
}
// Stickers for a practice sheet that was just checked. answered: questions with an answer (blank ones do not count).
export function stickersForSheet(store, childId, { lessonId, kind, total, answered, correct }) {
  const got = [];
  if (kind === 'mistakes') { if (total && correct === total) got.push(award(store, childId, { key: `fix:${lessonId}:${localDay()}`, kind: 'fix', lessonId })); }
  else if (answered * 2 >= total) {
    got.push(award(store, childId, { key: `set:${lessonId}`, kind: 'set', lessonId }));
    if (correct === total) got.push(award(store, childId, { key: `perfect:${lessonId}`, kind: 'perfect', lessonId }));
  }
  return got.filter(Boolean);
}
// The current page of the book: stickers since the last treat, out of the goal.
export function summary(store, childId) {
  const c = store.children[childId], redeemedCount = c.redeemed.reduce((n, r) => n + r.count, 0), toward = Math.max(0, c.earned.length - redeemedCount);
  return { total: c.earned.length, goal: c.goal, toward: Math.min(toward, c.goal), ready: toward >= c.goal, redeemed: c.redeemed.length };
}
export function redeem(store, childId) {
  if (!summary(store, childId).ready) return false;
  store.children[childId].redeemed.push({ date: localDay(), count: store.children[childId].goal });
  return true;
}

// ---- the stickers themselves --------------------------------------------------------------
const PALETTE = [crayon.LEAF, crayon.SKY, crayon.CORAL, crayon.LEMON, crayon.MINT];
function motif(kind, c) {
  const { blob, star, rect, shape, INK, FERN, LEMON, CORAL, LEAF } = crayon;
  if (kind === 'perfect') return star(50, 52, 30, LEMON) + star(74, 28, 9, '#fff');
  if (kind === 'fix') return blob(50, 52, 22, 22, 0, LEMON, INK, 14) + [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const r = a * Math.PI / 180; return `<path d="M${50 + 30 * Math.cos(r)} ${52 + 30 * Math.sin(r)} L${50 + 40 * Math.cos(r)} ${52 + 40 * Math.sin(r)}" stroke="${CORAL}" stroke-width="4" stroke-linecap="round"/>`; }).join('');
  if (kind === 'paper') return `<g transform="rotate(-40 50 52)">${rect(38, 18, 24, 56, LEMON, INK)}${shape([[38, 74], [62, 74], [50, 90]], '#f1dcc0', INK)}${shape([[46, 84], [54, 84], [50, 90]], INK, INK)}${rect(38, 12, 24, 10, CORAL, INK)}</g>`;
  if (kind === 'parent') return [0, 72, 144, 216, 288].map(a => { const r = a * Math.PI / 180; return blob(50 + 20 * Math.cos(r), 50 + 20 * Math.sin(r), 13, 10, a, c, INK, 10); }).join('') + blob(50, 50, 11, 11, 0, LEMON, INK, 10);
  return `<path d="M50 88 C 50 70, 48 60, 50 40" stroke="${FERN}" stroke-width="5" stroke-linecap="round"/>` + blob(50, 42, 24, 30, 0, c === LEAF ? LEAF : c, INK, 18) + `<path d="M50 70 L50 30 M50 56 L38 46 M50 50 L62 40" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`;
}
// A round sticker with a paper edge. i changes the colour and the wobble so a page of stickers varies.
export function stickerArt(sticker, i = 0, size = 72) {
  crayon.setSeed(17 + i * 7);
  const c = PALETTE[i % PALETTE.length], title = KINDS[sticker.kind]?.title || 'Sticker';
  return `<svg viewBox="0 0 100 104" width="${size}" height="${size}" class="sticker-art kind-${sticker.kind}" role="img" aria-label="${title}" stroke-linecap="round" stroke-linejoin="round">
    ${crayon.blob(50, 52, 46, 46, i * 15, crayon.PAPER, crayon.INK, 22)}${crayon.blob(50, 52, 40, 40, i * 15 + 30, 'none', c, 22)}${motif(sticker.kind, c)}</svg>`;
}
