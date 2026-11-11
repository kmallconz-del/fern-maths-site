// Fern Maths intro: a 30-second crayon-style title sequence shown over the app.
// Plain SVG with CSS animations (no video, no sound, works offline). Lines are drawn slightly wobbly
// by code, like crayon on paper, so it stays smooth on an iPad. showIntro() opens it; it closes with
// "Skip", "Let's begin", the Escape key, or by itself after the last scene.

// ---- crayon helpers: the same seed gives the same wobble every time --------------------------
let seed = 11;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const j = a => (rnd() - .5) * 2 * a;
const n = v => Math.round(v * 10) / 10;
const anim = (name, delay, dur = .6, extra = '') => `style="animation:${name} ${dur}s ${extra || 'ease'} ${delay}s both"`;

// A wobbly line drawn twice, like a crayon going over it again.
function line(x1, y1, x2, y2, c, w = 5, delay = null, dur = .6) {
  const pass = () => { const mx = (x1 + x2) / 2 + j(3), my = (y1 + y2) / 2 + j(3); return `M${n(x1 + j(1.5))} ${n(y1 + j(1.5))} Q${n(mx)} ${n(my)} ${n(x2 + j(1.5))} ${n(y2 + j(1.5))}`; };
  const draw = delay == null ? '' : `pathLength="1" class="fm-draw" ${anim('fm-draw', delay, dur)}`;
  return `<path d="${pass()}" stroke="${c}" stroke-width="${w}" ${draw}/><path d="${pass()}" stroke="${c}" stroke-width="${w * .5}" opacity=".6" ${draw}/>`;
}
// A wobbly closed shape through the given points, filled like crayon (solid plus a lighter scribble).
function shape(pts, fill, stroke = '#3a3326', w = 3.5) {
  const wob = () => 'M' + pts.map(([x, y]) => `${n(x + j(1.8))} ${n(y + j(1.8))}`).join(' L') + ' Z';
  return `<path d="${wob()}" fill="${fill}" stroke="none"/><path d="${wob()}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
}
const rect = (x, y, w, h, fill, stroke) => shape([[x, y], [x + w / 2, y], [x + w, y], [x + w, y + h / 2], [x + w, y + h], [x + w / 2, y + h], [x, y + h], [x, y + h / 2]], fill, stroke);
const blob = (cx, cy, rx, ry, rot, fill, stroke, k = 16) => { const a = rot * Math.PI / 180; return shape(Array.from({ length: k }, (_, i) => { const t = i / k * 2 * Math.PI, x = rx * Math.cos(t), y = ry * Math.sin(t); return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]; }), fill, stroke, 3); };
const text = (x, y, s, size, fill = '#3a3326', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${s}</text>`;
const pop = (inner, delay, dur = .55) => `<g class="fm-ib" ${anim('fm-pop', delay, dur, 'cubic-bezier(.3,1.6,.5,1)')}>${inner}</g>`;
const rise = (inner, delay, dur = .7) => `<g ${anim('fm-rise', delay, dur)}>${inner}</g>`;
const drop = (inner, delay, dur = .7) => `<g ${anim('fm-drop', delay, dur, 'cubic-bezier(.3,1.4,.5,1)')}>${inner}</g>`;
const scene = (inner, t0, t1) => `<g ${t1 ? anim('fm-scene', t0, t1 - t0, 'linear') : anim('fm-in', t0, .8)}>${inner}</g>`;

const INK = '#3a3326', FERN = '#2e8b57', LEAF = '#7cc47a', MINT = '#d8efd0', LEMON = '#f7d06b', CORAL = '#f09a86', SKY = '#9fc2ef', PAPER = '#fbf4e4';

function fern(x, y, s = 1, t0 = 0) {
  const stem = `M${x} ${y} C ${x} ${y - 120 * s}, ${x + 20 * s} ${y - 220 * s}, ${x + 80 * s} ${y - 290 * s} C ${x + 120 * s} ${y - 335 * s}, ${x + 150 * s} ${y - 330 * s}, ${x + 150 * s} ${y - 305 * s} C ${x + 150 * s} ${y - 280 * s}, ${x + 120 * s} ${y - 275 * s}, ${x + 112 * s} ${y - 292 * s}`;
  let out = `<path d="${stem}" fill="none" stroke="${FERN}" stroke-width="${9 * s}" stroke-linecap="round" pathLength="1" class="fm-draw" ${anim('fm-draw', t0 + .2, 1.6)}/>`;
  [[0, 50, 40, -30], [6, 95, 38, -25], [16, 140, 34, -20], [30, 182, 30, -15], [48, 220, 26, -10], [70, 255, 21, -5]].forEach(([dx, dy, r, k], i) => {
    const cx = x + dx * s, cy = y - dy * s, rr = r * s;
    out += pop(blob(cx - rr * .8, cy, rr, rr * .45, k + 180, LEAF, INK), t0 + .8 + i * .22) + pop(blob(cx + rr * .8, cy - 8 * s, rr, rr * .45, -k, LEAF, INK), t0 + .9 + i * .22);
  });
  return out;
}
const logo = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-6)">${rect(-44, -44, 88, 88, FERN, INK)}${text(0, 24, 'f', 66, '#fff', 'text-anchor="middle" font-family="Georgia,serif" font-weight="700"')}</g>`;
const star = (x, y, r, c) => shape(Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5 - Math.PI / 2, q = i % 2 ? r * .45 : r; return [x + q * Math.cos(a), y + q * Math.sin(a)]; }), c, INK, 2.5);

