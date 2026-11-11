// Year 3 "Watch it move" animations: one short, tap-through scene per lesson.
import { scene, R, C, L, P, T, G, numberLine, jump, hopper, hundred, ten, one, counters, strip, clockFace, hand, gridLines, sector, polygon, pathOf } from './motion-kit.mjs';

const range = n => Array.from({ length: n }, (_, i) => i);
const fracFmt = d => v => { const n = Math.round(v * d); return n === 0 ? '0' : n === d ? '1' : `${n}/${d}`; };

// ---- Number ---------------------------------------------------------------------------------
const placeChart = (heads, x0, w, y = 18) => heads.flatMap((hd, i) => [R(x0 + i * w, y, w, 26, 'mv-head'), T(x0 + i * w + w / 2, y + 18, hd, 'mv-num'), L(x0 + i * w, y, x0 + i * w, 190, 'mv-grid')]).concat([L(x0 + heads.length * w, y, x0 + heads.length * w, 190, 'mv-grid')]);

export const N01 = scene({
  title: 'Build 234 with blocks',
  intro: 'Put blocks in the hundreds, tens and ones places, then read the number.',
  explain: 'Each digit’s place tells its value: 2 hundreds, 3 tens and 4 ones make 234 = 200 + 30 + 4.',
  explain_zh: '数字的位置决定它的大小：2 个百、3 个十、4 个一合起来是 234 = 200 + 30 + 4。可以让孩子指着每一位说出它代表多少。',
  items: [placeChart(['Hundreds', 'Tens', 'Ones'], 20, 87),
    hundred(28, 56, { at: 1, from: [0, -50], move: [{ at: 1 }] }), hundred(72, 56, { at: 1, from: [0, -50], move: [{ at: 1 }] }),
    range(3).map(i => ten(125 + i * 12, 56, { at: 2, from: [0, -50], move: [{ at: 2 }] })),
    range(4).map(i => one(215 + i * 9, 80, { at: 3, from: [0, -50], move: [{ at: 3 }] })),
    T(63, 130, '2', 'mv-big', { at: 1 }), T(150, 130, '3', 'mv-big', { at: 2 }), T(237, 130, '4', 'mv-big', { at: 3 }),
    T(150, 172, '234 = 200 + 30 + 4', 'mv-mid', { at: 4 })],
  steps: [{ say: 'An empty chart: hundreds, tens and ones.' }, { btn: 'Add 2 hundreds', say: '2 hundreds are 200.' }, { btn: 'Add 3 tens', say: '3 tens are 30.' }, { btn: 'Add 4 ones', say: '4 ones are 4.' }, { btn: 'Read the number', say: '2 hundreds, 3 tens and 4 ones make 234.' }],
});

export const N02 = scene({
  title: 'Ten hundreds make a thousand',
  intro: 'Each square is one hundred. Count them, then push them together.',
  explain: 'Ten hundreds make one thousand: 10 × 100 = 1000, written with four digits.',
  explain_zh: '10 个一百合起来是 1 个一千（1000）。就像 10 个一换 1 个十、10 个十换 1 个百，每一位满十就向左进一位。',
  items: [range(10).map(i => { const x = 18 + (i % 5) * 56, y = 22 + Math.floor(i / 5) * 56; return G([hundred(x, y), T(x + 20, y + 26, String(i + 1), 'mv-mid', { at: 1, out: 2 })], { move: [{ at: 2, dx: 130 - x + i * 1.5, dy: 70 - y - i * 1.5 }], out: 3 }); }),
    G([P('M150 40 L200 65 L150 90 L100 65 Z', 'mv-top'), P('M100 65 L150 90 L150 150 L100 125 Z', 'mv-left'), P('M150 90 L200 65 L200 125 L150 150 Z', 'mv-right')], { at: 3 }),
    T(150, 182, '10 hundreds = 1 thousand = 1000', 'mv-mid', { at: 3 })],
  steps: [{ say: 'Ten hundreds. Each square is 100.' }, { btn: 'Count them', say: '1, 2, 3 … 10 hundreds.' }, { btn: 'Push them together', say: 'Ten hundreds in one pile.' }, { btn: 'Make a thousand', say: '10 hundreds = 1 thousand = 1000.' }],
});

const N03line = numberLine(300, 340, { y: 125, every: 2, label: 10 });
export const N03 = scene({
  title: 'Which is greater?',
  intro: 'Compare 313 and 330: first the hundreds, then the tens.',
  explain: 'Both have 3 hundreds, so compare the tens: 1 ten is less than 3 tens. 313 < 330.',
  explain_zh: '比较大小从最高位开始：百位都是 3，就看十位，1 个十比 3 个十少，所以 313 < 330。符号的开口朝向大的数。',
  items: [N03line.items,
    ['3', '1', '3'].map((d, i) => T(92 + i * 15, 52, d, 'mv-big', { hl: i === 0 ? 2 : i === 1 ? 3 : null, hlOut: i === 0 ? 3 : null })),
    ['3', '3', '0'].map((d, i) => T(178 + i * 15, 52, d, 'mv-big', { hl: i === 0 ? 2 : i === 1 ? 3 : null, hlOut: i === 0 ? 3 : null })),
    T(150, 52, '<', 'mv-big', { at: 4 }),
    G([C(N03line.X(313), 116, 7, 'mv-dot2'), T(N03line.X(313), 100, '313', 'mv-num')], { at: 1 }),
    G([C(N03line.X(330), 116, 7, 'mv-dot'), T(N03line.X(330), 100, '330', 'mv-num')], { at: 1 })],
  steps: [{ say: 'Which is greater: 313 or 330?' }, { btn: 'Put them on the line', say: '313 comes before 330 on the number line.' }, { btn: 'Compare hundreds', say: 'Both have 3 hundreds. They match.' }, { btn: 'Compare tens', say: '1 ten is less than 3 tens.' }, { btn: 'Write it', say: '313 < 330. The open side faces the greater number.' }],
});

const N04a = numberLine(300, 400, { y: 70, every: 10, label: 50 }), N04b = numberLine(360, 370, { y: 155, every: 1, label: 5, at: 4 });
export const N04 = scene({
  title: 'Round to the nearest hundred and ten',
  intro: '367 sits between two hundreds. Which one is nearer?',
  explain: '367 is past the halfway point 350, so it rounds to 400. To the nearest ten it rounds to 370.',
  explain_zh: '先找前后两个整百（300 和 400），再看中点 350：367 过了中点，所以约等于 400。按整十看，367 在 360 和 370 之间，更接近 370。',
  items: [N04a.items, N04b.items,
    C(N04a.X(300), 70, 12, 'mv-ring', { at: 1 }), C(N04a.X(400), 70, 12, 'mv-ring', { at: 1 }),
    G([L(N04a.X(350), 40, N04a.X(350), 85, 'mv-dash'), T(N04a.X(350), 34, 'halfway', 'mv-jl')], { at: 2 }),
    hopper(N04a.X, 70, 367, [[3, 400]]), T(N04a.X(367), 50, '367', 'mv-num', { out: 3 }), T(N04a.X(400) - 10, 50, '≈ 400', 'mv-num', { at: 3 }),
    hopper(N04b.X, 155, 367, [[5, 370]], 'mv-dot', { at: 4 }), T(N04b.X(367), 135, '367', 'mv-num', { at: 4, out: 5 }), T(N04b.X(370) - 8, 135, '≈ 370', 'mv-num', { at: 5 })],
  steps: [{ say: '367 is on the line between 300 and 400.' }, { btn: 'Find the neighbours', say: 'The neighbouring hundreds are 300 and 400.' }, { btn: 'Show halfway', say: 'Halfway is 350. 367 is past halfway.' }, { btn: 'Round it', say: '367 rounds to 400.' }, { btn: 'Now to the nearest ten', say: 'Zoom in: 367 is between 360 and 370.' }, { btn: 'Round it', say: '367 rounds to 370.' }],
});

