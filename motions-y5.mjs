// Year 5 "Watch it move" animations: one short, tap-through scene per lesson.
import { scene, R, C, L, P, T, G, numberLine, jump, hopper, counters, strip, clockFace, hand, gridLines, sector } from './motion-kit.mjs';
import { balanceScene } from './motions-y3.mjs';
import { columnAdd } from './motions-y4.mjs';

const range = n => Array.from({ length: n }, (_, i) => i);
const comma = v => v.toLocaleString('en-NZ');

// ---- Number ---------------------------------------------------------------------------------
export const N01 = scene({
  title: 'Ten hundred-thousands make a million',
  intro: 'Each block is one hundred thousand. Count them, then push them together.',
  explain: 'Ten hundred-thousands make one million: 10 × 100,000 = 1,000,000. Every place is ten times the place to its right.',
  explain_zh: '10 个十万是一百万：10 × 100 000 = 1 000 000。位值的规律一直不变：每一位都是右边一位的 10 倍，满十就向左进一位。',
  items: [range(10).map(i => { const x = 18 + (i % 5) * 56, y = 20 + Math.floor(i / 5) * 50; return G([R(x, y, 46, 40, 'mv-b100', { rx: 4 }), T(x + 23, y + 18, '100,000', 'mv-coinl'), T(x + 23, y + 33, String(i + 1), 'mv-mid', { at: 1, out: 2 })], { move: [{ at: 2, dx: 127 - x + i * 1.5, dy: 50 - y - i * 1.5 }], out: 3 }); }),
    G([R(95, 30, 110, 80, 'mv-c1', { rx: 8 }), T(150, 78, '1,000,000', 'mv-mid')], { at: 3 }),
    G(['1', '10', '100', '1,000', '10,000', '100,000', '1,000,000'].map((t, i) => T([12, 38, 68, 106, 154, 212, 284][i], 150, t, 'mv-num')), { at: 3 }), G(range(6).map(i => T([25, 53, 87, 130, 183, 248][i], 170, '×10', 'mv-jl')), { at: 3 })],
  w: 320,
  steps: [{ say: 'Ten blocks of one hundred thousand.' }, { btn: 'Count them', say: '1, 2, 3 … 10 hundred-thousands.' }, { btn: 'Push them together', say: 'Ten hundred-thousands in one pile.' }, { btn: 'Make a million', say: '10 × 100,000 = 1,000,000. Each place is ten times the next.' }],
});

function roundTwo({ a, b, title, intro, explain, explain_zh, says }) {
  const la = numberLine(a.min, a.max, { y: 66, every: a.every, label: a.label, fmt: a.fmt }), lb = numberLine(b.min, b.max, { y: 150, every: b.every, label: b.label, fmt: b.fmt, at: 3 });
  return scene({ title, intro, explain, explain_zh, h: 200, items: [la.items, lb.items,
    G([L(la.X(a.half), 40, la.X(a.half), 80, 'mv-dash'), T(la.X(a.half), 34, 'halfway', 'mv-jl')], { at: 1 }), hopper(la.X, 66, a.v, [[2, a.to]]), T(la.X(a.v), 46, a.fmt(a.v), 'mv-num', { out: 2 }), T(la.X(a.to) - 14, 46, '≈ ' + a.fmt(a.to), 'mv-num', { at: 2 }),
    G([L(lb.X(b.half), 124, lb.X(b.half), 164, 'mv-dash')], { at: 3 }), hopper(lb.X, 150, b.v, [[4, b.to]], 'mv-dot2', { at: 3 }), T(lb.X(b.v), 130, b.fmt(b.v), 'mv-num', { at: 3, out: 4 }), T(lb.X(b.to) - 10, 130, '≈ ' + b.fmt(b.to), 'mv-num', { at: 4 })],
  steps: [{ say: says[0] }, { btn: 'Show halfway', say: says[1] }, { btn: 'Round it', say: says[2] }, { btn: 'Try a decimal', say: says[3] }, { btn: 'Round it', say: says[4] }] });
}
export const N02 = roundTwo({ title: 'Round to the nearer neighbour', intro: 'Find the two neighbours, then the halfway point.',
  a: { min: 46000, max: 47000, every: 100, label: 500, v: 46700, to: 47000, half: 46500, fmt: comma }, b: { min: 3, max: 4, every: .1, label: .5, v: 3.58, to: 4, half: 3.5, fmt: v => String(Math.round(v * 100) / 100) },
  says: ['46,700 is between 46,000 and 47,000.', 'Halfway is 46,500. 46,700 is past it.', '46,700 rounds to 47,000.', '3.58 is between 3 and 4.', '3.58 is past 3.5, so it rounds to 4.'],
  explain: 'Find the two neighbours and the halfway point: 46,700 is past 46,500, so it rounds to 47,000. 3.58 is past 3.5, so it rounds to 4.', explain_zh: '取整先找前后两个“邻居”，再看中点：46 700 在 46 000 和 47 000 之间，过了中点 46 500，所以约等于 47 000；3.58 过了 3.5，约等于 4。' });

const N03l = numberLine(-10, 10, { y: 120, every: 1, label: 2 });
export const N03 = scene({
  title: 'Count back through zero',
  intro: 'Start at 8 and jump back 4 each time.',
  explain: '8, 4, 0, −4, −8. Zero is neither positive nor negative; numbers below zero are negative.',
  explain_zh: '每次减 4 往回跳：8、4、0、−4、−8。0 既不是正数也不是负数，比 0 小的数是负数，就像温度计上零下的温度。',
  items: [N03l.items, R(N03l.X(-10) - 6, 100, N03l.X(0) - N03l.X(-10) + 6, 40, 'mv-cold', { at: 3 }), T(N03l.X(-5), 168, 'below zero: negative', 'mv-jl', { at: 3 }), T(N03l.X(0), 96, '0', 'mv-mid', { hl: 2 }),
    range(4).map(i => jump(N03l.X, 120, 8 - i * 4, 4 - i * 4, { at: i + 1, label: '−4', cls: 'mv-arc2' })), hopper(N03l.X, 120, 8, [[1, 4], [2, 0], [3, -4], [4, -8]])],
  steps: [{ say: 'Start at 8.' }, { btn: 'Jump back 4', say: '8 − 4 = 4' }, { btn: 'Jump back 4', say: '4 − 4 = 0. Zero is neither positive nor negative.' }, { btn: 'Jump back 4', say: '0 − 4 = −4: below zero.' }, { btn: 'Jump back 4', say: '−4 − 4 = −8' }],
});

