// Year 5 longer lessons: each lesson's first animation, then why it works, try another and remember.
import { sequence, scene, clamp, R, C, L, P, T, G, RAW, numberLine, strip, sector, gridLines, polygon, pathOf } from './motion-kit.mjs';
import { range, why, another, remember, lines, jumps, rounding, fracSplit, clockMoves, bars, dots, hundred } from './deep-kit.mjs';
import { Y5 } from './motions-y5.mjs';
import { Y4, columnAdd } from './motions-y4.mjs';
import { balanceScene, areaScene } from './motions-y3.mjs';
import { drawFaces, prismFaces, project, drawCubes, wireBox, floorGrid, netFaces, cornersAndEdges, hex, LAYER_TONES } from './motion-3d.mjs';

const comma = v => v.toLocaleString('en-NZ');
function deep(base, parts, { title, intro, more = '', more_zh = '', w = 300, h = 210 } = {}) {
  const b = base.spec || base;
  return sequence({ title: title || b.title, intro: intro || `${b.intro} Then find out why, and try another.`, explain: `${b.explain} ${more}`.trim(), explain_zh: `${b.explain_zh}${more_zh}`, w, h, parts: [{ ...b, part: 'See it' }, ...parts] });
}

// ---- builders used only here ----------------------------------------------------------------------
function factorPairs(n, layouts) {
  const pos = ([r, c], i) => { const gap = Math.min(30, 250 / c); return [150 - (c - 1) * gap / 2 + (i % c) * gap, 70 - (r - 1) * 14 + Math.floor(i / c) * 28]; }, rad = Math.min(9, 250 / Math.max(...layouts.map(l => l[1])) * .42);
  return { items: [range(n).map(i => { const [x0, y0] = pos(layouts[0], i); return C(x0, y0, rad, 'mv-c1', { move: layouts.slice(1).map((l, k) => { const [x, y] = pos(l, i); return { at: k + 1, dx: x - x0, dy: y - y0 }; }) }); }),
    layouts.map(([r, c], k) => T(150, 168, `${r} × ${c} = ${n}`, 'mv-mid', { at: k, out: k + 1 })), T(150, 168, `Factor pairs of ${n}: ${layouts.slice().reverse().map(([r, c]) => `${r} × ${c}`).join(', ')}`, 'mv-mid', { at: layouts.length })],
  steps: [{ say: `${layouts[0][0]} rows of ${layouts[0][1]}.` }, ...layouts.slice(1).map(([r, c]) => ({ btn: 'Rearrange', say: `${r} row${r > 1 ? 's' : ''} of ${c}: still ${n}.` })), { btn: 'List the pairs', say: `Factor pairs of ${n}.` }] };
}
function areaModel(a, b) {
  const at = Math.floor(a / 10) * 10, ao = a % 10, bt = Math.floor(b / 10) * 10, bo = b % 10, u = Math.min(200 / a, 120 / b), x = 34, y = 30, sx = x + at * u, sy = y + bt * u;
  const box = (px, py, w, h, cls, lab, k) => G([R(px, py, w, h, cls), T(px + w / 2, py + h / 2 + 5, lab, w > 24 ? 'mv-mid' : 'mv-num')], { at: k });
  const parts = [at * bt, ao * bt, at * bo, ao * bo];
  return { w: 320, items: [R(x, y, a * u, b * u, 'mv-empty'), box(x, y, at * u, bt * u, 'mv-c3', String(parts[0]), 2), box(sx, y, ao * u, bt * u, 'mv-c2', String(parts[1]), 2), box(x, sy, at * u, bo * u, 'mv-c5', String(parts[2]), 2), box(sx, sy, ao * u, bo * u, 'mv-c4', String(parts[3]), 2),
    L(sx, y - 8, sx, y + b * u + 8, 'mv-dash', { at: 1 }), L(x - 8, sy, x + a * u + 8, sy, 'mv-dash', { at: 1 }), R(x, y, a * u, b * u, 'mv-frame'),
    T(x + at * u / 2, y - 10, String(at), 'mv-num', { at: 1 }), T(sx + ao * u / 2, y - 10, String(ao), 'mv-num', { at: 1 }), T(x - 14, y + bt * u / 2 + 4, String(bt), 'mv-num', { at: 1 }), T(x - 12, sy + bo * u / 2 + 4, String(bo), 'mv-num', { at: 1 }),
    T(150, y + b * u + 34, parts.join(' + '), 'mv-mid', { at: 2 }), T(150, y + b * u + 58, `= ${a * b}`, 'mv-mid', { at: 3 })], h: 215,
  steps: [{ say: `A ${a} by ${b} rectangle.` }, { btn: 'Split both sides', say: `${a} = ${at} + ${ao}, and ${b} = ${bt} + ${bo}.` }, { btn: 'Find each part', say: parts.join(', ') }, { btn: 'Add the parts', say: `${parts.join(' + ')} = ${a * b}` }] };
}
function gridCompare(n, m) { // n hundredths shaded, then compare with m hundredths (dashed)
  return { items: [hundred(30, 20, 16, [[0, Math.floor(n / 10) * 10, 'mv-c1', 1], [Math.floor(n / 10) * 10, n, 'mv-c2', 2]]), R(30, 20, Math.ceil(m / 10) * 16, 160, 'mv-dashbox', { at: 3 }),
    T(250, 60, `${Math.floor(n / 10)} tenths`, 'mv-mid', { at: 1 }), T(250, 86, `+ ${n % 10} hundredths`, 'mv-mid', { at: 2 }), T(250, 112, `= ${(n / 100).toFixed(2)}`, 'mv-mid', { at: 2 }), T(250, 150, `${(n / 100).toFixed(2)} ${n > m ? '>' : '<'} ${(m / 100).toFixed(2)}`, 'mv-mid', { at: 3 })], w: 320,
  steps: [{ say: '100 squares make one whole.' }, { btn: 'Shade the tenths', say: `${Math.floor(n / 10)} columns: ${Math.floor(n / 10)} tenths.` }, { btn: 'Shade the hundredths', say: `${n} hundredths = ${(n / 100).toFixed(2)}` }, { btn: `Compare with ${(m / 100).toFixed(1)}`, say: `${(m / 100).toFixed(1)} = ${(m / 100).toFixed(2)}, so ${(n / 100).toFixed(2)} ${n > m ? 'is more' : 'is less'}.` }] };
}
function partOf(total, d, n) {
  const each = total / d;
  return { items: [strip(30, 60, 240, 44, d, { splitAt: 1, shade: range(n).map(i => [i, 'mv-c1', 3]) }), T(150, 40, String(total), 'mv-mid', { out: 1 }), range(d).map(i => T(30 + (i + .5) * 240 / d, 88, String(each), 'mv-mid', { at: 2 })),
    T(150, 40, `${total} ÷ ${d} = ${each} in each part`, 'mv-mid', { at: 2, out: 3 }), T(150, 40, `${n}/${d} of ${total} = ${n} × ${each} = ${n * each}`, 'mv-mid', { at: 3 }), G([L(30, 118, 30 + n * 240 / d, 118, 'mv-arc'), T(30 + n * 120 / d, 136, String(n * each), 'mv-jl')], { at: 3 })],
  steps: [{ say: `The whole is ${total}.` }, { btn: `Cut into ${d} equal parts`, say: `${d} equal parts.` }, { btn: 'Find one part', say: `${total} ÷ ${d} = ${each}` }, { btn: `Take ${n} parts`, say: `${n} × ${each} = ${n * each}` }] };
}
export function scaleRead({ max, spaces, at, unit }) {
  const x0 = 40, x1 = 260, X = k => x0 + (x1 - x0) * k / spaces, each = max / spaces;
  return { items: [L(x0, 100, x1, 100, 'mv-axis'), range(spaces + 1).map(k => L(X(k), 88, X(k), 112, 'mv-tickl')), T(X(0), 132, `0 ${unit}`, 'mv-num', { hl: 1, hlOut: 2 }), T(X(spaces), 132, `${comma(max)} ${unit}`, 'mv-num', { hl: 1, hlOut: 2 }),
    range(spaces - 1).map(k => T(X(k + 1), 132, comma(each * (k + 1)), 'mv-small', { at: 2 })), P(`M${X(at)} 84 l-8 -16 l16 0 Z`, 'mv-redb', { at: 3 }),
    T(150, 40, `${comma(max)} ÷ ${spaces} = ${comma(each)} ${unit} per space`, 'mv-mid', { at: 2 }), T(150, 176, `${at} spaces = ${comma(at * each)} ${unit}`, 'mv-mid', { at: 3 })],
  steps: [{ say: 'A scale with only the ends labelled.' }, { btn: 'Read the labels', say: `0 and ${comma(max)} ${unit}.` }, { btn: 'Find one space', say: `${spaces} spaces share ${comma(max)}: ${comma(each)} each.` }, { btn: 'Read the pointer', say: `${at} spaces: ${comma(at * each)} ${unit}.` }] };
}
function protractor(deg) {
  const cx = 150, cy = 150, r = 100, pt = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)];
  return { items: [P(`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z`, 'mv-protractor'), range(19).map(i => { const a = i * 10, rad = a * Math.PI / 180, [x, y] = pt(a), [x2, y2] = [cx + (r - 10) * Math.cos(rad), cy - (r - 10) * Math.sin(rad)]; return [L(x, y, x2, y2, 'mv-tickl'), i % 3 === 0 ? T(cx + (r - 22) * Math.cos(rad), cy - (r - 22) * Math.sin(rad) + 4, String(a), 'mv-small') : []]; }),
    L(cx, cy, cx + r + 20, cy, 'mv-axis', { at: 1 }), C(cx, cy, 5, 'mv-pin', { hl: 1, hlOut: 2 }), G([L(cx, cy, cx + r + 20, cy, 'mv-mhand')], { at: 2, rot: { cx, cy, from: 0, keys: [{ at: 3, deg: -deg }] } }), T(150, 22, `${deg}°`, 'mv-mid', { at: 3 })], h: 175,
    steps: [{ say: 'A protractor.' }, { btn: 'Line it up', say: 'Centre on the corner; zero along one arm.' }, { btn: 'Start the second arm', say: 'Start at zero…' }, { btn: `Turn to ${deg}°`, say: `…and turn to ${deg}°. Draw the second arm there.` }] };
}

