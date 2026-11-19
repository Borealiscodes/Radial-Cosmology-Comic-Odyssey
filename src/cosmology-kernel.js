import { toQ16, fromQ16, qAdd, qSub, qMul, sha256Hex } from "./core.js";
import { createSacredGeometryState, applySacredOperator } from "./buddhism-algebra.js";
import { createCpu6502State, stepCpu6502Cycle } from "./cpu6502-bus.js";

export const ARENA_W = 680;
export const ARENA_H = 480;
export const CENTER_X = 340;
export const CENTER_Y = 235;

export function createRadialNodesForAct(actIndex) {
  const count = 6 + actIndex * 3 + (actIndex === 3 ? 1 : 0);
  const radius = 115 + actIndex * 18;
  return Array.from({ length: count }, (_, i) => {
    const theta = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      id: i,
      sectorS16: i & 0x0f,
      xQ16: toQ16(CENTER_X + Math.cos(theta) * radius),
      yQ16: toQ16(CENTER_Y + Math.sin(theta) * radius),
      illuminated: false,
      glowQ16: 0,
    };
  });
}

export function createOdysseyState(actIndex = 0) {
  const clampedAct = Math.max(0, Math.min(3, actIndex | 0));
  const startX = toQ16(CENTER_X);
  const startY = toQ16(CENTER_Y + 120);

  const ribbon = Array.from({ length: 14 }, (_, i) => ({
    xQ16: startX,
    yQ16: qAdd(startY, toQ16(i * 5.5)),
    oldXQ16: startX,
    oldYQ16: qAdd(startY, toQ16(i * 5.5)),
  }));

  return {
    tick: 0,
    actIndex: clampedAct,
    traveler: {
      xQ16: startX,
      yQ16: startY,
      vxQ16: 0,
      vyQ16: 0,
    },
    ribbon,
    paintStrokes: [],
    nodes: createRadialNodesForAct(clampedAct),
    sacredGeo: createSacredGeometryState(),
    cpu6502: createCpu6502State(),
    pulseRadiusQ16: 0,
  };
}

export function addBrushStroke(state, x1, y1, x2, y2, width = 7) {
  const stroke = {
    x1Q16: toQ16(x1),
    y1Q16: toQ16(y1),
    x2Q16: toQ16(x2),
    y2Q16: toQ16(y2),
    actIndex: state.actIndex,
    op: state.sacredGeo.samsaraLotus.activeOperator,
    width,
  };
  const nextStrokes = state.paintStrokes.length >= 600
    ? [...state.paintStrokes.slice(1), stroke]
    : [...state.paintStrokes, stroke];
  return { ...state, paintStrokes: nextStrokes };
}

export function triggerRadialChime(state, opName = null) {
  const op = opName || state.sacredGeo.samsaraLotus.activeOperator;
  const nextGeo = applySacredOperator(state.sacredGeo, op);
  const nextCpu = stepCpu6502Cycle(state.cpu6502, nextGeo.s16State, state.actIndex, op);

  return {
    ...state,
    sacredGeo: nextGeo,
    cpu6502: nextCpu,
    pulseRadiusQ16: toQ16(12),
  };
}

