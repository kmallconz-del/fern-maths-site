// Year 4 longer lessons: each lesson's first animation, then why it works, try another and remember.
import { sequence, scene, clamp, R, C, L, P, T, G, RAW, polygon, pathOf, sector } from './motion-kit.mjs';
import { range, why, another, remember, lines, jumps, rounding, columnSub, arrayRows, fracCompare, fracSplit, clockMoves, dots } from './deep-kit.mjs';
import { Y4, columnAdd } from './motions-y4.mjs';
import { partScene, balanceScene, perimeterScene, areaScene, polygonScene } from './motions-y3.mjs';
import { compareNums } from './deep-y3.mjs';
import { scaleRead } from './deep-y5.mjs';
import { drawCubes, wireBox, floorGrid, mix, hex, LAYER_TONES } from './motion-3d.mjs';

function deep(base, parts, { title, intro, more = '', more_zh = '', w = 300, h = 210 } = {}) {
  const b = base.spec || base;
  return sequence({ title: title || b.title, intro: intro || `${b.intro} Then find out why, and try another.`, explain: `${b.explain} ${more}`.trim(), explain_zh: `${b.explain_zh}${more_zh}`, w, h, parts: [{ ...b, part: 'See it' }, ...parts] });
}
const thirds = v => { const n = Math.round(v * 3); return n === 0 ? '0' : n % 3 === 0 ? String(n / 3) : `${n}/3`; };

const D = {};
// ---- Number ------------------------------------------------------------------------------------
D.N01 = deep(Y4.N01, [why(lines({ rows: ['3048 = 3000 + 0 + 40 + 8', 'The 0 holds the hundreds', 'Compare thousands first: 3 > 2'], says: ['Read the places.', 'Each digit names its place value.', 'No hundreds, but the place is kept.', 'The biggest place decides first.'] })),
  another(compareNums(5207, 5270)), remember(['Each place is 10 × the next.', 'Zeros hold empty places.', 'Compare from the left.'], 'Each place is ten times the next; compare from the left.')],
  { more: 'Then compare 5207 and 5270.', more_zh: '3048 = 3000 + 0 + 40 + 8，百位的 0 占住位置。比较从千位开始。再比较 5207 和 5270：千位、百位都一样，十位 0 < 7，所以 5207 < 5270。' });
D.N02 = deep(Y4.N02, [why(lines({ rows: ['364 → 400 (past 350)', '218 → 200 (before 250)', 'Estimate 600, exact 582'], says: ['Why does it work?', '364 is past halfway.', '218 is before halfway.', 'The estimate is close, so 582 is sensible.'] })),
  another(rounding({ min: 700, max: 800, every: 10, label: 50, v: 756, to: 800, half: 750 })), remember(['Neighbours and halfway.', 'Round, then add.', 'Estimate checks the exact answer.'], 'Round with the neighbours and halfway; estimates check answers.')],
  { more: 'Then round 756 to 800.', more_zh: '取整看是否过了中点：364 过了 350，约 400；218 没到 250，约 200。估算 600 和精确 582 接近。再试 756：过了 750，约等于 800。' });
D.N03 = deep(Y4.N03, [why(lines({ rows: ['20, 25, 30, 35, 40', '+5 each time', 'Back: −5 each time'], says: ['The rule.', 'Counting in fives from 20.', 'The jump never changes.', 'Counting back undoes it.'] })),
  another(jumps({ min: 0, max: 100, every: 5, label: 25, start: 0, hops: [25, 50, 75, 100].map(v => ({ to: v, label: '+25', say: `${v - 25} + 25 = ${v}` })), end: '0, 25, 50, 75, 100', startSay: 'Now count in twenty-fives.' })),
  remember(['Keep the same jump.', 'Forward adds, back subtracts.', '4 × 25 = 100'], 'Keep the same jump: forward adds, back subtracts.')],
  { more: 'Then count in twenty-fives to 100.', more_zh: '按 5 数：每次加 5，倒着数每次减 5。再按 25 数：0、25、50、75、100，4 个 25 是 100。' });
D.N04 = deep(Y4.N04, [why(lines({ rows: ['13 ones = 1 ten + 3 ones', '12 tens = 1 hundred + 2 tens', '10 hundreds = 1 thousand'], says: ['Why so many exchanges?', 'The ones make 13.', 'The tens make 12.', 'The hundreds make 10.'] })),
  another(columnAdd({ a: 4579, b: 2846, title: '', intro: '', explain: '', explain_zh: '' })), remember(['Line up the places.', 'Start with the ones.', 'Ten of a place → one of the next.'], 'Line up places, start with the ones, exchange tens.')],
  { w: 330, more: 'Then 4579 + 2846 = 7425.', more_zh: '每一列满 10 就向前进 1：13 个一 = 1 个十 + 3 个一，12 个十 = 1 个百 + 2 个十，10 个百 = 1 个千。再试 4579 + 2846 = 7425。' });
D.N05 = deep(Y4.N05, [why(lines({ rows: ['4023 = 3 Th 9 H 11 T 13 O', 'Still 4023', 'Now every column can subtract'], says: ['Why rename first?', 'Exchange down from the thousands.', 'The value has not changed.', 'Each top digit is now big enough.'] })),
  another(columnSub({ a: 5002, b: 1867 })), remember(['Not enough? Exchange.', 'Across zeros: keep going left.', 'Check by adding.'], 'Exchange from the next place, across zeros if needed; check by adding.')],
  { more: 'Then 5002 − 1867 = 3135.', more_zh: '中间有 0 时要一路往左借：4023 改写成 3 个千、9 个百、11 个十、13 个一，总数不变。再试 5002 − 1867 = 3135，用加法检查。' });
D.N06 = deep(Y4.N06, [why(lines({ rows: ['4 × 6 = 24', '24 ÷ 4 = 6 and 24 ÷ 6 = 4', '4 × 60 = 240 (ten times)'], says: ['One picture, many facts.', 'Rows times columns.', 'Division undoes it both ways.', 'Ten times as many in each group.'] })),
  another(arrayRows({ rows: 3, cols: 7 })), remember(['Arrays show × and ÷.', 'Facts come in families.', '× 10: ten times bigger.'], 'An array shows a family of multiplication and division facts.')],
  { more: 'Then 3 rows of 7 = 21, so 21 ÷ 3 = 7.', more_zh: '一个阵列能写出一组事实：4 × 6 = 24，24 ÷ 4 = 6，24 ÷ 6 = 4；每个变成 10 倍就是 4 × 60 = 240。再试 3 行 7 个：3 × 7 = 21。' });
