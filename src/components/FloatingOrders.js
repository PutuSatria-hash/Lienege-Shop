// Floating My Orders Widget Component (Bottom-Right Floating Action Button)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';

export function initFloatingOrders(onOpenOrders) {
  const existing = document.getElementById('floating-orders-container');
  if (existing) existing.remove();

  const container = document.createElement('aside');
  container.id = 'floating-orders-container';
  container.className = 'floating-orders-container';

  const updateBadge = () => {
    const orders = storage.getCustomerOrders();
    const badge = container.querySelector('#floating-orders-count');
    if (badge) {
      badge.textContent = orders.length;
      badge.classList.toggle('has-orders', orders.length > 0);
    }
  };

  const myOrders = storage.getCustomerOrders();

  container.innerHTML = `
    <button id="floating-my-orders-btn" class="floating-my-orders-btn font-silkscreen" title="View My Orders & Active Tickets (Press H)">
      <span class="floating-orders-icon">📜</span>
      <span class="floating-orders-label">MY ORDERS</span>
      <span class="floating-orders-badge font-pixel ${myOrders.length > 0 ? 'has-orders' : ''}" id="floating-orders-count">${myOrders.length}</span>
    </button>
  `;

  document.body.appendChild(container);

  const btn = container.querySelector('#floating-my-orders-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      sound.playClick();
      if (onOpenOrders) onOpenOrders();
    });
  }

  // Reactive listener for orders placed or updated
  window.addEventListener('pl_orders_updated', updateBadge);

  return {
    updateBadge
  };
}