export const N04 = columnAdd({ a: 2468, b: 1757, title: 'Add 2,468 + 1,757 in columns', intro: 'Keep like units together and exchange when a column reaches ten.',
  explain: 'Add each place and exchange ten for one of the next place: 2,468 + 1,757 = 4,225. Check: 4,225 − 1,757 = 2,468.', explain_zh: '同一位上的数相加，满 10 进 1：8 + 7 = 15 写 5 进 1；6 + 5 + 1 = 12 写 2 进 1；4 + 7 + 1 = 12 写 2 进 1；2 + 1 + 1 = 4。结果 4 225，用减法检查。' });

export const N05 = (() => {
  const layouts = [[3, 4], [2, 6], [1, 12]], pos = ([r, c], i) => { const gap = c === 12 ? 22 : 30; return [150 - (c - 1) * gap / 2 + (i % c) * gap, 70 - (r - 1) * 15 + Math.floor(i / c) * 30]; };
  return scene({
    title: 'Factor pairs of 12',
    intro: 'Rearrange 12 counters into different rectangles.',
    explain: '12 counters make 3 rows of 4, 2 rows of 6 and 1 row of 12. The factor pairs of 12 are 1 × 12, 2 × 6 and 3 × 4.',
    explain_zh: '同样 12 个圆点可以排成 3 行 4 个、2 行 6 个、1 行 12 个，所以 12 的因数对是 1×12、2×6、3×4。因数就是能把 12 正好分完、没有余数的数。',
    items: [range(12).map(i => { const [x0, y0] = pos(layouts[0], i), [x1, y1] = pos(layouts[1], i), [x2, y2] = pos(layouts[2], i); return C(x0, y0, 10, 'mv-c1', { move: [{ at: 1, dx: x1 - x0, dy: y1 - y0 }, { at: 2, dx: x2 - x0, dy: y2 - y0 }] }); }),
      T(150, 160, '3 × 4 = 12', 'mv-mid', { out: 1 }), T(150, 160, '2 × 6 = 12', 'mv-mid', { at: 1, out: 2 }), T(150, 160, '1 × 12 = 12', 'mv-mid', { at: 2, out: 3 }), T(150, 160, 'Factor pairs: 1 × 12, 2 × 6, 3 × 4', 'mv-mid', { at: 3 })],
    steps: [{ say: '3 rows of 4.' }, { btn: 'Rearrange', say: '2 rows of 6: the same 12.' }, { btn: 'Rearrange again', say: '1 row of 12.' }, { btn: 'List the pairs', say: 'Factor pairs of 12: 1 × 12, 2 × 6, 3 × 4.' }],
  });
})();

export const N06 = (() => {
  const x = 30, y = 30, u = 8.5, W = 23 * u, H = 14 * u, sx = x + 20 * u, sy = y + 10 * u;
  const part = (px, py, w, h, cls, lab, at) => G([R(px, py, w, h, cls), T(px + w / 2, py + h / 2 + 5, lab, 'mv-mid')], { at });
  return scene({
    title: 'Multiply 23 × 14 in parts',
    intro: 'Split both numbers, then find the area of each part.',
    explain: '23 × 14 = 20 × 10 + 3 × 10 + 20 × 4 + 3 × 4 = 200 + 30 + 80 + 12 = 322.',
    explain_zh: '用面积模型：把 23 拆成 20 和 3，14 拆成 10 和 4，得到四块：200、30、80、12，加起来 322。竖式乘法就是把这四块算出来再相加。',
    w: 320,
    items: [R(x, y, W, H, 'mv-empty'), part(x, y, 20 * u, 10 * u, 'mv-c3', '200', 2), part(sx, y, 3 * u, 10 * u, 'mv-c2', '30', 2), part(x, sy, 20 * u, 4 * u, 'mv-c5', '80', 2), part(sx, sy, 3 * u, 4 * u, 'mv-c4', '12', 2),
      L(sx, y - 8, sx, y + H + 8, 'mv-dash', { at: 1 }), L(x - 8, sy, x + W + 8, sy, 'mv-dash', { at: 1 }), R(x, y, W, H, 'mv-frame'),
      T(x + 10 * u, y - 10, '20', 'mv-num', { at: 1 }), T(sx + 1.5 * u, y - 10, '3', 'mv-num', { at: 1 }), T(x - 14, y + 5 * u + 4, '10', 'mv-num', { at: 1 }), T(x - 12, sy + 2 * u + 4, '4', 'mv-num', { at: 1 }),
      T(270, 80, '200', 'mv-num', { at: 2 }), T(270, 98, '30', 'mv-num', { at: 2 }), T(270, 116, '80', 'mv-num', { at: 2 }), T(270, 134, '+ 12', 'mv-num', { at: 2 }), T(270, 160, '= 322', 'mv-mid', { at: 3 })],
    steps: [{ say: 'A 23 by 14 rectangle.' }, { btn: 'Split both sides', say: '23 = 20 + 3, and 14 = 10 + 4.' }, { btn: 'Find each part', say: '200, 30, 80 and 12.' }, { btn: 'Add the parts', say: '200 + 30 + 80 + 12 = 322' }],
  });
})();

export const N07 = (() => {
  const slot = i => { const g = Math.floor(i / 4), k = i % 4; return g < 5 ? [32 + g * 54 + (k % 2) * 16, 92 + Math.floor(k / 2) * 16] : [260 + (k % 2) * 16, 150 + Math.floor(k / 2) * 16]; };
  return scene({
    title: 'Groups of 4, and what is left',
    intro: 'Put 23 people into boats of 4 seats.',
    explain: '23 ÷ 4 = 5 remainder 3. Five full boats hold 20 people; the 3 left over still need a boat, so 6 boats are needed.',
    explain_zh: '23 ÷ 4 = 5 余 3：5 条船坐满 20 人，还剩 3 人。剩下的人也要坐船，所以一共需要 6 条船。余数怎么处理要看题目的情境。',
    items: [range(5).map(g => R(22 + g * 54, 80, 48, 48, 'mv-plate', { rx: 10, at: 1 })), R(250, 138, 48, 48, 'mv-plate', { rx: 10, at: 3, hl: 3 }),
      range(23).map(i => { const sx = 40 + (i % 12) * 19, sy = 24 + Math.floor(i / 12) * 19, [x, y] = slot(i); return C(sx, sy, 7, i >= 20 ? 'mv-c4' : 'mv-c1', { move: [{ at: i >= 20 ? 2 : 1, dx: x - sx, dy: y - sy }] }); }),
      T(150, 156, '5 full groups = 20', 'mv-mid', { at: 1, out: 2 }), T(130, 156, '3 left over', 'mv-mid', { at: 2, out: 3 }), T(120, 160, '23 ÷ 4 = 5 r 3 → 6 boats', 'mv-mid', { at: 3 })],
    h: 200,
    steps: [{ say: '23 people. Each boat has 4 seats.' }, { btn: 'Fill the boats', say: '5 boats are full: 20 people.' }, { btn: 'What is left?', say: '3 people are left over: the remainder.' }, { btn: 'Let the story decide', say: 'Everyone needs a seat, so we need 6 boats.' }],
  });
})();

