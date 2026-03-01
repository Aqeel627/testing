// // src/lib/audioFeedback.ts

// export class BettingAudioFeedback {
//   private audioContext: AudioContext | null = null;
//   private isEnabled: boolean;
//   private volume: number;
//   private initialized = false;

//   constructor(options: { volume?: number; enabled?: boolean } = {}) {
//     this.isEnabled = options.enabled ?? true;
//     this.volume = options.volume ?? 0.5;
//   }

//   private ensureContext(): void {
//     if (typeof window === 'undefined') return;
//     if (!this.initialized) {
//       const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
//       this.audioContext = new AudioCtx();
//       this.initialized = true;
//     }
//     if (this.audioContext?.state === 'suspended') {
//       this.audioContext.resume();
//     }
//   }

//   public setEnabled(enabled: boolean): void {
//     this.isEnabled = enabled;
//   }

//   public setVolume(level: number): void {
//     this.volume = Math.max(0, Math.min(1, level));
//   }

//   public getVolume(): number {
//     return this.volume;
//   }

//   public getEnabled(): boolean {
//     return this.isEnabled;
//   }

//   public playSuccess(): void {
//     if (!this.isEnabled || typeof window === 'undefined') return;
//     this.ensureContext();
//     if (!this.audioContext) return;

//     const ctx = this.audioContext;
//     const now = ctx.currentTime;
//     const gain = ctx.createGain();
//     gain.gain.value = this.volume;
//     gain.connect(ctx.destination);

//     // C-E-G major chord
//     [523.25, 659.25, 783.99].forEach((freq, i) => {
//       const osc = ctx.createOscillator();
//       const oscGain = ctx.createGain();
//       osc.frequency.value = freq;
//       oscGain.gain.setValueAtTime(0, now + i * 0.1);
//       oscGain.gain.linearRampToValueAtTime(0.5, now + i * 0.1 + 0.02);
//       oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
//       osc.connect(oscGain).connect(gain);
//       osc.start(now + i * 0.1);
//       osc.stop(now + i * 0.1 + 0.4);
//     });
//   }

//   public playError(): void {
//     if (!this.isEnabled || typeof window === 'undefined') return;
//     this.ensureContext();
//     if (!this.audioContext) return;

//     const ctx = this.audioContext;
//     const now = ctx.currentTime;
//     const gain = ctx.createGain();
//     gain.gain.value = this.volume;
//     gain.connect(ctx.destination);

//     // Descending dissonant tones
//     [466.16, 329.63].forEach((freq, i) => {
//       const osc = ctx.createOscillator();
//       const oscGain = ctx.createGain();
//       const filter = ctx.createBiquadFilter();
//       osc.type = 'square';
//       osc.frequency.value = freq;
//       filter.type = 'lowpass';
//       filter.frequency.value = 1200;
//       oscGain.gain.setValueAtTime(0, now + i * 0.15);
//       oscGain.gain.linearRampToValueAtTime(0.3, now + i * 0.15 + 0.015);
//       oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
//       osc.connect(filter).connect(oscGain).connect(gain);
//       osc.start(now + i * 0.15);
//       osc.stop(now + i * 0.15 + 0.3);
//     });
//   }

//   public destroy(): void {
//     this.audioContext?.close();
//     this.audioContext = null;
//     this.initialized = false;
//   }
// }

// let instance: BettingAudioFeedback | null = null;
// export const getAudioFeedback = () => {
//   if (typeof window === 'undefined') return new BettingAudioFeedback({ enabled: false });
//   if (!instance) instance = new BettingAudioFeedback();
//   return instance;
// };






// src/lib/audioFeedback.ts

export class BettingAudioFeedback {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean;
  private volume: number;
  private initialized = false;

  constructor(options: { volume?: number; enabled?: boolean } = {}) {
    this.isEnabled = options.enabled ?? true;
    this.volume = options.volume ?? 0.5;
  }

