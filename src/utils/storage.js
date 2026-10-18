import { DEFAULT_CATEGORIES, DEFAULT_ITEMS } from '../data/defaultItems.js';

export const STORAGE_KEYS = {
  ITEMS: 'pl_merchant_items_v3',
  CATEGORIES: 'pl_merchant_categories_v3',
  CART: 'pl_merchant_cart_v3',
  WISHLIST: 'pl_merchant_wishlist_v3',
  ORDERS: 'pl_merchant_orders_v2',
  CHATS: 'pl_merchant_chats_v2',
  SETTINGS: 'pl_merchant_settings_v3',
  CUSTOMER_ID: 'pl_customer_id_v2',
  REVIEWS: 'pl_merchant_reviews_v3',
  ADMIN_ACCOUNTS: 'pl_merchant_admin_accounts_v3',
  CURRENT_ADMIN: 'pl_merchant_current_admin_v3',
  STORE_STATUS: 'pl_merchant_store_open_v3'
};

// Automatic cleanup for obsolete cached versions from previous iterations
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const legacyKeys = [
      'pl_merchant_items_v2',
      'pl_merchant_categories_v2',
      'pl_merchant_items',
      'pl_merchant_categories',
      'pl_merchant_cart',
      'pl_merchant_wishlist'
    ];
    legacyKeys.forEach(k => {
      try {
        if (localStorage.getItem(k) !== null) {
          localStorage.removeItem(k);
        }
      } catch {}
    });
  }
} catch {
  // Silent fallback
}

const DEFAULT_ADMIN_ACCOUNTS = [
  { id: 'adm-master', username: 'admin', password: 'wiseman2026', name: 'Master Wiseman', role: 'Super Admin', createdAt: '2026-10-18' },
  { id: 'adm-boss', username: 'boss', password: 'lineage2026', name: 'Boss Satria', role: 'Owner', createdAt: '2026-10-18' }
];

const DEFAULT_SETTINGS = {
  storeName: 'Wiseman Shop',
  robloxProfileUrl: 'https://www.roblox.com/users/4035030385/profile',
  robloxUsername: 'WisemanBoss',
  robloxStatus: 'online', // 'online' | 'trading' | 'offline'
  discordWebhookUrl: 'https://discord.com/api/webhooks/1561012342219612292/Iy_s75ZqqsDCvbxrK_jBhBhENqQUGGKRNx2uZiVvc_CI74NCgGwV_XgUXGV5fRPTG8in',
  adminPin: '2026',
  soundEnabled: true,
  scanlinesEnabled: false
};

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    customerId: 'Customer#384910248',
    rating: 5,
    itemName: 'Tome of Archon',
    comment: 'Super fast trade in-game! Boss Wiseman is legit and very friendly.',
    date: '10/16/2026'
  },
  {
    id: 'rev-2',
    customerId: 'Customer#912048591',
    rating: 5,
    itemName: 'Asborn Heartblood',
    comment: 'Item arrived within 3 minutes of ordering. Best price across all Lineage merchants!',
    date: '10/17/2026'
  },
  {
    id: 'rev-3',
    customerId: 'Customer#159755970',
    rating: 5,
    itemName: 'Celestine Heirloom',
    comment: 'Traded with barter method and Boss accepted smoothly. 10/10 recommended!',
    date: '10/17/2026'
  }
];

// Cross-tab real-time event sync
let chatChannel = null;
try {
  chatChannel = new BroadcastChannel('pl_wiseman_channel_v2');
} catch {
  // BroadcastChannel fallback
}

// --- LOCAL LAPTOP DISK STORAGE SERVER & CLOUD RELAY DUAL-MODE BRIDGE ---
const LOCAL_SERVER_HTTP = 'http://localhost:8080/api/action';
const LOCAL_SERVER_STATE = 'http://localhost:8080/api/state';
const LOCAL_SERVER_WS = 'ws://localhost:8080/ws';
const DIRECT_CLOUD_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a14ab3f8790390';

let isLocalServerOnline = false;
let localWs = null;

