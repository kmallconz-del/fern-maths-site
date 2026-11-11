/**
 * Pure browser/Node learning engine; no network, DOM, dependencies or eval.
 *
 * createInitialState(): {schemaVersion:1, activeChildId, children, attempts, exposures}.
 * gradeAnswer(raw, compiledAnswer): {valid, correct, normalized, error}.
 * recordExposure(state, {childId,lessonId,itemId,kind,at?}, content): new state.
 *   kind = seen | hint | solution | reading. Repeated views are deduplicated.
 * recordAttempt(state, {childId,lessonId,itemId,response,at?,id?}, content):
 *   {state, attempt|null, result}; invalid input does not consume an attempt.
 * getMastery(state, childId, kpId, scopeId, content):
 *   {status, independentCount, independentTransferCount, reviewCount,
 *    reviewTransferCount, independentDate, retainedDate, reviewDueDate,
 *    observedCount, supportedCount}. IndependentCount is the best qualifying
 *   single day's count, not a sum of isolated performances on different days.
 * getLessonProgress(state, childId, lessonOrId, content, today?):
 *   {mainCompleted,mainTotal,mainComplete,completedAt,reviewCompleted,reviewTotal,
 *    reviewDueDate,reviewAvailable,nextItemId,nextReviewItemId,needsNewReviewItems,
 *    mastery}. Completion measures participation, not correctness or mastery.
 *   mainTotal counts independent checks; entry/examples/guided work may be skipped.
 * getDueReviews(...): [{lessonId,lesson,dueDate,items,progress}], fresh items only.
 * validateState/importBackup: {valid,errors,state?}; invalid imports never mutate.
 * loadState: {state,error,recovered:false}; corrupt storage is preserved for recovery.
 * saveState: {ok,error}; exportBackup: JSON string. Storage is supplied by caller.
 *
 * Attempt facts are immutable. A later hint never retracts an earlier unaided
 * answer. Replaying an item (even after a version change) cannot add evidence.
 * A fresh review must occur after the qualifying independent calendar day;
 * two correct review items on one later day, including transfer, establish retention. Reopening
 * an unfinished main item is allowed. Review seen before it was due is not fresh.
 * Calendar dates preserve the browser's offset when the event was recorded.
 *
 * Item versions: every event stores the itemVersion it was answered against.
 * content.retiredItems (from dist/item-archive.json, built by
 * scripts/item-versions.mjs) lists earlier published versions so history stays
 * readable after an item is corrected. A retired version with evidence 'void'
 * (for example, its answer key changed) is kept as a historical fact but does
 * not count toward mastery; 'kept' versions still count; 'form' versions count
 * only for answers already written in the newly required form (requiredForm). A version that is
 * neither current nor retired is rejected, so edited or forged history fails.
 */

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'math-learning.progress.v1';
const MAX_ANSWER = 160;
const MAX_BACKUP = 25_000_000;
const MAX_EVENTS = 50_000;
const KINDS = new Set(['seen', 'hint', 'solution', 'reading']);
const catalogs = new WeakMap();

const clone = value => JSON.parse(JSON.stringify(value));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = (value, max = 200) => typeof value === 'string' && value.length > 0 && value.length <= max;
const ownKeysAre = (value, allowed) => Object.keys(value).every(key => allowed.includes(key));

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

function rational(n, d = 1n) {
  if (d === 0n) return null;
  if (d < 0n) [n, d] = [-n, -d];
  const factor = gcd(n, d);
  return { kind: 'number', numerator: String(n / factor), denominator: String(d / factor) };
}

