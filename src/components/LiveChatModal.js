// Live Order & Public Inquiry Chat Messenger (100% On-Site, Auto-Reply Bot, No Leaks)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';

let currentActiveOrderId = null;
let isBossViewer = false;

export function initLiveChatModal() {
  const existing = document.getElementById('chat-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'chat-modal';

  modal.innerHTML = `
    <div class="modal-content mobile-sheet" style="max-width: 640px; display: flex; flex-direction: column; height: 90vh;">
      <!-- Chat Header -->
      <div class="modal-header" style="flex-shrink: 0;">
        <div>
          <div class="modal-title font-pixel" id="chat-header-title">💬 LIVE CHAT</div>
          <div class="font-silkscreen" id="chat-header-sub" style="font-size: 10px; color: var(--accent-gold); margin-top: 4px;"></div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="chat-back-admin-btn" class="pixel-btn secondary" style="font-size: 8px; padding: 6px 10px; display: none;" title="Return to Admin Inbox">
            👑 ADMIN INBOX
          </button>
          <a id="chat-roblox-btn" href="https://www.roblox.com/users/4035030385/profile" target="_blank" class="pixel-btn secondary" style="font-size: 8px; padding: 6px 10px;" title="Trade / Message on Roblox">
            ROBLOX ↗
          </a>
          <button class="modal-close-btn" id="chat-close-btn">&times;</button>
        </div>
      </div>

      <!-- Quick Action Bar -->
      <div style="background: rgba(0,0,0,0.35); padding: 8px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <span class="font-silkscreen" style="font-size: 10px; color: var(--text-muted);" id="chat-user-badge"></span>
        <button id="btn-copy-order-text" class="pixel-btn secondary" style="font-size: 8px; padding: 6px 10px;">
          📋 COPY FOR ROBLOX CHAT
        </button>
      </div>

      <!-- Messages Stream -->
      <div class="chat-messages-stream" id="chat-messages-stream" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
        <!-- Dynamic chat messages -->
      </div>

      <!-- Chat Input Area (Form for 100% Mobile & Keyboard Reliability) -->
      <form id="chat-input-form" class="chat-input-bar" style="padding: 12px 16px; background: rgba(18, 8, 36, 0.95); border-top: 2px solid var(--border-pixel-dark); display: flex; gap: 8px; flex-shrink: 0;">
        <input 
          type="text" 
          id="chat-input-text" 
          class="pixel-input" 
          placeholder="Ask about stock, trades, or your order..." 
          autocomplete="off"
        />
        <button type="submit" id="btn-send-chat" class="pixel-btn gold" style="padding: 10px 18px;">
          SEND
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#chat-close-btn');
  closeBtn.addEventListener('click', () => closeChat());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeChat();
  });

  const backAdminBtn = modal.querySelector('#chat-back-admin-btn');
  backAdminBtn.addEventListener('click', () => {
    sound.playClick();
    closeChat();
    window.dispatchEvent(new CustomEvent('pl_open_admin'));
  });

  const chatForm = modal.querySelector('#chat-input-form');
  const sendBtn = modal.querySelector('#btn-send-chat');

  const sendMessage = () => {
    const activeInput = modal.querySelector('#chat-input-text') || document.getElementById('chat-input-text');
    if (!activeInput) return;
    const text = activeInput.value.trim();
    if (!text || !currentActiveOrderId) return;

    const sender = isBossViewer ? 'Boss' : storage.getCustomerId();
    try {
      storage.sendChatMessage(currentActiveOrderId, sender, text);
    } catch (err) {
      console.error('Chat send error:', err);
    }

    sound.playClick();
    activeInput.value = '';
    renderMessages();

    // Auto reassurance from Wiseman Bot if customer is waiting for Boss's first reply
    if (!isBossViewer) {
      const messages = storage.getChatMessages(currentActiveOrderId);
      const bossReplies = messages.filter(m => m.sender === 'Boss');
      const botReassurances = messages.filter(m => m.isSystem && m.text.includes('Wiseman Bot has alerted Boss'));
      if (bossReplies.length === 0 && botReassurances.length === 0) {
        setTimeout(() => {
          try {
            storage.sendChatMessage(
              currentActiveOrderId,
              'SYSTEM',
              '🧙 [WISEMAN BOT]: Wiseman Bot has alerted Boss! Your message was delivered. Please wait a moment while Boss prepares to respond. You are not being ignored!',
              true
            );
          } catch {}
        }, 1200);
      }
    }
  };

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  const inputEl = modal.querySelector('#chat-input-text');
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  const copyBtn = modal.querySelector('#btn-copy-order-text');
  copyBtn.addEventListener('click', () => {
    sound.playCoin();
    copyOrderToClipboard(currentActiveOrderId);
  });

  // Listen to live chat updates from same page and cross-tab
  window.addEventListener('pl_chat_updated', (e) => {
    if (e.detail && e.detail.orderId === currentActiveOrderId) {
      renderMessages();
    }
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'pl_merchant_chats_v2' && currentActiveOrderId) {
      renderMessages();
    }
  });

  return {
    open: openChat,
    close: closeChat
  };
}

export function openChat(ticketId = 'general', asBoss = false) {
  const modal = document.getElementById('chat-modal');
  if (!modal) return;

  // Resolve Ticket ID: if 'general', use customer's unique inquiry ticket
  if (ticketId === 'general') {
    currentActiveOrderId = storage.getInquiryTicketId();
  } else {
    currentActiveOrderId = ticketId;
  }

  isBossViewer = asBoss;

  const settings = storage.getSettings();
  const orders = storage.getOrders();
  const order = orders.find(o => o.id === currentActiveOrderId);

  const titleEl = modal.querySelector('#chat-header-title');
  const subEl = modal.querySelector('#chat-header-sub');
  const robloxBtn = modal.querySelector('#chat-roblox-btn');
  const userBadge = modal.querySelector('#chat-user-badge');

  if (order) {
    titleEl.textContent = `ORDER #${order.id}`;
    subEl.textContent = `Status: ${order.status} • Customer: ${order.customerId || order.ign}`;
    userBadge.textContent = isBossViewer 
      ? `👑 Chatting as BOSS with ${order.customerId || order.ign}` 
      : `👤 Logged in as ${storage.getCustomerId()}`;
  } else {
    titleEl.textContent = `GENERAL SUPPORT & INQUIRY`;
    subEl.textContent = `Ticket: #${currentActiveOrderId}`;
    userBadge.textContent = isBossViewer 
      ? `👑 Chatting as BOSS` 
      : `👤 Logged in as ${storage.getCustomerId()}`;
  }

  robloxBtn.href = settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile';

  const backAdminBtn = modal.querySelector('#chat-back-admin-btn');
  if (backAdminBtn) {
    backAdminBtn.style.display = isBossViewer ? 'inline-block' : 'none';
  }

  // Initial Auto-Reply Greeting Bot if this ticket has no messages yet
  const existingMsgs = storage.getChatMessages(currentActiveOrderId);
  if (existingMsgs.length === 0) {
    let welcomeGreeting = '';
    if (order) {
      welcomeGreeting = `🧙 [WISEMAN BOT]: Order #${order.id} received! Welcome ${storage.getCustomerId()}. Boss has been alerted and will respond shortly. Please wait a moment while Boss prepares for in-game trade!`;
    } else {
      welcomeGreeting = `🧙 [WISEMAN BOT]: Greetings traveler! Welcome to Wiseman Shop. Have questions about items, custom barter, or in-game delivery? Type your message below. Boss will reply shortly!`;
    }
    storage.sendChatMessage(currentActiveOrderId, 'SYSTEM', welcomeGreeting, true);
  }

  renderMessages();
  modal.classList.add('open');

  const input = modal.querySelector('#chat-input-text');
  setTimeout(() => input.focus(), 150);
}

