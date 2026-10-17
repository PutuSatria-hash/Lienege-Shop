// Pure Pixel Art Banner Carousel with Interactive Realm Selector (Wiseman Shop)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';

const PURE_ART_SLIDES = [
  {
    image: '/banner-forest-canopy.png',
    title: 'THE VERDANT SUNLIT GLADE',
    caption: 'Towering ancient oak trees sheltering rare lineage merchant treasures'
  },
  {
    image: '/banner-mountain-lake.jpg',
    title: 'CAMPFIRE UNDER THE FROST PEAKS',
    caption: 'Quiet reflective waters where travelers gather at nightfall'
  },
  {
    image: '/banner-mystic-woods.png',
    title: 'THE DEEP ENCHANTED HOLLOW',
    caption: 'Twisted ancient roots imbued with forgotten magic and spectral embers'
  },
  {
    image: '/banner-forest-glade.png',
    title: 'THE ENCHANTED LINEAGE FOREST',
    caption: 'Ancient clearing where adventurers rest before dungeon crawls'
  },
  {
    image: '/banner-sword-stone.png',
    title: 'THE SHRINE OF THE ANCIENT BLADE',
    caption: 'Legendary sword sealed under sunbeams of the sacred grove'
  },
  {
    image: '/banner-sword-waterfall.png',
    title: 'WATERFALL SANCTUARY & LANTERN GLOW',
    caption: 'Mystic springs harboring sacred relics and frog familiars'
  }
];

