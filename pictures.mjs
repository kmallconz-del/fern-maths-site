// Crayon pictures for practice questions that have no diagram of their own.
// Drawn in the browser from the question's own words (the numbers in the prompt), so the question bank
// and the item-version ledger are untouched. A picture only shows the situation – it never shows the answer.
// Rules are keyed by the question's skill name (the same skill draws the same way in every lesson).
// pictureFor(item) returns an SVG string, or '' when there is nothing useful to draw.
import { crayon } from './intro.mjs';
const { shape, rect, blob, star, text, setSeed, INK, FERN, LEAF, MINT, LEMON, CORAL, SKY, PAPER } = crayon;

const W = 640, H = 220;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const mid = 'text-anchor="middle"';
const FONT = 'font-family="Chalkboard SE,Comic Sans MS,Marker Felt,sans-serif" font-weight="700"';
const svg = (inner, alt, h = H) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" role="img" ${FONT}><title>${esc(alt)}</title>${inner}</svg>`;
const tag = (x, y, s, fill = LEMON, size = 26) => { s = String(s); const w = s.length * size * .58 + 26; return rect(x - w / 2, y - size, w, size * 1.5, fill, INK) + text(x, y + size * .15, esc(s), size, INK, mid); };
const card = (x, y, w, h, s, fill = PAPER, size = 40, color = INK) => rect(x, y, w, h, fill, INK) + text(x + w / 2, y + h / 2 + size * .35, esc(s), size, String(s).includes('?') ? FERN : color, mid);
const q = (x, y, size = 54) => text(x, y, '?', size, FERN, mid);
const line = (x1, y1, x2, y2, c = INK, w = 4, extra = '') => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none" ${extra}/>`;
const dash = (x1, y1, x2, y2, c = INK, w = 3) => line(x1, y1, x2, y2, c, w, 'stroke-dasharray="9 8"');
const arrow = (x1, y1, x2, y2, c = CORAL, w = 6) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 16; return line(x1, y1, x2, y2, c, w) + shape([[x2, y2], [x2 - h * Math.cos(a - .5), y2 - h * Math.sin(a - .5)], [x2 - h * Math.cos(a + .5), y2 - h * Math.sin(a + .5)]], c, c, 2); };
const arc = (a, b, y, label = '', c = CORAL, lift = 70, up = true) => { const k = up ? -1 : 1; return `<path d="M${a} ${y} Q ${(a + b) / 2} ${y + k * lift} ${b} ${y}" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="10 9" stroke-linecap="round"/>` + (label ? text((a + b) / 2, y + k * lift * .55 + (up ? -6 : 18), esc(label), 22, c, mid) : ''); };
// "2,375" is one number (Year 4 writes thousands with a comma); a list is written "3, 7, 11" with spaces.
const nums = p => (p.replace(/(\d),(\d{3})\b/g, '$1$2').match(/\d+/g) || []).map(Number);
const dnums = p => (p.replace(/(\d),(\d{3})\b/g, '$1$2').match(/\d+(?:\.\d+)?/g) || []).map(Number);
const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const SIDES = { triangle: 3, square: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8, nonagon: 9, decagon: 10 };
const PAL = [LEMON, SKY, MINT, CORAL];
const note = (s, y = 212) => text(W / 2, y, esc(s), 20, FERN, mid);

// ---- little drawings -----------------------------------------------------------------------------
const sheep = (x, y, s = 1) => blob(x, y, 30 * s, 20 * s, 0, '#fff', INK) + blob(x + 28 * s, y - 2 * s, 11 * s, 10 * s, 0, INK, INK) + rect(x - 16 * s, y + 14 * s, 5 * s, 14 * s, INK, INK) + rect(x + 10 * s, y + 14 * s, 5 * s, 14 * s, INK, INK);
const leaf = (x, y, s = 1, rot = 25, c = LEAF) => blob(x, y, 15 * s, 7 * s, rot, c, INK);
const apple = (x, y, s = 1) => blob(x, y, 14 * s, 13 * s, 0, CORAL, INK) + line(x, y - 12 * s, x + 3 * s, y - 21 * s, '#7a4b2a', 3) + blob(x + 9 * s, y - 19 * s, 7 * s, 3.5 * s, -30, LEAF, INK);
const book = (x, y, s = 1) => rect(x - 16 * s, y - 11 * s, 32 * s, 22 * s, SKY, INK) + line(x - 7 * s, y - 11 * s, x - 7 * s, y + 11 * s, INK, 2);
const starIc = (x, y, s = 1) => star(x, y, 13 * s, LEMON);
const dot = (x, y, s = 1) => blob(x, y, 8 * s, 8 * s, 0, SKY, INK);
const pen = (x, y, s = 1) => rect(x - 3 * s, y - 16 * s, 6 * s, 30 * s, LEMON, INK) + shape([[x - 3 * s, y + 14 * s], [x, y + 22 * s], [x + 3 * s, y + 14 * s]], INK, INK, 1);
const person = (x, y, s = 1) => blob(x, y - 12 * s, 7 * s, 7 * s, 0, LEMON, INK) + blob(x, y + 6 * s, 9 * s, 11 * s, 0, SKY, INK);
const ICONS = [['sheep', sheep], ['lamb', sheep], ['apple', apple], ['book', book], ['sticker', starIc], ['point', starIc], ['score', starIc], ['leaf', leaf], ['leaves', leaf], ['pen', pen], ['children', person], ['people', person], ['passenger', person], ['friend', person], ['button', dot], ['screw', dot], ['marble', dot], ['bead', dot], ['shell', dot]];
const iconFor = p => { const w = p.toLowerCase(); for (const [k, f] of ICONS) if (w.includes(k)) return f; return dot; };
const heap = (x, y, icon, s = 1) => icon(x - 20 * s, y + 10 * s, s) + icon(x + 22 * s, y + 12 * s, s) + icon(x, y - 14 * s, s);
const bus = (x, y, s = 1) => rect(x - 70 * s, y - 32 * s, 140 * s, 58 * s, LEMON, INK) + [0, 1, 2, 3].map(i => rect(x - 60 * s + i * 32 * s, y - 22 * s, 22 * s, 20 * s, SKY, INK)).join('') + blob(x - 40 * s, y + 28 * s, 11 * s, 11 * s, 0, INK, INK) + blob(x + 40 * s, y + 28 * s, 11 * s, 11 * s, 0, INK, INK);

