/**
 * src/comic-renderer.js — Multi-Act Illuminated Comic Panel, MeruAxis, Lotus & 6502 X-Ray Renderer (Ledger 2)
 * Zero-flicker steady gradient rendering with toggleable Visual6502-style register HUD.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { fromQ16 } from "./core.js";
import { CENTER_X, CENTER_Y } from "./cosmology-kernel.js";

const ACT_PALETTES = [
  { top: "#2b1d14", mid: "#7c4a27", bot: "#d99b52", accent: "#fde68a" }, // Act I: Nascence Ochre Dunes
  { top: "#102a43", mid: "#1d4e89", bot: "#4ea8de", accent: "#90e0ef" }, // Act II: Bridge & Sunken City
  { top: "#1e1b4b", mid: "#3730a3", bot: "#818cf8", accent: "#e0e7ff" }, // Act III: The Tower Snow Mandala
  { top: "#2e1065", mid: "#7e22ce", bot: "#f59e0b", accent: "#fef08a" }, // Act IV: Apotheosis Gold Summit
];

export function renderComicOdyssey(ctx, state, bandEnergies, show6502Overlay) {
  const { width, height } = ctx.canvas;
  const pal = ACT_PALETTES[state.actIndex] || ACT_PALETTES[0];

  // 1. Steady, non-flashing Act sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, pal.top);
  grad.addColorStop(0.55, pal.mid);
  grad.addColorStop(1, pal.bot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Illuminated Comic Panel Border & Corner Medallions
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, width - 24, height - 24);
  ctx.lineWidth = 1;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // 3. Spectral Band Concentric Rings (driven live by 4-band Journey audio energies)
  for (let b = 0; b < 4; b++) {
    const energy = bandEnergies[b] || 0.08;
    const radius = 48 + b * 36 + energy * 10;
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.14 + energy * 0.35})`;
    ctx.lineWidth = 1.2 + energy * 2.5;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 4. Central Invariant Meru Axis Pillar (strictly still: isStill = true)
  const meruX = state.sacredGeo.meruAxis.coordinateCenterX;
  ctx.strokeStyle = "rgba(253, 224, 71, 0.55)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(meruX, 24);
  ctx.lineTo(meruX, height - 24);
  ctx.stroke();

  // 5. Samsara Lotus Radial Nodes & Connecting Geometry
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  state.nodes.forEach((n, idx) => {
    const nx = fromQ16(n.xQ16);
    const ny = fromQ16(n.yQ16);
    if (idx === 0) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  });
  ctx.closePath();
  ctx.stroke();

  for (const node of state.nodes) {
    const nx = fromQ16(node.xQ16);
    const ny = fromQ16(node.yQ16);

    ctx.fillStyle = node.illuminated ? "#fde047" : "rgba(15, 23, 42, 0.65)";
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(nx, ny, node.illuminated ? 10 : 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // S_16 hex label inside lotus petal
    ctx.fillStyle = node.illuminated ? "#0f172a" : "#e2e8f0";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`S${node.sectorS16.toString(16).toUpperCase()}`, nx, ny + 3);
  }
  ctx.textAlign = "left";

  // 6. Expanding Harmonic Chime Ring
  const pulseR = fromQ16(state.pulseRadiusQ16);
  if (pulseR > 0) {
    ctx.strokeStyle = "rgba(254, 249, 195, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(fromQ16(state.traveler.xQ16), fromQ16(state.traveler.yQ16), pulseR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 7. 14-Segment Verlet Traveler Ribbon Scarf
  ctx.lineCap = "round";
  for (let i = 0; i < state.ribbon.length - 1; i++) {
    const a = state.ribbon[i];
    const b = state.ribbon[i + 1];
    const ratio = 1 - i / state.ribbon.length;
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.25 + ratio * 0.75})`;
    ctx.lineWidth = 2 + ratio * 5;
    ctx.beginPath();
    ctx.moveTo(fromQ16(a.xQ16), fromQ16(a.yQ16));
    ctx.lineTo(fromQ16(b.xQ16), fromQ16(b.yQ16));
    ctx.stroke();
  }

  // Traveler Core
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(fromQ16(state.traveler.xQ16), fromQ16(state.traveler.yQ16), 5.5, 0, Math.PI * 2);
  ctx.fill();

  // 8. Toggleable Visual6502-Style Silicon & Register X-Ray Overlay (8b-is / 6502-is tribute)
  if (show6502Overlay) {
    const cpu = state.cpu6502;
    const hex2 = (v) => v.toString(16).toUpperCase().padStart(2, "0");
    const hex4 = (v) => v.toString(16).toUpperCase().padStart(4, "0");

    ctx.fillStyle = "rgba(7, 11, 20, 0.84)";
    ctx.fillRect(26, 26, 245, 148);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(26, 26, 245, 148);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 11px monospace";
    ctx.fillText("6502 SILICON BUS (8b-is Tribute)", 36, 44);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "11px monospace";
    ctx.fillText(`PC:$${hex4(cpu.pc)}  OP:${cpu.opcodeName}`, 36, 62);
    ctx.fillText(`A:$${hex2(cpu.a)} X:$${hex2(cpu.x)} Y:$${hex2(cpu.y)} SP:$${hex2(cpu.sp)}`, 36, 78);
    ctx.fillText(`SR:$${hex2(cpu.status)}  CYC:${cpu.cycles}  S16:S${hex2(state.sacredGeo.s16State).slice(1)}`, 36, 94);

    // Zero-page $00..$0F trace grid
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("ZP $00-$0F (Buddhabrot Density):", 36, 114);
    for (let i = 0; i < 16; i++) {
      const col = i % 8;
      const row = Math.floor(i / 8);
      ctx.fillStyle = i === state.sacredGeo.s16State ? "#fde047" : "#a7f3d0";
      ctx.fillText(hex2(cpu.zeroPage[i]), 36 + col * 28, 132 + row * 16);
    }
  }
}