const D = {};
// ---- Number ------------------------------------------------------------------------------------
D.N01 = deep(Y5.N01, [why(lines({ rows: ['Each place is 10 × the next', '100,000 × 10 = 1,000,000', 'Read in groups of three:', '1 000 000 = one million'], says: ['The pattern keeps going.', 'Every place is ten times the place to its right.', 'So ten hundred-thousands make a million.', 'Big numbers are read in groups of three digits.', 'One million.'] })),
  another(lines({ rows: ['305,060 = ?', '300,000', '+ 5,000', '+ 60', 'Zeros keep the empty places'], says: ['Try another.', 'Read 305,060.', 'Three hundred thousand…', '…five thousand…', '…and sixty.', 'Zeros hold the empty places.'] })),
  remember(['Ten of a place = one of the next.', 'Read in groups of three.', 'Zeros hold empty places.'], 'Ten of a place make one of the next; zeros hold empty places.')],
  { more: 'Then read 305,060 = 300,000 + 5,000 + 60.', more_zh: '位值规律一直延续：每一位是右边一位的 10 倍。读大数三位一组。再读 305 060 = 300 000 + 5 000 + 60，中间的 0 占住空位。' });
D.N02 = deep(Y5.N02, [why(lines({ rows: ['Look at the next digit', '46,700: 7 hundreds ≥ 5 → up', '3.58: 5 tenths ≥ 5 → up'], says: ['A quick check.', 'Look one place to the right of where you round.', '7 is 5 or more: round up to 47,000.', '5 tenths: round up to 4.'] })),
  another(rounding({ min: 12000, max: 13000, every: 100, label: 500, v: 12350, to: 12000, half: 12500, fmt: comma })),
  remember(['Find the two neighbours.', 'Look at the next digit.', '5 or more: round up.'], 'Look at the next digit: 5 or more rounds up.')],
  { more: 'Then round 12,350 to 12,000.', more_zh: '快速取整：看要保留那一位右边的数字，5 或以上就进 1。再试 12 350 取整到千：百位是 3，比 5 小，所以约等于 12 000。' });
D.N03 = deep(Y5.N03, [why(lines({ rows: ['Below zero: negative', '−4 is 4 less than 0', '−4 °C is colder than 2 °C'], says: ['What do negative numbers mean?', 'Numbers below zero are negative.', '−4 is 4 steps below zero.', 'On a thermometer, lower is colder.'] })),
  another(jumps({ min: -10, max: 6, every: 1, label: 2, start: 3, hops: [{ to: -1, label: '−4', below: true, say: '3 − 4 = −1' }, { to: -5, label: '−4', below: true, say: '−1 − 4 = −5' }], end: 'It fell from 3 °C to −5 °C', startSay: 'It is 3 °C. It drops 4 degrees each hour.' })),
  remember(['Zero is neither + nor −.', 'Further left: smaller.', 'Count one step at a time.'], 'Zero is neither positive nor negative; further left is smaller.')],
  { more: 'Then a temperature falls from 3 °C to −5 °C.', more_zh: '比 0 小的数是负数，−4 表示比 0 少 4。数轴越往左越小，−5 比 −1 小。再试：气温 3 °C，每小时降 4 度：3 → −1 → −5。' });
