// =============================================================================
// PIXEL LINEAGE - LOCAL LAPTOP DATABASE BACKGROUND SERVICE
// File: server/local_db.js
// Storage Path: data/store_database.json (Tersimpan fisik di hard disk laptop Boss)
// Log Path    : logs/storage_service.log
// Dual Notification: Windows Desktop Toast & Discord Webhook
// =============================================================================

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const LOGS_DIR = path.join(ROOT_DIR, 'logs');
const DB_FILE = path.join(DATA_DIR, 'store_database.json');
const LOG_FILE = path.join(LOGS_DIR, 'storage_service.log');
const PORT = process.env.PORT || 8080;

const CLOUD_STATE_ID = 'ff808181a09d98f701a14ab3f8790390';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${CLOUD_STATE_ID}`;
const DEFAULT_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1561012342219612292/Iy_s75ZqqsDCvbxrK_jBhBhENqQUGGKRNx2uZiVvc_CI74NCgGwV_XgUXGV5fRPTG8in';

// Ensure data and logs folders exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function writeLog(msg) {
  const time = new Date().toLocaleString('id-ID');
  const line = `[${time}] ${msg}\n`;
  console.log(msg);
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf-8');
  } catch {}
}

// Windows Desktop Toast Notification Helper
function sendWindowsToast(title, message) {
  try {
    const psScript = path.join(__dirname, 'notify_windows.ps1');
    const child = spawn('powershell.exe', [
      '-ExecutionPolicy', 'Bypass',
      '-NoProfile',
      '-File', psScript,
      '-Title', title,
      '-Message', message
    ], { detached: true, stdio: 'ignore' });
    child.unref();
  } catch (err) {
    writeLog(`[NOTIFICATION ERROR] Gagal mengirim toast: ${err.message}`);
  }
}

// Discord Webhook Notification Helper
async function sendDiscordAlert(title, description, fields = []) {
  try {
    const webhookUrl = (localDbState.settings && localDbState.settings.discordWebhookUrl) 
      ? localDbState.settings.discordWebhookUrl 
      : DEFAULT_DISCORD_WEBHOOK;

    if (!webhookUrl) return;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Wiseman Shop Bot',
        avatar_url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f9d9.png',
        embeds: [{
          title,
          description,
          fields,
          color: 0xff7a18,
          timestamp: new Date().toISOString()
        }]
      })
    }).catch(() => {});
  } catch {
    // Silent catch
  }
}

// Default initial state if file doesn't exist yet
const DEFAULT_STATE = {
  version: '3.0.0',
  updatedAt: new Date().toISOString(),
  storeStatus: { isOpen: true, name: 'PanzerFaust Store' },
  orders: [],
  chats: {},
  reviews: [
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
    }
  ]
};

// In-memory cache synced with disk
let localDbState = { ...DEFAULT_STATE };

function loadStateFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      localDbState = {
        ...DEFAULT_STATE,
        ...parsed,
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        chats: parsed.chats && typeof parsed.chats === 'object' ? parsed.chats : {},
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : []
      };
      writeLog(`[DISK] Database berhasil dimuat dari: ${DB_FILE}`);
    } else {
      saveStateToDisk();
      writeLog(`[DISK] Database baru dibuat di: ${DB_FILE}`);
    }
  } catch (err) {
    writeLog(`[DISK ERROR] Gagal membaca ${DB_FILE}: ${err.message}`);
  }
}

function saveStateToDisk() {
  try {
    localDbState.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(localDbState, null, 2), 'utf-8');
    return true;
  } catch (err) {
    writeLog(`[DISK ERROR] Gagal menulis ke ${DB_FILE}: ${err.message}`);
    return false;
  }
}

loadStateFromDisk();

// Watch file on disk for external edits (e.g. Boss editing in Notepad / VS Code)
let fsTimeout = null;
fs.watch(DB_FILE, (eventType) => {
  if (eventType === 'change') {
    if (!fsTimeout) {
      fsTimeout = setTimeout(() => {
        fsTimeout = null;
        writeLog('[DISK WATCH] Perubahan terdeteksi pada file lokal, menyinkronkan memori...');
        loadStateFromDisk();
        pushToCloudRelay();
        broadcastWebSocket({ type: 'database_reloaded', data: localDbState });
      }, 300);
    }
  }
});

// Setup HTTP Server
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'online',
      server: 'Pixel Lineage Local Laptop Database Background Service',
      filePath: DB_FILE,
      logPath: LOG_FILE,
      ordersCount: localDbState.orders.length,
      chatsTicketsCount: Object.keys(localDbState.chats).length,
      time: new Date().toISOString()
    }));
  }

  // GET State
  if (url.pathname === '/api/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(localDbState));
  }

  // POST Action (Orders, Status Updates, Chats)
  if (url.pathname === '/api/action' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const { action, payload } = parsed;
        let modified = false;

        if (action === 'create_order' && payload) {
          const exists = localDbState.orders.some(o => o.id === payload.id);
          if (!exists) {
            localDbState.orders.unshift(payload);
            modified = true;
            writeLog(`[PESANAN BARU MASUK KE LAPTOP]: #${payload.id} dari ${payload.customerId} (IGN: ${payload.ign})`);
            
            // DUAL NOTIFICATION: Windows Toast + Discord
            sendWindowsToast('⚔️ Pesanan Baru Masuk!', `Pesanan #${payload.id} dari ${payload.customerId} (IGN: ${payload.ign})`);
            sendDiscordAlert(`⚔️ Pesanan Baru Masuk #${payload.id}`, `Pesanan baru telah tersimpan di laptop Boss.`, [
              { name: 'Customer', value: payload.customerId || 'Customer', inline: true },
              { name: 'IGN', value: payload.ign || 'N/A', inline: true },
              { name: 'Total', value: payload.paymentMethod === 'gold' ? `${payload.totalGold} Gold` : `Barter: ${payload.barterOffer}`, inline: true }
            ]);
          }
        } else if (action === 'complete_order' && payload) {
          const target = localDbState.orders.find(o => o.id === payload.orderId);
          if (target) {
            target.status = 'Completed';
            target.completedAt = new Date().toLocaleString('id-ID');
            modified = true;
            writeLog(`[PESANAN SELESAI DI LAPTOP]: #${payload.orderId}`);

            // DUAL NOTIFICATION
            sendWindowsToast('✅ Pesanan Selesai!', `Pesanan #${payload.orderId} telah selesai di-trade. Saldo toko bertambah.`);
          }
        } else if (action === 'update_status' && payload) {
          const target = localDbState.orders.find(o => o.id === payload.orderId);
          if (target) {
            target.status = payload.status;
            modified = true;
            writeLog(`[STATUS DIUBAH DI LAPTOP]: #${payload.orderId} -> ${payload.status}`);
          }
        } else if (action === 'send_chat' && payload) {
          const { orderId, message } = payload;
          if (!localDbState.chats[orderId]) localDbState.chats[orderId] = [];
          const exists = localDbState.chats[orderId].some(m => m.id === message.id);
          if (!exists) {
            localDbState.chats[orderId].push(message);
            modified = true;
            writeLog(`[CHAT BARU MASUK KE LAPTOP]: Tiket #${orderId} - ${message.sender}: "${message.text}"`);

            if (message.sender !== 'Boss' && !message.isSystem) {
              sendWindowsToast(`💬 Chat dari ${message.sender}`, `[Tiket #${orderId}]: "${message.text}"`);
              sendDiscordAlert(`💬 Pesan Baru dari ${message.sender}`, `"${message.text}"`, [
                { name: 'Tiket/Pesanan', value: `#${orderId}`, inline: true }
              ]);
            }
          }
        } else if (action === 'create_review' && payload) {
          const exists = localDbState.reviews.some(r => r.id === payload.id);
          if (!exists) {
            localDbState.reviews.unshift(payload);
            modified = true;
            writeLog(`[ULASAN BARU MASUK KE LAPTOP]: ${payload.rating} Bintang dari ${payload.customerId}`);
            sendWindowsToast('⭐ Ulasan Pembeli Baru!', `${payload.rating} Bintang dari ${payload.customerId} untuk item ${payload.itemName}`);
          }
        }

        if (modified) {
          saveStateToDisk();
          pushToCloudRelay();
          broadcastWebSocket({ type: 'state_updated', action, payload, state: localDbState });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, state: localDbState }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// Single instance port collision protection
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    writeLog(`[INFO] Port ${PORT} sudah digunakan oleh service yang berjalan. Service background sudah aktif.`);
    process.exit(0);
  } else {
    writeLog(`[ERROR SERVER] ${err.message}`);
  }
});

