// A small toolkit for "Watch it move" step animations. A scene is a list of SVG shapes, each with a
// timeline written in steps: when it appears (at), when it goes (out), where it moves (move), how it
// turns (rot), when it is highlighted (hl). The child presses one button to play the next part; the
// picture glides through its steps. Plain SVG redrawn by JavaScript, so Chrome on iPad and Mac draw it the same.
//
// scene({ title, intro, explain, explain_zh, w, h, items, steps: [{ say, btn, ms }] }) → a motion
// steps[0] is the starting picture; steps[i].btn is the button that leads to step i.
// solid: { draw(k, view) → SVG, view: { rx, ry } } adds a 3D picture under the items that the child can
// turn by dragging (or with the arrow keys); the view never changes what step the animation is on.
// solid.recentre: each step glides the picture back to its first angle (for lessons whose steps move the
// camera themselves, such as front / top / side views), unless the child is turning it at that moment.

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const r1 = v => Math.round(v * 10) / 10;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Respect a device's "reduce motion" setting.
export function motionTime(ms) {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : ms;
}
export function animate(from, to, ms, frame) {
  const t0 = performance.now(), dur = motionTime(ms);
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    frame(Object.fromEntries(Object.keys(to).map(key => [key, from[key] + (to[key] - from[key]) * e])));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---- shapes -------------------------------------------------------------------------------
export const R = (x, y, w, h, cls, o = {}) => ({ tag: 'rect', a: { x, y, width: w, height: h, rx: o.rx, class: cls }, ...o });
export const C = (cx, cy, r, cls, o = {}) => ({ tag: 'circle', a: { cx, cy, r, class: cls }, ...o });
export const L = (x1, y1, x2, y2, cls, o = {}) => ({ tag: 'line', a: { x1, y1, x2, y2, class: cls }, ...o });
export const P = (d, cls, o = {}) => ({ tag: 'path', a: { d, class: cls }, ...o });
export const T = (x, y, text, cls = 'mv-num', o = {}) => ({ tag: 'text', a: { x, y, class: cls }, text, ...o });
export const G = (kids, o = {}) => ({ tag: 'g', kids: kids.flat(Infinity), ...o });
export const RAW = (svg, o = {}) => ({ tag: 'raw', svg, ...o }); // ready-made SVG markup (e.g. a 3D view)

// ---- timeline -----------------------------------------------------------------------------
const fadeIn = (k, at) => (at ? clamp(k - at + 1) : 1);
const fadeOut = (k, out) => (out != null ? 1 - clamp(k - out + 1) : 1);
// keys: [{ at, v: [..] }] reached one after another; each glides during the step before it.
function along(k, keys, start) {
  let v = start;
  for (const kf of keys) { const t = clamp(k - kf.at + 1); v = v.map((x, i) => x + (kf.v[i] - x) * t); }
  return v;
}
function draw(it, k) {
  const op = fadeIn(k, it.at) * fadeOut(k, it.out);
  if (op <= 0.001) return '';
  let tr = '';
  if (it.move || it.from) {
    const [dx, dy] = along(k, (it.move || []).map(m => ({ at: m.at, v: [m.dx ?? 0, m.dy ?? 0] })), it.from || [0, 0]);
    if (dx || dy) tr += `translate(${r1(dx)} ${r1(dy)}) `;
  }
  if (it.rot) {
    const [deg] = along(k, it.rot.keys.map(m => ({ at: m.at, v: [m.deg] })), [it.rot.from || 0]);
    if (deg) tr += `rotate(${r1(deg)} ${it.rot.cx} ${it.rot.cy}) `;
  }
  if (it.scale) {
    const [sx, sy] = along(k, it.scale.keys.map(m => ({ at: m.at, v: [m.sx ?? 1, m.sy ?? 1] })), it.scale.from || [1, 1]);
    if (sx !== 1 || sy !== 1) tr += `translate(${it.scale.cx} ${it.scale.cy}) scale(${Math.abs(sx) < .02 ? .02 * Math.sign(sx || 1) : r1(sx * 100) / 100} ${Math.abs(sy) < .02 ? .02 * Math.sign(sy || 1) : r1(sy * 100) / 100}) translate(${-it.scale.cx} ${-it.scale.cy}) `;
  }
  const lit = it.hl != null && k >= it.hl - .5 && (it.hlOut == null || k < it.hlOut - .5);
  let inner;
  if (it.tag === 'g') inner = it.kids.map(c => draw(c, k)).join('');
  else if (it.tag === 'raw') inner = it.svg;
  else {
    const attrs = Object.entries(it.a).filter(([, v]) => v != null).map(([n, v]) => `${n}="${typeof v === 'number' ? r1(v) : esc(v)}"`).join(' ');
    inner = it.tag === 'text' ? `<text ${attrs}>${esc(it.text)}</text>` : `<${it.tag} ${attrs}/>`;
  }
  if (op >= .999 && !tr && !lit) return inner;
  return `<g${op < .999 ? ` opacity="${r1(op * 100) / 100}"` : ''}${tr ? ` transform="${tr.trim()}"` : ''}${lit ? ' class="mv-hl"' : ''}>${inner}</g>`;
}
export const render = (items, k) => items.map(it => draw(it, k)).join('');

// ---- the player ---------------------------------------------------------------------------
export function scene(spec) {
  const { w = 300, h = 200, steps, ms = 900 } = spec;
  const items = spec.items.flat(Infinity), solid = spec.solid || null;
  const TILT = [-88, -4]; // from almost straight above to almost level; never from underneath
  return {
    title: spec.title, intro: spec.intro, explain: spec.explain, explain_zh: spec.explain_zh, steps, spec,
    frame: (k, view) => (solid ? solid.draw(k, view || solid.view) : '') + render(items, k), // for checks
    html() {
      return `<p class="mv-part" data-mv-part hidden></p><svg viewBox="0 0 ${w} ${h}" class="mv-svg mv-scene${solid ? ' mv-drag' : ''}" ${solid ? 'role="img" aria-label="A 3D picture. Drag it, or use the arrow keys, to turn it." tabindex="0" data-mv-drag' : 'aria-hidden="true"'} data-mv-scene></svg>
        <p class="mv-count" data-mv-count aria-live="polite"></p>
        <div class="mv-controls"><button class="primary" data-mv-go></button><button class="secondary" data-mv-pause hidden>Pause</button><button class="secondary" data-mv-back>◀ Back a step</button><button class="secondary" data-mv-reset>Start again</button>${solid ? '<button class="secondary" data-mv-turnback>↺ Turn it back</button>' : ''}</div>`;
    },
    // One tap plays a whole part (See it → Why it works → Try another → Remember): the steps follow each
    // other, each one's words staying for a moment, and the picture stops at the end of the part so the
    // parent can talk. Pause stops after the current step; Back a step goes back one step without moving.
    mount(root, done) {
      const svg = root.querySelector('[data-mv-scene]'), say = root.querySelector('[data-mv-count]'), go = root.querySelector('[data-mv-go]'),
        pause = root.querySelector('[data-mv-pause]'), back = root.querySelector('[data-mv-back]'), last = steps.length - 1, hold = spec.hold ?? 1400;
      let k = 0, busy = false, seen = false, playing = false, wantPause = false, shown = 0, touched = false;
      const view = solid ? { ...solid.view } : null;
      const paint = v => { shown = v; svg.innerHTML = (solid ? solid.draw(v, view) : '') + render(items, v); };
      const partEl = root.querySelector('[data-mv-part]'), parts = [...new Set(steps.map(st => st.part).filter(Boolean))];
      const endOfPart = i => i >= last || steps[i + 1].part !== steps[i].part;
      const label = () => {
        if (partEl && steps[k].part) { partEl.hidden = false; partEl.innerHTML = parts.map(pt => `<span class="${pt === steps[k].part ? 'on' : ''}">${pt}</span>`).join(''); }
        say.textContent = steps[k].say;
        go.textContent = playing ? 'Playing…' : k >= last ? 'All done ✓' : k === 0 ? '▶ Play' : endOfPart(k) ? (steps[k + 1].btn || 'Next part') : 'Continue ▶';
        go.disabled = playing || k >= last;
        if (pause) { pause.hidden = !playing; pause.textContent = wantPause ? 'Pausing…' : 'Pause'; pause.disabled = wantPause; }
        if (back) back.disabled = busy || k === 0;
      };
      const stepOnce = then => {
        const from = k;
        const dur = steps[from + 1].ms || ms;
        touched = false;
        const home = solid && solid.recentre ? solid.view : null, v0 = home ? { rx: view.rx, ry: home.ry + ((((view.ry - home.ry) % 360) + 540) % 360) - 180 } : null;
        animate({ k: from }, { k: from + 1 }, dur, s => { if (v0 && !touched) { const t = clamp(s.k - from); view.rx = v0.rx + (home.rx - v0.rx) * t; view.ry = v0.ry + (home.ry - v0.ry) * t; } paint(s.k); });
        setTimeout(() => { k = from + 1; paint(k); label(); if (k === last && !seen) { seen = true; done(); } then(); }, motionTime(dur) + 40);
      };
      const stop = () => { busy = false; playing = false; wantPause = false; label(); };
      const play = () => {
        if (busy || k >= last) return;
        busy = true; playing = true; wantPause = false; label();
        const loop = () => stepOnce(() => { if (k >= last || endOfPart(k) || wantPause) stop(); else setTimeout(loop, motionTime(hold)); });
        loop();
      };
      go.onclick = play;
      if (pause) pause.onclick = () => { if (playing) { wantPause = true; label(); } };
      if (back) back.onclick = () => { if (busy || k === 0) return; k--; paint(k); label(); };
      root.querySelector('[data-mv-reset]').onclick = () => { if (busy) return; k = 0; paint(0); label(); };
      if (solid) { // turn the picture: it follows the finger, and stays where it is left
        let drag = null;
        const turn = (ry, rx) => { view.ry = ry; view.rx = clamp(rx, TILT[0], TILT[1]); paint(shown); };
        svg.addEventListener('pointerdown', e => { touched = true; drag = { x: e.clientX, y: e.clientY, rx: view.rx, ry: view.ry }; svg.classList.add('turning'); try { svg.setPointerCapture(e.pointerId); } catch { /* older browsers */ } e.preventDefault(); });
        svg.addEventListener('pointermove', e => { if (drag) turn(drag.ry + (e.clientX - drag.x) * .6, drag.rx - (e.clientY - drag.y) * .45); });
        const drop = () => { drag = null; svg.classList.remove('turning'); };
        svg.addEventListener('pointerup', drop); svg.addEventListener('pointercancel', drop);
        svg.addEventListener('keydown', e => { const d = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, 8], ArrowDown: [0, -8] }[e.key]; if (d) { e.preventDefault(); touched = true; turn(view.ry + d[0], view.rx + d[1]); } });
        root.querySelector('[data-mv-turnback]').onclick = () => turn(solid.view.ry, solid.view.rx);
      }
      paint(0); label();
    },
  };
}