// A click counter showing a number, with a button labelled by the step (+1, −50 …).
function counter(n, step, presses = 1, extra = '') {
  const ds = String(n).split(''), w = ds.length * 78 + 40, x0 = 60;
  let out = rect(x0, 70, w, 120, SKY, INK) + rect(x0 + w / 2 - 34, 40, 68, 36, CORAL, INK) + text(x0 + w / 2, 66, esc(step), 22, INK, mid);
  ds.forEach((d, i) => { out += card(x0 + 20 + i * 78, 90, 64, 80, d, PAPER, 46); });
  const ax = x0 + w + 20, back = /^[−-]/.test(step);
  out += back ? arrow(ax + 70, 130, ax, 130) : arrow(ax, 130, ax + 70, 130);
  out += text(ax + 35, 108, presses > 1 ? `${esc(step)} × ${presses}` : esc(step), presses > 1 ? 20 : 24, CORAL, mid) + card(ax + 90, 70, 110, 120, '?', PAPER, 56);
  if (extra) out += text(ax + 145, 215, esc(extra), 20, FERN, mid);
  return svg(out, `A counter showing ${n}; each press changes it by ${step}`);
}
// Number cards joined by labelled arrows: 346 → +10 → ?
function hop(left, ops, right = '?') {
  const cw = 120, gap = 90, total = cw * 2 + ops.length * gap, x0 = (W - total) / 2;
  let out = card(x0, 60, cw, 100, left, PAPER, 42), x = x0 + cw;
  ops.forEach(op => { out += arrow(x + 8, 110, x + gap - 8, 110) + text(x + gap / 2, 90, esc(op), 26, CORAL, mid); x += gap; });
  out += card(x, 60, cw, 100, right, PAPER, 42);
  return svg(out, `${left}, then ${ops.join(', then ')}, gives ${right}`);
}
function placeBlocks(h, t, o, extra = '') {
  let out = '';
  for (let i = 0; i < h; i++) { const x = 40 + (i % 5) * 56, y = 40 + Math.floor(i / 5) * 56; out += rect(x, y, 48, 48, LEAF, INK) + [1, 2, 3].map(k => line(x + k * 12, y + 2, x + k * 12, y + 46, '#5aa65a', 1.5) + line(x + 2, y + k * 12, x + 46, y + k * 12, '#5aa65a', 1.5)).join(''); }
  for (let i = 0; i < t; i++) out += rect(340 + (i % 10) * 18, 40 + Math.floor(i / 10) * 56, 12, 48, FERN, INK);
  if (!t) out += dash(340, 88, 410, 88, '#b9b3a3', 3);
  for (let i = 0; i < o; i++) out += rect(530 + (i % 5) * 20, 44 + Math.floor(i / 5) * 20, 14, 14, LEMON, INK);
  out += text(40, 170, `${h} hundreds`, 24, INK) + text(340, 170, `${t} tens`, 24, INK) + text(530, 170, `${o} ones`, 24, INK);
  return svg(out + (extra ? note(extra) : ''), `${h} hundreds blocks, ${t} tens rods and ${o} ones${extra ? '; ' + extra : ''}`);
}
const digitCards = ds => svg(ds.map((d, i) => card(80 + i * 120, 50, 90, 120, d, PAL[i % 3], 60)).join('') + arrow(460, 110, 520, 110, INK, 4) + ['', '', ''].map((_, i) => rect(530 + i * 34, 70, 28, 80, 'none', INK)).join(''), `Digit cards ${ds.join(', ')} and three empty places`);
const riddleBoxes = () => svg(['H', 'T', 'O'].map((l, i) => text(200 + i * 110, 60, l, 30, FERN, mid) + card(160 + i * 110, 80, 80, 90, '?', PAPER, 44)).join(''), 'Three empty places: hundreds, tens, ones');
function compareDigits(d, a, b) {
  const num = (x0, n) => String(n).split('').map((c, i) => text(x0 + i * 52, 140, c, 64, c === String(d) ? CORAL : INK, mid)).join('') + (String(n).includes(String(d)) ? blob(x0 + String(n).indexOf(String(d)) * 52, 118, 32, 40, 0, 'none', CORAL) : '');
  return svg(num(120, a) + text(320, 130, 'or', 28, FERN, mid) + num(420, b), `The ${d} in ${a} and the ${d} in ${b}`);
}
// Two numbers under H T O headings; the hundreds column is ringed.
function htoPair(a, b) {
  let out = ['H', 'T', 'O'].map((l, i) => text(240 + i * 80, 50, l, 26, FERN, mid)).join('');
  [a, b].forEach((n, r) => { String(n).padStart(3, ' ').split('').forEach((c, i) => { out += text(240 + i * 80, 115 + r * 70, c, 48, INK, mid); }); });
  out += rect(205, 70, 70, 130, 'none', CORAL) + text(120, 115, 'first', 24, CORAL, mid) + arrow(150, 108, 195, 108, CORAL, 4);
  return svg(out, `${a} and ${b} written in hundreds, tens and ones columns`);
}
// A row of plain cards (no arrows).
const cards = (vals, h = 90) => svg(vals.map((v, i) => { const n = vals.length, cw = Math.min(140, (W - 60) / n - 16), x = (W - n * (cw + 16)) / 2 + i * (cw + 16); return card(x, 65, cw, h, v, PAL[i % 4], String(v).length > 3 ? 32 : 42); }).join(''), `Cards: ${vals.join(', ')}`);
// Groups of things with number tags, joined by plus signs.
function groupsAdd(values, icon, sign = '+') {
  const n = values.length, cell = (W - 80) / n;
  let out = blob(W / 2, 195, W / 2 - 20, 30, 0, MINT, 'none');
  values.forEach((v, i) => { const x = 40 + cell * (i + .5), s = Math.max(.7, 1.2 - .15 * n); out += heap(x, 120, icon, s) + tag(x, 55, v, i ? CORAL : LEMON); if (i) out += text(40 + cell * i, 135, sign, 50, CORAL, mid); });
  return svg(out + q(W - 25, 135), `Groups of ${values.join(' and ')} to put together`);
}
// Bar model: a whole on top, parts underneath; '?' marks the unknown.
function barModel(whole, parts, unit = '') {
  const known = parts.filter(p => typeof p === 'number'), total = typeof whole === 'number' ? whole : known.reduce((a, b) => a + b, 0) * (parts.length / Math.max(1, known.length));
  const rest = typeof whole === 'number' ? Math.max(whole - known.reduce((a, b) => a + b, 0), total * .2) : total / parts.length;
  const widths = parts.map(p => Math.max(70, 500 * (typeof p === 'number' ? p : rest) / total)), sum = widths.reduce((a, b) => a + b, 0), k = 500 / sum;
  const lab = v => typeof v === 'number' ? (unit === '$' ? `$${v}` : `${v}${unit}`) : v;
  let out = rect(70, 40, 500, 56, typeof whole === 'number' ? SKY : PAPER, INK) + text(320, 80, lab(whole), 32, typeof whole === 'number' ? INK : FERN, mid), x = 70;
  parts.forEach((p, i) => { const w = widths[i] * k; out += rect(x, 120, w, 56, typeof p === 'number' ? [LEMON, MINT][i % 2] : PAPER, INK) + text(x + w / 2, 160, lab(p), 32, typeof p === 'number' ? INK : FERN, mid); x += w; });
  return svg(out + note('the whole and its parts'), `A whole of ${whole} made of parts ${parts.join(' and ')}`);
}
// Two bars to compare; extra = a labelled extra piece on the second bar (negative = fewer).
function compareBars(a, b, extra) {
  const less = extra != null && extra < 0, ex = Math.abs(extra || 0), top = extra == null ? Math.max(a, b) : less ? a : a + ex, k = 460 / top;
  let out = text(60, 80, 'A', 26, INK, mid) + rect(90, 50, a * k, 50, LEMON, INK) + text(90 + a * k / 2, 85, a, 28, INK, mid) + text(60, 160, 'B', 26, INK, mid);
  if (extra == null) out += rect(90, 130, b * k, 50, SKY, INK) + text(90 + b * k / 2, 165, b, 28, INK, mid) + dash(90 + Math.min(a, b) * k, 40, 90 + Math.min(a, b) * k, 190, CORAL) + dash(90 + Math.max(a, b) * k, 40, 90 + Math.max(a, b) * k, 190, CORAL) + q(90 + (a + b) / 2 * k, 215, 34);
  else if (less) out += rect(90, 130, (a - ex) * k, 50, SKY, INK) + q(90 + (a - ex) * k / 2, 170, 40) + rect(90 + (a - ex) * k, 130, ex * k, 50, 'none', CORAL) + text(90 + (a - ex) * k + ex * k / 2, 212, `${ex} fewer`, 20, CORAL, mid);
  else out += rect(90, 130, a * k, 50, SKY, INK) + rect(90 + a * k, 130, ex * k, 50, CORAL, INK) + text(90 + a * k + ex * k / 2, 165, ex, 24, INK, mid) + text(90 + a * k + ex * k / 2, 212, `${ex} more`, 20, CORAL, mid) + q(90 + a * k / 2, 170, 40);
  return svg(out, extra == null ? `Bars of ${a} and ${b} to compare` : less ? `Bar B is bar A minus ${ex}` : `Bar B is bar A plus ${ex} more`, 230);
}
// A pile with things leaving (and maybe arriving); icon can be the bus.
function takeAway(total, outs, ins, icon, big = false) {
  let out = big ? icon(170, 120, 1) : heap(170, 115, icon, 1.4);
  out += tag(170, 50, total);
  outs.forEach((v, i) => { const y = 95 + i * 60; out += arrow(300, y, 380, y - 20) + tag(430, y - 22, `− ${v}`, CORAL, 24); });
  ins.forEach((v, i) => { const y = 95 + (outs.length + i) * 60; out += arrow(380, y - 20, 300, y, FERN) + tag(430, y - 22, `+ ${v}`, LEAF, 24); });
  return svg(out + q(560, 135) + text(560, 180, 'left', 24, FERN, mid), `${total} with ${outs.map(v => v + ' taken away').join(', ')}${ins.length ? ' and ' + ins.map(v => v + ' added').join(', ') : ''}`);
}
// A row of number cards with hop arcs between them.
function cardsRow(terms, caption = 'same jump each time') {
  const n = terms.length, cw = Math.min(110, (W - 60) / n - 14), x0 = (W - n * (cw + 14)) / 2;
  let out = '';
  terms.forEach((t, i) => { const x = x0 + i * (cw + 14); out += card(x, 100, cw, 80, t, /\d/.test(t) ? PAPER : MINT, String(t).length > 4 ? 26 : 34); if (i) out += arc(x - 14, x, 100, '', CORAL, 40); });
  return svg(out + note(caption), `Number cards: ${terms.join(', ')}`);
}
// A number line with jumps; o: from,to,tick,labels(bool),start,step,jumps,flag,note,second,names,noEnd,mark.
function numberLine(o) {
  const x0 = 50, x1 = 600, y = 150, k = (x1 - x0) / (o.to - o.from), X = v => x0 + (v - o.from) * k;
  let out = line(x0 - 10, y, x1 + 10, y, INK, 5);
  const tick = o.tick || Math.max(1, Math.round((o.to - o.from) / 6));
  for (let v = o.from; v <= o.to + 1e-9; v += tick) out += line(X(v), y - 12, X(v), y + 12, INK, 4) + ((o.labels === false && v !== o.from && v !== o.to) || (o.noEnd && v === o.to) || (o.start != null && Math.abs(v - o.start) * k < 34) ? '' : text(X(v), y + 44, v, 24, INK, mid));
  if (o.start != null) out += blob(X(o.start), y - 28, 22, 17, 0, LEAF, INK) + blob(X(o.start) - 9, y - 41, 6, 6, 0, '#fff', INK) + blob(X(o.start) + 9, y - 41, 6, 6, 0, '#fff', INK) + text(X(o.start), y + 44, o.start, 24, FERN, mid) + text(X(o.start), y + 68, 'start', 18, FERN, mid);
  if (o.mark != null) out += blob(X(o.mark), y - 30, 14, 14, 0, CORAL, INK) + text(X(o.mark), y - 52, o.mark, 24, CORAL, mid);
  for (let i = 0; i < (o.jumps || 0); i++) { const a = (o.start ?? o.from) + i * o.step; out += arc(X(a), X(a + o.step), y - 14, (o.names ? o.names[0] + ' ' : '') + (o.step < 0 ? '−' : '+') + Math.abs(o.step), CORAL, Math.min(80, Math.abs(o.step) * k * .9)); }
  if (o.second) for (let i = 0; i < 2; i++) { const a = o.from + i * o.second; out += arc(X(a), X(a + o.second), y + 14, o.names[1] + ' +' + o.second, SKY, Math.min(70, o.second * k * .9), false); }
  if (o.flag != null) out += rect(X(o.flag), 40, 5, 110, INK, INK) + shape([[X(o.flag) + 5, 42], [X(o.flag) + 60, 60], [X(o.flag) + 5, 80]], LEMON, INK) + text(Math.min(X(o.flag) + 30, 560), 225, o.note || '', 22, CORAL, mid);
  else if (o.note) out += text(W / 2, o.second ? 40 : 225, o.note, 22, CORAL, mid);
  return svg(out, o.alt || 'A number line with jumps', 240);
}
// Rounding: the two neighbouring multiples, the halfway point and the number.
const roundLine = (n, unit) => { const lo = Math.floor(n / unit) * unit, hi = lo + unit; return numberLine({ from: lo, to: hi, tick: unit / 2, mark: n, note: `halfway is ${lo + unit / 2}`, alt: `A number line from ${lo} to ${hi} with ${n} marked` }); };
// Estimating: each number gets an arrow to a "nearest" box, with the sign between.
function estimatePic(a, b, sign, unit) {
  const one = (v, y) => card(60, y, 130, 64, v, PAPER, 34) + arrow(200, y + 32, 280, y + 32, CORAL, 4) + text(240, y + 20, `nearest ${unit}`, 16, CORAL, mid) + card(290, y, 110, 64, '?', PAPER, 34);
  return svg(one(a, 30) + text(345, 128, sign, 40, CORAL, mid) + one(b, 140) + text(500, 120, 'estimate', 26, FERN, mid) + q(500, 170, 44), `${a} ${sign} ${b}, each rounded to the nearest ${unit}`, 230);
}
// Dots in pairs, with any odd one out.
function pairsPic(ns) {
  let out = '', x = 60;
  ns.forEach((n, g) => { for (let i = 0; i < n; i++) out += blob(x + Math.floor(i / 2) * 26, 90 + (i % 2) * 30, 10, 10, 0, PAL[g % 4], INK); out += tag(x + Math.ceil(n / 2) * 13 - 13, 50, n); x += Math.ceil(n / 2) * 26 + 60; if (g < ns.length - 1) { out += text(x - 38, 115, '+', 40, CORAL, mid); } });
  return svg(out + note('put them in pairs'), `${ns.join(' and ')} dots arranged in pairs`);
}
// ---- arrays, groups, division --------------------------------------------------------------------
function arrayGrow(r, c, addR = 0, addC = 0) {
  const sp = Math.min(40, 440 / Math.max(c + addC, 6), 150 / Math.max(r + addR, 3)), x0 = 90, y0 = 60;
  let out = '';
  for (let i = 0; i < r + addR; i++) for (let j = 0; j < c + addC; j++) { const extra = i >= r || j >= c; out += blob(x0 + j * sp, y0 + i * sp, sp * .3, sp * .3, 0, extra ? PAPER : SKY, extra ? CORAL : INK); }
  out += text(x0 - 40, y0 + (r - 1) * sp / 2 + 8, `${r} rows`, 20, INK, 'text-anchor="end"') + text(x0 + (c - 1) * sp / 2, y0 - 22, `${c} in a row`, 20, INK, mid);
  if (addR) out += text(x0 + (c + addC - 1) * sp + 30, y0 + (r + addR - 1) * sp + 8, `+ ${addR} row${addR > 1 ? 's' : ''}`, 20, CORAL);
  if (addC) out += text(x0 + (c + addC - 1) * sp + 30, y0 + 8, `+ ${addC} more`, 20, CORAL);
  return svg(out + q(580, 130), `An array of ${r} rows of ${c}${addR ? ` with ${addR} more rows` : ''}${addC ? ` with ${addC} more in each row` : ''}`, Math.max(220, y0 + (r + addR) * sp + 20));
}
function groupsDots(g, n, extra = '') {
  let out = '';
  for (let i = 0; i < g; i++) { const cx = 70 + (i % 5) * 112, cy = 85 + Math.floor(i / 5) * 95; out += blob(cx, cy, 48, 36, 0, MINT, INK); for (let j = 0; j < n; j++) out += blob(cx - 30 + (j % 4) * 20, cy - 12 + Math.floor(j / 4) * 20, 6, 6, 0, SKY, INK); }
  const h = Math.max(220, 85 + Math.ceil(g / 5) * 95 + 20);
  out += text(W / 2, h - 10, extra || `${g} groups of ${n}`, 20, FERN, mid);
  return svg(out, `${g} groups with ${n} in each`, h);
}
function groupsDiv(total, n, extra = '') {
  let out = tag(90, 60, `${total} in all`);
  for (let i = 0; i < n; i++) { const x = 200 + (i % 6) * 72, y = 80 + Math.floor(i / 6) * 70; out += blob(x, y, 30, 16, 0, SKY, INK) + q(x, y - 18, 24); }
  return svg(out + text(90, 150, `${n} equal`, 24, INK, mid) + text(90, 180, 'groups', 24, INK, mid) + (extra ? note(extra) : ''), `${total} things shared into ${n} equal groups`);
}
function arrayPair(rows, total) {
  const sp = rows > 4 ? 26 : 44, r0 = rows > 4 ? 8 : 13;
  let out = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < 5; c++) out += blob(140 + c * sp, 70 + r * sp, r0, r0, 0, c < 3 ? SKY : PAPER, c < 3 ? INK : '#b9b3a3');
  out += text(80, 70 + (rows - 1) * sp / 2 + 8, `${rows} rows`, 24, INK, mid) + text(140 + 2 * sp, 40, '? in each row', 22, CORAL, mid) + tag(480, 110, `${total} dots`);
  return svg(out, `${rows} rows of dots making ${total}`, Math.max(220, 90 + rows * sp));
}
// Two-digit × one-digit as a tens block and a ones block.
function partitionPic(a, f) {
  const t = Math.floor(a / 10) * 10, o = a % 10, k = 440 / a, h = Math.min(120, 24 * f + 20), y = 60;
  let out = rect(60, y, t * k, h, LEMON, INK) + rect(60 + t * k, y, o * k, h, SKY, INK) + text(60 + t * k / 2, y - 14, `${t}`, 24, INK, mid) + text(60 + t * k + o * k / 2, y - 14, `${o}`, 24, INK, mid) + text(40, y + h / 2 + 8, f, 28, INK, 'text-anchor="end"');
  out += text(60 + t * k / 2, y + h / 2 + 8, `${f} × ${t}`, 22, INK, mid) + text(60 + t * k + o * k / 2, y + h / 2 + 8, `${f} × ${o}`, 18, INK, mid) + text(W / 2, y + h + 40, `${a} is ${t} and ${o}`, 22, FERN, mid);
  return svg(out, `${a} split into ${t} and ${o}, each multiplied by ${f}`);
}
// ---- fractions -----------------------------------------------------------------------------------
// A strip with d equal parts; shaded = number shaded (from the left); taken = parts crossed out after the shaded ones.
function strip(d, shaded = 0, taken = [], y = 80, h = 70, label = '') {
  const w = 520 / d;
  let out = '', pos = 0;
  for (let i = 0; i < d; i++) out += rect(60 + i * w, y, w, h, i < shaded ? LEMON : PAPER, INK);
  pos = shaded;
  taken.forEach((tk, g) => { for (let i = 0; i < tk; i++) { const x = 60 + (pos + i) * w; out += line(x + 6, y + 6, x + w - 6, y + h - 6, CORAL, 4) + line(x + w - 6, y + 6, x + 6, y + h - 6, CORAL, 4); } pos += tk; });
  return out + (label ? text(50, y + h / 2 + 8, label, 22, INK, 'text-anchor="end"') : '');
}
const stripPic = (d, shaded, taken = [], caption = '') => svg(strip(d, shaded, taken) + note(caption || `${d} equal parts`), `A strip of ${d} equal parts${shaded ? `, ${shaded} shaded` : ''}${taken.length ? `, ${taken.join(' and ')} crossed out` : ''}`);
// Several strips with the same number of parts, shaded counts given (null = empty strip).
function sameBars(d, vals, names) {
  const n = vals.length, h = Math.min(60, 160 / n), gap = (190 - n * h) / Math.max(1, n - 1);
  let out = '';
  vals.forEach((v, i) => { const y = 20 + i * (h + gap); out += strip(d, v || 0, [], y, h, names ? names[i] : (v == null ? '?' : `${v}/${d}`)); });
  return svg(out, `${n} strips of ${d} parts with ${vals.join(', ')} shaded`);
}
// Unit fractions: one strip per denominator, one part shaded.
function unitBars(ds, names) {
  const n = ds.length, h = Math.min(60, 160 / n), gap = (190 - n * h) / Math.max(1, n - 1);
  let out = '';
  ds.forEach((d, i) => { const y = 20 + i * (h + gap); out += strip(d, 1, [], y, h, names ? names[i] : `1/${d}`); });
  return svg(out, `Strips cut into ${ds.join(', ')} parts, one part shaded in each`);
}
// A pizza cut into d slices; eaten slices are crossed out (null = no shading).
function pizzaAt(cx, cy, r, d, eaten = 0, fill = LEMON) {
  let out = blob(cx, cy, r, r, 0, fill, INK, 24);
  for (let i = 0; i < d; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / d; out += line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a), INK, 3); }
  for (let i = 0; i < eaten; i++) { const a = -Math.PI / 2 + (i + .5) * 2 * Math.PI / d, x = cx + r * .6 * Math.cos(a), y = cy + r * .6 * Math.sin(a); out += line(x - 9, y - 9, x + 9, y + 9, CORAL, 4) + line(x + 9, y - 9, x - 9, y + 9, CORAL, 4); }
  return out;
}
const pizza = (d, eaten) => svg(pizzaAt(200, 115, 90, d, eaten) + tag(420, 100, `${d} slices`) + (eaten ? tag(420, 150, `${eaten} eaten`, CORAL) : ''), `A pizza cut into ${d} slices${eaten ? `, ${eaten} eaten` : ''}`);
const twoPizzas = (a, b, names) => svg(pizzaAt(170, 115, 85, a) + pizzaAt(470, 115, 85, b, 0, MINT) + text(170, 215, names ? names[0] : `${a} slices`, 22, INK, mid) + text(470, 215, names ? names[1] : `${b} slices`, 22, INK, mid), `Two equal pizzas cut into ${a} and ${b} slices`);
const twoWholes = (d, n) => svg(pizzaAt(150, 125, 50, d) + pizzaAt(430, 115, 95, d) + text(150, 205, 'small cake', 22, INK, mid) + text(430, 225, 'big cake', 22, INK, mid) + text(320, 60, `${n}/${d} of each?`, 26, FERN, mid), `A small cake and a big cake, both cut into ${d}`, 235);
// A row of counters, some one colour and the rest another.
const counters = (d, n) => svg(Array.from({ length: d }, (_, i) => blob(60 + (i % 12) * 46 + (d <= 6 ? 120 : 0), 100 + Math.floor(i / 12) * 50, 17, 17, 0, i < n ? CORAL : SKY, INK)).join('') + note(`${d} counters: ${n} red, the rest blue`), `${d} counters, ${n} red and the rest blue`);
// A 0-to-1 line with d equal steps (no point marked).
const fracLine = (d, markAt) => { const x0 = 60, x1 = 580, y = 130; let out = line(x0, y, x1, y, INK, 5); for (let i = 0; i <= d; i++) out += line(x0 + i * (x1 - x0) / d, y - 14, x0 + i * (x1 - x0) / d, y + 14, INK, 4); out += text(x0, y + 44, '0', 26, INK, mid) + text(x1, y + 44, '1', 26, INK, mid); if (markAt != null) out += blob(x0 + markAt * (x1 - x0) / d, y - 28, 12, 12, 0, CORAL, INK); return svg(out + text(320, 60, `${d} equal steps`, 24, FERN, mid), `A line from 0 to 1 in ${d} equal steps`); };
// Equivalent fractions: a strip of d parts with n shaded above a strip of b parts (unshaded).
const eqBars = (n, d, b) => svg(strip(d, n, [], 40, 60, `${n}/${d}`) + strip(b, 0, [], 130, 60, `?/${b}`) + note('the same length, cut differently'), `A strip of ${d} parts with ${n} shaded, over a strip of ${b} parts`);
const cutAgain = (d, n, c) => { const w = 520 / d; let out = strip(d, n, [], 50, 70); for (let i = 0; i < d; i++) for (let j = 1; j < c; j++) out += dash(60 + i * w + j * w / c, 56, 60 + i * w + j * w / c, 114, CORAL, 3); return svg(out + note(`each part is cut into ${c}`, 160), `A strip of ${d} parts, ${n} shaded, each part cut into ${c}`); };
// Unit fraction of a whole: d boxes, the first holding p, the rest '?', total '?'.
const wholeBar = (d, p) => { const w = Math.min(100, 500 / d); let out = ''; for (let i = 0; i < d; i++) out += card(70 + i * w, 110, w, 60, i ? '?' : p, i ? PAPER : LEMON, 28); out += rect(70, 40, d * w, 50, 'none', INK) + text(70 + d * w / 2, 74, '? altogether', 24, FERN, mid) + note(`1/${d} of the whole is ${p}`); return svg(out, `${d} equal parts, one of them is ${p}`); };
// ---- money ---------------------------------------------------------------------------------------
function coinAt(x, y, v, s = 1) {
  const gold = v >= 100, r = (v === 200 ? 22 : v === 100 ? 20 : v === 50 ? 21 : v === 20 ? 19 : 17) * s;
  return blob(x, y, r, r, 0, gold ? LEMON : '#d9d9d9', INK, 20) + text(x, y + 6 * s, v >= 100 ? `$${v / 100}` : `${v}c`, 16 * s, INK, mid);
}
const noteAt = (x, y, v) => rect(x - 55, y - 28, 110, 56, v === 5 ? CORAL : v === 10 ? SKY : v === 20 ? LEAF : v === 50 ? '#d8b4e2' : LEMON, INK) + text(x, y + 8, `$${v}`, 26, INK, mid);
function coinsPic(list, caption = '') {
  let out = '';
  list.forEach((v, i) => { const x = 70 + (i % 9) * 60, y = 80 + Math.floor(i / 9) * 60; out += v >= 500 ? noteAt(x + 30, y, v / 100) : coinAt(x, y, v); });
  return svg(out + (caption ? note(caption) : ''), `Coins: ${list.map(v => v >= 100 ? '$' + v / 100 : v + 'c').join(', ')}`);
}
// ---- measurement ---------------------------------------------------------------------------------
function jug(v, total, label) {
  const x = 200, y = 40, w = 160, h = 160, f = v / total;
  let out = rect(x, y, w, h, PAPER, INK) + rect(x + 4, y + h - h * f, w - 8, h * f - 4, SKY, 'none') + line(x, y + h - h * f, x + w, y + h - h * f, INK, 2);
  for (let i = 1; i <= 4; i++) out += line(x + w - 24, y + h - h * i / 4, x + w, y + h - h * i / 4, INK, 2) + text(x + w + 10, y + h - h * i / 4 + 7, `${total * i / 4}`, 16, INK);
  return svg(out + tag(480, 110, label || `${v} mL`, SKY) + text(x + w / 2, y + h + 32, `holds ${total} mL`, 20, FERN, mid), `A jug holding ${total}, filled to ${v}`);
}
function bottles(n, ml, l) {
  let out = '';
  for (let i = 0; i < n; i++) out += rect(60 + i * 70, 70, 50, 110, SKY, INK) + rect(75 + i * 70, 50, 20, 20, SKY, INK) + text(85 + i * 70, 135, ml, 16, INK, mid);
  out += text(60 + n * 35 - 35, 210, `${n} × ${ml} mL`, 22, INK, mid) + text(340, 125, 'or', 28, FERN, mid) + rect(400, 40, 90, 150, MINT, INK) + rect(430, 20, 30, 20, MINT, INK) + text(445, 125, `${l} L`, 26, INK, mid);
  return svg(out, `${n} bottles of ${ml} mL beside one ${l} L bottle`);
}
function rulerPic(gap, read) {
  const k = 500 / (read + gap + 2), x0 = 60 + gap * k, y = 150;
  let out = rect(60, y - 10, 540, 50, LEMON, INK);
  for (let i = 0; i <= read + 2; i++) { const x = x0 + i * k; out += line(x, y - 10, x, y + (i % 5 ? 6 : 14), INK, 2) + (i % 5 === 0 ? text(x, y + 36, i, 16, INK, mid) : ''); }
  out += rect(60, 70, (read + gap) * k, 50, SKY, INK) + text(60 + (read + gap) * k / 2, 102, 'book', 22, INK, mid) + text(60 + gap * k / 2, 215, `${gap} cm`, 16, CORAL, mid) + arrow(60, 60, 60 + gap * k, 60, CORAL, 3);
  return svg(out, `A ruler whose 0 is ${gap} cm in from its end; a book from the end to the ${read} cm mark`, 230);
}
function endToEnd(vals, unit = 'cm') {
  const k = 500 / vals.reduce((a, b) => a + b, 0); let x = 70, out = '';
  vals.forEach((v, i) => { out += rect(x, 90, v * k, 44, PAL[i % 4], INK) + text(x + v * k / 2, 120, `${v} ${unit}`, 22, INK, mid); x += v * k; });
  return svg(out + dash(70, 160, 570, 160, CORAL) + q(320, 200, 34), `${vals.join(' and ')} ${unit} laid end to end`);
}
function barsOf(vals, unit) {
  const k = 480 / Math.max(...vals); let out = '';
  vals.forEach((v, i) => { out += rect(70, 40 + i * 60, v * k, 40, PAL[i % 4], INK) + text(80 + v * k, 68 + i * 60, `${v} ${unit}`, 22, INK); });
  return svg(out, `Bars of ${vals.join(', ')} ${unit}`);
}
// ---- perimeter and area --------------------------------------------------------------------------
const polyPts = (n, cx, cy, r, rot = -Math.PI / 2) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rot + i * 2 * Math.PI / n), cy + r * Math.sin(rot + i * 2 * Math.PI / n)]);
const sideLabel = (p, qp, cx, cy, s) => { const mx = (p[0] + qp[0]) / 2, my = (p[1] + qp[1]) / 2, dx = mx - cx, dy = my - cy, d = Math.hypot(dx, dy) || 1; return text(mx + dx / d * 30, my + dy / d * 30 + 8, esc(s), 22, INK, mid); };
function polygon(sides, unit) {
  const n = sides.length; let pts;
  if (n === 3) { const [a, b, c] = sides, k = 220 / Math.max(a, b, c), A = Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)))); pts = [[0, 0], [c * k, 0], [b * k * Math.cos(A), -b * k * Math.sin(A)]]; const mx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, my = (pts[0][1] + pts[1][1] + pts[2][1]) / 3; pts = pts.map(([x, y]) => [x - mx + 230, y - my + 125]); }
  else pts = polyPts(n, 230, 120, 85);
  const cx = pts.reduce((s, p) => s + p[0], 0) / n, cy = pts.reduce((s, p) => s + p[1], 0) / n;
  let out = shape(pts, LEMON, CORAL, 6);
  pts.forEach((p, i) => { out += sideLabel(p, pts[(i + 1) % n], cx, cy, `${sides[n === 3 ? [2, 0, 1][i] : i]} ${unit}`); });
  return svg(out + text(470, 110, 'all the way', 24, CORAL) + text(470, 140, 'around = ?', 24, CORAL), `A shape with sides ${sides.join(', ')} ${unit}`);
}
function regular(n, side, around, cx = 230, corners = false) {
  const pts = polyPts(n, cx, 120, 85);
  let out = shape(pts, MINT, CORAL, 6) + (side ? sideLabel(pts[0], pts[1], cx, 120, side) : '');
  for (let i = 0; i < n; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % n], mx = (ax + bx) / 2, my = (ay + by) / 2, dx = (by - ay), dy = -(bx - ax), d = Math.hypot(dx, dy) || 1; out += line(mx - dx / d * 7, my - dy / d * 7, mx + dx / d * 7, my + dy / d * 7, INK, 3); if (corners) out += blob(ax, ay, 7, 7, 0, CORAL, INK); }
  return out + (around ? text(cx + 160, 110, 'all around', 24, CORAL) + text(cx + 160, 140, `= ${around}`, 24, CORAL) : '');
}
function rectangle(o) {
  const rl = o.ratio ? o.ratio[0] : (typeof o.l === 'number' ? o.l : 5), rw = o.ratio ? o.ratio[1] : (typeof o.w === 'number' ? o.w : 3);
  const k = Math.min(300 / rl, 130 / rw), pw = rl * k, ph = rw * k, x = 150, y = 55 + (130 - ph) / 2;
  const lab = v => typeof v === 'number' ? `${v} ${o.unit || 'cm'}` : v;
  let out = rect(x, y, pw, ph, o.fill || LEMON, 'none');
  if (o.cut) { const c = o.cut * k; out = shape([[x, y], [x + pw - c, y], [x + pw - c, y + c], [x + pw, y + c], [x + pw, y + ph], [x, y + ph]], LEMON, CORAL, 6) + text(x + pw - c / 2, y - 10, lab(o.cut), 20, INK, mid) + text(x + pw + 8, y + c / 2 + 8, lab(o.cut), 20, INK); }
  else out += `<path d="M${x} ${y} L${x + pw} ${y} L${x + pw} ${y + ph} L${x} ${y + ph} Z" fill="none" stroke="${CORAL}" stroke-width="7" stroke-linejoin="round"/>`;
  out += text(x + pw / 2, o.cut ? y + ph + 30 : y - 14, lab(o.l), 24, typeof o.l === 'number' ? INK : FERN, mid) + text(x - 12, y + ph / 2 + 8, lab(o.w), 24, typeof o.w === 'number' ? INK : FERN, 'text-anchor="end"');
  if (o.gap) { const g = o.gap * k; out += line(x + pw / 2 - g / 2 - 2, y + ph, x + pw / 2 + g / 2 + 2, y + ph, '#fffdf6', 11) + dash(x + pw / 2 - g / 2, y + ph, x + pw / 2 + g / 2, y + ph, INK, 3) + text(x + pw / 2, y + ph + 30, `${o.gap} ${o.unit} gate`, 20, CORAL, mid); }
  if (o.posts) { [[x, y], [x + pw, y], [x, y + ph], [x + pw, y + ph]].forEach(([px, py]) => { out += blob(px, py, 8, 8, 0, INK, INK); }); out += text(x + pw / 2, y + ph + 30, `a post every ${o.posts} ${o.unit}, one at each corner`, 20, CORAL, mid); }
  const side = o.around ? text(480, 100, 'all around', 24, CORAL) + text(480, 130, `= ${o.around}`, 24, CORAL) : text(480, 110, 'all the way', 24, CORAL) + text(480, 140, 'around = ?', 24, CORAL);
  return svg(out + side, o.alt || `A rectangle ${lab(o.l)} by ${lab(o.w)}`);
}
function joined(s, unit) {
  const sq = 110, x0 = 150, y0 = 60;
  const out = rect(x0, y0, sq, sq, LEMON, 'none') + rect(x0 + sq, y0, sq, sq, MINT, 'none') + dash(x0 + sq, y0, x0 + sq, y0 + sq) + `<path d="M${x0} ${y0} L${x0 + 2 * sq} ${y0} L${x0 + 2 * sq} ${y0 + sq} L${x0} ${y0 + sq} Z" fill="none" stroke="${CORAL}" stroke-width="7" stroke-linejoin="round"/>` + text(x0 + sq / 2, y0 - 18, `${s} ${unit}`, 24, INK, mid) + text(x0 + sq * 1.5, y0 - 18, `${s} ${unit}`, 24, INK, mid) + text(x0 - 48, y0 + sq / 2 + 8, `${s} ${unit}`, 24, INK, mid) + text(470, 110, 'all the way', 24, CORAL) + text(470, 140, 'around = ?', 24, CORAL);
  return svg(out, `Two ${s} ${unit} squares side by side, the shared edge dashed`);
}
function twoRects(a, b, unit) {
  const k = Math.min(260 / Math.max(a[0], b[0]), 120 / Math.max(a[1], b[1]));
  const one = (r, x, name) => rect(x, 60 + (120 - r[1] * k) / 2, r[0] * k, r[1] * k, name === 'A' ? LEMON : MINT, CORAL) + text(x + r[0] * k / 2, 50, `${r[0]} ${unit}`.trim(), 20, INK, mid) + text(x - 8, 120 + 8, `${r[1]} ${unit}`.trim(), 20, INK, 'text-anchor="end"') + text(x + r[0] * k / 2, 212, name, 24, FERN, mid);
  return svg(one(a, 70, 'A') + one(b, 360, 'B'), `Shape A ${a[0]} by ${a[1]} and shape B ${b[0]} by ${b[1]}`);
}
// A grid of unit squares; o.cutRow marks the last row as removed; o.cols '?' hides the column count.
function areaGrid(r, c, o = {}) {
  const sp = Math.min(44, 440 / c, 150 / r), x0 = 100, y0 = 40;
  let out = '';
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) { const gone = o.cutRow && i === r - 1; out += rect(x0 + j * sp, y0 + i * sp, sp, sp, gone ? PAPER : o.hideCols ? PAPER : LEMON, gone ? CORAL : INK); if (gone) out += line(x0 + j * sp + 6, y0 + i * sp + 6, x0 + (j + 1) * sp - 6, y0 + (i + 1) * sp - 6, CORAL, 3); }
  out += text(x0 - 14, y0 + r * sp / 2 + 8, `${r} rows`, 20, INK, 'text-anchor="end"') + text(x0 + c * sp / 2, y0 - 12, o.hideCols ? '? in each row' : `${c} in each row`, 20, o.hideCols ? CORAL : INK, mid);
  if (o.red) out += `<path d="M${x0} ${y0} L${x0 + c * sp} ${y0} L${x0 + c * sp} ${y0 + r * sp} L${x0} ${y0 + r * sp} Z" fill="none" stroke="${CORAL}" stroke-width="6"/>`;
  return svg(out + (o.caption ? note(o.caption) : ''), `A rectangle of ${r} rows of ${c} squares${o.cutRow ? ', the last row crossed out' : ''}`);
}
function lGrid(a, b, c, d) {
  const sp = Math.min(40, 300 / (a + c), 150 / Math.max(b, d)), x0 = 120, y0 = 40;
  let out = '';
  for (let i = 0; i < b; i++) for (let j = 0; j < a; j++) out += rect(x0 + j * sp, y0 + i * sp, sp, sp, LEMON, INK);
  for (let i = 0; i < d; i++) for (let j = 0; j < c; j++) out += rect(x0 + (a + j) * sp, y0 + i * sp, sp, sp, MINT, INK);
  out += text(x0 + a * sp / 2, y0 - 12, `${a} by ${b}`, 20, INK, mid) + text(x0 + a * sp + c * sp / 2, y0 + d * sp + 26, `${c} by ${d}`, 20, INK, mid);
  return svg(out + text(540, 120, 'area = ?', 24, CORAL, mid), `A ${a} by ${b} rectangle joined to a ${c} by ${d} rectangle`);
}
// ---- turns, clocks, maps -------------------------------------------------------------------------
const DIRS = ['North', 'East', 'South', 'West'];
function compassPic(start, caption = '', cx = 170) {
  const cy = 120, r = 80;
  let out = blob(cx, cy, r, r, 0, PAPER, INK, 28);
  DIRS.forEach((d, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; out += text(cx + (r + 24) * Math.cos(a), cy + (r + 24) * Math.sin(a) + 8, d[0], 26, FERN, mid); });
  if (start) { const i = DIRS.indexOf(start), a = -Math.PI / 2 + i * Math.PI / 2; out += arrow(cx, cy, cx + (r - 18) * Math.cos(a), cy + (r - 18) * Math.sin(a), CORAL, 7) + blob(cx, cy, 8, 8, 0, INK, INK); }
  return svg(out + (caption ? text(440, 120, caption, 22, FERN, 'text-anchor="start"') : ''), `A compass with an arrow pointing ${start || 'nowhere'}${caption ? '; ' + caption : ''}`, 250);
}
function clockFace(h, m, cx = 200, cy = 120, r = 90) {
  let out = blob(cx, cy, r, r, 0, PAPER, INK, 28);
  for (let i = 1; i <= 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; out += text(cx + (r - 22) * Math.cos(a), cy + (r - 22) * Math.sin(a) + 8, i, 20, INK, mid); }
  for (let i = 0; i < 60; i++) { const a = -Math.PI / 2 + i * Math.PI / 30, r0 = i % 5 ? r - 6 : r - 10; out += line(cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), cx + r * Math.cos(a), cy + r * Math.sin(a), INK, i % 5 ? 1.5 : 3); }
  if (h != null) { const ha = -Math.PI / 2 + ((h % 12) + m / 60) * Math.PI / 6, ma = -Math.PI / 2 + m * Math.PI / 30; out += line(cx, cy, cx + (r - 42) * Math.cos(ha), cy + (r - 42) * Math.sin(ha), INK, 7) + line(cx, cy, cx + (r - 24) * Math.cos(ma), cy + (r - 24) * Math.sin(ma), CORAL, 5) + blob(cx, cy, 6, 6, 0, INK, INK); }
  return out;
}
const clockPic = (h, m, caption = '') => svg(clockFace(h, m) + (caption ? text(450, 120, caption, 24, FERN, mid) : ''), `A clock showing ${h}:${String(m).padStart(2, '0')}${caption ? '; ' + caption : ''}`, 240);
function mirrorPic(d, n = 1) {
  const k = 50, cx = 320;
  let out = dash(cx, 30, cx, 200, FERN, 4) + text(cx, 222, 'mirror line', 20, FERN, mid);
  for (let i = 0; i < n; i++) out += blob(cx - d * k, 60 + i * 30, 10, 10, 0, CORAL, INK);
  out += text(cx - d * k, 40, d ? `${d} squares` : '', 18, CORAL, mid);
  for (let g = 1; g <= 5; g++) out += dash(cx - g * k, 30, cx - g * k, 200, '#d9d3bf', 1) + dash(cx + g * k, 30, cx + g * k, 200, '#d9d3bf', 1);
  return svg(out + q(cx + d * k, 70, 30), `${n} dot${n > 1 ? 's' : ''} ${d} squares left of a mirror line`, 235);
}
function mapLine(names, gaps, dir) {
  const vertical = /north|south/i.test(dir), total = gaps.reduce((a, b) => a + b, 0), k = (vertical ? 150 : 460) / total;
  let out = text(590, 40, 'N ↑', 26, FERN, mid), pos = 0;
  names.forEach((nm, i) => { const x = vertical ? 320 : 90 + pos * k, y = vertical ? 190 - pos * k : 120; out += blob(x, y, 12, 12, 0, PAL[i % 4], INK) + text(x + (vertical ? 24 : 0), y + (vertical ? 8 : 36), nm, 22, INK, vertical ? '' : mid); if (i < gaps.length) { out += text(vertical ? 250 : 90 + (pos + gaps[i] / 2) * k, vertical ? 190 - (pos + gaps[i] / 2) * k + 8 : 85, `${gaps[i]}`, 22, CORAL, mid); pos += gaps[i]; } });
  return svg(out, `Places in a line: ${names.join(', ')}`);
}
function weekStrip(todayIdx, n) {
  const D = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let out = D.map((d, i) => card(40 + i * 80, 70, 70, 60, d, i === todayIdx ? LEMON : PAPER, 22)).join('') + text(75 + todayIdx * 80, 55, 'today', 18, CORAL, mid);
  return svg(out + note(`${n} days later?  (7 days = one week round)`, 180), `A week strip with ${D[todayIdx]} marked as today`);
}
function barChart(labels, values, o = {}) {
  const n = labels.length, bw = Math.min(90, 380 / n), x0 = 120, base = 180, max = Math.max(...values.map(v => v || 0), 1), k = 130 / max;
  let out = line(x0 - 10, base, x0 + n * bw * 1.3, base, INK, 4) + line(x0 - 10, base, x0 - 10, 30, INK, 4);
  labels.forEach((l, i) => { const v = values[i], x = x0 + i * bw * 1.3; out += v == null ? rect(x, 60, bw, base - 60, 'none', CORAL) + q(x + bw / 2, 130, 36) : rect(x, base - v * k, bw, v * k, PAL[i % 4], INK) + (o.noValues ? '' : text(x + bw / 2, base - v * k - 10, v, 20, INK, mid)); out += text(x + bw / 2, base + 26, l, 20, INK, mid); });
  if (o.step) for (let g = 1; g <= 6; g++) out += line(x0 - 16, base - g * o.step * k, x0 - 4, base - g * o.step * k, INK, 2) + text(x0 - 22, base - g * o.step * k + 6, g * o.step, 14, INK, 'text-anchor="end"');
  return svg(out + (o.title ? text(520, 60, o.title, 22, FERN, mid) : '') + (o.caption ? text(520, 100, o.caption, 20, CORAL, mid) : ''), `A bar graph: ${labels.map((l, i) => `${l} ${values[i] ?? '?'}`).join(', ')}`);
}
function dotPlot(labels, values) {
  const n = labels.length, x0 = 140, base = 180, sp = Math.min(120, 400 / n);
  let out = line(x0 - 40, base, x0 + n * sp, base, INK, 4);
  labels.forEach((l, i) => { const x = x0 + i * sp; out += text(x, base + 28, l, 22, INK, mid); for (let d = 0; d < values[i]; d++) out += blob(x, base - 16 - d * 24, 9, 9, 0, SKY, INK); });
  return svg(out + text(540, 60, 'one dot = one child', 18, FERN, mid), `A dot plot: ${labels.map((l, i) => `${values[i]} above ${l}`).join(', ')}`);
}
const replyCards = list => svg(list.map((r, i) => card(40 + (i % 6) * 95, 50 + Math.floor(i / 6) * 70, 85, 56, r, PAL[i % 4], r.length > 4 ? 18 : 24)).join('') + note('sort the replies'), `Reply cards: ${list.join(', ')}`);
function tally(counts, names, total) {
  let out = '';
  counts.forEach((c, i) => { const y = 55 + i * 55; out += text(60, y + 8, names[i], 22, INK); for (let j = 0; j < c; j++) { const g = Math.floor(j / 5), r = j % 5, x = 180 + g * 70 + r * 11; out += r === 4 ? line(x - 46, y - 14, x + 2, y + 14, INK, 3) : line(x, y - 14, x, y + 14, INK, 3); } out += text(500, y + 8, c, 24, INK, mid); });
  return svg(out + tag(560, 110, `${total} asked`), `Tally marks for ${names.join(', ')}`);
}
function balance(leftT, rightT) {
  let out = line(320, 60, 320, 170, INK, 6) + shape([[290, 170], [350, 170], [320, 140]], INK, INK, 2) + line(120, 60, 520, 60, INK, 6) + line(120, 60, 120, 90, INK, 3) + line(520, 60, 520, 90, INK, 3);
  out += rect(50, 90, 140, 50, LEMON, INK) + text(120, 123, esc(leftT), 24, INK, mid) + rect(450, 90, 140, 50, SKY, INK) + text(520, 123, esc(rightT), 24, INK, mid) + text(320, 205, 'both sides balance', 20, FERN, mid);
  return svg(out, `A balance with ${leftT} on one side and ${rightT} on the other`);
}
const pathPic = (a, na, b, nb) => {
  const V = { North: [0, -1], South: [0, 1], East: [1, 0], West: [-1, 0] }, k = 28;
  const [ax, ay] = V[a], [bx, by] = V[b];
  // Start so that the whole path stays inside the picture.
  const xs = [0, ax * na, ax * na + bx * nb], ys = [0, ay * na, ay * na + by * nb];
  let x = 320 - (Math.min(...xs) + Math.max(...xs)) / 2 * k, y = 150 - (Math.min(...ys) + Math.max(...ys)) / 2 * k;
  const label = (x1, y1, x2, y2, s, c) => (x1 === x2 ? text(x1 + 14, (y1 + y2) / 2 + 6, s, 18, c, 'text-anchor="start"') : text((x1 + x2) / 2, y1 - 12, s, 18, c, mid));
  let out = blob(x, y, 10, 10, 0, LEMON, INK) + text(x, y + 28, 'start', 16, INK, mid);
  let x2 = x + ax * na * k, y2 = y + ay * na * k;
  out += arrow(x, y, x2, y2, CORAL, 5) + label(x, y, x2, y2, `${a} ${na}`, CORAL);
  let x3 = x2 + bx * nb * k, y3 = y2 + by * nb * k;
  out += arrow(x2, y2, x3, y3, SKY, 5) + label(x2, y2, x3, y3, `${b} ${nb}`, '#5a7fb5');
  out += blob(x3, y3, 10, 10, 0, CORAL, INK) + text(x3, y3 - 16, 'finish', 16, INK, mid) + text(590, 40, 'N ↑', 26, FERN, mid);
  return svg(out, `A path: ${a} ${na} then ${b} ${nb}`, 300);
};
const factTriangle = (a, b, p) => svg(shape([[320, 30], [180, 190], [460, 190]], MINT, INK, 4) + text(320, 80, p, 40, INK, mid) + text(225, 182, a, 36, INK, mid) + text(415, 182, b, 36, INK, mid) + text(320, 170, '×', 30, CORAL, mid) + text(255, 130, '÷', 26, CORAL, mid) + text(385, 130, '÷', 26, CORAL, mid), `Fact triangle: ${p} on top, ${a} and ${b} below`);
const scaleTen = (top, bottom) => svg(card(120, 25, 400, 70, top, PAPER, 34) + arrow(320, 105, 320, 135, CORAL, 5) + text(360, 128, '× 10', 26, CORAL) + card(120, 145, 400, 70, bottom, LEMON, 34), `${top}, then ten times bigger: ${bottom}`, 230);
const venn = (a, b) => svg(blob(250, 115, 130, 90, 0, LEMON, INK) + blob(390, 115, 130, 90, 0, SKY, INK) + blob(320, 115, 60, 70, 0, MINT, 'none') + text(190, 60, `factors of ${a}`, 22, INK, mid) + text(450, 60, `factors of ${b}`, 22, INK, mid) + q(320, 135), `Two overlapping rings: factors of ${a} and factors of ${b}`);
const mystery = (p, s) => svg(card(70, 40, 100, 130, '?', LEMON, 60) + card(200, 40, 100, 130, '?', SKY, 60) + text(360, 95, `× = ${p}`, 34, INK) + text(360, 150, `+ = ${s}`, 34, INK) + star(560, 60, 18, CORAL) + star(600, 110, 12, LEMON) + text(185, 205, 'the same two numbers both times', 20, FERN, mid), `Two mystery numbers: multiplied ${p}, added ${s}`);

