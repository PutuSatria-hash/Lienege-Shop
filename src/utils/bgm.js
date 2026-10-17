// Cozy Medieval Tavern Ambience & Background Music Controller
let audio = null;
let isInitialized = false;
let isMuted = false;

export const bgm = {
  init() {
    if (audio || typeof window === 'undefined') return;

    try {
      const storedMute = localStorage.getItem('pl_tavern_bgm_muted');
      isMuted = storedMute === 'true';

      const storedVol = localStorage.getItem('pl_tavern_bgm_volume');
      const volume = storedVol !== null ? parseFloat(storedVol) : 0.25;

      audio = new Audio('/tavern-music.mp3');
      audio.loop = true;
      audio.volume = isMuted ? 0 : volume;

      // Autoplay on first user interaction (browser policy)
      const tryAutoPlay = () => {
        if (isInitialized) return;
        if (!isMuted && audio && audio.volume > 0) {
          audio.play().then(() => {
            isInitialized = true;
            window.dispatchEvent(new CustomEvent('pl_bgm_state_changed', { detail: { playing: true, volume: audio.volume } }));
          }).catch(() => {
            // Autoplay prevented until user gesture
          });
        }
        document.removeEventListener('click', tryAutoPlay);
        document.removeEventListener('keydown', tryAutoPlay);
        document.removeEventListener('touchstart', tryAutoPlay);
      };

      document.addEventListener('click', tryAutoPlay, { once: true });
      document.addEventListener('keydown', tryAutoPlay, { once: true });
      document.addEventListener('touchstart', tryAutoPlay, { once: true });
    } catch (err) {
      console.warn('BGM initialization deferred:', err);
    }
  },

  play() {
    if (!audio) this.init();
    if (!audio) return;
    isMuted = false;
    localStorage.setItem('pl_tavern_bgm_muted', 'false');
    const storedVol = localStorage.getItem('pl_tavern_bgm_volume');
    const volume = storedVol !== null ? Math.max(0.05, parseFloat(storedVol)) : 0.25;
    audio.volume = volume;
    audio.play().then(() => {
      window.dispatchEvent(new CustomEvent('pl_bgm_state_changed', { detail: { playing: true, volume: audio.volume } }));
    }).catch(err => {
      console.warn('BGM play request:', err);
    });
  },

  pause() {
    if (!audio) return;
    audio.pause();
    isMuted = true;
    localStorage.setItem('pl_tavern_bgm_muted', 'true');
    window.dispatchEvent(new CustomEvent('pl_bgm_state_changed', { detail: { playing: false, volume: 0 } }));
  },

  toggle() {
    if (!audio) this.init();
    if (audio && !audio.paused && !audio.muted && audio.volume > 0) {
      this.pause();
    } else {
      this.play();
    }
  },

  isPlaying() {
    return !!(audio && !audio.paused && audio.volume > 0);
  },

  getVolume() {
    if (isMuted) return 0;
    if (audio) return audio.volume;
    const storedVol = localStorage.getItem('pl_tavern_bgm_volume');
    return storedVol !== null ? parseFloat(storedVol) : 0.25;
  },

  setVolume(vol) {
    if (!audio) this.init();
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, vol));
    audio.volume = clamped;
    localStorage.setItem('pl_tavern_bgm_volume', clamped.toString());

    if (clamped === 0) {
      isMuted = true;
      localStorage.setItem('pl_tavern_bgm_muted', 'true');
      if (!audio.paused) audio.pause();
    } else {
      isMuted = false;
      localStorage.setItem('pl_tavern_bgm_muted', 'false');
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    }

    window.dispatchEvent(new CustomEvent('pl_bgm_state_changed', { detail: { playing: this.isPlaying(), volume: audio.volume } }));
  }
};