// Connect to Local Laptop WebSocket for instant 0ms latency real-time updates
export function initLocalWebSocket() {
  if (typeof window === 'undefined') return;
  try {
    if (localWs) {
      localWs.close();
      localWs = null;
    }
    localWs = new WebSocket(LOCAL_SERVER_WS);

    localWs.onopen = () => {
      isLocalServerOnline = true;
      window.dispatchEvent(new CustomEvent('pl_local_storage_status', { detail: { isOnline: true } }));
      console.log('[LOCAL STORAGE] Terhubung langsung ke Local Database Laptop: data/store_database.json');
    };

    localWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.state) {
          applyRemoteState(data.state);
        }
      } catch {
        // Ignored
      }
    };

    localWs.onclose = () => {
      isLocalServerOnline = false;
      window.dispatchEvent(new CustomEvent('pl_local_storage_status', { detail: { isOnline: false } }));
      setTimeout(initLocalWebSocket, 5000); // Reconnect attempt
    };

    localWs.onerror = () => {
      isLocalServerOnline = false;
      window.dispatchEvent(new CustomEvent('pl_local_storage_status', { detail: { isOnline: false } }));
    };
  } catch {
    isLocalServerOnline = false;
  }
}

// Push to both Local Laptop Storage Server (if running) and Cloud Relay
export async function pushToCloud(action, payload) {
  try {
    // 1. Send immediately to Local Laptop Server (writing directly to data/store_database.json)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);
      fetch(LOCAL_SERVER_HTTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
        signal: controller.signal
      }).then(r => {
        clearTimeout(timeoutId);
        if (r && r.ok) isLocalServerOnline = true;
      }).catch(() => {});
    } catch {
      // Local server offline, falls back to cloud
    }

    // 2. Send to Vercel Cloud Relay (for cross-device access by other users worldwide)
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    }).catch(() => null);

    if (!res || !res.ok) {
      // Direct cloud state fallback
      const cur = await fetch(DIRECT_CLOUD_URL).then(r => r.json()).catch(() => null);
      let data = (cur && cur.data) ? cur.data : { orders: [], chats: {}, reviews: [] };
      if (!Array.isArray(data.orders)) data.orders = [];
      if (!data.chats) data.chats = {};
      if (!Array.isArray(data.reviews)) data.reviews = [];

      if (action === 'create_order') {
        if (!data.orders.some(o => o.id === payload.id)) data.orders.unshift(payload);
      } else if (action === 'complete_order') {
        data.orders = data.orders.map(o => o.id === payload.orderId ? { ...o, status: 'Completed', completedAt: new Date().toISOString() } : o);
      } else if (action === 'update_status') {
        data.orders = data.orders.map(o => o.id === payload.orderId ? { ...o, status: payload.status } : o);
      } else if (action === 'send_chat') {
        if (!data.chats[payload.orderId]) data.chats[payload.orderId] = [];
        if (!data.chats[payload.orderId].some(m => m.id === payload.message.id)) data.chats[payload.orderId].push(payload.message);
      } else if (action === 'create_review') {
        if (!data.reviews.some(r => r.id === payload.id)) data.reviews.unshift(payload);
      }

      await fetch(DIRECT_CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'wiseman_shop_state', data })
      }).catch(() => {});
    }
  } catch {
    // Silent catch
  }
}

