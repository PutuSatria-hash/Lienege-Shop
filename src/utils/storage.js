import { DEFAULT_CATEGORIES, DEFAULT_ITEMS } from '../data/defaultItems.js';

const STORAGE_KEYS = {
  ITEMS: 'pl_merchant_items_v2',
  CATEGORIES: 'pl_merchant_categories_v2',
  CART: 'pl_merchant_cart_v2',
  WISHLIST: 'pl_merchant_wishlist_v2',
  ORDERS: 'pl_merchant_orders_v2',
  CHATS: 'pl_merchant_chats_v2',
  SETTINGS: 'pl_merchant_settings_v2',
  CUSTOMER_ID: 'pl_customer_id_v2',
  REVIEWS: 'pl_merchant_reviews_v2',
  ADMIN_ACCOUNTS: 'pl_merchant_admin_accounts_v2',
  CURRENT_ADMIN: 'pl_merchant_current_admin_v2'
};

const DEFAULT_ADMIN_ACCOUNTS = [
  { id: 'adm-master', username: 'admin', password: 'wiseman2026', name: 'Master Wiseman', role: 'Super Admin', createdAt: '2026-10-18' },
  { id: 'adm-boss', username: 'boss', password: 'lineage2026', name: 'Boss Satria', role: 'Owner', createdAt: '2026-10-18' }
];

const DEFAULT_SETTINGS = {
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
    itemName: 'Spectral Lantern',
    comment: 'Super fast trade in-game! Boss Wiseman is legit and very friendly.',
    date: '10/16/2026'
  },
  {
    id: 'rev-2',
    customerId: 'Customer#912048591',
    rating: 5,
    itemName: "Pumpkin Lord's Core",
    comment: 'Item arrived within 3 minutes of ordering. Best price across all Lineage merchants!',
    date: '10/17/2026'
  },
  {
    id: 'rev-3',
    customerId: 'Customer#159755970',
    rating: 5,
    itemName: 'Grimoire of the Harvest Moon',
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
      if (!data) {
        this.saveItems(DEFAULT_ITEMS);
        return DEFAULT_ITEMS;
      }
      return JSON.parse(data);
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
    const itemWithId = {
      ...newItem,
      id: newItem.id || `item-${Date.now()}`
    };
    items.unshift(itemWithId);
    this.saveItems(items);
    return itemWithId;
  },

  updateItem(updatedItem) {
    const items = this.getItems().map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.saveItems(items);
  },

  deleteItem(id) {
    const items = this.getItems().filter(item => item.id !== id);
    this.saveItems(items);
  },

  // --- CATEGORIES ---
  getCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        this.saveCategories(DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
      }
      return JSON.parse(data);
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
    const cart = this.getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }
    this.saveCart(cart);
  },

  updateCartQuantity(itemId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(i => i.id !== itemId);
    } else {
      const target = cart.find(i => i.id === itemId);
      if (target) target.quantity = quantity;
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
