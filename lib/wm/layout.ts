import type { Axis, Direction, Node, Rect, WindowId } from "./types";

const clampRatio = (r: number) => Math.min(0.86, Math.max(0.14, r));

/**
 * Walk the tree and hand every leaf the rectangle it owns, gaps already
 * subtracted. This is the whole layout pass, run once per render.
 */
export function computeRects(
  node: Node | null,
  rect: Rect,
  gap: number,
  out: Map<WindowId, Rect> = new Map(),
): Map<WindowId, Rect> {
  if (!node) return out;

  if (node.kind === "leaf") {
    out.set(node.id, rect);
    return out;
  }

  if (node.dir === "h") {
    const aw = Math.max(0, Math.round((rect.w - gap) * node.ratio));
    computeRects(node.a, { x: rect.x, y: rect.y, w: aw, h: rect.h }, gap, out);
    computeRects(
      node.b,
      { x: rect.x + aw + gap, y: rect.y, w: Math.max(0, rect.w - aw - gap), h: rect.h },
      gap,
      out,
    );
  } else {
    const ah = Math.max(0, Math.round((rect.h - gap) * node.ratio));
    computeRects(node.a, { x: rect.x, y: rect.y, w: rect.w, h: ah }, gap, out);
    computeRects(
      node.b,
      { x: rect.x, y: rect.y + ah + gap, w: rect.w, h: Math.max(0, rect.h - ah - gap) },
      gap,
      out,
    );
  }

  return out;
}

export function leafIds(node: Node | null, out: WindowId[] = []): WindowId[] {
  if (!node) return out;
  if (node.kind === "leaf") {
    out.push(node.id);
    return out;
  }
  leafIds(node.a, out);
  leafIds(node.b, out);
  return out;
}

/**
 * Split the focused leaf along its longer axis and drop the new window in the
 * second half, which is what dwindle does.
 */
export function insertLeaf(
  node: Node | null,
  targetId: WindowId | null,
  newId: WindowId,
  dir: Axis,
): Node {
  const fresh: Node = { kind: "leaf", id: newId };
  if (!node) return fresh;
  if (!targetId || !leafIds(node).includes(targetId)) {
    return { kind: "split", dir, ratio: 0.5, a: node, b: fresh };
  }

  function walk(n: Node): Node {
    if (n.kind === "leaf") {
      if (n.id !== targetId) return n;
      return { kind: "split", dir, ratio: 0.5, a: n, b: fresh };
    }
    return { ...n, a: walk(n.a), b: walk(n.b) };
  }

  return walk(node);
}

/** Drop a leaf and collapse the split that held it into its sibling. */
export function removeLeaf(node: Node | null, id: WindowId): Node | null {
  if (!node) return null;
  if (node.kind === "leaf") return node.id === id ? null : node;

  const a = removeLeaf(node.a, id);
  const b = removeLeaf(node.b, id);
  if (!a) return b;
  if (!b) return a;
  if (a === node.a && b === node.b) return node;
  return { ...node, a, b };
}

export function swapLeaves(node: Node | null, x: WindowId, y: WindowId): Node | null {
  if (!node) return null;
  if (node.kind === "leaf") {
    if (node.id === x) return { kind: "leaf", id: y };
    if (node.id === y) return { kind: "leaf", id: x };
    return node;
  }
  return { ...node, a: swapLeaves(node.a, x, y)!, b: swapLeaves(node.b, x, y)! };
}

/**
 * Grow or shrink a window along one axis by moving the ratio of its nearest
 * ancestor split on that axis, and only that one.
 */
export function resizeLeaf(
  node: Node | null,
  id: WindowId,
  axis: Axis,
  amount: number,
): Node | null {
  if (!node) return null;

  type Result = { node: Node; found: boolean; done: boolean };

  function walk(n: Node): Result {
    if (n.kind === "leaf") {
      return { node: n, found: n.id === id, done: false };
    }

    const ra = walk(n.a);
    if (ra.found) {
      if (!ra.done && n.dir === axis) {
        return {
          node: { ...n, a: ra.node, ratio: clampRatio(n.ratio + amount) },
          found: true,
          done: true,
        };
      }
      return { node: { ...n, a: ra.node }, found: true, done: ra.done };
    }

    const rb = walk(n.b);
    if (rb.found) {
      if (!rb.done && n.dir === axis) {
        return {
          node: { ...n, b: rb.node, ratio: clampRatio(n.ratio - amount) },
          found: true,
          done: true,
        };
      }
      return { node: { ...n, b: rb.node }, found: true, done: rb.done };
    }

    return { node: n, found: false, done: false };
  }

  return walk(node).node;
}

const center = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

/**
 * Directional focus the way a window manager does it: nearest window whose
 * centre actually lies that way, perpendicular drift penalised.
 */
export function neighbor(
  rects: Map<WindowId, Rect>,
  id: WindowId,
  dir: Direction,
): WindowId | null {
  const from = rects.get(id);
  if (!from) return null;

  const fc = center(from);
  let best: WindowId | null = null;
  let bestScore = Infinity;

  for (const [wid, r] of rects) {
    if (wid === id) continue;
    const c = center(r);
    const dx = c.x - fc.x;
    const dy = c.y - fc.y;

    let primary: number;
    let perp: number;
    if (dir === "left") {
      if (dx > -1) continue;
      primary = -dx;
      perp = Math.abs(dy);
    } else if (dir === "right") {
      if (dx < 1) continue;
      primary = dx;
      perp = Math.abs(dy);
    } else if (dir === "up") {
      if (dy > -1) continue;
      primary = -dy;
      perp = Math.abs(dx);
    } else {
      if (dy < 1) continue;
      primary = dy;
      perp = Math.abs(dx);
    }

    const score = primary + perp * 2;
    if (score < bestScore) {
      bestScore = score;
      best = wid;
    }
  }

  return best;
}

export const axisOf = (dir: Direction): Axis =>
  dir === "left" || dir === "right" ? "h" : "v";

/** New splits follow the shape of the window being split, like dwindle. */
export const splitDirFor = (rect: Rect | undefined): Axis =>
  !rect || rect.w >= rect.h ? "h" : "v";
