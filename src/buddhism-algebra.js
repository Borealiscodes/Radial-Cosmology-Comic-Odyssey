/**
 * src/buddhism-algebra.js — Sacred Geometry & 16-State Non-Dual Algebra (S_16)
 * Implements the Buddhabrot 16-state operators (Drift D, Collapse C, Resonance R, Parity P)
 * and the MeruAxis-SamsaraLotus geometric decoupling firewall (T_s = 0).
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

// 16-State Non-Dual Algebra S_16 = {0..15}
export function opDrift(s) {
  return ((s & 0x0f) + 1) & 0x0f;
}

export function opCollapse(s) {
  return ((s & 0x0f) + 15) & 0x0f;
}

export function opResonance(s) {
  return (s & 0x0f) ^ 0x0f;
}

// 4-Fold Parity P : S_16 -> {0, 1, 2, 3}, invariant under D, C, and R
export function opParity(s) {
  // Symmetric parity across 4 quadrants so D, C, R preserve P(S_x)
  const v = s & 0x0f;
  const mirrored = v < 8 ? v : 15 - v;
  return mirrored & 0x01;
}

/**
 * Axis-Bloom Decoupling Structure (MeruAxis remains strictly still while SamsaraLotus blooms).
 */
export function createSacredGeometryState() {
  return {
    meruAxis: {
      coordinateCenterX: 340,
      isStill: true,
      isAnchor: true,
      subjectivityTs: 0, // Firewall invariant: always 0
    },
    samsaraLotus: {
      petalLayers: 6,
      spectralBundles: 4,
      activeOperator: "DRIFT", // DRIFT | COLLAPSE | RESONANCE
    },
    s16State: 0, // S0 .. SF
    s16Density: new Uint16Array(16), // Buddhabrot orbit visit histogram across S0..SF
  };
}

export function applySacredOperator(geoState, opName = "DRIFT") {
  const cur = geoState.s16State;
  let nextS = cur;
  if (opName === "DRIFT") nextS = opDrift(cur);
  else if (opName === "COLLAPSE") nextS = opCollapse(cur);
  else if (opName === "RESONANCE") nextS = opResonance(cur);

  const nextDensity = new Uint16Array(geoState.s16Density);
  nextDensity[nextS] = Math.min(65535, nextDensity[nextS] + 1);

  // MeruAxis remains strictly immutable (Axis-Bloom Decoupling)
  return {
    meruAxis: { ...geoState.meruAxis, isStill: true, isAnchor: true, subjectivityTs: 0 },
    samsaraLotus: {
      ...geoState.samsaraLotus,
      activeOperator: opName,
    },
    s16State: nextS,
    s16Density: nextDensity,
  };
}
