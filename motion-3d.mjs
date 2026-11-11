// Small 3D-in-SVG helpers shared by the animations (no CSS 3D, so every browser draws them the same way).

export const sq = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`;

export function isoCubes(layers, total = 3) {
  const s = 26, ox = 150, oy = 120;
  const p = (x, y, z) => [ox + (x - y) * s * 0.866, oy + (x + y) * s * 0.5 - z * s];
  const face = (pts, cls) => `<polygon points="${pts.map(q => sq(...q)).join(' ')}" class="${cls}"/>`;
  let out = '';
  for (let z = 0; z < total; z++) {
    let g = '';
    const cubes = [];
    for (let x = 0; x < 3; x++) for (let y = 0; y < 2; y++) cubes.push([x, y]);
    cubes.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    for (const [x, y] of cubes) {
      g += face([p(x, y, z + 1), p(x + 1, y, z + 1), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1)], 'mv-top')
        + face([p(x, y + 1, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1)], 'mv-left')
        + face([p(x + 1, y, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x + 1, y, z + 1)], 'mv-right');
    }
    out += `<g class="mv-layer ${z < layers ? 'in' : ''}" data-mv-layer="${z}">${g}</g>`;
  }
  return out;
}

// ---- small 3D-in-SVG helper (no CSS 3D, so every browser draws it the same way) ---------------
// Points are [x, y, z] with y pointing down. view = {rx, ry} in degrees: turn about the vertical axis (ry), then tilt (rx).
export function project([x, y, z], { rx, ry }, scale, cx, cy) {
  const a = ry * Math.PI / 180, b = rx * Math.PI / 180;
  const x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a);
  const y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
  return [cx + x1 * scale, cy + y2 * scale, z2];
}
export function drawFaces(faces, view, scale, cx, cy, { cull = false } = {}) {
  const drawn = faces.map(f => {
    const pts = f.pts.map(q => project(q, view, scale, cx, cy));
    const depth = pts.reduce((t, q) => t + q[2], 0) / pts.length;
    const [p0, p1, p2] = pts, nz = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
    return { pts, depth, nz, cls: f.cls };
  }).filter(f => !cull || f.nz > 1e-6).sort((a, b) => a.depth - b.depth);
  return drawn.map(f => `<polygon points="${f.pts.map(q => sq(q[0], q[1])).join(' ')}" class="${f.cls}"/>`).join('');
}

export function cuboidFaces(W = 3, H = 1, D = 2) {
  const faces = [];
  const add = (corner, u, v, nu, nv, cls) => {
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const at = (a, b) => corner.map((c, k) => c + u[k] * a + v[k] * b);
      faces.push({ pts: [at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)], cls });
    }
  };
  const x0 = -W / 2, y0 = -H / 2, z0 = -D / 2;
  add([x0, y0, z0 + D], [1, 0, 0], [0, 1, 0], W, H, 'mv-front');          // front (z+), facing viewer
  add([x0 + W, y0, z0], [-1, 0, 0], [0, 1, 0], W, H, 'mv-front');         // back
  add([x0 + W, y0, z0 + D], [0, 0, -1], [0, 1, 0], D, H, 'mv-side');      // right (x+)
  add([x0, y0, z0], [0, 0, 1], [0, 1, 0], D, H, 'mv-side');               // left
  add([x0, y0, z0], [1, 0, 0], [0, 0, 1], W, D, 'mv-topface');            // top (y-)
  add([x0, y0 + H, z0 + D], [1, 0, 0], [0, 0, -1], W, D, 'mv-topface');   // bottom
  return faces;
}

export function prismFaces(t) {
  const a = 1.2, L = 2.4, h = a * Math.sqrt(3) / 2, phi = 2 * Math.PI / 3 * t, psi = Math.PI / 2 * t, x = a / 2, z = L / 2;
  const far = s => [s * (x + a * Math.cos(phi)), -a * Math.sin(phi)];
  const [lx, ly] = far(-1), [rx, ry] = far(1);
  const apex = s => [0, -h * Math.sin(psi), s * (z + h * Math.cos(psi))];
  return [
    { pts: [[-x, 0, -z], [x, 0, -z], [x, 0, z], [-x, 0, z]], cls: 'mv-base' },
    { pts: [[-x, 0, -z], [-x, 0, z], [lx, ly, z], [lx, ly, -z]], cls: 'mv-wall' },
    { pts: [[x, 0, -z], [x, 0, z], [rx, ry, z], [rx, ry, -z]], cls: 'mv-wall' },
    { pts: [[-x, 0, z], [x, 0, z], apex(1)], cls: 'mv-end' },
    { pts: [[-x, 0, -z], [x, 0, -z], apex(-1)], cls: 'mv-end' },
  ];
}

// ---- unit cubes at any angle (for lessons the child can turn by dragging) ----------------------
// World points are [x, y, z] in cube units with y pointing UP; oy is the height that sits at the screen centre.
// cubes: [{ p: centre, tone: [top, side, front] colours, op: 0–1 }], drawn back to front.
export const LAYER_TONES = [[[217, 238, 227], [154, 214, 191], [93, 187, 155]], [[251, 233, 183], [245, 206, 117], [226, 176, 79]], [[214, 230, 250], [159, 194, 239], [122, 165, 221]]]; // per layer: top, side, front
export const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export const hex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const CUBE_FACES = [ // outward normal, its four corners (as ±1 offsets of half a cube), which tone it takes
  [[0, 1, 0], [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]], 0],
  [[0, -1, 0], [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]], 2],
  [[1, 0, 0], [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]], 1],
  [[-1, 0, 0], [[-1, -1, -1], [-1, 1, -1], [-1, 1, 1], [-1, -1, 1]], 1],
  [[0, 0, 1], [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], 2],
  [[0, 0, -1], [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]], 2],
];
const world = (view, scale, cx, cy, oy) => ([x, y, z]) => project([x, oy - y, z], view, scale, cx, cy);
export function drawCubes(cubes, view, scale, cx, cy, oy = 0) {
  const P = world(view, scale, cx, cy, oy);
  const seen = CUBE_FACES.map(f => project([f[0][0], -f[0][1], f[0][2]], view, 1, 0, 0)[2] > 1e-6); // faces turned towards the viewer
  return cubes.filter(c => (c.op ?? 1) > 0.01).map(c => ({ c, d: P(c.p)[2] })).sort((a, b) => a.d - b.d).map(({ c }) => {
    const faces = CUBE_FACES.map((f, i) => (seen[i] ? `<polygon points="${f[1].map(o => { const q = P([c.p[0] + o[0] / 2, c.p[1] + o[1] / 2, c.p[2] + o[2] / 2]); return sq(q[0], q[1]); }).join(' ')}" fill="${c.tone[f[2]]}"/>` : '')).join('');
    return `<g class="mv-cube"${(c.op ?? 1) < 0.99 ? ` opacity="${(c.op).toFixed(2)}"` : ''}>${faces}</g>`;
  }).join('');
}
// The outline of a W × H × D box standing on the floor: the three edges at the far corner go behind the cubes.
export function wireBox(W, H, D, view, scale, cx, cy, oy = 0) {
  const P = world(view, scale, cx, cy, oy), V = [];
  for (let i = 0; i < 8; i++) { const b = [i & 1, (i >> 1) & 1, (i >> 2) & 1]; V.push({ b, q: P([(b[0] - .5) * W, b[1] * H, (b[2] - .5) * D]) }); }
  const far = V.reduce((m, v, i) => (v.q[2] < V[m].q[2] ? i : m), 0);
  let back = '', front = '';
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
    if (V[i].b.filter((v, n) => v !== V[j].b[n]).length !== 1) continue;
    const hidden = i === far || j === far, ln = `<line x1="${V[i].q[0].toFixed(1)}" y1="${V[i].q[1].toFixed(1)}" x2="${V[j].q[0].toFixed(1)}" y2="${V[j].q[1].toFixed(1)}" class="mv-wire${hidden ? ' back' : ''}"/>`;
    if (hidden) back += ln; else front += ln;
  }
  return { back, front };
}
// The floor under a W × D box, one square per cube.
export function floorGrid(W, D, view, scale, cx, cy, oy = 0) {
  const P = world(view, scale, cx, cy, oy);
  let out = '';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) out += `<polygon points="${[[x, z], [x + 1, z], [x + 1, z + 1], [x, z + 1]].map(([a, b]) => { const q = P([a - W / 2, 0, b - D / 2]); return sq(q[0], q[1]); }).join(' ')}" class="mv-floor"/>`;
  return out;
}

// ---- nets of unit squares that fold --------------------------------------------------------------
// cells: [[col, row], …] on a grid (col → x, row → z, towards the viewer). The net is hinged edge to edge,
// outwards from cells[root]; t folds every hinge from flat (0) to a right angle (1). Returns faces for
// drawFaces (y pointing down), centred on the root square. cls(i) names the class of cell i.
export function netFaces(cells, root, t, cls = () => 'mv-netface') {
  const th = Math.PI / 2 * t, c = Math.cos(th), s = Math.sin(th);
  const fold = { // a point of the child square, in its own frame → the parent's frame, hinge turned by th
    E: ([x, y, z]) => [1 + x * c - y * s, x * s + y * c, z],
    W: ([x, y, z]) => [(x - 1) * c + y * s, -(x - 1) * s + y * c, z],
    S: ([x, y, z]) => [x, z * s + y * c, 1 + z * c - y * s],
    N: ([x, y, z]) => [x, -(z - 1) * s + y * c, (z - 1) * c + y * s],
  };
  const link = Array(cells.length).fill(null), queue = [root], seen = new Set([root]);
  while (queue.length) {
    const i = queue.shift(), [ci, ri] = cells[i];
    for (const [side, dc, dr] of [['W', -1, 0], ['E', 1, 0], ['S', 0, 1], ['N', 0, -1]]) {
      const j = cells.findIndex(([cc, rr]) => cc === ci + dc && rr === ri + dr);
      if (j >= 0 && !seen.has(j)) { seen.add(j); link[j] = [i, side]; queue.push(j); }
    }
  }
  const place = (i, p) => { while (link[i]) { p = fold[link[i][1]](p); i = link[i][0]; } return p; };
  return cells.map((_, i) => ({ cls: cls(i), pts: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]].map(q => { const [x, y, z] = place(i, q); return [x - .5, -y, z - .5]; }) }));
}
// The corners and edges of a set of faces, each listed once (for counting vertices and edges).
export function cornersAndEdges(faces) {
  const key = p => p.map(v => Math.round(v * 100) / 100 + 0).join(','), corners = new Map(), edges = new Map();
  for (const f of faces) f.pts.forEach((p, i) => { const q = f.pts[(i + 1) % f.pts.length], a = key(p), b = key(q); corners.set(a, p); if (a !== b) edges.set([a, b].sort().join('|'), [p, q]); });
  return { corners: [...corners.values()], edges: [...edges.values()] };
}
