// Building blocks for the longer "Watch it move" lessons: see it → why it works → try another → remember.
// Each builder returns a scene spec (items + steps) that sequence() can chain after a lesson's first scene.
import { R, C, L, P, T, G, numberLine, jump, hopper, strip, clockFace, hand, sector, gridLines, counters } from './motion-kit.mjs';

export const range = n => Array.from({ length: n }, (_, i) => i);
export const part = (name, spec, btn) => ({ ...(spec.spec || spec), part: name, btn });
export const why = spec => ({ ...spec, part: 'Why it works', btn: spec.btn || 'Why does it work?' });
export const another = spec => ({ ...(spec.spec || spec), part: 'Try another', btn: 'Try another' });

export const remember = (lines, say) => ({
  part: 'Remember', btn: 'Remember',
  items: [R(20, 30, 280, 150, 'mv-note', { rx: 14 }), T(160, 62, 'Remember', 'mv-mid'), lines.map((t, i) => T(160, 98 + i * 26, t, 'mv-num'))],
  steps: [{ say }],
});

// Lines of a number sentence appear one per step, beside an optional picture that stays.
export function lines({ figure = [], rows, says, x = 160, y = 46, gap = 30, cls = 'mv-mid', btn }) {
  const head = typeof says[0] === 'string' ? says[0] : says[0].say;
  return { btn, items: [figure, T(x, 18, head, 'mv-jl'), rows.map((t, i) => T(x, y + i * gap, t, i === rows.length - 1 ? 'mv-mid' : cls, { at: i + 1 }))], steps: [{ say: says[0] }, ...rows.map((_, i) => ({ btn: says[i + 1]?.btn || 'Next', say: says[i + 1]?.say || says[i + 1] }))] };
}

// Hops along a number line. jumps: [{ to, label, below }]
export function jumps({ min, max, every = 1, label = 5, start, hops, fmt, end, startSay, x0 = 20, x1 = 280 }) {
  const nl = numberLine(min, max, { y: 125, every, label, fmt, x0, x1 });
  let at = start;
  const items = [nl.items], steps = [{ say: startSay || `Start at ${fmt ? fmt(start) : start}.` }];
  hops.forEach((h, i) => { items.push(jump(nl.X, 125, at, h.to, { at: i + 1, label: Math.abs(nl.X(h.to) - nl.X(at)) >= 40 ? h.label : null, below: h.below, cls: h.below ? 'mv-arc2' : 'mv-arc' })); steps.push({ btn: h.btn || 'Jump', say: h.say }); at = h.to; });
  items.push(hopper(nl.X, 125, start, hops.map((h, i) => [i + 1, h.to])));
  if (end) { items.push(T(150, 30, end, 'mv-mid', { at: hops.length + 1 })); steps.push({ btn: 'Write it', say: end }); }
  return { items, steps };
}

// Round v to the nearer of two neighbours.
export function rounding({ min, max, every, label, v, to, half, fmt = String }) {
  const nl = numberLine(min, max, { y: 100, every, label, fmt });
  return { items: [nl.items, C(nl.X(min), 100, 12, 'mv-ring', { at: 1, out: 3 }), C(nl.X(max), 100, 12, 'mv-ring', { at: 1, out: 3 }),
    G([L(nl.X(half), 70, nl.X(half), 114, 'mv-dash'), T(nl.X(half), 64, 'halfway', 'mv-jl')], { at: 2 }), hopper(nl.X, 100, v, [[3, to]]), T(nl.X(v), 80, fmt(v), 'mv-num', { out: 3 }), T(nl.X(to) - 14, 80, '≈ ' + fmt(to), 'mv-num', { at: 3 }),
    T(150, 170, `${fmt(v)} ≈ ${fmt(to)}`, 'mv-mid', { at: 3 })],
  steps: [{ say: `Round ${fmt(v)}.` }, { btn: 'Find the neighbours', say: `${fmt(v)} is between ${fmt(min)} and ${fmt(max)}.` }, { btn: 'Show halfway', say: `Halfway is ${fmt(half)}.` }, { btn: 'Round it', say: `${fmt(v)} is nearer ${fmt(to)}.` }] };
}