const N05l = numberLine(0, 500, { y: 120, every: 50, label: 100 });
export const N05 = scene({
  title: 'Estimate, then check',
  intro: 'Before adding 289 + 113, round each number to the nearest hundred.',
  explain: '289 is about 300 and 113 is about 100, so the total is about 400. The exact answer, 402, is close.',
  explain_zh: '先估算：289 约等于 300，113 约等于 100，和大约是 400。精确计算得 402，和估算很接近，说明答案合理。',
  items: [N05l.items, T(150, 34, '289 + 113', 'mv-big'),
    hopper(N05l.X, 120, 289, [[1, 300]], 'mv-dot2'), T(N05l.X(289), 92, '289 → 300', 'mv-num', { at: 1 }),
    hopper(N05l.X, 120, 113, [[2, 100]], 'mv-dot'), T(N05l.X(113), 92, '113 → 100', 'mv-num', { at: 2 }),
    T(150, 62, 'about 300 + 100 = 400', 'mv-mid', { at: 3, out: 4 }), T(150, 62, 'exact: 289 + 113 = 402', 'mv-mid', { at: 4 }),
    G([C(N05l.X(402), 120, 6, 'mv-star'), T(N05l.X(402), 172, '402', 'mv-num')], { at: 4 })],
  steps: [{ say: '289 + 113. Estimate first.' }, { btn: 'Round 289', say: '289 is nearer 300.' }, { btn: 'Round 113', say: '113 is nearer 100.' }, { btn: 'Add the round numbers', say: 'About 300 + 100 = 400.' }, { btn: 'Check the exact answer', say: '402 is close to 400, so the answer makes sense.' }],
});

const N06l = numberLine(0, 24, { y: 125, every: 1, label: 4 });
export const N06 = scene({
  title: 'Jump in fours',
  intro: 'Each jump adds 4. Then jump back.',
  explain: 'Counting in fours adds 4 each jump: 0, 4, 8, 12. Jumping back subtracts 4: 12, 8.',
  explain_zh: '按 4 数就是每跳一次加 4：0、4、8、12；往回跳就是每次减 4。可以让孩子边跳边说出数字。',
  items: [N06l.items, [[0, 4, 1], [4, 8, 2], [8, 12, 3]].map(([a, b, s]) => jump(N06l.X, 125, a, b, { at: s, label: '+4' })), jump(N06l.X, 125, 12, 8, { at: 4, below: true, label: '−4', cls: 'mv-arc2' }),
    hopper(N06l.X, 125, 0, [[1, 4], [2, 8], [3, 12], [4, 8]])],
  steps: [{ say: 'Start at 0.' }, { btn: 'Jump +4', say: '0 + 4 = 4' }, { btn: 'Jump +4', say: '4 + 4 = 8' }, { btn: 'Jump +4', say: '8 + 4 = 12' }, { btn: 'Jump back −4', say: 'Going back: 12 − 4 = 8' }],
});

const N07l = numberLine(0, 20, { y: 160, every: 1, label: 5 });
export const N07 = scene({
  title: 'Pairs, and where jumps meet',
  intro: 'Pair up counters, then jump in twos and fives.',
  explain: 'Even numbers make pairs; odd numbers leave one over. Jumps of 2 and jumps of 5 land together on 10 and 20.',
  explain_zh: '偶数可以两两配对，奇数会多出一个。按 2 跳和按 5 跳会在 10、20 这些 10 的倍数相遇。',
  h: 210,
  items: [counters(6, 3, 40, 30, { gap: 22, r: 8 }), range(3).map(i => R(31 + i * 22, 21, 18, 40, 'mv-pair', { at: 1 })), C(106, 30, 8, 'mv-c4', { at: 2 }), T(40 + 22 * 3 + 50, 48, '6: even', 'mv-num', { at: 1, out: 2 }), T(40 + 22 * 3 + 64, 48, '7: one left over → odd', 'mv-num', { at: 2 }),
    N07l.items, range(10).map(i => jump(N07l.X, 160, i * 2, i * 2 + 2, { at: 3 })), range(4).map(i => jump(N07l.X, 160, i * 5, i * 5 + 5, { at: 4, below: true, cls: 'mv-arc2' })),
    [10, 20].map(v => C(N07l.X(v), 160, 10, 'mv-ring', { at: 5 }))],
  steps: [{ say: '6 counters.' }, { btn: 'Make pairs', say: '6 makes 3 pairs: 6 is even.' }, { btn: 'Add one more', say: '7 leaves one without a partner: 7 is odd.' }, { btn: 'Jump in twos', say: '2, 4, 6, 8, 10 …' }, { btn: 'Jump in fives', say: '5, 10, 15, 20' }, { btn: 'Where do they meet?', say: 'Twos and fives both land on 10 and 20.' }],
});

const N08l = numberLine(30, 100, { y: 125, every: 5, label: 10 });
export const N08 = scene({
  title: 'Make 100 from 34',
  intro: 'Jump to the next ten first, then on to 100.',
  explain: '34 + 6 = 40, then 40 + 60 = 100. Together that is 6 + 60 = 66, so 34 + 66 = 100.',
  explain_zh: '先补到整十：34 + 6 = 40，再从 40 跳到 100 要 60。两段加起来 6 + 60 = 66，所以 34 + 66 = 100。',
  items: [N08l.items, jump(N08l.X, 125, 34, 40, { at: 1, label: '+6' }), jump(N08l.X, 125, 40, 100, { at: 2, label: '+60' }),
    hopper(N08l.X, 125, 34, [[1, 40], [2, 100]]), T(N08l.X(34), 172, 'start 34', 'mv-jl'), T(150, 30, '6 + 60 = 66, so 34 + 66 = 100', 'mv-mid', { at: 3 })],
  steps: [{ say: 'Start at 34. How far to 100?' }, { btn: 'Jump to the next ten', say: '34 + 6 = 40' }, { btn: 'Jump to 100', say: '40 + 60 = 100' }, { btn: 'Add the jumps', say: '6 + 60 = 66, so 34 + 66 = 100.' }],
});

// Column working helpers: cx(c) gives the x of column c (0 = ones).
const colsAt = (x, n, w) => c => x + (n - 1 - c) * w;
export const N09 = (() => {
  const X = colsAt(100, 3, 40);
  return scene({
    title: 'Add 137 + 54 in columns',
    intro: 'Add the ones first. Ten ones become one ten.',
    explain: '7 + 4 = 11 ones: exchange ten ones for one ten. Then 3 + 5 + 1 = 9 tens, and 1 hundred: 191.',
    explain_zh: '个位 7 + 4 = 11，满十向十位进 1（10 个一换 1 个十），个位写 1；十位 3 + 5 + 进上来的 1 = 9；百位 1。结果 191。',
    items: [['H', 'T', 'O'].map((h, i) => T(X(2 - i), 22, h, 'mv-num')), ['1', '3', '7'].map((d, i) => T(X(2 - i), 62, d, 'mv-big')), T(X(2) - 34, 96, '+', 'mv-big'), ['5', '4'].map((d, i) => T(X(1 - i), 96, d, 'mv-big')), L(X(2) - 40, 108, X(0) + 22, 108, 'mv-axis'),
      [X(0)].map(x => G([R(x - 18, 40, 36, 66, 'mv-colhl')], { at: 1, out: 2 })), T(255, 62, '7 + 4 = 11', 'mv-num', { at: 1, out: 3 }),
      T(X(0), 142, '1', 'mv-big', { at: 1 }), T(X(1), 142, '1', 'mv-carry', { at: 1, move: [{ at: 2, dy: -104 }] }), T(255, 92, '10 ones → 1 ten', 'mv-num', { at: 2, out: 3 }),
      G([R(X(1) - 18, 30, 36, 76, 'mv-colhl')], { at: 3, out: 4 }), T(255, 62, '1 + 3 + 5 = 9', 'mv-num', { at: 3, out: 4 }), T(X(1), 142, '9', 'mv-big', { at: 3 }), T(X(2), 142, '1', 'mv-big', { at: 4 }), T(150, 182, '137 + 54 = 191', 'mv-mid', { at: 4 })],
    steps: [{ say: 'Ones under ones, tens under tens.' }, { btn: 'Add the ones', say: '7 + 4 = 11 ones.' }, { btn: 'Exchange ten ones', say: '11 ones = 1 ten and 1 one. The ten moves to the tens.' }, { btn: 'Add the tens', say: '1 + 3 + 5 = 9 tens.' }, { btn: 'Add the hundreds', say: '1 hundred. The total is 191.' }],
  });
})();

