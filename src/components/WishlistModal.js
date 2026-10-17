// Wishlist & Build Planner Modal (Pro Trader Loadout Planner)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';

let modalContainer = null;

export function initWishlistModal() {
  if (document.getElementById('wishlist-modal')) return;

  modalContainer = document.createElement('div');
  modalContainer.id = 'wishlist-modal';
  modalContainer.className = 'modal-backdrop hidden';
  document.body.appendChild(modalContainer);

  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      closeWishlist();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
      closeWishlist();
    }
  });
}

export function openWishlist() {
  if (!modalContainer) initWishlistModal();
  sound.playClick();
  renderWishlistContent();
  modalContainer.classList.remove('hidden');
}

export function closeWishlist() {
  if (modalContainer) {
    sound.playClick();
    modalContainer.classList.add('hidden');
  }
}

function renderWishlistContent() {
  const wishlist = storage.getWishlist();
  const totalGold = wishlist.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  modalContainer.innerHTML = `
    <div class="modal-content mobile-sheet" style="max-width: 600px;">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">🤍</span>
          <h2 class="font-pixel" style="font-size: 12px; color: var(--accent-gold);">
            SAVED BUILD & WISHLIST (${wishlist.length})
          </h2>
        </div>
        <button class="modal-close-btn font-pixel" id="btn-close-wishlist">✕</button>
      </div>

      <div class="modal-body">
        ${wishlist.length === 0 ? `
          <div style="text-align: center; padding: 48px 16px;">
            <p style="font-size: 32px; margin-bottom: 12px;">🛡️</p>
            <p class="font-pixel" style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">YOUR WISHLIST IS EMPTY</p>
            <p style="font-size: 12px; color: var(--text-dim); max-width: 340px; margin: 0 auto 20px;">
              Click the heart icon on any item or inspect card to plan your dream dungeon equipment loadout.
            </p>
            <button class="pixel-btn" id="btn-browse-items">EXPLORE CATALOG</button>
          </div>
        ` : `
          <div class="wishlist-items-list">
            ${wishlist.map(item => `
              <div class="wishlist-item-row rarity-${item.rarity || 'common'}">
                <img src="${item.image}" alt="${item.name}" class="wishlist-item-img" />
                <div class="wishlist-item-info">
                  <span class="rarity-badge ${item.rarity || 'common'}" style="font-size: 7px;">${item.rarity}</span>
                  <h4 class="wishlist-item-title">${item.name}</h4>
                  <span class="wishlist-item-price font-silkscreen">🪙 ${Number(item.price || 0).toLocaleString()} GOLD</span>
                </div>
                <div class="wishlist-item-actions">
                  <button class="pixel-btn small btn-wish-to-cart" data-id="${item.id}">+ CART</button>
                  <button class="pixel-btn-tiny secondary btn-wish-remove" data-id="${item.id}">✕</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Total Calculation & Batch Action -->
          <div class="wishlist-summary-card">
            <div class="summary-line">
              <span class="font-silkscreen" style="font-size: 11px; color: var(--text-muted);">TOTAL LOADOUT VALUE:</span>
              <span class="font-pixel" style="font-size: 14px; color: var(--accent-gold);">
                🪙 ${totalGold.toLocaleString()} GOLD
              </span>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
              <button class="pixel-btn" id="btn-move-all-cart" style="flex: 1;">
                🛒 MOVE ALL TO CART
              </button>
              <button class="pixel-btn secondary" id="btn-clear-wishlist">
                CLEAR ALL
              </button>
            </div>
          </div>
        `}
      </div>
    </div>
  `;

  // Close handlers
  const btnClose = modalContainer.querySelector('#btn-close-wishlist');
  if (btnClose) btnClose.addEventListener('click', closeWishlist);

  const btnBrowse = modalContainer.querySelector('#btn-browse-items');
  if (btnBrowse) btnBrowse.addEventListener('click', closeWishlist);

  // Individual Actions
  modalContainer.querySelectorAll('.btn-wish-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = wishlist.find(i => i.id === id);
      if (item) {
        sound.playCoin();
        storage.addToCart(item, 1);
        storage.toggleWishlist(item);
        showToast(`${item.name} moved to cart!`, 'success');
        renderWishlistContent();
      }
    });
  });

  modalContainer.querySelectorAll('.btn-wish-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = wishlist.find(i => i.id === id);
      if (item) {
        sound.playRemove();
        storage.toggleWishlist(item);
        showToast(`${item.name} removed from wishlist`, 'info');
        renderWishlistContent();
      }
    });
  });

  // Batch actions
  const btnMoveAll = modalContainer.querySelector('#btn-move-all-cart');
  if (btnMoveAll) {
    btnMoveAll.addEventListener('click', () => {
      sound.playFanfare();
      wishlist.forEach(item => storage.addToCart(item, 1));
      storage.clearWishlist();
      showToast(`All ${wishlist.length} items moved to cart!`, 'success');
      closeWishlist();
    });
  }

  const btnClear = modalContainer.querySelector('#btn-clear-wishlist');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      sound.playRemove();
      storage.clearWishlist();
      showToast('Wishlist cleared', 'info');
      renderWishlistContent();
    });
  }
}
