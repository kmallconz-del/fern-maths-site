// Year 3 longer lessons: each lesson's first animation, then why it works, try another and remember.
import { sequence, scene, R, C, L, P, T, G, hundred as hblock, ten as tblock, one as oblock, polygon, pathOf, gridLines } from './motion-kit.mjs';
import { range, why, another, remember, lines, jumps, rounding, columnSub, arrayRows, fracShade, fracCompare, fracSplit, fracAddSub, clockMoves, bars } from './deep-kit.mjs';
import { Y3, partScene, balanceScene, areaScene, polygonScene } from './motions-y3.mjs';

// One longer lesson from a first scene plus parts. more / more_zh extend the explanations.
function deep(base, parts, { title, intro, more = '', more_zh = '', w = 300, h = 210 } = {}) {
  const b = base.spec || base;
  return sequence({ title: title || b.title, intro: intro || `${b.intro} Then find out why, and try another.`, explain: `${b.explain} ${more}`.trim(), explain_zh: `${b.explain_zh}${more_zh}`, w, h, parts: [{ ...b, part: 'See it' }, ...parts] });
}

// ---- small builders used only here --------------------------------------------------------------
function placeBuild(hs, ts, os) {
  const heads = ['Hundreds', 'Tens', 'Ones'], n = hs * 100 + ts * 10 + os;
  return { items: [heads.flatMap((hd, i) => [R(20 + i * 87, 18, 87, 26, 'mv-head'), T(63 + i * 87, 36, hd, 'mv-num'), L(20 + i * 87, 18, 20 + i * 87, 190, 'mv-grid')]), L(281, 18, 281, 190, 'mv-grid'),
    range(hs).map(i => hblock(26 + (i % 2) * 44, 52 + Math.floor(i / 2) * 44, { at: 1, from: [0, -40], move: [{ at: 1 }] })), range(ts).map(i => tblock(118 + i * 10, 56, { at: 2, from: [0, -40], move: [{ at: 2 }] })), range(os).map(i => oblock(212 + (i % 5) * 9, 80 + Math.floor(i / 5) * 9, { at: 3, from: [0, -40], move: [{ at: 3 }] })),
    T(63, 170, String(hs), 'mv-big', { at: 1 }), T(150, 170, String(ts), 'mv-big', { at: 2 }), T(237, 170, String(os), 'mv-big', { at: 3 }), T(150, 204, `${n} = ${hs * 100} + ${ts * 10} + ${os}`, 'mv-mid', { at: 4 })], h: 210,
  steps: [{ say: 'An empty chart.' }, { btn: `Add ${hs} hundreds`, say: `${hs} hundreds = ${hs * 100}` }, { btn: `Add ${ts} tens`, say: `${ts} tens = ${ts * 10}` }, { btn: `Add ${os} ones`, say: `${os} ones = ${os}` }, { btn: 'Read it', say: `${n}` }] };
}
export function compareNums(a, b) {
  const da = String(a).split(''), db = String(b).split(''), names = ['thousands', 'hundreds', 'tens', 'ones'].slice(4 - da.length), i = da.findIndex((d, k) => d !== db[k]), sym = a > b ? '>' : '<', place = names[i];
  return { items: [da.map((d, k) => T(150 - 26 - (da.length - 1 - k) * 18, 70, d, 'mv-big', { hl: k < i ? 1 : k === i ? 2 : null, hlOut: k < i ? 2 : null })), db.map((d, k) => T(150 + 26 + k * 18, 70, d, 'mv-big', { hl: k < i ? 1 : k === i ? 2 : null, hlOut: k < i ? 2 : null })), T(150, 70, sym, 'mv-big', { at: 3 }),
    T(150, 130, i > 0 ? `${names.slice(0, i).join(' and ')} match` : '', 'mv-num', { at: 1, out: 2 }), T(150, 130, `${place}: ${da[i]} ${sym} ${db[i]}`, 'mv-mid', { at: 2 }), T(150, 166, `${a} ${sym} ${b}`, 'mv-mid', { at: 3 })],
  steps: [{ say: `${a} or ${b}?` }, { btn: 'Compare from the left', say: i ? `The ${names.slice(0, i).join(' and ')} match.` : `Look at the ${names[0]}.` }, { btn: `Compare the ${place}`, say: `${da[i]} ${place} ${sym === '>' ? 'is more than' : 'is less than'} ${db[i]} ${place}.` }, { btn: 'Write it', say: `${a} ${sym} ${b}` }] };
}
function rulerScene(start, len, other) {
  const px = 20, x0 = 30, rule = [R(x0 - 8, 130, 12 * px + 16, 34, 'mv-ruler'), ...range(25).map(i => L(x0 + i * px / 2, 130, x0 + i * px / 2, 130 + (i % 2 ? 7 : 12), 'mv-tickl')), ...range(13).map(i => T(x0 + i * px, 157, String(i), 'mv-num'))];
  const pen = (x, y, l, cls) => G([R(x, y, l - 14, 14, cls), P(`M${x + l - 14} ${y} L${x + l} ${y + 7} L${x + l - 14} ${y + 14} Z`, 'mv-tip')]);
  return { items: [rule, G([pen(x0 + start * px, 104, len * px, 'mv-pencil')], { move: [{ at: 2, dx: -start * px }] }), T(150, 40, `starts at ${start}, ends at ${start + len}`, 'mv-num', { at: 1, out: 2 }), T(150, 62, `${start + len} − ${start} = ${len} cm`, 'mv-mid', { at: 1, out: 2 }),
    T(150, 40, `from 0: ${len} cm`, 'mv-mid', { at: 2 }), other ? G([pen(x0, 76, other * px, 'mv-pencil2'), T(x0 + other * px + 22, 88, `${other} cm`, 'mv-num')], { at: 3 }) : [], other ? T(150, 62, `${len} − ${other} = ${len - other} cm longer`, 'mv-mid', { at: 3 }) : []],
  steps: [{ say: `A crayon that does not start at 0.` }, { btn: 'Read both ends', say: `It starts at ${start} and ends at ${start + len}: ${start + len} − ${start} = ${len} cm.` }, { btn: 'Slide it to 0', say: `From 0 it ends at ${len}: the same ${len} cm.` }, ...(other ? [{ btn: 'Compare', say: `${len} cm is ${len - other} cm longer than ${other} cm.` }] : [])] };
}
function jugScene(a, b) {
  const jug = (x, lab) => [R(x, 30, 64, 130, 'mv-jug'), ...range(10).map(i => L(x, 160 - (i + 1) * 13, x + 10, 160 - (i + 1) * 13, 'mv-tickl')), T(x + 32, 178, lab, 'mv-num')];
  return { h: 212, items: [range(a / 100).map(i => R(61, 160 - (i + 1) * 13, 62, 13, 'mv-water', { at: 1 })), range(b / 100).map(i => R(181, 160 - (i + 1) * 13, 62, 13, 'mv-water', { at: 2 })), jug(60, 'Jug A'), jug(180, 'Jug B'),
    T(92, 22, `${a} mL`, 'mv-num', { at: 1 }), T(212, 22, `${b} mL`, 'mv-num', { at: 2 }), T(150, 204, `${a + b} mL altogether${a + b === 1000 ? ' = 1 litre' : ''}`, 'mv-mid', { at: 3 })],
  steps: [{ say: 'Two empty jugs, marks every 100 mL.' }, { btn: 'Fill jug A', say: `${a} mL` }, { btn: 'Fill jug B', say: `${b} mL` }, { btn: 'Put them together', say: `${a} + ${b} = ${a + b} mL${a + b === 1000 ? ': 1 litre' : ''}.` }] };
}
function turnScene({ dir = 1, title, says }) { // dir 1 clockwise, -1 anticlockwise
  return { items: [C(150, 105, 82, 'mv-face'), [0, 90, 180, 270].map(a => C(150 + 70 * Math.sin(a * Math.PI / 180), 105 - 70 * Math.cos(a * Math.PI / 180), 6, 'mv-tick')),
    G([L(150, 105, 150, 45, 'mv-hand'), P('M150 33 L138 53 L162 53 Z', 'mv-turtle')], { rot: { cx: 150, cy: 105, from: 0, keys: [1, 2, 3, 4].map(k => ({ at: k, deg: dir * 90 * k })) } }), C(150, 105, 7, 'mv-pin'),
    ['1 quarter turn', '2 quarter turns = half turn', '3 quarter turns', '4 quarter turns = full turn'].map((t, i) => T(150, 204, t, 'mv-mid', { at: i + 1, out: i < 3 ? i + 2 : null }))], h: 210,
  steps: [{ say: says[0] }, ...range(4).map(i => ({ btn: dir > 0 ? 'Quarter turn ↻' : 'Quarter turn ↺', say: says[i + 1] }))] };
}
function mirrorScene({ dot, label }) { // the left half folds over the line at x = 150; dot = squares from the line
  const s = 25, grid = gridLines(0, 0, 12, 8, s), half = 'M150 30 L90 55 L55 100 L90 150 L150 170 Z';
  return { items: [grid, P(half.replace(/(\d+) (\d+)/g, (m, x, y) => `${300 - x} ${y}`), 'mv-outline'), C(150 + dot * s, 100, 11, 'mv-spot'),
    G([P(half, 'mv-shape'), C(150 - dot * s, 100, 11, 'mv-dot')], { scale: { cx: 150, cy: 0, from: [1, 1], keys: [{ at: 2, sx: -1 }] } }), L(150, 0, 150, 200, 'mv-mirror'),
    range(dot).map(i => T(150 - (i + .5) * s, 128, String(i + 1), 'mv-jl', { at: 1, out: 2 })), range(dot).map(i => T(150 + (i + .5) * s, 128, String(i + 1), 'mv-jl', { at: 3 }))], h: 200,
  steps: [{ say: label }, { btn: 'Count to the line', say: `The dot is ${dot} squares from the mirror line.` }, { btn: 'Fold it over', say: 'Fold the left half over the line.' }, { btn: 'Count again', say: `It lands ${dot} squares on the other side: the same distance.` }] };
}
function turtle({ moves, start = [2, 5], face = 0 }) { // moves: ['F2','R','F3','L',...]
  const s = 25, x0 = 40, y0 = 20, cx = (c) => x0 + (c + .5) * s, cy = (r) => y0 + (r + .5) * s;
  let [c, r] = start, f = face; const keys = [], rots = [], path = [], says = [];
  moves.forEach((m, i) => {
    if (m[0] === 'F') { const n = Number(m.slice(1)), d = [[0, -1], [1, 0], [0, 1], [-1, 0]][((f / 90) % 4 + 4) % 4], c2 = c + d[0] * n, r2 = r + d[1] * n; path.push(L(cx(c), cy(r), cx(c2), cy(r2), 'mv-walk', { at: i + 1 })); c = c2; r = r2; says.push(`Forward ${n}.`); }
    else { f += m === 'R' ? 90 : -90; says.push(m === 'R' ? 'Quarter turn right.' : 'Quarter turn left.'); }
    keys.push({ at: i + 1, dx: cx(c) - cx(start[0]), dy: cy(r) - cy(start[1]) }); rots.push({ at: i + 1, deg: f });
  });
  return { items: [gridLines(x0, y0, 8, 6, s), T(268, 32, 'N ↑', 'mv-mid'), path, G([P(`M${cx(start[0])} ${cy(start[1]) - 12} L${cx(start[0]) - 10} ${cy(start[1]) + 11} L${cx(start[0])} ${cy(start[1]) + 5} L${cx(start[0]) + 10} ${cy(start[1]) + 11} Z`, 'mv-turtle')], { move: keys, rot: { cx: cx(start[0]), cy: cy(start[1]), from: face, keys: rots } }),
    moves.map((m, i) => T(272, 70 + i * 18, m.replace('F', 'forward ').replace(/^R$/, 'turn right').replace(/^L$/, 'turn left'), 'mv-num', { at: i + 1 }))],
  steps: [{ say: 'The arrow faces north.' }, ...moves.map((m, i) => ({ btn: m[0] === 'F' ? `Forward ${m.slice(1)}` : m === 'R' ? 'Turn right' : 'Turn left', say: says[i] }))] };
}