D.N07 = deep(Y4.N07, [why(lines({ rows: ['3 × 124', '= 3 × 100 + 3 × 20 + 3 × 4', '= 300 + 60 + 12', '= 372'], says: ['Why split?', 'Multiply 124 three times.', 'Multiply each place.', 'Then add.', '372'] })),
  another(lines({ rows: ['4 × 213', '= 4 × 200 + 4 × 10 + 4 × 3', '= 800 + 40 + 12', '= 852'], says: ['Try another.', 'Four groups of 213.', 'Split by place value.', 'Multiply each part.', 'Add: 852.'] })),
  remember(['Split by place value.', 'Multiply every part.', 'Add the parts.'], 'Split by place value, multiply each part, then add.')],
  { more: 'Then 4 × 213 = 800 + 40 + 12 = 852.', more_zh: '三位数乘一位数：按位拆开分别乘再相加。再试 4 × 213 = 800 + 40 + 12 = 852。' });
D.N08 = deep(Y4.N08, [why(lines({ rows: ['156 = 150 + 6', '150 ÷ 3 = 50, 6 ÷ 3 = 2', '50 + 2 = 52', 'Check: 52 × 3 = 156 ✓'], says: ['Why those parts?', 'Pick parts that share easily.', 'Share each part.', 'Join the shares.', 'Check by multiplying.'] })),
  another(lines({ rows: ['184 ÷ 4', '= 160 ÷ 4 + 24 ÷ 4', '= 40 + 6 = 46', 'Check: 46 × 4 = 184 ✓'], says: ['Try another.', 'Share 184 into 4.', 'Split into easy parts.', 'Share each and join.', 'Check.'] })),
  remember(['Split into easy parts.', 'Share each part.', 'Check by multiplying.'], 'Split into parts that share easily, then check by multiplying.')],
  { more: 'Then 184 ÷ 4 = 40 + 6 = 46.', more_zh: '除法拆成好分的部分：156 = 150 + 6，150 ÷ 3 = 50，6 ÷ 3 = 2，合起来 52。再试 184 ÷ 4 = 160 ÷ 4 + 24 ÷ 4 = 46。' });
D.N09 = deep(Y4.N09, [why(lines({ rows: ['10 tenths = 1 whole', '13 tenths = 1.3', '× 10: each tenth → one whole'], says: ['Why 1.3?', 'Ten tenths fill a whole.', 'Thirteen is a whole and three more.', 'Times ten makes every tenth a whole: 13.'] })),
  another(lines({ rows: ['0.7 = 7 tenths', '1.7 = 17 tenths', '1.7 × 10 = 17'], says: ['Try another.', 'Seven tenths.', 'A whole and seven tenths.', 'Times ten.'] })),
  remember(['10 tenths = 1.', 'The point separates wholes and tenths.', '× 10: one place left.'], 'Ten tenths make one; times ten moves digits one place left.')],
  { more: 'Then 1.7 = 17 tenths and 1.7 × 10 = 17.', more_zh: '10 个 0.1 是 1，13 个 0.1 是 1.3。乘 10，每个十分之一变成 1。再试：1.7 = 17 个十分之一，1.7 × 10 = 17。' });
D.N10 = deep(Y4.N10, [why(lines({ rows: ['Same denominator: count', 'Same numerator: bigger pieces win', '2/3 > 2/5'], says: ['Two kinds of comparing.', 'Equal pieces: more pieces is more.', 'Equal counts: bigger pieces is more.', 'Thirds are bigger than fifths.'] })),
  another(fracCompare({ a: [3, 4], b: [3, 8], why: 'Quarters are bigger than eighths.' })), remember(['Same bottom: compare tops.', 'Same top: smaller bottom wins.', 'Wholes must be equal.'], 'Same denominator: compare numerators; same numerator: bigger pieces win.')],
  { more: 'Then 3/4 > 3/8.', more_zh: '分母相同比分子；分子相同时，分母小的每份大，分数就大。再比较 3/4 和 3/8：3/4 更大。' });
D.N11 = deep(Y4.N11, [why(lines({ rows: ['Split every piece in 2', '1/2 = 2/4 = 4/8', '× 2 top and bottom'], says: ['Why equal?', 'More pieces, same shaded amount.', 'Three names for one amount.', 'Both numbers double each time.'] })),
  another(fracSplit({ n: 1, d: 3, k: 3 })), remember(['Split every piece the same.', 'Top and bottom × the same.', 'The amount stays.'], 'Multiply top and bottom by the same number; the amount stays.')],
  { more: 'Then 1/3 = 3/9.', more_zh: '每一份再平分，份数变多，涂色总量不变：1/2 = 2/4 = 4/8，分子分母同时乘 2。再试 1/3 每份分 3 份 = 3/9。' });
D.N12 = deep(Y4.N12, [why(lines({ rows: ['4 quarters = 1 whole', '7 = 4 + 3', '7/4 = 1 3/4'], says: ['Why 1 3/4?', 'Four quarter-steps reach 1.', 'Seven is four and three more.', 'One whole and three quarters.'] })),
  another(jumps({ min: 0, max: 2, every: 1 / 3, label: 1 / 3, fmt: thirds, start: 0, hops: [1, 2, 3, 4, 5].map(k => ({ to: k / 3, label: '', say: `${k} third${k > 1 ? 's' : ''}${k === 3 ? ' = 1 whole' : ''}` })), end: '5/3 = 1 2/3', startSay: 'Now take steps of one third.', x0: 30, x1: 270 })),
  remember(['Count equal steps.', 'Every full set makes 1.', 'Improper = mixed number.'], 'Count equal steps; every full set of pieces makes one whole.')],
  { more: 'Then 5/3 = 1 2/3.', more_zh: '假分数和带分数：4 个四分之一是 1，7/4 = 1又3/4。再走 5 个三分之一：3 个到 1，再 2 个，5/3 = 1又2/3。' });