function applyRemoteState(state) {
  if (!state) return;

  // 1. Sync Orders
  if (Array.isArray(state.orders) && state.orders.length > 0) {
    const localOrders = storage.getOrders();
    let changed = false;
    const mergedMap = new Map();
    localOrders.forEach(o => mergedMap.set(o.id, o));
    state.orders.forEach(ro => {
      const existing = mergedMap.get(ro.id);
      if (!existing) {
        mergedMap.set(ro.id, ro);
        changed = true;
      } else if (existing.status !== ro.status) {
        mergedMap.set(ro.id, { ...existing, ...ro });
        changed = true;
      }
    });
    if (changed) {
      const mergedList = Array.from(mergedMap.values());
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mergedList));
      window.dispatchEvent(new CustomEvent('pl_orders_updated', { detail: mergedList }));
    }
  }

  // 2. Sync Chats
  if (state.chats && typeof state.chats === 'object') {
    const localChats = storage.getAllChats();
    let chatChanged = false;
    Object.keys(state.chats).forEach(ticketId => {
      const remoteMsgs = state.chats[ticketId] || [];
      const localMsgs = localChats[ticketId] || [];
      const localIds = new Set(localMsgs.map(m => m.id));
      remoteMsgs.forEach(m => {
        if (!localIds.has(m.id)) {
          localMsgs.push(m);
          localIds.add(m.id);
          chatChanged = true;
          window.dispatchEvent(new CustomEvent('pl_chat_updated', {
            detail: { orderId: ticketId, message: m }
          }));
        }
      });
      localChats[ticketId] = localMsgs;
    });
    if (chatChanged) {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(localChats));
    }
  }

  // 3. Sync Reviews
  if (Array.isArray(state.reviews) && state.reviews.length > 0) {
    const localReviews = storage.getReviews();
    let revChanged = false;
    const revMap = new Map();
    localReviews.forEach(r => revMap.set(r.id, r));
    state.reviews.forEach(rr => {
      if (!revMap.has(rr.id)) {
        revMap.set(rr.id, rr);
        revChanged = true;
      }
    });
    if (revChanged) {
      const mergedReviews = Array.from(revMap.values());
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(mergedReviews));
      window.dispatchEvent(new CustomEvent('pl_reviews_updated', { detail: mergedReviews }));
    }
  }
}

export async function syncWithCloud() {
  try {
    // Check local server first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);
      const localRes = await fetch(LOCAL_SERVER_STATE, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);
      if (localRes && localRes.ok) {
        isLocalServerOnline = true;
        const localData = await localRes.json().catch(() => null);
        if (localData) {
          applyRemoteState(localData);
          return;
        }
      }
    } catch {
      // Local server not running
    }

    // Sync with Vercel Cloud Relay
    let cloudData = null;
    const res = await fetch('/api/sync').catch(() => null);
    if (res && res.ok) {
      cloudData = await res.json().catch(() => null);
    } else {
      const cur = await fetch(DIRECT_CLOUD_URL).then(r => r.json()).catch(() => null);
      if (cur && cur.data) cloudData = cur.data;
    }

    if (cloudData) {
      applyRemoteState(cloudData);
    }
  } catch {
    // Silent catch
  }
}

// Background polling for cross-device synchronization (every 3 seconds)
setInterval(syncWithCloud, 3000);
setTimeout(syncWithCloud, 300);
setTimeout(initLocalWebSocket, 1000);

