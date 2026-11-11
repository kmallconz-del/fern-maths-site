// Idea lines: one idea followed from Year 3 to Year 8, one lesson a year. The 18 lines are the
// curriculum's cross-year paths (curriculum-work/progression.json) with short names for the child
// and Chinese names for the parent. A line is a suggested order, never a lock: a child who has
// finished Year 3 adding can go straight on to Year 4 adding without finishing the rest of Year 3.
// (2026-11-05, a parent decision.)
const L = (id, title_en, title_zh, lessonIds) => ({ id, title_en, title_zh, lessonIds });
export const LINES = Object.freeze([
  L('L01', 'Place value', '位值与幂', ['Y3-N01', 'Y4-N01', 'Y5-N01', 'Y6-N01', 'Y7-N01', 'Y8-N01']),
  L('L02', 'Rounding and estimating', '取整与估算', ['Y3-N04', 'Y4-N02', 'Y5-N02', 'Y6-N04', 'Y7-N05', 'Y8-N04']),
  L('L03', 'Adding and subtracting', '加减法与数轴', ['Y3-N09', 'Y4-N04', 'Y5-N04', 'Y6-N07', 'Y7-N04', 'Y8-N03']),
  L('L04', 'Multiplying and dividing', '乘除法', ['Y3-N13', 'Y4-N08', 'Y5-N07', 'Y6-N09', 'Y7-N05', 'Y8-N04']),
  L('L05', 'Same amount, different names', '等值分数、小数与百分数', ['Y3-N18', 'Y4-N11', 'Y5-N10', 'Y6-N12', 'Y7-N07', 'Y8-N06']),
  L('L06', 'Parts and wholes', '部分与整体', ['Y3-N20', 'Y4-N16', 'Y5-N13', 'Y6-N15', 'Y7-N09', 'Y8-N07']),
  L('L07', 'Money', '钱', ['Y3-N23', 'Y4-N19', 'Y5-N15', 'Y6-N17', 'Y7-N12', 'Y8-N12']),
  L('L08', 'Balance and equations', '等式与方程', ['Y3-A01', 'Y4-A01', 'Y5-A01', 'Y6-A01', 'Y7-A01', 'Y8-A01']),
  L('L09', 'Patterns and rules', '规律与规则', ['Y3-A02', 'Y4-A03', 'Y5-A02', 'Y6-A02', 'Y7-A04', 'Y8-A05']),
  L('L10', 'Measuring', '测量与单位', ['Y3-M01', 'Y4-M01', 'Y5-M02', 'Y6-M02', 'Y7-M01', 'Y8-M01']),
  L('L11', 'Area', '面积', ['Y3-M04', 'Y4-M04', 'Y5-M03', 'Y6-M03', 'Y7-M03', 'Y8-M02']),
  L('L12', 'Volume', '体积与立体', ['Y4-M06', 'Y5-M05', 'Y6-M04', 'Y7-M04', 'Y8-M04']),
  L('L13', 'Turns and angles', '转动与角', ['Y3-M05', 'Y4-M07', 'Y5-M06', 'Y6-M05', 'Y7-G02', 'Y8-G02']),
  L('L14', 'Time', '时间与时长', ['Y3-M07', 'Y4-M09', 'Y5-M07', 'Y6-M06', 'Y7-M05', 'Y8-M05']),
  L('L15', 'Maps and directions', '地图与方位', ['Y3-G04', 'Y4-G05', 'Y5-G04', 'Y6-G06', 'Y7-G05', 'Y8-G04']),
  L('L16', 'Slides, flips and turns', '图形的平移、翻折与旋转', ['Y3-G02', 'Y4-G04', 'Y5-G03', 'Y6-G05', 'Y7-G03', 'Y8-G03']),
  L('L17', 'Data stories', '读懂数据', ['Y3-S03', 'Y4-S04', 'Y5-S03', 'Y6-S03', 'Y7-S07', 'Y8-S05']),
  L('L18', 'Chance', '可能性', ['Y5-P02', 'Y6-P02', 'Y7-P02', 'Y8-P02']),
]);

export const lineById = id => LINES.find(l => l.id === id) || null;
// A lesson can sit on two lines (Year 7–8 estimating and dividing share lessons).
export const linesOf = lessonId => LINES.filter(l => l.lessonIds.includes(lessonId));
export const yearOf = lessonId => Number(lessonId.slice(1, 2));

// Where a child is on a line: the first step from their starting year on that is not practised yet.
// Steps below the starting year count only when the child has done them. Returns the index, or -1
// when every step from the start is practised.
export function nextStepIndex(line, { startYear = 3, practised = () => false } = {}) {
  return line.lessonIds.findIndex(id => yearOf(id) >= startYear && !practised(id));
}

// The lesson after this one on each of its lines (deduplicated), for "same idea next year".
export function nextOnLines(lessonId) {
  const out = [];
  for (const line of linesOf(lessonId)) {
    const next = line.lessonIds[line.lessonIds.indexOf(lessonId) + 1];
    if (next && !out.some(o => o.lessonId === next)) out.push({ line, lessonId: next });
  }
  return out;
}
