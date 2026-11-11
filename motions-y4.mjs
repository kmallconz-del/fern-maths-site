// Year 4 "Watch it move" animations: one short, tap-through scene per lesson.
import { scene, R, C, L, P, T, G, numberLine, jump, hopper, hundred, ten, counters, strip, clockFace, hand, gridLines, sector } from './motion-kit.mjs';
import { partScene, balanceScene, perimeterScene, areaScene, polygonScene } from './motions-y3.mjs';

const range = n => Array.from({ length: n }, (_, i) => i);
const quarters = v => { const n = Math.round(v * 4); return n === 0 ? '0' : n % 4 === 0 ? String(n / 4) : `${n}/4`; };

// ---- Number ---------------------------------------------------------------------------------
export const N01 = scene({
  title: 'Digits in their places',
  intro: 'Put 3048 and 2980 in the place-value chart, then compare.',
  explain: 'The 0 in 3048 holds the hundreds place. Compare from the left: 3 thousands is more than 2 thousands, so 3048 > 2980.',
  explain_zh: '每一位都是右边一位的 10 倍。3048 里的 0 表示百位上一个也没有，但要占住位置。比较大小从最左边的千位开始：3 个千比 2 个千多，所以 3048 > 2980。',
  items: [['Thousands', 'Hundreds', 'Tens', 'Ones'].map((h, i) => [R(20 + i * 65, 18, 65, 26, 'mv-head'), T(52 + i * 65, 36, h, 'mv-num'), L(20 + i * 65, 18, 20 + i * 65, 160, 'mv-grid')]), L(280, 18, 280, 160, 'mv-grid'),
    ['3', '0', '4', '8'].map((d, i) => T(52 + i * 65, 84, d, 'mv-big', { at: 1, from: [0, -30], move: [{ at: 1 }], hl: i === 1 ? 2 : i === 0 ? 4 : null, hlOut: i === 1 ? 3 : null })),
    ['2', '9', '8', '0'].map((d, i) => T(52 + i * 65, 130, d, 'mv-big', { at: 3, from: [0, -30], move: [{ at: 3 }], hl: i === 0 ? 4 : null })),
    T(117, 104, 'holds the hundreds place', 'mv-jl', { at: 2, out: 3 }), T(150, 188, '3048 > 2980', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Thousands, hundreds, tens, ones.' }, { btn: 'Place 3048', say: '3 thousands, 0 hundreds, 4 tens, 8 ones.' }, { btn: 'Look at the 0', say: 'The 0 keeps the hundreds place. Without it, 3048 would become 348.' }, { btn: 'Place 2980', say: '2 thousands, 9 hundreds, 8 tens, 0 ones.' }, { btn: 'Compare from the left', say: '3 thousands > 2 thousands, so 3048 > 2980.' }],
});

const N02a = numberLine(300, 400, { y: 62, every: 10, label: 50 }), N02b = numberLine(200, 300, { y: 140, every: 10, label: 50, at: 4 });
export const N02 = scene({
  title: 'Round, then estimate',
  intro: 'Estimate 364 + 218 by rounding each number to the nearest hundred.',
  explain: '364 is past 350, so it rounds to 400. 218 rounds to 200. 400 + 200 = 600, close to the exact 582.',
  explain_zh: '364 在 300 和 400 之间，过了中点 350，约等于 400；218 约等于 200。估算 400 + 200 = 600，精确答案 582 和它接近，说明算得合理。',
  items: [N02a.items, N02b.items, C(N02a.X(300), 62, 12, 'mv-ring', { at: 1, out: 3 }), C(N02a.X(400), 62, 12, 'mv-ring', { at: 1, out: 3 }),
    G([L(N02a.X(350), 34, N02a.X(350), 76, 'mv-dash'), T(N02a.X(350), 28, 'halfway', 'mv-jl')], { at: 2 }),
    hopper(N02a.X, 62, 364, [[3, 400]]), T(N02a.X(364), 44, '364', 'mv-num', { out: 3 }), T(N02a.X(400) - 12, 44, '≈ 400', 'mv-num', { at: 3 }),
    hopper(N02b.X, 140, 218, [[4, 200]], 'mv-dot2', { at: 4 }), T(N02b.X(218) + 20, 122, '218 ≈ 200', 'mv-num', { at: 4 }),
    T(150, 196, 'about 400 + 200 = 600 · exact 582', 'mv-mid', { at: 5 })],
  h: 205,
  steps: [{ say: '364 + 218. Estimate first.' }, { btn: 'Find the neighbours', say: '364 is between 300 and 400.' }, { btn: 'Show halfway', say: 'Halfway is 350. 364 is nearer 400.' }, { btn: 'Round 364', say: '364 ≈ 400' }, { btn: 'Round 218', say: '218 ≈ 200' }, { btn: 'Estimate', say: 'About 600. The exact answer, 582, is close.' }],
});

const N03l = numberLine(15, 45, { y: 120, every: 1, label: 5 });
export const N03 = scene({
  title: 'Jumps of 5, forwards and back',
  intro: 'Start at 20 and keep the same jump.',
  explain: 'Adding 5 each time: 20, 25, 30, 35, 40. Counting back reverses the jumps: 40, 35, 30, 25, 20.',
  explain_zh: '按 5 数：每次加 5，20、25、30、35、40；倒着数就是每次减 5，回到 20。规律是“每一跳都一样”。',
  items: [N03l.items, range(4).map(i => jump(N03l.X, 120, 20 + i * 5, 25 + i * 5, { at: i + 1, label: '+5' })), range(4).map(i => jump(N03l.X, 120, 40 - i * 5, 35 - i * 5, { at: 5, below: true, label: '−5', cls: 'mv-arc2' })),
    hopper(N03l.X, 120, 20, [[1, 25], [2, 30], [3, 35], [4, 40], [5, 20]]), T(150, 24, '20, 25, 30, 35, 40', 'mv-mid', { at: 4, out: 5 }), T(150, 24, '40, 35, 30, 25, 20', 'mv-mid', { at: 5 })],
  steps: [{ say: 'Start at 20.' }, ...range(4).map(i => ({ btn: 'Jump +5', say: `${20 + i * 5} + 5 = ${25 + i * 5}` })), { btn: 'Jump back to 20', say: 'Counting back: 40, 35, 30, 25, 20.' }],
});

// Column addition with every exchange shown.
export function columnAdd({ a, b, title, intro, explain, explain_zh }) {
  const sum = a + b, n = String(sum).length, X = c => 196 - c * 40, dig = (v, c) => Math.floor(v / 10 ** c) % 10, heads = ['Ones', 'Tens', 'Hundreds', 'Thousands'];
  const items = [range(n).map(c => T(X(c), 20, heads[c][0] === 'H' ? 'H' : heads[c][0] === 'T' && c === 3 ? 'Th' : heads[c][0], 'mv-num')),
    range(String(a).length).map(c => T(X(c), 72, String(dig(a, c)), 'mv-big')), range(String(b).length).map(c => T(X(c), 106, String(dig(b, c)), 'mv-big')), T(X(n - 1) - 34, 106, '+', 'mv-big'), L(X(n - 1) - 40, 118, X(0) + 22, 118, 'mv-axis')];
  const steps = [{ say: 'Line up equal units: ones under ones.' }];
  let carry = 0;
  range(n).forEach(c => {
    const s = dig(a, c) + dig(b, c) + carry, parts = [dig(a, c), dig(b, c)].concat(carry ? [1] : []), name = heads[c].toLowerCase();
    items.push(R(X(c) - 18, 34, 36, 90, 'mv-colhl', { at: c + 1, out: c + 2 }), T(X(c), 152, String(s % 10), 'mv-big', { at: c + 1 }), T(272, 92, `${parts.join(' + ')} = ${s}`, 'mv-num', { at: c + 1, out: c + 2 }));
    if (s >= 10 && c < n - 1) items.push(T(X(c + 1), 44, '1', 'mv-carry', { at: c + 1 }), T(272, 110, `10 ${name} → 1 ${heads[c + 1].toLowerCase().replace(/s$/, '')}`, 'mv-num', { at: c + 1, out: c + 2 }));
    steps.push({ btn: `Add the ${name}`, say: `${parts.join(' + ')} = ${s} ${name}${s >= 10 && c < n - 1 ? `: write ${s % 10}, exchange ten for 1 ${heads[c + 1].toLowerCase().replace(/s$/, '')}` : ''}.` });
    carry = s >= 10 ? 1 : 0;
  });
  items.push(T(150, 188, `Check: ${sum} − ${b} = ${a} ✓`, 'mv-mid', { at: n + 1 }));
  steps.push({ btn: 'Check by subtracting', say: `${sum} − ${b} = ${a}. It fits.` });
  return scene({ title, intro, explain, explain_zh, w: 330, items, steps });
}
export const N04 = columnAdd({ a: 2648, b: 1375, title: 'Add 2648 + 1375 in columns', intro: 'Add each column from the ones. Ten of a unit becomes one of the next.',
  explain: 'Each column that reaches ten exchanges ten for one of the next unit: 2648 + 1375 = 4023. Check: 4023 − 1375 = 2648.',
  explain_zh: '从个位加起，每一位满 10 就向前一位进 1：8 + 5 = 13 写 3 进 1；4 + 7 + 1 = 12 写 2 进 1；6 + 3 + 1 = 10 写 0 进 1；2 + 1 + 1 = 4。结果 4023，可以用减法检查。' });

export const N05 = (() => {
  const X = c => 196 - c * 40;
  return scene({
    title: 'Subtract 4023 − 1375 by renaming',
    intro: 'Not enough ones, and zero tens and… Rename the whole number first.',
    explain: '4023 = 3 thousands, 9 hundreds, 11 tens and 13 ones (still 4023). Then subtract each column: 4023 − 1375 = 2648. Check: 2648 + 1375 = 4023.',
    explain_zh: '个位 3 减 5 不够，十位只有 2，百位是 0，所以要从千位一路换下来：4023 改写成 3 个千、9 个百、11 个十、13 个一（总数不变）。再每一位相减得 2648，用加法检查。',
    w: 310,
    items: [['Th', 'H', 'T', 'O'].map((h, i) => T(X(3 - i), 16, h, 'mv-num')), ['4', '0', '2', '3'].map((d, i) => T(X(3 - i), 84, d, 'mv-big', { hl: i === 3 ? 1 : null, hlOut: 2 })), T(X(3) - 34, 118, '−', 'mv-big'), ['1', '3', '7', '5'].map((d, i) => T(X(3 - i), 118, d, 'mv-big', { hl: i === 3 ? 1 : null, hlOut: 2 })), L(X(3) - 40, 130, X(0) + 22, 130, 'mv-axis'),
      range(4).map(c => L(X(c) - 9, 78, X(c) + 9, 68, 'mv-strike', { at: 2 })), ['13', '11', '9', '3'].map((d, c) => T(X(c), 56, d, 'mv-small', { at: 2 })),
      ['8', '4'].map((d, c) => T(X(c), 162, d, 'mv-big', { at: 3 })), ['6', '2'].map((d, c) => T(X(c + 2), 162, d, 'mv-big', { at: 4 })),
      T(262, 84, '13 − 5 = 8', 'mv-num', { at: 3, out: 4 }), T(262, 102, '11 − 7 = 4', 'mv-num', { at: 3, out: 4 }), T(262, 84, '9 − 3 = 6', 'mv-num', { at: 4 }), T(262, 102, '3 − 1 = 2', 'mv-num', { at: 4 }),
      T(150, 194, 'Check: 2648 + 1375 = 4023 ✓', 'mv-mid', { at: 5 })],
    h: 205,
    steps: [{ say: '4023 − 1375.' }, { btn: 'Look at the ones', say: '3 ones is not enough for 5, and there are only 2 tens and 0 hundreds.' }, { btn: 'Rename 4023', say: '3 thousands, 9 hundreds, 11 tens, 13 ones: still 4023.' }, { btn: 'Subtract ones and tens', say: '13 − 5 = 8, 11 − 7 = 4' }, { btn: 'Subtract hundreds and thousands', say: '9 − 3 = 6, 3 − 1 = 2. The answer is 2648.' }, { btn: 'Check by adding', say: '2648 + 1375 = 4023. It fits.' }],
  });
})();

export const N06 = scene({
  title: 'One array, three facts',
  w: 310,
  intro: 'Four rows of six counters.',
  explain: '4 × 6 = 24, so 24 ÷ 4 = 6. If each counter is worth 10, the same array shows 4 × 60 = 240.',
  explain_zh: '同一个阵列可以看出一组相关的事实：4 × 6 = 24，所以 24 ÷ 4 = 6；如果每个圆点代表 10，就是 4 × 60 = 240。用已知事实推出新的事实。',
  items: [range(4).map(r => G([R(28, 22 + r * 34, 186, 26, 'mv-plate', { rx: 8, at: 2 }), ...range(6).map(c => G([C(44 + c * 31, 35 + r * 34, 11, 'mv-c1'), T(44 + c * 31, 39 + r * 34, '10', 'mv-coinl', { at: 3 })]))], { from: [0, -r * 6], move: [{ at: 2 }] })),
    T(258, 60, '4 × 6 = 24', 'mv-mid', { at: 1 }), T(258, 96, '24 ÷ 4 = 6', 'mv-mid', { at: 2 }), T(258, 132, '4 × 60 = 240', 'mv-mid', { at: 3 })],
  steps: [{ say: '4 rows of 6.' }, { btn: 'Count them', say: '4 × 6 = 24' }, { btn: 'Share into 4 rows', say: '24 shared into 4 equal rows gives 6 in each: 24 ÷ 4 = 6.' }, { btn: 'Make each counter 10', say: 'Ten times as many in each: 4 × 60 = 240.' }],
});

export const N07 = scene({
  title: 'Three groups of 124',
  intro: 'Each row is 124: 1 hundred, 2 tens and 4 ones. Multiply each part.',
  explain: '3 × 100 = 300, 3 × 20 = 60 and 3 × 4 = 12. Combine: 300 + 60 + 12 = 372.',
  explain_zh: '把 124 按位值拆成 100、20、4，分别乘 3：300、60、12，再相加得 372。这就是竖式乘法背后的道理。',
  items: [range(3).map(r => [hundred(16, 16 + r * 56, { hl: 1, hlOut: 2 }), G([ten(68, 16 + r * 56), ten(77, 16 + r * 56)], { hl: 2, hlOut: 3 }), G(range(4).map(i => R(96 + (i % 2) * 11, 32 + r * 56 + Math.floor(i / 2) * 11, 9, 9, 'mv-b1')), { hl: 3, hlOut: 4 })]),
    T(220, 50, '3 × 100 = 300', 'mv-mid', { at: 1 }), T(220, 82, '3 × 20 = 60', 'mv-mid', { at: 2 }), T(220, 114, '3 × 4 = 12', 'mv-mid', { at: 3 }), T(220, 160, '300 + 60 + 12 = 372', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Three rows of 124.' }, { btn: 'Multiply the hundreds', say: '3 × 100 = 300' }, { btn: 'Multiply the tens', say: '3 × 20 = 60' }, { btn: 'Multiply the ones', say: '3 × 4 = 12' }, { btn: 'Combine', say: '300 + 60 + 12 = 372' }],
});

export const N08 = (() => {
  const px = g => 60 + g * 90;
  return scene({
    title: 'Share 156 in useful parts',
    intro: 'Split 156 into 150 and 6, then share each part into 3 equal groups.',
    explain: '150 ÷ 3 = 50 and 6 ÷ 3 = 2, so each group gets 52. Check: 52 × 3 = 156.',
    explain_zh: '把 156 拆成好分的 150 和 6：150 平均分 3 份每份 50，6 平均分 3 份每份 2，合起来每份 52。用 52 × 3 = 156 检查。',
    items: [range(3).map(g => R(px(g) - 38, 110, 76, 70, 'mv-plate', { rx: 12 })), T(150, 26, '156', 'mv-big', { out: 1 }),
      range(3).map(g => G([R(48 + g * 50, 34, 50, 22, 'mv-c1'), T(73 + g * 50, 50, '50', 'mv-num', { at: 2 })], { at: 1, move: [{ at: 2, dx: px(g) - 25 - (48 + g * 50), dy: 90 }] })),
      range(6).map(i => R(225 + (i % 3) * 13, 34 + Math.floor(i / 3) * 13, 10, 10, 'mv-b1', { at: 1, move: [{ at: 3, dx: px(i % 3) - 12 + Math.floor(i / 3) * 14 - (225 + (i % 3) * 13), dy: 152 - (34 + Math.floor(i / 3) * 13) }] })),
      T(150, 24, '156 = 150 + 6', 'mv-mid', { at: 1, out: 4 }), T(150, 24, 'each group: 50 + 2 = 52 · 52 × 3 = 156 ✓', 'mv-mid', { at: 4 })],
    h: 190,
    steps: [{ say: 'Share 156 into 3 equal groups.' }, { btn: 'Split 156', say: '156 = 150 + 6' }, { btn: 'Share the 150', say: '150 ÷ 3 = 50 in each group.' }, { btn: 'Share the 6', say: '6 ÷ 3 = 2 in each group.' }, { btn: 'Rebuild', say: 'Each group has 52. 52 × 3 = 156.' }],
  });
})();

export const N09 = scene({
  title: 'Tenths past the ones',
  intro: 'Cut one whole into ten equal parts.',
  explain: 'Ten tenths make one whole. 13 tenths are 1 whole and 3 tenths, written 1.3. And 1.3 × 10 = 13.',
  explain_zh: '把 1 平均分成 10 份，每份是 0.1（十分之一）；5 份是 0.5，也就是一半。13 个十分之一是 1 个整体加 3 个十分之一，写作 1.3；1.3 × 10 = 13，每个单位都变成 10 倍。',
  items: [strip(30, 40, 240, 34, 10, { splitAt: 1, shade: [...range(5).map(i => [i, 'mv-c1', 2]), ...range(5).map(i => [i + 5, 'mv-c1', 3])] }), T(150, 30, '5 tenths = 0.5 = one half', 'mv-num', { at: 2, out: 3 }), T(150, 30, '10 tenths = 1 whole', 'mv-num', { at: 3 }),
    strip(30, 100, 240, 34, 10, { at: 3, shade: range(3).map(i => [i, 'mv-c2', 3]) }), T(150, 160, '13 tenths = 1 whole + 3 tenths = 1.3', 'mv-mid', { at: 3 }), T(150, 186, '1.3 × 10 = 13', 'mv-mid', { at: 4 })],
  steps: [{ say: 'One whole.' }, { btn: 'Cut into tenths', say: '10 equal parts: each is one tenth, 0.1.' }, { btn: 'Shade 5 tenths', say: '5 tenths = 0.5 = one half.' }, { btn: 'Shade 13 tenths', say: '10 tenths fill a whole, 3 more: 1.3' }, { btn: 'Times ten', say: 'Every tenth becomes a whole: 1.3 × 10 = 13.' }],
});

export const N10 = scene({
  title: 'Compare fractions of the same whole',
  intro: 'All the strips are the same length.',
  explain: 'With equal pieces, count them: 3/5 > 2/5. With the same number of pieces, bigger pieces win: 2/3 > 2/5.',
  explain_zh: '整体一样大时：分母相同，比份数，3/5 > 2/5；分子相同（份数一样），比每份大小，三分之一比五分之一大，所以 2/3 > 2/5。',
  h: 210,
  items: [strip(30, 20, 220, 26, 5, { shade: range(3).map(i => [i, 'mv-c1', 1]) }), strip(30, 54, 220, 26, 5, { shade: range(2).map(i => [i, 'mv-c2', 1]) }), T(272, 38, '3/5', 'mv-num', { at: 1 }), T(272, 72, '2/5', 'mv-num', { at: 1 }), T(150, 100, '3/5 > 2/5', 'mv-mid', { at: 1 }),
    strip(30, 120, 220, 26, 3, { at: 2, shade: range(2).map(i => [i, 'mv-c1', 2]) }), strip(30, 154, 220, 26, 5, { at: 2, shade: range(2).map(i => [i, 'mv-c2', 2]) }), T(272, 138, '2/3', 'mv-num', { at: 2 }), T(272, 172, '2/5', 'mv-num', { at: 2 }), T(150, 200, '2/3 > 2/5: thirds are bigger pieces', 'mv-mid', { at: 3 })],
  w: 300,
  steps: [{ say: 'Two strips cut into fifths.' }, { btn: 'Shade 3/5 and 2/5', say: 'Same size pieces: 3 is more than 2.' }, { btn: 'Try thirds and fifths', say: 'Two pieces each: 2/3 and 2/5.' }, { btn: 'Compare', say: 'A third is bigger than a fifth, so 2/3 > 2/5.' }],
});

export const N11 = scene({
  title: 'Split every piece',
  intro: 'One half is shaded. Keep splitting the pieces.',
  explain: 'Splitting every piece doubles the pieces but keeps the shaded amount: 1/2 = 2/4 = 4/8.',
  explain_zh: '把每一份再平分，份数变多、每份变小，但涂色的总量没变：1/2 = 2/4 = 4/8。分子分母同时乘 2，就是这个道理。',
  items: [strip(30, 60, 240, 44, 2, { shade: [[0, 'mv-c1', 0]] }), [1, 3].map(i => L(30 + i * 60, 60, 30 + i * 60, 104, 'mv-cut', { at: 1 })), [1, 3, 5, 7].map(i => L(30 + i * 30, 60, 30 + i * 30, 104, 'mv-cut', { at: 2 })),
    L(150, 40, 150, 124, 'mv-dash', { at: 3 }), T(150, 44, '1/2', 'mv-mid', { out: 1 }), T(150, 44, '2/4', 'mv-mid', { at: 1, out: 2 }), T(150, 44, '4/8', 'mv-mid', { at: 2, out: 3 }), T(150, 150, '1/2 = 2/4 = 4/8', 'mv-mid', { at: 3 })],
  steps: [{ say: 'One half.' }, { btn: 'Split each piece', say: 'Quarters: 2 of 4 are shaded.' }, { btn: 'Split again', say: 'Eighths: 4 of 8 are shaded.' }, { btn: 'Check the edge', say: 'The shaded part still ends at the same place.' }],
});

const N12l = numberLine(0, 2, { x0: 24, x1: 276, y: 120, every: .25, label: .25, fmt: quarters });
export const N12 = scene({
  title: 'Seven quarter-steps',
  intro: 'Each whole has four quarter-steps.',
  explain: 'Four quarters make one whole. Seven quarters go one whole and three more: 7/4 = 1 3/4.',
  explain_zh: '每个整体有 4 个四分之一。走 7 个四分之一：前 4 个到 1，再走 3 个，所以 7/4 = 1又3/4（带分数），两个名字表示数轴上同一个位置。',
  items: [N12l.items, range(4).map(i => jump(N12l.X, 120, i / 4, (i + 1) / 4, { at: 1 })), range(3).map(i => jump(N12l.X, 120, 1 + i / 4, 1 + (i + 1) / 4, { at: 2, cls: 'mv-arc2' })),
    hopper(N12l.X, 120, 0, [[1, 1], [2, 1.75]]), T(150, 30, '4/4 = 1 whole', 'mv-mid', { at: 1, out: 2 }), T(150, 30, '7/4 = 1 3/4', 'mv-mid', { at: 2 })],
  steps: [{ say: 'Start at 0.' }, { btn: 'Take 4 quarter-steps', say: '4 quarters = 1 whole.' }, { btn: 'Take 3 more', say: '7 quarters = 1 whole and 3 quarters: 1 3/4.' }],
});

export const N13 = scene({
  title: 'Eighths across a whole',
  intro: 'Two wholes, each cut into eighths.',
  explain: '3/8 + 6/8 = 9/8: one whole and one eighth. Taking 6/8 away again leaves 3/8.',
  explain_zh: '同分母相加，数份数：3 份 + 6 份 = 9 份，也就是 9/8，满 8 份是 1 个整体，所以是 1又1/8。再减去 6/8 回到 3/8，用减法检查。',
  items: [strip(30, 50, 240, 34, 8, { shade: [...range(3).map(i => [i, 'mv-c1', 1]), ...range(5).map(i => [i + 3, 'mv-c2', 2, 4])] }), strip(30, 110, 240, 34, 8, { shade: [[0, 'mv-c2', 2, 4]] }),
    T(150, 34, '3/8', 'mv-mid', { at: 1, out: 2 }), T(150, 34, '3/8 + 6/8 = 9/8', 'mv-mid', { at: 2, out: 3 }), T(150, 34, '9/8 = 1 1/8', 'mv-mid', { at: 3, out: 4 }), T(150, 34, '9/8 − 6/8 = 3/8', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Each strip is one whole cut into 8 equal pieces.' }, { btn: 'Shade 3 eighths', say: '3/8' }, { btn: 'Add 6 eighths', say: '3 + 6 = 9 eighths. They spill into the next whole.' }, { btn: 'Name it', say: '8 eighths make 1 whole, plus 1 eighth: 1 1/8.' }, { btn: 'Take 6 eighths away', say: '9/8 − 6/8 = 3/8' }],
});

export const N14 = scene({
  title: 'Add 1.3 + 0.8 in tenths',
  intro: 'Each strip is one whole cut into tenths.',
  explain: '1.3 is 13 tenths and 0.8 is 8 tenths: 21 tenths = 2 wholes and 1 tenth = 2.1. Check: 2.1 − 0.8 = 1.3.',
  explain_zh: '把小数看成十分之几：1.3 是 13 个 0.1，0.8 是 8 个 0.1，合起来 21 个 0.1。满 10 个 0.1 就是 1，所以是 2 个整体加 1 个 0.1，即 2.1。',
  items: [strip(30, 26, 240, 28, 10, { shade: range(10).map(i => [i, 'mv-c1', 0]) }), strip(30, 66, 240, 28, 10, { shade: [...range(3).map(i => [i, 'mv-c1', 0]), ...range(7).map(i => [i + 3, 'mv-c2', 1])] }), strip(30, 106, 240, 28, 10, { at: 1, shade: [[0, 'mv-c2', 1]] }),
    T(150, 160, '1.3 = 13 tenths', 'mv-mid', { out: 1 }), T(150, 160, '13 + 8 = 21 tenths', 'mv-mid', { at: 1, out: 2 }), T(150, 160, '21 tenths = 2 wholes + 1 tenth = 2.1', 'mv-mid', { at: 2 }), T(150, 188, 'Check: 2.1 − 0.8 = 1.3 ✓', 'mv-mid', { at: 3 })],
  steps: [{ say: '1.3: one whole and 3 tenths.' }, { btn: 'Add 8 tenths', say: 'The 8 tenths fill the second whole and spill over.' }, { btn: 'Regroup ten tenths', say: '21 tenths = 2 wholes and 1 tenth: 2.1' }, { btn: 'Check', say: '2.1 − 0.8 = 1.3' }],
});

export const N15 = scene({
  title: 'Double the recipe',
  intro: 'One batch: 30 g oats and 20 g fruit. Each block is 10 g.',
  explain: 'Doubling scales both amounts: 60 g oats and 40 g fruit. Halving both returns to 30 g and 20 g. The 3-to-2 relationship stays.',
  explain_zh: '按比例放大，每样都要乘同一个数：燕麦 30 克、水果 20 克，翻倍后是 60 克和 40 克；再减半又回到原来。燕麦和水果始终是 3 份比 2 份。',
  items: [T(40, 66, 'oats', 'mv-num'), T(40, 126, 'fruit', 'mv-num'),
    range(6).map(i => R(70 + i * 34, 48, 32, 28, i < 3 ? 'mv-c2' : 'mv-c2', i < 3 ? {} : { at: 1, out: 2, from: [-102, 0], move: [{ at: 1 }] })), range(4).map(i => R(70 + i * 34, 108, 32, 28, 'mv-c4', i < 2 ? {} : { at: 1, out: 2, from: [-68, 0], move: [{ at: 1 }] })),
    T(150, 30, '30 g oats + 20 g fruit', 'mv-mid', { out: 1 }), T(150, 30, '× 2: 60 g oats + 40 g fruit', 'mv-mid', { at: 1, out: 2 }), T(150, 30, '÷ 2: back to 30 g + 20 g', 'mv-mid', { at: 2 }), T(150, 172, 'oats : fruit is always 3 : 2', 'mv-mid', { at: 3 })],
  h: 190,
  steps: [{ say: 'One batch.' }, { btn: 'Double it', say: 'Both amounts double: 60 g and 40 g.' }, { btn: 'Halve it', say: 'Both amounts halve: back to 30 g and 20 g.' }, { btn: 'Compare', say: 'There are always 3 blocks of oats for every 2 of fruit.' }],
});

export const N16 = partScene({ total: 42, groups: 6, title: 'One sixth of 42', intro: 'Make 6 equal groups from the whole set.',
  explain: '42 shared into 6 equal groups gives 7 each: 1/6 of 42 = 7. Six groups of 7 rebuild 42.', explain_zh: '求 42 的六分之一：把 42 平均分成 6 组，每组 7 个。用 6 × 7 = 42 检查。' });

export const N17 = scene({
  title: 'Rebuild the ribbon',
  intro: 'One sixth of a ribbon is 7 cm.',
  explain: 'The whole is six equal parts: 6 × 7 = 42 cm. Check: 42 ÷ 6 = 7 cm.',
  explain_zh: '知道一份（1/6）是 7 厘米，整体是 6 份：6 × 7 = 42 厘米。再用 42 ÷ 6 = 7 检查。',
  items: [range(6).map(i => G([R(30 + i * 40, 70, 40, 30, i ? 'mv-c3' : 'mv-c1'), T(50 + i * 40, 90, '7', 'mv-num')], i ? { at: 1, from: [-i * 40, 0], move: [{ at: 1 }] } : {})),
    T(50, 120, '1/6', 'mv-num'), T(150, 40, '1/6 = 7 cm', 'mv-mid', { out: 2 }), T(150, 40, '6 × 7 = 42 cm', 'mv-mid', { at: 2, out: 3 }), T(150, 40, '42 ÷ 6 = 7 cm ✓', 'mv-mid', { at: 3 }),
    G([L(30, 130, 270, 130, 'mv-arc'), T(150, 150, 'whole ribbon', 'mv-jl')], { at: 2 })],
  steps: [{ say: 'One sixth: 7 cm.' }, { btn: 'Repeat it 6 times', say: 'Six equal parts make the whole.' }, { btn: 'Find the whole', say: '6 × 7 = 42 cm' }, { btn: 'Check', say: '42 ÷ 6 = 7 cm. It fits.' }],
});

const mcoin = (x, y, v, o = {}) => G([C(x, y, v === 2 ? 17 : 14, 'mv-gold'), T(x, y + 4, `$${v}`, 'mv-coinl')], o);
export const N18 = scene({
  title: 'Make $5 two ways',
  intro: 'Different coins can make the same amount.',
  explain: 'Two $2 coins and one $1 coin make $5. Five $1 coins make the same $5.',
  explain_zh: '同样是 5 元可以有不同组合：2 + 2 + 1 = 5，也可以是 5 个 1 元。换钱时总数不变。1 元 = 100 分。',
  items: [T(150, 24, 'Make $5', 'mv-mid'), mcoin(60, 60, 2, { at: 1 }), mcoin(110, 60, 2, { at: 1 }), mcoin(155, 60, 1, { at: 1 }), T(240, 64, '2 + 2 + 1 = $5', 'mv-mid', { at: 1 }),
    range(5).map(i => mcoin(28 + i * 31, 130, 1, { at: 2 })), T(240, 134, '1 + 1 + 1 + 1 + 1', 'mv-num', { at: 2 }), T(240, 152, '= $5', 'mv-mid', { at: 2 }), T(150, 186, 'Same total: $5 = 500 cents', 'mv-mid', { at: 3 })],
  steps: [{ say: 'How can we make $5?' }, { btn: 'Use $2 and $1 coins', say: '2 + 2 + 1 = $5' }, { btn: 'Use $1 coins', say: 'Five $1 coins also make $5.' }, { btn: 'Compare', say: 'Different coins, the same total.' }],
});

const N19l = numberLine(0, 20, { y: 125, every: 1, label: 5 });
export const N19 = scene({
  title: 'Cost and change',
  intro: 'Three notebooks cost $4 each, and a pen costs $5. You pay with $20.',
  explain: '3 × $4 = $12, plus $5 = $17. Count up to $20: change is $3. Check: 17 + 3 = 20.',
  explain_zh: '同价多件用乘法：3 本 × 4 元 = 12 元，再加笔 5 元共 17 元。找零从 17 数到 20，是 3 元。花的钱 + 找零 = 付的钱。',
  items: [N19l.items, [0, 4, 8].map(v => jump(N19l.X, 125, v, v + 4, { at: 1, label: '$4' })), jump(N19l.X, 125, 12, 17, { at: 2, label: 'pen $5' }), jump(N19l.X, 125, 17, 20, { at: 3, below: true, label: '+$3', cls: 'mv-arc2' }),
    hopper(N19l.X, 125, 0, [[1, 12], [2, 17], [3, 20]]), T(150, 26, '3 × 4 = 12', 'mv-mid', { at: 1, out: 2 }), T(150, 26, '12 + 5 = $17', 'mv-mid', { at: 2, out: 3 }), T(150, 26, 'change $3 · 17 + 3 = 20 ✓', 'mv-mid', { at: 3 })],
  steps: [{ say: 'Start at $0.' }, { btn: 'Add 3 notebooks', say: '3 × $4 = $12' }, { btn: 'Add the pen', say: '$12 + $5 = $17' }, { btn: 'Count up to $20', say: 'Change: $3' }],
});

// ---- Algebra ----------------------------------------------------------------------------------
export const A01 = balanceScene({ left: '460 +', right: '600', missing: '140', tilt: 10, title: 'Keep the equation balanced', intro: 'What makes 460 + ? equal 600?', check: '600 − 460 = 140, so 460 + 140 = 600 ✓',
  explain: 'Both sides must name the same amount. Undo the adding: 600 − 460 = 140, so 460 + 140 = 600.', explain_zh: '等式两边的值相等，像天平平衡。求 460 + □ = 600 里的 □，用逆运算：600 − 460 = 140。两边同时加同一个数，天平仍然平衡。' });

export const A02 = partScene({ total: 28, groups: 4, title: 'Find the missing factor', intro: '4 × ? = 28. Share 28 into 4 equal groups.',
  t2: '4 × ? = 28', t3: '28 ÷ 4 = 7 ✓', says: ['28 counters.', '4 equal groups of 7.', 'Each group has the missing factor: 7.', '4 × 7 = 28 is true.'],
  explain: 'Undo the multiplication: 28 shared into 4 equal groups gives 7, so 4 × 7 = 28.', explain_zh: '求 4 × □ = 28 的 □，用除法：把 28 平均分成 4 组，每组 7 个，所以 □ = 7，再代回去检查 4 × 7 = 28。' });

export const A03 = scene({
  title: 'Two kinds of growth',
  intro: 'One pattern adds the same amount; the other doubles.',
  explain: '2, 4, 6 add 2 each time. 3, 6, 12, 24 double each time, so the added amount keeps growing. Going back, divide by 2.',
  explain_zh: '规律有不同的变化方式：2、4、6 每次加 2（增加的量一样）；3、6、12、24 每次乘 2（增加的量越来越大）。倒过来看，就是每次除以 2。',
  items: [range(3).map(t => G(range(2 * (t + 1)).map(b => R(30 + t * 60 + (b % 2) * 16, 70 - Math.floor(b / 2) * 16, 14, 14, 'mv-c1')), { at: t })), range(2).map(t => T(68 + t * 60, 30, '+2', 'mv-jl', { at: t + 1 })), T(250, 60, '+2 each time', 'mv-mid', { at: 2 }),
    [3, 6, 12, 24].map((v, i) => G([R(30, 104 + i * 22, v * 9, 16, 'mv-c2'), T(40 + v * 9, 116 + i * 22, String(v), 'mv-num')], { at: 3 })), T(258, 132, '× 2', 'mv-mid', { at: 3 }), T(258, 156, '÷ 2 going back', 'mv-num', { at: 4 })],
  h: 200,
  steps: [{ say: '2 tiles.' }, { btn: 'Grow', say: '4 tiles: add 2.' }, { btn: 'Grow', say: '6 tiles: add 2 again.' }, { btn: 'Show a doubling pattern', say: '3, 6, 12, 24: each one doubles.' }, { btn: 'Go backwards', say: '24, 12, 6, 3: divide by 2 each time.' }],
});

// ---- Measurement -------------------------------------------------------------------------------
const M01l = numberLine(0, 130, { x0: 24, x1: 276, y: 120, every: 10, label: 50 });
export const M01 = scene({
  title: 'Metres and centimetres',
  intro: 'A metre stick is 100 cm long.',
  explain: '1 m = 100 cm. So 1 m 23 cm = 100 cm + 23 cm = 123 cm.',
  explain_zh: '1 米 = 100 厘米。1 米 23 厘米就是 100 + 23 = 123 厘米。混合单位要换成同一种单位再比较或计算。',
  items: [M01l.items, R(M01l.X(0), 84, M01l.X(100) - M01l.X(0), 22, 'mv-c1', { at: 1 }), T((M01l.X(0) + M01l.X(100)) / 2, 100, '1 m = 100 cm', 'mv-num', { at: 1 }),
    R(M01l.X(100), 84, M01l.X(123) - M01l.X(100), 22, 'mv-c2', { at: 2 }), T((M01l.X(100) + M01l.X(123)) / 2, 76, '23 cm', 'mv-jl', { at: 2 }), T(150, 40, '1 m 23 cm = 100 + 23 = 123 cm', 'mv-mid', { at: 3 })],
  steps: [{ say: 'A tape measure in centimetres.' }, { btn: 'Lay a metre stick', say: '1 metre = 100 centimetres.' }, { btn: 'Add 23 cm more', say: '1 m and 23 cm.' }, { btn: 'Write it in cm', say: '100 + 23 = 123 cm' }],
});

export const M02 = (() => {
  const top = 30, bot = 170, Y = t => bot - (t - 10) / 20 * (bot - top);
  return scene({
    title: 'Read the thermometer',
    intro: 'Each small mark is 2 degrees Celsius.',
    explain: 'The liquid stops halfway between 20 and 22: 21 °C. When it rises to 26 °C it is 5 degrees warmer.',
    explain_zh: '先看刻度每格代表几度（这里每格 2 度）。液面在 20 和 22 中间，读 21 °C；升到 26 °C，比 21 °C 高 5 度。',
    items: [R(112, top - 6, 26, bot - top + 12, 'mv-tube', { rx: 13 }), C(125, bot + 14, 17, 'mv-redb'),
      R(118, top, 14, bot - top + 4, 'mv-redl', { scale: { cx: 125, cy: bot + 4, from: [1, (bot + 4 - Y(14)) / (bot + 4 - top)], keys: [{ at: 1, sx: 1, sy: (bot + 4 - Y(21)) / (bot + 4 - top) }, { at: 2, sx: 1, sy: (bot + 4 - Y(26)) / (bot + 4 - top) }] } }),
      range(11).map(i => { const t = 10 + i * 2; return [L(140, Y(t), t % 10 === 0 ? 156 : 150, Y(t), 'mv-tickl'), t % 10 === 0 ? T(172, Y(t) + 4, `${t}`, 'mv-num') : []]; }), T(180, 18, '°C', 'mv-num'),
      T(240, Y(21) + 4, '21 °C', 'mv-mid', { at: 1 }), T(240, Y(26) + 4, '26 °C', 'mv-mid', { at: 2 }), T(232, 150, '5 degrees warmer', 'mv-num', { at: 3 })],
    h: 200,
    steps: [{ say: 'A thermometer. Marks every 2 degrees.' }, { btn: 'Warm it up', say: 'Halfway between 20 and 22: 21 °C.' }, { btn: 'Warm it more', say: 'Now it reads 26 °C.' }, { btn: 'Compare', say: '26 °C is 5 degrees warmer than 21 °C.' }],
  });
})();

export const M03 = perimeterScene({ w: 8, h: 5, unit: 'cm', s: 24, title: 'Measure the boundary', intro: 'Trace every edge once.',
  explain: 'Perimeter follows all four edges: 8 + 5 + 8 + 5 = 26 cm. Two pairs of equal sides give the same total.', explain_zh: '周长是沿边缘走一圈的长度，每条边算一次：8 + 5 + 8 + 5 = 26 厘米。长方形对边相等，也可以算 (8 + 5) × 2。' });

export const M04 = areaScene({ cols: 6, rows: 4, unit: 'square units', title: 'Rows of square units', intro: 'Fill the rectangle row by row.',
  explain: '4 rows of 6 squares: 4 × 6 = 24 square units. If the area is 24 and one side is 6, the other side is 24 ÷ 6 = 4.', explain_zh: '长方形面积 = 行数 × 每行个数：4 × 6 = 24 平方单位。反过来，面积 24、一边 6，另一边就是 24 ÷ 6 = 4。' });

export const M05 = (() => {
  const s = 30, x0 = 60, y0 = 40, full = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]];
  return scene({
    title: 'Whole and half squares',
    intro: 'Count the full squares, then the half square.',
    explain: 'Six full squares and one half square cover 6 1/2 square units. A triangle cut corner to corner is half a square.',
    explain_zh: '不规则图形也可以数方格：6 个整格，再加上一个沿对角线切开的半格（两个半格合成一整格），面积是 6又1/2 平方单位。',
    items: [gridLines(x0, y0, 5, 3, s), full.map(([c, r]) => R(x0 + c * s, y0 + r * s, s, s, 'mv-c3')), P(`M${x0 + 3 * s} ${y0 + s} L${x0 + 3 * s} ${y0 + 2 * s} L${x0 + 4 * s} ${y0 + 2 * s} Z`, 'mv-c2', { hl: 2 }),
      full.map(([c, r], i) => T(x0 + c * s + s / 2, y0 + r * s + 20, String(i + 1), 'mv-mid', { at: 1 })), T(x0 + 3 * s + 9, y0 + 2 * s - 6, '½', 'mv-mid', { at: 2 }),
      P(`M${x0 + 3 * s} ${y0 + s} L${x0 + 4 * s} ${y0 + s} L${x0 + 4 * s} ${y0 + 2 * s} Z`, 'mv-ghost', { at: 2 }), T(150, 170, '6 + ½ = 6 ½ square units', 'mv-mid', { at: 3 })],
    steps: [{ say: 'A shape on square units.' }, { btn: 'Count full squares', say: '6 full squares.' }, { btn: 'Look at the half', say: 'The triangle is half a square: two halves would make one.' }, { btn: 'Add them', say: '6 ½ square units.' }],
  });
})();

export const M07 = scene({
  title: 'Turn and measure',
  intro: 'Turn the arm clockwise: a quarter, a half, then all the way round.',
  explain: 'A quarter turn is 90° (one right angle). Two make a half turn, 180°. Four make a full turn, 360°.',
  explain_zh: '转动的大小叫角度：四分之一圈是 90°（一个直角），半圈 180°，一整圈 360°。四个直角合起来正好转一圈。',
  items: [sector(150, 110, 70, 0, 90, 'mv-sector2', { at: 1 }), sector(150, 110, 70, 90, 180, 'mv-sector', { at: 2 }), sector(150, 110, 70, 180, 359.9, 'mv-sector3', { at: 3 }),
    L(150, 110, 150, 34, 'mv-axis'), G([L(150, 110, 150, 34, 'mv-mhand')], { rot: { cx: 150, cy: 110, from: 0, keys: [{ at: 1, deg: 90 }, { at: 2, deg: 180 }, { at: 3, deg: 360 }] } }), C(150, 110, 5, 'mv-pin'),
    P('M150 98 L162 98 L162 110', 'mv-frame', { at: 1, out: 2 }), T(250, 60, '90°', 'mv-mid', { at: 1, out: 2 }), T(250, 60, '180°', 'mv-mid', { at: 2, out: 3 }), T(250, 60, '360°', 'mv-mid', { at: 3 }),
    T(250, 84, 'quarter turn', 'mv-num', { at: 1, out: 2 }), T(250, 84, 'half turn', 'mv-num', { at: 2, out: 3 }), T(250, 84, 'full turn', 'mv-num', { at: 3 })],
  steps: [{ say: 'The arm points up.' }, { btn: 'Quarter turn', say: 'A quarter turn: 90°, one right angle.' }, { btn: 'Another quarter', say: 'Two quarter turns: 180°, a half turn.' }, { btn: 'Go all the way round', say: 'Four quarter turns: 360°, back to the start.' }],
});

export const M08 = scene({
  title: 'Read every minute',
  intro: 'Move the minute hand from 9:00 to 9:17.',
  explain: 'Count by fives to 15, then 2 more ones: 17 minutes past 9. The digital clock shows 9:17 am.',
  explain_zh: '长针每走一个数字是 5 分钟，每一小格是 1 分钟。5、10、15，再数 2 小格就是 17 分。时针已经过了 9，所以是 9:17（上午就是 am）。',
  items: [clockFace(105, 100, 82), sector(105, 100, 74, 0, 90, 'mv-sector2', { at: 1, out: 2 }), sector(105, 100, 74, 0, 102, 'mv-sector2', { at: 2 }),
    hand(105, 100, 46, 'mv-hhand', 270, [{ at: 1, deg: 277.5 }, { at: 2, deg: 278.5 }]), hand(105, 100, 68, 'mv-mhand', 0, [{ at: 1, deg: 90 }, { at: 2, deg: 102 }]), C(105, 100, 5, 'mv-pin'),
    T(245, 80, '9:00', 'mv-big', { out: 1 }), T(245, 80, '9:15', 'mv-big', { at: 1, out: 2 }), T(245, 80, '9:17 am', 'mv-big', { at: 2 }), T(245, 108, '5, 10, 15', 'mv-num', { at: 1, out: 2 }), T(245, 108, '15, 16, 17', 'mv-num', { at: 2 })],
  steps: [{ say: '9 o’clock in the morning.' }, { btn: 'Count by fives', say: '5, 10, 15 minutes.' }, { btn: 'Count on in ones', say: '16, 17: the time is 9:17 am.' }],
});

export const M09 = scene({
  title: 'Sixty, not one hundred',
  intro: 'Build 1 hour 42 minutes in minutes.',
  explain: '1 hour is 60 minutes, so 1 hour 42 minutes = 60 + 42 = 102 minutes. Also 90 seconds = 60 + 30 seconds = 1 ½ minutes.',
  explain_zh: '时间是 60 进制：1 小时 = 60 分钟，1 分钟 = 60 秒，不是 100。1 小时 42 分 = 60 + 42 = 102 分钟；90 秒 = 60 秒 + 30 秒 = 1分半。',
  items: [T(150, 26, '1 hour 42 minutes = ? minutes', 'mv-mid'), R(30, 50, 120, 30, 'mv-c1', { at: 1 }), T(90, 70, '60 min = 1 hour', 'mv-num', { at: 1 }), R(150, 50, 84, 30, 'mv-c2', { at: 2 }), T(192, 70, '42 min', 'mv-num', { at: 2 }), T(150, 110, '60 + 42 = 102 minutes', 'mv-mid', { at: 3 }),
    R(30, 136, 120, 24, 'mv-c5', { at: 4 }), R(150, 136, 60, 24, 'mv-c3', { at: 4 }), T(90, 153, '60 s', 'mv-num', { at: 4 }), T(180, 153, '30 s', 'mv-num', { at: 4 }), T(150, 184, '90 seconds = 1 ½ minutes', 'mv-mid', { at: 4 })],
  h: 195,
  steps: [{ say: '1 hour 42 minutes. How many minutes?' }, { btn: 'Show 1 hour', say: '1 hour = 60 minutes.' }, { btn: 'Add 42 minutes', say: '60 and 42 more.' }, { btn: 'Total', say: '60 + 42 = 102 minutes.' }, { btn: 'Try seconds', say: '90 seconds = 60 + 30 seconds = 1 ½ minutes.' }],
});

// ---- Geometry ----------------------------------------------------------------------------------
export const G01 = polygonScene({ n: 6, title: 'Describe a hexagon', intro: 'Count the edges, check them, then pull one vertex.',
  explain: 'A hexagon has 6 straight edges and 6 vertices. It is regular when all edges and angles are equal; moving one vertex makes it irregular, but it is still a hexagon.', explain_zh: '多边形由直的边围成，边和边相交的点叫顶点。六边形有 6 条边、6 个顶点。边和角都相等叫正六边形；移动一个顶点后边不相等，变成不规则六边形，但仍然是六边形。' });

export const G02 = scene({
  title: 'Fold to find mirror lines',
  intro: 'Fold the rectangle, then look at the square and the circle.',
  explain: 'A rectangle (not a square) has 2 mirror lines, a square has 4, and a circle folds along any diameter: infinitely many.',
  explain_zh: '对称轴是把图形对折后两边完全重合的那条线。长方形（不是正方形）有 2 条，正方形有 4 条（含两条对角线），圆沿任何一条直径对折都重合，有无数条。注意长方形的对角线不是对称轴。',
  h: 220,
  items: [R(20, 40, 120, 70, 'mv-c3'), G([R(20, 40, 60, 70, 'mv-c1')], { scale: { cx: 80, cy: 75, from: [1, 1], keys: [{ at: 1, sx: -1 }, { at: 2, sx: 1 }] } }), L(80, 30, 80, 120, 'mv-mirror', { at: 1 }), L(10, 75, 150, 75, 'mv-mirror', { at: 2 }), T(80, 140, 'rectangle: 2 lines', 'mv-num', { at: 2 }),
    R(180, 30, 90, 90, 'mv-c3'), [[225, 22, 225, 128], [172, 75, 278, 75], [174, 24, 276, 126], [276, 24, 174, 126]].map(([a, b, c, d]) => L(a, b, c, d, 'mv-mirror', { at: 3 })), T(225, 140, 'square: 4 lines', 'mv-num', { at: 3 }),
    C(150, 180, 28, 'mv-c3', { at: 4 }), range(6).map(i => { const a = i * Math.PI / 6; return L(150 - 34 * Math.cos(a), 180 - 34 * Math.sin(a), 150 + 34 * Math.cos(a), 180 + 34 * Math.sin(a), 'mv-mirror', { at: 4 }); }), T(240, 184, 'circle: any diameter', 'mv-num', { at: 4 })],
  steps: [{ say: 'A rectangle and a square.' }, { btn: 'Fold the rectangle', say: 'The left half folds onto the right half: a mirror line.' }, { btn: 'Try another direction', say: 'Folding top to bottom also matches: 2 mirror lines.' }, { btn: 'Check the square', say: 'A square has 4 mirror lines, including the diagonals.' }, { btn: 'Check a circle', say: 'Any diameter works: infinitely many mirror lines.' }],
});

export const G04 = (() => {
  const s = 20, x0 = 20, y0 = 20, tri = (dx = 0) => `M${x0 + (1 + dx) * s} ${y0 + 6 * s} L${x0 + (1 + dx) * s} ${y0 + 3 * s} L${x0 + (3 + dx) * s} ${y0 + 6 * s} Z`;
  return scene({
    title: 'Slide, flip and turn',
    intro: 'Move the triangle three different ways.',
    explain: 'A slide (translation) moves every point the same way. A flip (reflection) mirrors it across a line. A turn (rotation) spins it around one fixed point.',
    explain_zh: '平移：每个点朝同一方向移动同样距离，形状和朝向不变；翻转（轴对称）：沿镜子线翻过去，对应点到线的距离相等；旋转：绕一个固定点转动。三种变换后形状大小都不变。',
    w: 300, h: 200,
    items: [gridLines(x0, y0, 13, 7, s), P(tri(), 'mv-c1'), P(tri(), 'mv-c2', { at: 1, move: [{ at: 1, dx: 3 * s }] }), L(x0 + 7 * s, y0, x0 + 7 * s, y0 + 7 * s, 'mv-mirror', { at: 2 }),
      P(tri(3), 'mv-c5', { at: 2, scale: { cx: x0 + 7 * s, cy: 0, from: [1, 1], keys: [{ at: 2, sx: -1 }] } }),
      P(tri(9), 'mv-c4', { at: 3, rot: { cx: x0 + 10 * s, cy: y0 + 6 * s, from: 0, keys: [{ at: 3, deg: 90 }] } }), C(x0 + 10 * s, y0 + 6 * s, 4, 'mv-pin', { at: 3 }),
      T(80, 194, 'slide', 'mv-jl', { at: 1 }), T(160, 194, 'flip', 'mv-jl', { at: 2 }), T(240, 194, 'turn', 'mv-jl', { at: 3 })],
    steps: [{ say: 'A green triangle.' }, { btn: 'Slide it', say: 'Slide 3 squares right: every point moves the same.' }, { btn: 'Flip it', say: 'Flip across the mirror line.' }, { btn: 'Turn it', say: 'Turn a quarter turn around the dot.' }],
  });
})();

export const G05 = (() => {
  const s = 40, x0 = 60, y0 = 30, rows = ['A', 'B', 'C', 'D'];
  return scene({
    title: 'Find B3, then move',
    intro: 'Letters name the rows, numbers name the columns.',
    explain: 'B3 is where row B meets column 3. One square right is column 4, so the new square is B4.',
    explain_zh: '网格坐标：字母表示行，数字表示列。B3 就是 B 行和第 3 列交叉的格子；向右走一格，列变成 4，所以是 B4。',
    items: [gridLines(x0, y0, 5, 4, s), rows.map((r, i) => T(x0 - 16, y0 + i * s + 25, r, 'mv-mid')), range(5).map(c => T(x0 + c * s + 20, y0 - 8, String(c + 1), 'mv-mid')),
      R(x0, y0 + s, 5 * s, s, 'mv-rowhl', { at: 1 }), R(x0 + 2 * s, y0, s, 4 * s, 'mv-colhl2', { at: 2 }), C(x0 + 2.5 * s, y0 + 1.5 * s, 10, 'mv-dot', { at: 2, move: [{ at: 3, dx: s }] }),
      T(150, 196, 'B3 → one right → B4', 'mv-mid', { at: 3 })],
    h: 205,
    steps: [{ say: 'A map grid.' }, { btn: 'Find row B', say: 'Row B.' }, { btn: 'Find column 3', say: 'Row B meets column 3: B3.' }, { btn: 'Move one right', say: 'One square right: B4.' }],
  });
})();

// ---- Statistics --------------------------------------------------------------------------------
const pets = [1, 1, 2, 3, 3, 3, 4];
function dotPlot(o = {}) {
  const X = v => 50 + v * 50, seen = {};
  return [L(30, 160, 290, 160, 'mv-axis'), range(5).map(v => T(X(v), 178, String(v), 'mv-num')), T(160, 196, 'number of pets', 'mv-num'),
    pets.map((v, i) => { const k = seen[v] = (seen[v] || 0) + 1; return C(X(v), 160 - k * 22 + 4, 9, 'mv-c1', o.dot ? o.dot(v, k, i) : {}); })];
}
export const S01 = scene({
  title: 'What kind of data?',
  intro: 'Sort the cards: categories, counts and measurements.',
  explain: 'Pet type is a category; pet count is a counted number; leaf length is measured and keeps its unit. Recording to the nearest cm: 6.2 → 6, 7.8 → 8.',
  explain_zh: '数据有不同类型：宠物种类是“类别”；宠物数量是“计数”；叶子长度是“测量值”，要带单位。按整厘米记录时，6.2 记作 6，7.8 记作 8。',
  items: [['category', 'count', 'measured'].map((h, i) => T(55 + i * 95, 104, h, 'mv-mid', { at: 1 })),
    [['cat', 0], ['dog', 0], ['2 pets', 1], ['3 pets', 1], ['6.2 cm', 2], ['7.8 cm', 2]].map(([t, g], i) => { const x0 = 20 + (i % 3) * 95, y0 = 22 + Math.floor(i / 3) * 34, x1 = 20 + g * 95, y1 = 116 + (i % 2) * 34; return G([R(x0, y0, 76, 26, 'mv-note', { rx: 4 }), T(x0 + 38, y0 + 18, t, 'mv-num')], { move: [{ at: 1, dx: x1 - x0, dy: y1 - y0 }] }); }),
    T(150, 198, 'nearest cm: 6.2 → 6 cm, 7.8 → 8 cm', 'mv-jl', { at: 2 })],
  h: 205,
  steps: [{ say: 'Six things we recorded.' }, { btn: 'Sort them', say: 'Categories, counted numbers and measurements.' }, { btn: 'Round the lengths', say: 'To the nearest centimetre: 6.2 → 6, 7.8 → 8.' }],
});

export const S02 = scene({
  title: 'Stack the dots',
  intro: 'Seven people told us how many pets they have: 1, 1, 2, 3, 3, 3, 4.',
  explain: 'One dot per person; repeated values stack. The bar graph shows the same frequencies on a scale that starts at zero.',
  explain_zh: '点图：每个人一个点，数值相同的点往上叠。条形图表示同样的频数，纵轴要从 0 开始并标好刻度。',
  h: 205,
  items: [range(5).map(v => R(36 + v * 50, 160 - [0, 2, 1, 3, 1][v] * 22, 28, [0, 2, 1, 3, 1][v] * 22, 'mv-barghost', { at: 3 })),
    dotPlot({ dot: (v, k, i) => ({ at: i < 3 ? 1 : 2, from: [0, -60], move: [{ at: i < 3 ? 1 : 2 }] }) }), L(30, 160, 30, 80, 'mv-axis', { at: 3 }), [0, 1, 2, 3].map(f => T(20, 164 - f * 22, String(f), 'mv-num', { at: 3 }))],
  steps: [{ say: 'An empty number line from 0 to 4 pets.' }, { btn: 'Add the first 3 people', say: '1, 1, 2: the two 1s stack.' }, { btn: 'Add the other 4', say: '3, 3, 3, 4' }, { btn: 'Show it as bars', say: 'The bars show the same frequencies, from zero.' }],
});

export const S03 = scene({
  title: 'Value or frequency?',
  intro: 'Each dot is one person. Where it sits is their number of pets.',
  explain: 'A stack’s height is a frequency: three people have 3 pets. The largest value is 4 pets, not the tallest stack.',
  explain_zh: '点图上：横轴位置是“数值”（养几只），同一列叠了几个点是“频数”（几个人）。3 上面有 3 个点表示 3 个人养 3 只；最多的人养 4 只，不是“3”。',
  h: 205,
  items: [dotPlot({ dot: (v, k) => ({ hl: v === 2 ? 1 : v === 3 ? 2 : v === 4 ? 3 : null, hlOut: v === 2 ? 2 : v === 3 ? 3 : null }) }),
    T(150, 30, 'This person has 2 pets', 'mv-mid', { at: 1, out: 2 }), T(150, 30, 'Frequency: 3 people have 3 pets', 'mv-mid', { at: 2, out: 3 }), T(150, 30, 'Largest value: 4 pets', 'mv-mid', { at: 3 })],
  steps: [{ say: 'A dot plot of pets.' }, { btn: 'Pick one dot', say: 'One dot = one person. This one has 2 pets.' }, { btn: 'Look at a stack', say: 'Three dots above 3: three people have 3 pets.' }, { btn: 'Find the largest value', say: 'The most pets one person has is 4.' }],
});

export const S04 = scene({
  title: 'Describe the data',
  intro: 'Look for the peak, the middle and the spread.',
  explain: 'The peak is 3 pets, the middle value is 3, and the values spread from 1 to 4. This describes our group of seven, not every child.',
  explain_zh: '描述数据：最高的一列（峰）是 3；7 个数从小到大排，中间第 4 个是 3；数值从 1 到 4（分布范围）。结论只适用于这 7 个人，不能说成全新西兰的孩子。',
  h: 205,
  items: [dotPlot({ dot: (v, k, i) => ({ hl: i === 3 ? 2 : null, hlOut: 3 }) }), R(190, 82, 20, 78, 'mv-ring', { at: 1, out: 2, rx: 10 }),
    G([L(100, 60, 250, 60, 'mv-arc'), L(100, 54, 100, 66, 'mv-arc'), L(250, 54, 250, 66, 'mv-arc')], { at: 3 }),
    T(150, 26, 'Peak: 3 pets', 'mv-mid', { at: 1, out: 2 }), T(150, 26, 'Middle (4th of 7): 3 pets', 'mv-mid', { at: 2, out: 3 }), T(150, 26, 'Spread: 1 to 4 pets', 'mv-mid', { at: 3, out: 4 }), T(150, 26, 'True for our 7 people, not everyone', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Seven people’s pets.' }, { btn: 'Find the peak', say: 'The tallest stack is at 3.' }, { btn: 'Find the middle', say: 'In order 1, 1, 2, 3, 3, 3, 4 the middle is 3.' }, { btn: 'Find the spread', say: 'From 1 to 4 pets.' }, { btn: 'Make a careful claim', say: 'This is about our group only.' }],
});

export const Y4 = { N01, N02, N03, N04, N05, N06, N07, N08, N09, N10, N11, N12, N13, N14, N15, N16, N17, N18, N19, A01, A02, A03, M01, M02, M03, M04, M05, M07, M08, M09, G01, G02, G04, G05, S01, S02, S03, S04 };