function frames() {
  seed = 11;
  // 1 · a fern unrolls, the name appears (0–6 s)
  const s1 = scene(fern(250, 500, 1.25, 0) + pop(logo(500, 250), 2.6) + rise(text(570, 272, 'Fern Maths', 78, INK, 'font-weight="700"'), 3.1)
    + pop(star(820, 150, 18, LEMON), 3.7) + pop(star(870, 210, 11, CORAL), 3.95) + pop(star(560, 360, 12, SKY), 4.2), 0, 6.2);
  // 2 · little steps: a dot hops along a number line (6–11.8 s)
  let nl = line(170, 400, 830, 400, INK, 5, 6.6, .8);
  for (let i = 0; i <= 5; i++) nl += pop(line(200 + i * 120, 388, 200 + i * 120, 412, INK, 4) + text(200 + i * 120, 452, i, 34, INK, 'text-anchor="middle" font-weight="700"'), 6.9 + i * .1);
  for (let i = 0; i < 5; i++) nl += `<path d="M${200 + i * 120} 392 Q ${260 + i * 120} ${300 + j(6)} ${320 + i * 120} 392" fill="none" stroke="${CORAL}" stroke-width="5" stroke-linecap="round" pathLength="1" class="fm-draw" ${anim('fm-draw', 7.75 + i * .7, .5)}/>`;
  nl += `<g ${anim('fm-hop', 7.6, 3.5, 'linear')}>${blob(200, 372, 18, 18, 0, CORAL, INK)}${blob(194, 366, 4, 4, 0, '#fff', 'none')}</g>`;
  const s2 = scene(rise(text(500, 170, 'Little steps, big ideas.', 56, INK, 'text-anchor="middle" font-weight="700"'), 6.3) + nl, 6, 11.8);
  // 3 · look closely: blocks drop in; a strip is cut into quarters and shaded (11.8–17 s)
  let blocks = drop(rect(120, 230, 120, 120, LEAF, INK) + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => line(120 + i * 12, 234, 120 + i * 12, 346, '#5aa65a', 1.5)).join(''), 12.2);
  [0, 1].forEach(i => { blocks += drop(rect(260 + i * 24, 230, 16, 120, FERN, INK), 12.6 + i * .2); });
  [0, 1, 2].forEach(i => { blocks += drop(rect(320 + i * 22, 330, 16, 16, LEMON, INK), 13 + i * .18); });
  blocks += rise(text(250, 420, '100 + 20 + 3 = 123', 34, INK, 'text-anchor="middle" font-weight="700"'), 13.9);
  let fr = `<g ${anim('fm-rise', 12.4, .6)}>${rect(540, 260, 340, 80, '#fffdf6', INK)}</g>`;
  [1, 2, 3].forEach(i => { fr += line(540 + i * 85, 262, 540 + i * 85, 338, INK, 4, 13 + i * .15, .4); });
  [0, 1, 2].forEach(i => { fr += pop(rect(546 + i * 85, 266, 74, 68, LEMON, 'none'), 13.6 + i * .4); });
  fr += rise(text(710, 420, '3 of 4 parts = 3/4', 34, INK, 'text-anchor="middle" font-weight="700"'), 14.9);
  const s3 = scene(rise(text(500, 140, 'Look closely.', 60, INK, 'text-anchor="middle" font-weight="700"'), 12.1) + blocks + fr, 11.8, 17);
  // 4 · watch it move: a fold, a clock, cubes stacking (17–22.4 s)
  const half = [[220, 240], [170, 270], [140, 330], [170, 390], [220, 420]];
  let fold = shape(half.map(([x, y]) => [440 - x, y]), MINT, INK) + blob(265, 330, 12, 12, 0, 'none', '#c2533a')
    + `<g class="fm-ib" style="transform-origin:right center;animation:fm-flip 1.3s ease-in-out 17.9s both">${shape(half, LEAF, INK)}${blob(175, 330, 12, 12, 0, CORAL, INK)}</g>`
    + `<path d="M220 220 L220 440" stroke="#c2533a" stroke-width="5" stroke-dasharray="14 10"/>`;
  let clock = blob(500, 330, 90, 90, 0, '#fffdf6', INK, 22);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; clock += line(500 + 72 * Math.sin(a), 330 - 72 * Math.cos(a), 500 + 82 * Math.sin(a), 330 - 82 * Math.cos(a), INK, 3); }
  clock += `<g style="transform-box:view-box;transform-origin:500px 330px;animation:fm-spin 3s ease-in-out 17.9s both">${line(500, 330, 500, 262, FERN, 7)}</g><g style="transform-box:view-box;transform-origin:500px 330px;animation:fm-spin12 3s ease-in-out 17.9s both">${line(500, 330, 545, 330, INK, 9)}</g>${blob(500, 330, 7, 7, 0, INK, INK)}`;
  const cube = (x, y) => shape([[x, y], [x + 30, y - 16], [x + 60, y], [x + 30, y + 16]], '#d9eed0', INK, 2.5) + shape([[x, y], [x + 30, y + 16], [x + 30, y + 50], [x, y + 34]], LEAF, INK, 2.5) + shape([[x + 30, y + 16], [x + 60, y], [x + 60, y + 34], [x + 30, y + 50]], '#5aa65a', INK, 2.5);
  let cubes = '';
  [0, 1, 2].forEach(k => { cubes += drop(cube(740, 390 - k * 34) + cube(800, 390 - k * 34), 18.4 + k * .6); });
  const s4 = scene(rise(text(500, 140, 'Watch it move.', 60, INK, 'text-anchor="middle" font-weight="700"'), 17.2) + fold + clock + cubes, 17, 22.4);
  // 5 · practise, then check: twenty circles fill in, then a big tick (22.4–26.6 s)
  let dots = '';
  for (let i = 0; i < 20; i++) { const x = 230 + (i % 10) * 60, y = 270 + Math.floor(i / 10) * 70; dots += pop(blob(x, y, 22, 22, 0, '#fffdf6', INK), 22.7 + i * .03) + pop(blob(x, y, 16, 16, 0, LEAF, 'none'), 23.3 + i * .1, .35); }
  const tick = `<path d="M720 470 L770 520 L880 390" fill="none" stroke="${FERN}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" pathLength="1" class="fm-draw" ${anim('fm-draw', 25.5, .6)}/>`;
  const s5 = scene(rise(text(500, 160, 'Practise, then check.', 60, INK, 'text-anchor="middle" font-weight="700"'), 22.6) + dots + rise(text(400, 500, '20 / 20', 52, FERN, 'text-anchor="middle" font-weight="700"'), 25.3) + tick, 22.4, 26.6);
  // 6 · the name again, and an invitation (26.6 s →)
  const s6 = scene(fern(180, 520, .95, 26.6) + pop(logo(440, 250, 1.1), 27) + rise(text(520, 276, 'Fern Maths', 84, INK, 'font-weight="700"'), 27.4)
    + rise(text(524, 340, 'Little steps, big ideas.', 40, INK), 27.9) + pop(star(860, 420, 22, LEMON), 28.3) + pop(star(330, 140, 14, CORAL), 28.5) + pop(star(900, 160, 12, SKY), 28.7), 26.6);
  return s1 + s2 + s3 + s4 + s5 + s6;
}