// ---- which picture for which question --------------------------------------------------------------
const story = p => /[a-z]{3}/i.test(p) && !/columns/i.test(p);
const terms = p => { const m = p.match(/(\d+|□|__|…)(,\s*(\d+|□|__|…))+/); return m ? m[0].split(/,\s*/).map(t => /\d/.test(t) ? t : t === '…' ? '…' : '?') : null; };
const unitDens = p => (p.match(/1\/(\d+)/g) || []).map(s => +s.slice(2));
// "1/d of n": the denominator and the first whole number that is not part of a fraction.
const fracOf = p => { const d = unitDens(p)[0], n = nums(p.replace(/\d+\/\d+/g, ' '))[0]; return d && n != null ? [d, n] : null; };
const dirIn = p => { const m = p.match(/\b(North|East|South|West)\b/); return m ? m[1] : null; };
const listAfterColon = p => { const m = p.match(/:\s*([^.?]+)/); return m ? m[1].split(/,\s*/).map(s => s.trim()).filter(Boolean) : null; };
const moreLess = p => { const m = p.match(/(\d+) (more|less) than (\d+)/); return m && hop(m[3], [(m[2] === 'more' ? '+' : '−') + m[1]]); };
const rowCards = p => { const t = terms(p); return t && cardsRow(t); };
const jumpsLine = p => { const m = p.match(/Start at (\d+) and count (on|back) in (\d+)s\. What is the (\d+)/); if (!m) return ''; const s = +m[1], st = +m[3], k = +m[4], back = m[2] === 'back'; return numberLine({ from: back ? s - st * (k + 1) : s, to: back ? s : s + st * (k + 1), tick: st, labels: false, start: s, step: back ? -st : st, jumps: k, note: `${k} jumps of ${st}${back ? ' back' : ''}`, alt: `A number line from ${s} with ${k} jumps of ${st}${back ? ' backwards' : ''}` }); };
const rectBy = p => { const m = p.match(/(\d+) (cm|m|mm) by (\d+) \w+/); return m && rectangle({ l: +m[1], w: +m[3], unit: m[2] }); };
const clockFromPrompt = p => { const m = p.match(/(\d{1,2}):(\d{2})/); return m && clockPic(+m[1], +m[2]); };
const RULES = {
  // Year 3 place value and counting
  'whole number sequence': p => counter(nums(p)[0], /before|back/i.test(p) ? '−1' : '+1'),
  'count over a hundred boundary': p => counter(nums(p)[0], '+1'),
  'ten more or less': moreLess, 'hundred more or less': moreLess, 'ten more over a hundred': moreLess,
  'build numbers with a zero place': p => { const m = p.match(/(\d+) hundreds?, (\d+) tens? and (\d+) ones?/); return m && placeBlocks(+m[1], +m[2], +m[3]); },
  'order digits to make a number': p => { const m = p.match(/digits ([\d, and]+) once/); return m && digitCards(nums(m[1])); },
  'number riddle from digit clues': () => riddleBoxes(),
  'compare digit values': p => { const m = p.match(/the (\d) in (\d+) or the \d in (\d+)/); return m && compareDigits(m[1], m[2], m[3]); },
  'group large collections': p => { const [h, , t, , o] = nums(p); return placeBlocks(h, t, o); },
  'count boxes of ten bags': p => cards(Array(nums(p)[2]).fill('100'), 100),
  'count tens beyond ten tens': p => placeBlocks(0, nums(p)[0], 0, 'ten rods make a hundred'),
  'full tens in a number': p => { const n = nums(p)[0]; return placeBlocks(Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10, 'bags of 10?'); },
  'regroup ten tens into a hundred': p => { const [h, t, o] = nums(p); return placeBlocks(h, t, o, '+ 10 more tens'); },
  'more than nine tens': p => { const [h, t] = nums(p); return placeBlocks(h, t, 0); },
  'number between two numbers': p => { const [a, b] = nums(p); return numberLine({ from: a, to: b, tick: b - a, note: 'somewhere in between?', alt: `A number line from ${a} to ${b}` }); },
  'middle number when ordering': p => cards(nums(p).slice(0, 3)),
  'a number that fits a comparison': p => svg(card(170, 60, 140, 100, nums(p)[0], PAPER, 40) + text(340, 125, '>', 60, CORAL, mid) + card(380, 60, 120, 100, '?', PAPER, 40), `${nums(p)[0]} is greater than what?`),
  'number from a range and a digit clue': p => { const [lo, hi] = nums(p); return numberLine({ from: lo, to: hi, tick: 1, labels: false, note: 'which tick?', alt: `A number line from ${lo} to ${hi}` }); },
  'compare hundreds first': p => { const [a, b] = nums(p); return htoPair(a, b); },
  'range between largest and smallest': p => cards(nums(p).slice(0, 3)),
  'numbers that round to a given ten': p => roundLine(nums(p)[0] - 1, 10),
  'smallest number rounding to a hundred': p => { const r = nums(p)[1]; return numberLine({ from: r - 100, to: r, tick: 50, note: 'halfway rounds up', alt: `A number line from ${r - 100} to ${r}` }); },
  'round to ten and to hundred': p => hop(nums(p)[0], ['nearest 10'], '?'),
  'distance to the nearest hundred': p => roundLine(nums(p)[0], 100),
  'spot a rounding mistake': p => roundLine(nums(p)[0], 100),
  'largest number rounding to a ten': p => { const r = nums(p)[0]; return numberLine({ from: r, to: r + 10, tick: 5, note: 'halfway rounds up', alt: `A number line from ${r} to ${r + 10}` }); },
  'round to tens or hundreds': p => { const [n, u] = nums(p).slice(-2); return [10, 100].includes(u) ? roundLine(n, u) : ''; },
  'compare estimate with exact': p => { const [a, b] = nums(p); return estimatePic(a, b, '+', 10); },
  'estimate a difference by rounding to hundreds': p => { const [, a, b] = nums(p); return estimatePic(a, b, '−', 100); },
  'estimate by specified rounding': p => { const m = p.match(/nearest (\d+)\. Estimate (\d+) ([+−]) (\d+)/); return m ? estimatePic(+m[2], +m[4], m[3], +m[1]) : ''; },
  'estimate a product by rounding': p => { const [pr, u, n] = nums(p); return svg(tag(150, 100, `$${pr}`, LEMON, 34) + arrow(230, 95, 300, 95, CORAL, 4) + text(265, 80, `nearest ${u}`, 16, CORAL, mid) + card(310, 65, 90, 60, '?', PAPER, 30) + text(440, 105, `× ${n}`, 34, INK, mid) + q(540, 110), `$${pr} rounded, times ${n}`); },
  'choose the closest estimate': p => { const [a, b] = nums(p); return estimatePic(a, b, '+', 10); },
  'fix an estimate': p => { const [a, b] = nums(p); return estimatePic(a, b, '+', 100); },
  'estimate a total of three': p => groupsAdd(nums(p).slice(0, 3), dot),
  'count multiples forwards and backwards': rowCards, 'find a missing term': rowCards, 'count by a fixed unit': rowCards, 'name the counting rule': rowCards, 'spot a broken pattern': rowCards, 'two missing terms combined': rowCards, 'continue growing number patterns': rowCards,
  'recognise a consistent pattern rule': p => { const t = listAfterColon(p); return t && t.length >= 3 ? cardsRow(t.map(s => s.replace(/\.$/, ''))) : ''; },
  'count several jumps at once': jumpsLine, 'count back several jumps': jumpsLine,
  'count tens or hundreds from any number': p => { const m = p.match(/starts at (\d+) and moves (forward|back) by (\d+), (\d+) times/); return m && counter(+m[1], (m[2] === 'back' ? '−' : '+') + m[3], +m[4]); },
  'first term past a limit': p => { const m = p.match(/starts at (\d+) and jumps in (\d+)s.*past (\d+)/); return m && numberLine({ from: 0, to: Math.ceil((+m[3] + 10) / 10) * 10, tick: 10, start: +m[1], step: +m[2], jumps: 2, flag: +m[3], note: `past ${m[3]}?`, alt: `A number line, a frog at ${m[1]} jumping in ${m[2]}s, a flag at ${m[3]}` }); },
  'common multiple of two counts': p => { const m = p.match(/(\w+) counts in (\d+)s from 0 and (\w+) counts in (\d+)s/); return m && numberLine({ from: 0, to: Math.max(+m[2], +m[4]) * 3 + Math.min(+m[2], +m[4]), tick: 1000, labels: false, noEnd: true, step: +m[2], jumps: 2, second: +m[4], names: [m[1], m[3]], note: 'the first number both of them say?', alt: `${m[1]} jumps in ${m[2]}s, ${m[3]} in ${m[4]}s` }); },
  'number of jumps to a target': p => { const m = p.match(/in (\d+)s from (\d+), how many jumps .* reach (\d+)/); return m && numberLine({ from: +m[2], to: +m[3], tick: +m[3] - +m[2], step: +m[1], jumps: 1, note: '? jumps', alt: `A number line from ${m[2]} to ${m[3]} with jumps of ${m[1]}` }); },
  'count the terms of a sequence': p => { const m = p.match(/back in (\d+)s from (\d+) .* to (\d+)/); return m && counter(+m[2], '−' + m[1], 1, `down to ${m[3]}`); },
  'apply equal backward jumps': p => { const m = p.match(/starts at (\d+)\..*BACK by (\d+)\..*after (\w+) press/i); return m && counter(+m[1], '−' + m[2], words[m[3]] || +m[3]); },
  'pick the odd number': p => cards(nums(p)),
  'parity of a sum': p => { const m = p.match(/like (\d+) \+ (\d+)/); return m && pairsPic([+m[1], +m[2]]); },
  'odd and even': p => pairsPic([nums(p)[0]]),
  'pairs and leftovers': p => pairsPic([nums(p)[0]]),
  'parity after several threes': p => { const [s] = nums(p); return cardsRow([s, '?', '?', '?', '?'].slice(0, 1 + (words[(p.match(/the (\w+)/) || [])[1]?.replace(/\D/g, '')] || 4)), 'count in 3s'); },
  'complements to 100': p => barModel(100, [nums(p)[0], '?']),
  'complement in a new representation': p => barModel(100, [nums(p)[0], '?']),
  'complement to 100 with the box first': p => barModel(100, ['?', nums(p)[0]]),
  'three parts make 100': p => { const [a, b] = nums(p); return barModel(100, [a, b, '?']); },
  'cents to make a dollar': p => barModel(100, [nums(p)[0], '?'], 'c'),
  'split 100 with a difference': p => barModel(100, ['?', `? + ${nums(p)[1]}`]),
  // Year 3 add, subtract, stories
  'addition with place-value exchange': p => story(p) && groupsAdd(nums(p).slice(0, 2), iconFor(p)),
  'add three numbers': p => groupsAdd(nums(p).slice(0, 3), iconFor(p)), 'add three numbers in a story': p => groupsAdd(nums(p).slice(0, 3), iconFor(p)),
  'missing addend': p => { const m = p.match(/(\d+) \+ □ = (\d+)/); return m && barModel(+m[2], [+m[1], '?']); },
  'find a missing part of a total': p => { const [t, a] = nums(p); return barModel(t, [a, '?']); },
  'more-than comparison': p => { const m = p.match(/has (\d+) .*has (\d+) more/); return m && compareBars(+m[1], null, +m[2]); },
  'adjust a near-hundred': p => { let m = p.match(/Add (\d+) \+ (\d+) by adding (\d+) and then taking (\d+) away/); if (m) return hop(m[2], ['+' + m[3], '−' + m[4]]); m = p.match(/Subtract (\d+) from (\d+) by taking away (\d+) and then adding (\d+) back/); return m && hop(m[2], ['−' + m[3], '+' + m[4]]); },
  'subtraction with place-value exchange': p => { if (!story(p)) return ''; const [t, u] = nums(p); return /km|pages/.test(p) ? barModel(t, [u, '?']) : takeAway(t, [u], [], iconFor(p)); },
  'missing subtrahend': p => { const m = p.match(/(\d+) − □ = (\d+)/); return m && barModel(+m[1], ['?', +m[2]]); },
  'find the starting number': p => { const [g, l] = nums(p); return barModel('?', [g, l]); },
  'difference as comparison': p => { const [a, b] = nums(p); return compareBars(a, b); },
  'subtract twice': p => { const [t, a, b] = nums(p); return takeAway(t, [a, b], [], iconFor(p)); },
  'subtract then add': p => { const [t, off, on] = nums(p); return takeAway(t, [off], [on], bus, true); },
  'inverse to find a start number': p => { const m = p.match(/subtract (\d+)\. The answer is (\d+)/); return m && hop('?', ['−' + m[1]], m[2]); },
  'one-step comparison addition': p => { const [a, b] = nums(p); return compareBars(a, null, b); },
  'one-step missing part': p => { const [a, b] = nums(p); return barModel(a, [b, '?']); },
  'two-step change within 100': p => { const [a, b, c] = nums(p); return takeAway(a, [c], [b], bus, true); },
  'two-step subtraction within 100': p => { const [a, b, c] = nums(p); return takeAway(a, [b, c], [], starIc); },
  'two changes in a story': p => { const [a, b, c] = nums(p); return takeAway(a, [b], [c], apple); },
  'fewer-than comparison': p => { const [a, b] = nums(p); return compareBars(a, null, -b); },
  'find the other part of a total': p => { const [t, m] = nums(p); return barModel(t, [m, '?']); },
  'two take-aways in a story': p => { const [a, b, c] = nums(p); return takeAway(a, [b, c], [], bus, true); },
  'find the start after a gain': p => { const [b, c] = nums(p); return hop('?', ['+' + b], c); },
  'comparison then total': p => { const [a, b] = nums(p); return compareBars(a, null, b); },
  // multiplication and division
  'equal groups multiplication': p => { const [r, c] = nums(p); return groupsDots(r, c); },
  'repeated addition to multiplication': p => { const ns = nums(p); return groupsDots(ns.length, ns[0]); },
  'derive and recall multiplication facts': p => { const [r, c] = nums(p); return arrayGrow(r, c - 1, 0, 1); },
  'missing factor': p => { const [f, pr] = nums(p); return arrayPair(f, pr); },
  'add a row to an array': p => { const [r, c, x] = nums(p); return arrayGrow(r, c, x, 0); },
  'match words to a multiplication': p => { const [a, b] = nums(p); return groupsDots(a, b); },
  'one more group': p => { const [a, b] = nums(p); return arrayGrow(a, b, 0, 1); },
  'multiply then subtract': p => { const [r, c, g] = nums(p); return groupsDots(r, c, `${r} packs of ${c}, then ${g} given away`); },
  'turn the array around': p => { const [a, b] = nums(p); return twoArraysPic(a, b); },
  'division as sharing': p => { const [t, d] = nums(p); return groupsDiv(t, d); },
  'division as grouping': p => { const [t, d] = nums(p); if (t > 60) return ''; const per = Math.min(t, 20), sp = 24; let out = ''; for (let i = 0; i < t; i++) out += blob(80 + (i % per) * sp, 70 + Math.floor(i / per) * 34, 8, 8, 0, SKY, INK); out += blob(80 + (d - 1) * sp / 2, 70, d * sp / 2 + 8, 16, 0, 'none', CORAL) + text(80 + (d - 1) * sp / 2, 44, `a group of ${d}`, 18, CORAL, mid); return svg(out + tag(560, 90, `${t} in all`) + text(560, 150, '? groups', 24, CORAL, mid), `${t} things to be put into groups of ${d}`); },
  'corresponding division facts': p => { const m = p.match(/(\d+) × (\d+) = (\d+)/); if (m) return factTriangle(m[1], m[2], m[3]); const g = p.match(/(\d+) objects fill (\d+) equal groups/); return g && +g[2] <= 12 && groupsDiv(+g[1], +g[2]); },
  'missing divisor': p => { const [t, qt] = nums(p); return qt <= 12 ? groupsDiv(t, qt, `${qt} in each group — how many groups?`) : ''; },
  'write the division': p => { const [t, d] = nums(p); return groupsDiv(t, d); },
  'find the whole from a division': p => { const [d, qt] = nums(p); return groupsDots(d, qt, `${d} groups of ${qt} — how many altogether?`); },
  'add then divide': p => { const [a, b] = nums(p); return groupsAdd([a, b], dot); },
  'two-digit multiplication by partitioning': p => { const ns = nums(p); const [a, f] = /×/.test(p) ? ns : [ns[1], ns[0]]; return a >= 10 && f < 10 ? partitionPic(a, f) : ''; },
  'multiply with the one-digit number first': p => { const [f, a] = nums(p); return partitionPic(a, f); },
  'split into tens and ones': p => { const [a, f] = nums(p); return partitionPic(a, f); },
  'multiply both parts': p => { const [a, f] = nums(p); return partitionPic(a, f); },
  'multiply then add': p => { const [f, a] = nums(p); return partitionPic(a, f); },
  'multiply a two-digit number by ten': p => placeBlocks(0, nums(p)[0], 0, '× 10: every ten becomes a hundred'),
  'factor pairs of products from 1 to 10': p => { const m = p.match(/factor pair of (\d+) is (\d+) and □/); return m && +m[2] <= 8 && arrayPair(+m[2], +m[1]); },
  'division from a known multiplication fact': p => { const m = p.match(/(\d+) × (\d+) = (\d+)/); return m && factTriangle(m[1], m[2], m[3]); },
  'scale a known fact by ten': p => { const f = p.match(/\d+ × \d+ = \d+/), t = [...p.matchAll(/\d+ × \d+/g)].pop(); return f && t && t[0] !== f[0].split(' =')[0] && scaleTen(f[0], t[0] + ' = ?'); },
  'scale a division fact by ten': p => { const f = p.match(/\d+ ÷ \d+ = \d+/), t = [...p.matchAll(/\d+ ÷ \d+/g)].pop(); return f && t && t[0] !== f[0].split(' =')[0] && scaleTen(f[0], t[0] + ' = ?'); },
  'factor pair with a given sum': p => { const m = p.match(/multiply to make (\d+) and add to make (\d+)/); return m && mystery(m[1], m[2]); },
  'common factor riddle': p => { const m = p.match(/factor of (\d+) and a factor of (\d+)/); return m && venn(m[1], m[2]); },
  // fractions
  'fractions of regions': null,
  'fraction left over': p => { const [d, n] = nums(p); return pizza(d, n); },
  'the other part of a set': p => { const [d, n] = nums(p); return counters(d, n); },
  'steps to a fraction on the line': p => { const m = p.match(/into (\d+) equal steps/); return m && fracLine(+m[1]); },
  'fraction left after two takes': p => { const [d, a, b] = nums(p); return stripPic(d, 0, [a, b], `${a} and ${b} pieces taken`); },
  'count all the parts': p => { const [d, n] = nums(p); return stripPic(d, n, [], 'count every part'); },
  'one part short of a whole': p => stripPic(nums(p)[0], nums(p)[0] - 1, [], 'one part missing'),
  'compare unit fractions': p => { const ds = unitDens(p); return ds.length === 2 && ds[0] !== ds[1] ? unitBars(ds) : ''; },
  'biggest unit fraction': p => unitBars(unitDens(p)), 'middle unit fraction': p => unitBars(unitDens(p)),
  'bigger share from fewer cuts': p => { const [a, b] = nums(p); return twoPizzas(a, b); },
  'a unit fraction smaller than a given one': p => unitBars([nums(p)[1]]),
  'fix a unit-fraction mistake': p => { const ns = p.match(/1\/(\d+)/g).map(s => +s.slice(2)); return unitBars([ns[0], ns[1]]); },
  'who ate more': p => { const ns = p.match(/1\/(\d+)/g).map(s => +s.slice(2)); return unitBars(ns, ['Kai', 'Mia']); },
  'compare same-denominator fractions': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? sameBars(+m[0][2], [+m[0][1], +m[1][1]]) : ''; },
  'biggest with same denominator': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return sameBars(+m[0][2], m.map(x => +x[1])); },
  'numerator to make a bigger fraction': p => { const m = p.match(/(\d+)\/(\d+)/); return sameBars(+m[2], [null, +m[1]]); },
  'how many more parts': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return sameBars(+m[0][2], [+m[0][1], +m[1][1]]); },
  'same fraction, different wholes': p => { const m = p.match(/(\d+)\/(\d+)/); return twoWholes(+m[2], +m[1]); },
  'fix a same-denominator mistake': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return sameBars(+m[0][2], [+m[0][1], +m[1][1]]); },
  'order four fractions': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return sameBars(+m[0][2], m.map(x => +x[1])); },
  'missing numerator in an equivalent fraction': p => { const m = p.match(/(\d+)\/(\d+) = □\/(\d+)/); return m && eqBars(+m[1], +m[2], +m[3]); },
  'missing denominator in an equivalent fraction': p => { const m = p.match(/(\d+)\/(\d+) = 1\/□/); return m && svg(strip(+m[2], +m[1], [], 40, 60, `${m[1]}/${m[2]}`) + rect(60, 130, 520 * m[1] / m[2], 60, LEMON, INK) + rect(60 + 520 * m[1] / m[2], 130, 520 - 520 * m[1] / m[2], 60, PAPER, INK) + text(50, 168, '1/?', 22, INK, 'text-anchor="end"') + note('the same shaded length as one bigger part'), `A strip of ${m[2]} parts with ${m[1]} shaded, and the same length as one part of a bigger cut`); },
  'spot the fraction that is not equivalent': p => { const m = p.match(/(\d+)\/(\d+)/); return stripPic(+m[2], +m[1], [], `${m[1]}/${m[2]}`); },
  'cut parts again': p => { const [d, n, c] = nums(p); return cutAgain(d, n, c); },
  'fix an equivalence mistake': p => { const m = p.match(/(\d+)\/(\d+) = □\/(\d+)/); return m && eqBars(+m[1], +m[2], +m[3]); },
  'equivalent fractions using equal wholes': p => { const m = p.match(/(\d+)\/(\d+)/); return m && !/line/.test(p) ? stripPic(+m[2], +m[1], [], `${m[1]}/${m[2]}`) : ''; },
  'same-denominator fraction addition': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? sameBars(+m[0][2], [+m[0][1], +m[1][1]]) : ''; },
  'same-denominator fraction subtraction': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? stripPic(+m[0][2], +m[0][1] - +m[1][1], [+m[1][1]], `${m[0][0]} m, ${m[1][0]} m cut off`) : ''; },
  'add three fractions within one whole': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 3 ? sameBars(+m[0][2], m.map(x => +x[1])) : ''; },
  'missing part of a fraction sum': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return sameBars(+m[0][2], [null, +m[0][1], +m[1][1]], ['?', `${m[0][0]}`, `${m[1][0]}`]); },
  'fraction left after eating twice': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return stripPic(+m[0][2], 0, [+m[0][1], +m[1][1]], 'lunch and tea'); },
  'make one whole': p => { const m = p.match(/(\d+)\/(\d+)/); return stripPic(+m[2], +m[1], [], 'fill the rest to make one whole'); },
  'fix a denominator mistake': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return sameBars(+m[0][2], [+m[0][1], +m[1][1]]); },
  'take away then add fractions': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return stripPic(+m[0][2], +m[0][1], [], `${m[0][0]} L to start`); },
  'three equal shares then the rest': p => { const m = p.match(/(\d+)\/(\d+)/); return stripPic(+m[2], 0, [+m[1], +m[1], +m[1]], 'three friends'); },
  'find a unit fraction of a quantity': p => { const f = fracOf(p); const [d, w] = f || [nums(p)[1], nums(p)[0]]; return d <= 12 ? groupsDiv(w, d) : ''; },
  'the rest after a unit fraction': p => { const f = fracOf(p); return f && groupsDiv(f[1], f[0], 'how many in one group? how many in the rest?'); },
  'unit fraction of money': p => { const f = fracOf(p); return f && groupsDiv(f[1], f[0], `$${f[1]} in ${f[0]} equal parts`); },
  'fix a fraction-of mistake': p => { const f = fracOf(p); return f && groupsDiv(f[1], f[0], 'share, do not take away'); },
  'add two unit-fraction amounts': p => { const [w, d, e] = nums(p); return barModel(w, ['?', '?', '?'], '').replace('the whole and its parts', `1/${d} walk, 1/${e} bus, the rest`); },
  'reconstruct the whole from a unit fraction': p => { const f = fracOf(p); return f && f[0] <= 10 ? wholeBar(f[0], f[1]) : ''; },
  'whole from a share eaten': p => { const f = fracOf(p); return f && wholeBar(f[0], f[1]); },
  'how much more to fill the whole': p => { const f = fracOf(p); return f && wholeBar(f[0], f[1]); },
  'choose the sentence for the whole': p => { const f = fracOf(p); return f && wholeBar(f[0], f[1]); },
  'fix a whole-from-part mistake': p => { const f = fracOf(p); return f && wholeBar(f[0], f[1]); },
  'rebuild then find another share': p => { const f = fracOf(p); return f && wholeBar(f[0], f[1]); },
  // money
  'make values with NZ coins': p => { const [n, o] = nums(p); return coinsPic([...Array(n).fill(200), ...Array(o).fill(100)]); },
  'fewest coins for an amount': p => coinsPic([50, 20, 10], `make ${nums(p)[0]} cents — which coins, how many?`),
  'coins that make a dollar': p => { const [c, d] = nums(p); return coinsPic([c], `how many of these make $${d}?`); },
  'total of mixed coins in cents': p => { const [a, b, c] = nums(p); return coinsPic([...Array(a).fill(200), ...Array(b).fill(100), ...Array(c).fill(50)]); },
  'compare two piles of coins': p => { const m = [...p.matchAll(/(\d+) (\$\d|\d+c) coins?/g)]; const v = s => s.startsWith('$') ? +s.slice(1) * 100 : +s.slice(0, -1); const pile = (i) => Array(+m[i][1]).fill(v(m[i][2])); return m.length >= 3 ? coinsPic([...pile(0), 0, ...pile(1), ...pile(2)].filter(Boolean), 'two piles') : ''; },
  'swap a note for coins or notes': p => { const [n, c] = nums(p); return svg(noteAt(120, 110, n) + arrow(200, 110, 280, 110, CORAL, 5) + (c <= 2 ? coinAt(330, 110, c * 100, 1.2) : noteAt(350, 110, c)) + text(430, 118, '× ?', 34, FERN) , `A $${n} note swapped for $${c} pieces`); },
  'add two mixed amounts in cents': p => { const [a, ac, b, bc] = nums(p); return svg(tag(170, 90, `$${a} and ${ac}c`, LEMON, 24) + text(320, 100, '+', 44, CORAL, mid) + tag(470, 90, `$${b} and ${bc}c`, SKY, 24) + note('change both to cents first', 170), `$${a} and ${ac} cents plus $${b} and ${bc} cents`); },
  'money change in dollars': p => { const [c, pd] = nums(p); return barModel(pd, [c, '?'], '$'); },
  'change from several notes': p => { const m = p.match(/costs \$(\d+)\. You pay with (\w+) \$(\d+) note/); if (!m) return ''; const c = +m[1], n = words[m[2]] || +m[2], nt = +m[3]; return svg(Array.from({ length: n }, (_, i) => noteAt(130 + i * 120, 90, nt)).join('') + tag(450, 90, `$${c}`, CORAL, 28) + text(450, 130, 'price', 20, CORAL, mid) + note('change = paid − price'), `${n} notes of $${nt} to pay $${c}`); },
  'cost from the change': p => { const [pd, ch] = nums(p); return barModel(pd, ['?', ch], '$'); },
  'change from two dollars': p => { const [a, b] = nums(p); return barModel(200, [a, b, '?'], 'c'); },
  'two-step cost and change': p => { const [a, b, pd] = nums(p); return barModel(pd * 100, [a, b, '?'], 'c'); },
  'multiply then find change': p => { const [n, pr] = nums(p); return groupsDots(n, 1, `${n} buns at ${pr}c each, paid with $2`); },
  'check the change': p => { const [pd, c] = nums(p); return barModel(pd, [c, '?'], '$'); },
  'change from a mix of notes': p => { const [a, b, n1, n2] = nums(p); return barModel(n1 + (n2 || 0), [a, b, '?'], '$'); },
  // algebra
  'open addition equation': p => { const m = p.match(/(\d+) \+ __ = (\d+)/); return m && barModel(+m[2], [+m[1], '?']); },
  'open subtraction equation': p => { const m = p.match(/(\d+) − __ = (\d+)/); return m && barModel(+m[1], ['?', +m[2]]); },
  'open division equation': p => { const [d, n] = nums(p); return groupsDots(d, n, `${d} groups of ${n} — how many were shared?`); },
  'missing start of a subtraction': p => { const [b, c] = nums(p); return hop('?', ['−' + b], c); },
  'balance two additions': p => { const [a, b, c] = nums(p); return balance(`${a} + ${b}`, `? + ${c}`); },
  'balance a product and a sum': p => { const [a, b, c] = nums(p); return balance(`${a} × ${b}`, `? + ${c}`); },
  'choose the operation': p => { const [a, b, r] = nums(p); return svg(card(110, 60, 100, 100, a, PAPER, 44) + card(230, 60, 80, 100, '?', LEMON, 50) + card(330, 60, 100, 100, b, PAPER, 44) + text(470, 125, '=', 50, INK, mid) + card(510, 60, 100, 100, r, PAPER, 44), `${a} ? ${b} = ${r}`); },
  'two equal unknowns': p => barModel(nums(p)[0], ['?', '?']),
  'spot a number not in the pattern': p => { const [s, st] = nums(p); return numberLine({ from: /subtract/.test(p) ? s - 6 * st : s, to: /subtract/.test(p) ? s : s + 6 * st, tick: st, labels: false, start: s, step: /subtract/.test(p) ? -st : st, jumps: 3, note: 'which number is skipped?', alt: `A number line from ${s} in steps of ${st}` }); },
  'the nth number from a rule': p => { const m = p.match(/start at (\d+), (add|subtract) (\d+) each time\. What is the (\d+)/); if (!m) return ''; const s = +m[1], st = +m[3] * (m[2] === 'add' ? 1 : -1), n = +m[4]; return numberLine({ from: st > 0 ? s : s + st * n, to: st > 0 ? s + st * n : s, tick: Math.abs(st), labels: false, start: s, step: st, jumps: n - 1, note: `${n - 1} jumps`, alt: `A number line from ${s} with ${n - 1} jumps of ${st}` }); },
  'generate from a rule': p => { const m = p.match(/starts at (\d+)\. (Add|Subtract) (\d+)/); if (!m) return ''; const s = +m[1], st = +m[3] * (m[2] === 'Add' ? 1 : -1); return cardsRow([s, '?', '?', '?', '?'], `${m[2].toLowerCase()} ${m[3]} each time`); },
  'when two patterns meet': p => { const [a, st, b] = nums(p); return svg(text(40, 70, 'A', 26, INK) + [a, '?', '?', '?'].map((v, i) => card(80 + i * 125, 40, 110, 60, v, i ? PAPER : LEMON, 28)).join('') + text(40, 160, 'B', 26, INK) + [b, '?', '?', '?'].map((v, i) => card(80 + i * 125, 130, 110, 60, v, i ? PAPER : SKY, 28)).join(''), `Pattern A from ${a} adding ${st}; pattern B from ${b} subtracting ${st}`); },
  'work backwards to the start': p => { const m = p.match(/The (\d+)\w+ number is (\d+)/); return m && cardsRow([...Array(+m[1] - 1).fill('?'), m[2]], 'go back to the first number'); },
  // measurement
  'lengths end to end': p => endToEnd(nums(p).slice(0, 2)),
  'compare measured lengths': p => barsOf(nums(p).slice(0, 2), 'cm'),
  'metres and centimetres to centimetres': p => { const [m, c] = nums(p); return endToEnd([...Array(m).fill(100), c]); },
  'cut from a metre': p => barModel(100, [nums(p)[1] ?? nums(p)[0], '?'], ' cm'),
  'longest minus shortest': p => barsOf(nums(p).slice(0, 3), 'cm'),
  'measuring from the wrong start': p => { const [g, r] = nums(p); return rulerPic(g, r); },
  'repeat a length': p => { const [d, ...rest] = nums(p); return endToEnd(Array(/twice/.test(p) ? 4 : 2).fill(d), 'm'); },
  'millilitres to fill a litre': p => jug(nums(p)[1], 1000),
  'read labelled capacity markings': null,
  'kilograms and grams to grams': p => { const [kg, g] = nums(p); return endToEnd([...Array(kg).fill(1000), g], 'g'); },
  'total mass of equal items': p => { const [m, n] = nums(p); return groupsAdd(Array(n).fill(m), apple); },
  'compare total capacities': p => { const [n, ml, l] = nums(p); return bottles(n, ml, l); },
  'how many cups from a jug': p => { const [c, l] = nums(p); return jug(l * 1000, l * 1000, `${c} mL cups?`); },
  'compare masses in grams': p => barsOf(nums(p).slice(0, 2), 'g'),
  'square perimeter': p => { const m = p.match(/sides of (\d+) (\w+)/); return m && rectangle({ l: +m[1], w: +m[1], unit: m[2], ratio: [1, 1] }); },
  'missing side from perimeter': p => { const m = p.match(/perimeter of (\d+) (\w+)\. Its length is (\d+)/); return m && rectangle({ l: +m[3], w: '?', unit: m[2], ratio: [5, 3], around: `${m[1]} ${m[2]}` }); },
  'polygon perimeter': p => { const m = [...p.matchAll(/(\d+) (cm|m|mm)/g)]; return m.length >= 3 && polygon(m.map(x => +x[1]), m[0][2]); },
  'sum polygon sides': p => { const m = [...p.matchAll(/(\d+) (cm|m|mm)/g)]; return m.length >= 3 && polygon(m.map(x => +x[1]), m[0][2]); },
  'side from a regular perimeter': p => { const m = p.match(/(?:regular|equilateral) (\w+) has a perimeter of (\d+) (\w+)/); return m && SIDES[m[1]] && svg(regular(SIDES[m[1]], '?', `${m[2]} ${m[3]}`), `A regular ${m[1]} with one side marked ?`); },
  'side of a regular polygon': p => { const m = p.match(/(?:regular|equilateral) (\w+) has a perimeter of (\d+) (\w+)/); return m && SIDES[m[1]] && svg(regular(SIDES[m[1]], '?', `${m[2]} ${m[3]}`), `A regular ${m[1]} with one side marked ?`); },
  'perimeter of joined shapes': p => { const m = p.match(/squares with (\d+) (\w+)/); return m && joined(+m[1], m[2]); },
  'perimeter minus a gap': p => { const m = p.match(/(\d+) m long and (\d+) m wide.*?(\d+) m gate/); return m && rectangle({ l: +m[1], w: +m[2], unit: 'm', gap: +m[3] }); },
  'posts around a perimeter': p => { const m = p.match(/every (\d+) m around a (\d+) m by (\d+) m/); return m && rectangle({ l: +m[2], w: +m[3], unit: 'm', posts: +m[1] }); },
  'perimeter with a length-width relationship': p => { const m = p.match(/perimeter of (\d+) (\w+)\. Its length is (\d+) \w+ more than its width/); return m && rectangle({ l: `w + ${m[3]}`, w: 'w', unit: m[2], ratio: [5, 3], around: `${m[1]} ${m[2]}` }); },
  'perimeter with mixed units': p => { const m = p.match(/(\d+) m long and (\d+) cm wide/); return m && rectangle({ l: `${m[1]} m`, w: `${m[2]} cm`, ratio: [+m[1] * 100, +m[2]] }); },
  'perimeter versus area mistake': rectBy, 'count every side': rectBy,
  'compare perimeters': (p, item) => { const m = [...(item.choices || []).join(' ').matchAll(/(\d+) (\w+) by (\d+)/g)]; return m.length === 2 && twoRects([+m[0][1], +m[0][3]], [+m[1][1], +m[1][3]], m[0][2]); },
  'compare sides from equal perimeters': p => { const m = p.match(/regular (\w+) and a (\w+) both have a perimeter of (\d+) (\w+)/); return m && SIDES[m[1]] && SIDES[m[2]] && svg(regular(SIDES[m[1]], '?', '', 160) + regular(SIDES[m[2]], '?', '', 400) + text(280, 238, `both ${m[3]} ${m[4]} all the way around`, 22, CORAL, mid), `A ${m[1]} and a ${m[2]} with the same perimeter`, 250); },
  'perimeter of an L-shape': p => { const m = p.match(/A (\d+) (\w+) square is cut out of one corner of a (\d+) \w+ by (\d+) \w+/); return m && rectangle({ l: +m[3], w: +m[4], unit: m[2], cut: +m[1], alt: `A ${m[3]} by ${m[4]} rectangle with a ${m[1]} square cut from a corner` }); },
  'rectangle area using equal squares': p => { const m = p.match(/(\d+) rows of (\d+)/); return m && areaGrid(+m[1], +m[2]); },
  'area after removing a row': p => { const [r, c] = nums(p); return areaGrid(r, c, { cutRow: true }); },
  'area of a square': p => { const s = nums(p)[0]; return areaGrid(s, s); },
  'compare two areas': p => { const [a, b, c, d] = nums(p); return twoRects([b, a], [d, c], ''); },
  'area is not perimeter': p => { const [l, w] = nums(p); return areaGrid(w, l, { red: true, caption: 'count the squares inside, not the edge' }); },
  'area of two joined rectangles': p => { const [a, b, c, d] = nums(p); return lGrid(a, b, c, d); },
  'row length from area': p => { const [ar, r] = nums(p); return areaGrid(r, Math.min(6, Math.round(ar / r)), { hideCols: true, caption: `${ar} squares in ${r} rows` }); },
  'direction and size of turns': p => { const d = p.match(/points (up|right|down|left)/); return d && compassPic(DIRS[['up', 'right', 'down', 'left'].indexOf(d[1])], p.match(/Turn it (.*?) turn (\w+)/)?.slice(1).join(' turn ')); },
  'two quarter turns': p => compassPic(dirIn(p), 'two quarter turns ↻'),
  'name the turn from start and finish': p => { const m = p.match(/from (\w+) to (\w+)/); return m && svg(compassPicInner(m[1], 170) + compassPicInner(m[2], 470) + text(320, 130, '→', 40, INK, mid), `Arrows pointing ${m[1]} and then ${m[2]}`, 250); },
  'quarter turn on a clock face': p => { const n = nums(p)[0]; return clockPic(n === 12 ? 0 : n, 0, 'a quarter turn ↺'); },
  'count quarter turns': () => svg(blob(200, 120, 85, 85, 0, PAPER, INK, 28) + line(200, 35, 200, 205, INK, 3) + line(115, 120, 285, 120, INK, 3) + text(240, 90, '¼', 30, CORAL, mid) + text(240, 165, '¼', 30, CORAL, mid) + text(160, 165, '¼', 30, CORAL, mid) + text(160, 90, '¼', 30, CORAL, mid) + text(440, 125, 'four quarters go round once', 22, FERN, mid), 'A circle cut into four quarter turns'),
  'two turns in a row': p => compassPic(dirIn(p), '¼ turn ↻, then ½ turn ↺'),
  'fix a turn description': p => { const m = p.match(/from (\w+) to (\w+)/); return m && svg(compassPicInner(m[1], 170) + compassPicInner(m[2], 470) + text(320, 130, '→', 40, INK, mid), `Arrows pointing ${m[1]} and then ${m[2]}`, 250); },
  'face after a half turn': p => compassPic(dirIn(p), 'half turn'),
  'direction after a right turn': p => compassPic(dirIn(p), 'then ¼ turn right'),
  'left turn from a facing': p => compassPic(dirIn(p), '¼ turn left'),
  'two right turns': p => compassPic(dirIn(p), 'right, then right again'),
  'follow a longer route': p => compassPic(dirIn(p), 'two ¼ turns clockwise'),
  'relative direction and route instructions': p => { const m = p.match(/[Ff]aces? (north|east|south|west)/); return m && compassPic(m[1][0].toUpperCase() + m[1].slice(1), (p.match(/Turn (.*?) turn (\w+)|turns (.*?) turn (\w+)/) || []).slice(1).filter(Boolean).join(' turn ')); },
  'reverse a route': p => { const m = p.match(/walk (\w+) (\d+) steps?, then (\w+) (\d+) step/); return m && pathPic(m[1], +m[2], m[3], +m[4]); },
  'opposite direction': p => { const m = p.match(/shop is (\w+) of home/); return m && mapLine(['home', 'shop'], [3], m[1]); },
  'add distances along one direction': p => { const [a, b] = nums(p); return mapLine(['lake', 'hut', 'tent'], [a, b], 'north'); },
  'left and right from north': () => compassPic('North', 'you face north'),
  'net distance after going and returning': p => { const m = p.match(/(\d+) squares (\w+), then (\d+) squares (\w+)/); return m && pathPic(m[2][0].toUpperCase() + m[2].slice(1), +m[1], m[4][0].toUpperCase() + m[4].slice(1), +m[3]); },
  'the four directions on a north-up map': () => svg(rect(170, 30, 300, 180, MINT, INK) + text(320, 24, 'N', 26, FERN, mid) + text(320, 120, '?', 44, FERN, mid) + text(150, 125, '?', 30, FERN, mid) + text(490, 125, '?', 30, FERN, mid) + text(320, 235, '?', 30, FERN, mid), 'A map with north at the top and question marks on the other sides', 250),
  'combine two map moves': p => { const [a, b] = nums(p); return mapLine(['home', 'tree', 'pond'], [a, b], 'east'); },
  'locate places with cardinal directions': null,
  'distance between mirror partners': p => mirrorPic(nums(p)[0]),
  'equal distance across a symmetry line': null,
  'complete a reflected pattern': p => mirrorPic(nums(p)[0]),
  'double the half': p => mirrorPic(2, nums(p)[0]),
  'count lines of symmetry': p => { const n = /square/.test(p) && !/not a square/.test(p) ? 4 : /triangle/.test(p) ? 3 : /hexagon/.test(p) ? 6 : 0; return n ? svg(regular(n, '', '', 320), `A regular ${n}-sided shape`) : svg(rect(170, 60, 300, 130, MINT, CORAL) + note('a rectangle that is not a square'), 'A long rectangle'); },
  'symmetry in letters': p => { const m = p.match(/: (\w), (\w) or (\w)\?/); return m && svg(m.slice(1, 4).map((l, i) => text(140 + i * 180, 150, l, 110, INK, mid) + dash(140 + i * 180, 40, 140 + i * 180, 190, FERN, 3)).join(''), `The letters ${m.slice(1, 4).join(', ')} with a dashed line down each`); },
  'diagonals and symmetry': () => svg(rect(140, 50, 360, 150, LEMON, INK) + dash(140, 50, 500, 200, CORAL, 4) + note('fold along the dashed line?'), 'A long rectangle with a dashed diagonal'),
  'corners and sides match': p => svg(regular(Math.min(10, nums(p)[0]), '', '', 320, true), `A ${nums(p)[0]}-sided shape with its corners marked`),
  'compare side counts': p => { const m = p.match(/an? (\w+) or an? (\w+)\?/); return m && SIDES[m[1]] && SIDES[m[2]] ? svg(regular(SIDES[m[1]], '', '', 170) + regular(SIDES[m[2]], '', '', 470) + text(170, 225, m[1], 22, INK, mid) + text(470, 225, m[2], 22, INK, mid), `A ${m[1]} and a ${m[2]}`, 240) : ''; },
  'fix a polygon name': p => svg(regular(nums(p)[0], '', '', 320, true), `A ${nums(p)[0]}-sided shape`),
  'connect named polygons and corners': p => { const m = p.match(/regular (\w+)\./); return m && SIDES[m[1]] ? svg(regular(SIDES[m[1]], '', '', 320, true), `A regular ${m[1]}`) : ''; },
  'minute hand number to minutes': p => clockPic(0, nums(p)[0] * 5),
  'minutes to as digital': p => { const [m, h] = nums(p); return clockPic(h - 1 + (h === 1 ? 12 : 0), 60 - m); },
  'minutes to the hour': clockFromPrompt, 'minutes to the next hour': clockFromPrompt, 'digital time and minutes past': clockFromPrompt, 'past or to': clockFromPrompt,
  'hour hand between numbers': p => clockPic(nums(p)[0], 30),
  'cross the hour': p => { const [h, m, add] = nums(p); return clockPic(h, m, `+ ${add} minutes`); },
  'end time from a start and a length': p => { const [h, m, d] = nums(p); return clockPic(h, m, `+ ${d} minutes`); },
  'start time from an end': p => { const [d, h, m] = nums(p); return clockPic(h, m, `− ${d} minutes = start?`); },
  'elapsed minutes': p => { const m = [...p.matchAll(/(\d{1,2}):(\d{2})/g)]; return m.length >= 2 ? svg(clockFace(+m[0][1], +m[0][2], 150, 120, 80) + arrow(250, 120, 390, 120, CORAL, 5) + clockFace(+m[1][1], +m[1][2], 490, 120, 80) + text(320, 100, '? minutes', 22, CORAL, mid), `Clocks showing ${m[0][0]} and ${m[1][0]}`, 230) : ''; },
  'hours and minutes to minutes': p => { const [h, m] = nums(p); return endToEnd([...Array(h).fill(60), m], 'min'); },
  'repeat a duration': p => { const [m, d] = nums(p); return groupsAdd(Array(Math.min(d, 7)).fill(m), dot); },
  'day of the week after some days': p => { const m = p.match(/Today is (\w+)\. What day will it be in (\d+)/); const D = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; return m && weekStrip(D.indexOf(m[1]), +m[2]); },
  'weeks and days to days': p => { const [w, d] = nums(p); return endToEnd([...Array(w).fill(7), d], 'days'); },
  'count days including both ends': p => { const [a, b] = nums(p); return numberLine({ from: a, to: b, tick: 1, labels: false, note: 'count every day, including both ends', alt: `Days ${a} to ${b}` }); },
  // statistics
  'count the categories': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'count a repeated value': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'sort collected categorical responses': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'check every reply is recorded': p => { const [n, a, b, c] = nums(p); return tally([a, b, c], ['walk', 'bus', 'ride'], n); },
  'a reply that does not fit the question': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'add a response to a bar': p => { const [w, b, bi] = nums(p); return barChart(['Walk', 'Bus', 'Bike'], [w, b, bi], { caption: '+1 bus' }); },
  'total dots': p => { const ns = nums(p); return dotPlot(['0', '1', '2'], [ns[0], ns[2], ns[4]]); },
  'the most common value': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'bars should add to the total': p => { const [n, a, b, c] = nums(p); return barChart(['A', 'B', 'C'], [a, b, c], { title: `${n} asked` }); },
  'read a scale in twos': p => { const [st, lines] = nums(p); return barChart(['Walk', 'Bus', 'Bike'], [lines * st, Math.max(st, lines * st - 2 * st), st], { step: st, noValues: true, caption: `scale goes up in ${st}s` }); },
  'bar height is the count, not the value': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'translate numerical data to bar frequency': p => { const mm = p.match(/are ([\d, ]+)\./); return mm && replyCards(mm[1].split(/,\s*/)); },
  'everyone except one category': p => { const [a, pr, pl] = nums(p); return barChart(['Apple', 'Pear', 'Plum'], [a, pr, pl]); },
  'compare one with the rest': p => { const [a, pr, pl] = nums(p); return barChart(['Apple', 'Pear', 'Plum'], [a, pr, pl]); },
  'at least one': p => { const ns = nums(p); return barChart(['0 teeth', '1 tooth', '2 teeth'], [ns[0], ns[2], ns[4]]); },
  'total of a measured quantity': p => { const ns = nums(p); return barChart(['1 tooth', '2 teeth', '3 teeth'], [ns[0], ns[2], ns[4]], { caption: 'bars count children' }); },
  'missing category from the total': p => { const [n, a, pr] = nums(p); return barChart(['Apple', 'Pear', 'Plum'], [a, pr, null], { title: `${n} voted` }); },
  'identify most or least frequent category in context': null,
};
// Helpers used by rules above (declared after the table so the table stays readable).
function compassPicInner(start, cx) { const cy = 120, r = 70; let out = blob(cx, cy, r, r, 0, PAPER, INK, 28); DIRS.forEach((d, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; out += text(cx + (r + 22) * Math.cos(a), cy + (r + 22) * Math.sin(a) + 8, d[0], 24, FERN, mid); }); const i = DIRS.indexOf(start), a = -Math.PI / 2 + i * Math.PI / 2; return out + arrow(cx, cy, cx + (r - 16) * Math.cos(a), cy + (r - 16) * Math.sin(a), CORAL, 7) + blob(cx, cy, 7, 7, 0, INK, INK); }
function twoArraysPic(a, b) { const sp = 22; let out = ''; for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) out += blob(70 + j * sp, 50 + i * sp, 7, 7, 0, SKY, INK); for (let i = 0; i < b; i++) for (let j = 0; j < a; j++) out += blob(380 + j * sp, 50 + i * sp, 7, 7, 0, CORAL, INK); return svg(out + text(70 + b * sp / 2, 50 + a * sp + 24, `Mia: ${a} rows of ${b}`, 20, INK, mid) + text(380 + a * sp / 2, 50 + b * sp + 24, `Kai: ${b} rows of ${a}`, 20, INK, mid), `${a} rows of ${b} beside ${b} rows of ${a}`, Math.max(220, 50 + Math.max(a, b) * sp + 50)); }

