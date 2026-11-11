/**
 * Deterministic supplementary practice for the eight published fraction lessons.
 * augmentContent(content): deep clone; append 40 practice items to each supported
 * lesson without changing its original items. Repeated augmentation is idempotent.
 * selectPracticeItems(lesson, count=15, priorItemIds=[]):
 *   {items,newCount,repeatedCount,remainingNewCount,exhausted,notice}.
 *   exhausted means there were no unseen items before this selection. Mixed and
 *   all-repeat sets are explicitly labelled. Repeats favour least-practised items.
 * No practice item is eligible for independent/retention evidence.
 */

export const PRACTICE_VERSION = 'fern-practice-v1';
export const PRACTICE_ITEMS_PER_LESSON = 40;
export const DEFAULT_PRACTICE_COUNT = 15;

const TARGET_OPS = Object.freeze({
  'FRAC.NUMBER_LINE.PROPER': 'fraction_at_tick',
  'FRAC.COMPARE.SAME_DENOM': 'compare_fractions',
  'FRAC.ADD.SAME_DENOM': 'add_fractions',
  'FRAC.SUB.SAME_DENOM': 'subtract_fractions',
  'FRAC.UNIT_OF_WHOLE': 'unit_of_whole',
  'FRAC.WHOLE_FROM_UNIT': 'whole_from_unit',
  'FRAC.NONUNIT_OF_WHOLE': 'nonunit_of_whole',
  'FRAC.WHOLE_FROM_NONUNIT': 'whole_from_nonunit',
});

const EQUIVALENCE = 'Accept any mathematically equivalent fraction; do not require simplification.';
const clone = value => JSON.parse(JSON.stringify(value));
const compareText = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const partWord = count => count === 1 ? 'part' : 'parts';

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/** Swapping operands is not counted as a new addition/comparison question. */
export function practiceSignature(spec) {
  if (!spec || typeof spec !== 'object' || typeof spec.op !== 'string') throw new TypeError('An answer specification is required.');
  const normalized = clone(spec);
  if (['add_fractions', 'compare_fractions'].includes(normalized.op)) {
    const operands = [normalized.left, normalized.right].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    [normalized.left, normalized.right] = operands;
  }
  return canonical(normalized);
}

function hash(text) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619) >>> 0;
  return value;
}

function ordered(specs) {
  return specs.map(spec => ({ spec, key: canonical(spec) }))
    .sort((a, b) => hash(a.key) - hash(b.key) || compareText(a.key, b.key)).map(value => value.spec);
}

function candidateSpecs(op) {
  const specs = [];
  if (op === 'fraction_at_tick') {
    for (let parts = 2; parts <= 12; parts++) for (let tick = 1; tick < parts; tick++) specs.push({ op, tick, parts });
  } else if (['compare_fractions', 'add_fractions', 'subtract_fractions'].includes(op)) {
    for (let denominator = 2; denominator <= 12; denominator++) {
      for (let left = 1; left <= denominator; left++) for (let right = 1; right <= denominator; right++) {
        if (op === 'compare_fractions' && (left === denominator || right === denominator)) continue;
        if (op === 'add_fractions' && left + right > denominator) continue;
        if (op === 'subtract_fractions' && right > left) continue;
        specs.push({ op, left: [left, denominator], right: [right, denominator] });
      }
    }
  } else if (['unit_of_whole', 'whole_from_unit'].includes(op)) {
    for (let denominator = 2; denominator <= 10; denominator++) for (let onePart = 2; onePart <= 10; onePart++) {
      specs.push(op === 'unit_of_whole'
        ? { op, whole: denominator * onePart, denominator }
        : { op, part: onePart, denominator });
    }
  } else {
    for (let denominator = 3; denominator <= 12; denominator++) {
      for (let numerator = 2; numerator < denominator; numerator++) for (let onePart = 2; onePart <= 12; onePart++) {
        specs.push(op === 'nonunit_of_whole'
          ? { op, whole: denominator * onePart, numerator, denominator }
          : { op, part: numerator * onePart, numerator, denominator });
      }
    }
  }
  return ordered(specs);
}

