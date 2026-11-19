/**
 * test/odyssey-kernel.test.mjs — S_16 Parity, MeruAxis Stillness & 6502 Determinism Tests
 * Run: node --test test/odyssey-kernel.test.mjs
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import test from "node:test";
import assert from "node:assert/strict";

import { opDrift, opCollapse, opResonance, opParity } from "../src/buddhism-algebra.js";
import {
  createOdysseyState,
  triggerRadialChime,
  stepOdysseyFrame,
  buildOdysseyReceipt,
} from "../src/cosmology-kernel.js";

test("1. S_16 Parity Invariance under Drift, Collapse & Resonance", () => {
  for (let s = 0; s < 16; s++) {
    const p = opParity(s);
    assert.equal(opParity(opDrift(s)), p);
    assert.equal(opParity(opCollapse(s)), p);
    assert.equal(opParity(opResonance(s)), p);
  }
});

test("2. MeruAxis–SamsaraLotus Decoupling (MeruAxis Remains Still & Ts=0)", () => {
  let state = createOdysseyState(2);
  for (let i = 0; i < 10; i++) {
    state = triggerRadialChime(state, i % 2 === 0 ? "DRIFT" : "RESONANCE");
    state = stepOdysseyFrame(state, 120, -80);
  }
  assert.equal(state.sacredGeo.meruAxis.isStill, true);
  assert.equal(state.sacredGeo.meruAxis.subjectivityTs, 0);
  assert.ok(state.cpu6502.cycles >= 10);
});

test("3. Bit-Exact SHA-256 Receipt Parity Across Runs", () => {
  const run = () => {
    let s = createOdysseyState(3);
    s = triggerRadialChime(s, "DRIFT");
    s = stepOdysseyFrame(s, 200, 100);
    return buildOdysseyReceipt(s).sha256;
  };
  assert.equal(run(), run());
});