// ---- building blocks ----------------------------------------------------------------------
// Number line from min to max. Returns its shapes and X(value) → x position.
export function numberLine(min, max, { x0 = 20, x1 = 280, y = 130, every = 1, label = every, fmt = v => String(v), at, cls = 'mv-num' } = {}) {
  const X = v => x0 + (v - min) / (max - min) * (x1 - x0), items = [L(x0 - 6, y, x1 + 6, y, 'mv-axis')];
  for (let v = min; v <= max + 1e-9; v += every) {
    const major = Math.abs(((v - min) / label) - Math.round((v - min) / label)) < 1e-6;
    items.push(L(X(v), y - (major ? 7 : 4), X(v), y + (major ? 7 : 4), 'mv-tickl'));
    if (major) items.push(T(X(v), y + 24, fmt(Math.round(v * 1000) / 1000), cls));
  }
  return { items: [G(items, { at })], X };
}
// A jump arc from a to b above (or below) the line, with its label.
export function jump(X, y, a, b, { at, out, label, below = false, cls = 'mv-arc' } = {}) {
  const x1 = X(a), x2 = X(b), hgt = Math.min(46, Math.max(16, Math.abs(x2 - x1) * .55)), s = below ? 1 : -1, mid = (x1 + x2) / 2;
  return G([P(`M${r1(x1)} ${y} Q${r1(mid)} ${r1(y + s * hgt * 2)} ${r1(x2)} ${y}`, cls), P(`M${r1(x2)} ${y} l${b > a ? -7 : 7} ${s * 7}`, cls), label ? T(mid, y + s * (hgt + 8) + (below ? 10 : 0), label, 'mv-jl') : []], { at, out });
}
// A marker that sits at value v0 and glides to each later value at its step.
export const hopper = (X, y, v0, stops, cls = 'mv-dot', o = {}) => C(X(v0), y - 9, 8, cls, { move: stops.map(([at, v]) => ({ at, dx: X(v) - X(v0) })), ...o });