const D = {};
// ---- Number ----------------------------------------------------------------------------------
D.N01 = deep(Y3.N01, [why(lines({ figure: [['H', 'T', 'O'].map((h, i) => T(60 + i * 30, 40, h, 'mv-num')), ['2', '0', '4'].map((d, i) => T(60 + i * 30, 68, d, 'mv-big'))], x: 210, y: 50, rows: ['204 = 200 + 0 + 4', 'The 0 means no tens', 'Without it, 24 is tiny'], says: ['What does a 0 do?', { btn: 'Read 204', say: '204 is 2 hundreds, 0 tens and 4 ones.' }, { btn: 'Look at the 0', say: 'The 0 keeps the tens place empty.' }, { btn: 'Take the 0 away', say: 'Without the 0 we would read 24: a different number.' }] })),
  another(placeBuild(3, 5, 2)), remember(['Each place has its own value.', 'Hundreds, tens, ones.', 'A 0 holds an empty place.'], 'Each digit’s place tells its value; a zero holds an empty place.')],
  { more: 'A zero holds an empty place, as in 204. Then build 352 = 300 + 50 + 2.', more_zh: '再看 204：中间的 0 表示十位上没有，但要占住位置，否则就变成 24。最后再搭一个数：352 = 300 + 50 + 2。' });
