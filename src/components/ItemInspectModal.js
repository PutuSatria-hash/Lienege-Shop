// RPG Item Inspection Modal with 3D Parallax Tilt Card
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';

let modalContainer = null;
let currentItem = null;

export function initItemInspectModal() {
  if (document.getElementById('item-inspect-modal')) return;

  modalContainer = document.createElement('div');
  modalContainer.id = 'item-inspect-modal';
  modalContainer.className = 'modal-backdrop hidden';
  document.body.appendChild(modalContainer);

  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      closeItemInspect();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
      closeItemInspect();
    }
  });
}

export function openItemInspect(item) {
  if (!modalContainer) initItemInspectModal();
  currentItem = item;
  sound.playClick();

  const formattedPrice = Number(item.price || 0).toLocaleString('en-US');
  const inWishlist = storage.isInWishlist(item.id);
  const isAvailable = item.status !== 'Sold Out' && item.status !== 'Habis';
  const settings = storage.getSettings();

  // Procedural RPG stats & lore flavor
  const rarityColors = {
    mythic: '#f43f5e',
    legendary: '#fbbf24',
    epic: '#c084fc',
    rare: '#38bdf8',
    common: '#94a3b8'
  };
  const glowColor = rarityColors[item.rarity] || '#ffd166';

  modalContainer.innerHTML = `
    <div class="inspect-modal-card">
      <div class="inspect-header font-pixel">
        <span>⚔️ ITEM VAULT INSPECTOR</span>
        <button class="inspect-close-btn font-pixel" id="btn-close-inspect">✕</button>
      </div>

      <div class="inspect-body">
        <!-- 3D Tilt Card Display Stage -->
        <div class="tilt-card-stage" id="tilt-card-stage">
          <div class="tilt-card rarity-${item.rarity}" id="tilt-card-surface" style="--glow-color: ${glowColor};">
            <div class="tilt-glare" id="tilt-glare"></div>
            <div class="tilt-badge-row">
              <span class="rarity-badge ${item.rarity}">${item.rarity}</span>
              <span class="vault-status-pill font-silkscreen">🟢 IN VAULT</span>
            </div>
            
            <div class="tilt-img-wrap">
              <img src="${item.image}" alt="${item.name}" class="tilt-item-img" />
            </div>

            <div class="tilt-item-meta">
              <h3 class="tilt-title font-pixel">${item.name}</h3>
              <span class="tilt-cat font-silkscreen">${item.category.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <!-- Detailed Item Specifications & Lore -->
        <div class="inspect-details">
          <div class="inspect-price-banner">
            <div>
              <span class="inspect-lbl font-silkscreen">ESTIMATED PRICE</span>
              <div class="inspect-price-val font-pixel">
                <span style="color: #ffd166;">🪙</span> ${formattedPrice} GOLD
              </div>
            </div>
            <div class="trade-rating-box">
              <span class="inspect-lbl font-silkscreen">TRADE TIER</span>
              <span class="trade-tier-tag font-pixel">TIER S ★★★</span>
            </div>
          </div>

          <div class="inspect-section">
            <h4 class="inspect-section-title font-pixel">📜 ANCIENT LORE</h4>
            <p class="inspect-lore-text">
              ${item.description || 'An artifact of untold lineage power, recovered from deep catacombs.'}
            </p>
          </div>

          <div class="inspect-section">
            <h4 class="inspect-section-title font-pixel">⚡ ITEM SPECIFICATIONS</h4>
            <div class="inspect-specs-grid font-silkscreen">
              <div class="spec-row">
                <span class="spec-k">Trade Type:</span>
                <span class="spec-v">Gold / In-Game Barter</span>
              </div>
              <div class="spec-row">
                <span class="spec-k">Fulfillment:</span>
                <span class="spec-v">Direct Roblox Server Trade</span>
              </div>
              <div class="spec-row">
                <span class="spec-k">Vault Security:</span>
                <span class="spec-v">100% Verified Safe</span>
              </div>
              <div class="spec-row">
                <span class="spec-k">Boss Review:</span>
                <span class="spec-v">Instant Discord Notification</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="inspect-actions">
            <button class="pixel-btn inspect-buy-btn" id="btn-inspect-buy" ${isAvailable ? '' : 'disabled'}>
              ${isAvailable ? '🛒 ADD TO CART' : 'OUT OF STOCK'}
            </button>
            <button class="pixel-btn secondary inspect-wish-btn" id="btn-inspect-wish">
              ${inWishlist ? '❤️ IN WISHLIST' : '🤍 SAVE TO WISHLIST'}
            </button>
            <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" class="pixel-btn gold roblox-direct-btn">
              🎮 MEET BOSS ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');

  // Wire up close button
  const btnClose = modalContainer.querySelector('#btn-close-inspect');
  if (btnClose) {
    btnClose.addEventListener('click', closeItemInspect);
  }

  // Wire up Buy
  const btnBuy = modalContainer.querySelector('#btn-inspect-buy');
  if (btnBuy && isAvailable) {
    btnBuy.addEventListener('click', () => {
      sound.playCoin();
      storage.addToCart(item, 1);
      showToast(`${item.name} added to cart!`, 'success');
      closeItemInspect();
    });
  }

  // Wire up Wishlist
  const btnWish = modalContainer.querySelector('#btn-inspect-wish');
  if (btnWish) {
    btnWish.addEventListener('click', () => {
      sound.playClick();
      const added = storage.toggleWishlist(item);
      btnWish.textContent = added ? '❤️ IN WISHLIST' : '🤍 SAVE TO WISHLIST';
      showToast(added ? `${item.name} added to wishlist!` : `${item.name} removed from wishlist`, 'info');
    });
  }

  // 3D Tilt Card Parallax Physics
  const stage = modalContainer.querySelector('#tilt-card-stage');
  const cardSurface = modalContainer.querySelector('#tilt-card-surface');
  const glare = modalContainer.querySelector('#tilt-glare');

  if (stage && cardSurface) {
    const handleMove = (e) => {
      const rect = stage.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (!clientX || !clientY) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      cardSurface.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`;
        glare.style.opacity = '1';
      }
    };

    const handleLeave = () => {
      cardSurface.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      if (glare) glare.style.opacity = '0';
    };

    stage.addEventListener('mousemove', handleMove);
    stage.addEventListener('mouseleave', handleLeave);
    stage.addEventListener('touchmove', handleMove, { passive: true });
    stage.addEventListener('touchend', handleLeave, { passive: true });
  }
}

export function closeItemInspect() {
  if (modalContainer) {
    sound.playClick();
    modalContainer.classList.add('hidden');
    currentItem = null;
  }
}