D.N04 = deep(Y5.N04, [why(lines({ rows: ['8 + 7 = 15 ones', '= 1 ten + 5 ones', 'Every column works the same', 'Check: 4,225 − 1,757 = 2,468'], says: ['Why carry?', 'The ones make 15.', 'That is 1 ten and 5 ones.', 'Each column passes its extra ten along.', 'Check by subtracting.'] })),
  another(columnAdd({ a: 3594, b: 2638, title: '', intro: '', explain: '', explain_zh: '' })),
  remember(['Line up the places.', 'Start with the ones.', 'Ten of a place → one of the next.'], 'Line up the places, start with the ones, and exchange tens.')],
  { w: 330, more: 'Then 3,594 + 2,638 = 6,232.', more_zh: '每一列满 10 就向前进 1，各列都一样。再试 3 594 + 2 638 = 6 232：个位、十位、百位都要进位。' });
D.N05 = deep(Y5.N05, [why(lines({ rows: ['A factor divides exactly', '12 ÷ 5 = 2 r 2: not a factor', '12 ÷ 4 = 3: a factor'], says: ['What is a factor?', 'It divides with nothing left over.', '5 leaves a remainder.', '4 divides 12 exactly.'] })),
  another(factorPairs(18, [[3, 6], [2, 9], [1, 18]])), remember(['Factors divide exactly.', 'They come in pairs.', 'Rearrange the array to find them.'], 'Factors divide exactly and come in pairs.')],
  { more: 'Then 18: 1 × 18, 2 × 9, 3 × 6.', more_zh: '因数就是能把这个数整除、没有余数的数，而且成对出现。12 ÷ 5 有余数，5 不是 12 的因数。再找 18 的因数对：1×18、2×9、3×6。' });
D.N06 = deep(Y5.N06, [why(lines({ rows: ['23 × 14', '= (20 + 3) × (10 + 4)', '= 200 + 30 + 80 + 12', '= 322'], says: ['Why four parts?', 'Both numbers have tens and ones.', 'Every part of one multiplies every part of the other.', 'That makes four small products.', 'Add them.'] })),
  another(areaModel(24, 13)), remember(['Split both numbers.', 'Multiply every pair.', 'Add all the parts.'], 'Split both numbers, multiply every pair of parts, then add.')],
  { w: 320, h: 215, more: 'Then 24 × 13 = 200 + 40 + 60 + 12 = 312.', more_zh: '两位数乘两位数：两个数都拆成整十和个位，每两部分相乘得到四块，再相加。再试 24 × 13 = 200 + 40 + 60 + 12 = 312。' });
D.N07 = deep(Y5.N07, [why(lines({ rows: ['23 = 5 × 4 + 3', 'The remainder 3 is less than 4', 'Boats: round up to 6', 'Full packs: only 5'], says: ['What does the remainder mean?', '5 groups of 4, and 3 more.', 'A remainder is always less than the group size.', 'Everyone needs a seat: 6 boats.', 'But only 5 groups are full.'] })),
  another(lines({ rows: ['26 eggs, boxes of 6', '26 ÷ 6 = 4 r 2', '4 full boxes', '2 eggs left over'], says: ['Try another.', 'Pack 26 eggs.', 'Four sixes are 24, with 2 left.', 'Only full boxes count here.', 'The 2 extra eggs stay out.'] })),
  remember(['Remainder < group size.', 'The story decides:', 'round up, down, or keep it.'], 'The remainder is less than the group size; the story decides what to do with it.')],
  { more: 'Then 26 eggs in boxes of 6: 4 full boxes, 2 left.', more_zh: '余数一定比除数小。余数怎么处理看情境：坐船要多一条（进一），装满的盒子只算整盒（去掉）。再试：26 个鸡蛋每盒 6 个，装满 4 盒，剩 2 个。' });
D.N08 = deep(Y5.N08, [why(lines({ rows: ['1 column = 1 tenth', '= 10 hundredths', '0.4 = 0.40 = 40 hundredths', '35 < 40, so 0.35 < 0.4'], says: ['Why is 0.35 smaller than 0.4?', 'Each column is a tenth.', 'And a tenth is 10 hundredths.', 'So 0.4 is 40 hundredths.', '35 hundredths is less.'] })),
  another(gridCompare(62, 60)), remember(['Tenths, then hundredths.', 'Write both with two places.', 'Then compare.'], 'Write both decimals to hundredths, then compare.')],
  { w: 320, more: 'Then 0.62 is more than 0.6.', more_zh: '比较小数可以把位数补齐：0.4 = 0.40 = 40 个百分之一，比 35 个多，所以 0.35 < 0.4。再试 0.62 和 0.6：0.6 = 0.60，所以 0.62 更大。' });
D.N09 = deep(Y5.N09, [why(lines({ rows: ['Each place is 10 × the next', '× 10: every digit 1 place left', '÷ 100: every digit 2 places right'], says: ['Why do the digits move?', 'Place value goes up by ten each step.', 'Times ten makes each digit worth ten times more.', 'Dividing by 100 moves them two places the other way.'] })),
  another(lines({ rows: ['4.7 × 10 = 47', '47 ÷ 100 = 0.47', '0.47 × 100 = 47'], says: ['Try another.', 'One place left.', 'Two places right.', 'And back again.'] })),
  remember(['× 10: one place left.', '× 100: two places left.', '÷ moves right.'], 'Multiplying moves digits left; dividing moves them right.')],
  { more: 'Then 4.7 × 10 = 47 and 47 ÷ 100 = 0.47.', more_zh: '乘 10 数字向左移一位，乘 100 移两位；除法向右移。再试：4.7 × 10 = 47，47 ÷ 100 = 0.47，0.47 × 100 = 47。' });
D.N10 = deep(Y5.N10, [why(lines({ rows: ['2/3 = 6/9: × 3 top and bottom', 'Same denominator: compare tops', '5/3 = 3/3 + 2/3 = 1 2/3'], says: ['Why rename?', 'Splitting each third into 3 multiplies both numbers by 3.', 'Then the pieces match and we can compare.', 'Fractions over 1 are a whole and a bit.'] })),
  another(fracSplit({ n: 3, d: 4, k: 2 })), remember(['Multiply top and bottom', 'by the same number.', 'The amount stays the same.'], 'Multiply top and bottom by the same number; the amount stays the same.')],
  { more: 'Then 3/4 = 6/8.', more_zh: '等值分数：分子分母同时乘同一个数，大小不变。分母相同后才能直接比较。再试：3/4 每份再分 2 份，就是 6/8。' });