/** Exact rational strings are JSON-safe; decimal input never uses floating point. */
export function parseAnswer(raw) {
  if (typeof raw !== 'string' || raw.length > MAX_ANSWER) return null;
  const value = raw.normalize('NFKC').replace(/[−–]/g, '-').replace(/[⁄∕]/g, '/').trim();
  if (!value || value.length > MAX_ANSWER) return null;
  if (['<', '=', '>'].includes(value)) return { kind: 'comparison', value };
  if ((value.match(/\d/g) || []).length > 100) return null;
  let match = value.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if (match) return rational(BigInt(match[1]), BigInt(match[2]));
  match = value.match(/^([+-]?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (match) {
    const whole = BigInt(match[1]), numerator = BigInt(match[2]), denominator = BigInt(match[3]);
    if (!denominator || numerator >= denominator) return null;
    const sign = match[1].startsWith('-') ? -1n : 1n;
    return rational(whole * denominator + sign * numerator, denominator);
  }
  if (/^[+-]?\d+$/.test(value)) return rational(BigInt(value));
  // Thousands separators as printed in prompts: 3,805 or 3 805 (strict groups of three only).
  match = value.match(/^([+-]?)(\d{1,3}(?:([, ])\d{3})(?:\3\d{3})*)(\.\d+)?$/);
  if (match) return parseAnswer(match[1] + match[2].replace(/[, ]/g, '') + (match[4] || ''));
  match = value.match(/^([+-]?)(\d*)\.(\d*)$/);
  if (match && (match[2] || match[3])) {
    const sign = match[1] === '-' ? -1n : 1n;
    return rational(sign * BigInt((match[2] || '0') + match[3]), 10n ** BigInt(match[3].length));
  }
  return null;
}

function expectedAnswer(answer) {
  if (answer?.answer) answer = answer.answer;
  if (typeof answer === 'string') return parseAnswer(answer);
  if (!isObject(answer)) return null;
  if (['<', '=', '>'].includes(answer.value)) return { kind: 'comparison', value: answer.value };
  if (Number.isSafeInteger(answer.numerator) && Number.isSafeInteger(answer.denominator)) {
    return rational(BigInt(answer.numerator), BigInt(answer.denominator));
  }
  return parseAnswer(answer.simplified ?? answer.display ?? '');
}

export function gradeAnswer(raw, answer) {
  const expected = expectedAnswer(answer);
  if (!expected) throw new Error('The content has no valid expected answer.');
  const parsed = parseAnswer(raw);
  if (!parsed || parsed.kind !== expected.kind) {
    return { valid: false, correct: false, normalized: null, error: expected.kind === 'comparison'
      ? 'Enter <, = or >.' : 'Enter a number, a fraction such as 2/3, or a decimal. The denominator cannot be zero.' };
  }
  // Some questions ask for a particular form ("Write 1/2 as a decimal"). Another form is not wrong
  // arithmetic, so it is returned as invalid input with a clear prompt and never consumes an attempt.
  const form = isObject(answer) ? answer.form : undefined;
  const typed = raw.normalize('NFKC').replace(/[⁄∕]/g, '/').trim();
  if (form === 'decimal' && typed.includes('/')) {
    return { valid: false, correct: false, normalized: null, error: 'This question asks for a decimal, such as 0.5.' };
  }
  if (form === 'fraction' && !/^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(typed)) {
    return { valid: false, correct: false, normalized: null, error: 'This question asks for one fraction, such as 7/4.' };
  }
  const normalized = parsed.kind === 'comparison' ? parsed.value
    : parsed.denominator === '1' ? parsed.numerator : `${parsed.numerator}/${parsed.denominator}`;
  const correct = parsed.kind === 'comparison' ? parsed.value === expected.value
    : BigInt(parsed.numerator) * BigInt(expected.denominator) === BigInt(expected.numerator) * BigInt(parsed.denominator);
  return { valid: true, correct, normalized, error: null };
}

export function createInitialState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    activeChildId: 'A',
    children: [
      { id: 'A', name: 'A', schoolYear: 4, age: 8, targetScopes: ['y4', 'y5'] },
      { id: 'B', name: 'B', schoolYear: 2, age: 6, targetScopes: ['y3'] },
    ],
    attempts: [], exposures: [],
  };
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (isObject(value)) return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function itemVersion(item) {
  const text = canonical({ id: item.id, prompt: item.prompt_en, spec: item.answer_spec, answer: item.answer,
    stage: item.stage, observed: item.observed_kp_id, eligible: item.eligible_for_independent_evidence,
    transfer: item.transfer, representation: item.representation });
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619) >>> 0;
  return `v1-${hash.toString(16).padStart(8, '0')}`;
}

