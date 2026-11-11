// Longer, deeper "Watch it move" lessons (pilot): see it → why it works → try another → remember.
// Each one reuses the lesson's first animation and adds parts after it.
import { sequence, R, C, L, T, G, numberLine, hopper, strip } from './motion-kit.mjs';
import { N09, N13, N18, M03, dealScene, perimeterScene } from './motions-y3.mjs';
import { columnAdd } from './motions-y4.mjs';

const range = n => Array.from({ length: n }, (_, i) => i);
const part = (name, spec, btn) => ({ ...(spec.spec || spec), part: name, btn });
const remember = (lines, say) => ({ part: 'Remember', items: [R(20, 30, 280, 150, 'mv-note', { rx: 14 }), T(160, 62, 'Remember', 'mv-mid'), lines.map((t, i) => T(160, 98 + i * 26, t, 'mv-num', { at: i ? 0 : 0 }))], steps: [{ btn: 'Remember', say }] });

// ---- Y3-N09 · add with an exchange -------------------------------------------------------------
const bundle = {
  part: 'Why it works', w: 300, items: [
    range(11).map(i => R(30 + i * 22, 60, 18, 18, 'mv-b1', { at: i < 7 ? 0 : 1, move: i < 10 ? [{ at: 2, dx: 212 - (30 + i * 22), dy: 54 + i * 11 - 60 }] : [], out: i < 10 ? 3 : null })),
    G([R(212, 54, 18, 110, 'mv-b10'), ...range(9).map(i => L(212, 65 + i * 11, 230, 65 + i * 11, 'mv-bline'))], { at: 3 }), T(221, 182, '1 ten', 'mv-num', { at: 3 }), T(259, 100, '1 one', 'mv-num', { at: 3 }),
    T(160, 30, '7 ones + 4 ones', 'mv-mid', { out: 1 }), T(160, 30, '7 + 4 = 11 ones', 'mv-mid', { at: 1, out: 3 }), T(160, 30, '11 ones = 1 ten + 1 one', 'mv-mid', { at: 3 })],
  steps: [{ btn: 'Why do we exchange?', say: '7 ones and 4 more ones.' }, { btn: 'Count them', say: '7 + 4 = 11 ones.' }, { btn: 'Gather ten of them', say: 'Ten ones move together…' }, { btn: 'Swap for a ten', say: '…and become 1 ten. 1 one is left over: that is why we write 1 and carry 1.' }],
};
export const N09deep = sequence({
  title: 'Add 137 + 54, then try another',
  intro: 'See the column addition, find out why we carry, then try a new one.',
  explain: 'Add from the ones. When a column reaches ten, ten of that place become one of the next place: 137 + 54 = 191, and 258 + 67 = 325 needs two exchanges.',
  explain_zh: '竖式加法从个位加起，哪一位满 10，就把 10 个换成前一位的 1 个（进位）。7 + 4 = 11 个一，就是 1 个十和 1 个一，所以写 1、进 1。再换一题 258 + 67 = 325，个位和十位都要进位。',
  w: 330, h: 210,
  parts: [part('See it', N09), bundle, part('Try another', columnAdd({ a: 258, b: 67, title: '', intro: '', explain: '', explain_zh: '' }), 'Try another'),
    remember(['Start with the ones.', 'Ten ones → one ten.', 'Ten tens → one hundred.'], 'Start with the ones. Ten of one place becomes one of the next place.')],
});

// ---- Y3-N13 · share equally -------------------------------------------------------------------
const facts = {
  part: 'Why it works', items: [range(3).map(r => G([R(30, 36 + r * 44, 150, 34, 'mv-plate', { rx: 10 }), T(16, 58 + r * 44, String(r + 1), 'mv-num'), ...range(4).map(c => C(56 + c * 32, 53 + r * 44, 10, 'mv-c1'))])),
    ['12 ÷ 3 = 4', '3 × 4 = 12', '4 × 3 = 12', '12 ÷ 4 = 3'].map((t, i) => T(250, 60 + i * 30, t, 'mv-mid', { at: i + 1 }))],
  steps: [{ btn: 'Why does it work?', say: '3 plates with 4 on each.' }, { btn: 'Write the sharing', say: '12 shared by 3 gives 4 each: 12 ÷ 3 = 4.' }, { btn: 'Write it as groups', say: '3 groups of 4 make 12: 3 × 4 = 12.' }, { btn: 'Turn it round', say: '4 × 3 = 12 is the same counters seen the other way.' }, { btn: 'One more fact', say: '12 ÷ 4 = 3. Four facts from one picture.' }],
};
export const N13deep = sequence({
  title: 'Share 12, then share 15',
  intro: 'Share fairly, see the facts it makes, then try another share.',
  explain: 'Dealing 12 onto 3 plates gives 4 each: 12 ÷ 3 = 4, and 3 × 4 = 12 checks it. Sharing 15 onto 5 plates gives 3 each.',
  explain_zh: '平均分就是每份一样多：12 个分到 3 个盘子，每盘 4 个，12 ÷ 3 = 4。同一张图还能写出 3 × 4 = 12、4 × 3 = 12、12 ÷ 4 = 3 四个算式，乘法和除法互相检查。再换一题：15 个分到 5 个盘子，每盘 3 个。',
  h: 210,
  parts: [part('See it', N13), facts, part('Try another', dealScene({ total: 15, groups: 5, title: '', intro: '', explain: '', explain_zh: '', sum: '15 ÷ 5 = 3, and 5 × 3 = 15' }), 'Try another'),
    remember(['Fair shares are equal.', 'Division shares; multiplication', 'puts the groups back together.'], 'Fair shares are equal. Multiplication checks division.')],
});