D.N11 = deep(Y5.N11, [why(lines({ rows: ['Add equal-sized parts only', '2/3 = 6/9', '6/9 + 1/9 = 7/9'], says: ['Why rename first?', 'Thirds and ninths are different sizes.', 'Make the thirds into ninths.', 'Now add the ninths.'] })),
  another(lines({ figure: [strip(30, 120, 240, 40, 4, { shade: [[0, 'mv-c1', 2], [1, 'mv-c1', 2], [2, 'mv-c2', 3]] })], rows: ['1/2 + 1/4', '1/2 = 2/4', '2/4 + 1/4 = 3/4'], says: ['Try another.', 'Halves and quarters.', 'A half is two quarters.', 'Add the quarters: 3/4.'] })),
  remember(['Make the pieces the same size.', 'Then add the numerators.', 'The denominator stays.'], 'Make the pieces the same size, then add the numerators.')],
  { more: 'Then 1/2 + 1/4 = 2/4 + 1/4 = 3/4.', more_zh: '分母不同时，先把一个分数改写成同样大小的份：2/3 = 6/9，再加 1/9 = 7/9。再试 1/2 + 1/4：1/2 = 2/4，2/4 + 1/4 = 3/4。' });
D.N12 = deep(Y5.N12, [why(lines({ rows: ['7 + 8 = 15 hundredths', '= 1 tenth + 5 hundredths', '4 + 2 + 1 = 7 tenths', '0.75'], says: ['Like column addition.', 'Add the hundredths.', 'Ten hundredths make a tenth.', 'Add the tenths with the extra one.', '0.75'] })),
  another(lines({ rows: ['0.36 + 0.45', '36 + 45 = 81 hundredths', '= 0.81', 'Check: 0.81 − 0.45 = 0.36'], says: ['Try another.', '0.36 + 0.45.', 'Count in hundredths.', 'Write it as a decimal.', 'Check by subtracting.'] })),
  remember(['Line up the decimal points.', 'Ten hundredths = one tenth.', 'Check by subtracting.'], 'Line up the points; ten hundredths make a tenth.')],
  { more: 'Then 0.36 + 0.45 = 0.81.', more_zh: '小数加法像整数一样按位加，满十进一：10 个百分之一 = 1 个十分之一。再试 0.36 + 0.45 = 0.81，用减法检查。' });
D.N13 = deep(Y5.N13, [why(lines({ rows: ['1/5 of 30 = 30 ÷ 5 = 6', '3/5 = 3 × 6 = 18', 'Back: 18 ÷ 3 = 6, 6 × 5 = 30'], says: ['Two steps.', 'Find one fifth first.', 'Then take three of them.', 'Reverse the steps to find the whole.'] })),
  another(partOf(24, 3, 2)), remember(['Divide by the denominator,', 'multiply by the numerator.', 'Reverse to find the whole.'], 'Divide by the denominator, then multiply by the numerator.')],
  { more: 'Then 2/3 of 24 = 16.', more_zh: '求几分之几：先除以分母求一份，再乘分子取几份。再试 24 的 2/3：24 ÷ 3 = 8，2 × 8 = 16。' });
D.N14 = deep(Y5.N14, [why(lines({ rows: ['25% = 25/100 = 1/4', '50% = 1/2, 10% = 1/10', '1/4 of 40 = 10'], says: ['Percent as fractions.', '25 out of 100 is a quarter.', 'Other easy ones: 50% is a half, 10% is a tenth.', 'A quarter of 40 is 10.'] })),
  another(lines({ figure: [strip(30, 120, 240, 36, 10, { shade: [[0, 'mv-c1', 1]] }), range(10).map(i => T(42 + i * 24, 143, '7', 'mv-num', { at: 2 }))], rows: ['10% of 70', '10% = 1/10', '70 ÷ 10 = 7'], says: ['Try another.', 'Ten percent of 70.', 'Ten percent is one tenth.', '70 shared into 10 parts: 7 each.'] })),
  remember(['% means out of 100.', '25% = 1/4, 50% = 1/2, 10% = 1/10.', 'Use the fraction to find it.'], 'Percent means out of 100; use the matching fraction.')],
  { more: 'Then 10% of 70 = 7.', more_zh: '百分数就是“每 100 份里有几份”。常用的：25% = 1/4，50% = 1/2，10% = 1/10。再试 70 的 10%：70 ÷ 10 = 7。' });
D.N15 = deep(Y5.N15, [why(lines({ rows: ['$5 + $3 = $8', '75c + 60c = 135c = $1.35', '$8 + $1.35 = $9.35'], says: ['Add dollars and cents.', 'Dollars first.', 'Cents next: 135 cents is $1.35.', 'Put them together.'] })),
  another(jumps({ min: 6, max: 10, every: .25, label: 1, start: 6.45, fmt: v => '$' + v, hops: [{ to: 6.5, label: '+5c', below: true, say: '$6.45 + 5c = $6.50' }, { to: 7, label: '+50c', below: true, say: '$6.50 + 50c = $7' }, { to: 10, label: '+$3', below: true, say: '$7 + $3 = $10' }], end: 'Change: $3.55', startSay: 'It costs $6.45. Pay with $10.' })),
  remember(['Add dollars, then cents.', '100 cents = $1.', 'Count up to find change.'], 'Add dollars then cents; count up to find change.')],
  { more: 'Then $6.45 paid with $10: change $3.55.', more_zh: '钱的加法：元和分分开加，100 分 = 1 元。找零从价格往上数：6.45 → 6.50（5 分）→ 7（50 分）→ 10（3 元），一共 3.55 元。' });

// ---- Algebra -----------------------------------------------------------------------------------
D.A01 = deep(Y5.A01, [why(lines({ rows: ['40 − ? = 24', '40 − 24 = 16', 'Check: 40 − 16 = 24 ✓'], says: ['Find it another way.', 'What was taken from 40?', 'The gap between 24 and 40.', 'Check.'] })),
  another(balanceScene({ left: '3 ×', right: '27', missing: '9', title: '', intro: '', explain: '', explain_zh: '', check: '3 × 9 = 27 ✓' })),
  remember(['= means the same value.', 'Use the inverse to find it.', 'Check by putting it back.'], 'Use the inverse operation, then check by putting it back.')],
  { more: 'Then 3 × ? = 27: 9.', more_zh: '求未知数用逆运算：40 − □ = 24，□ = 40 − 24 = 16。再试 3 × □ = 27：27 ÷ 3 = 9。' });