// ---- Year 4 (2026-11-06) ---------------------------------------------------------------------------
// Year 4 questions use bigger numbers, decimals and their own wording, so they get their own table; a Year 4
// skill that is not listed here falls back to the Year 3 rule of the same name.
const END = 'text-anchor="end"';
const fx = v => (Number.isInteger(v) ? String(v) : v.toFixed(1));
// Two numbers written in columns, ones under ones, with the answer still to find.
const columnSum = (a, b, sign = '+') => { const A = String(a), B = String(b), n = Math.max(A.length, B.length), cw = 30, x1 = 330 + n * cw / 2; let out = text(x1, 86, A, 44, INK, END) + text(x1, 140, B, 44, INK, END) + text(x1 - n * cw - 16, 140, sign, 44, CORAL, END) + line(x1 - n * cw - 46, 158, x1 + 10, 158, INK, 4) + q(x1 - n * cw / 2, 206, 44) + text(130, 112, 'ones under ones', 20, FERN, mid); return svg(out, `${a} ${sign} ${b} written in columns`, 230); };
// Cards with a place-value label above each.
const placeCards = (labels, vals) => svg(labels.map((l, i) => text(140 + i * 120, 50, l, 24, FERN, mid) + card(95 + i * 120, 70, 90, 100, vals[i], PAL[i % 4], 44)).join(''), `Place cards: ${labels.map((l, i) => `${vals[i]} ${l}`).join(', ')}`);
// Two things to compare, with a question mark between them.
const versus = (l, r, caption = 'which is bigger?') => svg(card(40, 60, 250, 100, l, PAPER, 28) + q(320, 125, 56) + card(350, 60, 250, 100, r, PAPER, 28) + note(caption), `${l} compared with ${r}`);
// A three-digit number split into hundreds, tens and ones, each multiplied by f.
const partition3 = (a, f) => { const parts = [[Math.floor(a / 100) * 100, LEMON], [Math.floor(a / 10) % 10 * 10, SKY], [a % 10, MINT]].filter(x => x[0]), k = 440 / a; let x = 70, out = text(50, 112, f, 30, INK, END); parts.forEach(([v, c]) => { const w = Math.max(60, v * k); out += rect(x, 70, w, 80, c, INK) + text(x + w / 2, 60, v, 22, INK, mid) + text(x + w / 2, 118, `${f} × ${v}`, 20, INK, mid); x += w + 8; }); return svg(out + note(`${a} is ${parts.map(x => x[0]).join(' and ')}`), `${a} split into ${parts.map(x => x[0]).join(', ')}, each multiplied by ${f}`); };
// g groups, each labelled with what it holds (a number or '$4'), plus an optional extra tag.
const labelledGroups = (g, label, extra = '') => { const n = Math.min(g, 10), sp = n > 5 ? 100 : 112; let out = ''; for (let i = 0; i < n; i++) { const cx = 70 + (i % 5) * sp, cy = 80 + Math.floor(i / 5) * 90; out += blob(cx, cy, 44, 32, 0, MINT, INK) + text(cx, cy + 9, label, 24, INK, mid); } if (g > 10) out += text(600, 90, '…', 40, INK, mid); if (extra) out += tag(560, 60, extra, LEMON, 22); return svg(out + note(`${g} groups of ${label}`), `${g} groups of ${label}${extra ? ', and ' + extra : ''}`); };
// A total split into groups of a known size: how many groups?
const groupsOfKnown = (total, size, unit = '') => svg(tag(100, 60, `${total}${unit} in all`) + [0, 1, 2].map(i => card(220 + i * 90, 80, 80, 60, `${size}${unit}`, SKY, 24)).join('') + text(510, 120, '…', 36, INK, mid) + text(380, 180, '? groups', 26, FERN, mid), `${total} split into groups of ${size}`);
// Splitting a dividend into two easy parts.
const splitDiv = (n, big, small, d) => svg(card(60, 70, 130, 90, n, PAPER, 36) + arrow(200, 95, 270, 70, CORAL, 4) + arrow(200, 135, 270, 160, CORAL, 4) + card(280, 40, 120, 60, big, LEMON, 30) + card(280, 130, 120, 60, small, SKY, 30) + text(440, 80, `÷ ${d} = ?`, 26, INK) + text(440, 170, `÷ ${d} = ?`, 26, INK) + note('add the two shares'), `${n} split into ${big} and ${small}, each divided by ${d}`);
// Tenths: full strips of ten and a part strip.
const tenthsPic = (n) => { const w = Math.floor(n / 10), r = n % 10; let out = '', y = 30; for (let i = 0; i < Math.min(w, 3); i++) { out += strip(10, 10, [], y, 34, '1'); y += 44; } if (w > 3) out += text(320, y + 10, '…', 30, INK, mid), y += 30; out += strip(10, r, [], y, 48, `${r}/10`); return svg(out + note(`${n} tenths: ${w} whole${w === 1 ? '' : 's'} and ${r} tenths`, y + 80), `${n} tenths shown as ${w} full strips and ${r} parts of ten`, y + 95); };
// Strips with different numbers of parts: [[d, shaded, label], …].
const multiStrips = list => { const n = list.length, h = Math.min(56, 160 / n), gap = (190 - n * h) / Math.max(1, n - 1); return svg(list.map(([d, s, l], i) => strip(d, s, [], 20 + i * (h + gap), h, l ?? `${s}/${d}`)).join(''), `Strips: ${list.map(([d, s]) => `${s} of ${d} parts`).join('; ')}`); };
// A mixed number: w full strips and one strip with n of d shaded.
const mixedStrips = (w, n, d) => { let out = '', y = 30; for (let i = 0; i < Math.min(w, 3); i++) { out += strip(d, d, [], y, 34, '1'); y += 44; } if (w > 3) out += text(320, y + 10, '…', 30, INK, mid), y += 30; out += strip(d, n, [], y, 48, n ? `${n}/${d}` : ''); return svg(out + note(`each whole is ${d} parts`, y + 80), `${w} whole strips and ${n} of ${d} parts`, y + 95); };
// A little table: rows of [label, value, value…]; '?' marks what is asked.
const recipeTable = (rows, title = '') => { const cols = Math.max(...rows.map(r => r.length)), cw = Math.min(150, 520 / cols); let out = title ? text(320, 36, title, 22, FERN, mid) : ''; rows.forEach((r, i) => r.forEach((v, j) => { out += card(60 + j * cw, 50 + i * 56, cw - 8, 48, v, j ? (String(v).includes('?') ? PAPER : LEMON) : MINT, 24); })); return svg(out, `A table: ${rows.map(r => r.join(' ')).join('; ')}`, Math.max(220, 70 + rows.length * 56)); };
// A thermometer with a mark every 2 °C.
const thermoAt = (x, t, max = 40) => { const y0 = 30, h = 160, k = h / max, lvl = y0 + h - t * k; let out = rect(x - 14, y0, 28, h, PAPER, INK) + rect(x - 10, lvl, 20, y0 + h - lvl, CORAL, 'none') + blob(x, y0 + h + 10, 22, 22, 0, CORAL, INK); for (let v = 0; v <= max; v += 2) { const y = y0 + h - v * k; out += line(x + 14, y, x + (v % 10 ? 24 : 32), y, INK, 2) + (v % 10 ? '' : text(x + 40, y + 6, v, 16, INK)); } return out; };
const thermo = (t, caption = '') => svg(thermoAt(200, t) + (caption ? text(440, 110, caption, 24, FERN, mid) : '') + text(200, 36, '°C', 18, INK, END), `A thermometer showing ${t} degrees`, 235);
const thermos = (ts, names) => svg(ts.map((t, i) => thermoAt(130 + i * 180, t) + text(130 + i * 180, 232, names ? names[i] : `${t} °C`, 18, INK, mid)).join(''), `Thermometers showing ${ts.join(', ')} degrees`, 240);
// Whole squares and half squares (triangles) on a grid.
const halfSquares = (w, h) => { const s = 44; let out = ''; for (let i = 0; i < w; i++) out += rect(60 + (i % 6) * s, 40 + Math.floor(i / 6) * s, s, s, LEMON, INK); const y0 = 40 + Math.ceil(w / 6) * s + 14; if (typeof h === 'number') for (let i = 0; i < h; i++) { const x = 60 + (i % 8) * s, y = y0 + Math.floor(i / 8) * s; out += shape([[x, y + s], [x + s, y + s], [x, y]], SKY, INK, 3); } else out += text(90, y0 + 30, '? half squares', 24, FERN); return svg(out + text(560, 70, `${w} whole`, 22, INK, mid) + text(560, 100, `${typeof h === 'number' ? h : '?'} half`, 22, INK, mid), `${w} whole squares and ${h} half squares`, Math.max(220, y0 + (typeof h === 'number' ? Math.ceil(h / 8) : 1) * s + 20)); };
// A rectangle of squares cut in half by a diagonal.
const rectDiag = (a, b) => { const sp = Math.min(40, 400 / b, 150 / a), x0 = 120, y0 = 35; let out = ''; for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) out += rect(x0 + j * sp, y0 + i * sp, sp, sp, PAPER, INK); out += shape([[x0, y0 + a * sp], [x0 + b * sp, y0 + a * sp], [x0 + b * sp, y0]], SKY, 'none', 0) + line(x0, y0 + a * sp, x0 + b * sp, y0, CORAL, 5); return svg(out + text(x0 + b * sp / 2, y0 - 10, `${b}`, 22, INK, mid) + text(x0 - 16, y0 + a * sp / 2 + 8, `${a}`, 22, INK, END) + note('the triangle is half the rectangle'), `A ${a} by ${b} rectangle of squares with a diagonal`); };
// Layers of cubes drawn as stacked slabs.
const layersPic = (n, per, caption = '') => { const k = typeof n === 'number' ? Math.min(n, 6) : 3; let out = ''; for (let i = 0; i < k; i++) { const y = 170 - i * 26; out += shape([[150, y], [430, y], [470, y - 18], [190, y - 18]], i % 2 ? SKY : LEMON, INK, 3) + rect(150, y, 280, 22, i % 2 ? SKY : LEMON, INK) + text(290, y + 17, `${per} cubes`, 18, INK, mid); } if (typeof n !== 'number') out += text(520, 120, '? layers', 24, FERN, mid); else out += text(520, 120, `${n} layer${n === 1 ? '' : 's'}`, 24, INK, mid); return svg(out + (caption ? note(caption) : ''), `${n} layers of ${per} cubes`); };
// An angle drawn next to a right angle.
const anglePic = deg => { const cx = 170, cy = 150, r = 90, a = -deg * Math.PI / 180, big = deg > 180 ? 1 : 0; let out = line(cx, cy, cx + r + 20, cy, INK, 4) + line(cx, cy, cx + (r + 20) * Math.cos(a), cy + (r + 20) * Math.sin(a), INK, 4) + `<path d="M${cx + 40} ${cy} A40 40 0 ${big} 0 ${cx + 40 * Math.cos(a)} ${cy + 40 * Math.sin(a)}" fill="none" stroke="${CORAL}" stroke-width="5"/>` + text(cx, 215, `${deg}°`, 24, CORAL, mid); out += line(450, 150, 560, 150, INK, 4) + line(450, 150, 450, 40, INK, 4) + rect(450, 126, 24, 24, 'none', FERN) + text(505, 215, 'a right angle', 22, FERN, mid); return svg(out, `An angle of ${deg} degrees beside a right angle`, 235); };
// A square whose area is known but not its sides.
const squareQ = area => svg(rect(220, 40, 160, 160, LEMON, INK) + text(300, 130, `${area} cm²`, 28, INK, mid) + text(300, 28, '? cm', 24, FERN, mid) + text(410, 125, '? cm', 24, FERN), `A square of area ${area}`, 230);
// A line between two decimals with a tick at every tenth.
const decLine = (a, b, mark) => { const x0 = 60, x1 = 580, y = 140, n = Math.round((b - a) * 10), k = (x1 - x0) / n; let out = line(x0 - 10, y, x1 + 10, y, INK, 5); for (let i = 0; i <= n; i++) out += line(x0 + i * k, y - (i % 5 ? 8 : 14), x0 + i * k, y + (i % 5 ? 8 : 14), INK, 3); out += text(x0, y + 44, fx(a), 24, INK, mid) + text(x1, y + 44, fx(b), 24, INK, mid); if (n % 2 === 0) out += text(x0 + n / 2 * k, y + 44, fx((a + b) / 2), 20, FERN, mid); if (mark != null) out += blob(x0 + (mark - a) * 10 * k, y - 30, 12, 12, 0, CORAL, INK) + text(x0 + (mark - a) * 10 * k, y - 50, fx(mark), 22, CORAL, mid); return svg(out + text(320, 60, 'one tenth each tick', 20, FERN, mid), `A number line from ${fx(a)} to ${fx(b)} in tenths${mark != null ? ` with ${fx(mark)} marked` : ''}`, 230); };
const dotPlotFrom = data => { const vals = [...new Set(data)].sort((x, y) => x - y); return dotPlot(vals.map(String), vals.map(v => data.filter(x => x === v).length)); };
const lenCm = s => { const m = s.match(/(\d+) m/), c = s.match(/(\d+) cm/); return (m ? +m[1] * 100 : 0) + (c ? +c[1] : 0); };
const coinWord = { 'ten-cent': 10, 'twenty-cent': 20, 'fifty-cent': 50, 'one-dollar': 100, 'two-dollar': 200 };
const coinsOf = p => [...p.matchAll(/(\d+) × (\$\d|\d+c)/g)].flatMap(m => Array(+m[1]).fill(m[2].startsWith('$') ? +m[2].slice(1) * 100 : +m[2].slice(0, -1)));
// A flat view of a cuboid: cols by rows squares, with a label.
const viewInner = ([c, r], label, cx) => { const sp = Math.min(30, 160 / Math.max(c, 1), 120 / Math.max(r, 1)), x0 = cx - c * sp / 2, y0 = 40; let out = ''; for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) out += rect(x0 + j * sp, y0 + i * sp, sp, sp, SKY, INK); return out + text(cx, y0 + r * sp + 30, label, 20, FERN, mid); };
const viewPic = (dims, label) => svg(viewInner(dims, label, 320), `A ${label}: ${dims[0]} squares across and ${dims[1]} down`);
const viewPair = (a, la, b, lb) => svg(viewInner(a, la, 200) + viewInner(b, lb, 440), `${la} view ${a[0]} by ${a[1]} and ${lb} view ${b[0]} by ${b[1]}`);
// A map grid with row letters and column numbers; mark = [rowIndex, col] puts a dot in one square.
const gridPic = (rows, cols, mark, caption = '', noNums = false) => { const sp = Math.min(40, 400 / cols, 150 / rows), x0 = 120, y0 = 30; let out = ''; for (let r = 0; r < rows; r++) { out += text(x0 - 16, y0 + r * sp + sp / 2 + 7, 'ABCDE'[r], 20, INK, END); for (let c = 0; c < cols; c++) out += rect(x0 + c * sp, y0 + r * sp, sp, sp, PAPER, INK); } if (!noNums) for (let c = 0; c < cols; c++) out += text(x0 + c * sp + sp / 2, y0 + rows * sp + 24, c + 1, 20, INK, mid); if (mark) out += blob(x0 + (mark[1] - 1) * sp + sp / 2, y0 + mark[0] * sp + sp / 2, sp * .3, sp * .3, 0, CORAL, INK); return svg(out + (caption ? text(480, 100, caption, 20, FERN, mid) : ''), `A map grid of ${rows} rows and ${cols} columns${mark ? ` with a dot in ${'ABCDE'[mark[0]]}${mark[1]}` : ''}`, Math.max(220, y0 + rows * sp + 45)); };
const RULES_Y4 = {
  // G05 map grids
  'grid reference after a move': p => { const m = p.match(/Start at ([A-D])(\d)\. Move (\d) squares to the right/); return m && gridPic(4, 5, ['ABCD'.indexOf(m[1]), +m[2]], `${m[3]} squares right →`); },
  'move rows on a grid': p => { const m = p.match(/Start at ([A-D])(\d)\. Move one row (up|down)/); return m && gridPic(4, 5, ['ABCD'.indexOf(m[1]), +m[2]], `one row ${m[3]} ${m[3] === 'up' ? '↑' : '↓'}`); },
  'count grid squares': p => { const m = p.match(/rows A to ([A-E]) and columns 1 to (\d)/); return m && gridPic('ABCDE'.indexOf(m[1]) + 1, +m[2], null); },
  'combine two map moves': p => { const m = p.match(/Start at ([A-D])(\d)\. Move (\d) squares right, then (\d)/); return m && gridPic(4, 5, ['ABCD'.indexOf(m[1]), +m[2]], `${m[3]} right →, then ${m[4]} down ↓`); },
  'fix a grid reference': p => { const m = p.match(/as (\d)([A-D])\./); return m && gridPic(4, 5, ['ABCD'.indexOf(m[2]), +m[1]], 'row letter, then column number'); },
  'count moves along a row': p => { const m = p.match(/from ([A-D])(\d) to [A-D](\d)/); return m && gridPic(4, 5, ['ABCD'.indexOf(m[1]), +m[2]], `from ${m[1]}${m[2]} to ${m[1]}${m[3]}, one square at a time →`, true); },
  // N01 place value to 10,000
  'build numbers with a zero place': p => { const m = p.match(/(\d+) thousands, no hundreds, (\d+) tens and (\d+) ones/); return m && placeCards(['thousands', 'hundreds', 'tens', 'ones'], [m[1], '0', m[2], m[3]]); },
  'order digits to make a number': p => { const m = p.match(/digits ([\d, ]+) once/); return m && svg(nums(m[1]).map((d, i) => card(60 + i * 100, 50, 80, 110, d, PAL[i % 4], 56)).join('') + arrow(470, 105, 520, 105, INK, 4) + [0, 1, 2, 3].map(i => rect(530 + i * 26, 70, 22, 70, 'none', INK)).join(''), `Digit cards ${nums(m[1]).join(', ')} and four empty places`); },
  'compare thousands first': p => { const [a, b] = nums(p); return placeCards(['Th', 'H', 'T', 'O'], String(a).padStart(4, '0').split('')).replace('</svg>', '') + '' && svg(['Th', 'H', 'T', 'O'].map((l, i) => text(150 + i * 70, 40, l, 20, FERN, mid) + card(120 + i * 70, 55, 60, 60, String(a)[i], PAL[i % 4], 30) + card(120 + i * 70, 135, 60, 60, String(b)[i], PAL[i % 4], 30)).join('') + text(80, 95, a, 20, INK, END) + text(80, 175, b, 20, INK, END) + text(500, 120, 'start here →', 20, CORAL, END), `${a} and ${b} written in place-value columns`); },
  'cross the ten-thousand boundary': p => { const m = p.match(/([\d,]+) (more|less) than ([\d,]+)/); return m && counter(nums(m[3])[0], (m[2] === 'more' ? '+' : '−') + nums(m[1])[0]); },
  'compare whole numbers': p => { const [a, b] = nums(p); return columnSum(a, b, ' ').replace('?', '<  =  >'); },
  'compose and write with zero': p => { const m = p.match(/(\d+) thousands, (\d+) hundreds, (\d+) tens and (\d+) ones/); return m && placeCards(['thousands', 'hundreds', 'tens', 'ones'], m.slice(1, 5)); },
  'read and write whole numbers': p => { const m = p.match(/(\w+) thousand and (\w+) tens/); return m && words[m[1]] && placeCards(['thousands', 'hundreds', 'tens', 'ones'], [words[m[1]], '?', words[m[2]], '?']); },
  // N02 rounding and estimating
  'round whole numbers': p => { const [n, u] = nums(p); return [10, 100, 1000].includes(u) ? roundLine(n, u) : ''; },
  'numbers that round to a given thousand': p => { const t = nums(p)[0]; return numberLine({ from: t - 1000, to: t + 1000, tick: 500, note: `which number lands nearest ${t}?`, alt: `A number line from ${t - 1000} to ${t + 1000}` }); },
  'round a measurement to a whole': p => { const x = dnums(p)[0], lo = Math.floor(x); return decLine(lo, lo + 1, x); },
  'round measured data to stated unit': p => { const x = dnums(p)[0], lo = Math.floor(x); return decLine(lo, lo + 1, x); },
  'estimate by specified rounding': p => { const [a, b] = nums(p); return estimatePic(a, b, '+', 100); },
  'estimate a difference by rounding to hundreds': p => { const [a, b] = nums(p); return estimatePic(a, b, '−', 100); },
  'smallest number rounding to a hundred': p => { const r = nums(p)[0]; return numberLine({ from: r - 100, to: r, tick: 50, note: 'halfway rounds up', alt: `A number line from ${r - 100} to ${r}` }); },
  'spot a rounding mistake': p => { const [n, u] = nums(p); return roundLine(n, u); },
  'estimate a total using rounding': p => { const [a, b] = nums(p); return estimatePic(a, b, '+', 100); },
  // N04 / N05 four-digit addition and subtraction
  'four-digit add': p => { const [a, b] = nums(p); return columnSum(a, b, '+'); },
  'four-digit subtract': p => { const [a, b] = nums(p); return columnSum(a, b, '−'); },
  'missing addend': p => { const m = p.match(/(\d[\d,]*) \+ □ = (\d[\d,]*)/); return m && barModel(nums(m[2])[0], [nums(m[1])[0], '?']); },
  'fix an addition mistake': p => { const [a, b] = nums(p); return columnSum(a, b, '+'); },
  'two changes in a story': p => { const [cap, x, y] = nums(p); return barModel(cap, [x, y, '?'], ' L'); },
  'adjust a near-thousand': p => { const [a, b] = nums(p), near = Math.round(a / 1000) * 1000; return hop(b, [`+ ${near}`, `− ${near - a}`]); },
  'compare two sums': p => { const m = [...p.matchAll(/(\d[\d,]*) \+ (\d[\d,]*)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0]) : ''; },
  'missing subtrahend': p => { const m = p.match(/(\d[\d,]*) − □ = (\d[\d,]*)/); return m && barModel(nums(m[1])[0], ['?', nums(m[2])[0]]); },
  'fix a subtraction mistake': p => { const [a, b] = nums(p); return columnSum(a, b, '−'); },
  'check subtraction with addition': p => { const [a, b, d] = nums(p); return barModel(a, [d, b]); },
  // N06 facts
  'multiplication facts': p => { const [a, b] = nums(p); return arrayGrow(a, b); },
  'division facts': p => { const [t, d] = nums(p); return d <= 10 ? groupsDiv(t, d) : ''; },
  'derive facts using place value': p => { const [a, b] = nums(p); return scaleTen(`${a / 10} × ${b} = ?`, `${a} × ${b} = ?`); },
  'multiply then subtract': p => { const [r, c, g] = nums(p); return groupsDots(r, c, `${r} rows of ${c}, then ${g} taken`); },
  // N07 multiplication
  'two- and three-digit multiplication': p => { const m = p.match(/(\d+) × (\d+)/); if (m) return +m[1] >= 100 ? partition3(+m[1], +m[2]) : partitionPic(+m[1], +m[2]); const g = p.match(/(\d+) boxes hold (\d+)/); return g ? labelledGroups(+g[1], g[2]) : ''; },
  'multiply both parts': p => { const m = p.match(/(\d) × (\d+) by/); return m && partition3(+m[2], +m[1]); },
  'equal groups multiplication': p => { const [g, n] = nums(p); return labelledGroups(g, n); },
  'multiply then add': p => { const [g, n, extra] = nums(p); return labelledGroups(g, n, `+ ${extra} loose`); },
  'compare two products': p => { const m = [...p.matchAll(/(\d+) × (\d+)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0]) : ''; },
  'fix a zero in multiplication': p => { const m = p.match(/(\d) × (\d+) =/); return m && partition3(+m[2], +m[1]); },
  // N08 division
  'exact division up to three digits': p => { const [t, d] = nums(p); return d <= 10 ? groupsDiv(t, d) : ''; },
  'divide in useful parts': p => { const m = p.match(/Split (\d+) into (\d+) \+ (\d+) to work out \d+ ÷ (\d+)/); return m && splitDiv(m[1], m[2], m[3], m[4]); },
  'missing divisor': p => { const [t, qt] = nums(p); return groupsOfKnown(t, qt); },
  'division as grouping': p => { const [t, d] = nums(p); return groupsOfKnown(t, d); },
  'find the whole from a division': p => { const [d, qt] = nums(p); return labelledGroups(qt, d); },
  // N09 tenths
  'tenths as a decimal': p => tenthsPic(nums(p)[0]),
  'whole numbers divided into tenths': p => tenthsPic(nums(p)[0]),
  'connect counted tenths with distance': p => tenthsPic(nums(p)[0]),
  'compare fraction and decimal tenths': p => { const m = p.match(/Compare (\S+) __ (\S+)\./); if (!m) return ''; const v = s => Math.round((s.includes('/') ? +s.split('/')[0] / +s.split('/')[1] : +s) * 10), row = (t, y, label) => { const w = Math.floor(t / 10), r = t % 10, k = 160; let out = text(50, y + 30, label, 22, INK, END); for (let i = 0; i < Math.min(w, 2); i++) for (let j = 0; j < 10; j++) out += rect(70 + i * (k + 10) + j * k / 10, y, k / 10, 44, LEMON, INK); for (let j = 0; j < 10; j++) out += rect(70 + Math.min(w, 2) * (k + 10) + j * k / 10, y, k / 10, 44, j < r ? LEMON : PAPER, INK); return out; }; return svg(row(v(m[1]), 40, m[1]) + row(v(m[2]), 130, m[2]) + note('each strip is one whole in tenths'), `${m[1]} and ${m[2]} shown as tenths`); },
  'ten jumps of tenths': p => { const st = dnums(p)[1] || dnums(p)[0]; return numberLine({ from: 0, to: st * 10, tick: st * 10 / 5, start: 0, step: st, jumps: 10, labels: false, noEnd: true, note: `10 jumps of ${fx(st)}`, alt: `A number line with ten jumps of ${fx(st)}` }); },
  'tenths multiplied by ten': p => { const st = dnums(p)[0]; return numberLine({ from: 0, to: st * 10, tick: st * 10 / 5, start: 0, step: st, jumps: 10, labels: false, noEnd: true, note: `10 jumps of ${fx(st)}`, alt: `A number line with ten jumps of ${fx(st)}` }); },
  'tenths between two decimals': p => { const [a, b] = dnums(p); return decLine(a, b); },
  'fix a tenths mistake': p => tenthsPic(nums(p)[0]),
  'middle decimal when ordering': p => cards(dnums(p).slice(0, 3).map(fx)),
  // N10 compare fractions
  'who ate more': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)], names = p.match(/^(\w+) ate .* and (\w+) ate/); return m.length >= 2 && names ? sameBars(+m[0][2], [+m[0][1], +m[1][1]], [names[1], names[2]]) : ''; },
  'bigger with the same denominator': p => { const m = p.match(/(\d+)\/(\d+)/); return m && stripPic(+m[2], +m[1], [], `${m[1]}/${m[2]} — now more parts of the same size`); },
  'bigger share from fewer cuts': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? multiStrips([[+m[0][2], +m[0][1]], [+m[1][2], +m[1][1]]]) : ''; },
  'middle fraction when ordering': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 3 ? multiStrips(m.slice(0, 3).map(x => [+x[2], +x[1]])) : ''; },
  'compare with one half': p => { const m = p.match(/(\d+)\/(\d+)/); return m && svg(strip(+m[2], +m[1], [], 40, 60, `${m[1]}/${m[2]}`) + strip(2, 1, [], 130, 60, '1/2') + note('the same whole, cut in two'), `${m[1]}/${m[2]} above one half`); },
  'compare same numerator in a same-whole context': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? multiStrips([[+m[0][2], +m[0][1]], [+m[1][2], +m[1][1]]]) : ''; },
  // N11 equivalence
  'missing denominator in an equivalent fraction': p => { const m = p.match(/(\d+)\/(\d+) = (\d+)\/□/); return m && svg(strip(+m[2], +m[1], [], 40, 60, `${m[1]}/${m[2]}`) + rect(60, 130, 520 * m[1] / m[2], 60, LEMON, INK) + rect(60 + 520 * m[1] / m[2], 130, 520 - 520 * m[1] / m[2], 60, PAPER, INK) + text(50, 168, `${m[3]}/?`, 22, INK, END) + note('the same amount, cut into more parts'), `${m[1]}/${m[2]} above the same amount in ${m[3]} parts`); },
  'fix an equivalence mistake': p => { const m = p.match(/(\d+)\/(\d+) = \d+\/\d+ .* □\/(\d+)/); return m && eqBars(+m[1], +m[2], +m[3]); },
  'equivalence through repartitioning a real whole': p => { const m = p.match(/(\d+) equal beds; (\d+) are planted\. Every bed is split into (\d+)/); return m && cutAgain(+m[1], +m[2], +m[3]); },
  // N12 mixed numbers
  'count unit parts in a mixed number': p => { const m = p.match(/(\d+) and (\d+)\/(\d+)/); return m && mixedStrips(+m[1], +m[2], +m[3]); },
  'whole numbers around an improper fraction': p => { const m = p.match(/(\d+)\/(\d+)/); return m && numberLine({ from: 0, to: Math.floor(m[1] / m[2]) + 2, tick: 1, note: `${m[1]}/${m[2]}: count in ${m[2]}ths`, alt: `A number line from 0 to ${Math.floor(m[1] / m[2]) + 2}` }); },
  'parts to the next whole': p => { const m = p.match(/(\d+)\/(\d+)/); return m && mixedStrips(Math.floor(m[1] / m[2]), m[1] % m[2], +m[2]); },
  'whole metres from an improper fraction': p => { const m = p.match(/(\d+)\/(\d+)/); return m && svg(strip(+m[1], +m[1], [], 60, 60, '') + note(`${m[1]} parts; each metre is ${m[2]} parts`, 160), `A strip of ${m[1]} parts`, 180); },
  'fix a mixed-number mistake': p => { const m = p.match(/(\d+)\/(\d+)/); return m && mixedStrips(Math.floor(m[1] / m[2]), m[1] % m[2], +m[2]); },
  'whole part of improper fraction': p => { const m = p.match(/(\d+)\/(\d+)/); return m && svg(strip(+m[1], +m[1], [], 60, 60, '') + note(`${m[1]} parts; a whole is ${m[2]} parts`, 160), `A strip of ${m[1]} parts`, 180); },
  'fractional part of mixed number': p => { const m = p.match(/(\d+)\/(\d+)/); return m && svg(strip(+m[1], +m[1], [], 60, 60, '') + note(`${m[1]} parts; a whole is ${m[2]} parts`, 160), `A strip of ${m[1]} parts`, 180); },
  'connect repeated fractional steps with improper position': p => { const m = p.match(/(\d+) jumps of 1\/(\d+)/); return m && numberLine({ from: 0, to: Math.ceil(m[1] / m[2]) + 1, tick: 1, note: `${m[1]} jumps of 1/${m[2]}`, alt: `A number line for jumps of 1/${m[2]}` }); },
  // N13 fraction units
  'same-denominator fraction add': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? sameBars(+m[0][2], [+m[0][1], +m[1][1]]) : ''; },
  'same-denominator fraction subtract': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? stripPic(+m[0][2], +m[0][1], [+m[1][1]], `${m[0][0]} with ${m[1][0]} taken away`) : ''; },
  'add fractions past one whole': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? sameBars(+m[0][2], [+m[0][1], +m[1][1]]) : ''; },
  'take away then add fractions': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 3 ? stripPic(+m[0][2], +m[0][1], [+m[1][1]], `then add ${m[2][0]}`) : ''; },
  'combine three fraction amounts across a whole': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 3 ? sameBars(+m[0][2], m.slice(0, 3).map(x => +x[1])) : ''; },
  // N14 tenths arithmetic
  'tenths add': p => { const [a, b] = dnums(p); return columnSum(fx(a), fx(b), '+'); },
  'tenths subtract': p => { const [a, b] = dnums(p); return columnSum(fx(a), fx(b), '−'); },
  'missing decimal addend': p => { const [a, s] = dnums(p); return barModel(s, [a, '?']); },
  'add three tenths amounts': p => groupsAdd(dnums(p).slice(0, 3).map(fx), dot),
  'compare lengths in tenths': p => { const [a, b] = dnums(p); return compareBars(fx(a), fx(b)); },
  'two changes in tenths': p => { const [s, o, b] = dnums(p); return takeAway(fx(s), [fx(o)], [fx(b)], dot); },
  'fix a tenths addition mistake': p => { const [a, b] = dnums(p); return columnSum(fx(a), fx(b), '+'); },
  'tenths to reach a whole': p => { const [a, w] = dnums(p); return barModel(w, [fx(a), '?'], ' m'); },
  'use decimal subtraction in a length context': p => { const [t, u] = dnums(p); return barModel(fx(t), [fx(u), '?'], ' m'); },
  // N15 scaling
  'proportional scaling': p => { const m = p.match(/uses (\d+) g of (\w+)\. Use (1\/(\d+) of|(\d+) times)/); return m && recipeTable([['', m[2]], ['1 batch', `${m[1]} g`], [m[4] ? `1/${m[4]} of it` : `${m[5]} times`, '?']]); },
  'scale a second quantity': p => { const m = p.match(/(\d+) g of (\w+) and (\d+) g of (\w+)\. Make (\d+) times/); return m && recipeTable([['', m[2], m[4]], ['1 batch', `${m[1]} g`, `${m[3]} g`], [`× ${m[5]}`, '?', '?']]); },
  'find the scale factor': p => { const [a, b] = nums(p); return recipeTable([['1 batch', `${a} g`], ['big batch', `${b} g`], ['how many times?', '?']]); },
  'scale down a recipe': p => { const m = p.match(/uses (\d+) g of (\w+)\. Make only 1\/(\d+)/); return m && recipeTable([['', m[2]], ['1 batch', `${m[1]} g`], [`1/${m[3]} of it`, '?']]); },
  'scale by a number of people': p => { const [n, ml, N] = nums(p); return recipeTable([[`${n} people`, `${ml} mL`], ['1 person', '?'], [`${N} people`, '?']]); },
  'fix a scaling mistake': p => { const [f, s, , b] = nums(p); return recipeTable([['', 'sugar', 'butter'], ['1 batch', `${s} g`, `${b} g`], [`× ${f}`, `${s * f} g`, '?']]); },
  'total after scaling': p => { const [a, b, f] = nums(p); return recipeTable([['', 'oats', 'fruit', 'together'], ['1 batch', `${a} g`, `${b} g`, '?'], [`${f} batches`, '?', '?', '?']]); },
  // N16 / N17 unit fractions of amounts
  'unit fraction of whole': p => { const f = fracOf(p); return f && f[0] <= 12 ? groupsDiv(f[1], f[0]) : ''; },
  'recognise a unit fraction in an equal-group situation': p => { const m = p.match(/(\d+) seeds fill (\d+) equal rows/); return m && groupsDiv(+m[1], +m[2]); },
  'name the unit fraction of a set': p => { const [part, w] = nums(p); return counters(w, part); },
  'add two unit-fraction amounts': p => { const ds = unitDens(p), w = nums(p.replace(/\d+\/\d+/g, ' '))[0]; return ds.length >= 2 ? svg(strip(ds[0], 1, [], 40, 60, `1/${ds[0]} of ${w}`) + strip(ds[1], 1, [], 130, 60, `1/${ds[1]} of ${w}`), `A strip in ${ds[0]} parts and a strip in ${ds[1]} parts, one part shaded in each`) : ''; },
  'compare two unit-fraction shares': p => { const m = [...p.matchAll(/1\/(\d+) of (\d+)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0], 'which share is more?') : ''; },
  'whole from unit fraction': p => { const f = fracOf(p); return f && f[0] <= 10 ? wholeBar(f[0], f[1]) : ''; },
  'rebuild a whole then find the remaining amount': p => { const m = p.match(/(\d+) equal sections\. One section is (\d+)/); return m && wholeBar(+m[1], +m[2]); },
  // N18 money
  'fewest coins for an amount': p => { const m = p.match(/make (\$[\d.]+|\d+ cents)/); return coinsPic([200, 100, 50, 20, 10], `make ${m ? m[1] : 'the amount'} — fewest coins?`); },
  'total of mixed coins in cents': p => { const [a, b, c] = nums(p); return coinsPic([...Array(a).fill(200), ...Array(b).fill(50), ...Array(c).fill(20)]); },
  'swap a note for coins or notes': p => { const m = p.match(/How many (\S+) coins make \$(\d+)/); return m && coinWord[m[1]] && svg(noteAt(120, 110, +m[2]) + arrow(200, 110, 280, 110, CORAL, 5) + coinAt(330, 110, coinWord[m[1]], 1.3) + text(400, 118, '× ?', 34, FERN), `A $${m[2]} note swapped for ${m[1]} coins`); },
  'compare two piles of coins': p => { const [A, B] = p.split('Pile B has'); const a = coinsOf(A), b = coinsOf(B || ''); return a.length && b.length ? coinsPic([...a, 0, ...b].filter(Boolean), 'pile A, then pile B') : ''; },
  'fix a coin-value mistake': p => { const m = p.match(/(\d+) (\S+) coins/); return m && coinWord[m[2]] ? coinsPic(Array(+m[1]).fill(coinWord[m[2]])) : ''; },
  'cents to make a dollar': p => { const c = coinsOf(p); return c.length ? coinsPic(c, 'how many more cents to make $1?') : ''; },
  'dollars and cents': p => { const d = nums(p)[0]; return d <= 9 ? coinsPic(Array(d).fill(100), `$${d} in cents?`) : ''; },
  'combine NZ denominations': p => { const [a, b] = nums(p); return coinsPic([...Array(a).fill(100), ...Array(b).fill(20)]); },
  'represent currency in different denominations': p => { const [t, d] = nums(p); return coinsPic(Array(d).fill(100), `${t} cents altogether: the rest in ten-cent coins — how many?`); },
  'exchange NZ currency while preserving value': p => { const [t, d] = nums(p); return coinsPic(Array(d).fill(100), `${t} cents altogether: the rest in twenty-cent coins — how many?`); },
  // N19 cost and change
  'cost from the change': p => { const [pd, ch] = nums(p); return barModel(pd, ['?', ch], '$'); },
  'multiply then find change': p => { const [n, pr, pay] = nums(p); return labelledGroups(n, `$${pr}`, `paid $${pay}`); },
  'how many items with a budget': p => { const [pr, money] = nums(p); return groupsOfKnown(money, pr, '$').replace('? groups', '? items'); },
  'two-step cost and change': p => { const [n, pr, extra, pay] = nums(p); return barModel(pay, [n * pr, extra, '?'], '$'); },
  'check the change': p => { const [c, pay, given] = nums(p); return barModel(pay, [c, given, '?'], '$'); },
  'multiple-item cost': p => { const [n, pr] = nums(p); return labelledGroups(n, `$${pr}`); },
  'different prices total': p => { const [n, pr, other] = nums(p); return labelledGroups(n, `$${pr}`, `+ a book $${other}`); },
  'cost and change': p => { const [n, pr, other, pay] = nums(p); return barModel(pay, [n * pr, other, '?'], '$'); },
  // A01 / A02 equations
  'open subtraction equation': p => { const m = p.match(/□ − (\d[\d,]*) = (\d[\d,]*)/); return m && barModel('?', [nums(m[1])[0], nums(m[2])[0]]); },
  'choose the missing number': p => { const [a, c] = nums(p); return barModel(c, [a, '?']); },
  'keep both sides equal': p => { const [tot, a, b, c] = nums(p); return balance(`${tot} − ${c}`, `${a}+${b} ?`); },
  'choose the operation': p => { const [s, t] = nums(p); return svg(card(110, 60, 100, 100, '?', LEMON, 50) + text(240, 125, '+', 50, INK, mid) + card(280, 60, 110, 100, s, PAPER, 40) + text(440, 125, '=', 50, INK, mid) + card(480, 60, 120, 100, t, PAPER, 40), `? + ${s} = ${t}`); },
  'unknown addend': p => { const m = p.match(/(\d+) \+ __ = (\d+)/); return m && barModel(+m[2], [+m[1], '?']); },
  'unknown subtrahend': p => { const m = p.match(/(\d+) − __ = (\d+)/); return m && barModel(+m[1], ['?', +m[2]]); },
  'preserve equality': p => { const [a, b, c] = nums(p); return balance(`${a} + ${b} + ${c}`, `${a + b} + ?`); },
  'form an open equation from a context': p => { const [t, f] = nums(p); return barModel(t, [f, '?']); },
  'open division equation': p => { const [d, n] = nums(p); return labelledGroups(d, n, '? shared out'); },
  'square number riddle': p => svg(card(120, 50, 110, 130, '?', LEMON, 60) + text(290, 125, '×', 40, CORAL, mid) + card(350, 50, 110, 130, '?', LEMON, 60) + text(520, 125, `= ${nums(p)[0]}`, 34, INK, mid) + note('the same number twice'), `Two equal mystery numbers that multiply to ${nums(p)[0]}`),
  'check a solution by substituting': p => { const [n, d] = nums(p); return groupsOfKnown(n, d); },
  'unknown factor': p => { const m = p.match(/__ × (\d+) = (\d+)/); return m && arrayPair(+m[1], +m[2]); },
  'unknown dividend': p => { const m = p.match(/__ ÷ (\d+) = (\d+)/); return m && labelledGroups(+m[1], m[2], '? shared out'); },
  'unknown divisor': p => { const m = p.match(/(\d+) ÷ __ = (\d+)/); return m && groupsOfKnown(+m[1], +m[2]); },
  'form a missing-factor equation from grouping': p => { const [t, d] = nums(p); return groupsOfKnown(t, d); },
  // A03 patterns
  'constant arithmetic or geometric rule': rowCards,
  'the nth number from a rule': p => { const m = p.match(/starts at (\d+) and adds (\d+) each time\. What is the (\d+)/); if (!m) return ''; const s = +m[1], st = +m[2], n = +m[3]; return numberLine({ from: s, to: s + st * n, tick: st, labels: false, start: s, step: st, jumps: n - 1, note: `${n - 1} jumps of ${st}`, alt: `A number line from ${s} with ${n - 1} jumps of ${st}` }); },
  'name the pattern rule': p => { const t = terms(p); return t && cardsRow([...t, '…'], 'what happens each step?'); },
  'which stage has a given count': p => { const m = p.match(/has (\d+) tiles, and each stage adds (\d+) tiles\. Which stage has (\d+)/); if (!m) return ''; const [s, d] = m.slice(1).map(Number); let out = ''; for (let st = 0; st < 3; st++) { const n = s + st * d, sp = Math.min(26, 420 / n); for (let i = 0; i < n; i++) out += rect(130 + i * sp, 40 + st * 56, sp - 3, sp - 3, PAL[st], INK); out += text(110, 40 + st * 56 + sp / 2 + 6, `stage ${st + 1}`, 20, INK, END); } return svg(out + note('the same number of tiles is added each stage'), `Tile stages 1, 2 and 3 with ${s}, ${s + d} and ${s + 2 * d} tiles`); },
  // M01 units
  'mixed measurement units': p => { const m = p.match(/(\d+) (m|kg|L) and (\d+) (cm|g|mL)/); return m && endToEnd([...Array(+m[1]).fill(m[2] === 'm' ? 100 : 1000), +m[3]], m[4]); },
  'whole litres in millilitres': p => { const ml = nums(p)[0]; return jug(ml, ml > 4000 ? 8000 : 4000, `${ml} mL`); },
  'compare total capacities': p => { const [jl, jm, n, b] = nums(p); return bottles(n, b, jm ? `${jl}.${String(jm).padStart(3, '0').replace(/0+$/, '')}` : jl); },
  'longest minus shortest': p => { const m = p.match(/measure (.*)\. How/); if (!m) return ''; const vals = m[1].split(/, | and /).map(lenCm); return barsOf(vals, 'cm'); },
  'compare capacities after choosing a common unit': p => { const [l, ml] = nums(p); return bottles(1, 500, `${l}.${String(ml).padStart(3, '0').replace(/0+$/, '')}`); },
  // M02 temperature
  'two temperature changes': p => { const [s, up, down] = nums(p); return thermo(s, `+ ${up}, then − ${down}`); },
  'compare two temperatures': p => { const [a, b] = nums(p), names = p.match(/in (\S+) and \d+ °C in (\S+)\./); return thermos([a, b], names ? [names[1], names[2]] : null); },
  'read between thermometer marks': p => { const lo = nums(p)[1]; return thermo(lo + 1); },
  'temperature before a change': p => { const [drop, now] = nums(p); return thermo(now, `now; it cooled by ${drop}`); },
  'coldest of three': p => thermos(nums(p).slice(0, 3)),
  'fix a scale-interval mistake': p => { const [, lo, marks] = nums(p); return thermo(lo + 2 * marks); },
  'temperature difference': p => { const [a, b] = nums(p); return thermos([a, b], ['before', 'after']); },
  'Celsius change': p => { const [t, d] = nums(p); return thermo(t, `cools by ${d}`); },
  // M04 / M05 area
  'area after removing a row': p => { const [c, r] = nums(p); return areaGrid(r, c, { cutRow: true }); },
  'side of a square from its area': p => squareQ(nums(p)[0]),
  'rectangle area': p => { const [a, b] = nums(p); return areaGrid(b, a); },
  'square area': p => { const a = nums(p)[0]; return areaGrid(a, a); },
  'inverse rectangle area': p => { const [ar, w] = nums(p); return areaGrid(w, Math.min(6, Math.round(ar / w)), { hideCols: true, caption: `${ar} squares in ${w} rows` }); },
  'half squares into whole squares': p => halfSquares(0, nums(p)[0]),
  'area by full and half squares': p => { const [w, h] = nums(p); return halfSquares(w, h); },
  'half squares from an area': p => { const w = nums(p.replace(/\d+\/\d+/, ' ')).find((v, i, a) => i > 0 || true); const m = p.match(/It has (\d+) whole/); return m && halfSquares(+m[1], '?'); },
  'fix a half-square mistake': p => { const [w, h] = nums(p); return halfSquares(w, h); },
  'triangle as half a rectangle': p => { const [a, b] = nums(p); return rectDiag(a, b); },
  'combine odd half-square counts without a ready total': p => { const [w, h] = nums(p); return halfSquares(w, h); },
  // M06 volume
  'cubes in one layer': p => { const [t, l] = nums(p); return layersPic(l, '?', `${t} cubes altogether`); },
  'add a layer of cubes': p => { const [w, d, h] = nums(p); return layersPic(h + 1, w * d, 'one new layer on top'); },
  'layers from total and base': p => { const [t, w, d] = nums(p); return layersPic('?', w * d, `${t} cubes altogether`); },
  'fix a visible-cubes mistake': p => { const [top, l] = nums(p); return layersPic(l, top); },
  'infer layer count from a filled cuboid': p => { const [t, per] = nums(p); return layersPic('?', per, `${t} cubes altogether`); },
  // M07 turns
  'two quarter turns': p => compassPic(dirIn(p), /anticlockwise/.test(p) ? 'two quarter turns ↺' : 'two quarter turns ↻'),
  'compare an angle with a right angle': p => anglePic(nums(p)[0]),
  'name the turn from start and finish': p => { const m = p.match(/facing (\w+) and turns clockwise to face (\w+)/); return m && svg(compassPicInner(m[1], 170) + compassPicInner(m[2], 470) + text(320, 130, '→', 40, INK, mid), `Arrows pointing ${m[1]} and then ${m[2]}`, 250); },
  'connect repeated quarter turns with degree measure': p => compassPic('North', `${nums(p)[0]} quarter turns ↻`),
  // M08 / M09 time
  'hour hand between numbers': p => { const [h, , n] = nums(p); return clockPic(h, n * 5 % 60); },
  'fix a minute-hand mistake': p => { const [h, n] = nums(p); return clockPic(h, n * 5); },
  'time point from midnight': clockFromPrompt,
  'start time from an end': p => { const [h, m, d] = nums(p); return clockPic(h, m, `− ${d} minutes = start?`); },
  'repeat a duration': p => { const [m, s, n] = nums(p); return groupsAdd(Array(Math.min(n, 6)).fill(`${m}:${String(s).padStart(2, '0')}`), dot); },
  'whole hours in minutes': p => { const mins = nums(p)[0]; return numberLine({ from: 0, to: mins, tick: 60, mark: mins, note: 'an hour each tick', alt: `A number line from 0 to ${mins} minutes in hours` }); },
  'mixed hour-minute duration': p => { const [h, m] = nums(p); return endToEnd([...Array(h).fill(60), m], 'min'); },
  'mixed minute-second duration': p => { const [m, s] = nums(p); return endToEnd([...Array(m).fill(60), s], 's'); },
  'elapsed clock time': p => { const m = p.match(/(\d{1,2}):(\d{2}) am and ends at (\d{1,2}):(\d{2})/); return m && clockPic(+m[1], +m[2], `until ${m[3]}:${m[4]}`); },
  // G03 views of a cuboid
  'squares in one view': p => { const [w, d, h] = nums(p), v = p.match(/its (front|side|top) view/); return v && viewPic(v[1] === 'top' ? [w, d] : v[1] === 'side' ? [d, h] : [w, h], `${v[1]} view`); },
  'cubes from a view and depth': p => { const [w, h, d] = nums(p); return viewPic([w, h], `front view · ${d} deep`); },
  'compare two views of one solid': p => { const [w, d, h] = nums(p); return viewPair([w, h], 'front', [w, d], 'top'); },
  'cubes from two views': p => { const [w, d, , h] = nums(p); return viewPair([w, d], 'top', [w, h], 'front'); },
  'views that match': p => { const [w, d, h] = nums(p); return svg(viewInner([w, h], 'front', 110) + viewInner([d, h], 'side', 320) + viewInner([w, d], 'top', 530), `Front ${w} by ${h}, side ${d} by ${h}, top ${w} by ${d}`); },
  // G04 transformations
  'size is preserved by a rigid transformation': p => { const m = p.match(/(\d+) (cm|mm)/); return m && svg(shape([[80, 180], [80, 70], [230, 180]], LEMON, INK, 3) + text(60, 130, `${m[1]} ${m[2]}`, 22, INK, END) + arrow(270, 125, 360, 125, CORAL, 5) + text(315, 105, 'move it', 18, CORAL, mid) + shape([[400, 70], [550, 70], [400, 180]], LEMON, INK, 3) + text(570, 130, '? ' + m[2], 24, FERN) + note('slide, flip or turn: same size'), `A shape with a ${m[1]} ${m[2]} side, before and after a move`); },
  'equal distance across a symmetry line': p => mirrorPic(nums(p)[0]),
  'combine two slides': p => { const [a, b] = nums(p), d = p.match(/squares (\w+)/); return hop('start', [`${a} ${d ? d[1] : ''}`, `${b} ${d ? d[1] : ''}`], '? from start'); },
  // G01 / G02 shapes
  'apply both conditions for a regular polygon': p => { const m = p.match(/(\d+)-sided/); if (m) return svg(regular(Math.min(12, +m[1]), '', '', 320, true) + note('equal sides? equal angles?'), `A ${m[1]}-sided shape`); if (/rectangle/.test(p)) return svg(rect(170, 60, 300, 130, LEMON, INK) + note('equal angles, but are the sides equal?'), 'A rectangle'); if (/rhombus/.test(p)) return svg(shape([[320, 30], [430, 125], [320, 220], [210, 125]], LEMON, INK, 3) + note('equal sides, but are the angles equal?', 240), 'A rhombus', 250); if (/square/.test(p)) return svg(rect(230, 40, 160, 160, LEMON, INK) + note('equal sides and equal angles?', 230), 'A square', 240); return /triangle/.test(p) ? svg(regular(3, '', '', 320, true) + note('equal sides and equal angles?'), 'A triangle') : ''; },
  'compare side counts': p => { const m = p.match(/does a (\w+) have than a (\w+)\?/); return m && SIDES[m[1]] && SIDES[m[2]] ? svg(regular(SIDES[m[1]], '', '', 170) + regular(SIDES[m[2]], '', '', 470) + text(170, 225, m[1], 22, INK, mid) + text(470, 225, m[2], 22, INK, mid), `A ${m[1]} and a ${m[2]}`, 240) : ''; },
  'symmetry in letters': p => { const m = p.match(/letter (\w) have/); return m && svg(text(320, 170, m[1], 150, INK, mid) + note('where could a fold go?'), `The capital letter ${m[1]}`); },
  'diagonals and symmetry': p => /square/.test(p) && !/not a square/.test(p) ? svg(rect(230, 40, 180, 180, LEMON, INK) + dash(230, 40, 410, 220, CORAL, 4) + note('fold along the dashed line?', 240), 'A square with a dashed diagonal', 250) : /rectangle/.test(p) ? svg(rect(140, 50, 360, 150, LEMON, INK) + dash(140, 50, 500, 200, CORAL, 4) + note('fold along the dashed line?'), 'A long rectangle with a dashed diagonal') : /rhombus/.test(p) ? svg(shape([[320, 30], [450, 125], [320, 220], [190, 125]], LEMON, INK, 3) + dash(190, 125, 450, 125, CORAL, 4) + note('fold along the dashed line?', 240), 'A rhombus with a dashed diagonal', 250) : svg(shape([[320, 30], [400, 110], [320, 220], [240, 110]], LEMON, INK, 3) + dash(320, 30, 320, 220, CORAL, 4) + note('fold along the dashed line?', 240), 'A kite with a dashed long diagonal', 250),
  // S01–S04 data
  'check every reply is recorded': p => { const [n, ...c] = nums(p); return tally(c.slice(0, 4), ['A', 'B', 'C', 'D'], n); },
  'a reply that does not fit the question': (p, item) => item?.choices ? replyCards(item.choices) : '',
  'total dots': p => { const c = nums(p).slice(0, 4); return dotPlot(['1', '2', '3', '4'], c); },
  'add a response to a bar': p => { const [v, h] = nums(p); return barChart([`${v} pets`], [h], { caption: '+1 person' }); },
  'bars should add to the total': p => { const [n, a, b, c] = nums(p); return barChart(['A', 'B', 'C', 'D'], [a, b, c, null], { title: `${n} asked` }); },
  'read a scale in twos': p => { const lo = nums(p)[6]; return barChart(['A', 'B'], [lo + 1, 3], { step: 2, noValues: true, caption: 'scale goes up in 2s' }); },
  'translate numerical data to bar frequency': p => { const m = p.match(/data is ([\d, ]+)\./); return m && replyCards(m[1].split(/,\s*/)); },
  'build dot plot from all observations': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'repair a graph while preserving every observation': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'bar height is the count, not the value': p => { const [h, v] = nums(p); return dotPlot([String(v)], [h]); },
  'everyone except one category': p => { const [n, z] = nums(p); return barChart(['0 pets', '1 or more'], [z, null], { title: `${n} people` }); },
  'total of a measured quantity': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'fix a value-frequency mistake': p => { const m = p.match(/Pets: ([\d, ]+)\./); return m && dotPlotFrom(m[1].split(/,\s*/).map(Number)); },
  'range from a data list': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'middle value from a list': p => { const l = listAfterColon(p); return l && replyCards(l); },
  'compare one with the rest': p => { const [n, one] = nums(p), cat = p.match(/chose (.+?)\. How/); return barChart([cat ? cat[1] : 'this', 'others'], [one, null], { title: `${n} people` }); },
  'fix a middle-value mistake': p => { const m = p.match(/of ([\d, ]+) is/); return m && replyCards(m[1].split(/,\s*/)); },
};