export const N10 = (() => {
  const X = colsAt(100, 3, 40);
  return scene({
    title: 'Subtract 243 − 76 with exchanges',
    intro: 'Not enough ones? Exchange a ten. Not enough tens? Exchange a hundred.',
    explain: 'Exchange 1 ten for 10 ones: 13 − 6 = 7. Exchange 1 hundred for 10 tens: 13 − 7 = 6. Then 1 hundred: 167. Check: 167 + 76 = 243.',
    explain_zh: '个位 3 减 6 不够，从十位拿 1 个十换成 10 个一：13 − 6 = 7；十位剩 3，减 7 又不够，从百位换：13 − 7 = 6；百位剩 1。结果 167，用 167 + 76 = 243 检查。',
    items: [['H', 'T', 'O'].map((h, i) => T(X(2 - i), 16, h, 'mv-num')), ['2', '4', '3'].map((d, i) => T(X(2 - i), 82, d, 'mv-big', { hl: i === 2 ? 1 : null, hlOut: 2 })), T(X(2) - 34, 116, '−', 'mv-big'), ['7', '6'].map((d, i) => T(X(1 - i), 116, d, 'mv-big', { hl: i === 1 ? 1 : null, hlOut: 2 })), L(X(2) - 40, 128, X(0) + 22, 128, 'mv-axis'),
      L(X(1) - 9, 76, X(1) + 9, 66, 'mv-strike', { at: 2 }), T(X(1), 56, '3', 'mv-small', { at: 2 }), L(X(0) - 9, 76, X(0) + 9, 66, 'mv-strike', { at: 2 }), T(X(0), 56, '13', 'mv-small', { at: 2 }),
      T(X(0), 160, '7', 'mv-big', { at: 3 }),
      L(X(2) - 9, 76, X(2) + 9, 66, 'mv-strike', { at: 4 }), T(X(2), 56, '1', 'mv-small', { at: 4 }), L(X(1) - 7, 52, X(1) + 7, 44, 'mv-strike', { at: 4 }), T(X(1), 36, '13', 'mv-small', { at: 4 }),
      T(X(1), 160, '6', 'mv-big', { at: 5 }), T(X(2), 160, '1', 'mv-big', { at: 5 }), T(150, 192, 'Check: 167 + 76 = 243 ✓', 'mv-mid', { at: 6 })],
    steps: [{ say: '243 − 76. Start with the ones.' }, { btn: 'Look at the ones', say: '3 ones is not enough to take away 6.' }, { btn: 'Exchange a ten', say: '1 ten becomes 10 ones: 3 tens and 13 ones. Still 243.' }, { btn: 'Subtract the ones', say: '13 − 6 = 7' }, { btn: 'Exchange a hundred', say: '3 tens is not enough for 7. 1 hundred becomes 10 tens: 13 tens.' }, { btn: 'Finish', say: '13 − 7 = 6 tens, and 1 hundred: 167.' }, { btn: 'Check by adding', say: '167 + 76 = 243. It fits.' }],
  });
})();

const N11l = numberLine(20, 45, { y: 125, every: 1, label: 5 });
export const N11 = scene({
  title: 'Follow the bus',
  intro: '28 children are on the bus. 12 get on, then 9 get off.',
  explain: '28 + 12 = 40, then 40 − 9 = 31. Follow each change in order: 31 children.',
  explain_zh: '按故事顺序一步一步算：开始 28 人，上来 12 人变成 40，再下去 9 人剩 31。上车是加，下车是减，不是把两个数都加起来。',
  items: [N11l.items, jump(N11l.X, 125, 28, 40, { at: 1, label: '+12 get on' }), jump(N11l.X, 125, 40, 31, { at: 2, below: true, label: '−9 get off', cls: 'mv-arc2' }),
    hopper(N11l.X, 125, 28, [[1, 40], [2, 31]]), T(150, 28, '28 + 12 − 9 = 31', 'mv-mid', { at: 3 })],
  steps: [{ say: 'Start: 28 children on the bus.' }, { btn: '12 get on', say: '28 + 12 = 40 children.' }, { btn: '9 get off', say: '40 − 9 = 31 children.' }, { btn: 'Write the story', say: '28 + 12 − 9 = 31' }],
});

