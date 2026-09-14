/**
 * =========================================================================
 * 🌸 ROMANTIC SAKURA AUDIO SYSTEM 🌸
 * =========================================================================
 * Features procedural romantic harp & piano arpeggios via Web Audio API,
 * dynamic sound effects for correct answers & celebration, and support for
 * external MP3 tracks with mute/unmute toggle.
 */

class RomanticAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.timerId = null;
    this.externalAudio = null;
    this.masterGain = null;
    this.initAudioContext();
  }

  initAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  ensureUnlocked() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMusic() {
    this.ensureUnlocked();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  play() {
    this.ensureUnlocked();
    const customUrl = window.PROPOSAL_CONFIG?.music?.customAudioUrl;
    if (customUrl) {
      if (!this.externalAudio) {
        this.externalAudio = new Audio(customUrl);
        this.externalAudio.loop = true;
      }
      this.externalAudio.play().catch(() => {});
      this.isPlaying = true;
      return;
    }

    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startProceduralMelody();
  }

  pause() {
    if (this.externalAudio) {
      this.externalAudio.pause();
    }
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.4, this.ctx.currentTime);
    }
    if (this.externalAudio) {
      this.externalAudio.muted = muted;
    }
  }

  // Play a soft, dreamy piano/harp note
  playNote(freq, time = 0, duration = 2.2, type = 'sine', velocity = 0.3) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime + time;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Warm undertone
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 0.5, now);

    // Low-pass filter for soft, warm acoustic body
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(350, now + duration);

    // Gentle pluck attack and long romantic decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(velocity, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  // Romantic arpeggio sequence in C Major / A Minor Pentatonic
  startProceduralMelody() {
    // Note frequencies
    const notes = {
      C4: 261.63, E4: 329.63, G4: 392.00, B4: 493.88, D5: 587.33,
      A3: 220.00, C5: 523.25, E5: 659.25,
      F3: 174.61, A4: 440.00,
      G3: 196.00,
      C6: 1046.50
    };

    // Progression: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4/G
    const pattern = [
      // Bar 1: Cmaj9
      { note: notes.C4, time: 0.0, vel: 0.28 },
      { note: notes.G4, time: 0.4, vel: 0.20 },
      { note: notes.B4, time: 0.8, vel: 0.24 },
      { note: notes.D5, time: 1.2, vel: 0.22 },
      { note: notes.E5, time: 1.6, vel: 0.26 },
      { note: notes.B4, time: 2.0, vel: 0.18 },
      { note: notes.G4, time: 2.4, vel: 0.18 },

      // Bar 2: Am9
      { note: notes.A3, time: 2.8, vel: 0.28 },
      { note: notes.E4, time: 3.2, vel: 0.20 },
      { note: notes.A4, time: 3.6, vel: 0.22 },
      { note: notes.C5, time: 4.0, vel: 0.26 },
      { note: notes.E5, time: 4.4, vel: 0.24 },
      { note: notes.C5, time: 4.8, vel: 0.18 },
      { note: notes.A4, time: 5.2, vel: 0.18 },

      // Bar 3: Fmaj7
      { note: notes.F3, time: 5.6, vel: 0.28 },
      { note: notes.C4, time: 6.0, vel: 0.20 },
      { note: notes.A4, time: 6.4, vel: 0.24 },
      { note: notes.C5, time: 6.8, vel: 0.22 },
      { note: notes.E5, time: 7.2, vel: 0.26 },
      { note: notes.A4, time: 7.6, vel: 0.18 },

      // Bar 4: Gadd9 / Gsus4
      { note: notes.G3, time: 8.0, vel: 0.28 },
      { note: notes.D5, time: 8.4, vel: 0.22 },
      { note: notes.G4, time: 8.8, vel: 0.20 },
      { note: notes.B4, time: 9.2, vel: 0.25 },
      { note: notes.D5, time: 9.6, vel: 0.24 },
      { note: notes.G4, time: 10.0, vel: 0.18 },
      { note: notes.B4, time: 10.4, vel: 0.20 }
    ];

    const loopLength = 10.8;

    const playLoop = () => {
      if (!this.isPlaying) return;
      pattern.forEach(p => {
        this.playNote(p.note, p.time, 2.5, 'sine', p.vel);
      });
    };

    playLoop();
    this.timerId = setInterval(() => {
      if (this.isPlaying) playLoop();
    }, loopLength * 1000);
  }

  // Sparkle chime on correct answer
  playSuccessSound() {
    this.ensureUnlocked();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chimeFreqs.forEach((f, idx) => {
      this.playNote(f, idx * 0.09, 1.4, 'sine', 0.25);
    });
  }

  // Playful wobble on wrong answer
  playWrongSound() {
    this.ensureUnlocked();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Grand celebration chord on YES!
  playCelebrationFanfare() {
    this.ensureUnlocked();
    if (!this.ctx || this.isMuted) return;
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C
      [329.63, 392.00, 493.88, 659.25], // Em
      [349.23, 440.00, 523.25, 698.46], // F
      [392.00, 493.88, 587.33, 783.99, 1046.50] // G & high C
    ];

    chords.forEach((chord, step) => {
      const stepTime = step * 0.35;
      chord.forEach(f => {
        this.playNote(f, stepTime, 2.5, 'sine', 0.22);
      });
    });
  }
}

window.RomanticAudio = RomanticAudio;