export function renderBannerHeader(container) {
  let currentSlide = 0;
  let autoSlideTimer = null;
  let isAutoRotate = true;

  const items = storage.getItems();
  const settings = storage.getSettings();

  container.innerHTML = `
    <section class="event-banner-wrap pure-art-banner" id="carousel-banner-wrap">
      <!-- Carousel Slider Track -->
      <div class="carousel-track" id="carousel-track">
        ${PURE_ART_SLIDES.map((slide, idx) => `
          <div class="carousel-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
            <img src="${slide.image}" alt="${slide.title}" class="carousel-img" />
            <div class="pure-art-overlay">
              <div class="pure-art-info">
                <span class="pure-art-tag font-pixel">PIXEL REALM</span>
                <h2 class="pure-art-title font-pixel">${slide.title}</h2>
                <p class="pure-art-sub font-silkscreen">${slide.caption}</p>
              </div>

              <div class="banner-quick-actions">
                <div class="banner-stat-box">
                  <span class="stat-num stat-total-items font-silkscreen">${items.length}</span>
                  <span class="stat-lbl font-silkscreen">ITEMS</span>
                </div>
                <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" class="pixel-btn gold roblox-banner-cta" title="Visit Boss Roblox Profile">
                  🎮 ROBLOX PROFILE ↗
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Arrow Controls -->
      <button class="carousel-nav-btn prev font-pixel" id="btn-carousel-prev" title="Previous Slide">&#9664;</button>
      <button class="carousel-nav-btn next font-pixel" id="btn-carousel-next" title="Next Slide">&#9654;</button>

      <!-- Realm Selector Floating Action (Top Right) -->
      <div class="banner-realm-selector-anchor" id="realm-selector-anchor">
        <button class="realm-pill-btn font-silkscreen" id="btn-realm-selector" title="Select or Lock Realm Scenery">
          <span class="realm-pill-icon">🗺️</span>
          <span class="realm-pill-text" id="active-realm-lbl">REALM: AUTO</span>
          <span class="realm-pill-badge auto" id="realm-lock-badge">AUTO</span>
        </button>

        <!-- Dropdown Selection Panel -->
        <div class="realm-dropdown-panel hidden" id="realm-dropdown-panel">
          <div class="realm-panel-header font-pixel">
            <span>🗺️ CHOOSE REALM</span>
            <button class="realm-panel-close font-pixel" id="btn-close-realm-panel">✕</button>
          </div>
          <div class="realm-panel-list">
            <button class="realm-opt-btn active font-silkscreen" data-mode="auto">
              <span class="opt-bullet">🔄</span>
              <span class="opt-name">AUTO ROTATE (ALL REALMS)</span>
            </button>
            ${PURE_ART_SLIDES.map((slide, idx) => `
              <button class="realm-opt-btn font-silkscreen" data-index="${idx}">
                <span class="opt-bullet">📍</span>
                <span class="opt-name">${slide.title}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Dots Indicators -->
      <div class="carousel-dots" id="carousel-dots">
        ${PURE_ART_SLIDES.map((_, i) => `<span class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
      </div>
    </section>
  `;

  const slides = container.querySelectorAll('.carousel-slide');
  const dots = container.querySelectorAll('.carousel-dot');
  const btnPrev = container.querySelector('#btn-carousel-prev');
  const btnNext = container.querySelector('#btn-carousel-next');
  const bannerWrap = container.querySelector('#carousel-banner-wrap');

  // Realm Selector Elements
  const btnRealmSelector = container.querySelector('#btn-realm-selector');
  const realmDropdown = container.querySelector('#realm-dropdown-panel');
  const btnCloseRealm = container.querySelector('#btn-close-realm-panel');
  const activeRealmLbl = container.querySelector('#active-realm-lbl');
  const realmLockBadge = container.querySelector('#realm-lock-badge');
  const realmOptBtns = container.querySelectorAll('.realm-opt-btn');

  function goToSlide(index) {
    currentSlide = (index + PURE_ART_SLIDES.length) % PURE_ART_SLIDES.length;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === currentSlide);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });

    // Dynamically sync atmospheric background scenery
    window.dispatchEvent(new CustomEvent('pl_scenery_sync', { detail: PURE_ART_SLIDES[currentSlide] }));
  }

  function startAutoSlide() {
    stopAutoSlide();
    if (!isAutoRotate) return;
    autoSlideTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  btnPrev.addEventListener('click', () => {
    sound.playRealmChime();
    goToSlide(currentSlide - 1);
    if (isAutoRotate) startAutoSlide();
  });

  btnNext.addEventListener('click', () => {
    sound.playRealmChime();
    goToSlide(currentSlide + 1);
    if (isAutoRotate) startAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      sound.playRealmChime();
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
      if (isAutoRotate) startAutoSlide();
    });
  });

  bannerWrap.addEventListener('mouseenter', () => {
    if (isAutoRotate) stopAutoSlide();
  });
  bannerWrap.addEventListener('mouseleave', () => {
    if (isAutoRotate) startAutoSlide();
  });

  // Touch Swipe for mobile devices
  let touchStartX = 0;
  bannerWrap.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  bannerWrap.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 45) {
      sound.playRealmChime();
      goToSlide(currentSlide + 1);
      if (isAutoRotate) startAutoSlide();
    } else if (touchEndX - touchStartX > 45) {
      sound.playRealmChime();
      goToSlide(currentSlide - 1);
      if (isAutoRotate) startAutoSlide();
    }
  }, { passive: true });

  // Realm Selector Events
  if (btnRealmSelector && realmDropdown) {
    btnRealmSelector.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      realmDropdown.classList.toggle('hidden');
    });

    if (btnCloseRealm) {
      btnCloseRealm.addEventListener('click', (e) => {
        e.stopPropagation();
        realmDropdown.classList.add('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#realm-selector-anchor')) {
        realmDropdown.classList.add('hidden');
      }
    });

    realmOptBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        realmOptBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn.dataset.mode === 'auto') {
          sound.playRealmChime();
          isAutoRotate = true;
          activeRealmLbl.textContent = 'REALM: AUTO';
          realmLockBadge.textContent = 'AUTO';
          realmLockBadge.className = 'realm-pill-badge auto';
          showToast('Auto Realm rotation resumed', 'info');
          startAutoSlide();
        } else if (btn.dataset.index !== undefined) {
          sound.playRealmChime();
          const idx = parseInt(btn.dataset.index, 10);
          isAutoRotate = false;
          stopAutoSlide();
          goToSlide(idx);
          const shortTitle = PURE_ART_SLIDES[idx].title.replace(/^THE\s+/i, '').substring(0, 13);
          activeRealmLbl.textContent = `REALM: ${shortTitle}`;
          realmLockBadge.textContent = 'LOCKED';
          realmLockBadge.className = 'realm-pill-badge locked';
          showToast(`Realm locked: ${PURE_ART_SLIDES[idx].title}`, 'success');
        }

        realmDropdown.classList.add('hidden');
      });
    });
  }

  // Initial scenery sync on load
  window.dispatchEvent(new CustomEvent('pl_scenery_sync', { detail: PURE_ART_SLIDES[0] }));
  startAutoSlide();

  // Update item counter on change across all carousel slides
  window.addEventListener('pl_items_updated', (e) => {
    container.querySelectorAll('.stat-total-items').forEach(statEl => {
      statEl.textContent = e.detail.length;
    });
  });

  // Update Roblox link on settings change
  window.addEventListener('pl_settings_updated', (e) => {
    const robloxCta = container.querySelector('.roblox-banner-cta');
    if (robloxCta) {
      robloxCta.href = e.detail.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile';
    }
  });
}
