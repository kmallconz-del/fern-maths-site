// "Watch it move": a short, child-controlled animation after a lesson's three pictures.
// The child makes the picture move; the explanation appears once they have seen it. Nothing is saved
// as learning evidence. Each animation is plain SVG/CSS (no libraries), so it works offline on iPad and Mac.
//
// motion = { title, intro, explain, explain_zh (for the parent's notes), html(), mount(root, done) }
// mount wires the controls and calls done() once the child has seen the whole movement.

import { sq, isoCubes, project, drawFaces, cuboidFaces, prismFaces } from './motion-3d.mjs';
import { Y3 } from './motions-y3.mjs';
import { Y4 } from './motions-y4.mjs';
import { Y5 } from './motions-y5.mjs';
import { DEEP } from './motions-deep.mjs';
import { DEEP3 } from './deep-y3.mjs';
import { DEEP5 } from './deep-y5.mjs';
import { DEEP4 } from './deep-y4.mjs';


// ---- Y3-G02 · mirror fold: where does the dot land? -------------------------------------------
const mirrorFold = {
  title: 'Fold it over the mirror line',
  intro: 'The red dot is 3 squares from the mirror line. Fold the left side over.',
  explain: 'The red dot lands on B. A mirror partner is the same distance from the line, on the other side: 3 squares.',
  explain_zh: '对折后，红点落在 B。对称的两个点到镜子线一样远（都是 3 格），只是在线的两边。可以让孩子用手指数一数格子来验证。',
  html() {
    const grid = Array.from({ length: 13 }, (_, i) => `<line x1="${i * 25}" y1="0" x2="${i * 25}" y2="200" class="mv-grid"/>`).join('')
      + Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 25}" x2="300" y2="${i * 25}" class="mv-grid"/>`).join('');
    const spot = (x, label) => `<circle cx="${x}" cy="100" r="11" class="mv-spot"/><text x="${x}" y="140" class="mv-label">${label}</text>`;
    return `<div class="mv-fold" data-mv-fold>
      <svg viewBox="0 0 300 200" class="mv-svg" aria-hidden="true">${grid}
        ${spot(175, 'A')}${spot(225, 'B')}${spot(275, 'C')}
        <path d="M150 30 L210 55 L245 100 L210 150 L150 170" class="mv-outline"/>
        <line x1="150" y1="0" x2="150" y2="200" class="mv-mirror"/></svg>
      <div class="mv-fold-left"><svg viewBox="0 0 150 200" aria-hidden="true">
        <path d="M150 30 L90 55 L55 100 L90 150 L150 170 Z" class="mv-shape"/>
        <circle cx="75" cy="100" r="11" class="mv-dot"/></svg></div>
    </div>
    <div class="mv-controls"><button class="primary" data-mv-go>Fold it over</button><button class="secondary" data-mv-reset>Unfold</button></div>`;
  },
  mount(root, done) {
    const box = root.querySelector('[data-mv-fold]');
    root.querySelector('[data-mv-go]').onclick = () => { box.classList.add('folded'); setTimeout(done, motionTime(1400)); };
    root.querySelector('[data-mv-reset]').onclick = () => box.classList.remove('folded');
  },
};