// ---- Year 5 (2026-11-06) ---------------------------------------------------------------------------
// Year 5 questions use six-digit numbers, hundredths, percentages, prisms and grouped data, so they get
// their own table; a Year 5 skill that is not listed here falls back to the Year 4 rule, then the Year 3 one.
const n6 = p => (p.replace(/(\d),(\d{3})/g, '$1$2').match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
const fmt = v => Number(v).toLocaleString('en-US', { maximumFractionDigits: 3 });
const dterms = p => { const m = p.match(/(-?\d+(?:\.\d+)?|□)(,\s*(-?\d+(?:\.\d+)?|□))+/); return m ? m[0].split(/,\s*/).map(t => t === '□' ? '?' : t) : null; };
const PL6 = ['HTh', 'TTh', 'Th', 'H', 'T', 'O'];
// Place cards for any number of places (narrower than placeCards).
const placeRow = (labels, vals, caption = '') => { const n = labels.length, cw = Math.min(90, (W - 60) / n - 12), x0 = (W - n * (cw + 12)) / 2; return svg(labels.map((l, i) => text(x0 + i * (cw + 12) + cw / 2, 46, l, 18, FERN, mid) + card(x0 + i * (cw + 12), 60, cw, 96, vals[i], PAL[i % 4], String(vals[i]).length > 2 ? 24 : 40)).join('') + (caption ? note(caption, 200) : ''), `Place cards: ${labels.map((l, i) => `${vals[i]} ${l}`).join(', ')}`); };
const placePair = (a, b) => { const A = String(a).padStart(6, ' ').split(''), B = String(b).padStart(6, ' ').split(''); let out = ''; PL6.forEach((l, i) => { out += text(130 + i * 72, 40, l, 18, FERN, mid) + card(100 + i * 72, 52, 60, 60, A[i].trim(), PAL[i % 4], 28) + card(100 + i * 72, 126, 60, 60, B[i].trim(), PAL[i % 4], 28); }); return svg(out + text(90, 92, fmt(a), 16, INK, END) + text(90, 166, fmt(b), 16, INK, END) + text(560, 120, 'start here →', 18, CORAL, END), `${fmt(a)} and ${fmt(b)} written in place-value columns`); };
const bigCards = vals => svg(vals.map((v, i) => { const n = vals.length, cw = Math.min(150, (W - 60) / n - 16), x = (W - n * (cw + 16)) / 2 + i * (cw + 16); return card(x, 65, cw, 90, fmt(v), PAL[i % 4], 22); }).join(''), `Cards: ${vals.map(fmt).join(', ')}`);
const sumList = parts => svg(parts.map((v, i) => text(320, 50 + i * 28, fmt(v) + (i < parts.length - 1 ? ' +' : ''), 24, INK, mid)).join('') + q(560, 120, 44), `Place-value parts: ${parts.map(fmt).join(' + ')}`, Math.max(220, 60 + parts.length * 28));
// A number line with labelled ends and n equal spaces; mark = a dot; caption above.
const bigLine = (lo, hi, n, mark, caption = '') => { const x0 = 60, x1 = 580, y = 140, k = (x1 - x0) / (hi - lo); let out = line(x0 - 10, y, x1 + 10, y, INK, 5); for (let i = 0; i <= n; i++) { const v = lo + (hi - lo) * i / n, x = x0 + (v - lo) * k; out += line(x, y - 12, x, y + 12, INK, 4) + (n <= 4 || i % 2 === 0 ? text(x, y + 40, fmt(v), 18, INK, mid) : ''); } if (mark != null) out += blob(x0 + (mark - lo) * k, y - 30, 12, 12, 0, CORAL, INK) + text(x0 + (mark - lo) * k, y - 50, fmt(mark), 20, CORAL, mid); return svg(out + (caption ? text(320, 60, caption, 20, FERN, mid) : ''), `A number line from ${fmt(lo)} to ${fmt(hi)}${mark != null ? ` with ${fmt(mark)} marked` : ''}`, 230); };
const bigEstimate = (a, b, sign, unit) => { const one = (v, y) => card(50, y, 150, 60, fmt(v), PAPER, 24) + arrow(210, y + 30, 280, y + 30, CORAL, 4) + text(245, y + 18, `nearest ${unit}`, 14, CORAL, mid) + card(290, y, 110, 60, '?', PAPER, 30); return svg(one(a, 30) + text(345, 125, sign, 40, CORAL, mid) + one(b, 140) + text(500, 120, 'estimate', 24, FERN, mid) + q(500, 170, 44), `${fmt(a)} ${sign} ${fmt(b)}, each rounded to the nearest ${unit}`, 230); };
// A vertical number line (thermometer style) for numbers below zero; marks = values to dot.
const vertLine = (lo, hi, marks = [], caption = '') => { const x = 300, y0 = 30, y1 = 195, k = (y1 - y0) / (hi - lo), Y = v => y1 - (v - lo) * k; let out = line(x, y0 - 8, x, y1 + 8, INK, 5); for (let v = lo; v <= hi; v++) out += line(x - 10, Y(v), x + 10, Y(v), INK, v === 0 ? 4 : 2) + (v === 0 ? text(x - 20, Y(v) + 6, 'zero', 16, FERN, END) : v % 5 === 0 ? text(x - 20, Y(v) + 6, v, 16, INK, END) : ''); marks.forEach((m, i) => { out += blob(x + 30 + i * 26, Y(m), 9, 9, 0, i ? SKY : CORAL, INK); }); return svg(out + (caption ? text(480, 110, caption, 20, FERN, mid) : ''), `A vertical number line from ${lo} to ${hi}${marks.length ? ` with ${marks.join(' and ')} marked` : ''}`, 230); };
// A two-digit by two-digit area model, split by tens and ones; mark = 'ones' puts a ? on the ones part of the second factor.
const areaModel = (a, b, mark = '') => { const at = Math.floor(a / 10) * 10, ao = a % 10, bt = Math.floor(b / 10) * 10, bo = b % 10, kx = 380 / a, ky = 130 / b, x0 = 110, y0 = 50; let out = rect(x0, y0, at * kx, bt * ky, LEMON, INK) + rect(x0 + at * kx, y0, Math.max(28, ao * kx), bt * ky, SKY, INK) + rect(x0, y0 + bt * ky, at * kx, Math.max(24, bo * ky), MINT, INK) + rect(x0 + at * kx, y0 + bt * ky, Math.max(28, ao * kx), Math.max(24, bo * ky), PAPER, INK); out += text(x0 + at * kx / 2, y0 - 12, at, 22, INK, mid) + text(x0 + at * kx + Math.max(28, ao * kx) / 2, y0 - 12, ao || '', 22, INK, mid) + text(x0 - 12, y0 + bt * ky / 2 + 8, bt, 22, INK, END) + text(x0 - 12, y0 + bt * ky + Math.max(24, bo * ky) / 2 + 8, mark === 'ones' ? '?' : (bo || ''), 22, mark === 'ones' ? CORAL : INK, END); return svg(out + note(`${a} × ${b}: four parts to add`), `An area model for ${a} × ${b}, split into tens and ones`); };
const scaleBy = (top, bottom, k) => svg(card(120, 25, 400, 70, top, PAPER, 30) + arrow(320, 105, 320, 135, CORAL, 5) + text(360, 128, `× ${k}`, 26, CORAL) + card(120, 145, 400, 70, bottom, LEMON, 30), `${top}, then ${k} times bigger: ${bottom}`, 230);
// A ten-by-ten grid with n cells shaded.
const gridCells = (x0, y0, s, n, fill = LEMON) => { let out = ''; for (let i = 0; i < 100; i++) out += rect(x0 + (i % 10) * s, y0 + Math.floor(i / 10) * s, s, s, i < n ? fill : PAPER, INK); return out; };
const hundredGrid = (n, caption = '') => svg(gridCells(240, 22, 17, n) + (caption ? text(320, 215, caption, 18, FERN, mid) : ''), `A hundred grid with ${n} of 100 squares shaded`, 225);
const twoGrids = (a, b, la, lb) => svg(gridCells(110, 22, 15, a) + text(185, 196, la, 20, INK, mid) + gridCells(380, 22, 15, b, SKY) + text(455, 196, lb, 20, INK, mid) + q(320, 110, 40), `Two hundred grids: ${la} and ${lb}`, 215);
const hundredthsOf = s => s.includes('/') ? Math.round(100 * +s.split('/')[0] / +s.split('/')[1]) : Math.round(100 * +s);
// A number in place columns, about to be scaled by ten or a hundred.
const shiftPic = (a, op, f) => { const s = Number(a).toFixed(2).replace(/\.?0+$/, ''), [w, d = ''] = s.split('.'), whole = w.padStart(3, ' ').split(''), dec2 = d.padEnd(2, ' ').split(''); return svg(['hundreds', 'tens', 'ones', 'tenths', 'hundredths'].map((l, i) => text(100 + i * 100, 46, l, 16, FERN, mid) + card(60 + i * 100, 60, 80, 90, (i < 3 ? whole[i] : dec2[i - 3]).trim(), PAL[i % 4], 40)).join('') + blob(300, 105, 6, 6, 0, INK, INK) + note(`${op} ${f}: which way do the digits move?`), `${a} written in place columns, to be scaled ${op} ${f}`); };
// A strip of d parts with n shaded; the shaded part is labelled, the whole is labelled.
const fracBar = (d, n, partLabel, wholeLabel) => { const w = 520 / d; let out = strip(d, n, [], 110, 60); const end = 60 + n * w; out += line(60, 92, end, 92, CORAL, 4) + line(60, 84, 60, 100, CORAL, 4) + line(end, 84, end, 100, CORAL, 4) + text((60 + end) / 2, 76, String(partLabel), 24, String(partLabel).includes('?') ? CORAL : INK, mid); out += rect(60, 180, 520, 28, 'none', INK) + text(320, 200, `whole: ${wholeLabel}`, 20, String(wholeLabel).includes('?') ? FERN : INK, mid); return svg(out + text(590, 150, `${n}/${d}`, 22, INK), `A strip of ${d} parts, ${n} shaded as ${partLabel}, the whole is ${wholeLabel}`); };
const metreStrip = (cm, unknown = false) => { const m = Math.floor(cm / 100), r = cm % 100, k = 500 / Math.max(cm, 100); let x = 70, out = ''; for (let i = 0; i < m; i++) { out += rect(x, 90, 100 * k, 50, LEMON, INK) + text(x + 50 * k, 122, unknown ? '?' : '1 m', 20, INK, mid); x += 100 * k; } if (r) out += rect(x, 90, r * k, 50, SKY, INK) + text(x + r * k / 2, 122, unknown ? '?' : `${r} cm`, 18, INK, mid); return svg(out + note(`${fmt(cm)} cm altogether; 100 cm make a metre`), `${cm} cm shown as ${m} metre blocks and ${r} cm`); };
const labelBars = list => { const k = 460 / Math.max(...list.map(x => x[0])); let out = ''; list.forEach(([v, l], i) => { out += rect(70, 50 + i * 60, v * k, 40, PAL[i % 4], INK) + text(80 + v * k, 78 + i * 60, l, 22, INK); }); return svg(out, `Bars: ${list.map(x => x[1]).join(', ')}`); };
// A measuring scale with labelled ends, n equal spaces and a pointer at space index m (null = no pointer).
const scaleBar = (lo, hi, n, m, unit, caption = '') => { const x0 = 70, x1 = 570, y = 130, k = (x1 - x0) / n; let out = rect(x0 - 20, y - 20, x1 - x0 + 40, 40, PAPER, INK); for (let i = 0; i <= n; i++) out += line(x0 + i * k, y - 20, x0 + i * k, y + (i === 0 || i === n ? 20 : 4), INK, i === 0 || i === n ? 4 : 2); out += text(x0, y + 48, `${lo} ${unit}`, 20, INK, mid) + text(x1, y + 48, `${hi} ${unit}`, 20, INK, mid); if (m != null) out += shape([[x0 + m * k, y - 30], [x0 + m * k - 12, y - 56], [x0 + m * k + 12, y - 56]], CORAL, INK, 2) + text(x0 + m * k, y - 64, 'P', 20, CORAL, mid); return svg(out + note(caption || `${n} equal spaces`), `A scale from ${lo} to ${hi} ${unit} in ${n} equal spaces${m != null ? `, pointer at space ${m}` : ''}`); };
const clusterBars = (aw, ar, bw, br) => { const vals = [aw, ar, bw, br], max = Math.max(...vals, 1), k = 120 / max, base = 180; let out = line(90, base, 560, base, INK, 4) + line(90, base, 90, 40, INK, 4); [['Walk', aw, bw, 150], ['Ride', ar, br, 360]].forEach(([l, a, b, x]) => { out += rect(x, base - a * k, 56, a * k, LEMON, INK) + text(x + 28, base - a * k - 8, a, 18, INK, mid) + rect(x + 62, base - b * k, 56, b * k, SKY, INK) + text(x + 90, base - b * k - 8, b, 18, INK, mid) + text(x + 59, base + 26, l, 20, INK, mid); }); out += rect(540, 50, 18, 18, LEMON, INK) + text(566, 65, 'A', 18, INK) + rect(540, 80, 18, 18, SKY, INK) + text(566, 95, 'B', 18, INK); return svg(out, `Clustered bars: walk A ${aw}, B ${bw}; ride A ${ar}, B ${br}`); };
const fracPair = (a, d, b, bd, caption) => { let out = strip(d, Math.min(a, d), [], 24, 46, `${a}/${d}`), y = 80; if (a > d) { out += strip(d, a - d, [], y, 46, ''); y += 56; } out += strip(bd, b, [], y + 10, 46, `${b}/${bd}`); return svg(out + note(caption, y + 92), `${a}/${d} and ${b}/${bd} shown as strips`, y + 106); };
const freqTable = f => recipeTable([['Length (m)', 'Count'], ['0 ≤ x < 1', f[0]], ['1 ≤ x < 2', f[1]], ['2 ≤ x < 3', f[2]]]);
const prismPic = (sides, caption = '', cut = false) => { const front = polyPts(sides, 230, 135, 65), back = front.map(([x, y]) => [x + 110, y - 50]); let out = shape(back, PAPER, INK, 3); front.forEach((p, i) => { out += line(p[0], p[1], back[i][0], back[i][1], INK, 3); }); out += shape(front, MINT, INK, 3); if (cut) { const midp = front.map(([x, y], i) => [(x + back[i][0]) / 2, (y + back[i][1]) / 2]); out += `<path d="M${midp.map(p => p.join(' ')).join(' L')} Z" fill="none" stroke="${CORAL}" stroke-width="4" stroke-dasharray="9 7"/>`; } return svg(out + (caption ? text(500, 190, caption, 20, FERN, mid) : ''), `A prism with ${sides}-sided ends${cut ? ', with a dashed cut parallel to the ends' : ''}`); };
const prismFacts = o => svg([['faces', o.faces], ['edges', o.edges], ['vertices', o.vertices], ['end sides', '?']].map(([l, v], i) => text(95 + i * 150, 60, l, 18, FERN, mid) + card(40 + i * 150, 75, 110, 80, v ?? '?', v != null ? LEMON : PAPER, 32)).join('') + note('a prism: two matching ends, a rectangle for every side'), `Prism facts: ${o.faces ?? '?'} faces, ${o.edges ?? '?'} edges, ${o.vertices ?? '?'} vertices`);
const spinnerPic = (n, g, word = 'green', color = LEAF) => { const cx = 200, cy = 118, r = 85; let out = ''; for (let i = 0; i < n; i++) { const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n; out += `<path d="M${cx} ${cy} L${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)} A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)} Z" fill="${i < g ? color : PAPER}" stroke="${INK}" stroke-width="3"/>`; } out += arrow(cx, cy, cx + 50, cy - 40, CORAL, 6) + blob(cx, cy, 7, 7, 0, INK, INK); return svg(out + text(450, 110, `${n} equal parts`, 24, INK, mid) + text(450, 145, `${g} ${word}`, 24, FERN, mid), `A spinner with ${n} equal parts, ${g} of them ${word}`); };
const dieFaces = (caption = 'one fair die: six faces') => svg([1, 2, 3, 4, 5, 6].map(i => rect(70 + (i - 1) * 85, 70, 70, 70, PAPER, INK) + text(105 + (i - 1) * 85, 118, i, 36, INK, mid)).join('') + note(caption, 190), 'The six faces of a die');
const coinFaces = caption => svg(blob(220, 110, 55, 55, 0, LEMON, INK) + text(220, 122, 'H', 40, INK, mid) + blob(420, 110, 55, 55, 0, LEMON, INK) + text(420, 122, 'T', 40, INK, mid) + note(caption, 200), 'A coin: heads or tails');
const countersPair = (A, B) => { const one = (x0, [r, n], name) => { let out = text(x0 + 110, 40, name, 22, FERN, mid); for (let i = 0; i < n; i++) out += blob(x0 + (i % 6) * 38, 80 + Math.floor(i / 6) * 40, 14, 14, 0, i < r ? CORAL : SKY, INK); return out; }; return svg(one(60, A, 'Bag A') + one(360, B, 'Bag B'), `Bag A: ${A[0]} red of ${A[1]}; Bag B: ${B[0]} red of ${B[1]}`); };
// Whole squares plus part squares of a kind: 'half' (triangles), 'quarter' (small squares) or 'part' (blobs).
const patchPic = (w, n, kind = 'half', label = '') => { const s = 40, W0 = typeof w === 'number' ? w : 0; let out = ''; for (let i = 0; i < W0; i++) out += rect(60 + (i % 7) * s, 36 + Math.floor(i / 7) * s, s, s, LEMON, INK); const y0 = 36 + Math.max(1, Math.ceil(W0 / 7)) * s + 12; if (typeof n === 'number') for (let i = 0; i < n; i++) { const x = 60 + (i % 9) * s, y = y0 + Math.floor(i / 9) * s; out += kind === 'half' ? shape([[x, y + s], [x + s, y + s], [x, y]], SKY, INK, 3) : kind === 'quarter' ? rect(x, y, s / 2, s / 2, SKY, INK) : blob(x + s / 2, y + s / 2, 16, 12, 20, SKY, INK); } out += text(560, 60, typeof w === 'number' ? `${w} whole` : '? whole', 20, typeof w === 'number' ? INK : FERN, mid) + text(560, 90, `${n} ${label || kind}`, 20, INK, mid); return svg(out, `${w} whole squares and ${n} ${label || kind} squares`, Math.max(220, y0 + (typeof n === 'number' ? Math.ceil(n / 9) : 1) * s + 16)); };
const patchPair = (A, B) => { const one = (x0, [w, h], name) => { let out = text(x0 + 100, 36, name, 22, FERN, mid); for (let i = 0; i < w; i++) out += rect(x0 + (i % 6) * 32, 50 + Math.floor(i / 6) * 32, 32, 32, LEMON, INK); const y0 = 50 + Math.ceil(w / 6) * 32 + 8; for (let i = 0; i < h; i++) { const x = x0 + (i % 6) * 32, y = y0 + Math.floor(i / 6) * 32; out += shape([[x, y + 32], [x + 32, y + 32], [x, y]], SKY, INK, 2); } return out; }; return svg(one(50, A, 'Leaf A') + one(350, B, 'Leaf B'), `Leaf A: ${A[0]} whole and ${A[1]} half; Leaf B: ${B[0]} whole and ${B[1]} half`, 240); };
// Two angles on a straight line; the known one is marked.
const straightAngle = a => { const cx = 320, cy = 160, r = 130, t = -a * Math.PI / 180; let out = line(80, cy, 560, cy, INK, 4) + line(cx, cy, cx + r * Math.cos(t), cy + r * Math.sin(t), INK, 4) + `<path d="M${cx + 45} ${cy} A45 45 0 ${a > 180 ? 1 : 0} 0 ${(cx + 45 * Math.cos(t)).toFixed(1)} ${(cy + 45 * Math.sin(t)).toFixed(1)}" fill="none" stroke="${CORAL}" stroke-width="5"/>` + `<path d="M${(cx + 60 * Math.cos(t)).toFixed(1)} ${(cy + 60 * Math.sin(t)).toFixed(1)} A60 60 0 0 0 ${cx - 60} ${cy}" fill="none" stroke="${SKY}" stroke-width="5"/>`; out += text(cx + 70 * Math.cos(t / 2) + 10, cy + 70 * Math.sin(t / 2) - 4, `${a}°`, 22, CORAL, mid) + text(cx - 90, cy - 40, '?', 34, FERN, mid); return svg(out + note('a straight line is 180°'), `An angle of ${a}° on a straight line, with the other angle unknown`); };
const linesPic = kind => { let out = ''; if (kind === 'perp') out = line(150, 180, 470, 80, INK, 5) + line(240, 40, 330, 210, INK, 5) + rect(0, 0, 0, 0, 'none', 'none') + note('they cross at a right angle'); else if (kind === 'parallel') out = line(130, 70, 480, 130, INK, 5) + line(120, 150, 470, 210, INK, 5) + note('the gap never changes'); else if (kind === 'tilted') out = line(190, 200, 300, 40, INK, 5) + line(330, 200, 440, 40, INK, 5) + note('both lean the same way'); else if (kind === 'cross') out = line(120, 180, 520, 100, INK, 5) + line(200, 60, 420, 200, INK, 5) + note('they cross, but not at a right angle'); else out = line(120, 150, 300, 90, INK, 5) + line(330, 140, 520, 140, INK, 5) + note('what if they kept going?'); return svg(out, kind === 'perp' ? 'Two lines crossing at a right angle' : kind === 'parallel' ? 'Two parallel lines' : kind === 'tilted' ? 'Two tilted lines with the same slope' : kind === 'cross' ? 'Two lines crossing at a slant' : 'A sloping line and a flat line that do not touch'); };
const namedShape = name => { if (/hexagon/.test(name)) return svg(regular(6, '', '', 320) , 'A regular hexagon'); if (/pentagon/.test(name)) return svg(regular(5, '', '', 320), 'A regular pentagon'); if (/square/.test(name)) return svg(rect(240, 40, 160, 160, LEMON, INK), 'A square', 230); if (/parallelogram/.test(name)) return svg(shape([[150, 180], [430, 180], [500, 60], [220, 60]], LEMON, INK, 4), 'A parallelogram'); if (/triangle/.test(name)) return svg(shape([[180, 190], [460, 190], [180, 50]], LEMON, INK, 4) + rect(180, 166, 24, 24, 'none', FERN), 'A right-angled triangle'); return svg(rect(150, 60, 340, 130, LEMON, INK), 'A rectangle'); };
const rectPlain = (l, w, unit = 'cm') => svg(rect(160, 60, 320, 130, LEMON, INK) + text(320, 46, `${l} ${unit}`, 22, INK, mid) + text(148, 132, `${w} ${unit}`, 22, INK, END) + note('which sides face each other?'), `A rectangle ${l} by ${w} ${unit}`);
const changePic = (price, pay) => svg(noteAt(150, 110, pay) + text(150, 170, 'you pay', 20, FERN, mid) + tag(400, 105, `$${Number(price).toFixed(2)}`, LEMON, 28) + text(400, 170, 'the price', 20, FERN, mid) + q(560, 120, 50), `A $${pay} note paying for something that costs $${price}`);
// A wide start card, one labelled arrow and a ? card, for six-digit numbers.
const bigHop = (left, label, right = '?') => svg(card(40, 65, 250, 90, left, PAPER, 30) + arrow(305, 110, 445, 110, CORAL, 6) + text(375, 90, label, 22, CORAL, mid) + card(460, 65, 140, 90, right, PAPER, 36), `${left}, then ${label}, gives ${right}`);
const TURNS = { quarter: '¼', half: '½', 'three-quarter': '¾', full: 'full' };
const timeHop = (s, e, caption = '? min') => svg(card(40, 65, 220, 90, s, PAPER, 30) + arrow(275, 110, 365, 110, CORAL, 6) + text(320, 92, caption, 22, CORAL, mid) + card(380, 65, 220, 90, e, PAPER, 30), `From ${s} to ${e}: ${caption}`);
const hm = (t, h24 = true) => h24 ? `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}` : `${((Math.floor(t / 60) + 11) % 12) + 1}:${String(t % 60).padStart(2, '0')} ${t < 720 ? 'a.m.' : 'p.m.'}`;
const t24 = p => { const m = p.match(/(\d{1,2}):(\d{2})/); return m ? [+m[1], +m[2]] : null; };
const RULES_Y5 = {
  // N01 numbers to one million
  'place-value value': p => { const [place, a] = n6(p); return svg(PL6.map((l, i) => text(140 + i * 72, 60, l, 18, FERN, mid)).join('') + text(320, 130, fmt(a), 54, INK, mid) + note(`which digit is in the ${fmt(place)}s place?`), `${fmt(a)} under the place labels`); },
  'compare large whole numbers': p => { const [a, b] = n6(p); return placePair(a, b); },
  'compose base-ten number': p => sumList(n6(p)),
  'order large whole numbers': p => bigCards(n6(p).slice(0, 4)),
  'apply place value when digits move': p => placeRow(PL6, String(n6(p)[0]).padStart(6, '0').split(''), 'swap the two digits'),
  'construct an ordered place-value number': p => { const ds = n6(p).filter(d => d < 10); return svg(ds.map((d, i) => card(50 + i * 70, 50, 60, 90, d, PAL[i % 4], 44)).join('') + arrow(480, 95, 520, 95, INK, 4) + [0, 1, 2, 3, 4, 5].map(i => rect(528 + i * 17, 65, 14, 60, 'none', INK)).join(''), `Digit cards ${ds.join(', ')} and six empty places`); },
  'number between two large numbers': p => { const [a, b] = n6(p); return bigLine(a, b, 4, null, 'which number lands in here?'); },
  'middle number when ordering large numbers': p => bigCards(n6(p).slice(0, 3)),
  'build a six-digit number with zero places': p => { const m = p.match(/(\d) hundred-thousands?, no ten-thousands, (\d) thousands, no hundreds, (\d) tens and (\d) one/); return m && placeRow(PL6, [m[1], '0', m[2], '0', m[3], m[4]]); },
  'digits to make a six-digit number': p => { const m = p.match(/digits ([\d, ]+) once/); return m && svg(nums(m[1]).map((d, i) => card(50 + i * 70, 50, 60, 90, d, PAL[i % 4], 44)).join('') + arrow(480, 95, 520, 95, INK, 4) + [0, 1, 2, 3, 4, 5].map(i => rect(528 + i * 17, 65, 14, 60, 'none', INK)).join(''), `Digit cards ${nums(m[1]).join(', ')} and six empty places`); },
  'compare hundred-thousands first': p => { const [a, b] = n6(p); return placePair(a, b); },
  'cross a large place boundary': p => { const m = p.match(/([\d,]+) (more|less) than ([\d,]+)/); return m && bigHop(m[3], (m[2] === 'more' ? '+ ' : '− ') + m[1]); },
  // N02 rounding
  'round whole numbers': p => { const [a, u] = n6(p), lo = Math.floor(a / u) * u; return bigLine(lo, lo + u, 2, a, `halfway is ${fmt(lo + u / 2)}`); },
  'round tenths and hundredths': p => { const x = n6(p)[0], lo = Math.floor(x); return bigLine(lo, lo + 1, 2, x, `halfway is ${fmt(lo + .5)}`); },
  'estimate using rounded values': p => { const [a, b, u] = n6(p); return bigEstimate(a, b, '+', fmt(u)); },
  'numbers that round to a given ten thousand': p => { const t = n6(p)[0]; return bigLine(t - 10000, t + 10000, 4, null, `which number lands nearest ${fmt(t)}?`); },
  'round a decimal measurement to a whole': p => { const x = n6(p)[0], lo = Math.floor(x); return bigLine(lo, lo + 1, 2, x, `halfway is ${fmt(lo + .5)}`); },
  'estimate by rounding to thousands': p => { const [a, b] = n6(p); return bigEstimate(a, b, '+', '1,000'); },
  'smallest number rounding to a thousand': p => { const h = n6(p)[0]; return bigLine(h - 1000, h, 2, null, 'halfway rounds up'); },
  'spot a rounding mistake with big numbers': p => { const [n, u] = n6(p), lo = Math.floor(n / u) * u; return bigLine(lo, lo + u, 2, n, `halfway is ${fmt(lo + u / 2)}`); },
  'estimate a difference by rounding to thousands': p => { const [a, b] = n6(p); return bigEstimate(a, b, '−', '1,000'); },
  // N03 counting
  'count in 11s or 12s': p => { const [s, k, st] = n6(p), back = /backwards/.test(p); return numberLine({ from: back ? s - st * (k + 1) : s, to: back ? s : s + st * (k + 1), tick: st, labels: false, noEnd: true, start: s, step: back ? -st : st, jumps: k, note: `${k} jumps of ${st}${back ? ' back' : ''}`, alt: `A number line from ${s} with ${k} jumps of ${st}` }); },
  'count in large base-ten units': p => { const m = p.match(/(\d[\d,]*)\. (?:Take (\d) forward jumps of ([\d,]+)|Each mission adds ([\d,]+) points\. Complete (\d))/); return m && bigHop(m[1], `+ ${m[3] || m[4]} × ${m[2] || m[5]}`); },
  'count backwards through zero': p => { const [s, n] = n6(p); return vertLine(s - n - 1, s + 1, [s], `drops ${n}`); },
  'count back through zero': p => { const [s, n] = n6(p); return numberLine({ from: s - n - 1, to: s + 1, tick: 1, start: s, step: -1, jumps: n, note: `${n} steps back`, alt: `A number line from ${s - n - 1} to ${s + 1} with ${n} steps back from ${s}` }); },
  'steps between two temperatures': p => { const [lo, hi] = n6(p); return vertLine(Math.min(lo, hi) - 1, Math.max(lo, hi) + 1, [lo, hi], 'from the lower dot to the higher'); },
  'missing number in an elevens or twelves pattern': p => { const t = dterms(p); return t && cardsRow(t); },
  'count large jumps backwards': p => { const [s, n, st] = n6(p); return bigHop(fmt(s), `− ${fmt(st)} × ${n}`); },
  'order negative and positive numbers': p => { const v = n6(p).slice(0, 3); return vertLine(Math.min(...v) - 1, Math.max(...v) + 1, v, 'which dot is lowest?'); },
  'which floor after a lift ride': p => { const [s, up, down] = n6(p); return vertLine(Math.min(s, s + up - down) - 1, Math.max(s + up, s) + 1, [s], `up ${up}, then down ${down}`); },
  // N04 large addition and subtraction
  'large-number addition': p => { const [a, b] = n6(p); return columnSum(a, b, '+'); },
  'large-number subtraction': p => { const [a, b] = n6(p); return columnSum(a, b, '−'); },
  'addition inverse in context': p => { const [a, t] = n6(p); return barModel(t, [a, '?']); },
  'addition with regrouping in context': p => { const [a, b] = n6(p); return columnSum(a, b, '+'); },
  'large-number addition/subtraction in measurement context': p => { const [a, b] = n6(p); return columnSum(a, b, /arrive/.test(p) ? '+' : '−'); },
  'missing addend with large numbers': p => { const [a, t] = n6(p); return barModel(t, [a, '?']); },
  'add three large numbers': p => groupsAdd(n6(p).slice(0, 3).map(fmt), dot),
  'fix a large addition mistake': p => { const [a, b] = n6(p); return columnSum(a, b, '+'); },
  'two changes with large numbers': p => { const [cap, x, y] = n6(p); return barModel(cap, [x, y, '?']); },
  'subtract from a round number': p => { const [a, b] = n6(p); return bigHop(fmt(a - 1), `− ${fmt(b)}, then + 1`); },
  'compare two differences': p => { const m = [...p.matchAll(/(\d[\d,]*) − (\d[\d,]*)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0]) : ''; },
  // N06 multiplication
  'three/four by one or two by two multiplication': p => { const m = p.match(/(\d+) × (\d+)/) || p.match(/holds (\d+) cards\. How many cards in (\d+)/) || p.match(/(\d+) rows of (\d+)/); if (!m) return ''; const a = +m[1], b = +m[2]; return b >= 10 && a < 100 ? areaModel(a, b) : a >= 100 ? partition3(a, b) : partitionPic(a, b); },
  'missing part of a split factor': p => { const m = p.match(/^(\d+) × (\d+) =/); return m && areaModel(+m[1], +m[2], 'ones'); },
  'multiply using a known product': p => { const m = p.match(/(\d+) × (\d+) = (\d+)\. Use it to find \d+ × (\d+)/); return m && scaleBy(`${m[1]} × ${m[2]} = ${m[3]}`, `${m[1]} × ${m[4]} = ?`, +m[4] / +m[2]); },
  'rows and columns in a story': p => { const [a, b] = n6(p); return areaModel(a, b); },
  'fix a partial-product mistake': p => { const m = p.match(/(\d+) × (\d+) as/); return m && areaModel(+m[1], +m[2]); },
  'two multiplications added': p => { const m = p.match(/(\d+) boxes of (\d+) (\w+) and (\d+) boxes of (\d+)/); return m && recipeTable([['boxes', 'in each', m[3]], [m[1], m[2], '?'], [m[4], m[5], '?'], ['', 'together', '?']]); },
  'compare two products': p => { const m = [...p.matchAll(/(\d+) × (\d+)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0]) : ''; },
  // N07 division with remainders
  'division with integer remainder': p => { const [a, d] = n6(p); return groupsOfKnown(a, d).replace('? groups', /remainder/.test(p) ? '? groups, ? left over' : /boats/.test(p) ? '? boats' : '? groups'); },
  'rebuild the dividend': p => { const [d, qt, r] = n6(p); return labelledGroups(qt, d, `+ ${r} left over`); },
  'leftover in a packing story': p => { const [n, d] = n6(p); return groupsOfKnown(n, d).replace('? groups', '? full, ? left over'); },
  'round down in a sharing story': p => { const [n, d] = n6(p); return groupsOfKnown(n, d).replace('? groups', '? full ones'); },
  'fix a remainder mistake': p => { const [n, d] = n6(p); return groupsOfKnown(n, d).replace('? groups', `? groups, remainder below ${d}`); },
  'how many more to the next multiple': p => { const [n, d] = n6(p); return groupsOfKnown(n, d).replace('? groups', 'the last row is not full'); },
  // N08 hundredths
  'hundredths as fractions and decimals': p => { const m = p.match(/(\d+)\/100/); return m && hundredGrid(+m[1]); },
  'compare fractions and decimals': p => { const m = p.match(/amounts: (\S+) □ (\S+)\./); return m && twoGrids(hundredthsOf(m[1]), hundredthsOf(m[2]), m[1], m[2]); },
  'recognise familiar decimal equivalents': p => { const m = p.match(/(\d+)\/(\d+)/); return m && hundredGrid(Math.round(100 * m[1] / m[2]), `${m[1]}/${m[2]} of the grid`); },
  'order decimals with two places': p => cards(dnums(p).slice(0, 3).map(String)),
  'hundredths from a shaded grid': p => hundredGrid(n6(p)[1]),
  'decimal to a hundredths fraction': p => hundredGrid(Math.round(100 * n6(p)[0])),
  'tenths versus hundredths comparison': p => { const m = p.match(/: (\S+) □ (\S+)\./); return m && twoGrids(hundredthsOf(m[1]), hundredthsOf(m[2]), m[1], m[2]); },
  'decimal between two decimals': p => { const [a, b] = n6(p); return bigLine(a, b, 10, null, 'one hundredth each tick'); },
  'fix a decimal comparison mistake': p => { const m = p.match(/says (\S+) > (\S+) because/); return m && twoGrids(hundredthsOf(m[1]), hundredthsOf(m[2]), m[1], m[2]); },
  'write hundredths in words as a decimal': () => placeRow(['ones', 'tenths', 'hundredths'], ['?', '?', '?'], 'the point sits after the ones'),
  // N09 scaling by ten and a hundred
  'scale base-ten units': p => { const m = p.match(/([\d.]+) (÷|×) (\d+) = \?/); if (m) return shiftPic(m[1], m[2], m[3]); const s = p.match(/Share ([\d.]+) litres equally between (\d+)/); if (s) return shiftPic(s[1], '÷', s[2]); const r = p.match(/ribbon is ([\d.]+) m\. Place (\d+)/); return r ? shiftPic(r[1], '×', r[2]) : ''; },
  'missing multiplier of ten or a hundred': p => { const m = p.match(/^([\d.]+) × □ = ([\d.]+)/); return m && hop(m[1], ['× ?'], m[2]); },
  'divide by ten twice': p => hop(String(n6(p)[0]), ['÷ 10', '÷ 10']),
  'scaling in a measurement story': p => { const m = p.match(/is ([\d.]+) m wide\. (\d+)/); return m && labelledGroups(+m[2], `${m[1]} m`); },
  'which operation scaled the number': p => { const m = p.match(/turns ([\d.]+) into ([\d.]+)/); return m && hop(m[1], ['?'], m[2]); },
  'fix a place-value shift mistake': p => { const m = p.match(/says ([\d.]+) × (\d+) =/); return m && shiftPic(m[1], '×', m[2]); },
  'two-step scaling': p => { const m = p.match(/Start with ([\d.]+)\. Multiply by (\d+), then divide by (\d+)/); return m && hop(m[1], [`× ${m[2]}`, `÷ ${m[3]}`]); },
  // N10 fractions
  'equivalent fraction family': p => { const m = p.match(/(\d+)\/(\d+) = □\/(\d+)/); return m && eqBars(+m[1], +m[2], +m[3]); },
  'compare related denominators': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? multiStrips([[+m[0][2], +m[0][1]], [+m[1][2], +m[1][1]]]) : ''; },
  'mixed number to improper fraction': p => { const m = p.match(/(\d+) and (\d+)\/(\d+)/); return m && mixedStrips(+m[1], +m[2], +m[3]); },
  'improper fraction whole component': p => { const m = p.match(/(\d+)\/(\d+)/); return m && svg(strip(+m[1], +m[1], [], 60, 60, '') + note(`${m[1]} parts; a whole is ${m[2]} parts`, 160), `A strip of ${m[1]} parts`, 180); },
  'simplify a fraction': p => { const m = p.match(/(\d+)\/(\d+)/); return m && stripPic(+m[2], +m[1], [], 'group the parts into bigger equal parts'); },
  'whole part when renaming an improper fraction': p => { const m = p.match(/(\d+)\/(\d+)/); return m && svg(strip(+m[1], +m[1], [], 60, 60, '') + note(`${m[1]} parts; a whole is ${m[2]} parts`, 160), `A strip of ${m[1]} parts`, 180); },
  'compare fractions with related denominators': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? multiStrips([[+m[0][2], +m[0][1]], [+m[1][2], +m[1][1]]]) : ''; },
  'fix an equivalence mistake': p => { const m = p.match(/says (\d+)\/(\d+) = \d+\/(\d+)/); return m && eqBars(+m[1], +m[2], +m[3]); },
  'order three fractions': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 3 ? multiStrips(m.slice(0, 3).map(x => [+x[2], +x[1]])) : ''; },
  // N11 fraction addition and subtraction
  'fraction operations with related denominators': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? fracPair(+m[0][1], +m[0][2], +m[1][1], +m[1][2], /−|Cut/.test(p) ? 'take the second away from the first' : 'put the two amounts together') : ''; },
  'missing fraction addend': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? fracPair(+m[1][1], +m[1][2], +m[0][1], +m[0][2], 'what fills the gap?') : ''; },
  'fraction story total': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? fracPair(+m[0][1], +m[0][2], +m[1][1], +m[1][2], 'put the two amounts together') : ''; },
  'fraction left after taking away': p => { const m = p.match(/(\d+)\/(\d+)/); return m && stripPic(+m[2], 0, [+m[1]], `${m[1]} of ${m[2]} pieces eaten`); },
  'two fraction changes': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 3 ? multiStrips(m.slice(0, 3).map((x, i) => [+x[2], +x[1], `${i === 1 ? '+ ' : i === 2 ? '− ' : ''}${x[0]}`])) : ''; },
  'fix a denominator-adding mistake': p => { const m = [...p.matchAll(/(\d+)\/(\d+)/g)]; return m.length >= 2 ? fracPair(+m[0][1], +m[0][2], +m[1][1], +m[1][2], 'cut the first strip into the same-size parts') : ''; },
  'fraction sum beyond one': p => { const m = [...p.matchAll(/(\d+\/\d+) \+ (\d+\/\d+)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0], 'which is more than 1 whole?') : ''; },
  // N12 decimals
  'add/subtract hundredths': p => { const [a, b] = dnums(p); return columnSum(a.toFixed(2), b.toFixed(2), /\+|Add/.test(p) ? '+' : '−'); },
  'missing decimal addend': p => { const [a, s] = dnums(p); return barModel(s, [a, '?']); },
  'decimal lengths total': p => { const [a, b] = dnums(p); return endToEnd([a, b], 'm'); },
  'decimal difference as comparison': p => { const [a, b] = dnums(p); return compareBars(a, b); },
  'two decimal changes': p => { const [s, a, c] = dnums(p); return takeAway(s, [c], [a], dot); },
  'fix a decimal line-up mistake': p => { const [a, b] = dnums(p); return columnSum(a.toFixed(2), b.toFixed(2), '+'); },
  'compare two decimal sums': p => { const m = [...p.matchAll(/([\d.]+) \+ ([\d.]+)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0]) : ''; },
  // N13 fractions of amounts
  'non-unit fractional part/whole': p => { const r = p.match(/(\d+) cm ribbon is split into (\d+) equal parts\. What is the length of (\d+) parts/); if (r) return fracBar(+r[2], +r[3], '?', `${r[1]} cm`); const m = p.match(/(\d+)\/(\d+)/); if (!m) return ''; const w = n6(p.replace(/\d+\/\d+/g, ' '))[0]; return /whole collection/.test(p) ? fracBar(+m[2], +m[1], w, '?') : fracBar(+m[2], +m[1], '?', w); },
  'fraction of an amount in a story': p => { const m = p.match(/There are (\d+) \w+\. (\d+)\/(\d+)/); return m && fracBar(+m[3], +m[2], '?', m[1]); },
  'whole from a non-unit fraction': p => { const m = p.match(/(\d+)\/(\d+) of the .* is (\d+)/); return m && fracBar(+m[2], +m[1], m[3], '?'); },
  'remaining amount after a fraction': p => { const m = p.match(/have (\d+) (\w+).*?(\d+)\/(\d+)/); return m && fracBar(+m[4], +m[3], 'used', `${m[1]} ${m[2]}`); },
  'compare two fractional amounts': p => { const m = [...p.matchAll(/(\d+\/\d+ of \d+)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0], 'which is more?') : ''; },
  'fix a fraction-of-amount mistake': p => { const m = p.match(/(\d+)\/(\d+) of (\d+)/); return m && fracBar(+m[2], +m[1], '?', m[3]); },
  'two-step fraction of an amount': p => { const m = p.match(/has (\d+) \w+\. (\d+)\/(\d+)/); return m && fracBar(+m[3], +m[2], '?', m[1]); },
  // N14 percentages
  'common percentage representation': p => { const m = p.match(/(\d+)%/); return m && hundredGrid(+m[1]); },
  'common percent of whole': p => { const m = p.match(/(\d+)% of (\d+)/); return m && fracBar(100 / +m[1], 1, '?', m[2]); },
  'whole from 25 or 50 percent': p => { const m = p.match(/(\d+)% of a .* is (\d+)/); return m && fracBar(100 / +m[1], 1, m[2], '?'); },
  'percent as a part of a set': p => { const m = p.match(/has (\d+) squares/); return m && fracBar(2, 1, '?', m[1]); },
  'percentage in money context': p => { const m = p.match(/(\d+)% of \$(\d+)/); return m && fracBar(100 / +m[1], 1, '?', `$${m[2]}`); },
  'fraction to a percentage': p => { const m = p.match(/(\d+)\/(\d+)/); return m && stripPic(+m[2], +m[1], [], 'how many out of 100?'); },
  'percent of a number': p => { const m = p.match(/(\d+)% of (\d+)/); return m && fracBar(100 / +m[1], 1, '?', m[2]); },
  'the rest after a percentage': p => { const m = p.match(/(\d+)% of (\d+)/); return m && fracBar(100 / +m[1], 1, `${m[1]}%`, m[2]).replace('</svg>', note('the rest?', 20) + '</svg>'); },
  'whole from a percentage': p => { const m = p.match(/(\d+)% of .*? is (\d+)/); return m && fracBar(100 / +m[1], 1, m[2], '?'); },
  'compare two percentages of amounts': p => { const m = [...p.matchAll(/(\d+% of \d+)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0], 'which is more?') : ''; },
  'fix a percentage mistake': p => { const m = p.match(/(\d+)% of (\d+) is/); return m && fracBar(100 / +m[1], 1, '?', m[2]); },
  // N15 money
  'money decimal units, totals, change and rounding': p => { let m = p.match(/costs \$([\d.]+) and another costs \$([\d.]+)/); if (m) return groupsAdd([`$${m[1]}`, `$${m[2]}`], dot); m = p.match(/bill is \$([\d.]+)\. Pay \$(\d+)/); if (m) return changePic(m[1], +m[2]); m = p.match(/(\d+) dollars and (\d+) cents/); if (m) return placeRow(['dollars', 'cents'], [m[1], m[2]], '100 cents make a dollar'); m = p.match(/Round \$([\d.]+)/); if (m) { const lo = Math.floor(+m[1]); return bigLine(lo, lo + 1, 2, +m[1], `halfway is ${lo}.50`); } return ''; },
  'total of three prices': p => groupsAdd((p.match(/\$[\d.]+/g) || []).slice(0, 3), dot),
  'change from a note': p => { const m = p.match(/costs \$([\d.]+)\. You pay with a \$(\d+)/); return m && changePic(m[1], +m[2]); },
  'cents to dollars': p => placeRow(['dollars', 'cents'], ['?', '?'], `${fmt(n6(p)[0])} cents; 100 cents make a dollar`),
  'cost of several items': p => { const m = p.match(/costs \$([\d.]+)\. How much do (\d+)/); return m && labelledGroups(+m[2], `$${m[1]}`); },
  'how many can you afford': p => { const m = p.match(/have \$(\d+)\. \w+ cost \$([\d.]+)/); return m && groupsOfKnown(`$${m[1]}`, `$${m[2]}`).replace('? groups', '? of them'); },
  'fix a money addition mistake': p => { const m = p.match(/\$([\d.]+) \+ \$([\d.]+)/); return m && columnSum((+m[1]).toFixed(2), (+m[2]).toFixed(2), '+'); },
  // A01 equality
  'compare equivalent expressions': p => { const m = p.match(/^(.+?) □ (.+?)\.$/); return m && versus(m[1], m[2], '<, = or >?'); },
  'compare different expressions': p => { const m = p.match(/^(.+?) □ (.+?)\.$/); return m && versus(m[1], m[2], '<, = or >?'); },
  'complete open number sentence': p => { const m = p.match(/(\d+) − □ = (\d+)/); return m && barModel(+m[1], ['?', +m[2]]); },
  'check equality': p => { const m = p.match(/Is (.+?) = (.+?) true/); return m && versus(m[1], m[2], 'equal?'); },
  'missing number keeping sides equal': p => { const m = p.match(/(\d+) \+ (\d+) = (\d+) \+ □/); return m && balance(`${m[1]} + ${m[2]}`, `${m[3]} + ?`); },
  'balance with multiplication': p => { const m = p.match(/(\d+) × (\d+) = (\d+) × □/); return m && balance(`${m[1]} × ${m[2]}`, `${m[3]} × ?`); },
  'true or false equation': p => { const m = p.match(/Is (.+?) = (.+?) true/); return m && versus(m[1], m[2], 'equal?'); },
  'equal unknowns': p => { const m = p.match(/^((?:□ \+ )+□) = (\d+)/); return m && barModel(+m[2], m[1].split(' + ').map(() => '?')); },
  'balance story': p => { const m = p.match(/a (\d+) g weight and a (\w+)\. Right pan: (\d+) g/); return m && balance(`${m[1]} g + ?`, `${m[3]} g`); },
  'keep a balance after adding': p => { const m = p.match(/(\d+) \+ (\d+) = (\d+)\. Add (\d+)/); return m && balance(`${m[1]}+${m[2]}+${m[4]}`, `${m[3]}+${m[4]}`); },
  // A02 patterns
  'constant additive pattern': p => { const t = dterms(p); return t ? cardsRow(t) : ''; },
  'constant multiplicative pattern': p => { const t = dterms(p); return t ? cardsRow(t, 'same multiplier each time') : ''; },
  'constant division pattern': p => { const t = dterms(p); return t ? cardsRow(t, 'divide by the same number each time') : ''; },
  'missing middle term': p => { const t = dterms(p); return t ? cardsRow(t) : ''; },
  'rule from the terms': p => { const t = dterms(p); return t ? cardsRow([...t, '…'], 'what happens each step?') : ''; },
  'nth term of an additive pattern': p => { const m = p.match(/starts at ([\d.]+) and (adds|subtracts) ([\d.]+) each time\. What is the (\d+)/); if (!m) return ''; const s = +m[1], st = (m[2] === 'adds' ? 1 : -1) * +m[3], n = +m[4]; return numberLine({ from: Math.min(s, s + st * n), to: Math.max(s, s + st * n), tick: Math.abs(st), labels: false, start: s, step: st, jumps: n - 1, note: `${n - 1} jumps of ${Math.abs(st)}`, alt: `A number line from ${s} with ${n - 1} jumps of ${st}` }); },
  'first term from a later term': p => { const m = p.match(/adds ([\d.]+) each time\. The (\d+)\w+ number is ([\d.]+)/); return m && cardsRow([...Array(+m[2] - 1).fill('?'), m[3]], `+ ${m[1]} each step`); },
  'fix a pattern mistake': p => { const m = p.match(/continues ([\d, ]+) with/); return m && cardsRow([...m[1].split(/,\s*/), '?'], 'check what really happens each step'); },
  'how many steps to reach a term': p => { const m = p.match(/Start at (\d+) and (add|subtract) ([\d.]+) each time.*reach (\d+)/); return m && hop(m[1], [`${m[2] === 'add' ? '+' : '−'} ${m[3]}`, `${m[2] === 'add' ? '+' : '−'} ${m[3]}`, '…'], m[4]); },
  // M01 measuring tools
  'value of one space on a scale': p => { const m = p.match(/0 to (\d+) (\S+) in (\d+)/); return m && scaleBar(0, +m[1], +m[3], null, m[2]); },
  'reading from spaces past a label': p => { const m = p.match(/labelled (\d+) and (\d+) (\S+), with (\d+) equal spaces.* sits (\d+) space/); return m && scaleBar(+m[1], +m[2], +m[4], +m[5], m[3]); },
  'read below a labelled mark': p => { const m = p.match(/read (\d+) and (\d+) (\S+), with (\d+) equal spaces.*pointer is (\d+) space/); return m && scaleBar(+m[1], +m[2], +m[4], +m[4] - +m[5], m[3]); },
  'difference between two readings': p => { const m = p.match(/(\d+) (\S+) .*?(\d+) \2/); return m && labelBars([[+m[1], `${m[1]} ${m[2]} before`], [+m[3], `${m[3]} ${m[2]} after`]]); },
  'fix a scale-reading mistake': p => { const m = p.match(/0 to (\d+) (\S+) with (\d+) equal spaces\. The pointer is (\d+)/); return m && scaleBar(0, +m[1], +m[3], +m[4], m[2], 'each space is worth more than 1'); },
  // M02 metres and centimetres
  'convert metres and centimetres': p => { let m = p.match(/is (\d+) cm long\. Write/); if (m) return metreStrip(+m[1]); m = p.match(/is ([\d.]+) m long\. How many centimetres/); if (m) return metreStrip(Math.round(+m[1] * 100), true).replace(/\d[\d,]* cm altogether/, `${m[1]} m altogether`); m = p.match(/Write (\d+) m and (\d+) cm/); if (m) return metreStrip(+m[1] * 100 + +m[2]); m = p.match(/measure (\d+) cm and ([\d.]+) m/); return m ? labelBars([[+m[1], `${m[1]} cm`], [Math.round(+m[2] * 100), `${m[2]} m`]]) : ''; },
  'whole metres in a centimetre length': p => metreStrip(n6(p)[0]),
  'order mixed lengths': (p, item) => item?.choices ? cards(item.choices.map(c => c.label ?? c)) : '',
  'total of two mixed lengths': p => { const m = p.match(/measure ([\d.]+) m and (\d+) cm/); return m && labelBars([[Math.round(+m[1] * 100), `${m[1]} m`], [+m[2], `${m[2]} cm`]]); },
  'difference of mixed lengths': p => { const m = p.match(/is ([\d.]+) m long and a \w+ is (\d+) cm/); return m && labelBars([[Math.round(+m[1] * 100), `${m[1]} m`], [+m[2], `${m[2]} cm`]]); },
  'fix a metre-centimetre conversion': p => { const m = p.match(/(\d+) m (\d+) cm =/); return m && metreStrip(+m[1] * 100 + +m[2]); },
  'how many pieces from a length': p => { const m = p.match(/is (\d+) m long\. How many (\d+) cm/); return m && groupsOfKnown(`${m[1]} m`, `${m[2]} cm`).replace('? groups', '? pieces'); },
  // M03 area and perimeter
  'rectangle area': p => { const [a, b] = n6(p); return areaGrid(a, b); },
  'polygon perimeter': p => { const [a, b] = n6(p); return rectangle({ l: b, w: a, unit: 'm' }); },
  'regular polygon perimeter': p => { const [n, s] = n6(p); return svg(regular(n, `${s} cm`, '', 230), `A regular ${n}-sided shape with ${s} cm sides`); },
  'area does not fix perimeter': p => { const [a, b, c, d] = n6(p); return twoRects([a, b], [c, d], 'cm'); },
  'use perimeter to find a missing side': p => { const [pm, a] = n6(p); return rectangle({ l: '?', w: a, unit: 'm', around: `${pm} m` }); },
  'side from an area': p => { const [ar, s] = n6(p); return areaGrid(s, Math.min(6, Math.round(ar / s)), { hideCols: true, caption: `${ar} cm² altogether` }); },
  'perimeter of a square from its area': p => squareQ(n6(p)[0]),
  'area of two joined rectangles': p => { const [a, b, c, d] = n6(p); return lGrid(a, b, c, d); },
  'perimeter does not fix area': p => { const [a, b, c, d] = n6(p); return twoRects([a, b], [c, d], 'cm'); },
  'fix an area-perimeter mix-up': p => { const [a, b] = n6(p); return areaGrid(a, b); },
  'largest area for a perimeter': p => rectangle({ l: '?', w: '?', unit: 'cm', around: `${n6(p)[0]} cm` }),
  // M04 irregular area
  'halves into whole squares': p => { const [w, h] = n6(p); return patchPic(w, h, 'half'); },
  'quarters into whole squares': p => { const [w, qd] = n6(p); return patchPic(w, qd, 'quarter'); },
  'best estimate from part squares': p => { const [w, n] = n6(p); return patchPic(w, n, 'part'); },
  'whole squares from an estimate': p => { const [, h] = n6(p); return patchPic('?', h, 'half'); },
  'fix a half-square mistake': p => { const [w, h] = n6(p); return patchPic(w, h, 'half'); },
  'compare two area estimates': p => { const [a, b, c, d] = n6(p); return patchPair([a, b], [c, d]); },
  // M05 volume
  'volume by equal layers': p => { let m = p.match(/has (\d+) layers\. Each layer has (\d+)/); if (m) return layersPic(+m[1], +m[2]); m = p.match(/(\d+) rows of (\d+) cubes in each layer, and (\d+) layers/); if (m) return layersPic(+m[3], `${m[1]} × ${m[2]}`); m = p.match(/holds (\d+) one-cm cubes in (\d+) equal layers/); return m ? layersPic(+m[2], '?', `${m[1]} cubes altogether`) : ''; },
  'layers from a volume': p => { const [t, per] = n6(p); return layersPic('?', per, `${t} cubes altogether`); },
  'volume from three dimensions': p => { const [l, w, h] = n6(p); return layersPic(h, `${l} × ${w}`); },
  'add a layer of cubes': p => { const [l, t] = n6(p); return layersPic(l + 1, '?', `${t} cubes in ${l} layers, then one more layer`); },
  'compare two cuboids': p => { const m = [...p.matchAll(/(\d+ by \d+ by \d+)/g)]; return m.length >= 2 ? versus(m[0][0], m[1][0], 'which holds more cubes?') : ''; },
  'fix a top-layer mistake': p => { const [top, l] = n6(p); return layersPic(l, top); },
  'missing dimension from a volume': p => { const [v, l, w] = n6(p); return layersPic('?', `${l} × ${w}`, `${v} cubes altogether`); },
  // M06 angles
  'degrees in a turn': p => { const m = p.match(/in a ([\w-]+) turn/); return m && compassPic('North', `${TURNS[m[1]] || m[1]} turn ↻`); },
  'angle from a benchmark': p => { const m = p.match(/(\d+)° (more|less) than a (right|straight)/); return m && hop(m[3] === 'right' ? '90°' : '180°', [`${m[2] === 'more' ? '+' : '−'} ${m[1]}°`]); },
  'angles on a straight line': p => straightAngle(n6(p)[0]),
  'classify a computed angle': p => { const a = n6(p)[0]; return /straight line/.test(p) ? straightAngle(a) : anglePic(a); },
  'fix an angle classification mistake': p => anglePic(n6(p)[0]),
  'angle between clock hands': p => clockPic(n6(p)[0], 0),
  // M07 time
  'elapsed time in 24-hour notation': p => { const m = p.match(/(\d\d:\d\d) and ends at (\d\d:\d\d)/); return m && timeHop(m[1], m[2]); },
  'elapsed time across noon': p => { const m = p.match(/from (\d{1,2}:\d\d [ap]\.m\.) to (\d{1,2}:\d\d [ap]\.m\.)/); return m && timeHop(m[1], m[2]); },
  'link twelve and twenty-four hour time': p => { const t = t24(p); return t && clockPic(t[0], t[1], 'after noon'); },
  'end time from a start and a length': p => { const t = t24(p), d = p.match(/lasts (\d+)/); return t && d && clockPic(t[0] % 12 || 12, t[1], `+ ${d[1]} min`); },
  'minutes past whole hours': p => { const mins = n6(p)[0]; return numberLine({ from: 0, to: mins, tick: 60, mark: mins, note: 'an hour each tick', alt: `A number line from 0 to ${mins} minutes in hours` }); },
  'twenty-four hour to twelve hour': p => { const t = t24(p); return t && clockPic(t[0] % 12 || 12, t[1], t[0] >= 12 ? 'after noon' : 'before noon'); },
  'start time from an end': p => { const t = t24(p), d = p.match(/lasted (\d+)/); return t && d && clockPic(t[0] % 12 || 12, t[1], `− ${d[1]} min = start?`); },
  'elapsed minutes across midday': p => { const m = p.match(/from (\d{1,2}:\d\d a\.m\.) to (\d{1,2}:\d\d p\.m\.)/); return m && timeHop(m[1], m[2], '? min'); },
  'fix a time subtraction mistake': p => { const m = p.match(/from (\d\d):(\d\d) to (\d\d:\d\d)/); return m && clockPic(+m[1] % 12 || 12, +m[2], `until ${m[3]}`); },
  // G01 lines
  'identify perpendicular lines': () => linesPic('perp'),
  'distinguish non-right intersections': p => anglePic(n6(p)[0]),
  'parallel sides of polygons': p => { const [a, b] = n6(p); return rectPlain(b, a); },
  'count parallel pairs': p => { const m = p.match(/does a (.+?) have/); return m && namedShape(m[1]); },
  'count right angles in a shape': p => { const m = p.match(/does a (.+?) have/); return m && namedShape(m[1]); },
  'lines in letters': (p, item) => item?.choices ? cards(item.choices.map(c => c.label ?? c)) : '',
  'decide if lines are parallel': p => linesPic(/slopes up/.test(p) ? 'neither' : /apart/.test(p) ? 'parallel' : /cross/.test(p) ? 'cross' : 'tilted'),
  'fix a perpendicular mistake': p => { const d = n6(p)[0]; return d ? anglePic(d) : linesPic('perp'); },
  'angles at a perpendicular crossing': () => linesPic('perp'),
  // G02 prisms
  'prism vertices': p => prismPic(n6(p)[0]),
  'prism edges': p => prismPic(n6(p)[0]),
  'connect prism net and cross section': p => prismPic(n6(p)[0] || 4),
  'end shape from the face count': p => prismFacts({ faces: n6(p)[0] }),
  'end shape from the vertex count': p => prismFacts({ vertices: n6(p)[0] }),
  'cross-section parallel to the ends': p => { const m = p.match(/a (\w+) prism/); return m && prismPic({ triangular: 3, square: 4, pentagonal: 5, hexagonal: 6 }[m[1]] || 4, 'cut along the dashes', true); },
  'edges from vertices': p => prismFacts({ vertices: n6(p)[0] }),
  'faces from edges': p => prismFacts({ edges: n6(p)[0] }),
  // G03 transformations
  'rotation in degrees': p => { const m = p.match(/rotated (?:a |two )?([\w-]+) turns?/); return m && compassPic('North', `${/two/.test(p) ? 'two ' : ''}${TURNS[m[1]] || m[1]} turn${/two/.test(p) ? 's' : ''} ${/anticlockwise/.test(p) ? '↺' : '↻'}`); },
  'complete a full turn': p => compassPic('North', `turned ${n6(p)[0]}° ↻ so far`),
  'translation on a grid': p => { const [c, n] = n6(p), d = p.match(/to the (left|right)/); return d && gridPic(1, 10, [0, c], `slides ${n} ${d[1]} ${d[1] === 'right' ? '→' : '←'}`, true); },
  'distance across a mirror line': p => mirrorPic(n6(p)[0]),
  'fix a transformation mistake': () => svg(shape([[80, 180], [80, 70], [230, 180]], LEMON, INK, 3) + arrow(270, 125, 360, 125, CORAL, 5) + text(315, 105, 'which move?', 18, CORAL, mid) + shape([[400, 180], [400, 70], [550, 180]], PAPER, INK, 3) + note('slide, flip or turn?'), 'A triangle before and after a move'),
  // G04 grid maps
  'follow grid map pathway': p => { const m = p.match(/Start in ([A-E])(\d)\. Move (\d) squares? east/); return m && gridPic(5, 5, ['ABCDE'.indexOf(m[1]), +m[2]], `${m[3]} squares east →`, true); },
  'cardinal directions on grid map': p => { const m = p.match(/from ([A-E])(\d) to ([A-E])(\d)/); return m && gridPic(5, 5, ['ABCDE'.indexOf(m[1]), +m[2]], `from ${m[1]}${m[2]} to ${m[3]}${m[4]}: which way?`, true); },
  'grid reference after two moves': p => { const m = p.match(/Start in ([A-E])(\d)\. Move (\d) squares? east, then (\d) squares? (south|north)/); return m && gridPic(5, 5, ['ABCDE'.indexOf(m[1]), +m[2]], `${m[3]} east →, then ${m[4]} ${m[5]} ${m[5] === 'south' ? '↓' : '↑'}`, true); },
  'opposite move on a map': p => { const m = p.match(/goes (\d) squares? (north|east|south|west)/); return m && compassPic(m[2][0].toUpperCase() + m[2].slice(1), `${m[1]} ${m[2]}; back?`); },
  'count squares in a route': p => { const m = p.match(/Walk (\d) squares? east, (\d) squares? south, then (\d) squares? east/); return m && cardsRow([`${m[1]} east`, `${m[2]} south`, `${m[3]} east`], 'how many squares in all?'); },
  'direction between two squares': p => { const m = p.match(/from ([A-E])(\d) to ([A-E])(\d)/); return m && gridPic(5, 5, ['ABCDE'.indexOf(m[1]), +m[2]], `to ${m[3]}${m[4]}: which way?`, true); },
  'fix a grid-reference mistake': p => { const m = p.match(/row ([A-E]), column (\d)/); return m && gridPic(5, 5, ['ABCDE'.indexOf(m[1]), +m[2]], 'row letter, then column number', true); },
  'squares entered on a straight path': p => { const m = p.match(/from ([A-E])(\d) to ([A-E])(\d)/); return m && gridPic(5, 5, ['ABCDE'.indexOf(m[1]), +m[2]], `to ${m[3]}${m[4]}, one square at a time`, true); },
  // S01 grouping measurements
  'round continuous measurements to a stated precision': p => { const x = n6(p)[0], lo = Math.floor(x); return bigLine(lo, lo + 1, 2, x, `halfway is ${fmt(lo + .5)}`); },
  'group continuous measurements': p => { const m = p.match(/m: ([\d., ]+)\./); return m && replyCards(m[1].split(/,\s*/)); },
  'assign a continuous value to one group': p => { const v = n6(p)[0], lo = Math.floor(v); return bigLine(lo - 1, lo + 2, 3, v, 'lower end in, upper end out'); },
  'count values in a group': p => { const m = p.match(/m: ([\d., ]+)\./); return m && replyCards(m[1].split(/,\s*/)); },
  'boundary value in a group': p => { const [v, lo] = n6(p); return bigLine(lo, lo + 3, 3, v, 'lower end in, upper end out'); },
  'record to a stated precision': p => { const [v, u] = n6(p), lo = Math.floor(v / u) * u; return bigLine(lo, lo + u, 2, v, `halfway is ${fmt(lo + u / 2)}`); },
  'group counts add to the total': p => { const [t, a, b] = n6(p); return barChart(['1st', '2nd', '3rd'], [a, b, null], { title: `${t} measured` }); },
  'choose a group width': p => { const [lo, hi, n] = n6(p); return bigLine(lo, hi, 1, null, `${n} equal groups from ${lo} to ${hi}?`); },
  // S02 paired categories
  'record two categorical variables together': () => recipeTable([['child', 'group', 'travel'], ['1', 'A', 'Walk'], ['2', '?', '?']], 'one row per child'),
  'total of one category across groups': p => { const [a, b] = n6(p); return clusterBars(a, 0, b, 0); },
  'missing count in a two-way table': p => { const [n, w] = n6(p); return recipeTable([['Group B', 'walk', 'ride', 'all'], ['count', w, '?', n]]); },
  'combine one column of a two-way table': p => { const [aw, ar, bw, br] = n6(p); return recipeTable([['', 'walk', 'ride'], ['Group A', aw, ar], ['Group B', bw, br]]); },
  'compare shares across groups': p => { const [aw, an, bw, bn] = n6(p); return recipeTable([['', 'walk', 'children'], ['Group A', aw, an], ['Group B', bw, bn]]); },
  'total records from a clustered graph': p => { const [aw, ar, bw, br] = n6(p); return clusterBars(aw, ar, bw, br); },
  // S03 grouped data
  'total frequency': p => freqTable(n6(p).slice(0, 3)),
  'group with the fewest': p => { const m = p.match(/hold (\d+), (\d+) and (\d+)/); return m && freqTable([+m[1], +m[2], +m[3]]); },
  'count below a boundary': p => { const m = p.match(/0–<1 m: (\d+), 1–<2 m: (\d+), 2–<3 m: (\d+)/); return m && freqTable([+m[1], +m[2], +m[3]]); },
  'difference between groups': p => freqTable(n6(p).slice(0, 3)),
  'claim supported by grouped data': p => { const m = p.match(/0–<1 m: (\d+), 1–<2 m: (\d+), 2–<3 m: (\d+)/); return m && freqTable([+m[1], +m[2], +m[3]]); },
  'fix a label-count mix-up': p => { const m = p.match(/0–<1 m: (\d+), 1–<2 m: (\d+), 2–<3 m: (\d+)/); return m && freqTable([+m[1], +m[2], +m[3]]); },
  // P01 chance
  'likelihood on a zero-to-one line': p => { const [r, b] = n6(p); return counters(r + b, r); },
  'likelihood vocabulary': p => { const [r, b] = n6(p); return counters(r + b, r); },
  'connect a decimal forecast to likelihood language': () => fracLine(4, 1),
  'construct an even-chance model': p => { const [r, b] = n6(p); return counters(r + b, r); },
  'probability from a spinner': p => { const [n, g] = n6(p); return spinnerPic(n, g); },
  'likelihood word for a fraction': p => { const m = p.match(/of (\d+)(?:\/(\d+))?\./); return m && fracLine(m[2] ? +m[2] : 2, m[2] ? +m[1] : +m[1] * 2); },
  'closer to zero or one': p => { const m = p.match(/is (\d+)\/(\d+)\./); return m && fracLine(+m[2], +m[1]); },
  'make an event certain': p => { const [r, b] = n6(p); return counters(r + b, r); },
  'fix a likelihood mistake': p => { const [r, b] = n6(p); return counters(r + b, r); },
  'compare two chances': p => { const [a, b, c, d] = n6(p); return countersPair([a, b], [c, d]); },
  // P02 experiments
  'read observed experiment outcomes': p => { const [t, r] = n6(p); return barChart(['red', 'blue'], [r, null], { title: `${t} spins` }); },
  'simple equally likely event probability': p => { const [t, g] = n6(p); return spinnerPic(t, g, 'stars', LEMON); },
  'outcome probabilities sum to one': p => { const [t, r] = n6(p); return spinnerPic(t, r, 'red', CORAL); },
  'expected count from a probability': p => { const n = n6(p)[0]; return /coin/.test(p) ? coinFaces(`${n} tosses`) : /die/.test(p) ? dieFaces(`${n} rolls`) : spinnerPic(3, 1, 'red', CORAL); },
  'probability of not': p => { const m = p.match(/= (\d+)\/(\d+)/); return m && fracLine(+m[2], +m[1]); },
  'die event probability': () => dieFaces(),
  'fix a sample-space mistake': () => dieFaces(),
  'fraction of trials': p => { const [r, n] = n6(p); return barChart(['red', 'other'], [r, n - r], { title: `${n} spins` }); },
};