D.N13 = deep(Y4.N13, [why(lines({ rows: ['3 + 6 = 9 eighths', '8 eighths = 1 whole', '9/8 = 1 1/8'], says: ['Crossing a whole.', 'Count the eighths.', 'Eight of them fill one whole.', 'One whole and one eighth.'] })),
  another(lines({ rows: ['5/6 + 4/6', '= 9/6', '6/6 = 1 whole', '9/6 = 1 3/6'], says: ['Try another.', 'Sixths this time.', 'Count the sixths.', 'Six sixths make a whole.', 'One whole and three sixths.'] })),
  remember(['Same pieces: add the tops.', 'A full set = 1 whole.', 'Check by subtracting.'], 'Add the numerators; every full set makes a whole.')],
  { more: 'Then 5/6 + 4/6 = 9/6 = 1 3/6.', more_zh: '同分母相加超过 1：3/8 + 6/8 = 9/8，满 8 份是 1，所以是 1又1/8。再试 5/6 + 4/6 = 9/6 = 1又3/6。' });
D.N14 = deep(Y4.N14, [why(lines({ rows: ['13 tenths + 8 tenths', '= 21 tenths', '10 tenths = 1', '21 tenths = 2.1'], says: ['Why 2.1?', 'Count in tenths.', 'Twenty-one tenths.', 'Every ten tenths make one.', '2.1'] })),
  another(lines({ rows: ['2.6 + 1.7', '26 + 17 = 43 tenths', '= 4.3', 'Check: 4.3 − 1.7 = 2.6'], says: ['Try another.', 'Add the decimals.', 'Count in tenths.', 'Write it back as a decimal.', 'Check by subtracting.'] })),
  remember(['Line up the points.', '10 tenths = 1.', 'Check by subtracting.'], 'Line up the points; ten tenths make one.')],
  { more: 'Then 2.6 + 1.7 = 4.3.', more_zh: '一位小数加法：看成十分之几来加，满 10 个十分之一进 1。再试 2.6 + 1.7 = 43 个十分之一 = 4.3。' });
D.N15 = deep(Y4.N15, [why(lines({ rows: ['Double: every amount × 2', '3 oats : 2 fruit stays', 'Halve: every amount ÷ 2'], says: ['Keep it fair.', 'Scale every ingredient.', 'The balance between them stays the same.', 'Halving undoes doubling.'] })),
  another(lines({ rows: ['Triple the recipe', '30 g × 3 = 90 g oats', '20 g × 3 = 60 g fruit', 'still 3 : 2'], says: ['Try another.', 'Three batches.', 'Oats.', 'Fruit.', 'The relationship stays.'] })),
  remember(['Scale every amount.', 'Use the same number.', 'The relationship stays.'], 'Scale every amount by the same number; the relationship stays.')],
  { more: 'Then triple it: 90 g oats and 60 g fruit.', more_zh: '按比例放大缩小，每样都乘或除以同一个数，比例不变。再试三倍：燕麦 90 克、水果 60 克，还是 3 : 2。' });
D.N16 = deep(Y4.N16, [why(lines({ rows: ['1/6 of 42 = 42 ÷ 6', '= 7', 'Check: 6 × 7 = 42 ✓'], says: ['How do we write it?', 'One sixth means share into 6.', 'Each part is 7.', 'Check by multiplying.'] })),
  another(partScene({ total: 35, groups: 5, title: '', intro: '', explain: '', explain_zh: '' })), remember(['Unit fraction of a number:', 'divide by the denominator.', 'Check by multiplying.'], 'Divide by the denominator; check by multiplying.')],
  { more: 'Then 1/5 of 35 = 7.', more_zh: '求几分之一就是除以分母：42 的 1/6 = 42 ÷ 6 = 7。再试 35 的 1/5 = 7。' });
D.N17 = deep(Y4.N17, [why(lines({ rows: ['1/6 = 7 cm', 'Whole = 6 × 7 = 42 cm', 'Check: 42 ÷ 6 = 7 ✓'], says: ['Going backwards.', 'One part is known.', 'Six equal parts make the whole.', 'Check by sharing.'] })),
  another(lines({ rows: ['1/4 of a rope is 9 m', 'Whole = 4 × 9 = 36 m', 'Check: 36 ÷ 4 = 9 ✓'], says: ['Try another.', 'One quarter is 9 m.', 'Four quarters make the whole.', 'Check.'] })),
  remember(['Know one part?', 'Multiply by the number of parts.', 'Check by dividing.'], 'Know one part: multiply by the number of parts; check by dividing.')],
  { more: 'Then 1/4 is 9 m, so the rope is 36 m.', more_zh: '知道一份求整体：1/6 是 7 厘米，整体 6 × 7 = 42 厘米。再试：绳子的 1/4 是 9 米，整根 4 × 9 = 36 米。' });
D.N18 = deep(Y4.N18, [why(lines({ rows: ['2 + 2 + 1 = $5', '1 + 1 + 1 + 1 + 1 = $5', '$5 = 500 cents'], says: ['Same total, different coins.', 'Two $2 coins and a $1 coin.', 'Five $1 coins.', 'In cents: 500.'] })),
  another(lines({ rows: ['Make $10 two ways', '$5 + $5', '$2 + $2 + $2 + $2 + $2', 'both = $10'], says: ['Try another.', 'Ten dollars.', 'Two fives.', 'Five twos.', 'The same total.'] })),
  remember(['Different coins, same total.', 'Count the biggest first.', '$1 = 100 cents.'], 'Different coins can make the same total; count the biggest first.')],
  { more: 'Then $10 as 5 + 5 or five $2 coins.', more_zh: '同样的钱可以有不同组合：5 元 = 2 + 2 + 1 = 五个 1 元。再试 10 元：两张 5 元，或者五个 2 元。' });