export function closeChat() {
  const modal = document.getElementById('chat-modal');
  if (modal) modal.classList.remove('open');
  if (isBossViewer) {
    window.dispatchEvent(new CustomEvent('pl_open_admin'));
  }
  currentActiveOrderId = null;
  isBossViewer = false;
}

function renderMessages() {
  const stream = document.getElementById('chat-messages-stream');
  if (!stream || !currentActiveOrderId) return;

  const messages = storage.getChatMessages(currentActiveOrderId);

  if (messages.length === 0) {
    stream.innerHTML = `
      <div style="text-align: center; padding: 30px 10px; color: var(--text-muted);">
        <p class="font-silkscreen" style="font-size: 11px; color: var(--accent-orange); margin-bottom: 6px;">
          No messages yet.
        </p>
        <p style="font-size: 12px;">Type a message below to start chatting with Boss.</p>
      </div>
    `;
    return;
  }

  const myId = isBossViewer ? 'Boss' : storage.getCustomerId();

  stream.innerHTML = messages.map(msg => {
    if (msg.isSystem) {
      return `
        <div style="background: rgba(255, 122, 24, 0.12); border-left: 3px solid var(--accent-orange); padding: 10px 14px; margin: 4px 0;">
          <div class="font-silkscreen" style="font-size: 9px; color: var(--accent-gold); margin-bottom: 4px;">
            [WISEMAN BOT] • ${msg.timestamp}
          </div>
          <div style="font-size: 12px; color: #e2e8f0; white-space: pre-line; line-height: 1.5;">${escapeHtml(msg.text)}</div>
        </div>
      `;
    }

    const isMe = msg.sender === myId;
    const isBoss = msg.sender === 'Boss';

    return `
      <div style="display: flex; flex-direction: column; align-items: ${isMe ? 'flex-end' : 'flex-start'};">
        <div class="font-silkscreen" style="font-size: 8px; color: ${isBoss ? 'var(--accent-gold)' : 'var(--text-dim)'}; margin-bottom: 3px;">
          ${isBoss ? '👑 WISEMAN BOSS' : msg.sender} • ${msg.timestamp}
        </div>
        <div style="
          max-width: 85%; 
          padding: 10px 14px; 
          font-size: 13px; 
          line-height: 1.45;
          word-break: break-word;
          background: ${isMe ? 'var(--accent-orange)' : isBoss ? '#3b1763' : 'rgba(255, 255, 255, 0.08)'};
          color: ${isMe ? '#110424' : '#ffffff'};
          border: 1px solid ${isBoss ? 'var(--accent-purple)' : 'rgba(0,0,0,0.5)'};
          box-shadow: 0 0 0 1px #000;
          font-weight: ${isMe ? '600' : '400'};
        ">
          ${escapeHtml(msg.text)}
        </div>
      </div>
    `;
  }).join('');

  stream.scrollTop = stream.scrollHeight;
}