D.N02 = deep(Y3.N02, [why(lines({ rows: ['10 ones = 1 ten', '10 tens = 1 hundred', '10 hundreds = 1 thousand'], says: ['The same pattern every time.', '10 ones make 1 ten.', '10 tens make 1 hundred.', '10 hundreds make 1 thousand.'] })),
  another(jumps({ min: 0, max: 1000, every: 100, label: 200, start: 600, hops: [700, 800, 900, 1000].map(v => ({ to: v, label: '+100', say: `${v}` })), end: '600, 700, 800, 900, 1000', startSay: 'Count on in hundreds from 600.' })),
  remember(['Ten of a place make one', 'of the next place.', '10 hundreds = 1000.'], 'Ten of a place make one of the next place: 10 hundreds = 1000.')],
  { more: 'The same ten-to-one pattern links ones, tens, hundreds and thousands. Then count on in hundreds to 1000.', more_zh: '规律一直一样：10 个一是 1 个十，10 个十是 1 个百，10 个百是 1 个千。再按一百一百地数：600、700、800、900、1000。' });
D.N03 = deep(Y3.N03, [why(lines({ rows: ['Compare from the left', 'Hundreds: 3 and 3 match', 'Tens: 1 < 3, so stop', '313 < 330'], says: ['Why start on the left?', 'The left digit is worth the most.', 'The hundreds are the same.', 'The tens decide. No need to look at the ones.', '313 < 330'] })),
  another(compareNums(452, 425)), remember(['Start with the biggest place.', 'The first different digit decides.', 'The open side faces the bigger number.'], 'Compare from the left: the first different digit decides.')],
  { more: 'The first different digit from the left decides. Then compare 452 and 425.', more_zh: '比较时从最左边（最大的位）开始，第一个不同的数字决定大小，后面的不用再看。再比较 452 和 425：百位相同，十位 5 > 2，所以 452 > 425。' });
D.N04 = deep(Y3.N04, [why(lines({ rows: ['367: look at the tens', '6 tens = 60', '60 is past 50: round up', '367 → 400'], says: ['A quick way to round.', 'To the nearest hundred, look at the tens digit.', '6 tens is 60.', 'More than half of a hundred, so round up.', '367 rounds to 400.'] })),
  another(rounding({ min: 200, max: 300, every: 10, label: 50, v: 241, to: 200, half: 250 })), remember(['Find the two neighbours.', 'Check which side of halfway.', 'Halfway or more: round up.'], 'Find the neighbours and check halfway; halfway or more rounds up.')],
  { more: 'Then round 241: it is before halfway (250), so it rounds down to 200.', more_zh: '快速方法：取整到百，看十位上的数，5 或以上就往上进。再试 241：在中点 250 之前，所以约等于 200。' });
D.N05 = deep(Y3.N05, [why(lines({ rows: ['289 is 11 less than 300', '113 is 13 more than 100', 'One up, one down: close', '402 is near 400 ✓'], says: ['Why is the estimate so close?', '289 went up a little to 300.', '113 went down a little to 100.', 'The changes nearly cancel out.', '402 is near 400.'] })),
  another(lines({ rows: ['412 + 195 = ?', '412 ≈ 400', '195 ≈ 200', 'about 400 + 200 = 600', 'exact: 607, close ✓'], says: ['Try another.', 'Estimate first.', '412 is nearer 400.', '195 is nearer 200.', 'About 600.', 'The exact answer 607 is close.'] })),
  remember(['Round first, then add.', 'An estimate checks your answer.', 'Far away? Check again.'], 'Round first to estimate; a far-away answer needs checking.')],
  { more: 'Then estimate 412 + 195 ≈ 600 (exact 607).', more_zh: '估算可以检查答案是否合理：一个数往上取、一个往下取，误差会互相抵消一些。再试 412 + 195：约 400 + 200 = 600，精确是 607，很接近。' });