// Setup WebSocket Server for Real-Time 0-Latency Push
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'init_state', state: localDbState }));

  ws.on('message', (messageRaw) => {
    try {
      const msg = JSON.parse(messageRaw);
      if (msg.action) {
        writeLog(`[WS ACTION DARI CLIENT]: ${msg.action}`);
      }
    } catch {
      // Ignored
    }
  });
});

function broadcastWebSocket(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(payload);
    }
  });
}

// Sync with Cloud Relay every 3 seconds to catch orders placed when Boss was offline
async function syncFromCloudRelay() {
  try {
    const res = await fetch(CLOUD_API_URL).catch(() => null);
    if (!res || !res.ok) return;
    const json = await res.json().catch(() => null);
    const remote = (json && json.data) ? json.data : null;
    if (!remote) return;

    let changed = false;

    // 1. Sync Orders
    if (Array.isArray(remote.orders)) {
      remote.orders.forEach(ro => {
        const local = localDbState.orders.find(o => o.id === ro.id);
        if (!local) {
          localDbState.orders.unshift(ro);
          changed = true;
          writeLog(`[SINKRONISASI AWAN KE LAPTOP]: Pesanan #${ro.id} berhasil diunduh dan disimpan ke hard disk laptop!`);

          // DUAL NOTIFICATION
          sendWindowsToast('⚔️ Pesanan Baru Masuk!', `Pesanan #${ro.id} dari ${ro.customerId} (IGN: ${ro.ign})`);
          sendDiscordAlert(`⚔️ Pesanan Baru Masuk #${ro.id}`, `Pesanan baru disinkronkan ke laptop Boss.`, [
            { name: 'Customer', value: ro.customerId || 'Customer', inline: true },
            { name: 'IGN', value: ro.ign || 'N/A', inline: true },
            { name: 'Total', value: ro.paymentMethod === 'gold' ? `${ro.totalGold} Gold` : `Barter: ${ro.barterOffer}`, inline: true }
          ]);
        } else if (local.status !== ro.status) {
          local.status = ro.status;
          changed = true;
        }
      });
    }

    // 2. Sync Chats
    if (remote.chats && typeof remote.chats === 'object') {
      Object.keys(remote.chats).forEach(tId => {
        if (!localDbState.chats[tId]) localDbState.chats[tId] = [];
        const localList = localDbState.chats[tId];
        const localIds = new Set(localList.map(m => m.id));
        (remote.chats[tId] || []).forEach(rm => {
          if (!localIds.has(rm.id)) {
            localList.push(rm);
            localIds.add(rm.id);
            changed = true;

            if (rm.sender !== 'Boss' && !rm.isSystem) {
              sendWindowsToast(`💬 Chat dari ${rm.sender}`, `[Tiket #${tId}]: "${rm.text}"`);
              sendDiscordAlert(`💬 Pesan Baru dari ${rm.sender}`, `"${rm.text}"`, [
                { name: 'Tiket/Pesanan', value: `#${tId}`, inline: true }
              ]);
            }
          }
        });
      });
    }

    // 3. Sync Reviews
    if (Array.isArray(remote.reviews)) {
      remote.reviews.forEach(rr => {
        if (!localDbState.reviews.some(r => r.id === rr.id)) {
          localDbState.reviews.unshift(rr);
          changed = true;
          sendWindowsToast('⭐ Ulasan Pembeli Baru!', `${rr.rating} Bintang dari ${rr.customerId}`);
        }
      });
    }

    if (changed) {
      saveStateToDisk();
      broadcastWebSocket({ type: 'cloud_sync_update', state: localDbState });
    }
  } catch {
    // Silent catch
  }
}