D.N19 = deep(Y4.N19, [why(lines({ rows: ['3 × $4 = $12', '$12 + $5 = $17', '$20 − $17 = $3'], says: ['Three steps.', 'Same price: multiply.', 'Add the other item.', 'Change: subtract from what you paid.'] })),
  another(jumps({ min: 0, max: 20, every: 1, label: 5, start: 0, hops: [{ to: 6, label: '$6', say: 'One book: $6' }, { to: 12, label: '$6', say: 'Two books: $12' }, { to: 15, label: '+$3', say: 'A pen: $15' }, { to: 20, label: '+$5', below: true, say: 'Count up to $20: $5 change' }], end: 'Change: $5', startSay: 'Two books at $6 and a $3 pen. Pay with $20.' })),
  remember(['Same price: multiply.', 'Add everything.', 'Count up to find change.'], 'Multiply same prices, add everything, count up for change.')],
  { more: 'Then 2 × $6 + $3 = $15, change from $20 is $5.', more_zh: '同价多件用乘法，再加上其他东西，找零从总价往上数。再试：两本 6 元的书和一支 3 元的笔，共 15 元，付 20 元找 5 元。' });

// ---- Algebra ----------------------------------------------------------------------------------
D.A01 = deep(Y4.A01, [why(lines({ rows: ['460 + ? = 600', '600 − 460 = 140', 'Add 20 to both sides:', 'still balanced'], says: ['Two ideas.', 'Find the gap.', 'Subtract to undo adding.', 'Do the same to both sides…', '…and it stays balanced.'] })),
  another(balanceScene({ left: '350 +', right: '500', missing: '150', title: '', intro: '', explain: '', explain_zh: '', check: '350 + 150 = 500 ✓' })),
  remember(['Both sides, same value.', 'Undo + with −.', 'Same change to both sides.'], 'Both sides have the same value; undo adding with subtracting.')],
  { more: 'Then 350 + ? = 500: 150.', more_zh: '等式两边一样多：460 + □ = 600，□ = 600 − 460 = 140。两边同时加 20 仍然平衡。再试 350 + □ = 500：□ = 150。' });
D.A02 = deep(Y4.A02, [why(lines({ rows: ['4 × ? = 28', '28 ÷ 4 = 7', 'Check: 4 × 7 = 28 ✓'], says: ['Undo it.', 'A missing factor.', 'Division undoes multiplication.', 'Put it back to check.'] })),
  another(partScene({ total: 30, groups: 5, title: '', intro: '', explain: '', explain_zh: '', t2: '5 × ? = 30', t3: '30 ÷ 5 = 6 ✓', says: ['30 counters.', '5 equal groups of 6.', 'Each group is the missing factor: 6.', '5 × 6 = 30 is true.'] })),
  remember(['Missing factor?', 'Divide.', 'Check by multiplying.'], 'Find a missing factor by dividing; check by multiplying.')],
  { more: 'Then 5 × ? = 30: 6.', more_zh: '求乘法里缺的因数用除法：4 × □ = 28，□ = 28 ÷ 4 = 7。再试 5 × □ = 30：□ = 6。' });
D.A03 = deep(Y4.A03, [why(lines({ rows: ['Adding: the same jump', 'Doubling: the jump grows', 'Undo doubling: ÷ 2'], says: ['Two kinds of patterns.', '2, 4, 6: always +2.', '3, 6, 12, 24: the jumps get bigger.', 'Going back halves each time.'] })),
  another(jumps({ min: 0, max: 32, every: 1, label: 4, start: 32, hops: [16, 8, 4, 2].map(v => ({ to: v, label: '÷2', below: true, say: `${v * 2} ÷ 2 = ${v}` })), end: 'Rule: halve each time', startSay: 'Start at 32 and halve.' })),
  remember(['Find the change.', '+ same, × grows.', 'Reverse with the inverse.'], 'Adding keeps the jump; multiplying grows it; reverse with the inverse.')],
  { more: 'Then halving from 32: 16, 8, 4, 2.', more_zh: '加法规律每次变化一样；乘法规律变化越来越大；倒过来用逆运算。再试从 32 开始每次除以 2：16、8、4、2。' });

// ---- Measurement -------------------------------------------------------------------------------
D.M01 = deep(Y4.M01, [why(lines({ rows: ['1 m = 100 cm', '1 m 23 cm = 123 cm', 'Ruler, scale, jug:', 'pick the tool for the job'], says: ['Units and tools.', 'A metre is 100 cm.', 'Change everything to cm.', 'Length, mass and capacity…', '…each have their own tool.'] })),
  another(lines({ rows: ['2 m 5 cm = ?', '200 cm + 5 cm', '= 205 cm', '(not 25 cm!)'], says: ['Try another.', 'Two metres and five centimetres.', 'Change metres to centimetres.', 'Add.', 'Careful with the zero.'] })),
  remember(['1 m = 100 cm.', 'Change to one unit.', 'Choose the right tool.'], 'A metre is 100 cm; change to one unit before comparing.')],
  { more: 'Then 2 m 5 cm = 205 cm.', more_zh: '1 米 = 100 厘米，混合单位先换成同一单位。再试 2 米 5 厘米 = 205 厘米（不是 25 厘米）。' });
D.M02 = deep(Y4.M02, [why(lines({ rows: ['Find what one mark is worth', '2 degrees per mark', 'Halfway between 20 and 22 → 21'], says: ['How to read it.', 'Check the labelled numbers.', 'Count the marks between them.', 'In between marks, take halfway.'] })),
  another(scaleRead({ max: 40, spaces: 8, at: 5, unit: '°C' })), remember(['Read the labels.', 'Work out one mark.', 'Read the level.'], 'Read the labels, work out one mark, then read the level.')],
  { more: 'Then a scale 0 to 40 °C in 8 marks: 25 °C.', more_zh: '读温度计先看每格代表几度：这里每格 2 度，液面在 20 和 22 中间就是 21 °C。再试 0–40 °C 分 8 格，每格 5 度，第 5 格是 25 °C。' });
D.M03 = deep(Y4.M03, [why(lines({ rows: ['8 + 5 + 8 + 5 = 26', '= 2 × (8 + 5)', '= 2 × 13 = 26 cm'], says: ['A quicker way.', 'Add all four sides.', 'Opposite sides match.', 'Double one long and one short side.'] })),
  another(perimeterScene({ w: 7, h: 3, unit: 'cm', title: '', intro: '', explain: '', explain_zh: '' })), remember(['Go all the way round.', 'Opposite sides match.', '2 × (long + short)'], 'Go all the way round; for a rectangle, 2 × (long + short).')],
  { more: 'Then a 7 by 3 rectangle: 20 cm.', more_zh: '长方形周长：8 + 5 + 8 + 5 = 26，也可以 2 × (8 + 5) = 26。再试 7 × 3 的长方形：2 × (7 + 3) = 20 厘米。' });