export function stepOdysseyFrame(state, accelXQ16 = 0, accelYQ16 = 0) {
  const tick = state.tick + 1;
  const dtQ16 = toQ16(1.0 / 60.0);
  const dampQ16 = toQ16(0.95);

  const prevXQ16 = state.traveler.xQ16;
  const prevYQ16 = state.traveler.yQ16;

  let vx = qMul(qAdd(state.traveler.vxQ16, qMul(accelXQ16, dtQ16)), dampQ16);
  let vy = qMul(qAdd(state.traveler.vyQ16, qMul(accelYQ16, dtQ16)), dampQ16);
  let x = qAdd(prevXQ16, qMul(vx, dtQ16));
  let y = qAdd(prevYQ16, qMul(vy, dtQ16));

  const minX = toQ16(36), maxX = toQ16(ARENA_W - 36);
  const minY = toQ16(36), maxY = toQ16(ARENA_H - 36);
  if (x < minX) { x = minX; vx = 0; }
  if (x > maxX) { x = maxX; vx = 0; }
  if (y < minY) { y = minY; vy = 0; }
  if (y > maxY) { y = maxY; vy = 0; }

  // Paint luminous ribbon trail whenever the traveler glides (> 0.05 px)
  const moveDist = Math.hypot(fromQ16(x) - fromQ16(prevXQ16), fromQ16(y) - fromQ16(prevYQ16));
  let nextStrokes = state.paintStrokes;
  if (moveDist > 0.05) {
    const stroke = {
      x1Q16: prevXQ16,
      y1Q16: prevYQ16,
      x2Q16: x,
      y2Q16: y,
      actIndex: state.actIndex,
      op: state.sacredGeo.samsaraLotus.activeOperator,
      width: Math.min(14, 5 + moveDist * 1.5),
    };
    nextStrokes = state.paintStrokes.length >= 600
      ? [...state.paintStrokes.slice(1), stroke]
      : [...state.paintStrokes, stroke];
  }

  const nextRibbon = state.ribbon.map((seg) => ({ ...seg }));
  nextRibbon.at(0).xQ16 = x;
  nextRibbon.at(0).yQ16 = y;
  const restLen = 5.5;
  const segDamp = toQ16(0.86);

  for (let i = 1; i < nextRibbon.length; i++) {
    const cur = nextRibbon.at(i);
    const prev = nextRibbon.at(i - 1);
    const svx = qMul(qSub(cur.xQ16, cur.oldXQ16), segDamp);
    const svy = qMul(qSub(cur.yQ16, cur.oldYQ16), segDamp);
    cur.oldXQ16 = cur.xQ16;
    cur.oldYQ16 = cur.yQ16;
    cur.xQ16 = qAdd(cur.xQ16, svx);
    cur.yQ16 = qAdd(cur.yQ16, svy);

    const dx = fromQ16(qSub(cur.xQ16, prev.xQ16));
    const dy = fromQ16(qSub(cur.yQ16, prev.yQ16));
    const dist = Math.hypot(dx, dy);
    if (dist > restLen && dist > 0.001) {
      const ratio = (dist - restLen) / dist;
      cur.xQ16 = qSub(cur.xQ16, toQ16(dx * ratio));
      cur.yQ16 = qSub(cur.yQ16, toQ16(dy * ratio));
    }
  }

  const nextPulse =
    state.pulseRadiusQ16 > 0 && state.pulseRadiusQ16 < toQ16(160)
      ? qAdd(state.pulseRadiusQ16, toQ16(5.0))
      : 0;

  const tx = fromQ16(x);
  const ty = fromQ16(y);
  const pulseR = fromQ16(nextPulse);

  const nextNodes = state.nodes.map((node) => {
    const nx = fromQ16(node.xQ16);
    const ny = fromQ16(node.yQ16);
    const dist = Math.hypot(tx - nx, ty - ny);
    const touched = dist < 26 || (pulseR > 0 && Math.abs(dist - pulseR) < 18);
    const illuminated = node.illuminated || touched;
    return {
      ...node,
      illuminated,
      glowQ16: illuminated ? toQ16(1.0) : 0,
    };
  });

  const nextCpu =
    tick % 15 === 0
      ? stepCpu6502Cycle(
          state.cpu6502,
          state.sacredGeo.s16State,
          state.actIndex,
          state.sacredGeo.samsaraLotus.activeOperator
        )
      : state.cpu6502;

  return {
    ...state,
    tick,
    traveler: { xQ16: x, yQ16: y, vxQ16: vx, vyQ16: vy },
    ribbon: nextRibbon,
    paintStrokes: nextStrokes,
    nodes: nextNodes,
    cpu6502: nextCpu,
    pulseRadiusQ16: nextPulse,
  };
}

export function buildOdysseyReceipt(state) {
  const illuminatedCount = state.nodes.filter((n) => n.illuminated).length;
  const payload = {
    schema: "ndh.radial.cosmology.comic.v1",
    act: state.actIndex + 1,
    tick: state.tick,
    paintedStrokes: state.paintStrokes.length,
    illuminatedNodes: `${illuminatedCount}/${state.nodes.length}`,
    meruAxisStill: state.sacredGeo.meruAxis.isStill,
    s16State: state.sacredGeo.s16State,
    cpu6502: {
      cycles: state.cpu6502.cycles,
      pc: state.cpu6502.pc,
      a: state.cpu6502.a,
      x: state.cpu6502.x,
      y: state.cpu6502.y,
      sp: state.cpu6502.sp,
      status: state.cpu6502.status,
    },
  };
  return {
    ...payload,
    sha256: sha256Hex(JSON.stringify(payload)),
  };
}