D.N06 = deep(Y3.N06, [why(lines({ rows: ['4, 8, 12, 16 …', 'Each jump adds 4', '3 jumps of 4 = 3 × 4 = 12'], says: ['What do the jumps show?', 'Counting in fours.', 'Every jump is the same size.', 'Three jumps of 4 is 3 × 4 = 12.'] })),
  another(jumps({ min: 0, max: 24, every: 1, label: 3, start: 0, hops: [3, 6, 9, 12].map(v => ({ to: v, label: '+3', say: `${v - 3} + 3 = ${v}` })).concat([{ to: 9, label: '−3', below: true, say: 'Back: 12 − 3 = 9' }]), startSay: 'Now count in threes.' })),
  remember(['Equal jumps: count on.', 'Back the same jump: count back.', 'Jumps make multiplication.'], 'Equal jumps count on or back; they also show multiplication.')],
  { more: 'Then count in threes to 12 and back to 9.', more_zh: '每次跳的距离一样就是“按几数”，跳几次就是几乘几：3 次 4 是 3 × 4 = 12。再按 3 数：3、6、9、12，再往回跳到 9。' });
D.N07 = deep(Y3.N07, [why(lines({ rows: ['Even: ends in 0, 2, 4, 6, 8', 'Odd: ends in 1, 3, 5, 7, 9', 'Even + 1 = odd'], says: ['How can you tell quickly?', 'Even numbers end in 0, 2, 4, 6 or 8.', 'Odd numbers end in 1, 3, 5, 7 or 9.', 'Adding 1 to an even number makes it odd.'] })),
  another(jumps({ min: 0, max: 15, every: 1, label: 3, start: 0, hops: [3, 6, 9, 12].map(v => ({ to: v, label: v % 2 ? 'odd' : 'even', say: `${v} is ${v % 2 ? 'odd' : 'even'}` })), end: 'Threes go odd, even, odd, even', startSay: 'Jump in threes and check odd or even.' })),
  remember(['Look at the last digit.', 'Pairs with none left: even.', 'One left over: odd.'], 'Look at the last digit: even numbers make pairs, odd numbers leave one over.')],
  { more: 'Then jump in threes: the stops go odd, even, odd, even.', more_zh: '看个位就能判断单双：个位是 0、2、4、6、8 是双数（偶数），1、3、5、7、9 是单数（奇数）。按 3 跳：3 单、6 双、9 单、12 双，交替出现。' });
D.N08 = deep(Y3.N08, [why(lines({ rows: ['34 + 6 = 40', '40 + 60 = 100', '6 + 60 = 66', '34 + 66 = 100 ✓'], says: ['Why jump to 40 first?', 'Filling up to the next ten is easy.', 'From a ten, count in tens to 100.', 'Add the two jumps.', '34 + 66 = 100'] })),
  another(jumps({ min: 50, max: 100, every: 5, label: 10, start: 58, hops: [{ to: 60, label: '+2', say: '58 + 2 = 60' }, { to: 100, label: '+40', say: '60 + 40 = 100' }], end: '2 + 40 = 42, so 58 + 42 = 100', startSay: 'Make 100 from 58.' })),
  remember(['Fill to the next ten.', 'Then jump in tens.', 'Add the jumps.'], 'Fill to the next ten, jump in tens, then add the jumps.')],
  { more: 'Then make 100 from 58: 2 to 60, then 40 more: 42.', more_zh: '补到 100 的好方法：先补到下一个整十，再整十地跳。再试 58：先加 2 到 60，再加 40 到 100，2 + 40 = 42。' });
D.N10 = deep(Y3.N10, [why(lines({ rows: ['243 = 2 hundreds 4 tens 3 ones', '= 1 hundred 13 tens 13 ones', 'Still 243, just renamed'], says: ['Why can we exchange?', 'Start with 243.', 'Swap 1 hundred for 10 tens, and 1 ten for 10 ones.', 'The amount does not change.'] })),
  another(columnSub({ a: 305, b: 128 })), remember(['Not enough? Exchange first.', 'Renaming keeps the value.', 'Check by adding back.'], 'Not enough in a column: exchange from the next place. The value stays the same.')],
  { more: 'Then subtract 305 − 128, exchanging across a zero.', more_zh: '退位就是“换名字”：243 可以看成 1 个百、13 个十、13 个一，总数不变。再试 305 − 128：十位是 0，要先从百位换到十位，再从十位换到个位。' });
D.N11 = deep(Y3.N11, [why(lines({ rows: ['28 + 12 = 40', '40 − 9 = 31', 'Or: 12 on, 9 off = 3 more', '28 + 3 = 31 ✓'], says: ['Two ways to think.', 'Follow the story in order.', 'Then subtract the 9.', 'Or see the change: 3 more children.', 'Both give 31.'] })),
  another(jumps({ min: 25, max: 40, every: 1, label: 5, start: 35, hops: [{ to: 25, label: '−10 sold', below: true, say: '35 − 10 = 25' }, { to: 31, label: '+6 delivered', say: '25 + 6 = 31' }], end: '35 − 10 + 6 = 31', startSay: 'A shop has 35 apples.' })),
  remember(['Follow each change in order.', 'Getting on adds, getting off takes away.', 'Check: does the answer make sense?'], 'Follow each change in order; check the answer makes sense.')],
  { more: 'Then a shop: 35 apples, 10 sold, 6 delivered: 31.', more_zh: '多步应用题按顺序一步步算，也可以先看总变化：上 12 下 9，就是多了 3。再试：商店有 35 个苹果，卖掉 10 个，又送来 6 个，35 − 10 + 6 = 31。' });
