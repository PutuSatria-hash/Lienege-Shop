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

  // 1. PIN Gate if not authenticated
  if (!isAuthenticated) {
    body.innerHTML = `
      <div style="text-align: center; padding: 36px 12px;">
        <div style="font-size: 40px; margin-bottom: 14px;">🛡️</div>
        <h4 class="font-pixel" style="font-size: 13px; color: var(--accent-orange); margin-bottom: 8px;">
          BOSS ACCESS VERIFICATION
        </h4>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 24px;">
          Enter your security PIN to access the Admin Management Dashboard.
        </p>

        <div style="max-width: 240px; margin: 0 auto 20px;">
          <input 
            type="password" 
            id="admin-pin-input" 
            class="pixel-input" 
            placeholder="PIN (Default: 2026)" 
            maxlength="8" 
            style="text-align: center; font-size: 20px; letter-spacing: 5px;"
          />
        </div>

        <button class="pixel-btn" id="btn-submit-pin" style="padding: 12px 24px;">
          UNLOCK DASHBOARD
        </button>
      </div>
    `;

    const pinInput = body.querySelector('#admin-pin-input');
    const submitBtn = body.querySelector('#btn-submit-pin');

    const handleAuth = () => {
      if (pinInput.value.trim() === (settings.adminPin || '2026')) {
        sound.playFanfare();
        isAuthenticated = true;
        showToast('Welcome back, Boss!', 'success');
        renderAdminContent();
      } else {
        sound.playRemove();
        showToast('Incorrect PIN! Try again.', 'warning');
        pinInput.value = '';
        pinInput.focus();
      }
    };

    submitBtn.addEventListener('click', handleAuth);
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAuth();
    });
    setTimeout(() => pinInput.focus(), 150);
    return;
  }

  // 2. Authenticated Admin Dashboard Tabs
  const categories = storage.getCategories();
  const items = storage.getItems();
  const orders = storage.getOrders();

  body.innerHTML = `
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
      <button class="pixel-btn ${activeAdminTab === 'settings' ? '' : 'secondary'}" id="tab-btn-settings" style="font-size: 8px; padding: 8px 10px;">
        ⚙️ SETTINGS
      </button>
    </div>

    <!-- Tab Content Body -->
    <div id="admin-tab-content"></div>
  `;

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

    if (orders.length === 0 && inquiryTicketIds.length === 0) {
      tabContent.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <p class="font-silkscreen" style="font-size: 12px; color: var(--accent-orange); margin-bottom: 6px;">
            No customer orders or inquiries yet.
          </p>
          <p style="font-size: 12px;">Customer orders and real-time support chat inquiries will appear here.</p>
        </div>
      `;
    } else {
      let html = `<div style="display: flex; flex-direction: column; gap: 10px; max-height: 420px; overflow-y: auto; padding-right: 4px;">`;

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
}
