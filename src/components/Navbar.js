import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { bgm } from '../utils/bgm.js';
import { showToast } from './Toast.js';

export function renderNavbar(container, callbacks) {
  const settings = storage.getSettings();
  const cart = storage.getCart();
  const wishlist = storage.getWishlist();
  const customerId = storage.getCustomerId();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  container.innerHTML = `
    <header class="navbar">
      <div class="nav-brand" id="brand-logo-trigger" title="Wiseman Shop">
        <svg class="brand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
          <rect width="32" height="32" fill="none"/>
          <rect x="14" y="2" width="4" height="4" fill="#388e3c"/>
          <rect x="6" y="6" width="20" height="20" fill="#ff7a18"/>
          <rect x="8" y="8" width="16" height="16" fill="#ff9e00"/>
          <rect x="10" y="11" width="4" height="4" fill="#140924"/>
          <rect x="18" y="11" width="4" height="4" fill="#140924"/>
          <rect x="12" y="17" width="8" height="4" fill="#140924"/>
        </svg>
        <div class="brand-text">
          <h1 class="font-pixel">PIXEL LINEAGE</h1>
          <span class="font-silkscreen" style="color: #ffd166;">WISEMAN SHOP</span>
        </div>
      </div>

      <!-- Customer ID Pill -->
      <div class="customer-id-pill font-silkscreen" id="nav-customer-pill" title="Click to copy your Customer ID">
        <span style="color: var(--text-muted);">ID:</span>
        <span style="color: var(--accent-gold); font-weight: 700;">${customerId}</span>
      </div>

      <!-- Live Roblox Status Pill -->
      <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" class="roblox-status-badge font-silkscreen" id="nav-roblox-status" title="Boss In-Game Roblox Status">
        <span class="status-indicator-dot ${(settings.robloxStatus || 'online')}"></span>
        <span class="status-text">${(settings.robloxStatus || 'online') === 'trading' ? 'BOSS TRADING' : (settings.robloxStatus || 'online') === 'offline' ? 'BOSS OFFLINE' : 'BOSS ONLINE'}</span>
      </a>

      <div class="nav-actions">
        <!-- Other Games (Coming Soon) -->
        <button id="btn-other-games" class="icon-btn font-silkscreen" title="Explore Other Game Stores">
          <span>🎮 OTHER GAMES</span>
          <span class="badge-coming-soon font-pixel">SOON</span>
        </button>

        <!-- Customer Reviews -->
        <button id="btn-reviews-nav" class="icon-btn font-silkscreen" title="View Verified Customer Reviews">
          <span style="color: #ffd166;">⭐ REVIEWS</span>
        </button>

        <!-- Audio Mixer Hub with Equalizer & Volume Controller -->
        <div class="audio-mixer-group" id="audio-mixer-group">
          <button id="btn-toggle-bgm" class="icon-btn font-silkscreen bgm-nav-btn playing" title="Toggle Tavern Background Ambience Music">
            <span class="pixel-equalizer" id="bgm-equalizer">
              <span class="eq-bar b1"></span>
              <span class="eq-bar b2"></span>
              <span class="eq-bar b3"></span>
            </span>
            <span id="bgm-icon">BGM: ON</span>
          </button>
          <button id="btn-open-mixer" class="icon-btn font-silkscreen mixer-trigger-btn" title="Audio Volume & Balance Mixer">
            <span>🎚️</span>
          </button>

          <!-- Audio Mixer Popover -->
          <div class="audio-mixer-popover hidden" id="audio-mixer-popover">
            <div class="audio-popover-header font-pixel">
              <span>🎚️ AUDIO MIXER</span>
              <button class="audio-popover-close font-pixel" id="btn-close-audio-mixer">✕</button>
            </div>

            <!-- Tavern Music Channel -->
            <div class="audio-channel-item">
              <div class="channel-header font-silkscreen">
                <span>🎵 TAVERN BGM</span>
                <span class="channel-pct font-pixel" id="lbl-bgm-pct">25%</span>
              </div>
              <div class="channel-slider-row">
                <input type="range" min="0" max="100" value="25" class="pixel-slider" id="slider-bgm-vol" />
                <button class="pixel-btn-tiny font-silkscreen" id="btn-mute-bgm">MUTE</button>
              </div>
            </div>

            <!-- Sound Effects Channel -->
            <div class="audio-channel-item">
              <div class="channel-header font-silkscreen">
                <span>🔔 ADVENTURE SFX</span>
                <span class="channel-pct font-pixel" id="lbl-sfx-pct">80%</span>
              </div>
              <div class="channel-slider-row">
                <input type="range" min="0" max="100" value="80" class="pixel-slider" id="slider-sfx-vol" />
                <button class="pixel-btn-tiny secondary font-silkscreen" id="btn-test-chime" title="Test crystal chime">TEST</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Public Live Chat / Inquiries -->
        <button id="btn-public-chat" class="icon-btn font-silkscreen" title="Chat with Boss / Ask Questions">
          <span style="color: #ff9e00;">💬 LIVE CHAT</span>
        </button>

        <!-- Wishlist Nav Button -->
        <button id="btn-open-wishlist" class="icon-btn font-silkscreen wish-nav-btn" title="Saved Build & Wishlist (Press W)">
          <span>🤍 WISHLIST</span>
          <span class="cart-badge font-silkscreen" id="nav-wish-badge" style="background: #9d4edd;">${wishlist.length}</span>
        </button>

        <!-- Cart Nav Button -->
        <button id="btn-open-cart" class="cart-nav-btn font-pixel">
          <span>🛒 CART</span>
          <span class="cart-badge font-silkscreen" id="nav-cart-badge">${totalCartCount}</span>
        </button>
      </div>
    </header>
  `;

  // Brand Logo Click - gentle pixel chime sound only (no admin trigger for safety)
  const logoTrigger = container.querySelector('#brand-logo-trigger');
  if (logoTrigger) {
    logoTrigger.addEventListener('click', () => {
      sound.playClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Keyboard shortcut Ctrl + Shift + A
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      sound.playFanfare();
      if (callbacks.onOpenBoss) callbacks.onOpenBoss();
    }
  });

  // URL Hash / Query Route listener (#admin or ?admin=true)
  const checkAdminRoute = () => {
    if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
      if (callbacks.onOpenBoss) callbacks.onOpenBoss();
    }
  };
  window.addEventListener('hashchange', checkAdminRoute);
  checkAdminRoute();

  // Copy Customer ID on click
  const customerPill = container.querySelector('#nav-customer-pill');
  if (customerPill) {
    customerPill.addEventListener('click', () => {
      sound.playClick();
      navigator.clipboard.writeText(customerId).then(() => {
        showToast(`Customer ID (${customerId}) copied!`, 'success');
      });
    });
  }

  // Other Games (Coming Soon)
  const btnOtherGames = container.querySelector('#btn-other-games');
  if (btnOtherGames) {
    btnOtherGames.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenOtherGames) callbacks.onOpenOtherGames();
    });
  }

  // Reviews Modal
  const btnReviews = container.querySelector('#btn-reviews-nav');
  if (btnReviews) {
    btnReviews.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenReviews) callbacks.onOpenReviews();
    });
  }

  // Relaxed Tavern BGM Music Toggle & Audio Mixer
  const btnBgm = container.querySelector('#btn-toggle-bgm');
  const bgmIcon = container.querySelector('#bgm-icon');
  const btnOpenMixer = container.querySelector('#btn-open-mixer');
  const mixerPopover = container.querySelector('#audio-mixer-popover');
  const btnCloseMixer = container.querySelector('#btn-close-audio-mixer');
  const sliderBgm = container.querySelector('#slider-bgm-vol');
  const lblBgmPct = container.querySelector('#lbl-bgm-pct');
  const btnMuteBgm = container.querySelector('#btn-mute-bgm');
  const sliderSfx = container.querySelector('#slider-sfx-vol');
  const lblSfxPct = container.querySelector('#lbl-sfx-pct');
  const btnTestChime = container.querySelector('#btn-test-chime');

  // Initialize sliders with stored volumes
  if (sliderBgm && lblBgmPct) {
    const curBgmVol = Math.round(bgm.getVolume() * 100);
    sliderBgm.value = curBgmVol;
    lblBgmPct.textContent = `${curBgmVol}%`;
  }
  if (sliderSfx && lblSfxPct) {
    const curSfxVol = Math.round(sound.getVolume() * 100);
    sliderSfx.value = curSfxVol;
    lblSfxPct.textContent = `${curSfxVol}%`;
  }

  if (btnBgm) {
    btnBgm.addEventListener('click', () => {
      sound.playClick();
      bgm.toggle();
    });

    window.addEventListener('pl_bgm_state_changed', (e) => {
      btnBgm.classList.toggle('playing', e.detail.playing);
      if (bgmIcon) {
        bgmIcon.textContent = e.detail.playing ? 'BGM: ON' : 'BGM: OFF';
      }
      if (sliderBgm && lblBgmPct) {
        const pct = Math.round(e.detail.volume * 100);
        sliderBgm.value = pct;
        lblBgmPct.textContent = `${pct}%`;
        if (btnMuteBgm) btnMuteBgm.textContent = e.detail.playing ? 'MUTE' : 'PLAY';
      }
    });
  }

  // Audio Mixer Popover Events
  if (btnOpenMixer && mixerPopover) {
    btnOpenMixer.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      mixerPopover.classList.toggle('hidden');
    });

    if (btnCloseMixer) {
      btnCloseMixer.addEventListener('click', (e) => {
        e.stopPropagation();
        mixerPopover.classList.add('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#audio-mixer-group')) {
        mixerPopover.classList.add('hidden');
      }
    });

    if (sliderBgm) {
      sliderBgm.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (lblBgmPct) lblBgmPct.textContent = `${val}%`;
        bgm.setVolume(val / 100);
      });
    }

    if (btnMuteBgm) {
      btnMuteBgm.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playClick();
        if (bgm.isPlaying()) {
          bgm.pause();
        } else {
          bgm.play();
        }
      });
    }

    if (sliderSfx) {
      sliderSfx.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (lblSfxPct) lblSfxPct.textContent = `${val}%`;
        sound.setVolume(val / 100);
      });
    }

    if (btnTestChime) {
      btnTestChime.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playRealmChime();
      });
    }
  }

  // Public Live Chat Button
  const btnPublicChat = container.querySelector('#btn-public-chat');
  btnPublicChat.addEventListener('click', () => {
    sound.playClick();
    if (callbacks.onOpenPublicChat) callbacks.onOpenPublicChat();
  });

  // Wishlist Nav Button
  const btnWishlist = container.querySelector('#btn-open-wishlist');
  if (btnWishlist) {
    btnWishlist.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenWishlist) callbacks.onOpenWishlist();
    });
  }

  const btnCart = container.querySelector('#btn-open-cart');
  btnCart.addEventListener('click', () => {
    sound.playClick();
    if (callbacks.onOpenCart) callbacks.onOpenCart();
  });

  // Dynamic cart badge updates
  window.addEventListener('pl_cart_updated', (e) => {
    const badge = container.querySelector('#nav-cart-badge');
    if (badge) {
      const count = e.detail.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = count;
    }
  });

  // Dynamic wishlist badge updates
  window.addEventListener('pl_wishlist_updated', (e) => {
    const badge = container.querySelector('#nav-wish-badge');
    if (badge) {
      badge.textContent = (e.detail || []).length;
    }
  });

  // Dynamic Roblox status badge updates
  window.addEventListener('pl_settings_updated', (e) => {
    const statusDot = container.querySelector('.status-indicator-dot');
    const statusText = container.querySelector('#nav-roblox-status .status-text');
    const statusLink = container.querySelector('#nav-roblox-status');
    const st = e.detail.robloxStatus || 'online';
    if (statusDot) {
      statusDot.className = `status-indicator-dot ${st}`;
    }
    if (statusText) {
      statusText.textContent = st === 'trading' ? 'BOSS TRADING' : st === 'offline' ? 'BOSS OFFLINE' : 'BOSS ONLINE';
    }
    if (statusLink) {
      statusLink.href = e.detail.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile';
    }
  });
}