D.N12 = deep(Y3.N12, [why(lines({ rows: ['3 rows of 4 = 4 + 4 + 4', 'Turn it: 4 rows of 3', '3 + 3 + 3 + 3 = 12', '3 × 4 = 4 × 3 = 12'], says: ['Turn the array round.', '3 rows of 4.', 'Turned, it is 4 rows of 3.', 'Still 12 counters.', 'So 3 × 4 = 4 × 3.'] })),
  another(arrayRows({ rows: 5, cols: 3 })), remember(['Equal rows make multiplication.', 'Turning an array keeps the total.', '3 × 4 = 4 × 3'], 'Equal rows make multiplication; turning the array keeps the total.')],
  { more: 'Then 5 rows of 3 = 15.', more_zh: '阵列转个方向，总数不变：3 行 4 个 = 4 行 3 个，所以 3 × 4 = 4 × 3。再试 5 行、每行 3 个：5 × 3 = 15。' });
D.N14 = deep(Y3.N14, [why(lines({ rows: ['2 × 23 = 2 × 20 + 2 × 3', '= 40 + 6', '= 46'], says: ['Why split 23?', 'Tens and ones are easy to multiply separately.', '2 × 20 = 40 and 2 × 3 = 6.', 'Join them: 46.'] })),
  another(lines({ rows: ['3 × 14 = ?', '14 = 10 + 4', '3 × 10 = 30', '3 × 4 = 12', '30 + 12 = 42'], says: ['Try another.', '3 groups of 14.', 'Split 14.', 'Multiply the ten.', 'Multiply the ones.', 'Join: 42.'] })),
  remember(['Split into tens and ones.', 'Multiply each part.', 'Add the parts.'], 'Split into tens and ones, multiply each part, then add.')],
  { more: 'Then 3 × 14 = 30 + 12 = 42.', more_zh: '两位数乘一位数：拆成整十和个位分别乘，再相加。再试 3 × 14：3 × 10 = 30，3 × 4 = 12，30 + 12 = 42。' });
D.N15 = deep(Y3.N15, [why(lines({ rows: ['Bottom number: equal parts', 'Top number: parts we take', '3/4: 3 of 4 equal parts'], says: ['What do the two numbers mean?', 'The denominator says how many equal parts.', 'The numerator says how many we take.', '3/4 is 3 of 4 equal parts.'] })),
  another(fracShade({ d: 5, n: 2 })), remember(['Parts must be equal.', 'Denominator: how many parts.', 'Numerator: how many taken.'], 'Equal parts; the denominator counts parts, the numerator counts parts taken.')],
  { more: 'Then shade 2/5.', more_zh: '分母表示平均分成几份，分子表示取了几份，一定要是相等的份。再试：分成 5 份，取 2 份是 2/5。' });
D.N16 = deep(Y3.N16, [why(lines({ rows: ['Cut into 3: big pieces', 'Cut into 6: small pieces', 'Bigger bottom number,', 'smaller piece'], says: ['Why is one third bigger?', 'Few cuts make big pieces.', 'More cuts make smaller pieces.', 'A bigger denominator…', '…means a smaller unit fraction.'] })),
  another(fracCompare({ a: [1, 4], b: [1, 8], why: 'Quarters are bigger than eighths.' })), remember(['Same-sized wholes only.', 'More pieces, smaller pieces.', '1/4 > 1/8'], 'With equal wholes, more pieces means smaller pieces.')],
  { more: 'Then compare 1/4 and 1/8.', more_zh: '单位分数比较：整体一样大时，分的份数越多，每份越小。再比较 1/4 和 1/8：1/4 更大。' });
D.N17 = deep(Y3.N17, [why(lines({ rows: ['Same denominator', 'Every piece the same size', 'Count the pieces: 5 > 2'], says: ['Why only count?', 'Both are sixths.', 'So every piece matches.', 'More pieces means more.'] })),
  another(fracCompare({ a: [3, 8], b: [5, 8], why: 'Same-size pieces: 3 is less than 5.' })), remember(['Same denominator:', 'compare the numerators.', '3/8 < 5/8'], 'With the same denominator, compare the numerators.')],
  { more: 'Then compare 3/8 and 5/8.', more_zh: '分母相同，每份一样大，只要比分子（份数）。再比较 3/8 和 5/8：3/8 < 5/8。' });
D.N19 = deep(Y3.N19, [why(lines({ rows: ['2 eighths + 3 eighths', '= 5 eighths', 'Like 2 apples + 3 apples', 'The 8 stays: 5/8'], says: ['Why does the bottom stay 8?', 'We are counting eighths.', '2 + 3 = 5 of them.', 'Just like counting apples.', 'The piece size does not change.'] })),
  another(fracAddSub({ d: 6, a: 5, b: 2, op: '−' })), remember(['Same denominator:', 'add or subtract the tops.', 'The bottom stays the same.'], 'Add or subtract the numerators; the denominator stays the same.')],
  { more: 'Then 5/6 − 2/6 = 3/6.', more_zh: '同分母加减就像数苹果：2 个八分之一加 3 个八分之一是 5 个八分之一，分母（每份大小）不变。再试 5/6 − 2/6 = 3/6。' });
D.N20 = deep(Y3.N20, [why(lines({ rows: ['1/6 of 42', '= 42 shared into 6', '42 ÷ 6 = 7', 'Check: 6 × 7 = 42 ✓'], says: ['How do we write it?', 'One sixth of 42.', 'Means share into 6 equal groups.', '42 ÷ 6 = 7', '6 × 7 = 42'] })),
  another(partScene({ total: 20, groups: 4, title: '', intro: '', explain: '', explain_zh: '' })), remember(['1/6 of a number:', 'divide by 6.', 'Check by multiplying.'], 'To find one sixth, divide by 6; check by multiplying.')],
  { more: 'Then 1/4 of 20 = 5.', more_zh: '求几分之一就是除以分母：42 的 1/6 是 42 ÷ 6 = 7，用 6 × 7 = 42 检查。再试 20 的 1/4 = 5。' });