function hundredGrid(x, y, s, shades, extra = []) { // shades: [[from, to, cls, at]]
  const items = [];
  for (const [a, b, cls, at] of shades) for (let i = a; i < b; i++) items.push(R(x + Math.floor(i / 10) * s, y + (i % 10) * s, s, s, cls, { at }));
  return [...items, gridLines(x, y, 10, 10, s, 'mv-cut'), R(x, y, 10 * s, 10 * s, 'mv-frame'), ...extra];
}
export const N08 = scene({
  title: 'Thirty-five hundredths',
  intro: 'One whole split into 100 equal squares.',
  explain: '35 hundredths = 3 tenths and 5 hundredths = 0.35. It is less than 0.40, which is 40 hundredths of the same whole.',
  explain_zh: '把 1 平均分成 100 份，每份是 0.01。35 份就是 0.35，也就是 3 个十分之一加 5 个百分之一。和同一个整体的 0.40（40 份）比较，0.35 更小。',
  items: [hundredGrid(30, 20, 16, [[0, 30, 'mv-c1', 1], [30, 35, 'mv-c2', 2]], [R(30, 20, 64, 160, 'mv-dashbox', { at: 3 })]),
    T(262, 60, '3 tenths', 'mv-mid', { at: 1 }), T(262, 86, '+ 5 hundredths', 'mv-mid', { at: 2 }), T(262, 112, '= 0.35', 'mv-mid', { at: 2 }), T(262, 150, '0.35 < 0.40', 'mv-mid', { at: 3 })],
  w: 330,
  steps: [{ say: '100 equal squares make one whole.' }, { btn: 'Shade 3 columns', say: '3 columns = 3 tenths = 0.3' }, { btn: 'Shade 5 more squares', say: '35 hundredths = 0.35' }, { btn: 'Compare with 0.40', say: 'The dashed box is 0.40. 0.35 is less.' }],
});

export const N09 = (() => {
  const heads = ['Tens', 'Ones', 'tenths', 'hundredths', 'thousandths'], X = i => 36 + i * 66;
  const digits = [['3', 2], ['6', 3]];
  return scene({
    title: 'Times ten, divided by one hundred',
    intro: 'Watch the digits move to new places.',
    explain: '× 10 moves each digit one place left: 0.36 → 3.6. ÷ 100 moves each digit two places right: 3.6 → 0.036.',
    explain_zh: '乘 10，每个数字向左移一位（变成原来的 10 倍）：0.36 → 3.6；除以 100，每个数字向右移两位：3.6 → 0.036。小数点不动，是数字在位值表里移动。',
    w: 340,
    items: [heads.map((h, i) => [R(X(i) - 32, 20, 64, 26, 'mv-head'), T(X(i), 38, h, 'mv-coinl')]), C(X(1) + 33, 98, 4, 'mv-pin'),
      digits.map(([d, col]) => T(X(col), 106, d, 'mv-big', { move: [{ at: 1, dx: -66 }, { at: 2, dx: 66 }] })),
      T(X(1), 106, '0', 'mv-big', { out: 1 }), T(X(1), 106, '0', 'mv-big', { at: 2 }), T(X(2), 106, '0', 'mv-big', { at: 2 }),
      T(160, 160, '0.36', 'mv-mid', { out: 1 }), T(160, 160, '0.36 × 10 = 3.6', 'mv-mid', { at: 1, out: 2 }), T(160, 160, '3.6 ÷ 100 = 0.036', 'mv-mid', { at: 2 })],
    steps: [{ say: '0.36: 3 tenths and 6 hundredths.' }, { btn: 'Times 10', say: 'Each digit moves one place left: 3.6' }, { btn: 'Divide by 100', say: 'Each digit moves two places right: 0.036' }],
  });
})();

export const N10 = scene({
  title: 'Rename, then compare',
  intro: 'Split thirds into ninths, then compare.',
  explain: '2/3 = 6/9 (the same amount, smaller pieces). 6/9 > 5/9. And 5/3 is one whole and 2/3 more: 1 2/3.',
  explain_zh: '把每个三分之一再分成 3 份，2/3 就变成 6/9，大小不变。分母一样后就能比较：6/9 > 5/9。5/3 比 1 大：3 个三分之一是 1，再加 2 个，就是 1又2/3。',
  h: 210,
  items: [strip(30, 20, 240, 32, 3, { shade: [[0, 'mv-c1', 0], [1, 'mv-c1', 0]] }), [1, 2, 4, 5, 7, 8].map(i => L(30 + i * 240 / 9, 20, 30 + i * 240 / 9, 52, 'mv-cut', { at: 1 })), T(300, 42, '2/3 = 6/9', 'mv-num', { at: 1 }),
    strip(30, 62, 240, 32, 9, { at: 2, shade: range(5).map(i => [i, 'mv-c2', 2]) }), T(300, 84, '5/9', 'mv-num', { at: 2 }), T(150, 116, '6/9 > 5/9', 'mv-mid', { at: 2 }),
    strip(30, 132, 120, 30, 3, { at: 3, shade: range(3).map(i => [i, 'mv-c1', 3]) }), strip(158, 132, 120, 30, 3, { at: 3, shade: range(2).map(i => [i, 'mv-c1', 3]) }), T(150, 186, '5/3 = 1 2/3', 'mv-mid', { at: 3 })],
  w: 335,
  steps: [{ say: 'Two thirds.' }, { btn: 'Split into ninths', say: 'Each third becomes 3 ninths: 2/3 = 6/9.' }, { btn: 'Compare with 5/9', say: 'Same size pieces: 6/9 > 5/9.' }, { btn: 'Show five thirds', say: '3 thirds make 1, plus 2 more: 1 2/3.' }],
});

export const N11 = scene({
  title: 'Add 2/3 + 1/9',
  intro: 'Make the pieces the same size before adding.',
  explain: 'Rename 2/3 as 6/9 by splitting each third into 3 ninths. Then 6/9 + 1/9 = 7/9.',
  explain_zh: '分母不同不能直接加，要先把每份变成一样大：2/3 每个三分之一分成 3 个九分之一，就是 6/9；再加 1/9，得 7/9。',
  items: [strip(30, 60, 240, 44, 3, { shade: [[0, 'mv-c1', 0], [1, 'mv-c1', 0]] }), [1, 2, 4, 5, 7, 8].map(i => L(30 + i * 240 / 9, 60, 30 + i * 240 / 9, 104, 'mv-cut', { at: 1 })),
    G([R(30 + 6 * 240 / 9, 60, 240 / 9, 44, 'mv-c2'), R(30, 60, 240, 44, 'mv-frame')], { at: 2, from: [0, 60], move: [{ at: 2 }] }),
    T(150, 40, '2/3 + 1/9', 'mv-mid', { out: 1 }), T(150, 40, '2/3 = 6/9', 'mv-mid', { at: 1, out: 2 }), T(150, 40, '6/9 + 1/9 = 7/9', 'mv-mid', { at: 2 })],
  steps: [{ say: '2/3 + 1/9: different sized pieces.' }, { btn: 'Split the thirds', say: 'Each third becomes 3 ninths: 2/3 = 6/9.' }, { btn: 'Add one ninth', say: '6 ninths + 1 ninth = 7 ninths: 7/9.' }],
});

