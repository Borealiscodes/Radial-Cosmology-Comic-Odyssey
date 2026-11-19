export function opDrift(s) {
  const v = s & 0x0f;
  return (v & 0x0c) | ((v + 1) & 0x03);
}

export function opCollapse(s) {
  const v = s & 0x0f;
  return (v & 0x0c) | ((v + 3) & 0x03);
}

export function opResonance(s) {
  return (s & 0x0f) ^ 0x03;
}

// 4-Fold Parity P : S_16 -> {0, 1, 2, 3}, strictly invariant under D, C, and R
export function opParity(s) {
  return ((s & 0x0f) >> 2) & 0x03;
}

export function createSacredGeometryState() {
  return {
    meruAxis: {
      coordinateCenterX: 340,
      isStill: true,
      isAnchor: true,
      subjectivityTs: 0,
    },
    samsaraLotus: {
      petalLayers: 6,
      spectralBundles: 4,
      activeOperator: "DRIFT",
    },
    s16State: 0,
    s16Density: new Uint16Array(16),
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