D.N21 = deep(Y3.N21, [why(lines({ rows: ['1/4 is one of 4 equal parts', 'One part = 3', 'Whole = 4 × 3 = 12', 'Check: 12 ÷ 4 = 3 ✓'], says: ['Going backwards.', 'A quarter is one of four equal parts.', 'We know one part.', 'Four parts make the whole.', 'Check by sharing.'] })),
  another(arrayRows({ rows: 5, cols: 4, unit: ': 1/5 is 4, so the whole is 20' })), remember(['Know one part?', 'Multiply by the number of parts.', 'Check by dividing.'], 'Know one part: multiply by the number of parts; check by dividing.')],
  { more: 'Then 1/5 is 4, so the whole is 5 × 4 = 20.', more_zh: '知道一份求整体：一份 × 份数。1/4 是 3，整体是 4 × 3 = 12。再试：1/5 是 4，整体就是 5 × 4 = 20。' });
D.N22 = deep(Y3.N22, [why(lines({ rows: ['$1 = 100 cents', '$2.50 = $2 + 50c', 'Count big notes first'], says: ['How to read money.', '100 cents make a dollar.', 'Dollars before the point, cents after.', 'Start with the biggest note.'] })),
  another(lines({ rows: ['$10 + $2 + $2 + 50c', '10, 12, 14 …', '… and 50 cents', '= $14.50'], says: ['Try another.', 'A $10 note, two $2 coins and a 50c coin.', 'Count dollars from the biggest.', 'Then the cents.', '$14.50'] })),
  remember(['100 cents = $1.', 'Count the biggest first.', 'Dollars . cents'], '100 cents make a dollar; count the biggest money first.')],
  { more: 'Then count $10 + $2 + $2 + 50c = $14.50.', more_zh: '1 元 = 100 分。数钱从面值大的开始。再试：10 元 + 2 元 + 2 元 + 50 分 = 14.50 元。' });
D.N23 = deep(Y3.N23, [why(lines({ rows: ['cost + change = paid', '9 + 11 = 20', 'Count up from the cost'], says: ['Why count up?', 'What you spend and your change make what you paid.', '9 + 11 = 20', 'So count up from the cost to the amount paid.'] })),
  another(jumps({ min: 0, max: 20, every: 1, label: 5, start: 7, hops: [{ to: 10, label: '+3', below: true, say: '7 + 3 = 10' }, { to: 20, label: '+10', below: true, say: '10 + 10 = 20' }], end: 'Change: 3 + 10 = $13', startSay: 'A toy costs $7. Pay with $20.' })),
  remember(['Cost + change = paid.', 'Count up to the next ten,', 'then to the money paid.'], 'Cost plus change equals what you paid; count up to find the change.')],
  { more: 'Then a $7 toy paid with $20: change $13.', more_zh: '花的钱 + 找零 = 付的钱，所以可以从花的钱往上数。再试：玩具 7 元，付 20 元，先数 3 到 10，再数 10 到 20，找零 13 元。' });

// ---- Algebra -----------------------------------------------------------------------------------
D.A01 = deep(Y3.A01, [why(lines({ rows: ['17 + ? = 30', '30 − 17 = 13', '17 + 13 = 30 ✓'], says: ['Find it another way.', 'What goes with 17 to make 30?', 'Take 17 away from 30.', 'Check: both sides are 30.'] })),
  another(balanceScene({ left: '25 +', right: '40', missing: '15', title: '', intro: '', explain: '', explain_zh: '', check: '25 + 15 = 40 ✓' })), remember(['= means the same value.', 'Undo adding by subtracting.', 'Check both sides.'], 'Equals means the same value; undo adding by subtracting.')],
  { more: 'Then 25 + ? = 40: 15.', more_zh: '求未知数可以用减法：30 − 17 = 13。再试 25 + □ = 40：40 − 25 = 15。' });
D.A02 = deep(Y3.A02, [why(lines({ rows: ['2, 4, 6, 8', '+2 each time', 'Next: 10, 12'], says: ['Use the rule.', 'The pattern so far.', 'The same change every time.', 'So the next towers have 10 and 12.'] })),
  another(jumps({ min: 0, max: 20, every: 1, label: 5, start: 20, hops: [17, 14, 11, 8].map(v => ({ to: v, label: '−3', below: true, say: `${v + 3} − 3 = ${v}` })), end: 'Rule: take away 3', startSay: 'A pattern going down: 20, 17, …' })),
  remember(['Find the change.', 'Check it every time.', 'Use it to go on.'], 'Find the change, check it each time, then use it.')],
  { more: 'Then a pattern going down by 3: 20, 17, 14, 11, 8.', more_zh: '找规律：看每一步变化是不是一样。2、4、6、8 每次加 2，下面就是 10、12。也有往下的规律：20、17、14、11、8，每次减 3。' });

// ---- Measurement -------------------------------------------------------------------------------
D.M01 = deep(Y3.M01, [why(lines({ rows: ['Hands are different sizes', 'Centimetres are the same', 'for everyone', 'So start at 0 and count cm'], says: ['Why use centimetres?', 'Hand spans give different answers.', 'A centimetre is the same everywhere…', '…so everyone gets the same answer.', 'Start at 0 and read the end.'] })),
  another(rulerScene(3, 8, 5)), remember(['Line up with 0.', 'Not at 0? Subtract the start.', 'Use the same unit to compare.'], 'Line up with 0, or subtract the start; compare in the same unit.')],
  { more: 'Then a crayon from 3 to 11 is 8 cm, 3 cm longer than a 5 cm one.', more_zh: '用统一单位（厘米）大家量出来才一样。如果没有从 0 开始，用“终点 − 起点”：从 3 到 11 是 8 厘米，比 5 厘米的长 3 厘米。' });
D.M02 = deep(Y3.M02, [why(lines({ rows: ['Each mark is 100 mL', '8 marks = 800 mL', '10 marks = 1000 mL = 1 L'], says: ['Read the scale.', 'Check what one mark is worth.', 'Count the marks to the top of the water.', '1000 mL is one litre.'] })),
  another(jugScene(300, 700)), remember(['Read the top of the water.', 'Know what one mark means.', '1000 mL = 1 litre.'], 'Read the water level against the marks; 1000 mL is a litre.')],
  { more: 'Then 300 mL + 700 mL = 1000 mL = 1 litre.', more_zh: '读刻度先看每一格代表多少（这里 100 毫升），1000 毫升 = 1 升。再试：300 毫升和 700 毫升合起来是 1000 毫升，就是 1 升。' });