function chooseSpecs(op, blocked, count) {
  const candidates = candidateSpecs(op);
  // Deliberately retain equal comparisons, whole sums and zero differences.
  const bucket = spec => op === 'compare_fractions' ? Math.sign(spec.left[0] - spec.right[0])
    : op === 'add_fractions' ? Number(spec.left[0] + spec.right[0] === spec.left[1])
      : op === 'subtract_fractions' ? Number(spec.left[0] === spec.right[0]) : 0;
  const pattern = op === 'compare_fractions' ? [-1, 1, -1, 1, 0]
    : ['add_fractions', 'subtract_fractions'].includes(op) ? [0, 0, 0, 1] : [0];
  const selected = [];
  while (selected.length < count) {
    const desired = pattern[selected.length % pattern.length];
    let candidate = candidates.find(spec => bucket(spec) === desired && !blocked.has(practiceSignature(spec)));
    candidate ||= candidates.find(spec => !blocked.has(practiceSignature(spec)));
    if (!candidate) throw new Error(`Not enough distinct practice specifications for ${op}.`);
    selected.push(candidate);
    blocked.add(practiceSignature(candidate));
  }
  return selected;
}

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return Math.abs(a);
}

function fractionAnswer(numerator, denominator, unitNumerator = numerator, unitDenominator = denominator) {
  const factor = gcd(numerator, denominator), n = numerator / factor, d = denominator / factor;
  const display = d === 1 ? String(n) : `${n}/${d}`;
  return { display, simplified: display, numerator: n, denominator: d, equivalence: EQUIVALENCE,
    unit_form: `${unitNumerator}/${unitDenominator}` };
}

function solve(spec) {
  const { op } = spec;
  if (op === 'fraction_at_tick') return fractionAnswer(spec.tick, spec.parts);
  if (op === 'compare_fractions') {
    const difference = spec.left[0] * spec.right[1] - spec.right[0] * spec.left[1];
    const value = difference < 0 ? '<' : difference > 0 ? '>' : '=';
    return { display: value, value, accepted: [value] };
  }
  if (op === 'add_fractions') return fractionAnswer(spec.left[0] + spec.right[0], spec.left[1]);
  if (op === 'subtract_fractions') return fractionAnswer(spec.left[0] - spec.right[0], spec.left[1]);
  const onePart = op === 'unit_of_whole' || op === 'nonunit_of_whole'
    ? spec.whole / spec.denominator : op === 'whole_from_unit' ? spec.part : spec.part / spec.numerator;
  const value = op === 'unit_of_whole' ? onePart : op === 'nonunit_of_whole'
    ? onePart * spec.numerator : onePart * spec.denominator;
  if (!Number.isSafeInteger(onePart) || !Number.isSafeInteger(value) || onePart <= 0 || value <= 0) {
    throw new Error('Quantity practice must have positive whole-number quantities.');
  }
  const answer = fractionAnswer(value, 1);
  delete answer.unit_form;
  return { ...answer, one_part: String(onePart), parts: String(spec.denominator) };
}

