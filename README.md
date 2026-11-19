> ### ✅ RELEASE v1.0.0 — RADIAL MANDALA NODE & SPECTRAL AUDIO EXPLORER VERIFIED (`3/3` PASSING)
> **Status:** `v1.0.0` Live & Verified • Zero-Float `Q16.16` • 4-Act Radial Node Activator • 4-Band Meditative WebAudio • `6502` X-Ray HUD  
> 
> **Scope & Release Highlights (Nov 2026):** Focused `v1.0.0` release verified on ARM64 hardware (`node --test`: **3/3 passing**). Rather than over-complicating the canvas with freehand paint layers, this release locks in what runs smoothly and deterministically: **four *Journey*-inspired harmonic Acts**, **concentric *Samsara Lotus* node illumination (`S0`–`SF`)**, a **still central *Meru Axis* anchor (`T_s = 0`)**, **meditative 4-band WebAudio synthesis**, and a **toggleable `6502` register & zero-page X-Ray HUD**.

# ☸️ Radial Cosmology Comic Odyssey — 4-Act Mandala Node & Spectral Audio Explorer

**An interactive, zero-dependency browser explorer where gliding across four *Journey*-inspired harmonic Acts illuminates concentric *Samsara Lotus* mandala nodes (`S0`–`SF`), layers warm spectral WebAudio instruments (`Cello Drone`, `Harp`, `Wooden Flute`, `Summit Choir`), anchors around a still central *Meru Axis*, and exposes live 8-bit `6502` register telemetry.**