export function introSvg() {
  return `<svg viewBox="0 0 1000 600" class="fm-intro-art" aria-hidden="true" font-family='"Chalkboard SE", "Comic Sans MS", "Marker Felt", cursive' stroke-linecap="round" fill="none">
    <defs><filter id="fm-grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="5"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.09"/></feComponentTransfer></filter></defs>
    <rect width="1000" height="600" fill="${PAPER}"/><rect width="1000" height="600" filter="url(#fm-grain)"/>${frames()}</svg>`;
}

const LENGTH = 30; // seconds until "Let's begin" has appeared
let open = null;
export function showIntro({ onClose } = {}) {
  if (open) return;
  const box = document.createElement('div');
  box.className = 'fm-intro'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Fern Maths: little steps, big ideas');
  box.innerHTML = `<div class="fm-intro-stage">${introSvg()}<div class="fm-intro-go" ${anim('fm-rise', 29, .6)}><button class="primary" data-intro-close>Let’s begin</button></div></div><button class="secondary fm-intro-skip" data-intro-close>Skip ›</button>`;
  const prev = document.activeElement;
  const close = () => {
    if (!open) return; open = null; clearTimeout(timer); removeEventListener('keydown', onKey);
    box.classList.add('fm-closing'); setTimeout(() => box.remove(), 350);
    prev?.focus?.(); onClose?.();
  };
  const onKey = e => { if (e.key === 'Escape') close(); };
  box.querySelectorAll('[data-intro-close]').forEach(b => b.onclick = close);
  addEventListener('keydown', onKey);
  const timer = setTimeout(close, (LENGTH + 15) * 1000); // nobody pressed anything: close by itself
  document.body.appendChild(box); open = box;
  box.querySelector('.fm-intro-skip').focus();
  return close;
}
export const introOpen = () => !!open;