function copyOrderToClipboard(orderId) {
  const orders = storage.getOrders();
  const order = orders.find(o => o.id === orderId);

  let text = '';
  if (order) {
    text = `📦 [PIXEL LINEAGE - WISEMAN SHOP ORDER]\n`;
    text += `Order ID: ${order.id}\n`;
    text += `Customer ID: ${order.customerId || storage.getCustomerId()}\n`;
    text += `Character IGN: ${order.ign}\n`;
    text += `Items:\n`;
    order.items.forEach((it, idx) => {
      text += `  ${idx + 1}. ${it.quantity}x ${it.name} (${(it.price || 0).toLocaleString('en-US')} Gold)\n`;
    });
    if (order.paymentMethod === 'gold') {
      text += `Payment: ${(order.totalGold || 0).toLocaleString('en-US')} Gold\n`;
    } else {
      text += `Barter Offer: ${order.barterOffer}\n`;
    }
    text += `Status: ${order.status}\n`;
  } else {
    text = `💬 [PIXEL LINEAGE - WISEMAN SHOP INQUIRY]\n`;
    text += `Customer ID: ${storage.getCustomerId()}\n`;
    text += `Ticket: #${orderId}\n`;
    text += `Hello Boss, I have an inquiry on Wiseman Shop!\n`;
  }

  navigator.clipboard.writeText(text).then(() => {
    showToast('Details copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy', 'warning');
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