function catalog(content) {
  if (catalogs.has(content)) return catalogs.get(content);
  if (!isObject(content) || !Array.isArray(content.units) || !Array.isArray(content.nodes)) throw new Error('Invalid lesson content.');
  const lessons = new Map(), items = new Map(), retired = new Map(), nodes = new Map(content.nodes.map(n => [n.id, n]));
  for (const unit of content.units) for (const lesson of unit.lessons) {
    if (lessons.has(lesson.id)) throw new Error('Duplicate lesson ID.');
    lessons.set(lesson.id, { lesson, audience: unit.audience, unitId: unit.id });
    for (const item of lesson.items) {
      if (items.has(item.id)) throw new Error('Duplicate item ID.');
      items.set(item.id, { item, lesson, audience: unit.audience, version: itemVersion(item) });
    }
  }
  for (const old of Array.isArray(content.retiredItems) ? content.retiredItems : []) {
    if (!isObject(old) || !nonempty(old.itemId) || !nonempty(old.version) || !nonempty(old.lessonId)
      || !['kept', 'void', 'form'].includes(old.evidence)
      || (old.evidence === 'form' && !['decimal', 'fraction'].includes(old.requiredForm)) || !expectedAnswer(old.answer)) throw new Error('Invalid retired item version.');
    if (items.get(old.itemId)?.version === old.version) continue;
    retired.set(`${old.itemId}@${old.version}`, old);
  }
  const result = { lessons, items, retired, nodes };
  catalogs.set(content, result);
  return result;
}

// The item definition an event was recorded against: the current item, or a retired snapshot.
function resolveVersion(index, itemId, version) {
  const found = index.items.get(itemId);
  if (found && found.version === version) return { item: found.item, lessonId: found.lesson.id,
    kpId: found.item.observed_kp_id || found.lesson.kp_id, scopeId: found.lesson.scope_id, retired: null };
  const old = index.retired.get(`${itemId}@${version}`);
  if (!old) return null;
  return { item: { answer: old.answer, stage: old.stage, representation: { kind: old.representation },
    transfer: old.transfer === true, eligible_for_independent_evidence: old.eligible === true },
  lessonId: old.lessonId, kpId: old.kpId, scopeId: old.scopeId, retired: old };
}

/** {current, retired, evidence, prompt_en} for one stored event, or null if the version is unknown. */
export function describeItemVersion(content, itemId, version) {
  const resolved = resolveVersion(catalog(content), itemId, version);
  if (!resolved) return null;
  return { current: !resolved.retired, retired: Boolean(resolved.retired), evidence: resolved.retired?.evidence || 'kept',
    prompt_en: resolved.retired ? resolved.retired.prompt_en || '' : resolved.item.prompt_en, reason: resolved.retired?.reason || '' };
}

function locate(state, input, content) {
  if (!state.children.some(child => child.id === input.childId)) throw new Error('Unknown child.');
  const found = catalog(content).items.get(input.itemId);
  if (!found || found.lesson.id !== input.lessonId) throw new Error('Unknown lesson or item.');
  return found;
}

export function getLessonsForChild(content, childId) {
  return [...catalog(content).lessons.values()].filter(x => x.audience === childId || x.audience === 'all')
    .map(({ lesson, unitId, audience }) => ({ ...lesson, unitId, audience }));
}

function validDay(day) {
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T12:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}

