// Today's plan on the child's home page: up to two short warm-ups from work already waiting
// (an unfinished fix-up set, topics ready to revisit, questions to fix), then one thing to learn
// (the unfinished practice set, otherwise the next topic in the child's year not yet practised).
// It only suggests an order; every year and topic stays open. Minutes use the practice timer's
// per-question time, so a whole new topic is the long step.

export const FIX_LIMIT = 5;            // a fix-up step from the plan takes at most this many questions
export const LOOK_MINUTES = 3;         // pictures and animation before a new practice set
export const SET_SIZE = 20;

const minutes = (questions, perQuestionSeconds) => Math.max(1, Math.round(questions * perQuestionSeconds / 60));

// dueReviews: [{ lessonId, title, dueDate, questions }]
// openMistakes: [{ lessonId, title, count, lastSeq }] for each lesson with questions still to fix
// currentSheet: { lessonId, title, kind: 'practice'|'mistakes', answered, total } for the unfinished set, or null
// path: [{ lessonId, title, practised, started }] in course order, starting from the child's starting year
export function buildTodayPlan({ dueReviews = [], openMistakes = [], currentSheet = null, path = [], perQuestionSeconds = 60 }) {
  const warmups = [];
  const fixing = currentSheet?.kind === 'mistakes' ? currentSheet : null;
  if (fixing) {
    const left = Math.max(1, fixing.total - fixing.answered);
    warmups.push({ kind: 'finish-fix', lessonId: fixing.lessonId, title: fixing.title, questions: left, minutes: minutes(left, perQuestionSeconds) });
  }
  const reviews = [...dueReviews].sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)) || a.lessonId.localeCompare(b.lessonId))
    .map(r => ({ kind: 'review', lessonId: r.lessonId, title: r.title, questions: r.questions, minutes: minutes(r.questions, perQuestionSeconds) }));
  const fixes = [...openMistakes].filter(m => m.lessonId !== fixing?.lessonId).sort((a, b) => b.lastSeq - a.lastSeq)
    .map(m => { const q = Math.min(FIX_LIMIT, m.count); return { kind: 'fix', lessonId: m.lessonId, title: m.title, questions: q, capped: m.count > q, minutes: minutes(q, perQuestionSeconds) }; });
  // Revisiting on the right day matters most, then fixing the most recent mistakes, then a second revisit.
  for (const step of [reviews[0], fixes[0], reviews[1]]) if (step && warmups.length < 2) warmups.push(step);

  let learn = null;
  if (currentSheet && currentSheet.kind !== 'mistakes') {
    const left = Math.max(1, currentSheet.total - currentSheet.answered);
    learn = { kind: 'continue', lessonId: currentSheet.lessonId, title: currentSheet.title, answered: currentSheet.answered, total: currentSheet.total, questions: left, minutes: minutes(left, perQuestionSeconds) };
  } else {
    const next = path.find(p => !p.practised);
    const size = next?.size || SET_SIZE; // a lesson with a deep bank has a 30-question set
    if (next) learn = { kind: next.started ? 'keep-going' : 'new', lessonId: next.lessonId, title: next.title, questions: size, minutes: LOOK_MINUTES + minutes(size, perQuestionSeconds) };
  }

  const steps = learn ? [...warmups, learn] : warmups;
  const shown = new Set(steps.filter(s => s.kind !== 'continue' && s.kind !== 'new' && s.kind !== 'keep-going').map(s => `${s.kind === 'finish-fix' ? 'fix' : s.kind}:${s.lessonId}`));
  // More is waiting on the Try again page than the plan shows: other topics, or the rest of a long fix-up list.
  const moreToTry = reviews.some(r => !shown.has(`review:${r.lessonId}`)) || fixes.some(f => !shown.has(`fix:${f.lessonId}`)) || steps.some(s => s.capped);
  return { steps, minutes: steps.reduce((n, s) => n + s.minutes, 0), moreToTry };
}