function escapeXML(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function svg(title, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 ${height}" role="img" aria-label="${escapeXML(title)}"><title>${escapeXML(title)}</title>${body}</svg>`;
}

function numberLine(parts, tick) {
  const x = n => 28 + 464 * n / parts;
  const marks = Array.from({ length: parts + 1 }, (_, n) => `<line x1="${x(n)}" y1="35" x2="${x(n)}" y2="49" stroke="#335347"/>`).join('');
  return svg(`A number line from zero to one split into ${parts} equal spaces. Point P is ${tick} ${tick === 1 ? 'space' : 'spaces'} to the right of zero.`, 82,
    `<line x1="28" y1="42" x2="492" y2="42" stroke="#335347" stroke-width="2"/>${marks}`
    + `<circle cx="${x(tick)}" cy="42" r="5" fill="#23654b"/><text x="${x(tick)}" y="22" text-anchor="middle" fill="#20392d" font-size="16">P</text>`
    + '<text x="28" y="70" text-anchor="middle" fill="#20392d" font-size="15">0</text><text x="492" y="70" text-anchor="middle" fill="#20392d" font-size="15">1</text>');
}

function fractionBars(spec) {
  const denominator = spec.left[1], width = 420 / denominator;
  const row = (numerator, y, label) => `<text x="24" y="${y + 19}" font-size="15" fill="#20392d">${label}</text>`
    + Array.from({ length: denominator }, (_, n) => `<rect x="${74 + n * width}" y="${y}" width="${width}" height="28" fill="${n < numerator ? '#b6d8c5' : '#ffffff'}" stroke="#335347"/>`).join('');
  const body = row(spec.left[0], 14, `${spec.left[0]}/${denominator}`)
    + (spec.op === 'compare_fractions' ? row(spec.right[0], 56, `${spec.right[0]}/${denominator}`) : '');
  return svg(spec.op === 'compare_fractions'
    ? `Two same-sized wholes, each split into ${denominator} equal parts. The bars show the two given fractions.`
    : `One whole split into ${denominator} equal parts. The bar shows the first fraction, not the answer.`, spec.op === 'compare_fractions' ? 98 : 56, body);
}

function quantityBar(spec, answer, reveal = false) {
  const parts = spec.denominator, fromPart = spec.op.startsWith('whole_from_');
  const knownParts = fromPart ? (spec.numerator || 1) : parts;
  const knownValue = fromPart ? spec.part : spec.whole;
  const wantedParts = spec.op === 'nonunit_of_whole' ? spec.numerator : spec.op === 'unit_of_whole' ? 1 : parts;
  const width = 456 / parts;
  const boxes = Array.from({ length: parts }, (_, n) => `<rect x="${32 + n * width}" y="42" width="${width}" height="34" fill="${n < (fromPart ? knownParts : wantedParts) ? '#b6d8c5' : '#ffffff'}" stroke="#335347"/>`
    + (reveal ? `<text x="${32 + (n + 0.5) * width}" y="64" text-anchor="middle" fill="#20392d" font-size="14">${escapeXML(answer.one_part)}</text>` : '')).join('');
  const bracketEnd = 32 + knownParts * width;
  const body = `<path d="M32 34 V24 H${bracketEnd} V34" fill="none" stroke="#335347"/>`
    + `<text x="${(32 + bracketEnd) / 2}" y="17" text-anchor="middle" fill="#20392d" font-size="15">${knownValue} in ${knownParts === parts ? 'the whole' : `${knownParts} equal ${knownParts === 1 ? 'part' : 'parts'}`}</text>`
    + boxes + `<text x="260" y="99" text-anchor="middle" fill="#20392d" font-size="14">${reveal ? `Answer: ${escapeXML(answer.display)}` : fromPart ? 'How much in the whole?' : `Find ${wantedParts} equal ${wantedParts === 1 ? 'part' : 'parts'}.`}</text>`;
  return svg(reveal ? `Each of ${parts} equal parts has value ${answer.one_part}. The answer is ${answer.display}.`
    : `The whole has ${parts} equal parts. ${knownParts} equal ${partWord(knownParts)} ${knownParts === 1 ? 'has' : 'together have'} the given value ${knownValue}.`, 116, body);
}

function createItem(lesson, spec, index) {
  const answer = solve(spec), variant = index % 4;
  let prompt, hints, solution, representation = { kind: 'none' }, diagram = '', solutionDiagram = '';
  const fraction = values => `${values[0]}/${values[1]}`;
  if (spec.op === 'fraction_at_tick') {
    prompt = [
      'What fraction is at point P on the number line?',
      'This line shows one whole walking track. What fraction of the track is marked P?',
      'One whole ribbon runs from 0 to 1 on this line. What fraction is marked P?',
      'A robot starts at 0 and reaches P. What fraction of the whole path has it travelled?',
    ][variant];
    hints = [`The whole has ${spec.parts} equal spaces. Count the spaces, not the ${spec.parts + 1} tick marks.`,
      `Start at 0 and count spaces until P. Use that count above the fraction line and ${spec.parts} below it.`];
    solution = [`There are ${spec.parts} equal spaces in one whole.`, `Point P is ${spec.tick} ${spec.tick === 1 ? 'space' : 'spaces'} from 0.`,
      `Its fraction is ${spec.tick}/${spec.parts}. An equivalent answer is ${answer.display}.`];
    representation = { kind: 'number_line', parts: spec.parts, marked_tick: spec.tick };
    diagram = numberLine(spec.parts, spec.tick);
  } else if (['compare_fractions', 'add_fractions', 'subtract_fractions'].includes(spec.op)) {
    const a = spec.left[0], b = spec.right[0], d = spec.left[1], left = fraction(spec.left), right = fraction(spec.right);
    if (spec.op === 'compare_fractions') {
      prompt = [
        `Choose <, = or >: ${left} ___ ${right}.`,
        `Two ribbons are the same whole length. Compare ${left} of one ribbon with ${right} of the other. Write <, = or >.`,
        `Two tracks are the same whole length. Mia walks ${left} of one and Leo walks ${right} of the other. Compare ${left} ___ ${right}.`,
        `Both bars show the same-sized whole. Write <, = or > between ${left} and ${right}.`,
      ][variant];
      hints = [`Both wholes are split into ${d} equal parts, so each part is the same size.`,
        `Compare ${a} with ${b}, the numbers of equal parts. Use < for less, > for greater, and = for equal.`];
      const relation = answer.value === '<' ? 'less than' : answer.value === '>' ? 'greater than' : 'equal to';
      solution = [`The denominators match, so compare the numbers of equal parts.`,
        `Compare the numerators: ${a} is ${relation} ${b}.`, `${left} ${answer.value} ${right}.`];
    } else if (spec.op === 'add_fractions') {
      prompt = [
        `Find ${left} + ${right}. Give a fraction or a whole number.`,
        `Two pieces of the same whole ribbon measure ${left} and ${right} of the whole. What fraction do they make together?`,
        `Ava colours ${left} of a sheet, then another ${right} of the same sheet. The parts do not overlap. What fraction is coloured?`,
        `Noah walks ${left} of a track, then another ${right} of that same track. What fraction has he walked altogether?`,
      ][variant];
      hints = [`The denominator ${d} describes the size of each equal part. That size stays the same.`,
        `Add the numerators, ${a} and ${b}. Put their total over ${d}; do not add the denominators.`];
      solution = [`Both fractions count the same-sized parts.`, `${a} + ${b} = ${a + b} parts.`,
        `${left} + ${right} = ${a + b}/${d}. An equivalent answer is ${answer.display}.`];
    } else {
      prompt = [
        `Find ${left} - ${right}. Give a fraction or a whole number.`,
        `There is ${left} of a whole ribbon. Ben uses ${right} of the original whole ribbon. What fraction of the original whole remains?`,
        `Isla has coloured ${left} of a sheet. She erases ${right} of the whole sheet from the coloured part. What fraction stays coloured?`,
        `A jug holds ${left} of its full capacity. After pouring out ${right} of its full capacity, what fraction of the capacity remains?`,
      ][variant];
      hints = [`Start with ${a} equal ${partWord(a)} and remove ${b}. All parts still have denominator ${d}.`,
        `Subtract ${b} from ${a}, then put the remaining count over ${d}. If no parts remain, the answer is zero.`];
      solution = [`We remove parts of the same size.`, `${a} - ${b} = ${a - b}, so ${a - b} ${partWord(a - b)} ${a - b === 1 ? 'remains' : 'remain'}.`,
        `${left} - ${right} = ${a - b}/${d}. An equivalent answer is ${answer.display}.`];
    }
    if (variant === 0 || variant === 3) {
      representation = { kind: 'fraction_bar', parts: d, shaded: a,
        diagram_note_en: spec.op === 'compare_fractions' ? 'The two bars show equal-sized wholes and the two given fractions.' : 'The bar shows the first fraction only; it does not show the answer.' };
      diagram = fractionBars(spec);
    }
  } else {
    const d = spec.denominator, n = spec.numerator || 1, fromPart = spec.op.startsWith('whole_from_');
    const one = Number(answer.one_part);
    if (spec.op === 'unit_of_whole') {
      prompt = [
        `Find 1/${d} of ${spec.whole}.`,
        `A box holds ${spec.whole} counters. How many counters are 1/${d} of the whole set?`,
        `A ribbon is ${spec.whole} cm long. How many centimetres are 1/${d} of its length?`,
        `There are ${spec.whole} seedlings. They are put into ${d} equal groups. How many seedlings are in one group?`,
      ][variant];
      hints = [`${spec.whole} is the whole amount. The denominator ${d} tells you how many equal parts to make.`,
        `Divide ${spec.whole} by ${d}. You need one part, so stop after finding the size of one equal part.`];
      solution = [`Split ${spec.whole} into ${d} equal parts.`, `${spec.whole} ÷ ${d} = ${one}.`,
        `One part is ${answer.display}. Check: ${one} × ${d} = ${spec.whole}.`];
    } else if (spec.op === 'whole_from_unit') {
      prompt = [
        `One part is ${spec.part}. It is 1/${d} of the whole amount. What is the whole amount?`,
        `1/${d} of a set is ${spec.part} beads. How many beads are in the whole set?`,
        `1/${d} of a ribbon is ${spec.part} cm long. How long is the whole ribbon in centimetres?`,
        `${spec.part} seedlings are 1/${d} of all the seedlings. How many seedlings are there altogether?`,
      ][variant];
      hints = [`The given ${spec.part} is one equal part, not the whole. There are ${d} such parts in the whole.`,
        `Make ${d} groups of ${spec.part}. Multiply the size of one part by the number of parts.`];
      solution = [`One equal part has value ${spec.part}.`, `The whole contains ${d} equal parts.`,
        `${spec.part} × ${d} = ${answer.display}. Check: ${answer.display} ÷ ${d} = ${spec.part}.`];
    } else if (spec.op === 'nonunit_of_whole') {
      prompt = [
        `Find ${n}/${d} of ${spec.whole}.`,
        `There are ${spec.whole} counters in a bag. How many counters are ${n}/${d} of the whole set?`,
        `A ribbon is ${spec.whole} cm long. How many centimetres are ${n}/${d} of the ribbon?`,
        `A tray holds ${spec.whole} seedlings. ${n}/${d} of them are ready to plant. How many are ready?`,
      ][variant];
      hints = [`Split the whole amount, ${spec.whole}, into ${d} equal parts. You want ${n} of those parts.`,
        `First divide ${spec.whole} by ${d} to find one part. Then multiply that one-part amount by ${n}.`];
      solution = [`One part is ${spec.whole} ÷ ${d} = ${one}.`, `${n} parts are ${one} × ${n} = ${answer.display}.`,
        `Check the whole: ${one} × ${d} = ${spec.whole}.`];
    } else {
      prompt = [
        `${n}/${d} of a whole amount is ${spec.part}. What is the whole amount?`,
        `${spec.part} beads are ${n}/${d} of a whole set. How many beads are in the whole set?`,
        `${n}/${d} of a ribbon is ${spec.part} cm long. How long is the whole ribbon in centimetres?`,
        `${spec.part} seedlings make up ${n}/${d} of a tray. How many seedlings are in the full tray?`,
      ][variant];
      hints = [`The given ${spec.part} covers ${n} equal parts, not one part and not the whole.`,
        `Divide ${spec.part} by ${n} to find one part. Then multiply that one-part amount by ${d} to rebuild the whole.`];
      solution = [`${n} equal parts have value ${spec.part}, so one part is ${spec.part} ÷ ${n} = ${one}.`,
        `The whole has ${d} parts: ${one} × ${d} = ${answer.display}.`,
        `Check the given part: ${one} × ${n} = ${spec.part}.`];
    }
    if (variant === 0 || variant === 3) {
      representation = { kind: 'quantity_bar', parts: d, known_parts: fromPart ? n : d,
        known_value: fromPart ? spec.part : spec.whole,
        diagram_note_en: fromPart ? 'The number over the bracket is the total for the bracketed parts. Rebuild the whole.' : 'The bracket labels the whole amount. Find the highlighted equal parts.' };
      diagram = quantityBar(spec, answer);
    }
    solutionDiagram = quantityBar(spec, answer, true);
  }
  return { id: `${lesson.id}-P${String(index + 1).padStart(3, '0')}`, stage: 'practice',
    prompt_en: prompt, answer_spec: spec, hints_en: hints, solution_en: solution,
    representation, transfer: variant !== 0, answer, observed_kp_id: lesson.kp_id,
    eligible_for_independent_evidence: false, diagram_svg: diagram, solution_svg: solutionDiagram,
    practice_version: PRACTICE_VERSION };
}

export function augmentContent(content) {
  if (!content || !Array.isArray(content.units)) throw new TypeError('Content with units is required.');
  const augmented = clone(content), ids = new Set(), blocked = new Set();
  for (const unit of augmented.units) for (const lesson of unit.lessons) {
    lesson.items = lesson.items.filter(item => item.practice_version !== PRACTICE_VERSION);
    for (const item of lesson.items) {
      if (ids.has(item.id)) throw new Error(`Duplicate original item ID: ${item.id}`);
      ids.add(item.id);
      blocked.add(practiceSignature(item.answer_spec));
    }
  }
  for (const unit of augmented.units) for (const lesson of unit.lessons) {
    const op = TARGET_OPS[lesson.kp_id];
    if (!op) continue;
    const specs = chooseSpecs(op, blocked, PRACTICE_ITEMS_PER_LESSON);
    const practice = specs.map((spec, index) => createItem(lesson, spec, index));
    for (const item of practice) {
      if (ids.has(item.id)) throw new Error(`Practice item ID already exists: ${item.id}`);
      ids.add(item.id);
    }
    lesson.items.push(...practice);
  }
  return augmented;
}

export function selectPracticeItems(lesson, count = DEFAULT_PRACTICE_COUNT, priorItemIds = []) {
  if (![10, 15, 20].includes(count)) throw new RangeError('Choose 10, 15 or 20 practice questions.');
  if (!lesson || !Array.isArray(lesson.items)) throw new TypeError('A lesson with items is required.');
  if (!Array.isArray(priorItemIds) && !(priorItemIds instanceof Set)) throw new TypeError('Prior item IDs must be an array or Set.');
  const counts = new Map();
  for (const id of priorItemIds) counts.set(id, (counts.get(id) || 0) + 1);
  const pool = lesson.items.filter(item => item.stage === 'practice' && [PRACTICE_VERSION, 'fern-curriculum-v1'].includes(item.practice_version));
  if (pool.length < count || new Set(pool.map(item => item.id)).size !== pool.length) throw new Error('This lesson does not have enough distinct practice questions.');
  const unseen = pool.filter(item => !counts.has(item.id));
  const repeated = pool.map((item, position) => ({ item, position })).filter(({ item }) => counts.has(item.id))
    .sort((a, b) => counts.get(a.item.id) - counts.get(b.item.id) || a.position - b.position).map(row => row.item);
  const fresh = unseen.slice(0, count), items = [...fresh, ...repeated.slice(0, count - fresh.length)];
  const newCount = fresh.length, repeatedCount = count - newCount;
  const notice = repeatedCount === 0 ? `${count} new practice questions.`
    : newCount === 0 ? `You have tried all the questions in this practice pool. These ${count} questions are practice again, not new checks.`
      : `${newCount} new questions remain for this group. The other ${repeatedCount} questions are practice again, not new checks.`;
  return { items, newCount, repeatedCount, remainingNewCount: Math.max(0, unseen.length - newCount),
    exhausted: unseen.length === 0, notice };
}

// ---- 30-question sets, shallow to deep -------------------------------------------------------
// Every curriculum practice question has a depth: 1 the plain skill, 2 the same idea from another
// angle (backwards, a missing number, in words), 3 a challenge (two steps, a mistake to find, a riddle).
// A lesson with enough depth-2 and depth-3 questions gets a 30-question set in three parts of ten.
export const DEEP_TIERS = Object.freeze([
  { depth: 1, label: 'Warm up', note: 'The plain skill, to get going.' },
  { depth: 2, label: 'Mix it up', note: 'The same idea from a new angle: backwards, a missing number, in words.' },
  { depth: 3, label: 'Challenge', note: 'Two steps, a mistake to find, or a riddle. Take your time.' },
]);
export const DEEP_PER_TIER = 10;
export const DEEP_SET_SIZE = DEEP_PER_TIER * DEEP_TIERS.length;
const curriculumPool = lesson => lesson.items.filter(item => item.stage === 'practice' && item.practice_version === 'fern-curriculum-v1' && [1, 2, 3].includes(item.depth));
export function deepLesson(lesson) {
  if (!lesson || !Array.isArray(lesson.items)) return false;
  const pool = curriculumPool(lesson);
  return pool.length >= DEEP_SET_SIZE + 6 && [2, 3].every(depth => pool.filter(item => item.depth === depth).length >= 12);
}
// own: the lesson's own-work questions still to be answered once; they close the Warm up part, so the
// child meets them before the harder questions. Each part draws from its own depth first (unseen
// questions first, then the least practised), then from the nearest depth when a lesson's bank is uneven.
export function selectDeepSet(lesson, priorItemIds = [], { own = [], perTier = DEEP_PER_TIER } = {}) {
  if (!deepLesson(lesson)) throw new Error('This lesson does not have a 30-question set yet.');
  if (!Array.isArray(priorItemIds) && !(priorItemIds instanceof Set)) throw new TypeError('Prior item IDs must be an array or Set.');
  const counts = new Map();
  for (const id of priorItemIds) counts.set(id, (counts.get(id) || 0) + 1);
  const pool = curriculumPool(lesson), taken = new Set(own.map(item => item.id));
  // The bank lists each question type in runs; taking one of each type in turn puts different types side by side.
  // A type is the question's skill (its template); variants of one template may use different names and nouns.
  const shape = item => item.representation?.skill || item.prompt_en.replace(/\d[\d,.]*/g, '#').replace(/\b[A-Z][a-z]+\b/g, 'N');
  const spread = list => {
    const groups = new Map();
    for (const item of list) { const key = shape(item); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(item); }
    const out = [], queues = [...groups.values()];
    while (out.length < list.length) for (const queue of queues) if (queue.length) out.push(queue.shift());
    return out;
  };
  const draw = (depth, n) => {
    const candidates = pool.map((item, position) => ({ item, position })).filter(({ item }) => item.depth === depth && !taken.has(item.id));
    const fresh = spread(candidates.filter(({ item }) => !counts.has(item.id)).map(row => row.item));
    const seen = spread(candidates.filter(({ item }) => counts.has(item.id)).sort((a, b) => counts.get(a.item.id) - counts.get(b.item.id) || a.position - b.position).map(row => row.item));
    const out = [...fresh, ...seen].slice(0, n);
    out.forEach(item => taken.add(item.id));
    return out;
  };
  const order = [[1, 2, 3], [2, 1, 3], [3, 2, 1]], tiers = [], items = [];
  DEEP_TIERS.forEach((tier, t) => {
    const want = perTier - (t === 0 ? own.length : 0);
    let picked = [];
    for (const depth of order[t]) { if (picked.length >= want) break; picked = picked.concat(draw(depth, want - picked.length)); }
    if (picked.length < want) throw new Error('This lesson does not have enough distinct practice questions.');
    if (t === 0) picked = picked.concat(own);
    tiers.push({ ...tier, start: items.length, end: items.length + picked.length });
    items.push(...picked);
  });
  const practice = items.filter(item => item.stage === 'practice');
  const repeatedCount = practice.filter(item => counts.has(item.id)).length, newCount = practice.length - repeatedCount;
  const notice = repeatedCount === 0 ? `${practice.length} new practice questions.`
    : newCount === 0 ? `You have tried all the questions in this practice pool. These ${practice.length} questions are practice again, not new checks.`
      : `${newCount} new questions remain for this group. The other ${repeatedCount} questions are practice again, not new checks.`;
  return { items, tiers, newCount, repeatedCount, notice };
}