// Column subtraction with every exchange shown (works across zeros).
export function columnSub({ a, b }) {
  const n = String(a).length, X = c => 196 - c * 40, top = String(a).padStart(n, '0').split('').reverse().map(Number), bot = String(b).padStart(n, '0').split('').reverse().map(Number), heads = ['O', 'T', 'H', 'Th'];
  const items = [range(n).map(c => T(X(c), 16, heads[c], 'mv-num')), range(n).map(c => T(X(c), 84, String(top[c]), 'mv-big')), range(String(b).length).map(c => T(X(c), 118, String(bot[c]), 'mv-big')), T(X(n - 1) - 34, 118, '−', 'mv-big'), L(X(n - 1) - 40, 130, X(0) + 22, 130, 'mv-axis')];
  const steps = [{ say: `${a} − ${b}. Start with the ones.` }], cur = [...top], marks = range(n).map(() => 0);
  let st = 1;
  for (let c = 0; c < n; c++) {
    if (cur[c] < bot[c]) {
      let k = c + 1; while (cur[k] === 0) k++;
      for (let j = k; j > c; j--) { cur[j] -= 1; cur[j - 1] += 10; }
      for (let j = c; j <= k; j++) { marks[j]++; items.push(L(X(j) - 9, 78 - (marks[j] - 1) * 22, X(j) + 9, 68 - (marks[j] - 1) * 22, 'mv-strike', { at: st }), T(X(j), 58 - (marks[j] - 1) * 22, String(cur[j]), 'mv-small', { at: st })); }
      steps.push({ btn: 'Exchange', say: `${top[c] !== cur[c] - 10 ? '' : ''}Not enough ${heads[c] === 'O' ? 'ones' : heads[c] === 'T' ? 'tens' : 'hundreds'}: exchange 1 from the next place. Still ${a}.` }); st++;
    }
    items.push(T(X(c), 162, String(cur[c] - bot[c]), 'mv-big', { at: st }));
    steps.push({ btn: `Subtract the ${['ones', 'tens', 'hundreds', 'thousands'][c]}`, say: `${cur[c]} − ${bot[c]} = ${cur[c] - bot[c]}` }); st++;
  }
  items.push(T(150, 194, `Check: ${a - b} + ${b} = ${a} ✓`, 'mv-mid', { at: st }));
  steps.push({ btn: 'Check by adding', say: `${a - b} + ${b} = ${a}. It fits.` });
  return { w: 300, h: 205, items, steps };
}

// Rows of counters appear one at a time with a running total.
export function arrayRows({ rows, cols, unit = '' }) {
  const gap = Math.min(30, 200 / cols), r = Math.min(10, gap / 2.6), x0 = 30, y0 = 40;
  return { items: [counters(rows * cols, cols, x0, y0, { gap, r, cls: 'mv-ghost' }).map((c, i) => ({ ...c, a: { ...c.a, cy: y0 + Math.floor(i / cols) * 30 } })), range(rows).map(rw => G(counters(cols, cols, x0, y0 + rw * 30, { gap, r }), { at: rw + 1, from: [120, 0], move: [{ at: rw + 1 }] })),
    range(rows).map(rw => T(262, y0 + 4 + rw * 30, String((rw + 1) * cols), 'mv-mid', { at: rw + 1 })),
    T(150, 194, `${rows} × ${cols} = ${rows * cols}${unit}`, 'mv-mid', { at: rows + 1 })],
  h: 205, steps: [{ say: `Rows of ${cols}.` }, ...range(rows).map(rw => ({ btn: 'Add a row', say: `${rw + 1} row${rw ? 's' : ''}: ${(rw + 1) * cols}` })), { btn: 'Write it', say: `${rows} × ${cols} = ${rows * cols}` }] };
}