  private ensureContext(): void {
    if (typeof window === 'undefined') return;
    if (!this.initialized) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.initialized = true;
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public setVolume(level: number): void {
    this.volume = Math.max(0, Math.min(1, level));
  }

  public getVolume(): number {
    return this.volume;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  // ============================================
  // SUCCESS SOUNDS (5 variants)
  // ============================================

  // Success 1: Classic ascending major triad (C-E-G)
  public playSuccess1(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.frequency.value = freq;
      oscGain.gain.setValueAtTime(0, now + i * 0.1);
      oscGain.gain.linearRampToValueAtTime(0.5, now + i * 0.1 + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
      osc.connect(oscGain).connect(gain);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  }

  // Success 2: Bright bell-like chime (G-B-D chord progression)
  public playSuccess2(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    // G major chord with harmonics
    [783.99, 987.77, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      oscGain.gain.setValueAtTime(0, now + i * 0.08);
      oscGain.gain.linearRampToValueAtTime(0.4, now + i * 0.08 + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.5);
      osc.connect(oscGain).connect(gain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.5);
    });

    // Shimmer
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.value = 2349.32;
    shimmerGain.gain.setValueAtTime(0, now);
    shimmerGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    shimmer.connect(shimmerGain).connect(gain);
    shimmer.start(now);
    shimmer.stop(now + 0.5);
  }

  // Success 3: Uplifting arpeggio (A minor pentatonic rise)
  public playSuccess3(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    // A-C-E-A arpeggio
    [440, 523.25, 659.25, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      oscGain.gain.setValueAtTime(0, now + i * 0.06);
      oscGain.gain.linearRampToValueAtTime(0.45, now + i * 0.06 + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.35);
      osc.connect(oscGain).connect(gain);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.35);
    });
  }

  // Success 4: Dreamy glide (frequency sweep up with chorus)
  public playSuccess4(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    // Frequency sweep from 440Hz to 880Hz
    [0, 0.05].forEach((offset) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(oscGain).connect(gain);
      osc.start(now + offset);
      osc.stop(now + 0.5);
    });
  }

  // Success 5: Casino jackpot (rapid ascending notes)
  public playSuccess5(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    // Rapid chromatic scale
    const notes = [261.63, 293.66, 329.63, 369.99, 415.30, 466.16, 523.25, 587.33];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      
      oscGain.gain.setValueAtTime(0, now + i * 0.04);
      oscGain.gain.linearRampToValueAtTime(0.25, now + i * 0.04 + 0.005);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.15);
      
      osc.connect(filter).connect(oscGain).connect(gain);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.15);
    });
  }

  // ============================================
  // ERROR SOUNDS (5 variants)
  // ============================================

  // Error 1: Classic descending tritone
  public playError1(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    [466.16, 329.63].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'square';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      oscGain.gain.setValueAtTime(0, now + i * 0.15);
      oscGain.gain.linearRampToValueAtTime(0.3, now + i * 0.15 + 0.015);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
      osc.connect(filter).connect(oscGain).connect(gain);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.3);
    });
  }

  // Error 2: Sharp buzz (high-frequency alarm-like)
  public playError2(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    // Two harsh buzzes
    [0, 0.15].forEach((offset) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 200;
      oscGain.gain.setValueAtTime(0, now + offset);
      oscGain.gain.linearRampToValueAtTime(0.35, now + offset + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
      osc.connect(oscGain).connect(gain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
  }

  // Error 3: Low warning tone (submarine alert style)
  public playError3(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    // Deep pulsing tone
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 110;
      oscGain.gain.setValueAtTime(0, now + i * 0.12);
      oscGain.gain.linearRampToValueAtTime(0.4, now + i * 0.12 + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.1);
      osc.connect(oscGain).connect(gain);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.1);
    }
  }

  // Error 4: Mechanical failure (descending with noise)
  public playError4(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    // Descending sweep
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(oscGain).connect(gain);
    osc.start(now);
    osc.stop(now + 0.35);

    // Noise burst
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.connect(noiseGain).connect(gain);
    noise.start(now);
  }

  // Error 5: Digital glitch (staccato random frequencies)
  public playError5(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = this.volume;
    gain.connect(ctx.destination);

    // Random dissonant notes
    const frequencies = [220, 185, 247, 196, 233];
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'square';
      osc.frequency.value = freq;
      filter.type = 'bandpass';
      filter.frequency.value = 500;
      filter.Q.value = 5;
      oscGain.gain.setValueAtTime(0, now + i * 0.06);
      oscGain.gain.linearRampToValueAtTime(0.25, now + i * 0.06 + 0.005);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.05);
      osc.connect(filter).connect(oscGain).connect(gain);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.05);
    });
  }

  public destroy(): void {
    this.audioContext?.close();
    this.audioContext = null;
    this.initialized = false;
  }
}

let instance: BettingAudioFeedback | null = null;
export const getAudioFeedback = () => {
  if (typeof window === 'undefined') return new BettingAudioFeedback({ enabled: false });
  if (!instance) instance = new BettingAudioFeedback();
  return instance;
};