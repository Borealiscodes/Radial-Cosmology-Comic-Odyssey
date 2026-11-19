export const ACT_SPECTRAL_PROFILES = [
  {
    act: 1,
    title: "Act I: Nascence — Golden Dunes",
    subtitle: "Warm Cello Drone • Painting Ochre & Gold Ribbons",
    notes: [130.81, 146.83, 196.00, 164.81],
    activeBands: 1,
    strokeColor: "rgba(253, 224, 71, 0.82)",
  },
  {
    act: 2,
    title: "Act II: The Bridge & Sunken City",
    subtitle: "Cello + Acoustic Harp • Painting Cerulean Currents",
    notes: [261.63, 329.63, 392.00, 440.00],
    activeBands: 2,
    strokeColor: "rgba(125, 211, 252, 0.85)",
  },
  {
    act: 3,
    title: "Act III: The Tower — Ascending Spiral",
    subtitle: "Cello + Harp + Wooden Flute • Painting Lavender Light",
    notes: [392.00, 440.00, 523.25, 587.33],
    activeBands: 3,
    strokeColor: "rgba(216, 180, 254, 0.88)",
  },
  {
    act: 4,
    title: "Act IV: Apotheosis — Summit Mandala",
    subtitle: "Full 4-Band Spectral Harmony • Mirrored Sacred Geometry",
    notes: [392.00, 523.25, 659.25, 783.99],
    activeBands: 4,
    strokeColor: "rgba(254, 249, 195, 0.92)",
  },
];

export function createSpectralJourneyAudio() {
  let muted = true;
  let ctx = null;
  let noteStep = 0;
  let lastTriggerMs = 0;
  const bandEnergies = new Float32Array(4);

  const ensureCtx = () => {
    if (!ctx && typeof window !== "undefined") {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (Ctor) ctx = new Ctor();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const triggerMeditativeVoice = (freqHz, waveType, gainPeak, durationSec) => {
    const ac = ensureCtx();
    if (!ac || !Number.isFinite(freqHz)) return;

    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freqHz, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(720, now);
    filter.frequency.exponentialRampToValueAtTime(280, now + durationSec);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.14);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.08);
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
        bandEnergies[i] = Math.max(0.08, bandEnergies[i] * 0.95);
      }
    },
    triggerHarmonicPulse: (actIndex, s16State) => {
      const idx = Math.max(0, Math.min(3, actIndex | 0));
      const profile = ACT_SPECTRAL_PROFILES.at(idx);
      const freq = profile.notes.at((noteStep + s16State) % profile.notes.length);
      noteStep++;

      for (let b = 0; b < profile.activeBands; b++) {
        bandEnergies[b] = Math.min(1.0, 0.55 + ((s16State + b) % 4) * 0.12);
      }

      const nowMs = typeof performance !== "undefined" ? performance.now() : 0;
      if (nowMs - lastTriggerMs < 180) return;
      lastTriggerMs = nowMs;

      if (!muted) {
        // Warm sine cello voice (Act I+)
        triggerMeditativeVoice(freq, "sine", 0.09, 2.6);
        triggerMeditativeVoice(profile.notes.at(0) * 0.5, "sine", 0.06, 3.0);
        // Harp, flute & summit choir layers (Acts II-IV)
        if (profile.activeBands >= 2) triggerMeditativeVoice(freq * 1.5, "triangle", 0.045, 2.1);
        if (profile.activeBands >= 3) triggerMeditativeVoice(freq * 2.0, "sine", 0.032, 2.4);
        if (profile.activeBands >= 4) triggerMeditativeVoice(freq * 2.5, "sine", 0.025, 2.8);
      }
    },
  };
}
