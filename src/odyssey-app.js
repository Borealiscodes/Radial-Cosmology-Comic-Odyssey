/**
 * src/odyssey-app.js — Multi-Act Radial Comic Odyssey Controller & 60 Hz Loop
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { toQ16, fromQ16 } from "./core.js";
import {
  ARENA_W,
  ARENA_H,
  createOdysseyState,
  triggerRadialChime,
  stepOdysseyFrame,
  buildOdysseyReceipt,
} from "./cosmology-kernel.js";
import { ACT_SPECTRAL_PROFILES, createSpectralJourneyAudio } from "./spectral-journey-audio.js";
import { renderComicOdyssey } from "./comic-renderer.js";

const FIXED_DT_MS = 1000 / 60;

function initComicOdyssey() {
  const canvas = document.getElementById("odyssey-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const audio = createSpectralJourneyAudio();

  const actTitleEl = document.getElementById("hud-act-title");
  const actSubEl = document.getElementById("hud-act-sub");
  const nodesEl = document.getElementById("hud-nodes");
  const audioBtn = document.getElementById("btn-audio");
  const xrayBtn = document.getElementById("btn-xray");
  const receiptBox = document.getElementById("receipt-output");

  let state = createOdysseyState(0);
  let show6502Overlay = true;
  let pointerTarget = null;
  const keys = new Set();

  const syncHud = () => {
    const profile = ACT_SPECTRAL_PROFILES[state.actIndex];
    const lit = state.nodes.filter((n) => n.illuminated).length;
    if (actTitleEl) actTitleEl.textContent = profile.title;
    if (actSubEl) actSubEl.textContent = profile.subtitle;
    if (nodesEl) nodesEl.textContent = `Lotus Petals: ${lit} / ${state.nodes.length}`;
  };

  syncHud();

  // Touch / Pointer steering + Chime pulse
  canvas?.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * ARENA_W;
    const y = ((ev.clientY - rect.top) / rect.height) * ARENA_H;
    pointerTarget = { x, y };

    state = triggerRadialChime(state);
    audio.triggerHarmonicPulse(state.actIndex, state.sacredGeo.s16State);
    syncHud();
  });

  canvas?.addEventListener("pointermove", (ev) => {
    if (!pointerTarget) return;
    const rect = canvas.getBoundingClientRect();
    pointerTarget = {
      x: ((ev.clientX - rect.left) / rect.width) * ARENA_W,
      y: ((ev.clientY - rect.top) / rect.height) * ARENA_H,
    };
  });

  window.addEventListener("pointerup", () => {
    pointerTarget = null;
  });

  window.addEventListener("keydown", (ev) => {
    keys.add(ev.key.toLowerCase());
    if (ev.key === " ") {
      ev.preventDefault();
      state = triggerRadialChime(state);
      audio.triggerHarmonicPulse(state.actIndex, state.sacredGeo.s16State);
      syncHud();
    }
  });

  window.addEventListener("keyup", (ev) => {
    keys.delete(ev.key.toLowerCase());
  });

  // Act I - IV Buttons
  document.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-act")) || 0;
      state = createOdysseyState(idx);
      audio.triggerHarmonicPulse(idx, 0);
      syncHud();
    });
  });

  // Sacred Geometry S_16 Operator Buttons (D, C, R)
  document.querySelectorAll("[data-op]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const op = btn.getAttribute("data-op");
      state = triggerRadialChime(state, op);
      audio.triggerHarmonicPulse(state.actIndex, state.sacredGeo.s16State);
      syncHud();
    });
  });

  audioBtn?.addEventListener("click", () => {
    const muted = audio.toggleMute();
    audioBtn.textContent = muted ? "Sound: Muted" : "Sound: Spectral Journey (On)";
  });

  xrayBtn?.addEventListener("click", () => {
    show6502Overlay = !show6502Overlay;
    xrayBtn.textContent = show6502Overlay ? "6502 X-Ray: On" : "6502 X-Ray: Off";
  });

  document.getElementById("btn-receipt")?.addEventListener("click", () => {
    const receipt = buildOdysseyReceipt(state);
    if (receiptBox) receiptBox.value = JSON.stringify(receipt, null, 2);
  });

  let lastTime = performance.now();
  let accumulator = 0;

  function loop(now) {
    accumulator += Math.min(100, now - lastTime);
    lastTime = now;

    while (accumulator >= FIXED_DT_MS) {
      let ax = 0;
      let ay = 0;

      if (keys.has("arrowleft") || keys.has("a")) ax -= 420;
      if (keys.has("arrowright") || keys.has("d")) ax += 420;
      if (keys.has("arrowup") || keys.has("w")) ay -= 420;
      if (keys.has("arrowdown") || keys.has("s")) ay += 420;

      if (pointerTarget) {
        const dx = pointerTarget.x - fromQ16(state.traveler.xQ16);
        const dy = pointerTarget.y - fromQ16(state.traveler.yQ16);
        ax += Math.max(-520, Math.min(520, dx * 4.5));
        ay += Math.max(-520, Math.min(520, dy * 4.5));
      }

      state = stepOdysseyFrame(state, toQ16(ax), toQ16(ay));
      audio.decayBands();
      accumulator -= FIXED_DT_MS;
    }

    syncHud();
    if (ctx) renderComicOdyssey(ctx, state, audio.getBandEnergies(), show6502Overlay);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", initComicOdyssey);