export const N12 = scene({
  title: 'Add hundredths',
  intro: '0.47 + 0.28 on a hundred grid.',
  explain: '47 hundredths + 28 hundredths = 75 hundredths = 0.75. Check: 0.75 − 0.28 = 0.47.',
  explain_zh: '把小数看成百分之几：0.47 是 47 个 0.01，0.28 是 28 个 0.01，加起来 75 个 0.01，就是 0.75。再用 0.75 − 0.28 = 0.47 检查。',
  items: [hundredGrid(30, 20, 16, [[0, 47, 'mv-c1', 0], [47, 75, 'mv-c2', 1]]), T(240, 60, '0.47', 'mv-mid'), T(240, 86, '+ 0.28', 'mv-mid', { at: 1 }), T(240, 112, '= 0.75', 'mv-mid', { at: 2 }), T(160, 198, 'Check: 0.75 − 0.28 = 0.47 ✓', 'mv-num', { at: 3 })],
  h: 205,
  steps: [{ say: '47 hundredths are shaded: 0.47.' }, { btn: 'Add 28 hundredths', say: '28 more hundredths.' }, { btn: 'Count them', say: '75 hundredths = 0.75' }, { btn: 'Check', say: 'Taking 0.28 away returns 0.47.' }],
});

export const N13 = scene({
  title: 'Three fifths of 30',
  intro: '30 is the whole. Find one fifth, then three fifths.',
  explain: '30 ÷ 5 = 6 is one fifth, so three fifths is 3 × 6 = 18. Going back: 18 ÷ 3 = 6 and 6 × 5 = 30.',
  explain_zh: '求 30 的 3/5：先求一份（30 ÷ 5 = 6），再取 3 份（3 × 6 = 18）。反过来，知道 3 份是 18，先求一份 18 ÷ 3 = 6，再乘 5 得整体 30。',
  items: [strip(30, 60, 240, 44, 5, { splitAt: 1, shade: range(3).map(i => [i, 'mv-c1', 3]) }), T(150, 40, '30', 'mv-mid', { out: 1 }), range(5).map(i => T(54 + i * 48, 88, '6', 'mv-mid', { at: 2 })),
    T(150, 40, '30 ÷ 5 = 6 in each part', 'mv-mid', { at: 2, out: 3 }), T(150, 40, '3/5 of 30 = 3 × 6 = 18', 'mv-mid', { at: 3 }), G([L(30, 118, 174, 118, 'mv-arc'), T(102, 136, '18', 'mv-jl')], { at: 3 })],
  steps: [{ say: 'The whole is 30.' }, { btn: 'Cut into 5 equal parts', say: 'Five equal parts.' }, { btn: 'Find one part', say: '30 ÷ 5 = 6' }, { btn: 'Take 3 parts', say: '3 × 6 = 18' }],
});

export const N14 = scene({
  title: '25% of 40',
  intro: 'Percent means out of 100.',
  explain: '25% is 25 out of 100, which is one quarter. A quarter of 40 is 10, and four quarters rebuild 40.',
  explain_zh: '百分数是“每 100 份里有几份”：25% 是 100 份里的 25 份，也就是 1/4。40 的 1/4 是 10；4 个 10 又是 40（100%）。',
  items: [hundredGrid(20, 20, 13, [[0, 25, 'mv-c1', 1]]), T(85, 165, '25 of 100 = 25%', 'mv-num', { at: 1 }),
    strip(170, 60, 120, 40, 4, { at: 2, shade: [[0, 'mv-c1', 2]] }), T(230, 50, '25% = 1/4', 'mv-num', { at: 2 }),
    range(4).map(i => T(185 + i * 30, 86, '10', 'mv-num', { at: 3 })), T(230, 130, '1/4 of 40 = 10', 'mv-mid', { at: 3 }), T(230, 156, '4 × 10 = 40 = 100%', 'mv-num', { at: 3 })],
  steps: [{ say: 'A square of 100 equal parts.' }, { btn: 'Shade 25%', say: '25 out of 100 = 25%.' }, { btn: 'Use quarters', say: '25% is one quarter.' }, { btn: 'Use 40', say: 'A quarter of 40 is 10. Four quarters make 40.' }],
});

