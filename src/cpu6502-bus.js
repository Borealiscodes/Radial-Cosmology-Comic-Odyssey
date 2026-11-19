/**
 * src/cpu6502-bus.js — Cycle-Accurate MOS 6502 Virtual Register & Zero-Page Bus (Ledger 1)
 * Inspired by 8b-is/6502-is (Visual6502 3D). Tracks PC, A, X, Y, SP, STATUS, and
 * 16 Zero-Page cells ($00..$0F) mirroring the S_16 sacred geometry state.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

export function createCpu6502State() {
  return {
    cycles: 0,
    pc: 0x0600,
    a: 0x00,
    x: 0x00,
    y: 0x00,
    sp: 0xff,
    status: 0x24, // NV-BDIZC flags
    opcodeName: "NOP",
    zeroPage: new Uint8Array(16), // $00..$0F mirrors S0..SF orbit density
  };
}

/**
 * Step one deterministic 6502 micro-cycle driven by the active S_16 operator and Act index.
 */
export function stepCpu6502Cycle(cpu, s16State, actIndex, activeOp = "DRIFT") {
  const zp = new Uint8Array(cpu.zeroPage);
  const slot = s16State & 0x0f;
  zp[slot] = (zp[slot] + 1) & 0xff;

  let a = cpu.a;
  let x = slot;
  let y = actIndex & 0xff;
  let opcodeName = "INX";

  if (activeOp === "DRIFT") {
    a = (a + 1) & 0xff;
    opcodeName = "ADC #$01";
  } else if (activeOp === "COLLAPSE") {
    a = (a + 0xff) & 0xff;
    opcodeName = "SBC #$01";
  } else if (activeOp === "RESONANCE") {
    a = a ^ 0x0f;
    opcodeName = "EOR #$0F";
  }

  const zeroFlag = a === 0 ? 0x02 : 0x00;
  const negFlag = (a & 0x80) !== 0 ? 0x80 : 0x00;
  const status = (0x24 | zeroFlag | negFlag) & 0xff;

  return {
    cycles: cpu.cycles + 1,
    pc: 0x0600 + ((cpu.cycles + 1) & 0x00ff),
    a,
    x,
    y,
    sp: (0xff - (actIndex & 0x0f)) & 0xff,
    status,
    opcodeName,
    zeroPage: zp,
  };
}