D.A02 = deep(Y5.A02, [why(lines({ rows: ['0, 1.5, 3, 4.5, 6', '+1.5 every time', 'Next: 7.5, 9'], says: ['Use the rule.', 'The pattern so far.', 'The same change each time.', 'Keep adding 1.5.'] })),
  another(jumps({ min: 0, max: 16, every: 1, label: 2, start: 1, hops: [2, 4, 8, 16].map(v => ({ to: v, label: '×2', say: `${v / 2} × 2 = ${v}` })), end: 'Rule: double each time', startSay: 'A multiplying pattern: start at 1.' })),
  remember(['Find the change.', 'Adding: equal jumps.', 'Multiplying: jumps grow.'], 'Adding rules make equal jumps; multiplying rules make growing jumps.')],
  { more: 'Then a doubling pattern: 1, 2, 4, 8, 16.', more_zh: '加法规律每一跳一样长（每次加 1.5）；乘法规律跳得越来越远（每次乘 2：1、2、4、8、16）。' });

// ---- Measurement -------------------------------------------------------------------------------
D.M01 = deep(Y5.M01, [why(lines({ rows: ['Read the labelled marks', 'Count the spaces between', '400 ÷ 8 = 50 per space'], says: ['How to read any scale.', 'Find two labelled marks.', 'Count the spaces between them.', 'Divide to find one space.'] })),
  another(scaleRead({ max: 1000, spaces: 4, at: 3, unit: 'g' })), remember(['Find two labels.', 'Count the spaces.', 'Divide: one space is worth…'], 'Find two labels, count the spaces, and divide.')],
  { more: 'Then a scale from 0 to 1,000 g in 4 spaces: 750 g.', more_zh: '读刻度三步：找两个标了数的刻度，数中间有几格，相除得每格多少。再试：0 到 1000 克分 4 格，每格 250 克，指针在第 3 格就是 750 克。' });
D.M02 = deep(Y5.M02, [why(lines({ rows: ['1 m = 100 cm', '2.35 m = 2 m and 35 cm', '235 cm ÷ 100 = 2.35 m'], says: ['Two ways to write it.', 'A metre is 100 cm.', 'The decimal part is centimetres.', 'Divide by 100 to change cm into m.'] })),
  another(lines({ rows: ['1 m 8 cm = ?', '= 100 cm + 8 cm = 108 cm', '= 1.08 m', '(not 1.8 m!)'], says: ['Try another.', 'One metre and eight centimetres.', 'In centimetres.', 'In metres.', 'Careful: 8 cm is 0.08 m.'] })),
  remember(['1 m = 100 cm.', 'cm → m: divide by 100.', '8 cm = 0.08 m.'], 'A metre is 100 cm; divide centimetres by 100 to get metres.')],
  { more: 'Then 1 m 8 cm = 108 cm = 1.08 m.', more_zh: '1 米 = 100 厘米，厘米换成米要除以 100。再试 1 米 8 厘米 = 108 厘米 = 1.08 米（不是 1.8 米，8 厘米是 0.08 米）。' });
D.M03 = deep(Y5.M03, [why(lines({ rows: ['Area: squares inside', 'Perimeter: the edge around', 'They can change separately'], says: ['Why are they different?', 'Area counts the inside.', 'Perimeter measures the boundary.', 'One can change while the other stays the same.'] })),
  another(areaScene({ cols: 4, rows: 4, title: '', intro: '', explain: '', explain_zh: '' })), remember(['Area: inside, in squares.', 'Perimeter: around, in lengths.', 'Same area ≠ same perimeter.'], 'Area counts squares inside; perimeter measures around.')],
  { more: 'Then a 4 by 4 square: area 16 and perimeter 16.', more_zh: '面积数里面的方格，周长量外面一圈，两个可以各自变化。再看 4 × 4 的正方形：面积 16，周长 4 + 4 + 4 + 4 = 16。' });
D.M04 = deep(Y5.M04, [why(lines({ rows: ['Whole squares first', 'Pair the halves', 'Group the small bits', 'It is an estimate'], says: ['A good method.', 'Count every whole square.', 'Two halves make one.', 'Little pieces make up a square together.', 'Say “about”.'] })),
  another(lines({ rows: ['4 whole squares', '3 halves ≈ 1.5', 'small bits ≈ 0.5', 'about 6 square units'], says: ['Try another.', 'Count the whole squares.', 'Three halves.', 'The small pieces.', 'About 6.'] })),
  remember(['Whole squares first.', 'Put parts together.', 'Say “about”.'], 'Count whole squares, put the parts together, and say about.')],
  { more: 'Then another shape: about 6 square units.', more_zh: '估测面积：先数整格，再把半格、零碎的拼成整格，最后说“大约”。再试：4 个整格 + 3 个半格（约 1.5）+ 零碎（约 0.5）≈ 6 平方单位。' });