export const storage = {
  // --- CUSTOMER ID (Random 9-digit e.g. Customer#805092764) ---
  getCustomerId() {
    try {
      let id = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
      if (!id) {
        const rand9 = Math.floor(100000000 + Math.random() * 900000000);
        id = `Customer#${rand9}`;
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_ID, id);
      }
      return id;
    } catch {
      return 'Customer#805092764';
    }
  },

  // Unique session ID for General Inquiries
  getInquiryTicketId() {
    const custId = this.getCustomerId().replace(/[^0-9]/g, '');
    return `INQUIRY-${custId}`;
  },

  // --- ITEMS ---
  getItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      let items = data ? JSON.parse(data) : DEFAULT_ITEMS;
      let changed = false;

      // 1. Remove dummy items not in authentic Lineage catalogue
      const defaultNames = new Set(DEFAULT_ITEMS.map(it => (it.name || '').toLowerCase()));
      const isDummy = (it) => {
        if (!it || !it.name) return true;
        const n = it.name.toLowerCase();
        if (n.includes('crypt master') || n.includes('haunted castle') || n.includes('crypt') || n.includes('haunted')) return true;
        if (n.includes('pumpkin') || n.includes('spectral') || n.includes('harvest')) return true;
        if (it.category === 'key') return true;
        if (it.image && typeof it.image === 'string' && it.image.startsWith('data:image/svg')) return true;
        // If an item has an old dummy id and is not part of default items
        if (!defaultNames.has(n) && (it.id && (it.id.startsWith('item-') || it.id.startsWith('relic-item') || it.id.startsWith('dummy-')))) return true;
        return false;
      };

      const prevCount = items.length;
      items = items.filter(it => !isDummy(it));
      if (items.length !== prevCount) {
        changed = true;
      }

      // 2. Synchronize prices and ensure all items from DEFAULT_ITEMS exist
      const defaultMap = new Map(DEFAULT_ITEMS.map(it => [it.name.toLowerCase(), it]));
      
      // Update existing item prices to match Boss's pricing rules
      items = items.map(it => {
        const def = defaultMap.get((it.name || '').toLowerCase());
        if (def) {
          if (it.price !== def.price || it.category !== def.category || it.image !== def.image) {
            changed = true;
            it = { ...it, price: def.price, category: def.category, image: def.image };
          }
        }
        if (it.stock === undefined || isNaN(it.stock)) {
          changed = true;
          const s = it.status === 'Sold Out' || it.status === 'Habis' ? 0 : 10;
          it = { ...it, stock: s };
        }
        return it;
      });

      // Add missing default items if any
      const existingNames = new Set(items.map(it => (it.name || '').toLowerCase()));
      DEFAULT_ITEMS.forEach(def => {
        if (!existingNames.has(def.name.toLowerCase())) {
          items.push({ ...def });
          changed = true;
        }
      });

      if (changed || !data) {
        this.saveItems(items);
      }
      return items;
    } catch {
      return DEFAULT_ITEMS;
    }
  },

  saveItems(items) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('pl_items_updated', { detail: items }));
  },

  addItem(newItem) {
    const items = this.getItems();
    const stock = Math.max(0, parseInt(newItem.stock, 10) || 10);
    const itemWithId = {
      ...newItem,
      id: newItem.id || `item-${Date.now()}`,
      stock,
      status: stock > 0 ? (stock <= 3 ? 'Limited Stock' : 'In Stock') : 'Sold Out'
    };
    items.unshift(itemWithId);
    this.saveItems(items);
    return itemWithId;
  },

  updateItem(updatedItem) {
    const stock = Math.max(0, parseInt(updatedItem.stock, 10) || 0);
    const itemWithStock = {
      ...updatedItem,
      stock,
      status: stock > 0 ? (stock <= 3 ? 'Limited Stock' : 'In Stock') : 'Sold Out'
    };
    const items = this.getItems().map(item =>
      item.id === updatedItem.id ? itemWithStock : item
    );
    this.saveItems(items);
  },

  updateItemStock(id, newStock) {
    const stock = Math.max(0, parseInt(newStock, 10) || 0);
    const items = this.getItems().map(it => {
      if (it.id === id) {
        return {
          ...it,
          stock,
          status: stock > 0 ? (stock <= 3 ? 'Limited Stock' : 'In Stock') : 'Sold Out'
        };
      }
      return it;
    });
    this.saveItems(items);
    pushToCloud('update_stock', { itemId: id, stock });
    return items.find(it => it.id === id);
  },

  deleteItem(id) {
    const items = this.getItems().filter(item => item.id !== id);
    this.saveItems(items);
  },

  // --- CATEGORIES ---
  getCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      let categories = data ? JSON.parse(data) : DEFAULT_CATEGORIES;
      // Filter out dummy 'key' category and ensure 'heirloom' exists
      const cleanCategories = categories.filter(c => c.id !== 'key');
      if (!cleanCategories.some(c => c.id === 'heirloom')) {
        cleanCategories.splice(2, 0, { id: 'heirloom', name: 'Heirloom', icon: '👑' });
      }
      if (cleanCategories.length !== categories.length || !data) {
        this.saveCategories(cleanCategories);
      }
      return cleanCategories;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('pl_categories_updated', { detail: categories }));
  },

  addCategory(newCategory) {
    const categories = this.getCategories();
    const id = newCategory.id || newCategory.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (categories.some(c => c.id === id)) {
      throw new Error(`Category "${newCategory.name}" already exists!`);
    }
    const cat = { id, name: newCategory.name, icon: newCategory.icon || '🏷️' };
    categories.push(cat);
    this.saveCategories(categories);
    return cat;
  },

  // --- CART ---
  getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('pl_cart_updated', { detail: cart }));
  },

  addToCart(item, quantity = 1) {
    const currentItems = this.getItems();
    const liveItem = currentItems.find(i => i.id === item.id) || item;
    const maxStock = typeof liveItem.stock === 'number' ? liveItem.stock : 10;
    
    if (maxStock <= 0) {
      throw new Error('Item ini sedang habis stok!');
    }

    const cart = this.getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity = Math.min(maxStock, existing.quantity + quantity);
    } else {
      cart.push({ ...item, quantity: Math.min(maxStock, quantity) });
    }
    this.saveCart(cart);
  },

  updateCartQuantity(itemId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(i => i.id !== itemId);
    } else {
      const currentItems = this.getItems();
      const liveItem = currentItems.find(i => i.id === itemId);
      const maxStock = liveItem && typeof liveItem.stock === 'number' ? liveItem.stock : 999;
      const clampedQty = Math.min(maxStock, quantity);

      cart = cart.map(i =>
        i.id === itemId ? { ...i, quantity: clampedQty } : i
      );
    }
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart([]);
  },

  // --- WISHLIST / BUILD PLANNER ---
  getWishlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveWishlist(wishlist) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent('pl_wishlist_updated', { detail: wishlist }));
  },

  toggleWishlist(item) {
    let wishlist = this.getWishlist();
    const exists = wishlist.some(i => i.id === item.id);
    if (exists) {
      wishlist = wishlist.filter(i => i.id !== item.id);
    } else {
      wishlist.push(item);
    }
    this.saveWishlist(wishlist);
    return !exists;
  },

  isInWishlist(itemId) {
    const wishlist = this.getWishlist();
    return wishlist.some(i => i.id === itemId);
  },

  clearWishlist() {
    this.saveWishlist([]);
  },

  // --- ORDERS ---
  getOrders() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('pl_orders_updated', { detail: orders }));
    if (chatChannel) {
      chatChannel.postMessage({ type: 'order_created', order });
    }

    // Auto decrement item stock
    if (Array.isArray(order.items) && order.items.length > 0) {
      const items = this.getItems();
      let changed = false;
      order.items.forEach(ordered => {
        const item = items.find(it => it.id === ordered.id || it.name === ordered.name);
        if (item) {
          const cur = typeof item.stock === 'number' ? item.stock : 10;
          const qty = Number(ordered.quantity) || 1;
          const newStock = Math.max(0, cur - qty);
          item.stock = newStock;
          item.status = newStock > 0 ? (newStock <= 3 ? 'Limited Stock' : 'In Stock') : 'Sold Out';
          changed = true;
        }
      });
      if (changed) {
        this.saveItems(items);
      }
    }

    // Push to serverless cloud relay
    pushToCloud('create_order', order);

    // Silent webhook ping to Boss if Discord webhook is configured
    this.sendDiscordAlert(`🛒 New Order #${order.id}`, [
      { name: 'Customer', value: order.customerId || 'Customer', inline: true },
      { name: 'Character IGN', value: order.ign, inline: true },
      { name: 'Payment', value: order.paymentMethod === 'gold' ? `${(order.totalGold || 0).toLocaleString()} Gold` : `Barter: "${order.barterOffer}"`, inline: false },
      { name: 'Items', value: order.items.map(i => `${i.quantity}x ${i.name}`).join(', ') }
    ]);
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders().map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('pl_orders_updated', { detail: orders }));
    if (chatChannel) {
      chatChannel.postMessage({ type: 'order_status_updated', orderId, newStatus });
    }

    // Push to cloud relay
    pushToCloud('update_status', { orderId, status: newStatus });
  },

  // --- ORDER FULFILLMENT & COMPLETION (PENYELESAIAN PESANAN) ---
  completeOrder(orderId) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = 'Completed';
    order.completedAt = new Date().toLocaleString('id-ID');
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('pl_orders_updated', { detail: orders }));

    if (chatChannel) {
      chatChannel.postMessage({ type: 'order_status_updated', orderId, newStatus: 'Completed' });
    }

    // Push completion to cloud relay
    pushToCloud('complete_order', { orderId });

    // Send automatic completion notice in live chat ticket
    this.sendChatMessage(
      orderId, 
      'SYSTEM', 
      `[PESANAN SELESAI]: Admin telah menyelesaikan pesanan Anda di dalam game. Terima kasih telah bertransaksi di Wiseman Shop! Anda sekarang dapat menulis ulasan terverifikasi.`, 
      true
    );

    // Discord Alert
    this.sendDiscordAlert(`✅ Pesanan Selesai #${order.id}`, [
      { name: 'Customer', value: order.customerId || 'Customer', inline: true },
      { name: 'Character IGN', value: order.ign, inline: true },
      { name: 'Total Selesai', value: order.paymentMethod === 'gold' ? `${(order.totalGold || 0).toLocaleString()} Gold` : `Barter: "${order.barterOffer}"` },
      { name: 'Status', value: '100% Completed / Transaksi Berhasil', inline: false }
    ]);

    return order;
  },

  cancelOrder(orderId, reason = 'Dibatalkan oleh Admin') {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = 'Cancelled';
    order.cancelReason = reason;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('pl_orders_updated', { detail: orders }));

    // Restore stock if previously deducted
    if (Array.isArray(order.items) && order.items.length > 0) {
      const items = this.getItems();
      let changed = false;
      order.items.forEach(ordered => {
        const item = items.find(it => it.id === ordered.id || it.name === ordered.name);
        if (item) {
          const cur = typeof item.stock === 'number' ? item.stock : 0;
          const qty = Number(ordered.quantity) || 1;
          const newStock = cur + qty;
          item.stock = newStock;
          item.status = newStock > 0 ? (newStock <= 3 ? 'Limited Stock' : 'In Stock') : 'Sold Out';
          changed = true;
        }
      });
      if (changed) {
        this.saveItems(items);
      }
    }

    if (chatChannel) {
      chatChannel.postMessage({ type: 'order_status_updated', orderId, newStatus: 'Cancelled' });
    }

    // Push cancellation to cloud relay
    pushToCloud('update_status', { orderId, status: 'Cancelled' });

    this.sendChatMessage(orderId, 'SYSTEM', `[PESANAN DIBATALKAN]: Pesanan dibatalkan. Alasan: ${reason}`, true);
    return order;
  },

  // --- TOKOKU STORE PERFORMANCE & FINANCES (AKTIFITAS PENTING & STATISTIK) ---
  getStoreStats() {
    const orders = this.getOrders();
    const items = this.getItems();
    const reviews = this.getReviews();

    const perluDiproses = orders.filter(o => 
      !o.status || o.status === 'Pending Boss Review' || o.status === 'Perlu Diproses' || o.status === 'Pending'
    ).length;

    const menungguKonfirmasi = orders.filter(o => 
      o.status === 'Accepted / In Progress' || o.status === 'Ready to Trade In-Game' || o.status === 'Menunggu Konfirmasi'
    ).length;

    const kendalaPesanan = orders.filter(o => o.status === 'Kendala Pesanan').length;
    const sedangDibatalkan = orders.filter(o => o.status === 'Cancelled' || o.status === 'Sedang Dibatalkan').length;
    const pesananSelesai = orders.filter(o => o.status === 'Completed' || o.status === 'Selesai').length;
    const stokHabis = items.filter(it => it.status === 'Sold Out' || it.status === 'Habis' || Number(it.stock) === 0).length;

    const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Selesai');
    const saldoGold = completedOrders.reduce((sum, o) => sum + (o.paymentMethod === 'gold' ? (Number(o.totalGold) || 0) : 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
    const transaksiBerjalan = activeOrders.reduce((sum, o) => sum + (o.paymentMethod === 'gold' ? (Number(o.totalGold) || 0) : 0), 0);

    const uniqueBuyers = new Set(orders.map(o => o.customerId).filter(Boolean)).size;
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : '4.9';

    return {
      perluDiproses,
      menungguKonfirmasi,
      kendalaPesanan,
      sedangDibatalkan,
      pesananSelesai,
      stokHabis,
      saldoGold,
      transaksiBerjalan,
      totalPembeli: uniqueBuyers,
      totalOrders: orders.length,
      ratingToko: avgRating,
      poinToko: 100
    };
  },

  getStoreStatus() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORE_STATUS);
      return data !== null ? JSON.parse(data) : true; // default Toko Buka
    } catch {
      return true;
    }
  },

  setStoreStatus(isOpen) {
    localStorage.setItem(STORAGE_KEYS.STORE_STATUS, JSON.stringify(isOpen));
    window.dispatchEvent(new CustomEvent('pl_store_status_updated', { detail: isOpen }));
  },

  toggleStoreStatus() {
    const current = this.getStoreStatus();
    this.setStoreStatus(!current);
    return !current;
  },

  getCustomerOrders() {
    const myId = this.getCustomerId().trim();
    return this.getOrders().filter(o => (o.customerId || '').trim() === myId);
  },

  hasAnyPurchasedOrder() {
    return this.getCustomerOrders().length > 0;
  },

  getCustomerPurchasedItems() {
    const customerOrders = this.getCustomerOrders();
    const itemNames = new Set();
    customerOrders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(it => {
          if (it.name) itemNames.add(it.name);
        });
      }
    });
    return Array.from(itemNames);
  },

  // --- CHATS ---
  getAllChats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getChatMessages(orderId) {
    const chats = this.getAllChats();
    return chats[orderId] || [];
  },

  sendChatMessage(orderId, sender, text, isSystem = false) {
    const chats = this.getAllChats();
    if (!chats[orderId]) {
      chats[orderId] = [];
    }
    const msg = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem
    };
    chats[orderId].push(msg);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));

    const eventPayload = { orderId, message: msg };
    window.dispatchEvent(new CustomEvent('pl_chat_updated', { detail: eventPayload }));
    if (chatChannel) {
      chatChannel.postMessage({ type: 'new_chat_message', ...eventPayload });
    }

    // Push chat to serverless cloud relay
    pushToCloud('send_chat', { orderId, message: msg });

    // If sent by customer (not system and not Boss), trigger silent notification
    if (!isSystem && sender !== 'Boss') {
      this.sendDiscordAlert(`💬 New Message from ${sender}`, [
        { name: 'Ticket / Order', value: `#${orderId}`, inline: true },
        { name: 'Message', value: text }
      ]);
    }

    return msg;
  },

  // --- SILENT DISCORD WEBHOOK PING TO BOSS ---
  sendDiscordAlert(title, fields = []) {
    const settings = this.getSettings();
    if (!settings.discordWebhookUrl) return;

    try {
      fetch(settings.discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Wiseman Shop Bot',
          avatar_url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f9d9.png',
          embeds: [{
            title,
            color: 0xff7a18,
            fields,
            footer: { text: `Wiseman Shop • Customer Portal` },
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(() => {
        // Silent catch
      });
    } catch {
      // Ignore network errors
    }
  },

  // --- REVIEWS ---
  getReviews() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  },

  saveReview(review) {
    const reviews = this.getReviews();
    const newRev = {
      id: `rev-${Date.now()}`,
      customerId: review.customerId || this.getCustomerId(),
      rating: review.rating || 5,
      itemName: review.itemName || 'Wiseman Shop Item',
      comment: review.comment || 'Great trade!',
      date: new Date().toLocaleDateString('en-US')
    };
    reviews.unshift(newRev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent('pl_reviews_updated', { detail: reviews }));

    // Push review to cloud relay
    pushToCloud('create_review', newRev);

    // Send Discord ping for new review
    this.sendDiscordAlert(`⭐ New ${newRev.rating}-Star Customer Review!`, [
      { name: 'Customer ID', value: newRev.customerId, inline: true },
      { name: 'Item', value: newRev.itemName, inline: true },
      { name: 'Rating', value: '⭐'.repeat(newRev.rating), inline: false },
      { name: 'Feedback', value: newRev.comment }
    ]);
    return newRev;
  },

  // --- SETTINGS ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const parsed = data ? JSON.parse(data) : {};
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        discordWebhookUrl: parsed.discordWebhookUrl || DEFAULT_SETTINGS.discordWebhookUrl
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('pl_settings_updated', { detail: settings }));
  },

  // --- BACKUP & RESTORE ---
  exportBackup() {
    const backupData = {
      version: '3.1',
      exportedAt: new Date().toISOString(),
      items: this.getItems(),
      categories: this.getCategories(),
      orders: this.getOrders(),
      chats: this.getAllChats(),
      settings: this.getSettings()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiseman_shop_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importBackup(jsonData) {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.items && Array.isArray(parsed.items)) {
        this.saveItems(parsed.items);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        this.saveCategories(parsed.categories);
      }
      if (parsed.orders && Array.isArray(parsed.orders)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(parsed.orders));
      }
      if (parsed.chats) {
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(parsed.chats));
      }
      if (parsed.settings) {
        this.saveSettings(parsed.settings);
      }
      return true;
    } catch (err) {
      console.error('Failed to import backup:', err);
      throw new Error('Invalid JSON file format!');
    }
  },

  resetToDefault() {
    this.saveItems(DEFAULT_ITEMS);
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveSettings(DEFAULT_SETTINGS);
  },

  // --- MULTI-ADMIN ACCOUNTS MANAGEMENT ---
  getAdminAccounts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_ACCOUNTS);
      if (!data) {
        this.saveAdminAccounts(DEFAULT_ADMIN_ACCOUNTS);
        return DEFAULT_ADMIN_ACCOUNTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ADMIN_ACCOUNTS;
    }
  },

  saveAdminAccounts(accounts) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(accounts));
    window.dispatchEvent(new CustomEvent('pl_admin_accounts_updated', { detail: accounts }));
  },

  authenticateAdmin(username, password) {
    const accounts = this.getAdminAccounts();
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const matched = accounts.find(acc => 
      acc.username.toLowerCase() === cleanUser && acc.password === cleanPass
    );

    if (matched) {
      this.setCurrentAdmin(matched);
      return matched;
    }

    // Backwards compatibility with adminPin if entered in password field
    const settings = this.getSettings();
    if (cleanUser === 'boss' && cleanPass === (settings.adminPin || '2026')) {
      const fallbackAcc = { id: 'adm-boss', username: 'boss', name: 'Boss Satria', role: 'Owner' };
      this.setCurrentAdmin(fallbackAcc);
      return fallbackAcc;
    }

    return null;
  },

  addAdminAccount({ username, password, name, role }) {
    const cleanUser = (username || '').trim().toLowerCase();
    if (!cleanUser || !password) {
      throw new Error('Username and password are required!');
    }
    const accounts = this.getAdminAccounts();
    if (accounts.some(a => a.username.toLowerCase() === cleanUser)) {
      throw new Error(`Admin username "${username}" is already taken!`);
    }
    const newAdmin = {
      id: `adm-${Date.now()}`,
      username: cleanUser,
      password: password.trim(),
      name: name ? name.trim() : username,
      role: role ? role.trim() : 'Staff Admin',
      createdAt: new Date().toLocaleDateString('en-US')
    };
    accounts.push(newAdmin);
    this.saveAdminAccounts(accounts);
    return newAdmin;
  },

  deleteAdminAccount(id) {
    let accounts = this.getAdminAccounts();
    const target = accounts.find(a => a.id === id);
    if (!target) return;
    if (target.username === 'admin' || target.username === 'boss') {
      throw new Error('Master admin accounts cannot be deleted!');
    }
    accounts = accounts.filter(a => a.id !== id);
    this.saveAdminAccounts(accounts);
  },

  getCurrentAdmin() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentAdmin(admin) {
    try {
      if (admin) {
        sessionStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
      }
    } catch {
      // sessionStorage fallback
    }
  },

  logoutAdmin() {
    this.setCurrentAdmin(null);
  }
};

// Listen to cross-tab updates
if (chatChannel) {
  chatChannel.onmessage = (event) => {
    if (event.data && event.data.type === 'new_chat_message') {
      window.dispatchEvent(new CustomEvent('pl_chat_updated', {
        detail: { orderId: event.data.orderId, message: event.data.message }
      }));
    } else if (event.data && event.data.type === 'order_created') {
      window.dispatchEvent(new CustomEvent('pl_orders_updated', {
        detail: storage.getOrders()
      }));
    }
  };
}
