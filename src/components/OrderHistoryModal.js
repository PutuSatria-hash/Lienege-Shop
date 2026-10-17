// Order History & Status Modal Component (100% English & Mobile-First)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { openChat } from './LiveChatModal.js';

export function initOrderHistoryModal() {
  const existing = document.getElementById('orders-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'orders-modal';

  modal.innerHTML = `
    <div class="modal-content mobile-sheet" style="max-width: 660px;">
      <div class="modal-header">
        <h3 class="modal-title font-pixel">📜 MY ORDERS & CHAT TICKETS</h3>
        <button class="modal-close-btn" id="orders-close-btn">&times;</button>
      </div>

      <div class="modal-body" id="orders-modal-body">
        <!-- Content will be rendered dynamically -->
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#orders-close-btn');
  closeBtn.addEventListener('click', () => closeOrders());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeOrders();
  });

  return {
    open: openOrders,
    close: closeOrders
  };
}

export function openOrders() {
  const modal = document.getElementById('orders-modal');
  if (!modal) return;
  renderOrdersContent();
  modal.classList.add('open');
}

export function closeOrders() {
  const modal = document.getElementById('orders-modal');
  if (modal) modal.classList.remove('open');
}

function renderOrdersContent() {
  const body = document.getElementById('orders-modal-body');
  if (!body) return;

  const myCustomerId = storage.getCustomerId();
  const allOrders = storage.getOrders();
  // Unique filter: only show orders belonging to current customer!
  const orders = allOrders.filter(o => (o.customerId || '').trim() === myCustomerId.trim());
  const settings = storage.getSettings();

  if (orders.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 40px 10px;">
        <p class="font-silkscreen" style="font-size: 13px; color: var(--accent-orange); margin-bottom: 8px;">
          📭 No Orders for ${myCustomerId}
        </p>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px;">
          You have not placed any orders yet. When you buy items from the catalog, your private orders will appear here.
        </p>
        <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" class="pixel-btn secondary" style="font-size: 9px;">
          🎮 VISIT BOSS ROBLOX PROFILE ↗
        </a>
      </div>
    `;
    return;
  }

  body.innerHTML = `
    <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 8px 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
      <span class="font-silkscreen" style="font-size: 10px; color: var(--text-muted);">Logged-in Customer:</span>
      <span class="font-silkscreen" style="font-size: 10px; color: var(--accent-gold); font-weight: 700;">${myCustomerId}</span>
    </div>

    <div style="display: flex; flex-direction: column; gap: 14px; max-height: 480px; overflow-y: auto; padding-right: 4px;">
      ${orders.map(o => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <div>
              <span class="font-pixel" style="font-size: 10px; color: var(--accent-orange);">${o.id}</span>
              <div style="font-size: 11px; color: var(--accent-gold); margin-top: 2px;">
                ${o.customerId || myCustomerId} • <span style="color: var(--text-muted);">${o.date}</span>
              </div>
            </div>
            <div>
              <span class="rarity-badge font-silkscreen" style="font-size: 9px; background: rgba(157, 78, 221, 0.25); color: #e2d9f3; border: 1px solid rgba(255,255,255,0.15);">
                ${o.status || 'Pending Review'}
              </span>
            </div>
          </div>

          <div style="font-size: 12px; margin-bottom: 8px;">
            <strong>Character IGN:</strong> <span style="color: #ffd166;">${o.ign}</span>
          </div>

          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px; background: rgba(0,0,0,0.25); padding: 8px;">
            <strong>Items:</strong>
            <ul style="padding-left: 18px; margin-top: 4px;">
              ${o.items.map(it => `<li>${it.quantity}x ${it.name} (${(it.price || 0).toLocaleString('en-US')} Gold)</li>`).join('')}
            </ul>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 8px; flex-wrap: wrap; gap: 8px;">
            <div>
              ${o.paymentMethod === 'gold' 
                ? `<span style="color: #ffd166; font-family: 'Silkscreen';">🪙 ${(o.totalGold || 0).toLocaleString('en-US')} Gold</span>`
                : `<span style="color: #5eead4; font-family: 'Silkscreen';">🔄 Barter: "${o.barterOffer}"</span>`}
            </div>

            <div style="display: flex; gap: 6px;">
              <button class="pixel-btn secondary btn-review-order" data-item="${o.items[0] ? o.items[0].name : 'Wiseman Item'}" style="padding: 7px 12px; font-size: 8px;" title="Leave a review for this purchase">
                ⭐ REVIEW
              </button>
              <button class="pixel-btn btn-open-order-chat" data-id="${o.id}" style="padding: 7px 12px; font-size: 8px;">
                💬 OPEN CHAT
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  body.querySelectorAll('.btn-open-order-chat').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const id = btn.getAttribute('data-id');
      closeOrders();
      openChat(id, false);
    });
  });

  body.querySelectorAll('.btn-review-order').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const itemName = btn.getAttribute('data-item');
      closeOrders();
      window.dispatchEvent(new CustomEvent('pl_open_reviews', { detail: { itemName } }));
    });
  });
}