// M05 · a cuboid built in layers from real cubes; the child can drag it to turn it (2026-11-11).
// 18 cubes fill a 3 × 2 × 3 box layer by layer, the layers pull apart, the picture turns once, then a new
// 4 × 2 × 2 box is filled with 16.
const TONE_HEX = LAYER_TONES.map(t => t.map(hex));
const fadeGroup = (inner, op) => (op > .01 ? `<g opacity="${op.toFixed(2)}">${inner}</g>` : '');
const arrive = (k, [at, j, m]) => { const gap = .5 / m; return clamp((clamp(k - at + 1) - j * gap) / (1 - (m - 1) * gap)); }; // step, place in the queue, queue length
function layerSolid() {
  const S = 38, cx = 160, cy = 150, oy = 1.5, A = [], B = [];
  for (let y = 0; y < 3; y++) for (let z = 0; z < 2; z++) for (let x = 0; x < 3; x++) A.push({ p: [x - 1, y + .5, z - .5], layer: y, born: y === 0 ? [1 + z, x, 3] : [2 + y, z * 3 + x, 6] });
  for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) for (let x = 0; x < 4; x++) B.push({ p: [x - 1.5, y + .5, z - .5], layer: y, born: [8 + y, z * 4 + x, 8] });
  const draw = (k, view) => {
    const apart = clamp(k - 4) - clamp(k - 6), gone = clamp((k - 7) * 2.2), apartB = clamp(k - 9) - clamp(k - 10);
    const v = { rx: view.rx, ry: view.ry + 360 * clamp(k - 5) }; // step 6 turns the picture once
    const kB = 7 + clamp((k - 7.45) / .55) + Math.max(0, k - 8); // the new box waits until the old cubes have gone
    const cubes = [...A.map(c => { const t = arrive(k, c.born); return { p: [c.p[0], c.p[1] + (1 - t) * 2.2 + c.layer * .6 * apart, c.p[2]], op: t * (1 - gone), tone: TONE_HEX[c.layer] }; }),
      ...B.map(c => { const t = arrive(c.layer ? k : kB, c.born); return { p: [c.p[0], c.p[1] + (1 - t) * 2.2 + c.layer * .8 * apartB, c.p[2]], op: t, tone: TONE_HEX[c.layer] }; })];
    const boxA = wireBox(3, 3, 2, v, S, cx, cy, oy), boxB = wireBox(4, 2, 2, v, S, cx, cy, oy);
    return fadeGroup(floorGrid(3, 2, v, S, cx, cy, oy) + boxA.back, 1 - gone) + fadeGroup(floorGrid(4, 2, v, S, cx, cy, oy) + boxB.back, gone)
      + drawCubes(cubes, v, S, cx, cy, oy) + fadeGroup(boxA.front, (1 - gone) * (1 - apart)) + fadeGroup(boxB.front, gone * (1 - apartB));
  };
  return { draw, view: { rx: -24, ry: -32 } };
}
const dragHint = T(160, 13, '↔ Drag the picture to turn it', 'mv-jl');
const noteAt = (at, y, rows) => [R(44, y, 232, 62, 'mv-note', { rx: 12, at }), rows.map((t, i) => T(160, y + 19 + i * 18, t, 'mv-num', { at }))];
const captions = (list, y) => list.map((c, i) => (c ? T(160, y, c, 'mv-mid', { at: i || undefined, out: i + 1 }) : []));
D.M05 = scene({ title: 'Volume comes in layers', w: 320, h: 300, ms: 1100, solid: layerSolid(),
  intro: 'Build a cuboid layer by layer, then try another size. Drag the picture to turn it and look from any side.',
  explain: 'Each layer has 3 × 2 = 6 cubes, so 3 layers make 18 cubic centimetres: length × width × height. A 4 × 2 × 2 cuboid has 2 layers of 8: 16.',
  explain_zh: '体积按层数：一层 3 × 2 = 6 个，3 层就是 18 立方厘米。再试 4 × 2 × 2：一层 8 个，2 层是 16 个。长 × 宽 × 高 就是这个意思。画面可以用手指或鼠标拖着转；把三层拉开的那一步转到侧面，可以看清每层都是 6 个。',
  items: [dragHint, captions(['3 long × 2 wide × 3 high', '1 row = 3 cubes', '1 layer = 3 × 2 = 6 cubes', '2 layers = 12 cubes', '3 layers = 18 cubes', '6 + 6 + 6', '3 layers of 6', '3 × 2 × 3 = 18 cm³', '1 layer = 4 × 2 = 8 cubes', '2 layers = 16 cubes', '4 × 2 × 2 = 16 cm³'], 254),
    noteAt(11, 232, ['Count one layer.', 'Multiply by the layers.', 'length × width × height'])],
  steps: [
    { part: 'See it', say: 'An empty box: 3 cm long, 2 cm wide and 3 cm high. Each cube is 1 cubic centimetre.' },
    { part: 'See it', btn: 'Put in a row', say: 'A row of 3 cubes.' },
    { part: 'See it', btn: 'Finish the layer', say: '2 rows of 3: one layer is 6 cubes.' },
    { part: 'See it', btn: 'Add a layer', say: 'Two layers: 6 + 6 = 12 cubes.' },
    { part: 'See it', btn: 'Add a layer', say: 'Three layers fill the box: 18 cubes.' },
    { part: 'Why it works', btn: 'Why does it work?', say: 'Pull the layers apart: three equal layers of 6.' },
    { part: 'Why it works', btn: 'Turn it round', say: 'Every layer is the same, all the way round.', ms: 3400 },
    { part: 'Why it works', btn: 'Put it back', say: '3 layers of 6: 6 × 3 = 18. That is length × width × height: 3 × 2 × 3.' },
    { part: 'Try another', btn: 'Try another', say: 'A new box: 4 long, 2 wide, 2 high. One layer is 4 × 2 = 8 cubes.', ms: 2200 },
    { part: 'Try another', btn: 'Add a layer', say: 'Two layers of 8: 16 cubes.' },
    { part: 'Try another', btn: 'Check the layers', say: 'Pull them apart: 8 and 8. 4 × 2 × 2 = 16 cubic centimetres.' },
    { part: 'Remember', btn: 'Remember', say: 'Count one layer, then multiply by the number of layers: length × width × height.' },
  ] });
D.M06 = deep(Y5.M06, [why(lines({ rows: ['Right angle: 90°', 'Acute: less than 90°', 'Obtuse: 90° to 180°', 'Reflex: more than 180°'], says: ['Compare with a right angle.', 'A square corner.', 'Smaller: acute.', 'Bigger, up to a straight line: obtuse.', 'Past a straight line: reflex.'] })),
  another(protractor(70)), remember(['Compare with 90° and 180°.', 'Centre on the corner.', 'Start from zero.'], 'Compare with 90° and 180°; measure from zero with the centre on the corner.')],
  { more: 'Then draw 70° with a protractor.', more_zh: '角的大小先和直角（90°）、平角（180°）比：锐角 < 90°，钝角在 90° 和 180° 之间，优角 > 180°。用量角器：中心对准顶点，0 刻度对准一条边，找到 70° 画另一条边。' });
D.M07 = deep(Y5.M07, [why(lines({ rows: ['pm: add 12 to the hour', '4:45 pm → 16:45', '9:30 am stays 09:30'], says: ['Why add 12?', 'Afternoon hours come after 12.', '4 + 12 = 16.', 'Morning times keep their hour.'] })),
  another(clockMoves({ times: [[9, 50, 'start 9:50'], [10, 0, '+10 min → 10:00', 'Move to 10:00'], [10, 25, '+25 min → 10:25', 'Move to 10:25']], summary: '35 minutes' })),
  remember(['pm: hour + 12.', 'Jump to the next hour,', 'then on to the end.'], 'Add 12 for pm times; for elapsed time, jump to the hour first.')],
  { more: 'Then 9:50 to 10:25: 10 + 25 = 35 minutes.', more_zh: '24 小时制：下午的小时加 12（下午 4:45 = 16:45），上午不变。经过时间先跳到整点：9:50 → 10:00 是 10 分钟，再到 10:25 是 25 分钟，共 35 分钟。' });

