/**
 * src/spectral-journey-audio.js — 4-Band Spectral Journey-Inspired WebAudio Synthesizer (Ledger 2)
 * Decomposes harmonic synthesis into 4 live spectral bands whose real-time envelope
 * amplitudes drive brush width, ribbon velocity, and gold/cerulean luminance:
 *   Band 0: Sub-Bass Cello Drone (130.81 - 196.00 Hz)
 *   Band 1: Plucked Harp Arpeggios (261.63 - 440.00 Hz)
 *   Band 2: Airy Wind Flute Harmonics (523.25 - 659.25 Hz)
 *   Band 3: Apotheosis Summit Choir Pad (392.00 - 783.99 Hz)
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

export const ACT_SPECTRAL_PROFILES = [
  {
    act: 1,
    title: "Act I: Nascence — Golden Dunes",
    subtitle: "Solo Cello Drone • Minimalist Ochre Horizon",
    notes: [130.81, 146.83, 196.00, 164.81], // C3, D3, G3, E3
    activeBands: 1,
  },
  {
    act: 2,
    title: "Act II: The Bridge & Sunken City",
    subtitle: "Cello + Harp Arpeggios • Interleaved Navarasa Currents",
    notes: [261.63, 329.63, 392.00, 440.00], // C4, E4, G4, A4
    activeBands: 2,
  },
  {
    act: 3,
    title: "Act III: The Tower — Ascending Spiral",
    subtitle: "Cello + Harp + Wind Flute • Crystalline Snow Mandala",
    notes: [523.25, 587.33, 659.25, 587.33], // C5, D5, E5, D5
    activeBands: 3,
  },
  {
    act: 4,
    title: "Act IV: Apotheosis — Summit Mandala",
    subtitle: "Full 4-Band Spectral Choir • 16-Sector Radial Bloom",
    notes: [392.00, 523.25, 659.25, 783.99], // G4, C5, E5, G5
    activeBands: 4,
  },
];

export function createSpectralJourneyAudio() {
  let muted = true; // Mute-by-default constitutional rule
  let ctx = null;
  let noteStep = 0;

  // Live spectral band energy meters [0.0 .. 1.0] read by Canvas renderer
  const bandEnergies = new Float32Array(4);

  const ensureCtx = () => {
    if (!ctx && typeof window !== "undefined") {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (Ctor) ctx = new Ctor();
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  };

  const triggerVoice = (freqHz, waveType, gainPeak, durationSec) => {
    const ac = ensureCtx();
    if (!ac) return;

    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freqHz, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + durationSec);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.05);
  };

  return {
    isMuted: () => muted,
    toggleMute: () => {
      muted = !muted;
      if (!muted) ensureCtx();
      return muted;
    },
    getBandEnergies: () => bandEnergies,
    decayBands: () => {
      for (let i = 0; i < 4; i++) {
        bandEnergies[i] = Math.max(0.08, bandEnergies[i] * 0.94);
      }
    },
    triggerHarmonicPulse: (actIndex, s16State) => {
      const profile = ACT_SPECTRAL_PROFILES[Math.max(0, Math.min(3, actIndex))];
      const freq = profile.notes[(noteStep + s16State) % profile.notes.length];
      noteStep++;

      // Energize active spectral bands for visual brush coupling
      for (let b = 0; b < profile.activeBands; b++) {
        bandEnergies[b] = Math.min(1.0, 0.55 + ((s16State + b) % 4) * 0.12);
      }

      if (!muted) {
        // Band 0: Warm Cello Drone
        triggerVoice(profile.notes[0] * 0.5, "sawtooth", 0.032, 2.2);
        // Band 1+: Plucked Harp / Flute / Choir intervals
        if (profile.activeBands >= 2) triggerVoice(freq, "triangle", 0.065, 1.5);
        if (profile.activeBands >= 3) triggerVoice(freq * 1.5, "sine", 0.04, 1.8);
        if (profile.activeBands >= 4) triggerVoice(freq * 2.0, "sine", 0.035, 2.4);
      }
    },
  };
}