// Base-ten blocks: hundreds (40 × 40), tens (4 × 40 rods), ones (4 × 4).
export const hundred = (x, y, o = {}) => G([R(x, y, 40, 40, 'mv-b100'), ...[1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap(i => [L(x + i * 4, y, x + i * 4, y + 40, 'mv-bline'), L(x, y + i * 4, x + 40, y + i * 4, 'mv-bline')])], o);
export const ten = (x, y, o = {}) => G([R(x, y, 5, 40, 'mv-b10'), ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => L(x, y + i * 4, x + 5, y + i * 4, 'mv-bline'))], o);
export const one = (x, y, o = {}) => R(x, y, 5, 5, 'mv-b1', o);

// Counters in rows: n circles, cols per row.
export function counters(n, cols, x, y, { gap = 16, r = 6, cls = 'mv-c1', at, o } = {}) {
  return Array.from({ length: n }, (_, i) => C(x + (i % cols) * gap, y + Math.floor(i / cols) * gap, r, cls, { at, ...(o ? o(i) : {}) }));
}
// A strip cut into equal parts; shade: list of [partIndex, class, step].
export function strip(x, y, w, h, parts, { at, shade = [], cls = 'mv-empty', splitAt } = {}) {
  const pw = w / parts, items = [R(x, y, w, h, cls)];
  for (const [i, c, s, out] of shade) items.push(R(x + i * pw, y, pw, h, c, { at: s, out }));
  for (let i = 1; i < parts; i++) items.push(L(x + i * pw, y, x + i * pw, y + h, 'mv-cut', { at: splitAt }));
  items.push(R(x, y, w, h, 'mv-frame'));
  return G(items, { at });
}
// Clock face with numbers 1–12; hands are separate items using rot.
export function clockFace(cx, cy, r) {
  const items = [C(cx, cy, r, 'mv-face')];
  for (let m = 0; m < 60; m++) {
    const a = m * 6 * Math.PI / 180, big = m % 5 === 0, r0 = big ? r - 9 : r - 5;
    items.push(L(cx + r0 * Math.sin(a), cy - r0 * Math.cos(a), cx + (r - 2) * Math.sin(a), cy - (r - 2) * Math.cos(a), big ? 'mv-tickl' : 'mv-tickm'));
    if (big) items.push(T(cx + (r - 20) * Math.sin(a), cy - (r - 20) * Math.cos(a) + 5, String(m / 5 || 12), 'mv-num'));
  }
  return items;
}
export const hand = (cx, cy, len, cls, from, keys) => G([L(cx, cy, cx, cy - len, cls)], { rot: { cx, cy, from, keys } });
// Square grid lines.
export function gridLines(x, y, cols, rows, size, cls = 'mv-grid') {
  const out = [];
  for (let i = 0; i <= cols; i++) out.push(L(x + i * size, y, x + i * size, y + rows * size, cls));
  for (let j = 0; j <= rows; j++) out.push(L(x, y + j * size, x + cols * size, y + j * size, cls));
  return out;
}
// Column working: digits laid out in place-value columns. cols: number of columns, right-aligned.
export function colX(x, cols, cw) { return c => x + (cols - 1 - c) * cw + cw / 2; } // c = 0 is the ones column
// A filled slice of a circle from angle a0 to a1 (degrees clockwise from 12 o'clock).
export function sector(cx, cy, r, a0, a1, cls, o = {}) {
  const pt = a => [cx + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
  const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
  return P(`M${cx} ${cy} L${r1(x0)} ${r1(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${r1(x1)} ${r1(y1)} Z`, cls, o);
}
// Regular polygon points.
export const polygon = (cx, cy, r, n, rot = 0) => Array.from({ length: n }, (_, i) => { const a = (rot + i * 360 / n) * Math.PI / 180; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; });
export const pathOf = pts => 'M' + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L') + ' Z';

// A longer lesson made of parts that follow one another (see it → write it → try another → remember).
// Each part is a scene spec, or a finished scene. Its pictures appear when the part starts and fade when
// the next part begins; its first step's button (btn) leads into it.
function shift(it, o, end) {
  const c = { ...it };
  c.at = (it.at || 0) + o; if (o === 0 && !it.at) delete c.at;
  c.out = it.out != null ? it.out + o : end;
  if (it.hl != null) c.hl = it.hl + o;
  if (it.hlOut != null) c.hlOut = it.hlOut + o;
  if (it.move) c.move = it.move.map(m => ({ ...m, at: m.at + o }));
  if (it.rot) c.rot = { ...it.rot, keys: it.rot.keys.map(k => ({ ...k, at: k.at + o })) };
  if (it.scale) c.scale = { ...it.scale, keys: it.scale.keys.map(k => ({ ...k, at: k.at + o })) };
  if (it.kids) { c.kids = it.kids.map(k => shiftInner(k, o)); }
  return c;
}
function shiftInner(it, o) { // inside a group: same shift, no forced ending (the group ends them)
  const c = { ...it };
  if (it.at) c.at = it.at + o; if (it.out != null) c.out = it.out + o;
  if (it.hl != null) c.hl = it.hl + o; if (it.hlOut != null) c.hlOut = it.hlOut + o;
  if (it.move) c.move = it.move.map(m => ({ ...m, at: m.at + o }));
  if (it.rot) c.rot = { ...it.rot, keys: it.rot.keys.map(k => ({ ...k, at: k.at + o })) };
  if (it.scale) c.scale = { ...it.scale, keys: it.scale.keys.map(k => ({ ...k, at: k.at + o })) };
  if (it.kids) c.kids = it.kids.map(k => shiftInner(k, o));
  return c;
}
export function sequence({ title, intro, explain, explain_zh, w = 300, h = 210, ms = 900, parts }) {
  const specs = parts.map(p => p.spec || p), items = [], steps = [];
  let o = 0;
  specs.forEach((sp, n) => {
    const len = sp.steps.length, end = n < specs.length - 1 ? o + len : null;
    for (const it of sp.items.flat(Infinity)) items.push(shift(it, o, end));
    sp.steps.forEach((st, i) => steps.push(i === 0 && n > 0 ? { ...st, btn: st.btn || sp.btn || 'Next part', part: sp.part } : { ...st, part: sp.part }));
    o += len;
  });
  return scene({ title, intro, explain, explain_zh, w, h, ms, items, steps });
}
