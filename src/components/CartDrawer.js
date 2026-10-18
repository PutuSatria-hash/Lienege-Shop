// Shopping Bag & Order Checkout Drawer (100% English & Mobile-First)
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';
import { openChat } from './LiveChatModal.js';

export function initCartDrawer() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'cart-modal';

  modal.innerHTML = `
    <div class="modal-content mobile-sheet">
      <div class="modal-header">
        <h3 class="modal-title font-pixel">🛒 SHOPPING BAG</h3>
        <button class="modal-close-btn" id="cart-close-btn">&times;</button>
      </div>

      <div class="modal-body" id="cart-modal-body">
        <!-- Dynamic Content -->
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#cart-close-btn');
  closeBtn.addEventListener('click', () => closeCart());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCart();
  });

  return {
    open: openCart,
    close: closeCart
  };
}

let activePaymentMethod = 'gold'; // 'gold' | 'barter'

export function openCart() {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;
  renderCartContent();
  modal.classList.add('open');
}

export function closeCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.classList.remove('open');
}

function renderCartContent() {
  const body = document.getElementById('cart-modal-body');
  if (!body) return;

  const cart = storage.getCart();
  const settings = storage.getSettings();
  const customerId = storage.getCustomerId();

  if (cart.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 40px 10px;">
        <p class="font-silkscreen" style="font-size: 14px; color: var(--accent-orange); margin-bottom: 12px;">
          🎒 Your Bag is Empty!
        </p>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 24px;">
          Explore items from the Wiseman Shop catalog and add them to your cart.
        </p>
        <button class="pixel-btn" id="btn-browse-items">BROWSE CATALOG</button>
      </div>
    `;
    const browseBtn = body.querySelector('#btn-browse-items');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => {
        sound.playClick();
        closeCart();
      });
    }
    return;
  }

  // Calculate Total Gold
  const totalGold = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const formattedTotalGold = totalGold.toLocaleString('en-US');

  body.innerHTML = `
    <!-- Customer ID Header -->
    <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 8px 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
      <span class="font-silkscreen" style="font-size: 10px; color: var(--text-muted);">Your Customer ID:</span>
      <span class="font-pixel" style="font-size: 9px; color: var(--accent-gold);">${customerId}</span>
    </div>

    <!-- Cart Items List -->
    <div class="cart-items-list">
      ${cart.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <div class="cart-item-info">
            <img src="${item.image}" alt="${item.name}" class="cart-item-icon" />
            <div>
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-sub font-silkscreen">${(item.price || 0).toLocaleString('en-US')} Gold</div>
            </div>
          </div>
          
          <div class="qty-control">
            <button class="qty-btn btn-qty-minus" data-id="${item.id}">-</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn btn-qty-plus" data-id="${item.id}">+</button>
            <button class="qty-btn btn-remove" data-id="${item.id}" style="color: #ef476f; margin-left: 6px;" title="Remove">✕</button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Payment Method Selector -->
    <div style="margin-top: 16px;">
      <label class="form-label font-silkscreen">Payment Method</label>
      <div class="payment-selector">
        <div class="payment-opt-card ${activePaymentMethod === 'gold' ? 'selected' : ''}" id="opt-pay-gold">
          <div class="payment-opt-title">🪙 PAY WITH GOLD</div>
          <div class="payment-opt-desc">Auto-calculated gold amount</div>
        </div>
        <div class="payment-opt-card ${activePaymentMethod === 'barter' ? 'selected' : ''}" id="opt-pay-barter">
          <div class="payment-opt-title">🔄 ITEM BARTER</div>
          <div class="payment-opt-desc">Reviewed & verified by Boss</div>
        </div>
      </div>
    </div>

    <!-- Conditional Barter Offer Details -->
    <div id="barter-details-box" style="${activePaymentMethod === 'barter' ? 'display: block;' : 'display: none;'} margin-bottom: 16px;">
      <div class="barter-helper-box font-silkscreen" style="background: rgba(255, 122, 24, 0.08); border: 1px solid rgba(255, 122, 24, 0.25); padding: 10px; margin-bottom: 12px; font-size: 10px; color: #cbd5e1; line-height: 1.5;">
        <div style="color: var(--accent-orange); font-weight: 700; margin-bottom: 4px;">⚖️ TRADE VALUATION GUIDE</div>
        <div>Target Cart Value: <strong style="color: var(--accent-gold);">${formattedTotalGold} Gold</strong></div>
        <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">
          💡 Tip: Offer 1 item of matching rarity tier or 2-3 items of the tier below for instant Boss acceptance!
        </div>
      </div>

      <div class="form-group">
        <label class="form-label font-silkscreen" style="color: #ff9e00;">Item(s) Offered for Exchange *</label>
        <textarea 
          id="input-barter-offer" 
          class="pixel-input form-textarea" 
          placeholder="E.g.: Offering 1x Blood Moon Sigil + 2x Crypt Keys in exchange..."
        ></textarea>
        <span style="font-size: 10px; color: var(--text-muted); display: block; margin-top: 4px;">
          * Your barter offer is sent directly to Boss via Discord alert & Live Chat.
        </span>
      </div>
    </div>

    <!-- Buyer Details Form -->
    <div class="form-group">
      <label class="form-label font-silkscreen">In-Game Character Name (IGN) *</label>
      <input 
        type="text" 
        id="input-buyer-ign" 
        class="pixel-input" 
        placeholder="Enter your Pixel Lineage character name..."
      />
    </div>

    <div class="form-group">
      <label class="form-label font-silkscreen">Trade Notes (Optional)</label>
      <input 
        type="text" 
        id="input-buyer-notes" 
        class="pixel-input" 
        placeholder="Server name, world, or available trade time..."
      />
    </div>

    <!-- Summary Box -->
    <div class="cart-summary-box">
      <div>
        <div class="cart-total-label font-silkscreen">
          ${activePaymentMethod === 'gold' ? 'Total Gold Required' : 'Estimated Trade Value'}
        </div>
        <div class="cart-total-value font-silkscreen">
          ${formattedTotalGold} Gold
        </div>
      </div>

      <button class="pixel-btn gold" id="btn-submit-order" style="padding: 12px 18px;">
        SUBMIT ORDER & START CHAT 💬
      </button>
    </div>

    <!-- Roblox Profile Direct Access -->
    <div style="margin-top: 14px; text-align: center; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 10px;">
      <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" style="color: #ffd166; font-size: 11px; text-decoration: none;" class="font-silkscreen">
        🎮 View Boss Roblox Profile (4035030385) ↗
      </a>
    </div>
  `;

  // Attach Stepper & Remove Events
  body.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const id = btn.getAttribute('data-id');
      const item = cart.find(i => i.id === id);
      if (item) {
        storage.updateCartQuantity(id, item.quantity - 1);
        renderCartContent();
      }
    });
  });

  body.querySelectorAll('.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const id = btn.getAttribute('data-id');
      const item = cart.find(i => i.id === id);
      if (item) {
        const liveItems = storage.getItems();
        const liveItem = liveItems.find(it => it.id === id);
        const maxStock = liveItem && typeof liveItem.stock === 'number' ? liveItem.stock : 99;
        if (item.quantity >= maxStock) {
          showToast(`Stok hanya tersedia ${maxStock} unit!`, 'warning');
          return;
        }
        storage.updateCartQuantity(id, item.quantity + 1);
        renderCartContent();
      }
    });
  });

  body.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playRemove();
      const id = btn.getAttribute('data-id');
      storage.updateCartQuantity(id, 0);
      showToast('Item removed from bag', 'warning');
      renderCartContent();
    });
  });

  // Payment Option Buttons
  const optGold = body.querySelector('#opt-pay-gold');
  const optBarter = body.querySelector('#opt-pay-barter');
  const barterBox = body.querySelector('#barter-details-box');

  optGold.addEventListener('click', () => {
    sound.playClick();
    activePaymentMethod = 'gold';
    optGold.classList.add('selected');
    optBarter.classList.remove('selected');
    barterBox.style.display = 'none';
    const totalLabel = body.querySelector('.cart-total-label');
    if (totalLabel) totalLabel.textContent = 'Total Gold Required';
  });

  optBarter.addEventListener('click', () => {
    sound.playClick();
    activePaymentMethod = 'barter';
    optBarter.classList.add('selected');
    optGold.classList.remove('selected');
    barterBox.style.display = 'block';
    const totalLabel = body.querySelector('.cart-total-label');
    if (totalLabel) totalLabel.textContent = 'Estimated Trade Value';
  });

  // Submit Order Action
  const submitBtn = body.querySelector('#btn-submit-order');
  submitBtn.addEventListener('click', () => {
    const ign = body.querySelector('#input-buyer-ign').value.trim();
    const notes = body.querySelector('#input-buyer-notes').value.trim();
    const barterOffer = body.querySelector('#input-barter-offer') ? body.querySelector('#input-barter-offer').value.trim() : '';

    if (!ign) {
      sound.playRemove();
      showToast('In-Game Character Name (IGN) is required!', 'warning');
      body.querySelector('#input-buyer-ign').focus();
      return;
    }

    if (activePaymentMethod === 'barter' && !barterOffer) {
      sound.playRemove();
      showToast('Please state items offered for barter exchange!', 'warning');
      body.querySelector('#input-barter-offer').focus();
      return;
    }

    const orderId = `PL-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleString('en-US');
    const orderStatus = activePaymentMethod === 'gold' ? 'Pending Boss Review' : 'Pending Review (Barter)';

    // Save order in history
    const orderRecord = {
      id: orderId,
      customerId,
      date: dateStr,
      ign,
      notes,
      items: [...cart],
      totalGold,
      paymentMethod: activePaymentMethod,
      barterOffer: activePaymentMethod === 'barter' ? barterOffer : null,
      status: orderStatus
    };
    storage.saveOrder(orderRecord);

    // Initial System Message in English
    let initialText = `📦 Order #${orderId} created by ${customerId}!\n`;
    initialText += `👤 In-Game Character (IGN): ${ign}\n`;
    initialText += `Items:\n`;
    cart.forEach(it => {
      initialText += `  • ${it.quantity}x ${it.name} (${(it.price || 0).toLocaleString('en-US')} Gold)\n`;
    });
    if (activePaymentMethod === 'gold') {
      initialText += `💰 Total Payment: ${totalGold.toLocaleString('en-US')} Gold\n`;
    } else {
      initialText += `🔄 Barter Offer: "${barterOffer}"\n`;
    }
    if (notes) initialText += `📝 Notes: ${notes}\n`;
    initialText += `📌 Status: ${orderStatus}\n`;
    initialText += `\nBoss has been alerted. Please wait a moment while Boss prepares for in-game trade!`;

    storage.sendChatMessage(orderId, 'SYSTEM', initialText, true);

    // Sound & Confetti celebration
    sound.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff7a18', '#9d4edd', '#ffd166', '#ffffff']
    });

    // Clear cart & close cart drawer
    storage.clearCart();
    closeCart();
    showToast('Order placed successfully! Opening live chat...', 'success');

    // Open Live Order Chat on screen immediately (100% on-site)
    setTimeout(() => {
      openChat(orderId, false);
    }, 350);
  });
}
