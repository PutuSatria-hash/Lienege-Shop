// Dedicated Admin Dashboard (Wiseman Shop - 100% English)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';
import { openChat } from './LiveChatModal.js';

export function initAdminModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'admin-modal';

  modal.innerHTML = `
    <div class="modal-content mobile-sheet" style="max-width: 760px;">
      <div class="modal-header">
        <h3 class="modal-title font-pixel">👑 ADMIN CONTROL DASHBOARD</h3>
        <button class="modal-close-btn" id="admin-close-btn">&times;</button>
      </div>

      <div class="modal-body" id="admin-modal-body">
        <!-- PIN Gate or Admin Dashboard Tabs -->
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#admin-close-btn');
  closeBtn.addEventListener('click', () => closeAdmin());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAdmin();
  });

  // Live Reactive updates for Boss when Admin Panel is open
  window.addEventListener('pl_orders_updated', () => {
    if (modal.classList.contains('open') && isAuthenticated && activeAdminTab === 'inbox-orders') {
      sound.playFanfare();
      renderAdminContent();
    }
  });

  window.addEventListener('pl_chat_updated', (e) => {
    if (e.detail && e.detail.message && e.detail.message.sender !== 'Boss' && !e.detail.message.isSystem) {
      if (modal.classList.contains('open') && isAuthenticated && activeAdminTab === 'inbox-orders') {
        sound.playCoin();
        renderAdminContent();
      }
    }
  });

  window.addEventListener('pl_open_admin', () => {
    openAdmin();
  });

  return {
    open: openAdmin,
    close: closeAdmin
  };
}

let isAuthenticated = false;
let activeAdminTab = 'inbox-orders'; // 'inbox-orders' | 'add-item' | 'add-category' | 'manage-items' | 'settings'

export function openAdmin() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;
  renderAdminContent();
  modal.classList.add('open');
}

export function closeAdmin() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('open');
  if (window.location.hash === '#admin') {
    history.replaceState(null, null, ' ');
  }
}

function renderAdminContent() {
  const body = document.getElementById('admin-modal-body');
  if (!body) return;

  const settings = storage.getSettings();

  let currentAdmin = storage.getCurrentAdmin();
  if (currentAdmin) {
    isAuthenticated = true;
  }

  // 1. Multi-Admin Account Login Gate if not authenticated
  if (!isAuthenticated) {
    body.innerHTML = `
      <div style="text-align: center; padding: 28px 12px; max-width: 360px; margin: 0 auto;">
        <div style="font-size: 38px; margin-bottom: 12px;">🛡️</div>
        <h4 class="font-pixel" style="font-size: 12px; color: var(--accent-orange); margin-bottom: 8px;">
          ADMIN SYSTEM ACCESS
        </h4>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5;">
          Login with your registered administrator credentials to access the shop controls.
        </p>

        <form id="form-admin-login" style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
          <div>
            <label class="form-label font-silkscreen">Admin Username</label>
            <input 
              type="text" 
              id="admin-user-input" 
              class="pixel-input" 
              placeholder="e.g. admin or boss" 
              required
              autocomplete="username"
            />
          </div>

          <div>
            <label class="form-label font-silkscreen">Password</label>
            <input 
              type="password" 
              id="admin-pass-input" 
              class="pixel-input" 
              placeholder="Enter password" 
              required
              autocomplete="current-password"
            />
          </div>

          <div style="font-size: 9px; color: var(--text-dim); background: rgba(0,0,0,0.3); padding: 8px; border: 1px dashed rgba(255,255,255,0.1);" class="font-silkscreen">
            Default Master: <span style="color: var(--accent-gold);">admin / wiseman2026</span> or <span style="color: var(--accent-gold);">boss / lineage2026</span>
          </div>

          <button type="submit" class="pixel-btn gold" id="btn-submit-login" style="padding: 12px 18px; margin-top: 6px;">
            👑 UNLOCK DASHBOARD
          </button>
        </form>
      </div>
    `;

    const form = body.querySelector('#form-admin-login');
    const userInput = body.querySelector('#admin-user-input');
    const passInput = body.querySelector('#admin-pass-input');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = userInput.value.trim();
      const p = passInput.value.trim();

      const admin = storage.authenticateAdmin(u, p);
      if (admin) {
        sound.playFanfare();
        isAuthenticated = true;
        showToast(`Welcome back, ${admin.name}!`, 'success');
        renderAdminContent();
      } else {
        sound.playRemove();
        showToast('Invalid Username or Password!', 'warning');
        passInput.value = '';
        passInput.focus();
      }
    });

    setTimeout(() => userInput.focus(), 150);
    return;
  }

  // 2. Authenticated Admin Dashboard Tabs
  const categories = storage.getCategories();
  const items = storage.getItems();
  const orders = storage.getOrders();
  const adminAccounts = storage.getAdminAccounts();

  body.innerHTML = `
    <!-- Top Admin Status & Logout Bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255, 122, 24, 0.12); border: 1px solid rgba(255, 122, 24, 0.3); padding: 8px 14px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 14px;">👑</span>
        <span class="font-silkscreen" style="font-size: 10px; color: var(--accent-gold);">
          LOGGED IN: <strong>${currentAdmin ? currentAdmin.name : 'Master Admin'}</strong> (${currentAdmin ? currentAdmin.role : 'Admin'})
        </span>
      </div>
      <button class="pixel-btn-tiny secondary font-silkscreen" id="btn-admin-logout" style="padding: 4px 10px; font-size: 8px;" title="Sign out of Admin Session">
        LOGOUT ✕
      </button>
    </div>

    <!-- Admin Navigation Tabs -->
    <div style="display: flex; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 20px; flex-wrap: wrap;">
      <button class="pixel-btn ${activeAdminTab === 'inbox-orders' ? '' : 'secondary'}" id="tab-btn-inbox" style="font-size: 8px; padding: 8px 10px;">
        💬 ORDERS & CHAT (${orders.length})
      </button>
      <button class="pixel-btn ${activeAdminTab === 'add-item' ? '' : 'secondary'}" id="tab-btn-add-item" style="font-size: 8px; padding: 8px 10px;">
        + ADD ITEM
      </button>
      <button class="pixel-btn ${activeAdminTab === 'add-category' ? '' : 'secondary'}" id="tab-btn-add-cat" style="font-size: 8px; padding: 8px 10px;">
        + CATEGORIES
      </button>
      <button class="pixel-btn ${activeAdminTab === 'manage-items' ? '' : 'secondary'}" id="tab-btn-manage" style="font-size: 8px; padding: 8px 10px;">
        MANAGE ITEMS (${items.length})
      </button>
      <button class="pixel-btn ${activeAdminTab === 'admin-accounts' ? '' : 'secondary'}" id="tab-btn-admins" style="font-size: 8px; padding: 8px 10px;">
        👥 ADMINS (${adminAccounts.length})
      </button>
      <button class="pixel-btn ${activeAdminTab === 'settings' ? '' : 'secondary'}" id="tab-btn-settings" style="font-size: 8px; padding: 8px 10px;">
        ⚙️ SETTINGS
      </button>
    </div>

    <!-- Tab Content Body -->
    <div id="admin-tab-content"></div>
  `;

  // Attach logout handler
  const btnLogout = body.querySelector('#btn-admin-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sound.playClick();
      storage.logoutAdmin();
      isAuthenticated = false;
      showToast('Logged out of Admin Portal', 'info');
      renderAdminContent();
    });
  }

  // Attach tab triggers
  body.querySelector('#tab-btn-inbox').addEventListener('click', () => {
    sound.playClick();
    activeAdminTab = 'inbox-orders';
    renderAdminContent();
  });
  body.querySelector('#tab-btn-add-item').addEventListener('click', () => {
    sound.playClick();
    activeAdminTab = 'add-item';
    renderAdminContent();
  });
  body.querySelector('#tab-btn-add-cat').addEventListener('click', () => {
    sound.playClick();
    activeAdminTab = 'add-category';
    renderAdminContent();
  });
  body.querySelector('#tab-btn-manage').addEventListener('click', () => {
    sound.playClick();
    activeAdminTab = 'manage-items';
    renderAdminContent();
  });
  body.querySelector('#tab-btn-admins').addEventListener('click', () => {
    sound.playClick();
    activeAdminTab = 'admin-accounts';
    renderAdminContent();
  });
  body.querySelector('#tab-btn-settings').addEventListener('click', () => {
    sound.playClick();
    activeAdminTab = 'settings';
    renderAdminContent();
  });

  const tabContent = body.querySelector('#admin-tab-content');

  // --- TAB 1: INBOX ORDERS & LIVE CHAT ---
  if (activeAdminTab === 'inbox-orders') {
    const allChats = storage.getAllChats();
    const chatTicketIds = Object.keys(allChats);
    const inquiryTicketIds = chatTicketIds.filter(id => id.startsWith('INQUIRY-'));

    const lookupHeaderHtml = `
      <div style="background: rgba(255, 209, 102, 0.08); border: 1px solid rgba(255, 209, 102, 0.25); padding: 12px 14px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
          <div class="font-pixel" style="font-size: 9px; color: var(--accent-gold);">
            📥 DISCORD TICKET & CUSTOMER LIVE CHAT LOOKUP
          </div>
          <button class="pixel-btn-tiny secondary font-silkscreen" id="btn-admin-refresh-orders" style="padding: 4px 8px; font-size: 8px;">
            🔄 REFRESH
          </button>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <input 
            type="text" 
            id="admin-ticket-lookup-input" 
            class="pixel-input" 
            placeholder="Paste Ticket ID e.g. INQUIRY-945798334 or ORD-..." 
            style="flex: 1; min-width: 220px; font-size: 11px;" 
          />
          <button class="pixel-btn gold" id="btn-open-ticket-lookup" style="font-size: 8px; padding: 8px 14px;">
            OPEN CHAT 💬
          </button>
        </div>
        <div class="font-silkscreen" style="font-size: 9px; color: var(--text-dim); margin-top: 6px;">
          Tip: Got a notification on Discord? Paste the Ticket / Order ID here to view details and chat with the customer.
        </div>
      </div>
    `;

    if (orders.length === 0 && inquiryTicketIds.length === 0) {
      tabContent.innerHTML = `
        ${lookupHeaderHtml}
        <div style="text-align: center; padding: 32px 10px; color: var(--text-muted); background: rgba(0,0,0,0.2); border: 1px dashed rgba(255,255,255,0.08);">
          <p class="font-silkscreen" style="font-size: 12px; color: var(--accent-orange); margin-bottom: 6px;">
            No customer orders or inquiries yet.
          </p>
          <p style="font-size: 11px; max-width: 440px; margin: 0 auto;">
            When customers place orders or message you, they will appear here. You can also paste ticket IDs from Discord above to chat immediately.
          </p>
        </div>
      `;
    } else {
      let html = lookupHeaderHtml + `<div style="display: flex; flex-direction: column; gap: 10px; max-height: 420px; overflow-y: auto; padding-right: 4px;">`;

      // 1. General Inquiries
      inquiryTicketIds.forEach(tId => {
        const msgs = allChats[tId] || [];
        const lastMsg = msgs[msgs.length - 1];
        const custId = tId.replace('INQUIRY-', 'Customer#');

        html += `
          <div style="background: rgba(43, 122, 53, 0.12); border: 1px solid rgba(43, 122, 53, 0.35); padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div>
                <span class="font-pixel" style="font-size: 9px; color: #2ec4b6;">💬 GENERAL INQUIRY</span>
                <span class="font-silkscreen" style="font-size: 10px; color: var(--accent-gold); margin-left: 8px;">
                  ${custId}
                </span>
              </div>
              <span class="rarity-badge font-silkscreen" style="font-size: 8px; background: rgba(46, 196, 182, 0.2); color: #2ec4b6;">
                ${msgs.length} MSG(S)
              </span>
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">
              <strong>Latest:</strong> <em>"${lastMsg ? lastMsg.text : 'New Inquiry'}"</em>
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button class="pixel-btn btn-boss-open-chat" data-id="${tId}" style="padding: 7px 14px; font-size: 8px;">
                💬 REPLY TO INQUIRY
              </button>
            </div>
          </div>
        `;
      });

      // 2. Orders
      orders.forEach(o => {
        html += `
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
              <div>
                <span class="font-pixel" style="font-size: 9px; color: var(--accent-orange);">${o.id}</span>
                <span class="font-silkscreen" style="font-size: 10px; color: var(--accent-gold); margin-left: 8px;">
                  ${o.customerId || 'Customer'}
                </span>
                <span style="font-size: 11px; color: var(--text-muted); margin-left: 6px;">(IGN: ${o.ign})</span>
              </div>
              <div>
                <select class="pixel-input admin-status-select" data-id="${o.id}" style="padding: 4px 8px; font-size: 9px; height: auto;">
                  <option value="Pending Boss Review" ${o.status === 'Pending Boss Review' ? 'selected' : ''}>Pending Review</option>
                  <option value="Accepted / In Progress" ${o.status === 'Accepted / In Progress' ? 'selected' : ''}>Accepted</option>
                  <option value="Ready to Trade In-Game" ${o.status === 'Ready to Trade In-Game' ? 'selected' : ''}>Ready to Trade</option>
                  <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
                  <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
            </div>

            <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px;">
              <strong>Items:</strong> ${o.items.map(it => `${it.quantity}x ${it.name}`).join(', ')} • 
              <strong>Payment:</strong> ${o.paymentMethod === 'gold' ? `${(o.totalGold || 0).toLocaleString('en-US')} Gold` : `Barter: "${o.barterOffer}"`}
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 8px;">
              <button class="pixel-btn btn-boss-open-chat" data-id="${o.id}" style="padding: 7px 14px; font-size: 8px;">
                💬 CHAT WITH CUSTOMER
              </button>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      tabContent.innerHTML = html;

      tabContent.querySelectorAll('.admin-status-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
          sound.playClick();
          const id = sel.getAttribute('data-id');
          storage.updateOrderStatus(id, e.target.value);
          storage.sendChatMessage(id, 'SYSTEM', `[STATUS UPDATE]: Order status updated to "${e.target.value}" by Boss.`, true);
          showToast(`Order status updated to "${e.target.value}"!`, 'success');
        });
      });

      tabContent.querySelectorAll('.btn-boss-open-chat').forEach(btn => {
        btn.addEventListener('click', () => {
          sound.playClick();
          const id = btn.getAttribute('data-id');
          closeAdmin();
          openChat(id, true);
        });
      });
    }

    // Attach Discord Ticket Lookup handler
    const btnLookup = tabContent.querySelector('#btn-open-ticket-lookup');
    const inputLookup = tabContent.querySelector('#admin-ticket-lookup-input');
    const handleTicketOpen = () => {
      const raw = inputLookup ? inputLookup.value.trim() : '';
      if (!raw) {
        showToast('Please paste a Ticket or Order ID first!', 'warning');
        return;
      }
      const cleanId = raw.replace(/^#/, '').trim();
      sound.playClick();
      closeAdmin();
      openChat(cleanId, true);
    };

    if (btnLookup) {
      btnLookup.addEventListener('click', handleTicketOpen);
    }
    if (inputLookup) {
      inputLookup.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleTicketOpen();
      });
    }

    const btnRefresh = tabContent.querySelector('#btn-admin-refresh-orders');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        sound.playClick();
        showToast('Refreshing inbox...', 'info');
        renderAdminContent();
      });
    }
  }

  // --- TAB 2: ADD ITEM ---
  else if (activeAdminTab === 'add-item') {
    tabContent.innerHTML = `
      <form id="form-add-item">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label font-silkscreen">Item Name *</label>
            <input type="text" id="new-item-name" class="pixel-input" placeholder="E.g.: Cursed Obsidian Blade" required />
          </div>

          <div class="form-group">
            <label class="form-label font-silkscreen">Category *</label>
            <select id="new-item-category" class="pixel-input" style="cursor: pointer;">
              ${categories.map(c => `<option value="${c.id}">${c.icon || ''} ${c.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label font-silkscreen">Price (Gold) *</label>
            <input type="number" id="new-item-price" class="pixel-input" placeholder="E.g.: 45000" min="0" required />
          </div>

          <div class="form-group">
            <label class="form-label font-silkscreen">Rarity *</label>
            <select id="new-item-rarity" class="pixel-input" style="cursor: pointer;">
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic" selected>Epic</option>
              <option value="legendary">Legendary</option>
              <option value="mythic">Mythic</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label font-silkscreen">Item Image (Upload File or URL)</label>
          <div style="display: flex; gap: 8px; margin-bottom: 6px;">
            <input type="file" id="new-item-file" accept="image/*" class="pixel-input" style="padding: 7px; flex: 1;" />
          </div>
          <input type="url" id="new-item-image-url" class="pixel-input" placeholder="Or paste image URL (https://...)" />
        </div>

        <div class="form-group">
          <label class="form-label font-silkscreen">Description & Lore</label>
          <textarea id="new-item-desc" class="pixel-input form-textarea" placeholder="Item statistics, elemental powers, or lore..."></textarea>
        </div>

        <button type="submit" class="pixel-btn" style="width: 100%;">+ SAVE ITEM TO CATALOG</button>
      </form>
    `;

    let uploadedBase64 = null;
    const fileInput = tabContent.querySelector('#new-item-file');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          uploadedBase64 = loadEvt.target.result;
          showToast('Image ready to upload!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });

    const form = tabContent.querySelector('#form-add-item');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#new-item-name').value.trim();
      const category = form.querySelector('#new-item-category').value;
      const price = parseInt(form.querySelector('#new-item-price').value, 10) || 0;
      const rarity = form.querySelector('#new-item-rarity').value;
      const urlInput = form.querySelector('#new-item-image-url').value.trim();
      const desc = form.querySelector('#new-item-desc').value.trim();

      const defaultSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="8" y="8" width="16" height="16" fill="%23ff7a18"/><rect x="12" y="12" width="8" height="8" fill="%23ffd54f"/></svg>';
      const finalImage = uploadedBase64 || urlInput || defaultSvg;

      storage.addItem({
        name,
        category,
        price,
        rarity,
        status: 'In Stock',
        description: desc,
        image: finalImage
      });

      sound.playFanfare();
      showToast(`Item "${name}" added to catalog!`, 'success');
      activeAdminTab = 'manage-items';
      renderAdminContent();
    });
  }

  // --- TAB 3: CATEGORIES ---
  else if (activeAdminTab === 'add-category') {
    tabContent.innerHTML = `
      <form id="form-add-cat">
        <div class="form-group">
          <label class="form-label font-silkscreen">New Category Name *</label>
          <input type="text" id="new-cat-name" class="pixel-input" placeholder="E.g.: Armor, Potion, Pet, Accessory..." required />
        </div>

        <div class="form-group">
          <label class="form-label font-silkscreen">Category Symbol / Icon</label>
          <input type="text" id="new-cat-icon" class="pixel-input" placeholder="E.g.: 🛡️, 🧪, 🐾, 💍..." maxlength="4" />
        </div>

        <button type="submit" class="pixel-btn" style="width: 100%;">+ CREATE CATEGORY</button>
      </form>

      <div style="margin-top: 24px;">
        <h5 class="font-silkscreen" style="font-size: 11px; color: var(--accent-orange); margin-bottom: 10px;">
          EXISTING CATEGORIES:
        </h5>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${categories.map(c => `
            <span style="background: rgba(255,255,255,0.06); padding: 6px 10px; border: 1px solid rgba(255,255,255,0.1); font-size: 12px;">
              ${c.icon || '🏷️'} ${c.name}
            </span>
          `).join('')}
        </div>
      </div>
    `;

    const form = tabContent.querySelector('#form-add-cat');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#new-cat-name').value.trim();
      const icon = form.querySelector('#new-cat-icon').value.trim() || '🏷️';

      try {
        storage.addCategory({ name, icon });
        sound.playFanfare();
        showToast(`Category "${name}" created!`, 'success');
        renderAdminContent();
      } catch (err) {
        sound.playRemove();
        showToast(err.message, 'warning');
      }
    });
  }

  // --- TAB 4: MANAGE ITEMS ---
  else if (activeAdminTab === 'manage-items') {
    tabContent.innerHTML = `
      <div style="max-height: 400px; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 8px;">
        ${items.map(i => `
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 8px 12px; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${i.image}" style="width: 28px; height: 28px; image-rendering: pixelated;" />
              <div>
                <div style="font-size: 13px; font-weight: 600;">${i.name}</div>
                <div class="font-silkscreen" style="font-size: 10px; color: var(--accent-gold);">
                  ${i.category} • ${(i.price || 0).toLocaleString('en-US')} G • ${i.rarity}
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 6px;">
              <button class="pixel-btn danger btn-delete-item" data-id="${i.id}" style="padding: 6px 10px; font-size: 8px;">
                DELETE
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    tabContent.querySelectorAll('.btn-delete-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = items.find(it => it.id === id);
        if (confirm(`Are you sure you want to delete "${item ? item.name : id}"?`)) {
          sound.playRemove();
          storage.deleteItem(id);
          showToast('Item deleted!', 'warning');
          renderAdminContent();
        }
      });
    });
  }

  // --- TAB 5: SETTINGS & BACKUPS ---
  else if (activeAdminTab === 'settings') {
    tabContent.innerHTML = `
      <div class="form-group">
        <label class="form-label font-silkscreen">Boss In-Game Roblox Status (Live Badge on Header) *</label>
        <select id="settings-roblox-status" class="pixel-input" style="font-family: 'Silkscreen', monospace;">
          <option value="online" ${(settings.robloxStatus || 'online') === 'online' ? 'selected' : ''}>🟢 BOSS ONLINE (Ready to Trade In-Game)</option>
          <option value="trading" ${(settings.robloxStatus || 'online') === 'trading' ? 'selected' : ''}>🟡 BOSS TRADING (Busy Fulfilling Orders)</option>
          <option value="offline" ${(settings.robloxStatus || 'online') === 'offline' ? 'selected' : ''}>⚪ BOSS OFFLINE (Orders Monitored via Discord)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label font-silkscreen">Boss Roblox Profile URL *</label>
        <input type="url" id="settings-roblox-url" class="pixel-input" value="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" />
      </div>

      <div class="form-group">
        <label class="form-label font-silkscreen">Boss WhatsApp Number for Notification Alerts *</label>
        <input type="text" id="settings-wa-number" class="pixel-input" value="${settings.bossWhatsapp || '085857537354'}" />
      </div>

      <div class="form-group">
        <label class="form-label font-silkscreen">Boss Discord Webhook URL (For Silent Notification Pings on Phone)</label>
        <div style="display: flex; gap: 8px;">
          <input type="url" id="settings-discord-webhook" class="pixel-input" value="${settings.discordWebhookUrl || ''}" placeholder="https://discord.com/api/webhooks/..." style="flex: 1;" />
          <button type="button" id="btn-test-webhook" class="pixel-btn secondary" style="font-size: 8px; padding: 6px 12px; white-space: nowrap;">TEST PING</button>
        </div>
        <span style="font-size: 10px; color: var(--text-muted); display: block; margin-top: 4px;">
          Paste a free Discord Webhook URL here to get instant notifications on your phone whenever an order or chat message arrives!
        </span>
      </div>

      <div class="form-group">
        <label class="form-label font-silkscreen">Admin Security PIN</label>
        <input type="password" id="settings-pin" class="pixel-input" value="${settings.adminPin || '2026'}" maxlength="8" />
      </div>

      <button id="btn-save-settings" class="pixel-btn" style="width: 100%; margin-bottom: 24px;">
        SAVE CONFIGURATION
      </button>

      <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px;">
        <label class="form-label font-silkscreen" style="color: var(--accent-orange);">
          💾 Laptop Local Storage & Backups
        </label>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 14px;">
          Export your complete database to JSON for local backup or transfer across devices.
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button id="btn-export-json" class="pixel-btn gold" style="flex: 1;">
            📥 EXPORT JSON
          </button>
          
          <label class="pixel-btn secondary" style="flex: 1; cursor: pointer; text-align: center;">
            📤 IMPORT JSON
            <input type="file" id="input-import-json" accept=".json" style="display: none;" />
          </label>
        </div>

        <button id="btn-reset-default" class="pixel-btn danger" style="width: 100%; margin-top: 16px; font-size: 8px;">
          ⚠️ RESET CATALOG TO DEFAULT
        </button>
      </div>
    `;

    // Test Discord Webhook Button
    const btnTest = tabContent.querySelector('#btn-test-webhook');
    btnTest.addEventListener('click', async () => {
      const webhookUrl = tabContent.querySelector('#settings-discord-webhook').value.trim();
      if (!webhookUrl) {
        sound.playRemove();
        showToast('Please enter a Discord Webhook URL first!', 'warning');
        return;
      }
      showToast('Sending test ping to Discord...', 'info');
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Wiseman Shop Bot',
            avatar_url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f9d9.png',
            embeds: [{
              title: '🔮 Wiseman Shop Test Alert',
              description: '✅ Connection test successful! Boss will now receive live alerts here for every customer order and chat message.',
              color: 0xff7a18,
              timestamp: new Date().toISOString()
            }]
          })
        });
        if (res.ok) {
          sound.playFanfare();
          showToast('Ping received on Discord!', 'success');
        } else {
          sound.playRemove();
          showToast(`Discord returned error code: ${res.status}`, 'warning');
        }
      } catch (err) {
        sound.playRemove();
        showToast('Connection failed: ' + err.message, 'warning');
      }
    });

    const btnSave = tabContent.querySelector('#btn-save-settings');
    btnSave.addEventListener('click', () => {
      const robloxStatus = tabContent.querySelector('#settings-roblox-status').value;
      const robloxUrl = tabContent.querySelector('#settings-roblox-url').value.trim();
      const waNumber = tabContent.querySelector('#settings-wa-number').value.trim();
      const discordWebhook = tabContent.querySelector('#settings-discord-webhook').value.trim();
      const pin = tabContent.querySelector('#settings-pin').value.trim();
      storage.saveSettings({
        ...settings,
        robloxStatus: robloxStatus || 'online',
        robloxProfileUrl: robloxUrl || 'https://www.roblox.com/users/4035030385/profile',
        bossWhatsapp: waNumber || '085857537354',
        discordWebhookUrl: discordWebhook || '',
        adminPin: pin || '2026'
      });
      sound.playFanfare();
      showToast('Settings & Webhook saved successfully!', 'success');
    });

    const btnExport = tabContent.querySelector('#btn-export-json');
    btnExport.addEventListener('click', () => {
      sound.playCoin();
      storage.exportBackup();
      showToast('Backup JSON downloaded to laptop!', 'success');
    });

    const fileImport = tabContent.querySelector('#input-import-json');
    fileImport.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          try {
            storage.importBackup(loadEvt.target.result);
            sound.playFanfare();
            showToast('Catalog restored from backup JSON!', 'success');
            renderAdminContent();
          } catch (err) {
            sound.playRemove();
            showToast(err.message, 'warning');
          }
        };
        reader.readAsText(file);
      }
    });

    const btnReset = tabContent.querySelector('#btn-reset-default');
    btnReset.addEventListener('click', () => {
      if (confirm('Reset catalog and categories to default settings?')) {
        storage.resetToDefault();
        sound.playFanfare();
        showToast('Reset to default complete!', 'success');
        renderAdminContent();
      }
    });
  }

  // --- TAB 5: MULTI-ADMIN ACCOUNTS MANAGEMENT ---
  else if (activeAdminTab === 'admin-accounts') {
    const admins = storage.getAdminAccounts();

    tabContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Register New Admin Form -->
        <div style="background: rgba(255, 209, 102, 0.06); border: 1px solid rgba(255, 209, 102, 0.25); padding: 16px;">
          <h4 class="font-pixel" style="font-size: 11px; color: var(--accent-gold); margin-bottom: 12px;">
            + CREATE NEW ADMIN ACCOUNT
          </h4>
          <form id="form-create-admin" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label font-silkscreen">Username *</label>
                <input type="text" id="new-admin-user" class="pixel-input" placeholder="e.g. staff_alfin" required autocomplete="off" />
              </div>
              <div>
                <label class="form-label font-silkscreen">Password *</label>
                <input type="password" id="new-admin-pass" class="pixel-input" placeholder="Min 6 characters" required autocomplete="new-password" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label font-silkscreen">Display Name *</label>
                <input type="text" id="new-admin-name" class="pixel-input" placeholder="e.g. Admin Alfin" required />
              </div>
              <div>
                <label class="form-label font-silkscreen">Admin Role *</label>
                <select id="new-admin-role" class="pixel-input" style="cursor: pointer;">
                  <option value="Staff Admin">Staff Admin (General)</option>
                  <option value="Trade Specialist">Trade Specialist (In-Game)</option>
                  <option value="Support Agent">Support Agent (Chat Only)</option>
                  <option value="Super Admin">Super Admin (Full Access)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
              <button type="submit" class="pixel-btn gold" style="font-size: 8px; padding: 10px 18px;">
                + SAVE ADMIN ACCOUNT
              </button>
            </div>
          </form>
        </div>

        <!-- Active Administrators List -->
        <div>
          <h4 class="font-pixel" style="font-size: 11px; color: var(--accent-orange); margin-bottom: 12px;">
            ACTIVE ADMINISTRATORS (${admins.length})
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${admins.map(adm => `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 14px;">🛡️</span>
                    <span class="font-silkscreen" style="font-size: 11px; color: var(--text-main); font-weight: 700;">
                      ${adm.name}
                    </span>
                    <span class="rarity-badge font-silkscreen" style="font-size: 7px; background: rgba(255, 122, 24, 0.2); color: #ff9e00;">
                      ${adm.role}
                    </span>
                  </div>
                  <div class="font-silkscreen" style="font-size: 9px; color: var(--text-muted); margin-top: 4px;">
                    Username: <span style="color: var(--accent-gold);">${adm.username}</span> • Added: ${adm.createdAt || 'Default'}
                  </div>
                </div>

                <div>
                  ${(adm.username === 'admin' || adm.username === 'boss') ? `
                    <span class="font-silkscreen" style="font-size: 8px; color: var(--text-dim); padding: 4px 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
                      MASTER
                    </span>
                  ` : `
                    <button class="pixel-btn-tiny danger btn-delete-admin" data-id="${adm.id}" style="font-size: 8px; padding: 4px 8px;">
                      DELETE
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const form = tabContent.querySelector('#form-create-admin');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = tabContent.querySelector('#new-admin-user').value.trim();
        const password = tabContent.querySelector('#new-admin-pass').value.trim();
        const name = tabContent.querySelector('#new-admin-name').value.trim();
        const role = tabContent.querySelector('#new-admin-role').value;

        try {
          storage.addAdminAccount({ username, password, name, role });
          sound.playFanfare();
          showToast(`Admin account "${username}" created!`, 'success');
          renderAdminContent();
        } catch (err) {
          sound.playRemove();
          showToast(err.message, 'warning');
        }
      });
    }

    tabContent.querySelectorAll('.btn-delete-admin').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this admin account?')) {
          try {
            storage.deleteAdminAccount(id);
            sound.playRemove();
            showToast('Admin account removed', 'info');
            renderAdminContent();
          } catch (err) {
            showToast(err.message, 'warning');
          }
        }
      });
    });
  }
}