D.M04 = deep(Y3.M04, [why(lines({ rows: ['3 rows of 4 squares', '4 + 4 + 4 = 12', '3 × 4 = 12 square cm'], says: ['A quicker count.', 'Count one row, then the rows.', 'Add the rows.', 'Or multiply.'] })),
  another(areaScene({ cols: 5, rows: 2, title: '', intro: '', explain: '', explain_zh: '' })), remember(['Cover with equal squares.', 'No gaps, no overlaps.', 'Rows × squares in a row.'], 'Cover with equal squares; rows times squares in a row.')],
  { more: 'Then a 5 by 2 rectangle: 10 square cm.', more_zh: '数面积可以一行一行数：3 行，每行 4 个，3 × 4 = 12 平方厘米。再试 5 × 2 的长方形：10 平方厘米。' });
D.M05 = sequence({ title: 'Turn the arrow', intro: 'Make quarter turns clockwise, then anticlockwise.', explain: 'Two quarter turns make a half turn and four make a full turn, back to the start, in either direction.',
  explain_zh: '每点一次转四分之一圈（一个直角）：两次是半圈，四次是一整圈回到原处。顺时针（↻）和逆时针（↺）都一样，只是方向相反。',
  parts: [{ ...turnScene({ dir: 1, says: ['The arrow points up.', 'A quarter turn clockwise: right.', 'Two quarter turns: a half turn. It points down.', 'Three quarter turns: left.', 'Four quarter turns: a full turn, back to the start.'] }), part: 'See it' },
    why(lines({ rows: ['1 quarter = 1 right angle', '2 quarters = half turn', '4 quarters = full turn'], says: ['Counting turns.', 'A quarter turn is one right angle.', 'Two make a half turn.', 'Four make a full turn.'] })),
    another(turnScene({ dir: -1, says: ['Now turn the other way: anticlockwise.', 'A quarter turn anticlockwise: left.', 'Half turn: down.', 'Three quarters: right.', 'Full turn: back to up.'] })),
    remember(['Quarter, half, full turn.', 'Clockwise or anticlockwise.', '4 quarters = 1 full turn.'], 'Four quarter turns make a full turn, in either direction.')] });
D.M06 = deep(Y3.M06, [why(lines({ rows: ['Long hand: minutes', 'Each number = 5 minutes', 'Short hand: hours', '3:45 = 15 to 4'], says: ['How to read it.', 'The long hand counts minutes.', 'Count in fives around the numbers.', 'The short hand shows the hour.', '3:45 is a quarter to 4.'] })),
  another(clockMoves({ times: [[7, 0, '7:00'], [7, 15, '7:15 quarter past', 'Move on 15 minutes'], [7, 30, '7:30 half past', 'Move on 15 more'], [7, 45, '7:45 quarter to 8', 'Move on 15 more']] })),
  remember(['Long hand counts minutes.', 'Count in fives.', 'Short hand shows the hour.'], 'The long hand counts minutes in fives; the short hand shows the hour.')],
  { more: 'Then move from 7:00 through quarter past, half past and quarter to 8.', more_zh: '长针每走一个数字是 5 分钟：一刻（15 分）、半（30 分）、差一刻（45 分）。再看 7:00 → 7:15 → 7:30 → 7:45。' });
D.M07 = deep(Y3.M07, [why(lines({ rows: ['Jump to an easy time', '9:10 → 9:25 = 15 min', '9:25 → 9:35 = 10 min', '15 + 10 = 25 min'], says: ['Why in two jumps?', 'Easy times make counting easy.', 'First jump.', 'Second jump.', 'Add the jumps.'] })),
  another(clockMoves({ times: [[2, 40, 'start 2:40'], [3, 0, '+20 min → 3:00', 'Move to 3:00'], [3, 15, '+15 min → 3:15', 'Move to 3:15']], summary: '35 minutes' })),
  remember(['Jump to the next easy time.', 'Then on to the end.', 'Add the jumps.'], 'Jump to an easy time, then to the end, and add the jumps.')],
  { more: 'Then from 2:40 to 3:15: 20 + 15 = 35 minutes.', more_zh: '求经过时间：先跳到整点或好数的时间，再跳到结束，最后相加。再试 2:40 到 3:15：20 + 15 = 35 分钟。' });
D.M08 = deep(Y3.M08, [why(lines({ rows: ['52 × 7 = 364 days', '365 − 364 = 1 day over', 'Leap year: 366 days'], says: ['Why 52 weeks and a day?', '52 weeks of 7 days.', 'A year is one day longer.', 'Every fourth year has one more day.'] })),
  another(lines({ rows: ['30 days: Apr, Jun, Sep, Nov', 'February: 28 (29 in a leap year)', 'All the rest: 31'], says: ['How long is each month?', 'Four months have 30 days.', 'February is short.', 'The other seven have 31.'] })),
  remember(['7 days = 1 week.', '365 days = 1 year.', 'Months are not all the same.'], 'A week is 7 days, a year 365; months have different lengths.')],
  { more: 'Then the lengths of the months: 30, 31, and February.', more_zh: '一年 365 天 = 52 周多 1 天，闰年 366 天。月份天数：4、6、9、11 月 30 天，2 月 28 天（闰年 29 天），其余 31 天。' });