D.M04 = deep(Y4.M04, [why(lines({ rows: ['4 rows of 6', '4 × 6 = 24 square units', 'Area 24, side 6:', 'other side = 24 ÷ 6 = 4'], says: ['Multiply the sides.', 'Rows times squares per row.', '24 square units.', 'Working backwards…', '…divide.'] })),
  another(areaScene({ cols: 5, rows: 3, title: '', intro: '', explain: '', explain_zh: '', unit: 'square units' })), remember(['Area = rows × columns.', 'Units are squares.', 'Missing side: divide.'], 'Area is rows times columns; a missing side is found by dividing.')],
  { more: 'Then a 5 by 3 rectangle: 15 square units.', more_zh: '长方形面积 = 行 × 列：4 × 6 = 24。知道面积和一边，另一边用除法：24 ÷ 6 = 4。再试 5 × 3 = 15 平方单位。' });
D.M05 = deep(Y4.M05, [why(lines({ rows: ['Count whole squares first', 'Two halves make one', '6 + ½ = 6½'], says: ['A good order.', 'Every full square.', 'A triangle cut corner to corner is half a square.', 'Add them.'] })),
  another(lines({ rows: ['5 whole squares', '4 halves = 2 wholes', '5 + 2 = 7 square units'], says: ['Try another.', 'Count the whole squares.', 'Pair the halves.', 'Add.'] })),
  remember(['Whole squares first.', 'Pair the halves.', 'Add the units.'], 'Count whole squares, pair the halves, then add.')],
  { more: 'Then 5 whole squares and 4 halves: 7 square units.', more_zh: '不规则图形数方格：先数整格，两个半格合成一格。再试：5 个整格 + 4 个半格（= 2 格）= 7 平方单位。' });
// M06 · a cuboid of real cubes that the child can drag to turn (2026-11-11, replaces the fixed-angle picture).
// Twelve cubes: they drop into a 3 × 2 × 2 box, the top layer lifts so the hidden cubes show, the picture
// turns once by itself, and the same twelve cubes rebuild as 2 × 2 × 3. Every position is worked out from
// the step number k, so the picture can be redrawn from any angle at any moment.
const CUBE_TONES = LAYER_TONES;
function cuboidSolid() {
  const A = [], B = [];
  for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) for (let x = 0; x < 3; x++) {
    A.push({ p: [x - 1, y + .5, z - .5], layer: y, order: y * 6 + z * 3 + x });
    B.push(x < 2 ? { p: [x - .5, y + .5, z - .5], layer: y } : { p: [y - .5, 2.5, z - .5], layer: 2 }); // the right-hand column goes on top
  }
  const born = o => (o === 0 ? [1, 0, 1] : o < 3 ? [2, o - 1, 2] : o < 6 ? [3, o - 3, 3] : [4, o - 6, 6]); // step it arrives in, place in the queue, queue length
  const S = 42, cx = 160, cy = 150, oy = 1.15;
  const group = (inner, op) => (op > .01 ? `<g opacity="${op.toFixed(2)}">${inner}</g>` : '');
  const draw = (k, view) => {
    const toB = clamp(k - 7) - clamp(k - 10), liftA = clamp(k - 4) - clamp(k - 6), liftB = clamp(k - 8) - clamp(k - 9);
    const v = { rx: view.rx, ry: view.ry + 360 * clamp(k - 5) }; // step 6 turns the picture once, all the way round
    const cubes = A.map((a, i) => {
      const [at, j, m] = born(a.order), gap = .5 / m, t = clamp((clamp(k - at + 1) - j * gap) / (1 - (m - 1) * gap)), b = B[i];
      const p = a.p.map((q, n) => q + (b.p[n] - q) * toB);
      p[1] += (1 - t) * 2.2 + a.layer * 1.1 * liftA * (1 - toB) + b.layer * .6 * liftB + (b.layer === 2 ? Math.sin(Math.PI * toB) * 1.1 : 0);
      return { p, op: t, tone: CUBE_TONES[a.layer].map((c, n) => hex(mix(c, CUBE_TONES[b.layer][n], toB))) };
    });
    const boxA = wireBox(3, 2, 2, v, S, cx, cy, oy), boxB = wireBox(2, 3, 2, v, S, cx, cy, oy);
    return group(floorGrid(3, 2, v, S, cx, cy, oy) + boxA.back, 1 - toB) + group(floorGrid(2, 2, v, S, cx, cy, oy) + boxB.back, toB)
      + drawCubes(cubes, v, S, cx, cy, oy) + group(boxA.front, (1 - toB) * (1 - liftA)) + group(boxB.front, toB * (1 - liftB));
  };
  return { draw, view: { rx: -24, ry: -32 } };
}
const CUBOID_CAPTIONS = ['3 long × 2 wide × 2 high', '1 cube = 1 cubic unit', '1 row = 3 cubes', '1 layer = 2 × 3 = 6 cubes', '2 layers = 6 + 6 = 12 cubes', '6 on top, 6 underneath', '12 cubes from every side', '2 × 6 = 12 cubic units', '2 long × 2 wide × 3 high', '1 layer = 2 × 2 = 4 cubes', '3 × 4 = 12 cubic units'];
D.M06 = scene({ title: 'Fill a cuboid with cubes', w: 320, h: 300, ms: 1100, solid: cuboidSolid(),
  intro: 'Fill the box with cubes, one layer at a time. Drag the picture to turn it and look from any side.',
  explain: 'One layer is 2 rows of 3 = 6 cubes, and 2 layers make 2 × 6 = 12 cubes. Cubes hidden inside still count. The same 12 cubes also build a 2 × 2 × 3 cuboid: a different shape with the same volume.',
  explain_zh: '体积就是能装下多少个同样大的小方块。先数一层：2 排、每排 3 个 = 6 个；有 2 层，2 × 6 = 12 个，藏在里面看不见的也要算。同样的 12 个方块还能搭成 2 × 2 × 3 的长方体：形状不同，体积一样。这一课的画面可以用手指（或鼠标）拖着转，从上面、侧面、后面看；“Turn it back” 回到原来的角度。可以让孩子把上层抬起来的那一步转到侧面，数一数下层是不是还有 6 个。',
  items: [T(160, 13, '↔ Drag the cubes to turn them', 'mv-jl'),
    CUBOID_CAPTIONS.map((c, i) => T(160, 254, c, 'mv-mid', { at: i || undefined, out: i + 1 })),
    R(44, 232, 232, 62, 'mv-note', { rx: 12, at: 11 }), ['Count one layer.', '× the number of layers.', 'Hidden cubes count too.'].map((t, i) => T(160, 251 + i * 18, t, 'mv-num', { at: 11 }))],
  steps: [
    { part: 'See it', say: 'An empty box: 3 cubes long, 2 wide and 2 high. How many cubes will fill it?' },
    { part: 'See it', btn: 'Put in a cube', say: 'One cube goes in. Each cube is 1 cubic unit.' },
    { part: 'See it', btn: 'Finish the row', say: 'A row of 3 cubes.' },
    { part: 'See it', btn: 'Finish the layer', say: '2 rows of 3: one layer holds 6 cubes.' },
    { part: 'See it', btn: 'Add a layer', say: 'A second layer of 6. The box is full: 6 + 6 = 12 cubes.' },
    { part: 'Why it works', btn: 'Why does it work?', say: 'Lift the top layer. The bottom layer still has all 6 cubes, even the ones you could not see.' },
    { part: 'Why it works', btn: 'Turn it round', say: 'Turn it all the way round: there are no gaps anywhere.', ms: 3400 },
    { part: 'Why it works', btn: 'Put it back', say: '2 layers of 6 cubes: 2 × 6 = 12 cubic units.' },
    { part: 'Try another', btn: 'Try another', say: 'The same 12 cubes, moved: now 2 long, 2 wide and 3 high.', ms: 1700 },
    { part: 'Try another', btn: 'Look at one layer', say: 'Pull the layers apart: each layer is 2 × 2 = 4 cubes.' },
    { part: 'Try another', btn: 'Stack them', say: '3 layers of 4: 3 × 4 = 12. A different shape, the same volume.' },
    { part: 'Remember', btn: 'Remember', say: 'Count one layer, then multiply by the number of layers. Hidden cubes count too.', ms: 1700 },
  ] });