// Fraction strips -------------------------------------------------------------------------------
export function fracShade({ d, n, whole = 'One whole', y = 70 }) {
  return { items: [strip(30, y, 240, 44, d, { splitAt: 1, shade: range(n).map(i => [i, 'mv-c1', 2]) }), T(150, y - 20, `${n}/${d}`, 'mv-mid', { at: 2 })],
    steps: [{ say: `${whole}.` }, { btn: `Cut into ${d} equal parts`, say: `${d} equal parts: each is 1/${d}.` }, { btn: `Shade ${n}`, say: `${n} of ${d} equal parts: ${n}/${d}.` }] };
}
export function fracCompare({ a, b, why: reason }) {
  const [an, ad] = a, [bn, bd] = b, gt = an / ad > bn / bd ? '>' : an / ad < bn / bd ? '<' : '=';
  return { items: [strip(30, 40, 240, 36, ad, { shade: range(an).map(i => [i, 'mv-c1', 1]) }), strip(30, 110, 240, 36, bd, { shade: range(bn).map(i => [i, 'mv-c2', 2]) }),
    T(285, 64, `${an}/${ad}`, 'mv-num', { at: 1 }), T(285, 134, `${bn}/${bd}`, 'mv-num', { at: 2 }), T(155, 186, `${an}/${ad} ${gt} ${bn}/${bd}`, 'mv-mid', { at: 3 })], w: 310,
    steps: [{ say: 'Two strips the same length.' }, { btn: `Shade ${an}/${ad}`, say: `${an}/${ad}` }, { btn: `Shade ${bn}/${bd}`, say: `${bn}/${bd}` }, { btn: 'Compare', say: `${an}/${ad} ${gt} ${bn}/${bd}. ${reason || ''}` }] };
}
export function fracSplit({ n, d, k }) {
  const cuts = [];
  for (let i = 1; i < d * k; i++) if (i % k) cuts.push(i);
  return { items: [strip(30, 70, 240, 44, d, { shade: range(n).map(i => [i, 'mv-c1', 0]) }), cuts.map(i => L(30 + i * 240 / (d * k), 70, 30 + i * 240 / (d * k), 114, 'mv-cut', { at: 1 })),
    range(n * k).map(i => T(30 + (i + .5) * 240 / (d * k), 98, String(i + 1), 'mv-num', { at: 2 })), T(150, 50, `${n}/${d}`, 'mv-mid', { out: 1 }), T(150, 50, `split each piece into ${k}`, 'mv-mid', { at: 1, out: 2 }), T(150, 50, `${n}/${d} = ${n * k}/${d * k}`, 'mv-mid', { at: 2 })],
    steps: [{ say: `${n}/${d} is shaded.` }, { btn: `Split each piece into ${k}`, say: `Now there are ${d * k} equal pieces.` }, { btn: 'Count the shaded pieces', say: `${n * k} of ${d * k}: ${n}/${d} = ${n * k}/${d * k}.` }] };
}
export function fracAddSub({ d, a, b, op = '+' }) {
  const shade = op === '+' ? [...range(a).map(i => [i, 'mv-c1', 1]), ...range(b).map(i => [a + i, 'mv-c2', 2])] : [...range(a - b).map(i => [i, 'mv-c1', 1]), ...range(b).map(i => [a - b + i, 'mv-c1', 1, 2])];
  const res = op === '+' ? a + b : a - b;
  return { items: [strip(30, 70, 240, 44, d, { shade }), T(150, 50, `${a}/${d}`, 'mv-mid', { at: 1, out: 2 }), T(150, 50, `${a}/${d} ${op === '+' ? '+' : '−'} ${b}/${d} = ${res}/${d}`, 'mv-mid', { at: 2 })],
    steps: [{ say: `A whole cut into ${d} equal parts.` }, { btn: `Shade ${a}/${d}`, say: `${a}/${d}` }, { btn: op === '+' ? `Add ${b}/${d}` : `Take away ${b}/${d}`, say: `${a} ${op === '+' ? '+' : '−'} ${b} = ${res} pieces: ${res}/${d}. The pieces stay ${d}ths.` }] };
}