// ---- Y3-M05 · quarter turns: where does the arrow point after a half turn? ------------------
const quarterTurns = {
  title: 'Turn the arrow',
  intro: 'The arrow points up. Each tap makes a quarter turn clockwise.',
  explain: 'Two quarter turns make a half turn, so the arrow now points down: the opposite way.',
  explain_zh: '每点一次转四分之一圈（一个直角）。转两次是半圈，箭头指向原来的反方向（向下）；转四次回到原处。',
  html() {
    const ticks = [0, 90, 180, 270].map(a => { const r = a * Math.PI / 180; return `<circle cx="${100 + 78 * Math.sin(r)}" cy="${100 - 78 * Math.cos(r)}" r="6" class="mv-tick"/>`; }).join('');
    return `<svg viewBox="0 0 200 200" class="mv-svg mv-dial" aria-hidden="true"><circle cx="100" cy="100" r="88" class="mv-face"/>${ticks}
      <g class="mv-arrow" data-mv-arrow><line x1="100" y1="100" x2="100" y2="38" class="mv-hand"/><path d="M100 26 L88 46 L112 46 Z" class="mv-head"/></g>
      <circle cx="100" cy="100" r="7" class="mv-pin"/></svg>
      <p class="mv-count" data-mv-count>0 quarter turns</p>
      <div class="mv-controls"><button class="primary" data-mv-go>Quarter turn ↻</button><button class="secondary" data-mv-reset>Start again</button></div>`;
  },
  mount(root, done) {
    let n = 0; const arrow = root.querySelector('[data-mv-arrow]'), count = root.querySelector('[data-mv-count]');
    const show = () => {
      arrow.style.transform = `rotate(${n * 90}deg)`;
      count.textContent = n === 0 ? '0 quarter turns' : n === 2 ? '2 quarter turns = a half turn' : n === 4 ? '4 quarter turns = a full turn, back to the start' : `${n} quarter turn${n === 1 ? '' : 's'}`;
    };
    root.querySelector('[data-mv-go]').onclick = () => { if (n >= 4) return; n++; show(); if (n === 2) setTimeout(done, motionTime(700)); };
    root.querySelector('[data-mv-reset]').onclick = () => { n = 0; show(); };
    show();
  },
};

// ---- Y4-M06 · volume layers: stack layers of 6 cubes -----------------------------------------
const volumeLayers = {
  title: 'Build the cuboid layer by layer',
  intro: 'One layer is 3 cubes across and 2 cubes deep: 6 cubes. Add layers to fill the cuboid.',
  explain: 'Every layer has the same 6 cubes, so 3 layers are 6 + 6 + 6 = 3 × 6 = 18 cubes. Cubes hidden inside still count.',
  explain_zh: '一层是 3 × 2 = 6 个小方块，每一层都一样，3 层就是 6 + 6 + 6 = 3 × 6 = 18 个。藏在里面看不见的方块也要算进去。',
  html() {
    return `<svg viewBox="0 0 300 200" class="mv-svg" aria-hidden="true">${isoCubes(1)}</svg>
      <p class="mv-count" data-mv-count>1 layer · 6 cubes</p>
      <div class="mv-controls"><button class="primary" data-mv-go>Add a layer</button><button class="secondary" data-mv-reset>Start again</button></div>`;
  },
  mount(root, done) {
    let n = 1; const count = root.querySelector('[data-mv-count]');
    const show = () => {
      root.querySelectorAll('[data-mv-layer]').forEach(g => g.classList.toggle('in', Number(g.dataset.mvLayer) < n));
      count.textContent = `${n} layer${n === 1 ? '' : 's'} · ${Array(n).fill(6).join(' + ')} = ${6 * n} cubes`;
    };
    root.querySelector('[data-mv-go]').onclick = () => { if (n >= 3) return; n++; show(); if (n === 3) setTimeout(done, motionTime(700)); };
    root.querySelector('[data-mv-reset]').onclick = () => { n = 1; show(); };
    show();
  },
};