D.M07 = deep(Y4.M07, [why(lines({ rows: ['Quarter turn = 90°', 'Half turn = 180°', 'Full turn = 360° = 4 right angles'], says: ['Measuring turns.', 'One right angle.', 'Two right angles.', 'Four right angles.'] })),
  another(lines({ figure: [sector(80, 110, 60, 0, 90, 'mv-sector2', { at: 1 }), sector(80, 110, 60, 90, 180, 'mv-sector', { at: 2 }), sector(80, 110, 60, 180, 270, 'mv-sector3', { at: 3 }), L(80, 110, 80, 50, 'mv-axis')], x: 220, rows: ['90°', '+ 90° = 180°', '+ 90° = 270°'], says: ['Three quarter turns.', 'One quarter.', 'Two quarters.', 'Three quarters: 270°.'] })),
  remember(['90° = quarter turn.', '180° = half turn.', '360° = full turn.'], 'A quarter turn is 90°, a half 180°, a full turn 360°.')],
  { more: 'Then three quarter turns: 270°.', more_zh: '四分之一圈 90°，半圈 180°，一圈 360°（4 个直角）。再试转四分之三圈：90 + 90 + 90 = 270°。' });
D.M08 = deep(Y4.M08, [why(lines({ rows: ['Fives first: 5, 10, 15', 'Then ones: 16, 17', 'Hour hand just past 9'], says: ['Reading every minute.', 'Count the numbers in fives.', 'Then the small marks in ones.', 'The short hand has just passed 9.'] })),
  another(clockMoves({ times: [[2, 0, '2:00'], [2, 35, '2:35', 'Count on 35 minutes'], [2, 38, '2:38', 'Three more minutes']] })),
  remember(['Long hand: count in fives,', 'then in ones.', 'Short hand: the hour.'], 'Count minutes in fives, then ones; the short hand gives the hour.')],
  { more: 'Then 2:00 to 2:35 to 2:38.', more_zh: '读到每一分钟：先按 5 数大格，再按 1 数小格。再看 2:00 → 2:35 → 2:38。' });
D.M09 = deep(Y4.M09, [why(lines({ rows: ['1 h = 60 min, not 100', '1 h 42 min = 60 + 42 = 102 min', '90 s = 60 s + 30 s = 1½ min'], says: ['Time counts in sixties.', 'Not like centimetres.', 'Change hours to minutes.', 'Seconds work the same way.'] })),
  another(lines({ rows: ['2 h 15 min = ?', '2 × 60 = 120 min', '120 + 15 = 135 min'], says: ['Try another.', 'Two hours and a quarter.', 'Two hours in minutes.', 'Add the minutes.'] })),
  remember(['60 seconds = 1 minute.', '60 minutes = 1 hour.', 'Not 100!'], 'Time uses sixty: 60 seconds in a minute, 60 minutes in an hour.')],
  { more: 'Then 2 h 15 min = 135 min.', more_zh: '时间是 60 进制：1 小时 = 60 分钟，不是 100。再试 2 小时 15 分 = 120 + 15 = 135 分钟。' });

// ---- Geometry ----------------------------------------------------------------------------------
D.G01 = deep(Y4.G01, [why(lines({ rows: ['Vertex: where edges meet', 'Regular: equal edges and angles', 'Irregular: still a polygon'], says: ['Polygon words.', 'Corners are vertices.', 'Both kinds of equal.', 'Unequal does not stop it being a polygon.'] })),
  another(polygonScene({ n: 8, title: '', intro: '', explain: '', explain_zh: '' })), remember(['Name it by its sides.', 'Regular: all equal.', 'Vertices = corners.'], 'Name a polygon by its sides; regular means all sides and angles equal.')],
  { more: 'Then an octagon: 8 sides and 8 vertices.', more_zh: '多边形的角点叫顶点。边和角都相等叫正多边形，不相等也还是多边形。再看八边形：8 条边、8 个顶点。' });