const cache = new Map();
// Lessons whose questions are expected to carry pictures (every Year 3, Year 4 and Year 5 lesson).
export const PICTURE_LESSONS = ['Y3-N01', 'Y3-N02', 'Y3-N03', 'Y3-N04', 'Y3-N05', 'Y3-N06', 'Y3-N07', 'Y3-N08', 'Y3-N09', 'Y3-N10', 'Y3-N11', 'Y3-N12', 'Y3-N13', 'Y3-N14', 'Y3-N15', 'Y3-N16', 'Y3-N17', 'Y3-N18', 'Y3-N19', 'Y3-N20', 'Y3-N21', 'Y3-N22', 'Y3-N23', 'Y3-A01', 'Y3-A02', 'Y3-M01', 'Y3-M02', 'Y3-M03', 'Y3-M04', 'Y3-M05', 'Y3-M06', 'Y3-M07', 'Y3-M08', 'Y3-G01', 'Y3-G02', 'Y3-G03', 'Y3-G04', 'Y3-S01', 'Y3-S02', 'Y3-S03', 'Y4-N01', 'Y4-N02', 'Y4-N03', 'Y4-N04', 'Y4-N05', 'Y4-N06', 'Y4-N07', 'Y4-N08', 'Y4-N09', 'Y4-N10', 'Y4-N11', 'Y4-N12', 'Y4-N13', 'Y4-N14', 'Y4-N15', 'Y4-N16', 'Y4-N17', 'Y4-N18', 'Y4-N19', 'Y4-A01', 'Y4-A02', 'Y4-A03', 'Y4-M01', 'Y4-M02', 'Y4-M03', 'Y4-M04', 'Y4-M05', 'Y4-M06', 'Y4-M07', 'Y4-M08', 'Y4-M09', 'Y4-G01', 'Y4-G02', 'Y4-G03', 'Y4-G04', 'Y4-G05', 'Y4-S01', 'Y4-S02', 'Y4-S03', 'Y4-S04', 'Y5-N01', 'Y5-N02', 'Y5-N03', 'Y5-N04', 'Y5-N05', 'Y5-N06', 'Y5-N07', 'Y5-N08', 'Y5-N09', 'Y5-N10', 'Y5-N11', 'Y5-N12', 'Y5-N13', 'Y5-N14', 'Y5-N15', 'Y5-A01', 'Y5-A02', 'Y5-M01', 'Y5-M02', 'Y5-M03', 'Y5-M04', 'Y5-M05', 'Y5-M06', 'Y5-M07', 'Y5-G01', 'Y5-G02', 'Y5-G03', 'Y5-G04', 'Y5-S01', 'Y5-S02', 'Y5-S03', 'Y5-P01', 'Y5-P02'];
export function pictureFor(item) {
  if (!item || item.diagram_svg || !item.representation?.skill) return '';
  if (cache.has(item.id)) return cache.get(item.id);
  const id = String(item.id), skill = item.representation.skill;
  const rule = (id.startsWith('Y5-') && (RULES_Y5[skill] || RULES_Y4[skill])) || (id.startsWith('Y4-') && RULES_Y4[skill]) || RULES[skill];
  let out = '';
  if (rule) {
    setSeed(1 + [...item.id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100000, 7));
    try { out = rule(item.prompt_en || '', item) || ''; } catch { out = ''; }
    if (typeof out !== 'string' || !out.startsWith('<svg') || /NaN|undefined/.test(out)) out = '';
  }
  cache.set(item.id, out);
  return out;
}