export const N12 = scene({
  title: 'Rows of four',
  intro: 'Add a row at a time and keep count.',
  explain: '3 rows of 4: 4 + 4 + 4 = 12, written as 3 × 4 = 12.',
  explain_zh: '每排 4 个，有 3 排：4 + 4 + 4 = 12，写成 3 × 4 = 12（3 组 4）。阵列横看竖看个数都一样。',
  items: [counters(12, 4, 60, 50, { gap: 34, r: 11, cls: 'mv-ghost' }), range(3).map(r => G(counters(4, 4, 60, 50 + r * 34, { gap: 34, r: 11 }), { at: r + 1, from: [140, 0], move: [{ at: r + 1 }] })),
    T(230, 54, '4', 'mv-mid', { at: 1 }), T(230, 88, '4 + 4 = 8', 'mv-mid', { at: 2 }), T(230, 122, '4 + 4 + 4 = 12', 'mv-mid', { at: 3 }), T(150, 182, '3 rows of 4: 3 × 4 = 12', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Room for 3 rows. Each row will have 4.' }, { btn: 'Add a row', say: '1 row: 4' }, { btn: 'Add a row', say: '2 rows: 4 + 4 = 8' }, { btn: 'Add a row', say: '3 rows: 4 + 4 + 4 = 12' }, { btn: 'Write multiplication', say: '3 × 4 = 12' }],
});

// Deal counters onto plates round by round.
export function dealScene({ total, groups, title, intro, explain, explain_zh, sum }) {
  const rounds = total / groups, plateX = g => 40 + g * (220 / (groups - 1 || 1)), cols = Math.min(total, 6), pw = Math.min(60, 220 / (groups - 1 || 1) - 6);
  const items = range(groups).map(g => R(plateX(g) - pw / 2, 112, pw, 64, 'mv-plate', { rx: pw / 2 }));
  range(total).forEach(i => { const sx = 150 - (cols - 1) * 9 + (i % cols) * 18, sy = 24 + Math.floor(i / cols) * 18, round = Math.floor(i / groups), g = i % groups;
    items.push(C(sx, sy, 7, 'mv-c1', { move: [{ at: round + 1, dx: plateX(g) - pw / 5 + (round % 2) * pw * .4 - sx, dy: 130 + Math.floor(round / 2) * 22 - sy }] })); });
  items.push(T(150, 196, sum, 'mv-mid', { at: rounds + 1 }));
  return scene({ title, intro, explain, explain_zh, h: 205, items, steps: [{ say: `${total} counters to share onto ${groups} plates.` }, ...range(rounds).map(r => ({ btn: 'Deal one to each plate', say: `Round ${r + 1}: each plate has ${r + 1}.` })), { btn: 'Write it', say: sum }] });
}
export const N13 = dealScene({ total: 12, groups: 3, title: 'Share 12 onto 3 plates', intro: 'Deal one counter to each plate, round by round.', sum: '12 ÷ 3 = 4, and 3 × 4 = 12',
  explain: 'Dealing fairly gives each plate 4: 12 ÷ 3 = 4. Three groups of 4 rebuild 12.', explain_zh: '一轮一轮地每盘放一个，最后每盘 4 个：12 ÷ 3 = 4。反过来 3 × 4 = 12，乘法可以检查除法。' });

export const N14 = scene({
  title: 'Multiply 2 × 23 in parts',
  intro: 'Each row is 23: 2 tens and 3 ones. Multiply each part.',
  explain: '2 × 20 = 40 and 2 × 3 = 6. Join the parts: 40 + 6 = 46.',
  explain_zh: '把 23 拆成 20 和 3：2 × 20 = 40，2 × 3 = 6，再合起来 40 + 6 = 46。拆分后分别乘，再相加。',
  items: [range(2).map(r => [G([R(24, 40 + r * 52, 46, 9, 'mv-b10'), R(24, 52 + r * 52, 46, 9, 'mv-b10')], { hl: 2, hlOut: 3 }), G(range(3).map(i => R(96 + i * 13, 46 + r * 52, 10, 10, 'mv-b1')), { hl: 3, hlOut: 4 })]),
    L(86, 30, 86, 150, 'mv-dash', { at: 1 }), T(47, 156, '20', 'mv-num', { at: 1 }), T(113, 156, '3', 'mv-num', { at: 1 }),
    T(225, 70, '2 × 20 = 40', 'mv-mid', { at: 2 }), T(225, 104, '2 × 3 = 6', 'mv-mid', { at: 3 }), T(225, 150, '40 + 6 = 46', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Two rows of 23.' }, { btn: 'Split 23', say: '23 = 20 + 3' }, { btn: 'Multiply the tens', say: '2 × 20 = 40' }, { btn: 'Multiply the ones', say: '2 × 3 = 6' }, { btn: 'Join the parts', say: '40 + 6 = 46' }],
});

// Fraction strips
const N15l = numberLine(0, 1, { x0: 30, x1: 270, y: 150, every: .25, label: .25, fmt: fracFmt(4), at: 3 });
export const N15 = scene({
  title: 'Three quarters, two ways',
  intro: 'Cut the ribbon into 4 equal parts, shade 3, then walk the same amount on a number line.',
  explain: '3 of 4 equal parts is 3/4. Three quarter-steps from 0 on the number line reach the same place.',
  explain_zh: '把整体平均分成 4 份，取其中 3 份就是 3/4。在数轴上从 0 走 3 个四分之一，也到同一个位置：分数既是“几份”，也是一个“数”。',
  items: [strip(30, 40, 240, 40, 4, { splitAt: 1, shade: [[0, 'mv-c1', 2], [1, 'mv-c1', 2], [2, 'mv-c1', 2]] }), T(150, 30, '3/4', 'mv-mid', { at: 2 }),
    N15l.items, [0, .25, .5].map(v => jump(N15l.X, 150, v, v + .25, { at: 3 })), hopper(N15l.X, 150, 0, [[3, .75]], 'mv-dot', { at: 3 }), L(210, 82, 210, 140, 'mv-dash', { at: 3 })],
  steps: [{ say: 'One whole ribbon.' }, { btn: 'Cut into 4 equal parts', say: 'Each part is one quarter.' }, { btn: 'Shade 3 parts', say: '3 of the 4 equal parts: 3/4.' }, { btn: 'Walk the number line', say: 'Three quarter-steps reach 3/4: the same amount.' }],
});

export const N16 = scene({
  title: 'One third or one sixth?',
  intro: 'Two ribbons of the same length. Cut one into 3 parts and one into 6 parts.',
  explain: 'One third is longer than one sixth. More equal pieces means each piece is smaller.',
  explain_zh: '两条一样长的纸条，一条分 3 份，一条分 6 份。分的份数越多，每一份越小，所以 1/3 > 1/6。比较时整体必须一样大。',
  items: [strip(30, 40, 240, 36, 3, { splitAt: 1, shade: [[0, 'mv-c1', 2]] }), strip(30, 110, 240, 36, 6, { splitAt: 1, shade: [[0, 'mv-c2', 2]] }),
    T(70, 32, '1/3', 'mv-num', { at: 2 }), T(50, 102, '1/6', 'mv-num', { at: 2 }), L(110, 30, 110, 160, 'mv-dash', { at: 3 }), T(150, 186, '1/3 > 1/6', 'mv-mid', { at: 3 })],
  steps: [{ say: 'Two ribbons of the same length.' }, { btn: 'Cut them', say: 'Top: 3 equal parts. Bottom: 6 equal parts.' }, { btn: 'Take one part of each', say: 'One third and one sixth.' }, { btn: 'Compare', say: 'One third is longer: more pieces, smaller pieces.' }],
});

export const N17 = scene({
  title: 'Five sixths or two sixths?',
  intro: 'Both ribbons are cut into sixths, so every piece is the same size.',
  explain: 'With the same denominator the pieces match, so compare how many: 5/6 > 2/6.',
  explain_zh: '分母相同，每一份一样大，只要比份数（分子）：5 份比 2 份多，所以 5/6 > 2/6。',
  items: [strip(30, 40, 240, 36, 6, { shade: range(5).map(i => [i, 'mv-c1', 1]) }), strip(30, 110, 240, 36, 6, { shade: range(2).map(i => [i, 'mv-c2', 2]) }),
    T(285, 64, '5/6', 'mv-num', { at: 1 }), T(285, 134, '2/6', 'mv-num', { at: 2 }), T(150, 186, '5/6 > 2/6', 'mv-mid', { at: 3 })],
  w: 310,
  steps: [{ say: 'Two ribbons cut into sixths.' }, { btn: 'Shade 5 sixths', say: '5 pieces: 5/6' }, { btn: 'Shade 2 sixths', say: '2 pieces: 2/6' }, { btn: 'Compare', say: 'Same size pieces: 5 is more than 2, so 5/6 > 2/6.' }],
});

export const N18 = scene({
  title: 'One half is three sixths',
  intro: 'Cut each half into 3 equal pieces. Does the shaded amount change?',
  explain: 'Splitting each half into 3 pieces makes sixths. The shaded part is now 3/6: the same amount as 1/2. Six sixths fill the whole.',
  explain_zh: '把每个一半再平均分成 3 份，就变成了六分之几。涂色部分没变，只是名字变了：1/2 = 3/6；6 个六分之一就是 1 个整体。',
  items: [strip(30, 60, 240, 44, 2, { shade: [[0, 'mv-c1', 0]] }), [1, 2, 4, 5].map(i => L(30 + i * 40, 60, 30 + i * 40, 104, 'mv-cut', { at: 1 })),
    range(3).map(i => T(50 + i * 40, 88, String(i + 1), 'mv-mid', { at: 2 })), R(150, 60, 120, 44, 'mv-c2', { at: 3 }), [4, 5].map(i => L(30 + i * 40, 60, 30 + i * 40, 104, 'mv-cut', { at: 3 })), R(30, 60, 240, 44, 'mv-frame', { at: 3 }),
    T(150, 44, '1/2', 'mv-mid', { out: 2 }), T(150, 44, '1/2 = 3/6', 'mv-mid', { at: 2, out: 3 }), T(150, 44, '6/6 = 1 whole', 'mv-mid', { at: 3 })],
  steps: [{ say: 'One half is shaded.' }, { btn: 'Split each half into 3', say: 'Now there are 6 equal pieces: sixths.' }, { btn: 'Count the shaded sixths', say: '3 sixths are shaded: 1/2 = 3/6.' }, { btn: 'Shade them all', say: '6 sixths fill the whole: 6/6 = 1.' }],
});

export const N19 = scene({
  title: 'Add and take away eighths',
  intro: 'All the pieces are eighths of the same whole.',
  explain: '2/8 + 3/8 = 5/8: count the pieces, and they stay eighths. Taking 3/8 away leaves 2/8.',
  explain_zh: '同分母加减就是数份数：2 个八分之一加 3 个八分之一是 5 个八分之一（5/8），分母不变，因为每份大小没变；拿走 3 份剩 2/8。',
  items: [strip(30, 70, 240, 44, 8, { shade: [[0, 'mv-c1', 1], [1, 'mv-c1', 1], [2, 'mv-c2', 2, 3], [3, 'mv-c2', 2, 3], [4, 'mv-c2', 2, 3]] }),
    T(150, 50, '2/8', 'mv-mid', { at: 1, out: 2 }), T(150, 50, '2/8 + 3/8 = 5/8', 'mv-mid', { at: 2, out: 3 }), T(150, 50, '5/8 − 3/8 = 2/8', 'mv-mid', { at: 3 })],
  steps: [{ say: 'A whole cut into 8 equal pieces.' }, { btn: 'Shade 2 eighths', say: '2/8' }, { btn: 'Add 3 eighths', say: '2 + 3 = 5 pieces: 5/8. Still eighths.' }, { btn: 'Take 3 eighths away', say: '5 − 3 = 2 pieces: 2/8.' }],
});

// One part of a quantity: rows of counters separate into equal groups.
export function partScene({ total, groups, title, intro, explain, explain_zh, t2, t3, says = [] }) {
  const each = total / groups, gap = 15;
  const items = range(groups).map(g => G([R(46, 18 + g * 27, each * gap + 8, 22, 'mv-plate', { rx: 8, at: 1 }), ...counters(each, each, 58, 29 + g * 27, { gap, r: 5.5 })], { from: [0, -g * 13], move: [{ at: 1 }], hl: g === 0 ? 2 : null }));
  items.push(T(232, 70, t2 || `1/${groups} of ${total} = ${each}`, 'mv-mid', { at: 2 }), T(232, 110, t3 || `${groups} × ${each} = ${total} ✓`, 'mv-mid', { at: 3 }));
  return scene({ title, intro, explain, explain_zh, items, steps: [{ say: says[0] || `${total} counters: the whole.` }, { btn: `Make ${groups} equal groups`, say: says[1] || `${groups} equal groups of ${each}.` }, { btn: 'Take one group', say: says[2] || `One group is 1/${groups}: ${each}.` }, { btn: 'Check', say: says[3] || `${groups} groups of ${each} make ${total}.` }] });
}
export const N20 = partScene({ total: 42, groups: 6, title: 'One sixth of 42', intro: 'The denominator 6 tells us to make 6 equal groups.',
  explain: '42 in 6 equal groups gives 7 in each group, so 1/6 of 42 is 7. Check: 6 × 7 = 42.', explain_zh: '求 42 的 1/6，就是把 42 平均分成 6 组，一组是 7。用 6 × 7 = 42 检查。分母告诉我们分几组。' });

export const N21 = scene({
  title: 'Rebuild the whole from one quarter',
  intro: 'One quarter has 3 counters. A whole needs 4 quarters.',
  explain: 'Copy the quarter 4 times: 4 × 3 = 12. Check: 1/4 of 12 is 3.',
  explain_zh: '知道 1/4 是 3 个，整体就是 4 个这样的部分：4 × 3 = 12。再用 12 的 1/4 是 3 来检查。',
  items: [range(4).map(g => G([R(22 + g * 68, 60, 56, 60, 'mv-plate', { rx: 10 }), ...counters(3, 3, 34 + g * 68, 90, { gap: 16, r: 6 }), T(50 + g * 68, 140, '1/4', 'mv-num')], g ? { at: 1, from: [-g * 68, 0], move: [{ at: 1 }] } : {})),
    T(150, 36, '1/4 = 3', 'mv-mid', { out: 2 }), T(150, 36, '4 × 3 = 12', 'mv-mid', { at: 2, out: 3 }), T(150, 36, '1/4 of 12 = 3 ✓', 'mv-mid', { at: 3 })],
  steps: [{ say: 'This is one quarter: 3 counters.' }, { btn: 'Copy it to make 4 quarters', say: 'Four equal parts make the whole.' }, { btn: 'Count the whole', say: '4 × 3 = 12' }, { btn: 'Check', say: '12 shared into 4 groups gives 3. It fits.' }],
});

const coin = (x, y, label, cls = 'mv-coin', r = 13) => G([C(x, y, r, cls), T(x, y + 4, label, 'mv-coinl')]);
export const N22 = scene({
  title: 'Dollars and cents',
  intro: 'Ten 10c coins, then a $5 note and three $2 coins.',
  explain: 'Ten 10c coins make 100 cents = $1. A $5 note and three $2 coins make 5 + 2 + 2 + 2 = $11.',
  explain_zh: '1 元 = 100 分，10 个 10 分硬币合起来就是 1 元。5 元纸币加 3 个 2 元硬币：5 + 2 + 2 + 2 = 11 元。',
  items: [range(10).map(i => G([coin(22 + i * 28, 40, '10c')], { move: [{ at: 1, dx: 150 - (22 + i * 28) + (i - 4.5) * 3, dy: 0 }], out: 2 })), G([C(150, 40, 18, 'mv-gold'), T(150, 45, '$1', 'mv-coinl')], { at: 2 }), T(150, 80, '100c = $1', 'mv-mid', { at: 2 }),
    G([R(30, 110, 74, 40, 'mv-note', { rx: 4 }), T(67, 136, '$5', 'mv-mid')], { at: 3 }), range(3).map(i => G([C(135 + i * 38, 130, 15, 'mv-gold'), T(135 + i * 38, 135, '$2', 'mv-coinl')], { at: 3 })),
    T(150, 182, '5 + 2 + 2 + 2 = $11', 'mv-mid', { at: 4 })],
  steps: [{ say: 'Ten 10c coins.' }, { btn: 'Push them together', say: '10 + 10 + … = 100 cents.' }, { btn: 'Swap for a dollar', say: '100 cents = $1.' }, { btn: 'Show some money', say: 'A $5 note and three $2 coins.' }, { btn: 'Count it', say: '5, 7, 9, 11: $11.' }],
});

const N23l = numberLine(0, 20, { y: 120, every: 1, label: 5 });
export const N23 = scene({
  title: 'Count up to find the change',
  intro: 'A book costs $6 and a pen $3. You pay with $20.',
  explain: 'The cost is 6 + 3 = $9. Count up from 9 to 20: $1 to 10, then $10 to 20. Change = $11, and 9 + 11 = 20.',
  explain_zh: '先算总价 6 + 3 = 9 元；找零就是从 9 数到 20：先补 1 到 10，再加 10 到 20，一共 11 元。检查：花的钱 + 找零 = 付的钱（9 + 11 = 20）。',
  items: [N23l.items, jump(N23l.X, 120, 0, 6, { at: 1, label: 'book $6' }), jump(N23l.X, 120, 6, 9, { at: 2, label: '+$3' }),
    jump(N23l.X, 120, 9, 10, { at: 3, below: true, label: '+1', cls: 'mv-arc2' }), jump(N23l.X, 120, 10, 20, { at: 4, below: true, label: '+10', cls: 'mv-arc2' }),
    hopper(N23l.X, 120, 0, [[1, 6], [2, 9], [3, 10], [4, 20]]), T(150, 30, 'Change: 1 + 10 = $11', 'mv-mid', { at: 5 })],
  steps: [{ say: 'Start at $0.' }, { btn: 'Add the book', say: 'Book: $6' }, { btn: 'Add the pen', say: '6 + 3 = $9 to pay.' }, { btn: 'Count up to 10', say: '9 + 1 = 10' }, { btn: 'Count up to 20', say: '10 + 10 = 20' }, { btn: 'Find the change', say: 'Change: 1 + 10 = $11. 9 + 11 = 20 ✓' }],
});

// ---- Algebra ----------------------------------------------------------------------------------
export function balanceScene({ left, right, missing, tilt = 12, title, intro, explain, explain_zh, check }) {
  const dy = 90 * Math.sin(tilt * Math.PI / 180), pan = (x, kids, from) => G([L(x, 74, x, 112, 'mv-string'), R(x - 42, 112, 84, 10, 'mv-pan', { rx: 4 }), ...kids], { from: [0, from], move: [{ at: 2, dx: 0, dy: 0 }] });
  return scene({
    title, intro, explain, explain_zh, h: 210, items: [P('M150 74 L132 180 L168 180 Z', 'mv-stand'),
      G([L(60, 74, 240, 74, 'mv-beam')], { rot: { cx: 150, cy: 74, from: tilt, keys: [{ at: 2, deg: 0 }] } }), C(150, 74, 6, 'mv-pin'),
      pan(60, [T(48, 104, left, 'mv-mid'), R(70, 88, 26, 22, 'mv-box', { out: 1 }), T(83, 104, '?', 'mv-mid', { out: 1 }), T(83, 104, missing, 'mv-mid', { at: 1 })], -dy),
      pan(240, [T(240, 104, right, 'mv-mid')], dy), T(150, 200, check, 'mv-mid', { at: 3 })],
    steps: [{ say: `${left} ? on one side, ${right} on the other. Not level yet.` }, { btn: `Put ${missing} in the box`, say: `Try ${missing}.` }, { btn: 'Let go', say: 'Both sides have the same value: it balances.' }, { btn: 'Check', say: check }],
  });
}
export const A01 = balanceScene({ left: '17 +', right: '30', missing: '13', title: 'Balance the scale', intro: 'An equals sign means both sides have the same value.', check: '17 + 13 = 30 ✓',
  explain: 'The missing part is 13, because 17 + 13 = 30. Both sides have the same value, so the scale balances.', explain_zh: '等号表示两边一样多，像天平一样平衡。17 加多少等于 30？差 13，所以方框里是 13。' });

export const A02 = scene({
  title: 'Towers that grow by 2',
  intro: 'Each new tower has 2 more blocks.',
  explain: 'The rule is “add 2”: 2, 4, 6, 8. The same change happens every time.',
  explain_zh: '规律是每次加 2：2、4、6、8。找规律就是找“每一次都一样的变化”。',
  items: [range(4).map(t => G([...range(2 * (t + 1)).map(b => R(36 + t * 66, 166 - (b + 1) * 16, 30, 15, b >= 2 * t ? 'mv-c2' : 'mv-c1')), T(51 + t * 66, 186, String(2 * (t + 1)), 'mv-mid')], { at: t })),
    range(3).map(t => T(84 + t * 66, 40, '+2', 'mv-jl', { at: t + 1 })), T(150, 22, 'Rule: add 2 each time', 'mv-mid', { at: 4 })],
  steps: [{ say: 'The first tower has 2 blocks.' }, { btn: 'Build the next tower', say: '2 + 2 = 4' }, { btn: 'Build the next tower', say: '4 + 2 = 6' }, { btn: 'Build the next tower', say: '6 + 2 = 8' }, { btn: 'Say the rule', say: 'Add 2 each time.' }],
});

// ---- Measurement -------------------------------------------------------------------------------
const ruler = (x0, y, cm, px) => [R(x0 - 8, y, cm * px + 16, 34, 'mv-ruler'), ...range(cm * 2 + 1).map(i => L(x0 + i * px / 2, y, x0 + i * px / 2, y + (i % 2 ? 7 : 12), 'mv-tickl')), ...range(cm + 1).map(i => T(x0 + i * px, y + 27, String(i), 'mv-num'))];
const pencil = (x, y, len, cls = 'mv-pencil') => G([R(x, y, len - 14, 14, cls), P(`M${x + len - 14} ${y} L${x + len} ${y + 7} L${x + len - 14} ${y + 14} Z`, 'mv-tip')]);
export const M01 = scene({
  title: 'Start at zero',
  intro: 'Measure the pencil with the ruler.',
  explain: 'Line the end up with 0. The pencil is 9 cm. The other pencil is 7 cm, so the first is 2 cm longer.',
  explain_zh: '量长度要从 0 刻度开始对齐。这支铅笔从 0 到 9，是 9 厘米。另一支 7 厘米，所以长 2 厘米。用同一种单位才能比较。',
  items: [ruler(30, 130, 12, 20), G([pencil(70, 104, 180)], { move: [{ at: 2, dx: -40 }] }), T(250, 96, 'ends at 11?', 'mv-jl', { at: 1, out: 2 }), L(70, 100, 70, 140, 'mv-dash', { at: 1, out: 2 }),
    T(210, 96, '9 cm', 'mv-mid', { at: 2 }), G([pencil(30, 64, 140, 'mv-pencil2'), T(150, 58, '7 cm', 'mv-num')], { at: 3 }), G([L(170, 52, 210, 52, 'mv-arc'), T(190, 44, '2 cm longer', 'mv-jl')], { at: 3 })],
  steps: [{ say: 'A pencil and a ruler.' }, { btn: 'Read the end', say: 'It ends at 11, but it starts at 2, not 0.' }, { btn: 'Slide it to zero', say: 'Start at 0: the pencil is 9 cm.' }, { btn: 'Compare another pencil', say: '9 cm is 2 cm longer than 7 cm.' }],
});

const jug = (x, label) => [R(x, 30, 64, 130, 'mv-jug'), ...range(10).map(i => L(x, 160 - (i + 1) * 13, x + 10, 160 - (i + 1) * 13, 'mv-tickl')), T(x + 32, 178, label, 'mv-num')];
export const M02 = scene({
  title: 'Fill the jugs',
  intro: 'Each mark on the jug is 100 millilitres.',
  explain: 'Read the top of the water against the marks: 800 mL and 600 mL. 800 mL is 200 mL more.',
  explain_zh: '量容量看水面对着的刻度：一个 800 毫升，一个 600 毫升，800 毫升多 200 毫升。比较时要用同样的单位。',
  items: [range(8).map(i => R(61, 160 - (i + 1) * 13, 62, 13, 'mv-water', { at: 1, hl: i >= 6 ? 3 : null })), range(6).map(i => R(181, 160 - (i + 1) * 13, 62, 13, 'mv-water', { at: 2 })), jug(60, 'Jug A'), jug(180, 'Jug B'),
    T(92, 22, '800 mL', 'mv-num', { at: 1 }), T(212, 22, '600 mL', 'mv-num', { at: 2 }), T(150, 204, '800 mL > 600 mL: 200 mL more', 'mv-mid', { at: 3 })],
  h: 212,
  steps: [{ say: 'Two empty jugs. Each mark is 100 mL.' }, { btn: 'Fill jug A', say: 'The water reaches 800 mL.' }, { btn: 'Fill jug B', say: 'The water reaches 600 mL.' }, { btn: 'Compare', say: '800 mL is 200 mL more than 600 mL.' }],
});

export function perimeterScene({ w, h, unit, title, intro, explain, explain_zh, s = 30 }) {
  const x = 150 - w * s / 2, y = 30, W = w * s, H = h * s;
  const sides = [[x, y, x + W, y, w], [x + W, y, x + W, y + H, h], [x + W, y + H, x, y + H, w], [x, y + H, x, y, h]];
  const totals = [w, w + h, w + h + w, 2 * (w + h)];
  return scene({ title, intro, explain, explain_zh, items: [gridLines(x, y, w, h, s), R(x, y, W, H, 'mv-frame'),
    sides.map(([a, b, c, d, n], i) => [L(a, b, c, d, 'mv-walk', { at: i + 1 }), T((a + c) / 2 + (i === 1 ? 22 : i === 3 ? -22 : 0), (b + d) / 2 + (i === 0 ? -8 : i === 2 ? 18 : 4), `${n} ${unit}`, 'mv-num', { at: i + 1 })]),
    C(x, y, 7, 'mv-dot', { move: [{ at: 1, dx: W, dy: 0 }, { at: 2, dx: W, dy: H }, { at: 3, dx: 0, dy: H }, { at: 4, dx: 0, dy: 0 }] }),
    totals.map((t, i) => T(150, 190, i === 0 ? `${t}` : i === 3 ? `${totals[2]} + ${h} = ${t} ${unit}` : `${totals[i - 1]} + ${sides[i][4]} = ${t}`, 'mv-mid', { at: i + 1, out: i < 3 ? i + 2 : null }))],
  steps: [{ say: 'An ant starts at a corner.' }, ...sides.map((sd, i) => ({ btn: 'Walk the next side', say: `${['Top', 'Right', 'Bottom', 'Left'][i]} side: ${sd[4]} ${unit}.` })).map((st, i) => i === 3 ? { ...st, say: `Back to the start: ${totals[3]} ${unit} all the way round.` } : st)] });
}
export const M03 = perimeterScene({ w: 6, h: 3, unit: 'cm', title: 'Walk around the rectangle', intro: 'Follow the ant along every edge once.',
  explain: 'Perimeter is the whole distance around: 6 + 3 + 6 + 3 = 18 cm.', explain_zh: '周长就是沿着图形边缘走一圈的长度，每条边只算一次：6 + 3 + 6 + 3 = 18 厘米。' });

export function areaScene({ cols, rows, title, intro, explain, explain_zh, unit = 'square cm' }) {
  const s = 36, x = 150 - cols * s / 2 - 30, y = 24;
  return scene({ title, intro, explain, explain_zh, items: [R(x, y, cols * s, rows * s, 'mv-empty'),
    range(rows).map(r => G(range(cols).map(c => R(x + c * s + 2, y + r * s + 2, s - 4, s - 4, 'mv-c3', { rx: 3 })), { at: r + 1, from: [0, -20], move: [{ at: r + 1 }] })), R(x, y, cols * s, rows * s, 'mv-frame'),
    range(rows).map(r => T(x + cols * s + 40, y + r * s + 24, String(cols * (r + 1)), 'mv-mid', { at: r + 1 })), T(150, 190, `${rows} rows of ${cols}: ${rows} × ${cols} = ${rows * cols} ${unit}`, 'mv-mid', { at: rows + 1 })],
  steps: [{ say: 'Cover the rectangle with equal squares: no gaps, no overlaps.' }, ...range(rows).map(r => ({ btn: 'Add a row of squares', say: `${r + 1} row${r ? 's' : ''}: ${cols * (r + 1)} squares.` })), { btn: 'Count them', say: `${rows} × ${cols} = ${rows * cols} ${unit}` }] });
}
export const M04 = areaScene({ cols: 4, rows: 3, title: 'Cover the rectangle', intro: 'Fill the rectangle one row of squares at a time.',
  explain: '3 rows of 4 squares: 4 + 4 + 4 = 3 × 4 = 12 square centimetres.', explain_zh: '面积是铺满图形需要多少个单位正方形，不能有空隙也不能重叠。3 排、每排 4 个：3 × 4 = 12 平方厘米。' });

export const M06 = scene({
  title: 'Move the clock hands',
  intro: 'The short hand shows the hour. The long hand counts the minutes.',
  explain: 'At 3:20 the long hand points to 4 (20 minutes). At 3:45 it points to 9: 15 minutes are left until 4 o’clock.',
  explain_zh: '短针指小时，长针指分钟，长针每走一个数字是 5 分钟。3:20 长针指 4；3:45 长针指 9，离 4 点还差 15 分钟（差一刻 4 点）。',
  items: [clockFace(105, 100, 82), sector(105, 100, 74, 270, 360, 'mv-sector', { at: 2 }), hand(105, 100, 46, 'mv-hhand', 90, [{ at: 1, deg: 100 }, { at: 2, deg: 112.5 }]), hand(105, 100, 68, 'mv-mhand', 0, [{ at: 1, deg: 120 }, { at: 2, deg: 270 }]), C(105, 100, 5, 'mv-pin'),
    T(245, 80, '3:00', 'mv-big', { out: 1 }), T(245, 80, '3:20', 'mv-big', { at: 1, out: 2 }), T(245, 80, '3:45', 'mv-big', { at: 2 }),
    T(245, 108, 'twenty past three', 'mv-num', { at: 1, out: 2 }), T(245, 108, '15 minutes to 4', 'mv-num', { at: 2 })],
  steps: [{ say: '3 o’clock.' }, { btn: 'Move on 20 minutes', say: 'The long hand points to 4: 20 minutes past 3.' }, { btn: 'Move on to 3:45', say: '3:45. The shaded part shows 15 minutes left until 4.' }],
});

export const M07 = scene({
  title: 'How long did it last?',
  intro: 'The game starts at 9:10 and ends at 9:35.',
  explain: 'From 9:10 to 9:25 is 15 minutes, then 10 more to 9:35: 15 + 10 = 25 minutes.',
  explain_zh: '时长是开始到结束之间经过的时间。从 9:10 到 9:25 是 15 分钟，再到 9:35 又是 10 分钟，一共 25 分钟。可以分段数。',
  items: [clockFace(105, 100, 82), sector(105, 100, 74, 60, 150, 'mv-sector2', { at: 1 }), sector(105, 100, 74, 150, 210, 'mv-sector', { at: 2 }),
    hand(105, 100, 46, 'mv-hhand', 275, [{ at: 1, deg: 282.5 }, { at: 2, deg: 287.5 }]), hand(105, 100, 68, 'mv-mhand', 60, [{ at: 1, deg: 150 }, { at: 2, deg: 210 }]), C(105, 100, 5, 'mv-pin'),
    T(245, 60, 'start 9:10', 'mv-num'), T(245, 90, '+15 min → 9:25', 'mv-num', { at: 1 }), T(245, 116, '+10 min → 9:35', 'mv-num', { at: 2 }), T(245, 150, '25 minutes', 'mv-mid', { at: 3 })],
  steps: [{ say: 'Start: 9:10.' }, { btn: 'Move to 9:25', say: '15 minutes have passed.' }, { btn: 'Move to 9:35', say: '10 more minutes.' }, { btn: 'Add them', say: '15 + 10 = 25 minutes.' }],
});

export const M08 = scene({
  title: 'Weeks make a year',
  intro: 'Each row is one week of 7 days.',
  explain: '1 week = 7 days. 52 weeks = 52 × 7 = 364 days, so a year of 365 days is 52 weeks and 1 day (366 in a leap year).',
  explain_zh: '一周 7 天。52 周是 52 × 7 = 364 天，一年 365 天就是 52 周多 1 天（闰年 366 天）。月份天数不一样，要看日历。',
  items: [['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => T(60 + i * 30, 26, d, 'mv-num')),
    range(4).map(r => G(range(7).map(c => R(47 + c * 30, 34 + r * 26, 26, 22, r ? 'mv-c3' : 'mv-c1', { rx: 4 })), { at: r ? 1 : 0 })),
    T(270, 52, '7', 'mv-mid'), T(270, 130, '28', 'mv-mid', { at: 1 }),
    T(150, 160, '52 weeks = 52 × 7 = 364 days', 'mv-mid', { at: 2 }), T(150, 186, '364 + 1 = 365 days in a year', 'mv-mid', { at: 3 })],
  steps: [{ say: '1 week = 7 days.' }, { btn: 'Show 4 weeks', say: '4 weeks = 28 days.' }, { btn: 'Count a year of weeks', say: '52 weeks = 364 days.' }, { btn: 'Finish the year', say: 'A year has 365 days: 52 weeks and 1 day. A leap year has 366.' }],
});

// ---- Geometry ----------------------------------------------------------------------------------
export function polygonScene({ n, title, intro, explain, explain_zh }) {
  const pts = polygon(120, 104, 70, n), bent = pts.map((p, i) => i === 1 ? [p[0] + 26, p[1] - 22] : p);
  return scene({ title, intro, explain, explain_zh, items: [P(pathOf(pts), 'mv-shape', { out: 3 }), P(pathOf(bent), 'mv-shape2', { at: 3 }),
    pts.map((p, i) => { const q = pts[(i + 1) % n]; return T((p[0] + q[0]) / 2 + ((p[0] + q[0]) / 2 - 120) * .25, (p[1] + q[1]) / 2 + ((p[1] + q[1]) / 2 - 104) * .25 + 5, String(i + 1), 'mv-jl', { at: 1 }); }),
    pts.map((p, i) => { const q = pts[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = (q[1] - p[1]) * .08, dy = -(q[0] - p[0]) * .08; return L(mx - dx, my - dy, mx + dx, my + dy, 'mv-tickmark', { at: 2, out: 3 }); }),
    C(pts[1][0], pts[1][1], 6, 'mv-dot', { at: 3, move: [{ at: 3, dx: 26, dy: -22 }] }),
    T(250, 80, `${n} sides`, 'mv-mid', { at: 1 }), T(250, 108, 'regular', 'mv-mid', { at: 2, out: 3 }), T(250, 108, 'irregular', 'mv-mid', { at: 3 })],
  steps: [{ say: 'A closed shape with straight sides.' }, { btn: 'Count the sides', say: `${n} straight sides.` }, { btn: 'Check the sides and corners', say: 'All sides are equal and all corners are equal: regular.' }, { btn: 'Pull one corner', say: `Still ${n} sides, but not all equal: irregular.` }] });
}
export const G01 = polygonScene({ n: 5, title: 'Regular or not?', intro: 'Count the sides, check them, then pull one corner.',
  explain: 'A pentagon has 5 straight sides. It is regular only when all sides and all corners are equal; pulling one corner makes it irregular, but it is still a pentagon.', explain_zh: '多边形看边数命名，五条边就是五边形。所有边一样长、所有角一样大才叫“正”五边形；拉动一个角后还是五边形，只是不规则了。' });

export const G03 = scene({
  title: 'Follow the instructions',
  intro: 'The arrow faces north. Move it: forward 2, quarter turn right, forward 3.',
  explain: 'Forward follows the way you face. After a quarter turn right, north becomes east, so forward 3 goes east.',
  explain_zh: '“向前”是朝着自己面对的方向走。面向北，右转四分之一圈（直角）后面向东，再向前走就是往东。给路线要说清楚转向和距离。',
  items: [gridLines(40, 20, 8, 6, 25), T(258, 32, 'N ↑', 'mv-mid'),
    L(102.5, 157.5, 102.5, 107.5, 'mv-walk', { at: 1 }), L(102.5, 107.5, 177.5, 107.5, 'mv-walk', { at: 3 }),
    G([P('M102.5 145 L92 168 L102.5 162 L113 168 Z', 'mv-turtle')], { move: [{ at: 1, dx: 0, dy: -50 }, { at: 3, dx: 75, dy: -50 }], rot: { cx: 102.5, cy: 157.5, from: 0, keys: [{ at: 2, deg: 90 }] } }),
    T(268, 100, 'forward 2', 'mv-num', { at: 1 }), T(268, 120, 'turn right', 'mv-num', { at: 2 }), T(268, 140, 'forward 3', 'mv-num', { at: 3 })],
  steps: [{ say: 'The arrow faces north.' }, { btn: 'Forward 2', say: 'Forward 2 squares: towards north.' }, { btn: 'Quarter turn right', say: 'Now it faces east.' }, { btn: 'Forward 3', say: 'Forward 3 squares: towards east.' }],
});

export const G04 = scene({
  title: 'Walk on the map',
  intro: 'Use the north arrow to find east and west.',
  explain: 'The pond is east of the tree. To go back from the pond to the tree, travel west: the opposite direction.',
  explain_zh: '地图上先找北方箭头，北的右边是东、左边是西。池塘在树的东边；从池塘回树要往西走，方向正好相反。',
  items: [R(20, 20, 260, 160, 'mv-map', { rx: 12 }), G([L(48, 70, 48, 34, 'mv-axis'), P('M48 28 L42 40 L54 40 Z', 'mv-head'), T(48, 84, 'N', 'mv-mid')], { hl: 1, hlOut: 2 }),
    G([T(30, 114, 'W', 'mv-num'), T(66, 114, 'E', 'mv-num'), L(36, 110, 60, 110, 'mv-tickl')], { at: 1 }),
    G([C(100, 110, 20, 'mv-c1'), R(96, 128, 8, 16, 'mv-trunk'), T(100, 166, 'tree', 'mv-num')]), G([R(196, 98, 64, 30, 'mv-pond', { rx: 15 }), T(228, 152, 'pond', 'mv-num')]),
    L(122, 110, 196, 110, 'mv-walk', { at: 2, out: 3 }), L(196, 116, 122, 116, 'mv-walk2', { at: 3 }),
    C(122, 110, 7, 'mv-dot', { move: [{ at: 2, dx: 70 }, { at: 3, dx: 0 }] }), T(160, 98, 'east →', 'mv-jl', { at: 2, out: 3 }), T(160, 136, '← west', 'mv-jl', { at: 3 })],
  steps: [{ say: 'A tree and a pond on a map.' }, { btn: 'Find north', say: 'North is up. East is to the right, west to the left.' }, { btn: 'Walk to the pond', say: 'From the tree, walk east to the pond.' }, { btn: 'Walk back', say: 'From the pond, walk west to the tree.' }],
});

// ---- Statistics --------------------------------------------------------------------------------
export const S01 = (() => {
  const vals = [1, 0, 2, 1, 3, 1, 0, 2], cnt = [0, 0, 0, 0], spot = vals.map(v => cnt[v]++);
  return scene({
    title: 'Collect and sort answers',
    intro: 'Eight children answer: “How many pets do you have?”',
    explain: 'Every answer is kept, even repeated ones: three children have 1 pet. Pet counts are numbers, so they sort along a number scale.',
    explain_zh: '统计时每个人的回答都要保留，相同的回答也要分别计数（3 个人都说 1 只）。宠物数量是数字数据，可以按大小排列。',
    items: [T(150, 22, 'How many pets do you have?', 'mv-mid'),
      vals.map((v, i) => { const x0 = 30 + (i % 4) * 66, y0 = 40 + Math.floor(i / 4) * 34, x1 = 52 + v * 64, y1 = 152 - spot[i] * 26; return G([R(x0, y0, 44, 24, 'mv-note', { rx: 4 }), T(x0 + 22, y0 + 17, String(v), 'mv-mid')], { at: 1, move: [{ at: 2, dx: x1 - x0, dy: y1 - y0 }], hl: v === 1 ? 3 : null }); }),
      L(30, 182, 280, 182, 'mv-axis', { at: 2 }), range(4).map(v => T(74 + v * 64, 198, String(v), 'mv-num', { at: 2 }))],
    h: 205,
    steps: [{ say: 'Ask everyone the same question.' }, { btn: 'Collect the answers', say: 'Eight answers.' }, { btn: 'Sort them', say: 'Put the same answers together.' }, { btn: 'Look at the 1s', say: 'Three children have 1 pet: every answer counts.' }],
  });
})();

export const S02 = (() => {
  const cats = [['cat', 3], ['dog', 5], ['fish', 2]];
  return scene({
    title: 'Build a bar graph',
    intro: 'Each square is one child’s favourite pet.',
    explain: 'Stack one square per child. The height of each bar is the frequency: cat 3, dog 5, fish 2.',
    explain_zh: '每个孩子的回答放一个方块，方块叠起来就是条形；条的高度就是频数（有几个人）。猫 3、狗 5、鱼 2。',
    items: [L(50, 170, 280, 170, 'mv-axis'), L(50, 170, 50, 40, 'mv-axis', { at: 4 }), range(6).map(v => T(38, 174 - v * 22, String(v), 'mv-num', { at: 4 })), T(30, 30, 'children', 'mv-num', { at: 4 }),
      cats.map(([nm, n], c) => [T(100 + c * 70, 188, nm, 'mv-num'), ...range(n).map(i => R(84 + c * 70, 170 - (i + 1) * 22, 32, 20, ['mv-c1', 'mv-c2', 'mv-c5'][c], { at: c + 1, from: [0, -30 - i * 6], move: [{ at: c + 1 }] }))])],
    h: 200,
    steps: [{ say: 'Three kinds of pets.' }, ...cats.map(([nm, n]) => ({ btn: `Add the ${nm} squares`, say: `${n} children chose ${nm}.` })), { btn: 'Add the scale', say: 'The scale shows the frequency of each bar.' }],
  });
})();

export const S03 = scene({
  title: 'Count children, then teeth',
  intro: 'Each circle is one child. The number shows how many teeth they lost.',
  explain: 'Children: 2 + 3 + 1 = 6. Teeth: 2 × 1 + 3 × 2 + 1 × 3 = 2 + 6 + 3 = 11.',
  explain_zh: '条形图的高度表示有几个孩子：2 + 3 + 1 = 6 个孩子。要算一共掉了几颗牙，要用“人数 × 每人颗数”再相加：2×1 + 3×2 + 1×3 = 11 颗。',
  items: [L(40, 160, 280, 160, 'mv-axis'), [[1, 2], [2, 3], [3, 1]].map(([t, n], c) => [T(90 + c * 80, 178, t > 1 ? `${t} teeth` : '1 tooth', 'mv-num'), ...range(n).map(i => G([C(90 + c * 80, 145 - i * 30, 13, 'mv-c3'), T(90 + c * 80, 150 - i * 30, String(t), 'mv-num', { at: 2 })]))]),
    T(150, 28, 'children: 2 + 3 + 1 = 6', 'mv-mid', { at: 1, out: 3 }), T(150, 28, 'teeth: 2×1 + 3×2 + 1×3 = 11', 'mv-mid', { at: 3 })],
  steps: [{ say: 'A bar graph of teeth lost.' }, { btn: 'Count the children', say: '2 + 3 + 1 = 6 children.' }, { btn: 'Show each child’s teeth', say: 'Each child in a bar lost the same number of teeth.' }, { btn: 'Count the teeth', say: '2 + 6 + 3 = 11 teeth.' }],
});

export const Y3 = { N01, N02, N03, N04, N05, N06, N07, N08, N09, N10, N11, N12, N13, N14, N15, N16, N17, N18, N19, N20, N21, N22, N23, A01, A02, M01, M02, M03, M04, M06, M07, M08, G01, G03, G04, S01, S02, S03 };