D.G02 = deep(Y4.G02, [why(lines({ rows: ['Fold: halves match point for point', 'Rectangle: 2 lines, square: 4', 'Circle: every diameter'], says: ['What makes a mirror line?', 'Every point lands on a partner.', 'A square has two more: its diagonals.', 'A circle has infinitely many.'] })),
  another(lines({ figure: [P(pathOf(polygon(80, 110, 60, 3)), 'mv-c3'), ...polygon(80, 110, 60, 3).map((p, i) => { const q = polygon(80, 110, 60, 3)[(i + 1) % 3], r = polygon(80, 110, 60, 3)[(i + 2) % 3]; return L(r[0], r[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 'mv-mirror', { at: i + 1 }); })], x: 225, rows: ['line 1', 'line 2', '3 mirror lines'], says: ['An equilateral triangle.', 'From a corner to the middle of the opposite side.', 'Another one.', 'Three mirror lines.'] })),
  remember(['Fold to test.', 'Halves must match exactly.', 'Count every direction.'], 'Fold to test: a mirror line makes matching halves.')],
  { more: 'Then an equilateral triangle has 3 mirror lines.', more_zh: '对称轴：对折后两边每一点都重合。长方形 2 条，正方形 4 条，圆有无数条。再看等边三角形：从每个角到对边中点各有一条，共 3 条。' });
// G03 · one solid, different views: the steps swing the camera to the front, the top and the side, and the
// child can drag the picture at any time (2026-11-11). Faces are coloured by direction: top yellow, front
// green, side blue. Each step first glides back to the angle it needs (solid.recentre).
function viewSolid() {
  const S = 46, cx = 160, cy = 122, oy = .8, home = { rx: -28, ry: -35 }, TONE = ['#fbe9b7', '#9fc2ef', '#9ad6bf'];
  const VIEW = { d3: home, front: { rx: 0, ry: 0 }, top: { rx: -90, ry: 0 }, side: { rx: 0, ry: -90 } };
  const cam = ['d3', 'front', 'top', 'side', 'd3', 'd3', 'd3', 'd3', 'front', 'top', 'side', 'd3'].map(n => VIEW[n]);
  const A = [], B = [], extra = [[.5, 1.5, -.5], [.5, 1.5, .5]];
  for (let z = 0; z < 2; z++) for (let x = 0; x < 3; x++) { A.push([x - 1, .5, z - .5]); B.push(x < 2 ? [x - .5, .5, z - .5] : [-.5, 1.5, z - .5]); }
  const group = (inner, op) => (op > .01 ? `<g opacity="${op.toFixed(2)}">${inner}</g>` : '');
  const draw = (k, view) => {
    const i = Math.min(cam.length - 1, Math.floor(k)), j = Math.min(cam.length - 1, i + 1), f = k - i;
    const v = { rx: Math.max(-90, Math.min(30, cam[i].rx + (cam[j].rx - cam[i].rx) * f + view.rx - home.rx)), ry: cam[i].ry + (cam[j].ry - cam[i].ry) * f + view.ry - home.ry };
    const toB = clamp(k - 6) - clamp(k - 10); // 3 × 2 × 1 becomes 2 × 2 × 2 in step 7, and goes back in the last step
    const cubes = [...A.map((a, n) => ({ p: a.map((q, m) => q + (B[n][m] - q) * toB + (m === 1 && B[n][1] > 1 ? Math.sin(Math.PI * toB) * .8 : 0)), op: 1, tone: TONE })),
      ...extra.map(e => ({ p: [e[0], e[1] + (1 - toB) * 2, e[2]], op: toB, tone: TONE }))];
    return group(floorGrid(3, 2, v, S, cx, cy, oy), 1 - toB) + group(floorGrid(2, 2, v, S, cx, cy, oy), toB) + drawCubes(cubes, v, S, cx, cy, oy);
  };
  return { draw, view: home, recentre: true };
}
const G03_CAPTIONS = ['3 across, 2 deep, 1 high', 'front: 3 × 1 = 3 squares', 'top: 3 × 2 = 6 squares', 'side: 2 × 1 = 2 squares', '', '', '', '2 across, 2 deep, 2 high', 'front: 2 × 2 = 4 squares', 'top: 2 × 2 = 4 squares', 'side: 2 × 2 = 4 squares'];
D.G03 = scene({ title: 'One solid, different views', w: 320, h: 292, ms: 1300, solid: viewSolid(),
  intro: 'Look at a cuboid from the front, the top and the side, then try another. Drag the picture to turn it yourself.',
  explain: 'A 3 × 2 × 1 cuboid shows 3 squares from the front, 6 from the top and 2 from the side. A 2 × 2 × 2 cube shows 4 squares from every side.',
  explain_zh: '同一个立体从不同方向看形状不同：3 × 2 × 1 的长方体，正面 3 个正方形、上面 6 个、侧面 2 个。再看 2 × 2 × 2 的正方体：每个方向都是 4 个。方块的面按方向上色：上面黄色、正面绿色、侧面蓝色，所以“从正面看”就是只看到绿色的面。画面可以用手指或鼠标拖着转；每点一步，画面会先回到这一步该看的角度。',
  items: [T(160, 13, '↔ Drag the picture to turn it', 'mv-jl'),
    G03_CAPTIONS.map((c, i) => (c ? T(160, 250, c, 'mv-mid', { at: i || undefined, out: i + 1 }) : [])),
    ['Front (green): across × high', 'Top (yellow): across × deep', 'Side (blue): deep × high'].map((t, i) => T(160, 236 + i * 20, t, 'mv-num', { at: 4 + i, out: 7 })),
    R(44, 224, 232, 62, 'mv-note', { rx: 12, at: 11 }), ['Each view hides one direction.', 'Front, top, side.', 'Count the squares.'].map((t, i) => T(160, 243 + i * 18, t, 'mv-num', { at: 11 }))],
  steps: [
    { part: 'See it', say: 'A cuboid: 3 cubes across, 2 deep and 1 high.' },
    { part: 'See it', btn: 'Look from the front', say: 'Front view: 3 across and 1 high. 3 squares.' },
    { part: 'See it', btn: 'Look from the top', say: 'Top view: 3 across and 2 deep. 6 squares. The height disappears.' },
    { part: 'See it', btn: 'Look from the side', say: 'Side view: 2 deep and 1 high. 2 squares.' },
    { part: 'Why it works', btn: 'Why does it work?', say: 'The green faces are what you see from the front: across × high.' },
    { part: 'Why it works', btn: 'The top', say: 'The yellow faces show from the top: across × deep.' },
    { part: 'Why it works', btn: 'The side', say: 'The blue faces show from the side: deep × high.' },
    { part: 'Try another', btn: 'Try another', say: 'Move the cubes and add 2 more: a 2 × 2 × 2 cube.', ms: 1700 },
    { part: 'Try another', btn: 'Look from the front', say: 'Front view: 2 across and 2 high. 4 squares.' },
    { part: 'Try another', btn: 'Look from the top', say: 'Top view: 4 squares.' },
    { part: 'Try another', btn: 'Look from the side', say: 'Side view: 4 squares. A cube looks the same from every side.' },
    { part: 'Remember', btn: 'Remember', say: 'Each view hides one direction; count the squares you can see.', ms: 1700 },
  ] });
D.G04 = deep(Y4.G04, [why(lines({ rows: ['Slide: every point moves the same', 'Flip: equal distance from the line', 'Turn: one point stays still'], says: ['What each move keeps.', 'A translation moves every point the same way.', 'A reflection keeps distances to the mirror.', 'A rotation keeps its centre fixed.'] })),
  another(lines({ rows: ['Slide 2 right, 1 up', 'Every corner: 2 right, 1 up', 'Same shape, same way round'], says: ['Try a slide.', 'The instruction.', 'Every corner moves the same way.', 'Nothing turns or flips.'] })),
  remember(['Slide, flip, turn.', 'Size stays the same.', 'Only position or direction changes.'], 'Slides, flips and turns keep the size; only position or direction changes.')],
  { more: 'Then slide every corner 2 right and 1 up.', more_zh: '平移：每个点移动一样的方向和距离；翻折：到镜子线距离相等；旋转：中心点不动。再试：向右 2 格、向上 1 格，每个角都这样移，形状方向不变。' });
D.G05 = deep(Y4.G05, [why(lines({ rows: ['Letter = row, number = column', 'B3: row B meets column 3', 'Right: column + 1 → B4'], says: ['Reading a map square.', 'Two labels name one square.', 'Find where they cross.', 'Moving right changes only the number.'] })),
  another(lines({ rows: ['C2 → up 1 → B2', 'B2 → right 2 → B4', 'Back: left 2, down 1 → C2'], says: ['Try another.', 'Up changes the letter.', 'Right changes the number.', 'Reverse to go back.'] })),
  remember(['Row letter, column number.', 'Up/down: letter changes.', 'Left/right: number changes.'], 'Rows have letters and columns have numbers; moving changes one label at a time.')],
  { more: 'Then C2 up to B2, then right to B4.', more_zh: '网格坐标：字母是行、数字是列。上下移动字母变，左右移动数字变。再试：C2 向上 1 格到 B2，再向右 2 格到 B4。' });

// ---- Statistics --------------------------------------------------------------------------------
D.S01 = deep(Y4.S01, [why(lines({ rows: ['Category: words', 'Count: whole numbers', 'Measure: units and decimals'], says: ['Three kinds of data.', 'Like pet type.', 'Like number of pets.', 'Like leaf length in cm.'] })),
  another(lines({ rows: ['eye colour → category', 'number of siblings → count', 'arm length → measurement'], says: ['Try sorting these.', 'Eye colour is a word.', 'Siblings are counted.', 'Arm length is measured.'] })),
  remember(['Words: category.', 'Counted: whole numbers.', 'Measured: keep the unit.'], 'Categories are words, counts are whole numbers, measurements keep their units.')],
  { more: 'Then sort eye colour, siblings and arm length.', more_zh: '数据类型：类别（文字）、计数（整数）、测量（带单位，可以有小数）。再分一分：眼睛颜色是类别，兄弟姐妹人数是计数，手臂长度是测量。' });
D.S02 = deep(Y4.S02, [why(lines({ rows: ['One dot per person', 'Same value: stack', 'Bars: same counts, scale from 0'], says: ['Two graphs, same data.', 'Every observation gets a dot.', 'Equal values stack up.', 'Bars show the stack heights.'] })),
  another(dots({ vals: [2, 3, 3, 4, 4, 4, 5], label: 'books read this month' })), remember(['Every observation counts.', 'Stacks show frequency.', 'Scales start at 0.'], 'Every observation counts; stacks show how often each value occurs.')],
  { more: 'Then books read: 2, 3, 3, 4, 4, 4, 5.', more_zh: '点图每人一个点，相同的值往上叠；条形图表示同样的频数，纵轴从 0 开始。再画看书本数：2、3、3、4、4、4、5。' });
D.S03 = deep(Y4.S03, [why(lines({ rows: ['Position = value', 'Stack height = frequency', 'Largest value ≠ tallest stack'], says: ['Two different things.', 'Where a dot sits is its value.', 'How high a stack is: how many.', 'Do not mix them up.'] })),
  another(dots({ vals: [0, 1, 1, 1, 2, 4], label: 'goals scored', highlight: v => v === 4 })), remember(['Along: the value.', 'Up: how many.', 'Read the question carefully.'], 'Along the line is the value; up the stack is how many.')],
  { more: 'Then goals: the tallest stack is 1, but the largest value is 4.', more_zh: '点图横轴是数值，叠起来的高度是频数，不要混淆。再看进球数：最高的一列是 1（3 个人），但最大的数值是 4。' });
D.S04 = deep(Y4.S04, [why(lines({ rows: ['Peak: tallest stack', 'Middle: centre value in order', 'Spread: smallest to largest'], says: ['Describing data.', 'The most common value.', 'Put them in order and find the middle.', 'How far the values spread.'] })),
  another(dots({ vals: [1, 2, 2, 3, 3, 3, 3, 4, 5], label: 'hours of sport each week', highlight: v => v === 3 })), remember(['Peak, middle, spread.', 'Talk about this group only.', 'Do not invent data.'], 'Describe the peak, middle and spread for this group only.')],
  { more: 'Then a new set: peak and middle 3, spread 1 to 5.', more_zh: '描述数据看峰（最多的值）、中间的值、分布范围，只说这一组。再看一组：峰和中间都是 3，范围 1 到 5。' });

export const DEEP4 = Object.fromEntries(Object.entries(D).map(([k, v]) => ['Y4-' + k, v]));
