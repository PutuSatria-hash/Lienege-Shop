import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { bgm } from '../utils/bgm.js';
import { showToast } from './Toast.js';

export function renderNavbar(container, callbacks) {
  const settings = storage.getSettings();
  const cart = storage.getCart();
  const wishlist = storage.getWishlist();
  const customerId = storage.getCustomerId();
  const myOrders = storage.getCustomerOrders();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  container.innerHTML = `
    <!-- Top Main Header -->
    <header class="navbar">
      <!-- 1. DESKTOP HEADER ROW (Shown on screen > 768px) -->
      <div class="navbar-desktop-row">
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
          <!-- Other Games -->
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

          <!-- Public Live Chat -->
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
      </div>

      <!-- 2. MOBILE TOP APP BAR (Shown on screen <= 768px, single sleek 52px row!) -->
      <div class="navbar-mobile-row">
        <div class="mobile-nav-brand" id="mobile-brand-trigger">
          <svg class="brand-icon-mini" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
            <rect width="32" height="32" fill="none"/>
            <rect x="14" y="2" width="4" height="4" fill="#388e3c"/>
            <rect x="6" y="6" width="20" height="20" fill="#ff7a18"/>
            <rect x="8" y="8" width="16" height="16" fill="#ff9e00"/>
            <rect x="10" y="11" width="4" height="4" fill="#140924"/>
            <rect x="18" y="11" width="4" height="4" fill="#140924"/>
            <rect x="12" y="17" width="8" height="4" fill="#140924"/>
          </svg>
          <div class="mobile-brand-meta">
            <span class="mobile-title font-pixel">PIXEL LINEAGE</span>
            <span class="mobile-boss-pill font-silkscreen">
              <span class="status-indicator-dot ${(settings.robloxStatus || 'online')}"></span>
              <span class="mobile-boss-text">${(settings.robloxStatus || 'online') === 'trading' ? 'TRADING' : (settings.robloxStatus || 'online') === 'offline' ? 'OFFLINE' : 'ONLINE'}</span>
            </span>
          </div>
        </div>

        <div class="mobile-nav-actions">
          <!-- Quick BGM Toggle Button -->
          <button class="mobile-icon-btn" id="btn-mobile-bgm-toggle" title="Toggle Tavern Music">
            <span class="mobile-bgm-symbol" id="mobile-bgm-symbol">🎵</span>
          </button>

          <!-- Quick Live Chat Button -->
          <button class="mobile-icon-btn" id="btn-mobile-chat-quick" title="Live Chat with Boss">
            <span>💬</span>
          </button>

          <!-- Quick Cart Button -->
          <button class="mobile-cart-action font-pixel" id="btn-mobile-cart-quick" title="View Cart">
            <span>🛒</span>
            <span class="cart-badge font-silkscreen" id="mobile-cart-badge">${totalCartCount}</span>
          </button>

          <!-- Hamburger Menu Trigger -->
          <button class="mobile-hamburger-btn font-silkscreen" id="btn-mobile-menu-toggle" title="Open Navigation Menu">
            <span>☰</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 3. MOBILE SLIDE-OVER DRAWER -->
    <div class="mobile-drawer-backdrop hidden" id="mobile-drawer-backdrop">
      <div class="mobile-drawer-panel" id="mobile-drawer-panel">
        <div class="drawer-header">
          <div class="tokoku-brand">
            <span class="font-pixel" style="color: #ffd166; font-size: 13px;">PIXEL LINEAGE</span>
            <span class="tokoku-pill-badge font-silkscreen" style="font-size: 8px;">WISEMAN</span>
          </div>
          <button class="drawer-close-btn" id="btn-close-drawer">✕</button>
        </div>

        <div class="drawer-body">
          <!-- Customer ID Info Card -->
          <div class="drawer-card">
            <div class="drawer-card-label font-silkscreen">ID PELANGGAN ANDA</div>
            <div class="drawer-id-row font-silkscreen" id="drawer-copy-id-btn" title="Klik untuk salin ID">
              <strong style="color: var(--accent-gold);">${customerId}</strong>
              <span class="drawer-copy-tag">SALIN</span>
            </div>
          </div>

          <!-- Boss Roblox Profile -->
          <div class="drawer-card">
            <div class="drawer-card-label font-silkscreen">STATUS GAME ROBUS BOSS</div>
            <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" class="drawer-roblox-link font-silkscreen">
              <span class="status-indicator-dot ${(settings.robloxStatus || 'online')}"></span>
              <span>${(settings.robloxStatus || 'online') === 'trading' ? 'BOSS TRADING IN-GAME' : (settings.robloxStatus || 'online') === 'offline' ? 'BOSS OFFLINE' : 'BOSS ONLINE SIAP TRADE'}</span>
              <span style="margin-left: auto;">↗</span>
            </a>
          </div>

          <!-- Drawer Navigation Links -->
          <div class="drawer-links-group">
            <button class="drawer-link-item font-silkscreen" id="drawer-btn-reviews">
              <span class="drawer-link-icon">⭐</span>
              <span>Ulasan Pembeli Terverifikasi</span>
            </button>
            <button class="drawer-link-item font-silkscreen" id="drawer-btn-other-games">
              <span class="drawer-link-icon">🎮</span>
              <span>Katalog Game Lainnya</span>
              <span class="badge-coming-soon font-pixel" style="margin-left: auto;">SOON</span>
            </button>
            <button class="drawer-link-item font-silkscreen" id="drawer-btn-admin-portal" style="color: var(--accent-gold);">
              <span class="drawer-link-icon">👑</span>
              <span>Tokoku Merchant Admin</span>
            </button>
          </div>

          <!-- Drawer Audio Hub -->
          <div class="drawer-audio-hub">
            <div class="drawer-card-label font-pixel" style="color: var(--accent-orange); margin-bottom: 10px;">
              🎚️ AUDIO MIXER
            </div>
            <div class="audio-channel-item" style="margin-bottom: 12px;">
              <div class="channel-header font-silkscreen">
                <span>🎵 Tavern Music BGM</span>
                <span class="channel-pct font-pixel" id="drawer-bgm-pct">25%</span>
              </div>
              <div class="channel-slider-row">
                <input type="range" min="0" max="100" value="25" class="pixel-slider" id="drawer-slider-bgm" />
                <button class="pixel-btn-tiny font-silkscreen" id="drawer-btn-mute-bgm">MUTE</button>
              </div>
            </div>

            <div class="audio-channel-item">
              <div class="channel-header font-silkscreen">
                <span>🔔 Sound Effects SFX</span>
                <span class="channel-pct font-pixel" id="drawer-sfx-pct">80%</span>
              </div>
              <div class="channel-slider-row">
                <input type="range" min="0" max="100" value="80" class="pixel-slider" id="drawer-slider-sfx" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. MOBILE BOTTOM APP BAR (Fixed Thumb Navigation, 56px) -->
    <nav class="mobile-bottom-bar" id="mobile-bottom-bar">
      <button class="bottom-tab-btn active" id="tab-bottom-shop">
        <span class="bottom-tab-icon">🏠</span>
        <span class="bottom-tab-label font-silkscreen">Toko</span>
      </button>

      <button class="bottom-tab-btn" id="tab-bottom-wishlist">
        <span class="bottom-tab-icon">🤍</span>
        <span class="bottom-tab-label font-silkscreen">Wishlist</span>
        <span class="bottom-tab-badge" id="bottom-wish-badge">${wishlist.length}</span>
      </button>

      <button class="bottom-tab-btn" id="tab-bottom-orders">
        <span class="bottom-tab-icon">📜</span>
        <span class="bottom-tab-label font-silkscreen">Pesanan</span>
        <span class="bottom-tab-badge has-orders" id="bottom-orders-badge">${myOrders.length}</span>
      </button>

      <button class="bottom-tab-btn" id="tab-bottom-chat">
        <span class="bottom-tab-icon">💬</span>
        <span class="bottom-tab-label font-silkscreen">Chat</span>
      </button>

      <button class="bottom-tab-btn cart-accent" id="tab-bottom-cart">
        <span class="bottom-tab-icon">🛒</span>
        <span class="bottom-tab-label font-silkscreen">Keranjang</span>
        <span class="bottom-tab-badge cart-count" id="bottom-cart-badge">${totalCartCount}</span>
      </button>
    </nav>
  `;

  // --- EVENT LISTENERS (DESKTOP & MOBILE INTEGRATED) ---

  // Logo Click
  const logoTrigger = container.querySelector('#brand-logo-trigger');
  const mobileBrandTrigger = container.querySelector('#mobile-brand-trigger');
  const scrollHome = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (logoTrigger) logoTrigger.addEventListener('click', scrollHome);
  if (mobileBrandTrigger) mobileBrandTrigger.addEventListener('click', scrollHome);

  // Bottom Tabs
  const tabShop = container.querySelector('#tab-bottom-shop');
  const tabWishlist = container.querySelector('#tab-bottom-wishlist');
  const tabOrders = container.querySelector('#tab-bottom-orders');
  const tabChat = container.querySelector('#tab-bottom-chat');
  const tabCart = container.querySelector('#tab-bottom-cart');

  if (tabShop) {
    tabShop.addEventListener('click', () => {
      sound.playClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (tabWishlist) {
    tabWishlist.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenWishlist) callbacks.onOpenWishlist();
    });
  }
  if (tabOrders) {
    tabOrders.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenHistory) callbacks.onOpenHistory();
    });
  }
  if (tabChat) {
    tabChat.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenPublicChat) callbacks.onOpenPublicChat();
    });
  }
  if (tabCart) {
    tabCart.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenCart) callbacks.onOpenCart();
    });
  }

  // Quick Mobile Buttons
  const btnMobCart = container.querySelector('#btn-mobile-cart-quick');
  if (btnMobCart) {
    btnMobCart.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenCart) callbacks.onOpenCart();
    });
  }

  const btnMobChat = container.querySelector('#btn-mobile-chat-quick');
  if (btnMobChat) {
    btnMobChat.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenPublicChat) callbacks.onOpenPublicChat();
    });
  }

  const btnMobBgm = container.querySelector('#btn-mobile-bgm-toggle');
  const mobBgmSymbol = container.querySelector('#mobile-bgm-symbol');
  if (btnMobBgm) {
    btnMobBgm.addEventListener('click', () => {
      sound.playClick();
      bgm.toggle();
    });
  }

  // Mobile Drawer Open / Close
  const drawerBackdrop = container.querySelector('#mobile-drawer-backdrop');
  const btnOpenDrawer = container.querySelector('#btn-mobile-menu-toggle');
  const btnCloseDrawer = container.querySelector('#btn-close-drawer');

  const openDrawer = () => {
    sound.playClick();
    if (drawerBackdrop) drawerBackdrop.classList.remove('hidden');
  };
  const closeDrawer = () => {
    if (drawerBackdrop) drawerBackdrop.classList.add('hidden');
  };

  if (btnOpenDrawer) btnOpenDrawer.addEventListener('click', openDrawer);
  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  // Drawer Copy ID
  const drawerCopyBtn = container.querySelector('#drawer-copy-id-btn');
  if (drawerCopyBtn) {
    drawerCopyBtn.addEventListener('click', () => {
      sound.playClick();
      navigator.clipboard.writeText(customerId).then(() => {
        showToast(`Customer ID (${customerId}) disalin!`, 'success');
      });
    });
  }

  // Drawer Nav Actions
  const drawerReviews = container.querySelector('#drawer-btn-reviews');
  if (drawerReviews) {
    drawerReviews.addEventListener('click', () => {
      closeDrawer();
      sound.playClick();
      if (callbacks.onOpenReviews) callbacks.onOpenReviews();
    });
  }

  const drawerOtherGames = container.querySelector('#drawer-btn-other-games');
  if (drawerOtherGames) {
    drawerOtherGames.addEventListener('click', () => {
      closeDrawer();
      sound.playClick();
      if (callbacks.onOpenOtherGames) callbacks.onOpenOtherGames();
    });
  }

  const drawerAdminPortal = container.querySelector('#drawer-btn-admin-portal');
  if (drawerAdminPortal) {
    drawerAdminPortal.addEventListener('click', () => {
      closeDrawer();
      sound.playFanfare();
      if (callbacks.onOpenBoss) callbacks.onOpenBoss();
    });
  }

  // Desktop Action Triggers
  const navCustomerPill = container.querySelector('#nav-customer-pill');
  if (navCustomerPill) {
    navCustomerPill.addEventListener('click', () => {
      sound.playClick();
      navigator.clipboard.writeText(customerId).then(() => {
        showToast(`Customer ID (${customerId}) disalin!`, 'success');
      });
    });
  }

  const btnOtherGames = container.querySelector('#btn-other-games');
  if (btnOtherGames) {
    btnOtherGames.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenOtherGames) callbacks.onOpenOtherGames();
    });
  }

  const btnReviews = container.querySelector('#btn-reviews-nav');
  if (btnReviews) {
    btnReviews.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenReviews) callbacks.onOpenReviews();
    });
  }

  const btnPublicChat = container.querySelector('#btn-public-chat');
  if (btnPublicChat) {
    btnPublicChat.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenPublicChat) callbacks.onOpenPublicChat();
    });
  }

  const btnWishlist = container.querySelector('#btn-open-wishlist');
  if (btnWishlist) {
    btnWishlist.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenWishlist) callbacks.onOpenWishlist();
    });
  }

  const btnCart = container.querySelector('#btn-open-cart');
  if (btnCart) {
    btnCart.addEventListener('click', () => {
      sound.playClick();
      if (callbacks.onOpenCart) callbacks.onOpenCart();
    });
  }

  // Audio Mixer Sync
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

  const drawerSliderBgm = container.querySelector('#drawer-slider-bgm');
  const drawerBgmPct = container.querySelector('#drawer-bgm-pct');
  const drawerBtnMuteBgm = container.querySelector('#drawer-btn-mute-bgm');
  const drawerSliderSfx = container.querySelector('#drawer-slider-sfx');
  const drawerSfxPct = container.querySelector('#drawer-sfx-pct');

  if (btnBgm) {
    btnBgm.addEventListener('click', () => {
      sound.playClick();
      bgm.toggle();
    });
  }

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
  }

  const handleBgmInput = (val) => {
    const pct = `${val}%`;
    if (lblBgmPct) lblBgmPct.textContent = pct;
    if (drawerBgmPct) drawerBgmPct.textContent = pct;
    if (sliderBgm) sliderBgm.value = val;
    if (drawerSliderBgm) drawerSliderBgm.value = val;
    bgm.setVolume(val / 100);
  };

  const handleSfxInput = (val) => {
    const pct = `${val}%`;
    if (lblSfxPct) lblSfxPct.textContent = pct;
    if (drawerSfxPct) drawerSfxPct.textContent = pct;
    if (sliderSfx) sliderSfx.value = val;
    if (drawerSliderSfx) drawerSliderSfx.value = val;
    sound.setVolume(val / 100);
  };

  if (sliderBgm) sliderBgm.addEventListener('input', e => handleBgmInput(parseInt(e.target.value, 10)));
  if (drawerSliderBgm) drawerSliderBgm.addEventListener('input', e => handleBgmInput(parseInt(e.target.value, 10)));
  if (sliderSfx) sliderSfx.addEventListener('input', e => handleSfxInput(parseInt(e.target.value, 10)));
  if (drawerSliderSfx) drawerSliderSfx.addEventListener('input', e => handleSfxInput(parseInt(e.target.value, 10)));

  const handleMuteClick = () => {
    sound.playClick();
    if (bgm.isPlaying()) {
      bgm.pause();
    } else {
      bgm.play();
    }
  };
  if (btnMuteBgm) btnMuteBgm.addEventListener('click', handleMuteClick);
  if (drawerBtnMuteBgm) drawerBtnMuteBgm.addEventListener('click', handleMuteClick);
  if (btnTestChime) btnTestChime.addEventListener('click', () => sound.playRealmChime());

  // BGM State changes listener
  window.addEventListener('pl_bgm_state_changed', (e) => {
    const isPlaying = e.detail.playing;
    if (btnBgm) btnBgm.classList.toggle('playing', isPlaying);
    if (bgmIcon) bgmIcon.textContent = isPlaying ? 'BGM: ON' : 'BGM: OFF';
    if (mobBgmSymbol) mobBgmSymbol.textContent = isPlaying ? '🎵' : '🔇';
    if (btnMuteBgm) btnMuteBgm.textContent = isPlaying ? 'MUTE' : 'PLAY';
    if (drawerBtnMuteBgm) drawerBtnMuteBgm.textContent = isPlaying ? 'MUTE' : 'PLAY';
  });

  // Dynamic cart updates
  window.addEventListener('pl_cart_updated', (e) => {
    const count = e.detail.reduce((sum, item) => sum + item.quantity, 0);
    const badgeDesktop = container.querySelector('#nav-cart-badge');
    const badgeMobile = container.querySelector('#mobile-cart-badge');
    const badgeBottom = container.querySelector('#bottom-cart-badge');
    if (badgeDesktop) badgeDesktop.textContent = count;
    if (badgeMobile) badgeMobile.textContent = count;
    if (badgeBottom) badgeBottom.textContent = count;
  });

  // Dynamic wishlist updates
  window.addEventListener('pl_wishlist_updated', (e) => {
    const count = (e.detail || []).length;
    const badgeDesktop = container.querySelector('#nav-wish-badge');
    const badgeBottom = container.querySelector('#bottom-wish-badge');
    if (badgeDesktop) badgeDesktop.textContent = count;
    if (badgeBottom) badgeBottom.textContent = count;
  });

  // Dynamic orders updates
  window.addEventListener('pl_orders_updated', () => {
    const orders = storage.getCustomerOrders();
    const badgeBottom = container.querySelector('#bottom-orders-badge');
    if (badgeBottom) {
      badgeBottom.textContent = orders.length;
      badgeBottom.classList.toggle('has-orders', orders.length > 0);
    }
  });

  // Admin hotkey & URL route
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      sound.playFanfare();
      if (callbacks.onOpenBoss) callbacks.onOpenBoss();
    }
  });

  const checkAdminRoute = () => {
    if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
      if (callbacks.onOpenBoss) callbacks.onOpenBoss();
    }
  };
  window.addEventListener('hashchange', checkAdminRoute);
  checkAdminRoute();
}