// ---- Y3-N18 · equivalent fractions ------------------------------------------------------------
const halfLine = (() => {
  const a = numberLine(0, 1, { x0: 30, x1: 270, y: 70, every: .5, label: .5, fmt: v => (v === 0 ? '0' : v === 1 ? '1' : '1/2') }), b = numberLine(0, 1, { x0: 30, x1: 270, y: 150, every: 1 / 6, label: 1 / 6, fmt: v => { const n = Math.round(v * 6); return n === 0 ? '0' : n === 6 ? '1' : `${n}/6`; } });
  return { part: 'Why it works', items: [a.items, b.items, hopper(a.X, 70, .5, [], 'mv-dot', { at: 1 }), hopper(b.X, 150, .5, [], 'mv-dot2', { at: 2 }), L(150, 60, 150, 160, 'mv-dash', { at: 2 }),
    T(228, 112, '1/2 = 3/6', 'mv-mid', { at: 2, out: 3 }), T(222, 112, '1/2 → × 3 → 3/6', 'mv-mid', { at: 3 }), T(222, 128, 'top and bottom', 'mv-num', { at: 3 })],
    steps: [{ btn: 'Check on a number line', say: 'Halves on top, sixths below.' }, { btn: 'Mark one half', say: '1/2 is halfway.' }, { btn: 'Mark three sixths', say: '3/6 lands on exactly the same point.' }, { btn: 'See the numbers', say: 'Each half split into 3: both numbers are multiplied by 3.' }] };
})();
const thirds = {
  part: 'Try another', items: [strip(30, 60, 240, 44, 3, { shade: [[0, 'mv-c1', 0]] }), [1, 3, 5].map(i => L(30 + i * 40, 60, 30 + i * 40, 104, 'mv-cut', { at: 1 })),
    range(2).map(i => T(50 + i * 40, 88, String(i + 1), 'mv-mid', { at: 2 })), T(150, 44, '1/3', 'mv-mid', { out: 1 }), T(150, 44, 'split each third into 2', 'mv-mid', { at: 1, out: 2 }), T(150, 44, '1/3 = 2/6', 'mv-mid', { at: 2 })],
  steps: [{ btn: 'Try another', say: 'One third is shaded.' }, { btn: 'Split each third into 2', say: 'Now there are 6 equal pieces.' }, { btn: 'Count the shaded sixths', say: '2 sixths: 1/3 = 2/6.' }],
};
export const N18deep = sequence({
  title: 'One half is three sixths, and more',
  intro: 'Split the pieces, check on a number line, then try thirds.',
  explain: 'Splitting every piece the same way keeps the amount: 1/2 = 3/6 lands on the same point of the number line, and 1/3 = 2/6. Top and bottom are multiplied by the same number.',
  explain_zh: '把每一份都再平均分成同样多份，涂色的量不变：1/2 = 3/6，在数轴上是同一个点；再试 1/3 = 2/6。分子分母同时乘同一个数，分数大小不变。',
  parts: [part('See it', N18), halfLine, thirds, remember(['Split every piece the same way.', 'The amount stays the same.', 'Top and bottom × the same number.'], 'Split every piece the same way and the amount stays the same.')],
});

// ---- Y3-M03 · perimeter ----------------------------------------------------------------------
const pairs = (() => {
  const s = 30, x = 60, y = 30;
  return { part: 'Why it works', items: [R(x, y, 6 * s, 3 * s, 'mv-c3'), L(x, y, x + 6 * s, y, 'mv-walk'), L(x + 6 * s, y, x + 6 * s, y + 3 * s, 'mv-walk'), L(x, y + 3 * s, x + 6 * s, y + 3 * s, 'mv-walk2', { at: 2 }), L(x, y, x, y + 3 * s, 'mv-walk2', { at: 2 }),
    T(150, 150, '6 + 3 + 6 + 3 = 18', 'mv-mid', { out: 1 }), T(150, 150, 'top + side = 6 + 3 = 9', 'mv-mid', { at: 1, out: 2 }), T(150, 150, 'the other two sides are 9 too', 'mv-mid', { at: 2, out: 3 }), T(150, 150, '2 × (6 + 3) = 2 × 9 = 18 cm', 'mv-mid', { at: 3 })],
    steps: [{ btn: 'A quicker way?', say: '6 + 3 + 6 + 3 = 18.' }, { btn: 'Add one long and one short side', say: 'Top and side: 6 + 3 = 9.' }, { btn: 'Look at the other two', say: 'Opposite sides match, so they make 9 too.' }, { btn: 'Write it', say: '2 × (6 + 3) = 18 cm.' }] };
})();
export const M03deep = sequence({
  title: 'Walk around, then find a quicker way',
  intro: 'Follow the edge, use the matching sides, then try another rectangle.',
  explain: 'Perimeter is the distance all the way round: 6 + 3 + 6 + 3 = 18 cm, or 2 × (6 + 3). A 5 by 4 rectangle looks different but has the same perimeter, 18 cm.',
  explain_zh: '周长是沿边走一圈的长度：6 + 3 + 6 + 3 = 18 厘米。长方形对边相等，也可以写成 2 × (6 + 3) = 18。再换一个 5 × 4 的长方形：形状不一样，周长也是 18 厘米。',
  h: 210,
  parts: [part('See it', M03), pairs, part('Try another', perimeterScene({ w: 5, h: 4, unit: 'cm', title: '', intro: '', explain: '', explain_zh: '' }), 'Try another'),
    remember(['Walk all the way round once.', 'Opposite sides of a rectangle match.', 'Different shapes can share a perimeter.'], 'Walk all the way round once. Different shapes can have the same perimeter.')],
});

export const DEEP = { 'Y3-N09': N09deep, 'Y3-N13': N13deep, 'Y3-N18': N18deep, 'Y3-M03': M03deep };