async function pushToCloudRelay() {
  try {
    await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'wiseman_shop_state',
        data: {
          orders: localDbState.orders,
          chats: localDbState.chats,
          reviews: localDbState.reviews
        }
      })
    }).catch(() => {});
  } catch {
    // Silent catch
  }
}

// Start Server
server.listen(PORT, () => {
  writeLog('=============================================================================');
  writeLog('⚔️  PIXEL LINEAGE - LOCAL LAPTOP DATABASE BACKGROUND SERVICE AKTIF ⚔️');
  writeLog('=============================================================================');
  writeLog(`Lokasi Penyimpanan Fisik : ${DB_FILE}`);
  writeLog(`Lokasi File Log Aktivitas: ${LOG_FILE}`);
  writeLog(`HTTP Local Endpoint      : http://localhost:${PORT}/api/state`);
  writeLog(`WebSocket Endpoint       : ws://localhost:${PORT}/ws`);
  writeLog(`Sistem Notifikasi Ganda  : Windows Desktop Toast + Discord Webhook Alert`);
  writeLog('=============================================================================');
  writeLog('Service siap di background. Menunggu pesanan atau pesan chat baru dari pembeli...');

  // Start polling sync loop
  setInterval(syncFromCloudRelay, 3000);
  setTimeout(syncFromCloudRelay, 500);
});
