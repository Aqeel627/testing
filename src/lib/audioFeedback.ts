// src/lib/audioFeedback.ts

class BetAudio {
  private audioContext: AudioContext | null = null;
  private successBuffer: AudioBuffer | null = null;
  private errorBuffer: AudioBuffer | null = null;
  private initialized = false;

  private ensureContext(): void {
    if (typeof window === 'undefined') return;
    if (!this.initialized) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.initialized = true;
      this.preload();
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private async loadSound(url: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn(`Failed to load ${url}:`, e);
      return null;
    }
  }

  private async preload(): Promise<void> {
    if (!this.successBuffer) {
      this.successBuffer = await this.loadSound('/sounds/success.mp3');
    }
    if (!this.errorBuffer) {
      this.errorBuffer = await this.loadSound('/sounds/error.mp3');
    }
  }

  private playBuffer(buffer: AudioBuffer | null): void {
    if (!this.audioContext || !buffer) return;
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  /**
   * Play success sound from /public/sounds/success.mp3
   */
  public async playSuccess(): Promise<void> {
    if (typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.successBuffer) await this.preload();
    this.playBuffer(this.successBuffer);
  }

  /**
   * Play error sound from /public/sounds/error.mp3
   */
  public async playError(): Promise<void> {
    if (typeof window === 'undefined') return;
    this.ensureContext();
    if (!this.errorBuffer) await this.preload();
    this.playBuffer(this.errorBuffer);
  }
}

// Singleton instance
export const betAudio = new BetAudio();