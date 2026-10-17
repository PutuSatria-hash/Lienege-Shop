// Web Audio API Retro 8-bit Sound Synthesizer
import { storage } from './storage.js';

class RetroAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isEnabled() {
    const settings = storage.getSettings();
    return settings.soundEnabled !== false;
  }

  getVolume() {
    if (!this.isEnabled()) return 0;
    const stored = localStorage.getItem('pl_sfx_volume');
    return stored !== null ? parseFloat(stored) : 0.8;
  }

  setVolume(vol) {
    const clamped = Math.max(0, Math.min(1, vol));
    localStorage.setItem('pl_sfx_volume', clamped.toString());
  }

  // Quick Blip for button clicks / navigation
  playClick() {
    const vol = this.getVolume();
    if (vol <= 0) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08 * vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Retro Coin Ding for adding item to cart
  playCoin() {
    const vol = this.getVolume();
    if (vol <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    // Classic 2-tone coin ding: B5 (987Hz) -> E6 (1318Hz)
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.12 * vol, now);
    gain.gain.setValueAtTime(0.12 * vol, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Buzz for remove or delete
  playRemove() {
    const vol = this.getVolume();
    if (vol <= 0) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);

    gain.gain.setValueAtTime(0.1 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Triumphant 8-bit Fanfare for checkout success
  playFanfare() {
    const vol = this.getVolume();
    if (vol <= 0) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.1 }, // C5
      { f: 659.25, d: 0.1 }, // E5
      { f: 783.99, d: 0.1 }, // G5
      { f: 1046.50, d: 0.35 } // C6
    ];

    let delay = 0;
    notes.forEach(n => {
      const start = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);

      gain.gain.setValueAtTime(0.12 * vol, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + n.d);

      delay += n.d * 0.75;
    });
  }

  // Mystic Realm Transition Chime (Soft ethereal crystal chime)
  playRealmChime() {
    const vol = this.getVolume();
    if (vol <= 0) return;
    this.init();
    if (!this.ctx) return;

    // Harmonic crystalline arpeggio: E6, G#6, B6, E7
    const frequencies = [1318.51, 1661.22, 1975.53, 2637.02];
    const now = this.ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const start = now + idx * 0.065;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.045 * vol, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.42);
    });
  }
}

export const sound = new RetroAudio();