// ---- Geometry ----------------------------------------------------------------------------------
D.G01 = deep(Y5.G01, [why(lines({ rows: ['Parallel: same distance,', 'never meet', 'Perpendicular: meet at 90°', 'Test with a paper corner'], says: ['How to check.', 'Parallel lines keep the same gap…', '…so they never meet.', 'Perpendicular lines make a square corner.', 'A paper corner is a right angle.'] })),
  another(lines({ figure: [L(30, 50, 30, 150, 'mv-axis'), L(30, 150, 80, 150, 'mv-axis'), P('M30 136 L44 136 L44 150', 'mv-frame'), L(105, 50, 105, 150, 'mv-axis'), L(150, 50, 150, 150, 'mv-axis'), L(105, 100, 150, 100, 'mv-axis'), T(55, 176, 'L', 'mv-mid'), T(128, 176, 'H', 'mv-mid')], x: 228, y: 70, rows: ['L: right angle', 'H: parallel sides', '+ perpendicular bar'], says: ['In letters:', 'L has a right angle.', 'H has two parallel sides…', '…joined by a perpendicular bar.'] })),
  remember(['Parallel: never meet.', 'Perpendicular: right angle.', 'Rectangles have both.'], 'Parallel lines never meet; perpendicular lines meet at a right angle.')],
  { more: 'Then find them in the letters L and H.', more_zh: '平行：距离处处相等、永不相交；垂直：相交成直角，可以用纸角检查。再在字母里找：L 有垂直，H 有两条平行边和一条垂直的横杠。' });