const N15l = numberLine(9.3, 10, { y: 130, every: .05, label: .1, fmt: v => '$' + v.toFixed(2) });
export const N15 = scene({
  title: 'Count up to find the change',
  intro: '$5.75 + $3.60. You pay with a $10 note.',
  explain: '$5.75 + $3.60 = $9.35. Count up: 5 cents to $9.40, then 60 cents to $10. The change is 65 cents.',
  explain_zh: '先算总价：5.75 + 3.60 = 9.35 元。找零从 9.35 往上数：先补 5 分到 9.40，再补 60 分到 10 元，一共 65 分（0.65 元）。',
  items: [T(150, 30, '$5.75 + $3.60 = $9.35', 'mv-mid', { at: 1 }), N15l.items, jump(N15l.X, 130, 9.35, 9.4, { at: 2, label: '+5c', cls: 'mv-arc2' }), jump(N15l.X, 130, 9.4, 10, { at: 3, label: '+60c', cls: 'mv-arc2' }),
    hopper(N15l.X, 130, 9.35, [[2, 9.4], [3, 10]], 'mv-dot', { at: 1 }), T(150, 186, 'Change: 5c + 60c = 65c', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Two prices.' }, { btn: 'Add them', say: '$5.75 + $3.60 = $9.35' }, { btn: 'Count up to $9.40', say: '5 cents' }, { btn: 'Count up to $10', say: '60 cents' }, { btn: 'Find the change', say: '5c + 60c = 65 cents change.' }],
});

// ---- Algebra ----------------------------------------------------------------------------------
export const A01 = balanceScene({ left: '40 −', right: '24', missing: '16', tilt: -10, title: 'Balance 40 − ? = 24', intro: 'What can you take from 40 to leave 24?', check: '40 − 16 = 24 ✓',
  explain: 'Taking 16 from 40 leaves 24, so both sides name the same amount: 40 − 16 = 24.', explain_zh: '等号两边的值一样：40 减去多少等于 24？从 24 数到 40 差 16，所以方框里是 16，再代回去检查 40 − 16 = 24。' });

const A02l = numberLine(0, 9, { y: 125, every: .5, label: 1.5, fmt: v => String(v) });
export const A02 = scene({
  title: 'Add one and a half each time',
  intro: 'Find the rule, then keep using it.',
  explain: 'The rule is “add 1.5”: 0, 1.5, 3, 4.5, 6. Some patterns multiply instead, like 1, 2, 4, 8.',
  explain_zh: '找规律就是找每一步都一样的变化：这里每次加 1.5，0、1.5、3、4.5、6。也有的规律是每次乘一个数，比如 1、2、4、8 每次乘 2。',
  items: [A02l.items, range(4).map(i => jump(A02l.X, 125, i * 1.5, i * 1.5 + 1.5, { at: i + 1, label: '+1.5' })), hopper(A02l.X, 125, 0, [[1, 1.5], [2, 3], [3, 4.5], [4, 6]]), T(150, 30, '0, 1.5, 3, 4.5, 6', 'mv-mid', { at: 4, out: 5 }), T(150, 30, 'Another rule: 1, 2, 4, 8 (× 2)', 'mv-mid', { at: 5 })],
  steps: [{ say: 'Start at 0.' }, ...range(4).map(i => ({ btn: 'Add 1.5', say: `${i * 1.5} + 1.5 = ${i * 1.5 + 1.5}` })), { btn: 'Another kind of rule', say: 'Some patterns multiply by the same number each time.' }],
});

// ---- Measurement -------------------------------------------------------------------------------
export const M01 = scene({
  title: 'Read the jug scale',
  intro: 'The jug is labelled 0 and 400 mL. How much is one small space?',
  explain: '400 mL across 8 spaces is 50 mL per space. The water reaches 5 spaces: 5 × 50 = 250 mL.',
  explain_zh: '读刻度先看单位和标了数字的刻度：0 到 400 毫升之间有 8 小格，每格 400 ÷ 8 = 50 毫升。水面在第 5 格，就是 5 × 50 = 250 毫升。',
  items: [range(5).map(i => R(101, 170 - (i + 1) * 17, 78, 17, 'mv-water', { at: 3 })), R(100, 34, 80, 136, 'mv-jug'),
    range(9).map(i => L(100, 170 - i * 17, i % 8 === 0 ? 120 : 112, 170 - i * 17, 'mv-tickl')), T(80, 174, '0', 'mv-num', { hl: 1 }), T(76, 38, '400', 'mv-num', { hl: 1 }),
    range(7).map(i => T(196, 174 - (i + 1) * 17, String((i + 1) * 50), 'mv-small', { at: 2 })), T(272, 80, '400 ÷ 8 = 50', 'mv-mid', { at: 2 }), T(272, 112, '5 × 50 = 250 mL', 'mv-mid', { at: 3 })],
  w: 335,
  steps: [{ say: 'An empty jug.' }, { btn: 'Read the labels', say: 'The labels are 0 and 400 mL.' }, { btn: 'Find one space', say: '8 spaces share 400 mL: 50 mL each.' }, { btn: 'Pour the water', say: '5 spaces: 250 mL.' }],
});

const M02l = numberLine(0, 300, { x0: 24, x1: 276, y: 120, every: 10, label: 100 });
export const M02 = scene({
  title: '2 m 35 cm',
  intro: 'Two metre sticks and some more centimetres.',
  explain: '2 m 35 cm = 200 cm + 35 cm = 235 cm, which is also 2.35 m.',
  explain_zh: '1 米 = 100 厘米。2 米 35 厘米 = 200 + 35 = 235 厘米，也可以写成 2.35 米（小数点后两位就是厘米）。',
  items: [M02l.items, R(M02l.X(0), 84, M02l.X(100) - M02l.X(0), 22, 'mv-c1', { at: 1 }), R(M02l.X(100), 84, M02l.X(100) - M02l.X(0), 22, 'mv-c3', { at: 1 }), T(M02l.X(50), 100, '1 m', 'mv-num', { at: 1 }), T(M02l.X(150), 100, '1 m', 'mv-num', { at: 1 }),
    R(M02l.X(200), 84, M02l.X(235) - M02l.X(200), 22, 'mv-c2', { at: 2 }), T(M02l.X(217), 76, '35 cm', 'mv-jl', { at: 2 }), T(150, 40, '2 m 35 cm = 235 cm = 2.35 m', 'mv-mid', { at: 3 })],
  steps: [{ say: 'A tape in centimetres.' }, { btn: 'Lay 2 metre sticks', say: '2 m = 200 cm' }, { btn: 'Add 35 cm', say: '2 m and 35 cm.' }, { btn: 'Write it two ways', say: '235 cm, or 2.35 m.' }],
});

export const M03 = (() => {
  const s = 15, box = (x, y, c, r, at, cls) => G([...range(c * r).map(i => R(x + (i % c) * s, y + Math.floor(i / c) * s, s, s, cls)), R(x, y, c * s, r * s, 'mv-frame')], { at });
  return scene({
    title: 'Area is not perimeter',
    intro: 'Count the squares inside and the edges around.',
    explain: 'A 3 × 4 and a 2 × 6 rectangle both have area 12, but perimeters 14 and 16. A 3 × 5 rectangle has the same perimeter 16 but area 15.',
    explain_zh: '面积是里面有多少个方格，周长是外面一圈多长，两者不一样。3×4 和 2×6 面积都是 12，周长却是 14 和 16；3×5 周长也是 16，面积却是 15。',
    items: [box(30, 40, 4, 3, 0, 'mv-c3'), T(60, 108, 'area 12', 'mv-num'), T(60, 124, 'perimeter 14', 'mv-num', { at: 1 }),
      box(120, 40, 6, 2, 2, 'mv-c2'), T(165, 108, 'area 12', 'mv-num', { at: 2 }), T(165, 124, 'perimeter 16', 'mv-num', { at: 2 }),
      box(225, 40, 5, 3, 3, 'mv-c5'), T(262, 108, 'area 15', 'mv-num', { at: 3 }), T(262, 124, 'perimeter 16', 'mv-num', { at: 3 }), T(150, 170, 'Same area ≠ same perimeter', 'mv-mid', { at: 3 })],
    steps: [{ say: '3 by 4: 12 squares inside.' }, { btn: 'Walk the edge', say: 'Around it: 4 + 3 + 4 + 3 = 14.' }, { btn: 'Rearrange the 12 squares', say: '2 by 6: still 12 squares, but the edge is 16.' }, { btn: 'Try 3 by 5', say: 'Edge 16 again, but 15 squares inside.' }],
  });
})();

export const M04 = (() => {
  const s = 30, x0 = 60, y0 = 24, sq = (c, r, cls, at, hl) => R(x0 + c * s, y0 + r * s, s, s, cls, { at, hl });
  return scene({
    title: 'Estimate an irregular area',
    intro: 'Count whole squares, then put the pieces together.',
    explain: '3 whole squares. Two halves make 1 more, and four quarters make 1 more: 3 + 1 + 1 = about 5 square units.',
    explain_zh: '估测不规则面积：先数整格（3 个），再把不满的拼起来：两个半格合成 1 格，四个四分之一格合成 1 格，大约 3 + 1 + 1 = 5 平方单位。',
    items: [gridLines(x0, y0, 6, 4, s), [[1, 1], [2, 1], [3, 1]].map(([c, r]) => sq(c, r, 'mv-c3')), [[1, 0], [2, 0]].map(([c, r]) => R(x0 + c * s, y0 + r * s + s / 2, s, s / 2, 'mv-c2', { hl: 2 })),
      [[0, 1], [4, 1], [0, 2], [4, 2]].map(([c, r], i) => R(x0 + c * s + (c ? 0 : s / 2), y0 + r * s + (r === 1 ? s / 2 : 0), s / 2, s / 2, 'mv-c5', { hl: 3 })),
      [[1, 1], [2, 1], [3, 1]].map(([c, r], i) => T(x0 + c * s + 15, y0 + r * s + 20, String(i + 1), 'mv-mid', { at: 1 })),
      T(150, 172, '3 + 1 + 1 ≈ 5 square units', 'mv-mid', { at: 4 }), T(240, 70, '2 halves = 1', 'mv-num', { at: 2 }), T(240, 92, '4 quarters = 1', 'mv-num', { at: 3 })],
    steps: [{ say: 'A shape with whole and part squares.' }, { btn: 'Count whole squares', say: '3 whole squares.' }, { btn: 'Pair the halves', say: 'Two halves make 1 square.' }, { btn: 'Group the quarters', say: 'Four quarters make 1 square.' }, { btn: 'Estimate', say: 'About 5 square units.' }],
  });
})();

export const M06 = scene({
  title: 'Acute, right, obtuse, reflex',
  intro: 'Open the angle wider and wider.',
  explain: 'Less than 90° is acute, 90° is a right angle, between 90° and 180° is obtuse, and more than 180° is reflex.',
  explain_zh: '角按大小分：小于 90° 是锐角，等于 90° 是直角，90° 到 180° 之间是钝角，大于 180° 是优角（反角）。用量角器时中心对准顶点、0 刻度对准一条边。',
  items: [sector(150, 120, 60, 45, 90, 'mv-sector2', { at: 1, out: 2 }), sector(150, 120, 60, 0, 90, 'mv-sector2', { at: 2, out: 3 }), sector(150, 120, 60, -45, 90, 'mv-sector', { at: 3, out: 4 }), sector(150, 120, 60, -160, 90, 'mv-sector3', { at: 4 }),
    L(150, 120, 240, 120, 'mv-axis'), G([L(150, 120, 240, 120, 'mv-mhand')], { rot: { cx: 150, cy: 120, from: 0, keys: [{ at: 1, deg: -45 }, { at: 2, deg: -90 }, { at: 3, deg: -135 }, { at: 4, deg: -250 }] } }), C(150, 120, 5, 'mv-pin'),
    T(150, 30, 'acute: 45°', 'mv-mid', { at: 1, out: 2 }), T(150, 30, 'right angle: 90°', 'mv-mid', { at: 2, out: 3 }), T(150, 30, 'obtuse: 135°', 'mv-mid', { at: 3, out: 4 }), T(150, 30, 'reflex: 250°', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Two arms together.' }, { btn: 'Open a little', say: '45°: less than a right angle: acute.' }, { btn: 'Open to a corner', say: '90°: a right angle.' }, { btn: 'Open wider', say: '135°: between 90° and 180°: obtuse.' }, { btn: 'Open past a straight line', say: '250°: more than 180°: reflex.' }],
});

export const M07 = scene({
  title: '4:45 pm and 35 minutes later',
  intro: 'Read the clock, write it in 24-hour time, then move on.',
  explain: '4:45 pm is 16:45. 15 minutes to 5:00, then 20 more to 5:20: 35 minutes in all.',
  explain_zh: '下午 4:45 用 24 小时制写成 16:45（下午的小时加 12）。经过时间分段算：到 5:00 是 15 分钟，再到 5:20 是 20 分钟，一共 35 分钟。',
  items: [clockFace(105, 100, 82), sector(105, 100, 74, 270, 360, 'mv-sector2', { at: 2 }), sector(105, 100, 74, 0, 120, 'mv-sector', { at: 3 }),
    hand(105, 100, 46, 'mv-hhand', 142.5, [{ at: 2, deg: 150 }, { at: 3, deg: 160 }]), hand(105, 100, 68, 'mv-mhand', 270, [{ at: 2, deg: 360 }, { at: 3, deg: 480 }]), C(105, 100, 5, 'mv-pin'),
    T(245, 60, '4:45 pm', 'mv-mid'), T(245, 86, '= 16:45', 'mv-mid', { at: 1 }), T(245, 116, '+15 min → 5:00', 'mv-num', { at: 2 }), T(245, 138, '+20 min → 5:20', 'mv-num', { at: 3 }), T(245, 170, '35 minutes', 'mv-mid', { at: 4 })],
  steps: [{ say: '4:45 in the afternoon.' }, { btn: 'Write 24-hour time', say: 'Afternoon: add 12 to the hour: 16:45.' }, { btn: 'Move to 5:00', say: '15 minutes.' }, { btn: 'Move to 5:20', say: '20 more minutes.' }, { btn: 'Add them', say: '15 + 20 = 35 minutes.' }],
});

// ---- Geometry ----------------------------------------------------------------------------------
export const G01 = scene({
  title: 'Parallel and perpendicular',
  intro: 'Look at how the lines meet, or never meet.',
  explain: 'Parallel lines stay the same distance apart and never meet. Perpendicular lines cross at a right angle. A rectangle has both.',
  explain_zh: '平行线：两条直线间的距离处处相等，永远不相交。垂直：两条直线相交成直角（图倾斜了也一样）。长方形的对边平行，相邻的边垂直。',
  items: [G([L(20, 40, 130, 40, 'mv-axis'), L(20, 80, 130, 80, 'mv-axis'), L(50, 40, 50, 80, 'mv-dash'), L(100, 40, 100, 80, 'mv-dash')], { at: 0, out: 3 }), T(75, 104, 'parallel', 'mv-mid', { out: 3 }),
    G([L(170, 90, 270, 30, 'mv-axis'), L(196, 18, 244, 98, 'mv-axis'), P('M222 62 L229 74 L217 81', 'mv-frame')], { at: 1, out: 3 }), T(222, 120, 'perpendicular', 'mv-mid', { at: 1, out: 3 }),
    G([R(70, 40, 160, 90, 'mv-c3'), L(70, 40, 230, 40, 'mv-walk'), L(70, 130, 230, 130, 'mv-walk'), P('M70 54 L84 54 L84 40', 'mv-frame'), P('M216 130 L216 116 L230 116', 'mv-frame')], { at: 3 }),
    T(150, 160, 'opposite sides parallel, corners perpendicular', 'mv-num', { at: 3 }), T(150, 186, 'rectangle', 'mv-mid', { at: 3 })],
  steps: [{ say: 'Two lines the same distance apart: parallel.' }, { btn: 'Tilt and cross', say: 'These lines cross at a right angle: perpendicular.' }, { btn: 'Check the right angle', say: 'Even when tilted, the corner is 90°.' }, { btn: 'Find both in a rectangle', say: 'Opposite sides are parallel; next sides are perpendicular.' }],
});

export const G04 = (() => {
  const s = 40, x0 = 60, y0 = 30, rows = ['A', 'B', 'C', 'D'], at = (c, r) => [x0 + (c - .5) * s, y0 + (r + .5) * s];
  const [ax, ay] = at(1, 0), [bx, by] = at(3, 1);
  return scene({
    title: 'Move on a grid map',
    intro: 'Start at A1. Move 2 east and 1 south.',
    explain: 'From A1, 2 squares east and 1 south reaches B3. To return, reverse it: 1 north and 2 west.',
    explain_zh: '方格地图上字母表示行、数字表示列，A1 是 A 行第 1 列。向东走 2 格、向南走 1 格到 B3；返回时方向全部反过来：向北 1 格、向西 2 格。',
    h: 205,
    items: [gridLines(x0, y0, 5, 4, s), rows.map((r, i) => T(x0 - 16, y0 + i * s + 25, r, 'mv-mid')), range(5).map(c => T(x0 + c * s + 20, y0 - 8, String(c + 1), 'mv-mid')), T(280, 30, 'N ↑', 'mv-mid'),
      L(ax, ay, bx, ay, 'mv-walk', { at: 1, out: 3 }), L(bx, ay, bx, by, 'mv-walk', { at: 2, out: 3 }), L(bx + 4, by, bx + 4, ay + 4, 'mv-walk2', { at: 3 }), L(bx, ay + 4, ax, ay + 4, 'mv-walk2', { at: 4 }),
      C(ax, ay, 10, 'mv-dot', { move: [{ at: 1, dx: bx - ax }, { at: 2, dx: bx - ax, dy: by - ay }, { at: 3, dx: bx - ax, dy: 0 }, { at: 4, dx: 0, dy: 0 }] }),
      T(150, 198, 'A1 → 2 east, 1 south → B3', 'mv-mid', { at: 2, out: 3 }), T(150, 198, 'B3 → 1 north, 2 west → A1', 'mv-mid', { at: 4 })],
    steps: [{ say: 'Start at A1.' }, { btn: '2 east', say: 'Two squares east: A3.' }, { btn: '1 south', say: 'One square south: B3.' }, { btn: '1 north', say: 'Going back: one north to A3.' }, { btn: '2 west', say: 'Two west: back to A1.' }],
  });
})();

// ---- Statistics and probability ------------------------------------------------------------------
export const S01 = (() => {
  const vals = [4.2, 5.6, 4.8, 6.1, 5.2, 4.5], bin = v => Math.floor(v) - 4, cnt = [0, 0, 0], slot = vals.map(v => cnt[bin(v)]++);
  return scene({
    title: 'Group the measurements',
    intro: 'Six leaf lengths, recorded to one decimal place.',
    explain: 'Each length goes into exactly one range: 4.0–4.9, 5.0–5.9 or 6.0–6.9 cm. The group counts 3 + 2 + 1 still add to 6.',
    explain_zh: '连续测量的数据可以分组：4.0–4.9、5.0–5.9、6.0–6.9 厘米，每个数据只放进一个组。各组个数加起来 3 + 2 + 1 = 6，和原来的数据个数一样。',
    items: [['4.0–4.9 cm', '5.0–5.9 cm', '6.0–6.9 cm'].map((h, i) => [R(20 + i * 92, 94, 86, 96, 'mv-plate', { rx: 8, at: 1 }), T(63 + i * 92, 112, h, 'mv-num', { at: 1 })]),
      vals.map((v, i) => { const x0 = 22 + i * 46, y0 = 30, x1 = 33 + bin(v) * 92, y1 = 122 + slot[i] * 22; return G([R(x0, y0, 42, 20, 'mv-note', { rx: 4 }), T(x0 + 21, y0 + 15, v.toFixed(1), 'mv-num')], { move: [{ at: 2, dx: x1 - x0, dy: y1 - y0 }] }); }),
      T(150, 20, '3 + 2 + 1 = 6 ✓', 'mv-mid', { at: 3 })],
    h: 200,
    steps: [{ say: 'Six lengths in centimetres.' }, { btn: 'Make the ranges', say: 'Three ranges with clear boundaries.' }, { btn: 'Sort them', say: 'Each length goes into one range.' }, { btn: 'Check the counts', say: '3 + 2 + 1 = 6: nothing lost.' }],
  });
})();

export const S02 = (() => {
  const data = [['walk', 5, 3], ['ride', 2, 4]];
  return scene({
    title: 'Two categories side by side',
    intro: 'Room 1 and Room 2: who walks and who rides?',
    explain: 'Each record keeps two answers: room and travel. Count each combination, then put both rooms side by side with a key: walk 5 and 3, ride 2 and 4.',
    explain_zh: '每个孩子的记录同时有两个信息（哪个班、怎么上学）。按组合分别计数，再把两个班的条并排画，用颜色图例区分：走路 5 和 3，骑车 2 和 4。',
    items: [L(40, 170, 280, 170, 'mv-axis'), L(40, 170, 40, 50, 'mv-axis'), range(6).map(v => T(30, 174 - v * 20, String(v), 'mv-num')),
      data.map(([nm, a, b], i) => [T(110 + i * 110, 188, nm, 'mv-num'), R(82 + i * 110, 170 - a * 20, 26, a * 20, 'mv-c1', { at: 1 + i }), R(112 + i * 110, 170 - b * 20, 26, b * 20, 'mv-c2', { at: 1 + i })]),
      G([R(200, 30, 14, 14, 'mv-c1'), T(240, 42, 'Room 1', 'mv-num'), R(200, 50, 14, 14, 'mv-c2'), T(240, 62, 'Room 2', 'mv-num')], { at: 3 })],
    h: 200,
    steps: [{ say: 'Two rooms, two ways to travel.' }, { btn: 'Count walkers', say: 'Walk: Room 1 has 5, Room 2 has 3.' }, { btn: 'Count riders', say: 'Ride: Room 1 has 2, Room 2 has 4.' }, { btn: 'Add a key', say: 'The colours show which room.' }],
  });
})();

export const S03 = (() => {
  const vals = [1, 1.5, 2, 2, 2, 2.5, 2.5, 3], X = v => 50 + (v - 1) * 100, seen = {};
  return scene({
    title: 'Read the data’s story',
    intro: 'Each dot is one length in centimetres.',
    explain: 'Most lengths are near 2 cm, and the middle values are 2 cm. The lengths run from 1 to 3 cm; we only describe what was measured.',
    explain_zh: '点图上横轴是长度，叠起来的点数是频数。大多数长度在 2 厘米附近，中间的数也是 2 厘米；范围从 1 到 3 厘米。只描述测到的数据，不要编造没测量的值。',
    items: [L(30, 160, 290, 160, 'mv-axis'), [1, 1.5, 2, 2.5, 3].map(v => T(X(v), 178, String(v), 'mv-num')), T(160, 196, 'length (cm)', 'mv-num'),
      vals.map(v => { const k = seen[v] = (seen[v] || 0) + 1; return C(X(v), 160 - k * 22 + 4, 9, 'mv-c1', { hl: v === 2 ? 2 : null, hlOut: 3 }); }), R(X(2) - 14, 82, 28, 78, 'mv-ring', { at: 1, out: 2, rx: 10 }),
      G([L(X(1), 60, X(3), 60, 'mv-arc'), L(X(1), 54, X(1), 66, 'mv-arc'), L(X(3), 54, X(3), 66, 'mv-arc')], { at: 3 }),
      T(150, 26, 'Most common: 2 cm', 'mv-mid', { at: 1, out: 2 }), T(150, 26, 'Middle values: 2 cm', 'mv-mid', { at: 2, out: 3 }), T(150, 26, 'Range: 1 cm to 3 cm', 'mv-mid', { at: 3 })],
    h: 205,
    steps: [{ say: 'Eight measured lengths.' }, { btn: 'Find the most common', say: 'The tallest stack is at 2 cm.' }, { btn: 'Find the middle', say: 'In order, the middle values are 2 cm.' }, { btn: 'Find the range', say: 'From 1 cm to 3 cm.' }],
  });
})();

const P01l = numberLine(0, 1, { x0: 30, x1: 270, y: 150, every: .1, label: .5, fmt: v => (v === 0 ? '0' : v === 1 ? '1' : '1/2') });
export const P01 = scene({
  title: 'How likely is green?',
  intro: 'A bag has 3 green and 7 gold counters. Pick one without looking.',
  explain: 'Green is 3 out of 10 = 3/10, below one half: unlikely. Gold is 7/10: likely. All outcomes together make 1.',
  explain_zh: '10 个圆片里 3 个绿、7 个金，摸到绿色的可能性是 3/10，比 1/2 小，“不太可能”；金色 7/10，“很可能”。不可能是 0，一定是 1，所有结果的可能性加起来是 1。',
  items: [counters(10, 10, 42, 40, { gap: 24, r: 9, o: i => ({}) }).map((c, i) => ({ ...c, a: { ...c.a, class: i < 3 ? 'mv-c1' : 'mv-gold' } })), P01l.items,
    T(P01l.X(0), 128, 'impossible', 'mv-num', { at: 3 }), T(P01l.X(1), 128, 'certain', 'mv-num', { at: 3 }),
    G([C(P01l.X(.3), 150, 8, 'mv-c1'), T(P01l.X(.3), 104, 'green 3/10', 'mv-jl')], { at: 1 }), G([C(P01l.X(.7), 150, 8, 'mv-gold'), T(P01l.X(.7), 104, 'gold 7/10', 'mv-jl')], { at: 2 }),
    T(150, 78, '3/10 + 7/10 = 1', 'mv-mid', { at: 3 })],
  steps: [{ say: '3 green and 7 gold: 10 counters.' }, { btn: 'Place green', say: 'Green: 3/10, below one half: unlikely.' }, { btn: 'Place gold', say: 'Gold: 7/10: likely.' }, { btn: 'Read the ends', say: 'Impossible is 0, certain is 1. Together the outcomes make 1.' }],
});

export const P02 = scene({
  title: 'Roll a fair die',
  intro: 'One roll can show 1, 2, 3, 4, 5 or 6.',
  explain: 'Even (2, 4, 6) is 3 of 6 equally likely outcomes: 3/6 = 1/2. Twelve real rolls might give 8 evens; results vary, but the fair-die model stays 1/2.',
  explain_zh: '公平的骰子 6 个结果可能性一样。“双数”包含 2、4、6，占 6 个里的 3 个，可能性 3/6 = 1/2。实际掷 12 次可能出现 8 次双数，结果会有波动，但这不改变骰子的模型。',
  items: [range(6).map(i => G([R(22 + i * 46, 30, 38, 38, 'mv-empty', { rx: 6 }), T(41 + i * 46, 56, String(i + 1), 'mv-mid')], { hl: i % 2 ? 1 : null })), T(150, 96, 'even: 3 of 6 = 1/2', 'mv-mid', { at: 1 }),
    L(40, 180, 260, 180, 'mv-axis', { at: 2 }), R(70, 180 - 8 * 7, 50, 8 * 7, 'mv-c1', { at: 2 }), R(180, 180 - 4 * 7, 50, 4 * 7, 'mv-c2', { at: 2 }), T(95, 196, 'even 8', 'mv-num', { at: 2 }), T(205, 196, 'odd 4', 'mv-num', { at: 2 }),
    L(60, 180 - 6 * 7, 240, 180 - 6 * 7, 'mv-dash', { at: 3 }), T(268, 180 - 6 * 7 + 4, 'model: 6', 'mv-jl', { at: 3 })],
  h: 205,
  steps: [{ say: 'Six equally likely outcomes.' }, { btn: 'Group the evens', say: '2, 4, 6: 3 of 6, so 1/2.' }, { btn: 'Roll 12 times', say: 'This time: 8 evens and 4 odds.' }, { btn: 'Compare with the model', say: 'The model expects about 6. Real results vary.' }],
});

export const Y5 = { N01, N02, N03, N04, N05, N06, N07, N08, N09, N10, N11, N12, N13, N14, N15, A01, A02, M01, M02, M03, M04, M06, M07, G01, G04, S01, S02, S03, P01, P02 };