// ---- Geometry ----------------------------------------------------------------------------------
D.G01 = deep(Y3.G01, [why(lines({ rows: ['Regular needs two things:', 'all sides equal', 'and all corners equal'], says: ['What makes it regular?', 'Two checks.', 'Every side the same length.', 'Every corner the same size.'] })),
  another(polygonScene({ n: 6, title: '', intro: '', explain: '', explain_zh: '' })), remember(['Count straight sides to name it.', 'Regular: equal sides AND corners.', 'Irregular is still a polygon.'], 'Name it by its sides; regular means equal sides and equal corners.')],
  { more: 'Then a hexagon: 6 sides, regular, then irregular.', more_zh: '“正”多边形要同时满足边都相等、角都相等。再看六边形：数出 6 条边，拉动一个顶点后变成不规则六边形，但仍然是六边形。' });
D.G02 = sequence({ title: 'Fold it over the mirror line', intro: 'Count to the mirror line, fold, then try another.', explain: 'A mirror partner is the same distance from the line, on the other side: 3 squares, then 2 squares.',
  explain_zh: '对称的两个点到镜子线一样远，只是在两边。先数红点到线有 3 格，对折后落在另一边第 3 格；再试一个离线 2 格的点。',
  parts: [{ ...mirrorScene({ dot: 3, label: 'A shape and a red dot beside a mirror line.' }), part: 'See it' },
    why(lines({ rows: ['Same distance from the line', 'Opposite side', 'Like a reflection in a mirror'], says: ['Why does it land there?', 'Folding keeps the distance to the line.', 'It just flips to the other side.', 'That is what a mirror does.'] })),
    another(mirrorScene({ dot: 2, label: 'Try another: this dot is closer to the line.' })),
    remember(['Count squares to the line.', 'Count the same on the other side.', 'That is the mirror partner.'], 'Count to the line, then the same number on the other side.')] });
D.G03 = deep(Y3.G03, [why(lines({ rows: ['Forward = the way you face', 'Right quarter turn:', 'north → east', 'Say the turn and the distance'], says: ['How do instructions work?', 'Forward depends on which way you face.', 'Turning right a quarter…', '…changes north to east.', 'Clear instructions say both.'] })),
  another(turtle({ moves: ['F3', 'L', 'F2'], start: [4, 5] })), remember(['Forward follows your facing.', 'Turn first, then move.', 'Say turn and distance.'], 'Forward follows the way you face; say the turn and the distance.')],
  { more: 'Then forward 3, turn left, forward 2.', more_zh: '“向前”是朝着自己面对的方向。再试：向前 3 格，左转四分之一圈（面向西），再向前 2 格。' });
D.G04 = deep(Y3.G04, [why(lines({ rows: ['North up, east right', 'West is opposite east', 'Going back: reverse it'], says: ['How do we come back?', 'Use the north arrow.', 'West is the opposite of east.', 'Reverse every direction to come back.'] })),
  another(lines({ rows: ['School is north of the park', 'Park → school: go north', 'School → park: go south'], says: ['Try another.', 'A school and a park.', 'From the park, walk north.', 'Back again: walk south.'] })),
  remember(['Find north first.', 'Opposites: north–south, east–west.', 'Reverse to return.'], 'Find north first; reverse the directions to come back.')],
  { more: 'Then a park and a school: north there, south back.', more_zh: '看地图先找北：北和南相反，东和西相反。去的时候往北，回来就往南。' });

// ---- Statistics --------------------------------------------------------------------------------
D.S01 = deep(Y3.S01, [why(lines({ rows: ['Ask everyone the same question', 'Keep every answer', 'Repeats count too'], says: ['Fair data.', 'The same question for everyone.', 'Do not drop any answers.', 'Three children saying 1 means three answers.'] })),
  another(bars({ cats: [['0', 2], ['1', 3], ['2', 2], ['3', 1]], unit: 'children' })), remember(['Same question for all.', 'Keep every answer.', 'Sort to see the story.'], 'Ask the same question, keep every answer, then sort.')],
  { more: 'Then the same answers as a bar graph.', more_zh: '收集数据要问每个人同样的问题，每个回答都要保留。再把这些回答画成条形图：0 只 2 人、1 只 3 人、2 只 2 人、3 只 1 人。' });
D.S02 = deep(Y3.S02, [why(lines({ rows: ['Bar height = how many', 'Scale starts at 0', 'Tallest bar: most chosen'], says: ['How to read a bar graph.', 'The height shows the frequency.', 'Always start the scale at zero.', 'Dog is the most popular.'] })),
  another(bars({ cats: [['red', 4], ['blue', 6], ['green', 3]], unit: 'votes' })), remember(['One block per answer.', 'Height shows how many.', 'Start the scale at 0.'], 'Height shows how many; start the scale at zero.')],
  { more: 'Then a vote for colours: blue wins with 6.', more_zh: '条形图的高度表示有多少个，纵轴从 0 开始。再画一个颜色投票：红 4、蓝 6、绿 3，蓝色最多。' });
D.S03 = deep(Y3.S03, [why(lines({ rows: ['Children: 2 + 3 + 1 = 6', 'Teeth: 2 × 1 + 3 × 2 + 1 × 3', '= 2 + 6 + 3 = 11'], says: ['Two different totals.', 'Add the bar heights for children.', 'Multiply for teeth in each bar.', 'Add them up.'] })),
  another(lines({ rows: ['4 children have 1 pet', '2 children have 3 pets', 'Children: 4 + 2 = 6', 'Pets: 4 × 1 + 2 × 3 = 10'], says: ['Try another.', 'The first bar.', 'The second bar.', 'Count the children.', 'Count the pets.'] })),
  remember(['Bar height: how many people.', 'People × each one’s amount.', 'Then add.'], 'Bar height counts people; multiply by each amount, then add.')],
  { more: 'Then pets: 6 children have 10 pets.', more_zh: '看图要分清“人数”和“数量”：人数把高度加起来；总数要用“人数 × 每人的数量”再相加。再试：4 人各 1 只、2 人各 3 只，共 6 人、10 只。' });

export const DEEP3 = Object.fromEntries(Object.entries(D).map(([k, v]) => ['Y3-' + k, v]));