// G02 · nets that really fold, and can be dragged round (2026-11-11): a triangular-prism net, then two
// arrangements of six squares: the cross folds into a cube, the other puts two faces on the same side.
function netSolid() {
  const cx = 160, cy = 138, CROSS = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], BAD = [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1], [2, 1]]; // the two extra squares both fold onto the front; the back stays open
  const FOLD = [0, .4, .75, 1], whole = cornersAndEdges(prismFaces(1));
  const draw = (k, view) => {
    const i = Math.min(3, Math.floor(k)), tP = k >= 3 ? 1 : FOLD[i] + (FOLD[i + 1] - FOLD[i]) * (k - i);
    const prismOn = 1 - clamp(k - 6) + clamp(k - 10), crossOn = clamp(k - 6) - clamp(k - 8), badOn = clamp(k - 8) - clamp(k - 10);
    const edgesOn = clamp(k - 4) - clamp(k - 5), cornersOn = clamp(k - 5) - clamp(k - 6);
    const v = { rx: view.rx, ry: view.ry + 360 * clamp(k - 3) }, at = p => project(p, v, 50, cx, cy); // step 4 turns the prism once
    const edges = whole.edges.map(([a, b]) => { const p = at(a), q = at(b); return `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" class="mv-edgehl"/>`; }).join('');
    const corners = whole.corners.map(a => { const p = at(a); return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="6" class="mv-cornerhl"/>`; }).join('');
    return fadeGroup(drawFaces(prismFaces(tP), v, 50, cx, cy) + fadeGroup(edges, edgesOn) + fadeGroup(corners, cornersOn), prismOn)
      + fadeGroup(drawFaces(netFaces(CROSS, 2, clamp(k - 7)), v, 40, cx, cy + 22), crossOn)
      + fadeGroup(drawFaces(netFaces(BAD, 1, clamp((k - 9) * 2.5), n => (n >= 4 ? 'mv-netface clash' : 'mv-netface')), { rx: v.rx, ry: v.ry + 360 * clamp((k - 9.4) / .6) }, 40, cx, cy + 22), badOn); // folds, then turns once
  };
  return { draw, view: { rx: -50, ry: -35 } };
}
D.G02 = scene({ title: 'Fold the net', w: 320, h: 290, ms: 1200, solid: netSolid(),
  intro: 'Fold a prism net, count its parts, then test two nets of six squares. Drag the picture to turn it.',
  explain: 'Three rectangles and two triangles fold into a triangular prism: 5 faces, 9 edges, 6 vertices. Six squares make a cube only when they are arranged so no faces overlap.',
  explain_zh: '3 个长方形和 2 个三角形折成三棱柱：5 个面、9 条棱、6 个顶点。6 个正方形不一定能折成正方体，要看排列：十字形可以；另一种排法折起来有两个面叠在同一侧（红色的两块），对面却空着，不行。画面可以用手指或鼠标拖着转，折到一半时转一转最容易看明白。',
  items: [dragHint, captions(['3 rectangles + 2 triangles', 'the sides lift', 'the triangles swing in', 'a triangular prism', '5 faces', '9 edges', '6 vertices', 'six squares in a cross', 'a cube ✓', 'six squares again', 'two faces overlap ✗'], 250),
    noteAt(11, 222, ['A prism has two matching ends.', 'Count faces, edges, vertices.', 'Net positions matter.'])],
  steps: [
    { part: 'See it', say: 'A flat net: 3 rectangles and 2 triangles.' },
    { part: 'See it', btn: 'Fold a little', say: 'The sides start to lift.' },
    { part: 'See it', btn: 'Fold more', say: 'The rectangles make a tunnel and the triangles swing in.' },
    { part: 'See it', btn: 'Finish', say: 'A triangular prism: two matching triangle ends joined by 3 rectangles.' },
    { part: 'Why it works', btn: 'Count its parts', say: 'Turn it round and count the faces: 2 triangles + 3 rectangles = 5.', ms: 3400 },
    { part: 'Why it works', btn: 'Count the edges', say: '3 edges on each end and 3 along the length: 9 edges.' },
    { part: 'Why it works', btn: 'Count the corners', say: '3 corners at each end: 6 vertices.' },
    { part: 'Try another', btn: 'Try another', say: 'Six squares in a cross. Will they fold into a cube?' },
    { part: 'Try another', btn: 'Fold it', say: 'Yes: every face finds its own place.', ms: 2000 },
    { part: 'Try another', btn: 'Try this one', say: 'Another six squares, in a different arrangement.' },
    { part: 'Try another', btn: 'Fold it', say: 'Two squares land on the same side and one side stays open: not a cube net.', ms: 4200 },
    { part: 'Remember', btn: 'Remember', say: 'A prism has two matching ends; how a net is arranged matters.' },
  ] });
D.G03 = deep(Y4.G04, [why(lines({ rows: ['Slide: same way up', 'Flip: a mirror image', 'Turn: about one fixed point', 'Size and shape stay the same'], says: ['Tell them apart.', 'A slide does not turn the shape.', 'A flip makes a mirror image.', 'A turn spins it about a point.', 'None of them change the size.'] })),
  another(lines({ rows: ['Same way up, moved? → slide', 'Mirror image? → flip', 'Turned round? → turn'], says: ['Which move was it?', 'Ask three questions.', 'Is it a mirror image?', 'Is it turned?'] })),
  remember(['Translation: slide.', 'Reflection: flip.', 'Rotation: turn.'], 'Translation slides, reflection flips, rotation turns; the shape stays the same size.')],
  { title: 'Slide, flip and turn', intro: 'Move the triangle three ways, then learn to tell them apart.', more: 'Then three questions tell the moves apart.', more_zh: '分辨三种变换：方向不变只是移动是平移；成镜像是翻折（轴对称）；转了方向是旋转。三种变换都不改变大小和形状。' });
D.G04 = deep(Y5.G04, [why(lines({ rows: ['Letter: row, number: column', 'East right, south down', 'Coming back: reverse it'], says: ['Reading a grid map.', 'Squares are named row then column.', 'Directions follow the north arrow.', 'Reverse every move to return.'] })),
  another(lines({ rows: ['C2 → 3 east → C5', 'C5 → 2 north → A5', 'Back: 2 south, 3 west'], says: ['Try another.', 'Three squares east.', 'Two squares north.', 'Reverse the moves to get back.'] })),
  remember(['Row letter, column number.', 'Follow the north arrow.', 'Reverse to return.'], 'Name squares by row and column; reverse the moves to come back.')],
  { more: 'Then C2 to A5 and back.', more_zh: '方格地图：先读行字母再读列数字，方向看北箭头。再试：C2 向东 3 格到 C5，再向北 2 格到 A5；回来就向南 2 格、向西 3 格。' });

// ---- Statistics and probability ------------------------------------------------------------------
D.S01 = deep(Y5.S01, [why(lines({ rows: ['Every value fits one group', '4.9 belongs to 4.0–4.9', 'Counts add back to 6'], says: ['Clear boundaries.', 'Groups must not overlap.', 'Edge values belong to one group only.', 'Nothing is lost.'] })),
  another(bars({ cats: [['120–129', 3], ['130–139', 5], ['140–149', 2]], unit: 'children' })), remember(['Measure the same way.', 'Groups do not overlap.', 'Counts add to the total.'], 'Groups have clear, non-overlapping boundaries; counts add to the total.')],
  { more: 'Then children’s heights in groups: 3, 5 and 2.', more_zh: '分组的边界要清楚、不能重叠，每个数据只属于一组，各组个数加起来等于总数。再看身高分组：120–129 厘米 3 人，130–139 厘米 5 人，140–149 厘米 2 人。' });
D.S02 = deep(Y5.S02, [why(lines({ rows: ['Two answers per child', 'Count each combination', 'Side by side, with a key'], says: ['Two-way data.', 'Room and travel stay together.', 'Count walk-Room 1, walk-Room 2, …', 'Bars side by side compare the rooms.'] })),
  another(bars({ cats: [['bus R1', 3], ['bus R2', 5], ['car R1', 4], ['car R2', 2]], unit: 'children' })), remember(['Keep both answers together.', 'Count every pair.', 'Use a key for colours.'], 'Keep both answers together, count every pair, and use a key.')],
  { more: 'Then bus and car for each room.', more_zh: '双分类数据：每个人的两个信息放在一起记，按组合分别计数，并排画并用图例区分。再看坐公交和坐车：1 班 3 人和 4 人，2 班 5 人和 2 人。' });
D.S03 = deep(Y5.S03, [why(lines({ rows: ['Most common: tallest stack', 'Middle: the centre value', 'Range: smallest to largest'], says: ['Three ways to describe data.', 'Where most dots are.', 'The value in the middle when in order.', 'How spread out it is.'] })),
  another(dots({ vals: [5, 6, 6, 7, 7, 7, 8, 9], label: 'minutes to walk to school', highlight: v => v === 7 })),
  remember(['Most common, middle, range.', 'Only describe what was measured.', 'It is about this group.'], 'Describe the most common, the middle and the range of what was measured.')],
  { more: 'Then walking times: most common and middle 7 minutes, range 5 to 9.', more_zh: '描述数据：最多的值、中间的值、范围。只说测量到的，不编造。再看走路上学的时间：最多是 7 分钟，中间也是 7 分钟，范围 5 到 9 分钟。' });
D.P01 = deep(Y5.P01, [why(lines({ rows: ['chance = ways it can happen', '÷ all the ways', 'green 3/10 + gold 7/10 = 1'], says: ['How we write chance.', 'Count the ways it can happen…', '…out of all equally likely ways.', 'All the outcomes together make 1.'] })),
  another(lines({ figure: [range(10).map(i => C(30 + i * 24, 150, 9, i < 5 ? 'mv-c4' : 'mv-c5'))], rows: ['5 red, 5 blue', 'red: 5/10 = 1/2', 'even chance'], says: ['Try another.', 'Ten counters.', 'Half are red.', 'Exactly in the middle of the chance scale.'] })),
  remember(['0: impossible, 1: certain.', 'Count favourable ÷ all.', 'All outcomes add to 1.'], 'Chance runs from 0 to 1; count the favourable ways out of all the ways.')],
  { more: 'Then 5 red and 5 blue: an even chance, 1/2.', more_zh: '可能性 = 满足条件的情况 ÷ 所有同样可能的情况，从 0（不可能）到 1（一定）。再试：5 红 5 蓝，摸到红色是 5/10 = 1/2，一半一半。' });
D.P02 = deep(Y5.P02, [why(lines({ rows: ['6 equally likely outcomes', 'even: 2, 4, 6 = 3/6 = 1/2', 'More rolls: closer to 1/2'], says: ['Model and experiment.', 'A fair die gives each number the same chance.', 'Half of the outcomes are even.', 'Many rolls usually get closer to the model.'] })),
  another(lines({ figure: [sector(80, 110, 60, 0, 90, 'mv-c4'), sector(80, 110, 60, 90, 360, 'mv-c5'), L(80, 110, 80, 50, 'mv-axis')], x: 220, rows: ['4 equal parts', 'red: 1 of 4 = 1/4', 'blue: 3/4'], says: ['Try a spinner.', 'Four equal parts.', 'One part is red.', 'Three parts are blue.'] })),
  remember(['List the outcomes.', 'Equally likely? Count them.', 'Experiments vary.'], 'List equally likely outcomes and count; real results vary.')],
  { more: 'Then a spinner: red 1/4, blue 3/4.', more_zh: '概率模型：列出所有同样可能的结果再数。骰子双数是 3/6 = 1/2；实际掷的结果会有波动。再看转盘：4 等份中 1 份红，转到红色的可能性是 1/4，蓝色 3/4。' });

export const DEEP5 = Object.fromEntries(Object.entries(D).map(([k, v]) => ['Y5-' + k, v]));