[![License: MIT](https://shields.io)](LICENSE)
[![Status: v1.0.0 Verified](https://shields.io)](#-quickstart--verification)
[![Math: Q16.16 & S16 Algebra](https://shields.io)](#-four-core-subsystems-in-v100)
[![Tests: 3/3 Passing](https://shields.io)](#-quickstart--verification)

---

## 🪷 Clarification on Intent: Sacred Geometry & Buddhist Philosophy (Not an Occult Project)

To avoid any misunderstanding regarding terminology or iconography:
* **Strictly Non-Occult:** This project is **not an occult, esoteric, or ritual system**. It makes zero supernatural claims and contains no mystical activation mechanisms.
* **Philosophical & Geometric Grounding:** All visual motifs and state operators draw strictly from **classical Buddhist philosophy** (specifically *Śūnyatā* / equilibrium, *Mādhyamaka* non-duality, and the contemplative *Navarasa* aesthetic tradition) and **sacred geometry** (dihedral \(D_n\) mandala symmetry, concentric lotus rings, and the decoupling between a still central reference axis and outer node illumination).
* **Deterministic Engineering (`Ledger 1` / `Ledger 2`):** Every geometric symbol and harmonic chime is backed by transparent `Q16.16` integer math and read-only WebAudio/Canvas rendering.

---

## ⚙️ Four Core Subsystems in `v1.0.0`

1. **Four-Act Radial Mandala Node Illumination (`Zen-AI-Design-Architecture`):**  
   Each Act frames an illuminated radial mandala panel where gliding near or emitting a harmonic chime lights up concentric lotus nodes (`6` nodes in Act I up to `16` nodes in Act IV):
   * **Act I — *Nascence* (Golden Dunes):** Ochre horizon, 6 lotus nodes, and warm sine cello drones.
   * **Act II — *The Bridge & Sunken City*:** Cerulean sky, 9 lotus nodes, adding plucked harp intervals.
   * **Act III — *The Tower*:** Indigo twilight, 12 lotus nodes, adding airy wooden flute harmonics.
   * **Act IV — *Apotheosis* (Summit Mandala):** Royal violet-gold summit, 16 lotus nodes (`S0`–`SF`), and full 4-band harmonic resonance.
2. **Meditative 4-Band Spectral WebAudio (`Cosmic-Ballet-Traversal` + *Journey* Motifs):**  
   Mute-by-default WebAudio synthesizer (`Sound: Muted` → `Sound: Spectral Journey (On)`) using warm low-pass `sine` and `triangle` oscillators with slow `140–180 ms` bow/breath swells and live spectral ring telemetry.
3. **Buddhist Sacred Geometry & 16-State Fiber Algebra (\(\mathcal{S}_{16}\)):**  
   * **Axis–Bloom Decoupling (`MeruAxis` vs. `SamsaraLotus`):** A calm golden vertical pillar (`isStill = true`, `subjectivityTs = 0`) anchors the center of every mandala while outer lotus nodes illuminate around it.
   * **Three Fiber-Preserving Operators:** Step across \(\mathcal{S}_{16}\) states using **Drift (`D: +1`)**, **Collapse (`C: -1`)**, and **Resonance (`R: XOR 3`)**, preserving 4-fold fiber parity (`P0`–`P3`).
4. **Cycle-Accurate `6502` Virtual Register & Zero-Page X-Ray HUD (`8b-is/6502-is`):**  
   Toggle **`6502 X-Ray: On/Off`** to watch live 8-bit registers (`PC`, `A`, `X`, `Y`, `SP`, `STATUS`) and 16 Zero-Page memory cells (`$00`–`$0F`) count node visits in real time, plus export a deterministic **`SHA-256` Run Receipt**.

---

## 📁 Repository Structure

```text
Radial-Cosmology-Comic-Odyssey/
├── index.html                        # Responsive radial mandala viewport, Act I-IV controls & 6502 X-Ray toggle
├── style.css                         # Illuminated panel framing & monospace register HUD styling
├── package.json                      # Zero-dependency ESM manifest (`npm test` -> `node --test`)
├── LICENSE                           # MIT License
├── README.md                         # Project scope, philosophical clarification, architecture & quickstart
├── src/
│   ├── core.js                       # Zero-float Q16.16 arithmetic, Mulberry32 PRNG & synchronous SHA-256
│   ├── buddhism-algebra.js           # 16-state S_16 fiber operators (D, C, R, P) & MeruAxis stillness invariant
│   ├── cpu6502-bus.js                # Cycle-accurate 6502 virtual register & zero-page bus (Ledger 1)
│   ├── cosmology-kernel.js           # 4-Act radial node coordinates, 14-segment Verlet ribbon & SHA-256 receipt
│   ├── spectral-journey-audio.js     # Mute-by-default 4-band meditative WebAudio synthesizer (Ledger 2)
│   ├── comic-renderer.js             # Zero-flicker Canvas mandala, MeruAxis & 6502 X-Ray overlay (Ledger 2)
│   └── odyssey-app.js                # Fixed-timestep 60 Hz loop, touch/WASD gliding & chime dispatcher
├── tiles/
│   └── bill-nye-radial-cosmology-explainer.md  # Altitude A7 plain-language explainer & game-mechanic guide
└── test/
    └── odyssey-kernel.test.mjs       # Built-in `node --test` suite verifying S_16 parity, Meru stillness & SHA-256
```

---

## 🚀 Quickstart & Verification

```bash
# 1. Run deterministic S_16 parity, MeruAxis stillness & SHA-256 receipt tests
node --test test/odyssey-kernel.test.mjs

# 2. Launch locally in browser
python3 -m http.server 8080
```

Open **`http://localhost:8080`**, tap **`Sound: Muted`** to awaken **`Sound: Spectral Journey (On)`**, glide with touch/cursor or `WASD` + `Spacebar` to illuminate all lotus petals across Acts I–IV, and inspect the live **`6502 X-Ray`** register overlay.

---

## 🤝 Acknowledgements & Architectural Lineage

* **`8b` (`8b-is` / [`8b-is/6502-is`](https://github.com)):** Acknowledged with gratitude for *Visual6502 3D*'s inspiring layered silicon visualization, cycle-accurate MOS 6502 register inspection (`PC`, `A`, `X`, `Y`, `SP`, `STATUS`), and hardware-debugger UI design.
* **Musical & Traversal Inspiration:** Inspired by Austin Wintory's Grammy-nominated spectral score for *Journey* (*Nascence* through *Apotheosis*) and [`Borealiscodes/Cosmic-Ballet-Traversal`](https://github.com).
* **Formal Geometric & Algebraic Lineage:**
  * [`Borealiscodes/Zen-AI-Design-Architecture`](https://github.com) (*Radial Cosmology Subsystem*)
  * [`Borealiscodes/NDH-Meta-Systems`](https://github.com) (*Buddhabrot 80D Fractal Field & $\mathcal{S}_{16}$ Non-Dual Algebra*)
  * [`Borealiscodes/NDH-Research-Pilot`](https://github.com) (*Samsara–Meru Axis-Bloom Decoupling Invariant*)
  * Hedling, B. S. (2026). *Non-Dual Epistemic Architectures and Geometric Stabilization in High-Dimensional Transformer Systems (v3.1)*. Zenodo: [`10.5281/zenodo.24240994`](https://doi.org).
* **Maintainer & License:** Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` • County Dublin, Ireland) • MIT License • `Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>`.