// A clock whose hands move to each listed time. times: [[h, m, label], ...]
export function clockMoves({ times, sectorFrom = null, summary }) {
  const ang = ([h, m]) => [((h % 12) * 30 + m * .5), m * 6], [h0, m0] = ang(times[0]);
  const hk = [], mk = []; let prevM = m0, laps = 0;
  times.slice(1).forEach((t, i) => { const [ha, ma] = ang(t); let mm = ma + laps * 360; if (mm < prevM) { laps++; mm += 360; } prevM = mm; hk.push({ at: i + 1, deg: ha + (ha < h0 ? 360 : 0) }); mk.push({ at: i + 1, deg: mm }); });
  const items = [clockFace(105, 100, 82), hand(105, 100, 46, 'mv-hhand', h0, hk), hand(105, 100, 68, 'mv-mhand', m0, mk), C(105, 100, 5, 'mv-pin'),
    times.map(([h, m, lab], i) => T(245, 60 + i * 26, lab || `${h}:${String(m).padStart(2, '0')}`, i ? 'mv-num' : 'mv-mid', { at: i }))];
  if (summary) items.push(T(245, 60 + times.length * 26 + 8, summary, 'mv-mid', { at: times.length }));
  return { items, steps: [{ say: `${times[0][2] || `${times[0][0]}:${String(times[0][1]).padStart(2, '0')}`}` }, ...times.slice(1).map(t => ({ btn: t[3] || 'Move the hands', say: t[2] })), ...(summary ? [{ btn: 'Add it up', say: summary }] : [])] };
}

// Bars built one category at a time.
export function bars({ cats, unit = 'children', colors = ['mv-c1', 'mv-c2', 'mv-c5', 'mv-c4'] }) {
  const max = Math.max(...cats.map(c => c[1])), sc = Math.min(22, 120 / max), bw = Math.min(40, 200 / cats.length - 12);
  return { h: 205, items: [L(50, 170, 285, 170, 'mv-axis'), L(50, 170, 50, 40, 'mv-axis'), range(max + 1).map(v => T(38, 174 - v * sc, String(v), 'mv-num')), T(40, 30, unit, 'mv-num'),
    cats.map(([nm, n], c) => { const x = 70 + c * (210 / cats.length); return [T(x + bw / 2, 188, nm, 'mv-num'), R(x, 170 - n * sc, bw, n * sc, colors[c % colors.length], { at: c + 1, scale: { cx: 0, cy: 170, from: [1, 0.02], keys: [{ at: c + 1, sx: 1, sy: 1 }] } }), T(x + bw / 2, 164 - n * sc, String(n), 'mv-num', { at: c + 1 })]; })],
  steps: [{ say: 'An empty graph.' }, ...cats.map(([nm, n]) => ({ btn: `Add ${nm}`, say: `${nm}: ${n}` }))] };
}

// Dots stacking on a number line. vals: numbers; X positions chosen from the distinct values.
export function dots({ vals, label = '', highlight }) {
  const keys = [...new Set(vals)].sort((a, b) => a - b), X = v => 50 + keys.indexOf(v) * (230 / Math.max(1, keys.length - 1)), seen = {};
  return { h: 205, items: [L(30, 160, 290, 160, 'mv-axis'), keys.map(v => T(X(v), 178, String(v), 'mv-num')), T(160, 196, label, 'mv-num'),
    vals.map((v, i) => { const k = seen[v] = (seen[v] || 0) + 1; return C(X(v), 160 - k * 20 + 4, 8, 'mv-c1', { at: 1, from: [0, -50], move: [{ at: 1 }], hl: highlight && highlight(v) ? 2 : null }); })],
  steps: [{ say: `${vals.length} values to show.` }, { btn: 'Add the dots', say: 'One dot for each value; equal values stack.' }, ...(highlight ? [{ btn: 'Look closely', say: 'The highlighted stack.' }] : [])] };
}

// A 10 × 10 grid with shaded runs: [[from, to, cls, at]]
export function hundred(x, y, s, shades) {
  const items = [];
  for (const [a, b, cls, at] of shades) for (let i = a; i < b; i++) items.push(R(x + Math.floor(i / 10) * s, y + (i % 10) * s, s, s, cls, { at }));
  return [...items, gridLines(x, y, 10, 10, s, 'mv-cut'), R(x, y, 10 * s, 10 * s, 'mv-frame')];
}
export { R, C, L, P, T, G, numberLine, jump, hopper, strip, clockFace, hand, sector, gridLines, counters };
