// Item Card Component with 3D Inspector Trigger & Wishlist (100% English & Mobile-First)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';
import { openItemInspect } from './ItemInspectModal.js';

export function createItemCard(item, onAddToCart) {
  const card = document.createElement('article');
  card.className = `item-card rarity-${item.rarity || 'common'}`;
  card.id = `item-card-${item.id}`;

  const formattedPrice = Number(item.price || 0).toLocaleString('en-US');
  const stock = typeof item.stock === 'number' ? item.stock : 10;
  const isAvailable = stock > 0 && item.status !== 'Sold Out' && item.status !== 'Habis';
  const inWishlist = storage.isInWishlist(item.id);

  let stockBadge = '';
  if (stock <= 0) {
    stockBadge = `<span class="stock-badge out-stock font-silkscreen">HABIS</span>`;
  } else if (stock <= 3) {
    stockBadge = `<span class="stock-badge low-stock font-silkscreen">SISA ${stock}!</span>`;
  } else {
    stockBadge = `<span class="stock-badge in-stock font-silkscreen">STOK: ${stock}</span>`;
  }

  card.innerHTML = `
    <div class="item-card-header">
      <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
        <span class="item-category-tag">${item.category}</span>
        ${stockBadge}
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span class="vault-mini-tag font-silkscreen">🟢 VAULT</span>
        <span class="rarity-badge ${item.rarity}">${item.rarity}</span>
      </div>
    </div>

    <div class="item-img-stage" title="Click to inspect 3D RPG details">
      <button class="card-wish-btn ${inWishlist ? 'active' : ''}" title="Save to Build Loadout / Wishlist">
        ${inWishlist ? '❤️' : '🤍'}
      </button>
      <img src="${item.image}" alt="${item.name}" class="item-pixel-img" loading="lazy" />
      <span class="inspect-hint font-silkscreen">🔍 INSPECT</span>
    </div>

    <div class="item-card-body">
      <h3 class="item-title">${item.name}</h3>
      <p class="item-desc">${item.description || 'Rare dungeon equipment.'}</p>
      
      <div class="item-card-footer">
        <div class="item-price-block">
          <span class="price-label">Price</span>
          <span class="price-val">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="7" fill="#ffd166"/>
              <circle cx="8" cy="8" r="5" fill="#f4a261"/>
              <text x="5.5" y="11" font-size="8" font-weight="bold" fill="#2b1842">G</text>
            </svg>
            ${formattedPrice}
          </span>
        </div>

        <button class="pixel-btn card-add-btn ${isAvailable ? '' : 'secondary disabled'}" ${isAvailable ? '' : 'disabled'}>
          ${isAvailable ? '+ BUY' : 'OUT OF STOCK'}
        </button>
      </div>
    </div>
  `;

  // Open 3D Item Inspector on Card Click
  card.addEventListener('click', () => {
    openItemInspect(item);
  });

  // Add to Cart
  const addBtn = card.querySelector('.card-add-btn');
  if (isAvailable && addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playCoin();
      storage.addToCart(item, 1);
      showToast(`${item.name} added to cart!`, 'success');
      if (onAddToCart) onAddToCart(item);
    });
  }

  // Toggle Wishlist
  const wishBtn = card.querySelector('.card-wish-btn');
  if (wishBtn) {
    wishBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      const added = storage.toggleWishlist(item);
      wishBtn.textContent = added ? '❤️' : '🤍';
      wishBtn.classList.toggle('active', added);
      showToast(added ? `${item.name} saved to wishlist!` : `${item.name} removed from wishlist`, 'info');
    });
  }

  // Sync wishlist heart icon on change
  window.addEventListener('pl_wishlist_updated', (e) => {
    const isNowInWish = (e.detail || []).some(i => i.id === item.id);
    if (wishBtn) {
      wishBtn.textContent = isNowInWish ? '❤️' : '🤍';
      wishBtn.classList.toggle('active', isNowInWish);
    }
  });

  return card;
}