function animate(from, to, ms, frame) {
  const t0 = performance.now(), dur = motionTime(ms);
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    frame(Object.fromEntries(Object.keys(to).map(key => [key, from[key] + (to[key] - from[key]) * e])));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---- Y4-G03 · views: turn a 3 × 2 × 1 cuboid to see front, top and side ----------------------
const VIEWS = { turn: { rx: -28, ry: -35 }, front: { rx: 0, ry: 0 }, top: { rx: -90, ry: 0 }, side: { rx: 0, ry: -90 } };
const cuboidViews = {
  title: 'Turn the cuboid',
  intro: 'This cuboid is 3 cubes across, 2 cubes deep and 1 cube high. Look at it from the front, the top and the side.',
  explain: 'From the top you see 3 across and 2 deep: 3 × 2 = 6 squares. The height disappears in this view.',
  explain_zh: '同一个长方体，从正面、上面、侧面看，看到的形状不一样。从上面看是 3 × 2 = 6 个正方形，因为从这个方向看不出高度。',
  html() {
    return `<svg viewBox="0 0 300 220" class="mv-svg" aria-hidden="true"><g data-mv-solid></g></svg>
      <p class="mv-count" data-mv-count>Turn it to see each view.</p>
      <div class="mv-controls">${[['turn', '3D'], ['front', 'Front'], ['top', 'Top'], ['side', 'Side']].map(([v, l]) => `<button class="secondary" data-mv-view="${v}" aria-pressed="${v === 'turn'}">${l}</button>`).join('')}</div>`;
  },
  mount(root, done) {
    const g = root.querySelector('[data-mv-solid]'), count = root.querySelector('[data-mv-count]'), faces = cuboidFaces();
    let view = { ...VIEWS.turn };
    const draw = v => { view = v; g.innerHTML = drawFaces(faces, v, 46, 150, 110, { cull: true }); };
    const say = { turn: 'Turn it to see each view.', front: 'Front view: 3 squares (3 across, 1 high).', top: 'Top view: 6 squares (3 across, 2 deep).', side: 'Side view: 2 squares (2 deep, 1 high).' };
    root.querySelectorAll('[data-mv-view]').forEach(b => b.onclick = () => {
      const name = b.dataset.mvView; count.textContent = say[name];
      root.querySelectorAll('[data-mv-view]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      animate(view, VIEWS[name], 900, draw);
      if (name === 'top') setTimeout(done, motionTime(1000));
    });
    draw(view);
  },
};

// ---- Y5-G02 · net to triangular prism ---------------------------------------------------------
const prismNet = {
  title: 'Fold the net',
  intro: 'This net has 3 rectangles and 2 triangles. Slide to fold it up.',
  explain: 'It folds into a triangular prism: two matching triangle ends joined by 3 rectangles.',
  explain_zh: '3 个长方形和 2 个三角形可以折成三棱柱：两个一样的三角形是两头，3 个长方形围成侧面。',
  html() {
    return `<svg viewBox="0 0 300 220" class="mv-svg" aria-hidden="true"><g data-mv-solid></g></svg>
      <div class="mv-slider"><span>Flat</span><input type="range" min="0" max="100" step="1" value="0" data-mv-range aria-label="Fold the net"><span>Folded</span></div>`;
  },
  mount(root, done) {
    const g = root.querySelector('[data-mv-solid]'), range = root.querySelector('[data-mv-range]'), view = { rx: -50, ry: -35 };
    let seen = false;
    const draw = () => { g.innerHTML = drawFaces(prismFaces(range.value / 100), view, 52, 150, 120); };
    range.oninput = () => { draw(); if (!seen && range.value >= 95) { seen = true; done(); } };
    draw();
  },
};

// Respect a device's "reduce motion" setting: shorter waits (CSS also shortens the transitions).
function motionTime(ms) {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : ms;
}

export const MOTIONS = {
  ...Object.fromEntries(Object.entries(Y3).map(([k, m]) => ['Y3-' + k, m])),
  ...Object.fromEntries(Object.entries(Y4).map(([k, m]) => ['Y4-' + k, m])),
  ...Object.fromEntries(Object.entries(Y5).map(([k, m]) => ['Y5-' + k, m])),
  'Y5-G03': Y4.G04, // slide, flip and turn: the same idea as Year 4
  'Y3-G02': mirrorFold,
  'Y3-M05': quarterTurns,
  'Y4-M06': volumeLayers,
  'Y4-G03': cuboidViews,
  'Y5-G02': prismNet,
  'Y5-M05': volumeLayers, // layers of 6 cubes: the same picture as Year 4
  ...DEEP3, // Year 3: every lesson is a longer one
  ...DEEP4, // Year 4: every lesson is a longer one
  ...DEEP5, // Year 5: every lesson is a longer one
  ...DEEP, // pilot: longer lessons (see it → why it works → try another → remember)
};
export const motionFor = id => MOTIONS[id] || null;