export function addDays(day, days) {
  if (!validDay(day) || !Number.isSafeInteger(days)) throw new Error('Invalid calendar date.');
  const date = new Date(`${day}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function dayWithOffset(at, offsetMinutes) {
  return new Date(new Date(at).getTime() - offsetMinutes * 60_000).toISOString().slice(0, 10);
}

export function todayKey(at = new Date()) {
  const date = new Date(at);
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid date.');
  return dayWithOffset(date.toISOString(), date.getTimezoneOffset());
}

function timestamp(at = new Date()) {
  const date = new Date(at);
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid event time.');
  const iso = date.toISOString(), offsetMinutes = date.getTimezoneOffset();
  return { at: iso, day: dayWithOffset(iso, offsetMinutes), offsetMinutes };
}

function nextSequence(state) {
  const max = Math.max(0, ...state.attempts.map(x => x.seq), ...state.exposures.map(x => x.seq));
  if (!Number.isSafeInteger(max + 1)) throw new Error('Event sequence is full.');
  if (state.attempts.length + state.exposures.length >= MAX_EVENTS) throw new Error('Local history is full. Export a backup before continuing.');
  return max + 1;
}

function contextFields(input, found) {
  return { childId: input.childId, lessonId: found.lesson.id, itemId: found.item.id,
    itemVersion: found.version, kpId: found.item.observed_kp_id || found.lesson.kp_id, scopeId: found.lesson.scope_id };
}

export function recordExposure(state, input, content) {
  const found = locate(state, input, content);
  if (!KINDS.has(input.kind)) throw new Error('Unknown exposure type.');
  if (state.exposures.some(x => x.childId === input.childId && x.itemId === input.itemId && x.kind === input.kind)) return clone(state);
  const event = { ...contextFields(input, found), ...timestamp(input.at), seq: nextSequence(state), kind: input.kind };
  return { ...state, exposures: [...state.exposures, event] };
}

function priorSupport(state, childId, itemId, beforeSeq = Infinity) {
  const has = kind => state.exposures.some(x => x.childId === childId && x.itemId === itemId && x.kind === kind && x.seq < beforeSeq);
  return { usedHint: has('hint'), viewedSolution: has('solution'), readingSupport: has('reading') };
}

function eligible(item, attempt) {
  return attempt.firstAttempt && attempt.correct && !attempt.usedHint && !attempt.viewedSolution
    && item.eligible_for_independent_evidence === true && ['independent', 'review'].includes(item.stage);
}

export function recordAttempt(state, input, content) {
  const found = locate(state, input, content);
  const result = gradeAnswer(input.response, found.item.answer);
  if (!result.valid) return { state, attempt: null, result };
  if (input.id && state.attempts.some(a => a.id === input.id)) {
    const existing = state.attempts.find(a => a.id === input.id);
    if (existing.childId !== input.childId || existing.itemId !== input.itemId || existing.response !== input.response) throw new Error('Attempt ID was already used.');
    return { state, attempt: existing, result };
  }
  let next = recordExposure(state, { ...input, kind: 'seen' }, content);
  for (const [field, kind] of [['usedHint', 'hint'], ['viewedSolution', 'solution'], ['readingSupport', 'reading']]) {
    if (input[field] === true) next = recordExposure(next, { ...input, kind }, content);
  }
  const seq = nextSequence(next);
  const attempt = { ...contextFields(input, found), ...timestamp(input.at), seq,
    id: input.id || `attempt-${seq}`, response: input.response, normalized: result.normalized,
    correct: result.correct, firstAttempt: !state.attempts.some(a => a.childId === input.childId && a.itemId === input.itemId),
    ...priorSupport(next, input.childId, input.itemId, seq), stage: found.item.stage,
    representation: found.item.representation?.kind || 'none', transfer: found.item.transfer === true,
  };
  if (!nonempty(attempt.id)) throw new Error('Invalid attempt ID.');
  attempt.eligible = eligible(found.item, attempt);
  return { state: { ...next, attempts: [...next.attempts, attempt] }, attempt, result };
}

function bestIndependentDay(attempts) {
  const byDay = new Map();
  for (const a of attempts) {
    if (!byDay.has(a.day)) byDay.set(a.day, []);
    byDay.get(a.day).push(a);
  }
  const rows = [...byDay].sort(([a], [b]) => a.localeCompare(b));
  const qualified = rows.find(([, list]) => list.length >= 2 && list.some(a => a.transfer));
  const best = qualified || rows.sort((a, b) => b[1].length - a[1].length || Number(b[1].some(x => x.transfer)) - Number(a[1].some(x => x.transfer)))[0];
  return { qualified, best };
}

export function getMastery(state, childId, kpId, scopeId, content) {
  const index = catalog(content);
  const observed = state.attempts.filter(a => a.childId === childId && a.kpId === kpId && a.scopeId === scopeId);
  // Answers to a voided (corrected) version stay in history but are not evidence. When a version was
  // retired only because a form is now required ("as a decimal"), answers already in that form still count.
  const counts = a => {
    const old = index.retired.get(`${a.itemId}@${a.itemVersion}`);
    if (!old || old.evidence === 'kept') return true;
    return old.evidence === 'form' && gradeAnswer(a.response, { ...old.answer, form: old.requiredForm }).valid;
  };
  const all = observed.filter(counts);
  const independent = all.filter(a => a.eligible && a.stage === 'independent');
  const { qualified, best } = bestIndependentDay(independent);
  const independentDate = qualified?.[0] || null;
  const orderedIndependent = qualified?.[1].slice().sort((a, b) => a.seq - b.seq) || [];
  const firstQualifiedIndex = orderedIndependent.findIndex((a, i, list) => i >= 1 && list.slice(0, i + 1).some(x => x.transfer));
  const qualifyingSeq = firstQualifiedIndex >= 0 ? orderedIndependent[firstQualifiedIndex].seq : Infinity;
  const review = all.filter(a => {
    if (!independentDate || !a.eligible || a.stage !== 'review' || a.day <= independentDate || a.seq <= qualifyingSeq) return false;
    const seen = state.exposures.find(e => e.childId === childId && e.itemId === a.itemId && e.kind === 'seen');
    return !seen || seen.day > independentDate;
  }).sort((a, b) => a.seq - b.seq);
  const reviewDays = bestIndependentDay(review);
  const retainedDate = reviewDays.qualified?.[0] || null;
  const supportedCount = all.filter(a => a.correct && !a.eligible && (a.usedHint || a.viewedSolution || ['guided', 'worked'].includes(a.stage))).length;
  const status = retainedDate ? 'retained' : independentDate ? 'independent' : supportedCount ? 'supported' : 'unobserved';
  return { status, independentCount: best?.[1].length || 0,
    independentTransferCount: best?.[1].filter(a => a.transfer).length || 0,
    reviewCount: reviewDays.best?.[1].length || 0, reviewTransferCount: reviewDays.best?.[1].filter(a => a.transfer).length || 0,
    independentDate, retainedDate, reviewDueDate: independentDate && !retainedDate ? addDays(independentDate, 1) : null,
    observedCount: observed.length, supportedCount };
}

function participation(state, childId, itemId) {
  return state.attempts.filter(a => a.childId === childId && a.itemId === itemId)
    .sort((a, b) => a.seq - b.seq)[0] || null;
}

export function getLessonProgress(state, childId, lessonOrId, content, today = todayKey()) {
  if (!validDay(today)) throw new Error('Invalid calendar date.');
  const lesson = typeof lessonOrId === 'string' ? catalog(content).lessons.get(lessonOrId)?.lesson : lessonOrId;
  if (!lesson) throw new Error('Unknown lesson.');
  const main = lesson.items.filter(i => i.stage === 'independent');
  const review = lesson.items.filter(i => i.stage === 'review');
  const done = main.map(i => participation(state, childId, i.id)).filter(Boolean);
  const reviewDone = review.map(i => participation(state, childId, i.id)).filter(Boolean);
  const mainComplete = main.length > 0 && done.length === main.length;
  const finalMain = mainComplete ? done.slice().sort((a, b) => b.seq - a.seq)[0] : null;
  const mastery = getMastery(state, childId, lesson.kp_id, lesson.scope_id, content);
  const baseDate = finalMain?.day;
  const reviewDueDate = mastery.status === 'retained' || reviewDone.length === review.length ? null : baseDate ? addDays(baseDate, 1) : null;
  const reviewAvailable = Boolean(reviewDueDate && today >= reviewDueDate);
  return { mainCompleted: done.length, mainTotal: main.length, mainComplete, completedAt: finalMain?.at || null,
    reviewCompleted: reviewDone.length, reviewTotal: review.length, reviewDueDate, reviewAvailable,
    nextItemId: main.find(i => !participation(state, childId, i.id))?.id || null,
    nextReviewItemId: reviewAvailable ? review.find(i => !participation(state, childId, i.id))?.id || null : null,
    needsNewReviewItems: review.length > 0 && reviewDone.length === review.length && mastery.status !== 'retained', mastery };
}

export function getDueReviews(state, childId, content, today = todayKey()) {
  return getLessonsForChild(content, childId).flatMap(lesson => {
    const progress = getLessonProgress(state, childId, lesson, content, today);
    if (!progress.reviewAvailable) return [];
    const items = lesson.items.filter(i => i.stage === 'review' && !participation(state, childId, i.id));
    return items.length ? [{ lessonId: lesson.id, lesson, dueDate: progress.reviewDueDate, items, progress }] : [];
  });
}

function safeJSON(value) {
  const seen = new Set();
  function check(v, depth) {
    if (depth > 15) throw new Error('State is too deeply nested.');
    if (v === null || typeof v === 'string' || typeof v === 'boolean') return;
    if (typeof v === 'number' && Number.isFinite(v)) return;
    if (typeof v !== 'object' || seen.has(v)) throw new Error('State must contain finite JSON values.');
    if (!Array.isArray(v) && Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) throw new Error('State must contain plain objects.');
    seen.add(v);
    for (const key of Object.keys(v)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('Unsafe state property.');
      check(v[key], depth + 1);
    }
    seen.delete(v);
  }
  check(value, 0);
  if (JSON.stringify(value).length > MAX_BACKUP) throw new Error('Backup is too large.');
}

function assert(condition, message) { if (!condition) throw new Error(message); }

export function validateState(value, content) {
  try {
    safeJSON(value);
    assert(isObject(value) && value.schemaVersion === SCHEMA_VERSION, 'Unsupported progress version.');
    assert(ownKeysAre(value, ['schemaVersion', 'activeChildId', 'children', 'attempts', 'exposures']), 'Unexpected progress field.');
    assert(Array.isArray(value.children) && value.children.length === 2, 'Both child profiles are required.');
    const childIds = new Set();
    for (const child of value.children) {
      assert(isObject(child) && ['A', 'B'].includes(child.id) && !childIds.has(child.id), 'Invalid child profile.');
      assert(ownKeysAre(child, ['id', 'name', 'schoolYear', 'age', 'targetScopes']), 'Unexpected child field.');
      assert(nonempty(child.name, 80) && Number.isInteger(child.schoolYear) && child.schoolYear >= 1 && child.schoolYear <= 13, 'Invalid child name or school year.');
      assert(child.age === null || Number.isInteger(child.age) && child.age >= 0 && child.age <= 21, 'Invalid child age.');
      assert(Array.isArray(child.targetScopes) && child.targetScopes.length > 0 && child.targetScopes.length <= 3
        && new Set(child.targetScopes).size === child.targetScopes.length && child.targetScopes.every(s => ['y3', 'y4', 'y5'].includes(s)), 'Invalid learning scopes.');
      childIds.add(child.id);
    }
    assert(childIds.has(value.activeChildId), 'Unknown active child.');
    assert(Array.isArray(value.attempts) && Array.isArray(value.exposures) && value.attempts.length + value.exposures.length <= MAX_EVENTS, 'Invalid history size.');
    const index = catalog(content), sequences = new Set(), attemptIds = new Set(), exposureKeys = new Set();
    const contextKeys = ['childId', 'lessonId', 'itemId', 'itemVersion', 'kpId', 'scopeId', 'at', 'day', 'offsetMinutes', 'seq'];
    const attemptKeys = [...contextKeys, 'id', 'response', 'normalized', 'correct', 'firstAttempt', 'usedHint', 'viewedSolution', 'readingSupport', 'stage', 'representation', 'transfer', 'eligible'];
    const history = [...value.attempts.map(record => ({ record, type: 'attempt' })), ...value.exposures.map(record => ({ record, type: 'exposure' }))];
    const retiredIds = new Set([...index.retired.values()].map(x => x.itemId));
    for (const { record: r, type } of history) {
      assert(isObject(r) && ownKeysAre(r, type === 'attempt' ? attemptKeys : [...contextKeys, 'kind']), 'Invalid event fields.');
      assert(childIds.has(r.childId), 'An event refers to an unknown child.');
      assert(index.items.has(r.itemId) || retiredIds.has(r.itemId), 'An event refers to an unknown lesson or item.');
      const found = resolveVersion(index, r.itemId, r.itemVersion);
      assert(found, 'The backup uses a version of an item that this app does not know.');
      assert(r.lessonId === found.lessonId, 'An event refers to an unknown lesson or item.');
      assert(r.kpId === found.kpId && r.scopeId === found.scopeId, 'The event target does not match the content.');
      assert(Number.isSafeInteger(r.seq) && r.seq > 0 && !sequences.has(r.seq), 'Duplicate or invalid event sequence.');
      sequences.add(r.seq);
      assert(typeof r.at === 'string' && Number.isFinite(Date.parse(r.at)) && new Date(r.at).toISOString() === r.at, 'Invalid event time.');
      assert(Number.isInteger(r.offsetMinutes) && r.offsetMinutes >= -840 && r.offsetMinutes <= 840
        && validDay(r.day) && r.day === dayWithOffset(r.at, r.offsetMinutes), 'Invalid local event date.');
      if (type === 'exposure') {
        const key = JSON.stringify([r.childId, r.itemId, r.kind]);
        assert(KINDS.has(r.kind) && !exposureKeys.has(key), 'Invalid or duplicate exposure.');
        exposureKeys.add(key);
      } else {
        assert(nonempty(r.id) && !attemptIds.has(r.id), 'Invalid or duplicate attempt ID.');
        attemptIds.add(r.id);
        assert(['correct', 'firstAttempt', 'usedHint', 'viewedSolution', 'readingSupport', 'transfer', 'eligible'].every(k => typeof r[k] === 'boolean'), 'Invalid attempt flags.');
        const grade = gradeAnswer(r.response, found.item.answer);
        assert(grade.valid && r.correct === grade.correct && r.normalized === grade.normalized, 'Stored answer or correctness was changed.');
        assert(r.stage === found.item.stage && r.representation === (found.item.representation?.kind || 'none') && r.transfer === (found.item.transfer === true), 'Attempt metadata differs from the item.');
      }
    }
    const replay = { ...value, attempts: [], exposures: [] };
    const attemptedItems = new Set(), supportByItem = new Map();
    history.sort((a, b) => a.record.seq - b.record.seq);
    for (const { record: r, type } of history) {
      const itemKey = JSON.stringify([r.childId, r.itemId]);
      if (!supportByItem.has(itemKey)) supportByItem.set(itemKey, new Set());
      const knownSupport = supportByItem.get(itemKey);
      if (type === 'exposure') { knownSupport.add(r.kind); replay.exposures.push(r); continue; }
      const first = !attemptedItems.has(itemKey);
      const support = { usedHint: knownSupport.has('hint'), viewedSolution: knownSupport.has('solution'), readingSupport: knownSupport.has('reading') };
      assert(r.firstAttempt === first && Object.keys(support).every(k => r[k] === support[k]), 'Attempt history or support flags were changed.');
      assert(knownSupport.has('seen'), 'An attempt has no preceding presentation.');
      assert(r.eligible === eligible(resolveVersion(index, r.itemId, r.itemVersion).item, r), 'Independent-evidence eligibility was changed.');
      replay.attempts.push(r);
      attemptedItems.add(itemKey);
    }
    return { valid: true, errors: [], state: clone({ ...value, attempts: replay.attempts, exposures: replay.exposures }) };
  } catch (error) { return { valid: false, errors: [error.message || 'Invalid progress data.'] }; }
}

function encodeStoredState(state) {
  const plain = JSON.stringify(state);
  if (plain.length < 1_000_000) return plain;
  const pack = records => {
    const columns = [...new Set(records.flatMap(record => Object.keys(record)))].sort();
    return { columns, rows: records.map(record => columns.map(key => record[key] ?? null)) };
  };
  return JSON.stringify({ storageFormat: 'fern-columns-v1', state: { ...state,
    attempts: pack(state.attempts), exposures: pack(state.exposures) } });
}

function decodeStoredState(value) {
  if (!isObject(value) || value.storageFormat !== 'fern-columns-v1') return value;
  assert(ownKeysAre(value, ['storageFormat', 'state']) && isObject(value.state), 'Invalid compact progress.');
  const unpack = table => {
    assert(isObject(table) && ownKeysAre(table, ['columns', 'rows']) && Array.isArray(table.columns)
      && table.columns.length <= 32 && table.columns.every(key => nonempty(key, 40)
        && !['__proto__', 'constructor', 'prototype'].includes(key))
      && new Set(table.columns).size === table.columns.length
      && Array.isArray(table.rows) && table.rows.length <= MAX_EVENTS, 'Invalid compact history.');
    return table.rows.map(row => {
      assert(Array.isArray(row) && row.length === table.columns.length, 'Incomplete compact history.');
      return Object.fromEntries(table.columns.map((key, i) => [key, row[i]]));
    });
  };
  return { ...value.state, attempts: unpack(value.state.attempts), exposures: unpack(value.state.exposures) };
}

export function saveState(storage, state, content) {
  const checked = validateState(state, content);
  if (!checked.valid) return { ok: false, error: checked.errors.join(' ') };
  try { storage.setItem(STORAGE_KEY, encodeStoredState(checked.state)); return { ok: true, error: null }; }
  catch { return { ok: false, error: 'Progress could not be saved in this browser. Export a backup before closing.' }; }
}

export function loadState(storage, content) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null || raw === undefined || raw === '') return { state: createInitialState(), error: null, recovered: false };
    if (typeof raw !== 'string' || raw.length > MAX_BACKUP) throw new Error('Saved progress is too large or invalid.');
    const checked = validateState(decodeStoredState(JSON.parse(raw)), content);
    if (!checked.valid) throw new Error(checked.errors.join(' '));
    return { state: checked.state, error: null, recovered: false };
  } catch (error) {
    return { state: createInitialState(), error: `Saved progress could not be loaded. The original storage has not been overwritten. ${error.message}`, recovered: false };
  }
}

export function exportBackup(state, content) {
  const checked = validateState(state, content);
  if (!checked.valid) throw new Error(checked.errors.join(' '));
  return JSON.stringify({ format: 'math-learning-backup', version: 1, exportedAt: new Date().toISOString(), state: checked.state }, null, 2);
}

export function importBackup(text, content) {
  try {
    if (typeof text !== 'string' || text.length > MAX_BACKUP) throw new Error('Backup is too large or invalid.');
    const backup = JSON.parse(text);
    safeJSON(backup);
    if (!isObject(backup) || backup.format !== 'math-learning-backup' || backup.version !== 1
      || !ownKeysAre(backup, ['format', 'version', 'exportedAt', 'state'])) throw new Error('This is not a supported learning backup.');
    if (typeof backup.exportedAt !== 'string' || !Number.isFinite(Date.parse(backup.exportedAt))) throw new Error('Invalid backup date.');
    return validateState(backup.state, content);
  } catch (error) { return { valid: false, errors: [error.message || 'The backup could not be read.'] }; }
}