// Ferny, the little fern sprout who pops up with practice reminders (same crayon style as the intro).
export function fernyArt() {
  seed = 5;
  const eye = (x, y, r = 10) => blob(x, y, r, r * 1.1, 0, '#fff', INK) + blob(x + 2, y + 2, r * .55, r * .6, 0, INK, INK) + blob(x + 4, y - 1, r * .2, r * .2, 0, '#fff', '#fff', 8);
  const cheek = (x, y) => blob(x, y, 9, 6, 0, '#f4a6a0', 'none');
  const x = 100, y = 130;
  return `<svg viewBox="0 0 200 230" class="ferny-art" aria-hidden="true" fill="none" stroke-linecap="round">
    <path d="M${x} ${y + 90} C ${x} ${y + 40}, ${x - 6} ${y + 10}, ${x} ${y - 20}" stroke="${FERN}" stroke-width="10"/>
    ${blob(x - 34, y + 50, 30, 13, -25, LEAF, INK)}${blob(x + 34, y + 40, 30, 13, 25, LEAF, INK)}${blob(x, y - 50, 58, 52, 0, LEAF, INK, 20)}
    <path d="M${x + 26} ${y - 92} C ${x + 70} ${y - 110}, ${x + 80} ${y - 60}, ${x + 50} ${y - 56} C ${x + 30} ${y - 54}, ${x + 30} ${y - 78}, ${x + 46} ${y - 78}" stroke="${FERN}" stroke-width="8"/>
    ${eye(x - 20, y - 56)}${eye(x + 18, y - 56)}${cheek(x - 34, y - 34)}${cheek(x + 32, y - 34)}
    <path d="M${x - 12} ${y - 30} Q ${x} ${y - 20} ${x + 12} ${y - 30}" stroke="${INK}" stroke-width="3.5"/></svg>`;
}

// The crayon helpers, for other small drawings in the same style (the sticker book).
export const crayon = { shape, rect, blob, star, text, setSeed: s => { seed = s; }, INK, FERN, LEAF, MINT, LEMON, CORAL, SKY, PAPER };
