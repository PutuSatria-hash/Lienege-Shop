// Dedicated Admin Dashboard - Tokoku Merchant System
// Theme: Pixel Lineage Dark Glassmorphism Tokoku
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';
import { openChat } from './LiveChatModal.js';

let isAuthenticated = false;
let activeTokokuTab = 'beranda'; // 'beranda' | 'pesanan' | 'buat-dagangan' | 'daganganku' | 'ulasan' | 'admins' | 'pengaturan'
let activeOrderFilter = 'all'; // 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'
let activeDaganganFilter = 'all'; // 'all' | 'stok-habis' | 'belum-terjual' | 'grosir' | 'delivery'
let daganganSearchQuery = '';
let daganganCategoryFilter = 'all';

export function initAdminModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'admin-modal';

  modal.innerHTML = `
    <div class="modal-content mobile-sheet tokoku-container" id="admin-tokoku-shell">
      <div id="admin-modal-body" style="height: 100%; display: flex; flex-direction: column;">
        <!-- PIN Gate or Full Tokoku Merchant Dashboard -->
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAdmin();
  });

  // Reactive updates when orders, chats, or reviews change
  window.addEventListener('pl_orders_updated', () => {
    if (modal.classList.contains('open') && isAuthenticated) {
      sound.playFanfare();
      renderAdminContent();
    }
  });

  window.addEventListener('pl_chat_updated', (e) => {
    if (e.detail && e.detail.message && e.detail.message.sender !== 'Boss' && !e.detail.message.isSystem) {
      if (modal.classList.contains('open') && isAuthenticated) {
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

  const currentAdmin = storage.getCurrentAdmin();
  if (currentAdmin) {
    isAuthenticated = true;
  }

  // 1. Multi-Admin Account Login Gate if not authenticated
  if (!isAuthenticated) {
    body.innerHTML = `
      <div class="tokoku-login-wrap">
        <div class="tokoku-login-card">
          <div class="tokoku-brand" style="justify-content: center; margin-bottom: 14px;">
            <span class="font-pixel" style="color: #ffd166; font-size: 16px;">itemku</span>
            <span class="tokoku-pill-badge font-silkscreen">tokoku</span>
          </div>
          <h4 class="font-pixel" style="font-size: 11px; color: var(--accent-orange); margin-bottom: 6px; text-align: center;">
            PANZERFAUST STORE ACCESS
          </h4>
          <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; text-align: center;">
            Masuk dengan kredensial administrator toko Anda untuk mengelola dagangan dan pesanan.
          </p>

          <form id="form-admin-login" style="display: flex; flex-direction: column; gap: 14px; text-align: left;">
            <div>
              <label class="form-label font-silkscreen">Username Admin</label>
              <input 
                type="text" 
                id="admin-user-input" 
                class="pixel-input" 
                placeholder="e.g. boss atau admin" 
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
                placeholder="Masukkan kata sandi" 
                required
                autocomplete="current-password"
              />
            </div>

            <div style="font-size: 10px; color: var(--text-dim); background: rgba(0,0,0,0.3); padding: 8px 10px; border: 1px dashed rgba(255,255,255,0.1);" class="font-silkscreen">
              Default Master: <span style="color: var(--accent-gold);">boss / lineage2026</span> atau <span style="color: var(--accent-gold);">admin / wiseman2026</span>
            </div>

            <button type="submit" class="pixel-btn gold" id="btn-submit-login" style="padding: 12px 18px; margin-top: 4px;">
              MASUK KE TOKOKU ➔
            </button>
          </form>
        </div>
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
        showToast(`Selamat datang, ${admin.name}!`, 'success');
        renderAdminContent();
      } else {
        sound.playRemove();
        showToast('Username atau Password salah!', 'warning');
        passInput.value = '';
        passInput.focus();
      }
    });

    setTimeout(() => userInput.focus(), 150);
    return;
  }

  // 2. Full Authenticated Tokoku Dashboard
  const stats = storage.getStoreStats();
  const isStoreOpen = storage.getStoreStatus();
  const orders = storage.getOrders();
  const items = storage.getItems();
  const categories = storage.getCategories();
  const adminAccounts = storage.getAdminAccounts();
  const adminName = currentAdmin ? currentAdmin.name : 'Boss Satria';

  body.innerHTML = `
    <!-- Tokoku Top Header Bar -->
    <header class="tokoku-topbar">
      <div class="tokoku-topbar-left">
        <div class="tokoku-brand">
          <span class="font-pixel" style="color: #ffd166; font-size: 15px;">itemku</span>
          <span class="tokoku-pill-badge font-silkscreen">tokoku</span>
        </div>
        <span class="tokoku-topbar-tag font-silkscreen">Pixel Lineage Official Merchant</span>
      </div>

      <div class="tokoku-topbar-right">
        <button class="tokoku-btn-shop font-silkscreen" id="btn-tokoku-visit-shop" title="Kembali ke Katalog Belanja">
          Belanja di itemku ↗
        </button>

        <div class="tokoku-user-badge">
          <div class="tokoku-user-avatar">🧙‍♂️</div>
          <div class="tokoku-user-info">
            <span class="tokoku-user-store">PanzerFaust Store</span>
            <span class="tokoku-user-name">${adminName}</span>
          </div>
        </div>

        <button class="tokoku-btn-logout font-silkscreen" id="btn-admin-logout" title="Keluar dari Tokoku">
          Keluar ✕
        </button>
      </div>
    </header>

    <!-- Tokoku Main Layout (Sidebar + Content Panel) -->
    <div class="tokoku-main-layout">
      <!-- Left Sidebar -->
      <aside class="tokoku-sidebar">
        <!-- Store Profile Card -->
        <div class="tokoku-store-card">
          <div class="tokoku-store-header">
            <div class="tokoku-store-avatar">🧙</div>
            <div class="tokoku-store-meta">
              <strong class="tokoku-store-title">PanzerFaust Store</strong>
              <button class="tokoku-status-toggle ${isStoreOpen ? 'open' : 'closed'}" id="btn-store-status-toggle" title="Klik untuk ubah status Toko">
                <span class="status-dot"></span>
                <span>${isStoreOpen ? 'Toko Buka' : 'Toko Tutup'}</span>
              </button>
            </div>
          </div>

          <div class="tokoku-store-scores font-silkscreen">
            <div class="score-row">
              <span class="score-label">Poin Toko</span>
              <span class="score-val" style="color: var(--accent-gold);">${stats.poinToko}</span>
            </div>
            <div class="score-row">
              <span class="score-label">Rating Toko</span>
              <span class="score-val" style="color: #ffb703;">★ ${stats.ratingToko}/5.0</span>
            </div>
          </div>
        </div>

        <!-- Navigation Menus -->
        <nav class="tokoku-nav">
          <div class="tokoku-nav-group">
            <div class="tokoku-nav-group-title">Tokoku</div>
            <button class="tokoku-nav-item ${activeTokokuTab === 'beranda' ? 'active' : ''}" data-tab="beranda">
              <span class="nav-icon">🏠</span>
              <span>Beranda</span>
            </button>
            <button class="tokoku-nav-item ${activeTokokuTab === 'profil' ? 'active' : ''}" data-tab="profil">
              <span class="nav-icon">👤</span>
              <span>Profil Toko</span>
            </button>
          </div>

          <div class="tokoku-nav-group">
            <div class="tokoku-nav-group-title">Pesanan</div>
            <button class="tokoku-nav-item ${activeTokokuTab === 'pesanan' ? 'active' : ''}" data-tab="pesanan">
              <span class="nav-icon">📦</span>
              <span>Riwayat Pesanan</span>
              ${stats.perluDiproses > 0 ? `<span class="nav-badge-count">${stats.perluDiproses}</span>` : ''}
            </button>
            <button class="tokoku-nav-item ${activeTokokuTab === 'ulasan' ? 'active' : ''}" data-tab="ulasan">
              <span class="nav-icon">⭐</span>
              <span>Ulasan Pembeli</span>
            </button>
          </div>

          <div class="tokoku-nav-group">
            <div class="tokoku-nav-group-title">Dagangan</div>
            <button class="tokoku-nav-item ${activeTokokuTab === 'buat-dagangan' ? 'active' : ''}" data-tab="buat-dagangan">
              <span class="nav-icon">➕</span>
              <span>Buat Dagangan</span>
            </button>
            <button class="tokoku-nav-item ${activeTokokuTab === 'daganganku' ? 'active' : ''}" data-tab="daganganku">
              <span class="nav-icon">🛍️</span>
              <span>Daganganku</span>
            </button>
            <button class="tokoku-nav-item ${activeTokokuTab === 'pengiriman-otomatis' ? 'active' : ''}" data-tab="pengiriman-otomatis">
              <span class="nav-icon">⚡</span>
              <span>Pengiriman Otomatis</span>
            </button>
          </div>

          <div class="tokoku-nav-group">
            <div class="tokoku-nav-group-title">Penghargaan & Promosi</div>
            <button class="tokoku-nav-item ${activeTokokuTab === 'pencapaian' ? 'active' : ''}" data-tab="pencapaian">
              <span class="nav-icon">🏆</span>
              <span>Pencapaian Toko</span>
            </button>
            <button class="tokoku-nav-item ${activeTokokuTab === 'iklan' ? 'active' : ''}" data-tab="iklan">
              <span class="nav-icon">📢</span>
              <span>Iklan Tokoku</span>
            </button>
          </div>

          <div class="tokoku-nav-group">
            <div class="tokoku-nav-group-title">Fitur Toko</div>
            <button class="tokoku-nav-item ${activeTokokuTab === 'admins' ? 'active' : ''}" data-tab="admins">
              <span class="nav-icon">🛡️</span>
              <span>Kelola Admin</span>
            </button>
            <button class="tokoku-nav-item ${activeTokokuTab === 'pengaturan' ? 'active' : ''}" data-tab="pengaturan">
              <span class="nav-icon">⚙️</span>
              <span>Pengaturan Toko</span>
            </button>
          </div>
        </nav>
      </aside>

      <!-- Right Main Content Panel -->
      <main class="tokoku-content" id="tokoku-content-area">
        <!-- Rendered View will mount here -->
      </main>
    </div>
  `;

  // Attach Topbar and Sidebar Global Event Handlers
  const btnVisitShop = body.querySelector('#btn-tokoku-visit-shop');
  if (btnVisitShop) {
    btnVisitShop.addEventListener('click', () => {
      sound.playClick();
      closeAdmin();
    });
  }

  const btnLogout = body.querySelector('#btn-admin-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sound.playClick();
      storage.logoutAdmin();
      isAuthenticated = false;
      showToast('Berhasil keluar dari Tokoku.', 'info');
      renderAdminContent();
    });
  }

  const btnToggleStatus = body.querySelector('#btn-store-status-toggle');
  if (btnToggleStatus) {
    btnToggleStatus.addEventListener('click', () => {
      sound.playClick();
      const updated = storage.toggleStoreStatus();
      showToast(updated ? 'Toko sekarang dibuka!' : 'Toko sekarang ditutup.', updated ? 'success' : 'info');
      renderAdminContent();
    });
  }

  // Sidebar Tab click handlers
  body.querySelectorAll('.tokoku-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        sound.playClick();
        activeTokokuTab = tab;
        renderAdminContent();
      }
    });
  });

  // Render the Active View
  renderTokokuView(stats, orders, items, categories, adminAccounts);
}

// Sub-view rendering engine
function renderTokokuView(stats, orders, items, categories, adminAccounts) {
  const content = document.getElementById('tokoku-content-area');
  if (!content) return;

  // VIEW 1: BERANDA (Matching Photos 4 & 5)
  if (activeTokokuTab === 'beranda') {
    content.innerHTML = `
      <div class="tokoku-beranda-grid">
        <!-- Left Column: Aktifitas Penting, Keuangan, Performa -->
        <div class="tokoku-beranda-left">
          <!-- Aktifitas Penting -->
          <section class="tokoku-section">
            <h3 class="tokoku-section-title">Aktifitas Penting</h3>
            <p class="tokoku-section-subtitle">
              Hal-hal yang penting untuk kamu cek terkait tokomu. Data diambil dari 7 hari terakhir.
            </p>

            <div class="tokoku-activity-cards">
              <div class="activity-card" id="card-act-perlu-proses" style="cursor: pointer;">
                <div class="act-title">Perlu Diproses</div>
                <div class="act-val-row">
                  <span class="act-icon">📦</span>
                  <span class="act-count">${stats.perluDiproses}</span>
                </div>
              </div>

              <div class="activity-card" id="card-act-menunggu-konfirmasi" style="cursor: pointer;">
                <div class="act-title">Menunggu Konfirmasi</div>
                <div class="act-val-row">
                  <span class="act-icon">⏳</span>
                  <span class="act-count">${stats.menungguKonfirmasi}</span>
                </div>
              </div>

              <div class="activity-card">
                <div class="act-title">Kendala Pesanan</div>
                <div class="act-val-row">
                  <span class="act-icon">⚠️</span>
                  <span class="act-count">${stats.kendalaPesanan}</span>
                </div>
              </div>

              <div class="activity-card">
                <div class="act-title">Sedang Dibatalkan</div>
                <div class="act-val-row">
                  <span class="act-icon">🚫</span>
                  <span class="act-count">${stats.sedangDibatalkan}</span>
                </div>
              </div>

              <div class="activity-card" id="card-act-stok-habis" style="cursor: pointer;">
                <div class="act-title">Stok Habis</div>
                <div class="act-val-row">
                  <span class="act-icon">📦</span>
                  <span class="act-count">${stats.stokHabis}</span>
                </div>
              </div>

              <div class="activity-card" id="card-act-pesanan-selesai" style="cursor: pointer;">
                <div class="act-title">Pesanan Selesai</div>
                <div class="act-val-row">
                  <span class="act-icon">🏆</span>
                  <span class="act-count">${stats.pesananSelesai}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Keuangan Toko -->
          <section class="tokoku-section">
            <h3 class="tokoku-section-title">Keuangan Toko</h3>
            <div class="tokoku-finance-row">
              <div class="finance-card">
                <span class="finance-label">Transaksi Berjalan</span>
                <span class="finance-amount">Rp ${stats.transaksiBerjalan.toLocaleString('id-ID')}</span>
              </div>
              <div class="finance-card">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <span class="finance-label">Saldo Toko</span>
                  <a href="javascript:void(0)" class="finance-link" id="link-finance-detail">Lihat Detail</a>
                </div>
                <span class="finance-amount gold">Rp ${stats.saldoGold.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </section>

          <!-- Performa Toko -->
          <section class="tokoku-section">
            <h3 class="tokoku-section-title">Performa Toko</h3>
            
            <div class="tokoku-perf-block">
              <div class="perf-header">
                <strong>Statistik Toko</strong>
                <span class="text-muted">Data dari 30 hari terakhir</span>
              </div>
              <div class="perf-stats-row">
                <div class="stat-item">
                  <span class="stat-name">Jumlah Pembeli</span>
                  <div class="stat-val-wrap">
                    <span class="stat-icon">👥</span>
                    <strong class="stat-val">${stats.totalPembeli}</strong>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="stat-name">Pesanan Selesai</span>
                  <div class="stat-val-wrap">
                    <span class="stat-icon">📦</span>
                    <strong class="stat-val">${stats.pesananSelesai}</strong>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="stat-name">Pesanan dibatalkan</span>
                  <div class="stat-val-wrap">
                    <span class="stat-icon">🔄</span>
                    <strong class="stat-val">${stats.sedangDibatalkan}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pendapatan Chart Area -->
            <div class="tokoku-perf-block" style="margin-top: 14px;">
              <div class="perf-header" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>Pendapatan</strong>
                  <span class="text-muted" style="margin-left: 8px;">Data dari 7 hari terakhir</span>
                </div>
                <a href="javascript:void(0)" class="finance-link font-silkscreen" style="font-size: 10px;">Lihat Selengkapnya</a>
              </div>

              <!-- SVG Interactive Line/Area Chart -->
              <div class="tokoku-chart-container">
                <svg viewBox="0 0 540 160" class="tokoku-svg-chart">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#ffd166" stop-opacity="0.35"/>
                      <stop offset="100%" stop-color="#ff7a18" stop-opacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <!-- Horizontal grid lines -->
                  <line x1="40" y1="20" x2="520" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
                  <line x1="40" y1="60" x2="520" y2="60" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
                  <line x1="40" y1="100" x2="520" y2="100" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
                  <line x1="40" y1="140" x2="520" y2="140" stroke="rgba(255,255,255,0.12)" />

                  <!-- Y-Axis Labels -->
                  <text x="10" y="24" fill="#64748b" font-size="9" font-family="'Silkscreen', monospace">500k</text>
                  <text x="10" y="64" fill="#64748b" font-size="9" font-family="'Silkscreen', monospace">250k</text>
                  <text x="10" y="104" fill="#64748b" font-size="9" font-family="'Silkscreen', monospace">100k</text>
                  <text x="25" y="144" fill="#64748b" font-size="9" font-family="'Silkscreen', monospace">0</text>

                  <!-- Chart Area Fill -->
                  <polygon points="60,140 130,120 200,95 270,110 340,65 410,75 480,45 480,140 60,140" fill="url(#chartGradient)"/>
                  <!-- Glowing Stroke Line -->
                  <polyline points="60,140 130,120 200,95 270,110 340,65 410,75 480,45" fill="none" stroke="#ffd166" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  
                  <!-- Data Dots -->
                  <circle cx="60" cy="140" r="3.5" fill="#ffd166" />
                  <circle cx="130" cy="120" r="3.5" fill="#ffd166" />
                  <circle cx="200" cy="95" r="3.5" fill="#ffd166" />
                  <circle cx="270" cy="110" r="3.5" fill="#ffd166" />
                  <circle cx="340" cy="65" r="3.5" fill="#ffd166" />
                  <circle cx="410" cy="75" r="3.5" fill="#ffd166" />
                  <circle cx="480" cy="45" r="4.5" fill="#ff7a18" stroke="#ffd166" stroke-width="1.5"/>

                  <!-- X-Axis Labels -->
                  <text x="50" y="156" fill="#94a3b8" font-size="9" font-family="'Silkscreen', monospace">Sen</text>
                  <text x="120" y="156" fill="#94a3b8" font-size="9" font-family="'Silkscreen', monospace">Sel</text>
                  <text x="190" y="156" fill="#94a3b8" font-size="9" font-family="'Silkscreen', monospace">Rab</text>
                  <text x="260" y="156" fill="#94a3b8" font-size="9" font-family="'Silkscreen', monospace">Kam</text>
                  <text x="330" y="156" fill="#94a3b8" font-size="9" font-family="'Silkscreen', monospace">Jum</text>
                  <text x="400" y="156" fill="#94a3b8" font-size="9" font-family="'Silkscreen', monospace">Sab</text>
                  <text x="470" y="156" fill="#ffd166" font-size="9" font-family="'Silkscreen', monospace">Min</text>
                </svg>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column: Informasi Fitur Penjual & Pengumuman -->
        <div class="tokoku-beranda-right">
          <!-- Informasi Fitur Penjual -->
          <div class="tokoku-side-box">
            <div class="side-box-header">
              <span class="box-icon">🏪</span>
              <strong>Informasi Fitur Penjual</strong>
            </div>

            <div class="side-feature-card">
              <div class="feature-title-row">
                <span class="badge-feature">⚡ 10 MENIT KIRIM</span>
              </div>
              <div class="feature-progress-text">1 dari 3 syarat aktivasi terpenuhi</div>
              <div class="feature-progress-bar">
                <div class="bar-fill" style="width: 33.3%;"></div>
              </div>
              <p class="feature-desc">Tingkatkan terus penjualanmu agar bisa memenuhi syarat aktivasi 10 Menit Kirim.</p>
              <a href="javascript:void(0)" class="finance-link">Lihat Detail</a>
            </div>

            <div class="side-feature-card">
              <div class="feature-title-row">
                <span class="badge-feature green">🚀 PENGIRIMAN INSTAN</span>
              </div>
              <div class="feature-progress-text">0 dari 3 syarat aktivasi terpenuhi</div>
              <div class="feature-progress-bar">
                <div class="bar-fill" style="width: 0%;"></div>
              </div>
              <p class="feature-desc">Tingkatkan terus penjualanmu agar bisa memenuhi syarat aktivasi Pengiriman Instan.</p>
              <a href="javascript:void(0)" class="finance-link">Lihat Detail</a>
            </div>

            <div class="side-feature-card discord-card">
              <div class="discord-header">
                <span style="font-size: 16px;">💬</span>
                <strong>Hubungkan Discord ke Tokoku</strong>
              </div>
              <p class="feature-desc">Notifikasi pesanan baru dari pembeli masuk 90% lebih cepat kalau kamu hubungkan Discord ke Tokoku.</p>
              <button class="pixel-btn-tiny gold font-silkscreen" id="btn-beranda-test-discord" style="width: 100%; padding: 6px 10px; margin-top: 6px;">
                Aktifkan Notifikasi Discord
              </button>
            </div>
          </div>

          <!-- Pengumuman -->
          <div class="tokoku-side-box" style="margin-top: 16px;">
            <div class="side-box-header">
              <span class="box-icon">📢</span>
              <strong>Pengumuman</strong>
            </div>

            <div class="announcement-item">
              <a href="javascript:void(0)" class="ann-title">Informasi Mengenai Produk Kombo untuk Pengiriman Otomatis</a>
              <span class="ann-date">16 Oct 2026 13:14</span>
            </div>

            <div class="announcement-item">
              <a href="javascript:void(0)" class="ann-title">Yuk, Lengkapi NIB untuk Kelancaran Jualan di itemku!</a>
              <span class="ann-date">15 Oct 2026 17:58</span>
            </div>

            <div class="announcement-item">
              <a href="javascript:void(0)" class="ann-title">Update Serverless Cloud Relay Pixel Lineage Vercel</a>
              <span class="ann-date">18 Oct 2026 00:25</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Beranda quick actions
    const cardPerlu = content.querySelector('#card-act-perlu-proses');
    if (cardPerlu) {
      cardPerlu.addEventListener('click', () => {
        sound.playClick();
        activeTokokuTab = 'pesanan';
        activeOrderFilter = 'pending';
        renderAdminContent();
      });
    }

    const cardStok = content.querySelector('#card-act-stok-habis');
    if (cardStok) {
      cardStok.addEventListener('click', () => {
        sound.playClick();
        activeTokokuTab = 'daganganku';
        activeDaganganFilter = 'stok-habis';
        renderAdminContent();
      });
    }

    const cardSelesai = content.querySelector('#card-act-pesanan-selesai');
    if (cardSelesai) {
      cardSelesai.addEventListener('click', () => {
        sound.playClick();
        activeTokokuTab = 'pesanan';
        activeOrderFilter = 'completed';
        renderAdminContent();
      });
    }

    const btnDiscord = content.querySelector('#btn-beranda-test-discord');
    if (btnDiscord) {
      btnDiscord.addEventListener('click', async () => {
        const settings = storage.getSettings();
        if (!settings.discordWebhookUrl) {
          showToast('Webhook Discord belum diisi! Silakan ke Pengaturan Toko.', 'warning');
          activeTokokuTab = 'pengaturan';
          renderAdminContent();
          return;
        }
        showToast('Mengirim sinyal uji coba ke Discord...', 'info');
        try {
          const res = await fetch(settings.discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'Wiseman Shop Bot',
              embeds: [{
                title: '⚡ Uji Notifikasi Discord Tokoku',
                description: 'Koneksi Discord Tokoku Toko aktif! Setiap pesanan dan pesan pembeli akan terkirim langsung ke HP Boss.',
                color: 0xff7a18,
                timestamp: new Date().toISOString()
              }]
            })
          });
          if (res.ok) {
            sound.playFanfare();
            showToast('Uji coba berhasil diterima di Discord!', 'success');
          } else {
            showToast(`Gagal: status code ${res.status}`, 'warning');
          }
        } catch (err) {
          showToast('Koneksi Discord gagal: ' + err.message, 'warning');
        }
      });
    }

    return;
  }

  // VIEW 2: RIWAYAT PESANAN with PENYELESAIAN PESANAN (CORE FEATURE)
  if (activeTokokuTab === 'pesanan') {
    let filteredOrders = orders;
    if (activeOrderFilter === 'pending') {
      filteredOrders = orders.filter(o => !o.status || o.status === 'Pending Boss Review' || o.status === 'Pending' || o.status === 'Perlu Diproses');
    } else if (activeOrderFilter === 'in_progress') {
      filteredOrders = orders.filter(o => o.status === 'Accepted / In Progress' || o.status === 'Ready to Trade In-Game');
    } else if (activeOrderFilter === 'completed') {
      filteredOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Selesai');
    } else if (activeOrderFilter === 'cancelled') {
      filteredOrders = orders.filter(o => o.status === 'Cancelled');
    }

    content.innerHTML = `
      <div class="tokoku-orders-view">
        <div class="tokoku-view-header">
          <div>
            <h2 class="tokoku-view-title">Riwayat Pesanan</h2>
            <p class="tokoku-section-subtitle">Kelola transaksi masuk, selesaikan pesanan in-game, dan kirim konfirmasi ke pembeli.</p>
          </div>
          <button class="pixel-btn-tiny secondary font-silkscreen" id="btn-refresh-orders" style="padding: 6px 12px;">
            🔄 REFRESH CLOUD
          </button>
        </div>

        <!-- Filter Sub-Tabs -->
        <div class="tokoku-filter-tabs">
          <button class="tokoku-filter-tab ${activeOrderFilter === 'all' ? 'active' : ''}" data-filter="all">
            Semua (${orders.length})
          </button>
          <button class="tokoku-filter-tab ${activeOrderFilter === 'pending' ? 'active' : ''}" data-filter="pending">
            Perlu Diproses (${stats.perluDiproses})
          </button>
          <button class="tokoku-filter-tab ${activeOrderFilter === 'in_progress' ? 'active' : ''}" data-filter="in_progress">
            Menunggu Konfirmasi (${stats.menungguKonfirmasi})
          </button>
          <button class="tokoku-filter-tab ${activeOrderFilter === 'completed' ? 'active' : ''}" data-filter="completed">
            Selesai (${stats.pesananSelesai})
          </button>
          <button class="tokoku-filter-tab ${activeOrderFilter === 'cancelled' ? 'active' : ''}" data-filter="cancelled">
            Dibatalkan (${stats.sedangDibatalkan})
          </button>
        </div>

        <!-- Discord Ticket / Order ID Lookup Bar -->
        <div class="tokoku-lookup-box">
          <input 
            type="text" 
            id="tokoku-ticket-search" 
            class="pixel-input" 
            placeholder="Ketik atau tempel ID Pesanan / Tiket Discord (e.g. ORD-1792... atau INQUIRY-...)" 
            style="flex: 1;"
          />
          <button class="pixel-btn gold" id="btn-search-ticket-open" style="padding: 8px 16px; font-size: 8px;">
            BUKA TIKET CHAT 💬
          </button>
        </div>

        <!-- Orders Cards List -->
        <div class="tokoku-orders-list">
          ${filteredOrders.length === 0 ? `
            <div class="tokoku-empty-box">
              <span style="font-size: 32px; display: block; margin-bottom: 8px;">📭</span>
              <p class="font-silkscreen" style="font-size: 11px; color: var(--accent-gold);">
                Tidak ada pesanan dalam kategori "${activeOrderFilter}".
              </p>
              <p style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">
                Saat pembeli membuat pesanan baru, data akan otomatis tersinkronisasi di sini secara real-time.
              </p>
            </div>
          ` : filteredOrders.map(order => {
            const isCompleted = order.status === 'Completed' || order.status === 'Selesai';
            const isCancelled = order.status === 'Cancelled';
            const isPending = !order.status || order.status === 'Pending Boss Review' || order.status === 'Pending';

            return `
              <div class="tokoku-order-card ${isCompleted ? 'completed' : ''}">
                <div class="order-card-header">
                  <div class="order-id-group">
                    <span class="order-id-badge font-pixel">#${order.id}</span>
                    <span class="order-date">${order.createdAt || 'Hari ini'}</span>
                    <span class="order-ign font-silkscreen">IGN: <strong>${order.ign || 'N/A'}</strong></span>
                    <span class="order-customer font-silkscreen">ID: ${order.customerId || 'Customer'}</span>
                  </div>

                  <div class="order-status-badge ${isCompleted ? 'badge-completed' : isCancelled ? 'badge-cancelled' : 'badge-pending'} font-silkscreen">
                    ${isCompleted ? '✅ SELESAI' : isCancelled ? '❌ DIBATALKAN' : isPending ? '⏳ PERLU DIPROSES' : '⚙️ SEDANG DIPROSES'}
                  </div>
                </div>

                <div class="order-card-items">
                  <div class="order-items-list">
                    ${Array.isArray(order.items) ? order.items.map(it => `
                      <span class="order-item-tag">
                        <strong>${it.quantity}x</strong> ${it.name}
                      </span>
                    `).join('') : '<span class="order-item-tag">Item Pesanan</span>'}
                  </div>

                  <div class="order-total-block font-silkscreen">
                    Total: <strong style="color: var(--accent-gold);">
                      ${order.paymentMethod === 'gold' ? `${(order.totalGold || 0).toLocaleString('id-ID')} Gold` : `Barter: "${order.barterOffer}"`}
                    </strong>
                  </div>
                </div>

                <!-- Order Action Bar with PENYELESAIAN PESANAN -->
                <div class="order-card-actions">
                  ${!isCompleted && !isCancelled ? `
                    <button class="pixel-btn-action btn-complete-order" data-id="${order.id}" title="Klik untuk selesaikan pesanan dan kirim notifikasi ke pembeli">
                      ✅ Selesaikan Pesanan
                    </button>
                    <button class="pixel-btn-action secondary btn-process-order" data-id="${order.id}">
                      ⚙️ Proses Pesanan
                    </button>
                  ` : isCompleted ? `
                    <span class="font-silkscreen" style="font-size: 10px; color: #2ec4b6; padding: 6px 12px; background: rgba(46, 196, 182, 0.1); border: 1px solid rgba(46, 196, 182, 0.3);">
                      ✅ Pesanan Telah Diselesaikan (${order.completedAt || 'Selesai'})
                    </span>
                  ` : `
                    <span class="font-silkscreen" style="font-size: 10px; color: var(--accent-red); padding: 6px 12px; background: rgba(239, 71, 111, 0.1); border: 1px solid rgba(239, 71, 111, 0.3);">
                      ❌ Dibatalkan (${order.cancelReason || 'Dibatalkan oleh Admin'})
                    </span>
                  `}

                  <button class="pixel-btn-action chat font-silkscreen btn-open-customer-chat" data-id="${order.id}">
                    💬 Chat Pembeli
                  </button>

                  ${!isCompleted && !isCancelled ? `
                    <button class="pixel-btn-action danger btn-cancel-order" data-id="${order.id}">
                      ❌ Batalkan
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Order filter tab click listeners
    content.querySelectorAll('.tokoku-filter-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        sound.playClick();
        activeOrderFilter = tabBtn.getAttribute('data-filter') || 'all';
        renderAdminContent();
      });
    });

    // Refresh orders button
    const btnRefresh = content.querySelector('#btn-refresh-orders');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', async () => {
        sound.playClick();
        showToast('Menyinkronkan data dengan cloud...', 'info');
        await storage.syncWithCloud();
        renderAdminContent();
      });
    }

    // Ticket search / open
    const inputSearch = content.querySelector('#tokoku-ticket-search');
    const btnSearch = content.querySelector('#btn-search-ticket-open');
    const handleTicketOpen = () => {
      const val = inputSearch ? inputSearch.value.trim() : '';
      if (!val) {
        showToast('Ketik ID Pesanan atau Tiket terlebih dahulu!', 'warning');
        return;
      }
      sound.playClick();
      closeAdmin();
      openChat(val, true);
    };
    if (btnSearch) btnSearch.addEventListener('click', handleTicketOpen);
    if (inputSearch) {
      inputSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleTicketOpen();
      });
    }

    // 1. [✅ SELESAIKAN PESANAN] Event Handler
    content.querySelectorAll('.btn-complete-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        const targetOrder = orders.find(o => o.id === orderId);
        if (!targetOrder) return;

        if (confirm(`Konfirmasi: Apakah Anda yakin telah menyelesaikan transaksi in-game untuk Pesanan #${orderId} (IGN: ${targetOrder.ign})?`)) {
          sound.playFanfare();
          storage.completeOrder(orderId);
          showToast(`Pesanan #${orderId} berhasil diselesaikan! Notifikasi terkirim ke pembeli.`, 'success');
          renderAdminContent();
        }
      });
    });

    // 2. [⚙️ PROSES PESANAN] Event Handler
    content.querySelectorAll('.btn-process-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        sound.playClick();
        storage.updateOrderStatus(orderId, 'Accepted / In Progress');
        storage.sendChatMessage(orderId, 'SYSTEM', `[STATUS UPDATE]: Pesanan Anda sedang diproses oleh Boss di dalam game. Harap bersiap untuk trade.`, true);
        showToast(`Pesanan #${orderId} diubah ke status 'Accepted / In Progress'`, 'success');
        renderAdminContent();
      });
    });

    // 3. [💬 CHAT PEMBELI] Event Handler
    content.querySelectorAll('.btn-open-customer-chat').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        sound.playClick();
        closeAdmin();
        openChat(orderId, true);
      });
    });

    // 4. [❌ BATALKAN] Event Handler
    content.querySelectorAll('.btn-cancel-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        const reason = prompt('Masukkan alasan pembatalan pesanan (akan dikirim ke pembeli):', 'Stok habis / Penjual offline');
        if (reason) {
          sound.playRemove();
          storage.cancelOrder(orderId, reason);
          showToast(`Pesanan #${orderId} telah dibatalkan.`, 'warning');
          renderAdminContent();
        }
      });
    });

    return;
  }

  // VIEW 3: BUAT DAGANGAN (Matching Photos 1 & 2)
  if (activeTokokuTab === 'buat-dagangan') {
    content.innerHTML = `
      <div class="tokoku-buat-view">
        <div class="tokoku-view-header">
          <div>
            <h2 class="tokoku-view-title">Buat Dagangan</h2>
          </div>
          <a href="javascript:void(0)" class="finance-link" id="link-buat-banyak" style="font-size: 11px;">
            Buat banyak dagangan sekaligus
          </a>
        </div>

        <form id="form-tokoku-buat-dagangan" style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Section 1: Tipe Dagangan -->
          <div class="tokoku-form-card">
            <h4 class="form-card-title">Tipe Dagangan</h4>
            <p class="tokoku-section-subtitle">Produk bisa set untuk dijual di negara tertentu atau secara global.</p>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 14px;">
              <div>
                <select id="dagangan-game-select" class="pixel-input" style="cursor: pointer;">
                  <option value="Pixel Lineage (Roblox)">Pixel Lineage (Roblox)</option>
                  <option value="Roblox">Roblox General</option>
                  <option value="Lineage 2 M">Lineage 2 M</option>
                </select>
              </div>

              <div>
                <select id="dagangan-kategori-select" class="pixel-input" style="cursor: pointer;">
                  ${categories.map(c => `
                    <option value="${c.id}">${c.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Informasi Produk -->
          <div class="tokoku-form-card">
            <h4 class="form-card-title">Informasi Produk</h4>

            <div class="tokoku-info-banner">
              <span style="font-size: 14px;">ℹ️</span>
              <span>Informasi dan kategori produk tidak bisa diubah setelah produk disimpan.</span>
            </div>

            <div style="margin-top: 16px;">
              <label class="form-label font-silkscreen">Pilih Variasi Produk / Nama Produk</label>
              <input 
                type="text" 
                id="dagangan-item-name" 
                class="pixel-input" 
                placeholder="Masukkan nama item yang kamu jual" 
                required 
              />
              <span class="text-muted" style="font-size: 10px; display: block; margin-top: 4px;">
                Pilih nama item yang sudah disediakan, agar daganganmu dapat masuk ke dalam katalog itemku.
              </span>
            </div>

            <!-- 3 Image Upload Slots -->
            <div style="margin-top: 18px;">
              <label class="form-label font-silkscreen">Gambar Produk</label>
              <div class="tokoku-image-slots-row">
                <!-- Slot 1: Gambar Utama -->
                <div class="tokoku-upload-slot" id="slot-img-1" data-slot="1">
                  <input type="file" id="file-slot-1" accept="image/*" style="display: none;" />
                  <div class="slot-placeholder" id="placeholder-slot-1">
                    <span class="slot-plus">+</span>
                    <span class="slot-text">Gambar Utama</span>
                  </div>
                  <img id="preview-slot-1" class="slot-preview hidden" />
                </div>

                <!-- Slot 2: Gambar 2 -->
                <div class="tokoku-upload-slot" id="slot-img-2" data-slot="2">
                  <input type="file" id="file-slot-2" accept="image/*" style="display: none;" />
                  <div class="slot-placeholder" id="placeholder-slot-2">
                    <span class="slot-plus">+</span>
                    <span class="slot-text">Gambar 2</span>
                  </div>
                  <img id="preview-slot-2" class="slot-preview hidden" />
                </div>

                <!-- Slot 3: Gambar 3 -->
                <div class="tokoku-upload-slot" id="slot-img-3" data-slot="3">
                  <input type="file" id="file-slot-3" accept="image/*" style="display: none;" />
                  <div class="slot-placeholder" id="placeholder-slot-3">
                    <span class="slot-plus">+</span>
                    <span class="slot-text">Gambar 3</span>
                  </div>
                  <img id="preview-slot-3" class="slot-preview hidden" />
                </div>
              </div>
              <p class="text-muted" style="font-size: 10px; margin-top: 8px;">
                Pastikan ukuran gambar maksimal 2MB dan berformat JPG / PNG / GIF. Dimensi yang direkomendasikan adalah 600x300 pixels.
              </p>
            </div>

            <!-- Deskripsi Produk with Character Counter -->
            <div style="margin-top: 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="form-label font-silkscreen" style="margin-bottom: 0;">Deskripsi Produk</label>
                <span class="font-silkscreen" style="font-size: 10px; color: var(--text-dim);">
                  <strong id="desc-char-count" style="color: var(--accent-gold);">0</strong> / 3000
                </span>
              </div>
              <textarea 
                id="dagangan-desc" 
                class="pixel-input form-textarea" 
                maxlength="3000"
                rows="4"
                placeholder="Tulis deskripsi yang jelas dan mudah dimengerti oleh calon pembeli"
              ></textarea>
            </div>

            <!-- Warning Notice Banner -->
            <div class="tokoku-warning-banner" style="margin-top: 16px;">
              <span style="font-size: 14px;">⚠️</span>
              <span>Jangan memberikan informasi kontak pribadi atau tautan dalam deskripsi, foto produk, foto profil, fitur Chat, dan slogan karena melanggar ketentuan layanan itemku. Ini akan mengakibatkan penonaktifan akun.</span>
            </div>
          </div>

          <!-- Section 3: Informasi Stok dan Harga -->
          <div class="tokoku-form-card">
            <h4 class="form-card-title">Informasi Stok dan Harga</h4>

            <div style="margin-top: 14px;">
              <label class="form-label font-silkscreen">Harga Produk</label>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="font-silkscreen" style="color: var(--text-dim); font-size: 12px;">IDR</span>
                <input 
                  type="number" 
                  id="dagangan-price" 
                  class="pixel-input" 
                  placeholder="0" 
                  min="0"
                  required 
                  style="flex: 1;"
                />
              </div>
              <span class="text-muted" style="font-size: 10px; display: block; margin-top: 4px;">per 1 Item</span>
            </div>

            <div style="margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
              <span class="form-label font-silkscreen" style="margin-bottom: 0;">Aktifkan harga grosir</span>
              <label class="tokoku-switch">
                <input type="checkbox" id="dagangan-grosir-toggle" />
                <span class="tokoku-slider"></span>
              </label>
            </div>

            <div style="margin-top: 16px;">
              <label class="form-label font-silkscreen">Stok</label>
              <input 
                type="number" 
                id="dagangan-stock" 
                class="pixel-input" 
                placeholder="0" 
                min="0"
                value="10" 
                required 
              />
              <span class="text-muted" style="font-size: 10px; display: block; margin-top: 4px;">x1 Item =</span>
            </div>

            <div style="margin-top: 16px;">
              <label class="form-label font-silkscreen">Minimal Pesanan</label>
              <input 
                type="number" 
                id="dagangan-min-order" 
                class="pixel-input" 
                placeholder="1" 
                min="1"
                value="1" 
                required 
              />
              <span class="text-muted" style="font-size: 10px; display: block; margin-top: 4px;">x1 Item =</span>
            </div>

            <div style="margin-top: 24px;">
              <button type="submit" class="tokoku-btn-primary" style="width: 100%;">
                Buat Dagangan
              </button>
            </div>
          </div>
        </form>
      </div>
    `;

    // Character counter listener
    const descInput = content.querySelector('#dagangan-desc');
    const charCountEl = content.querySelector('#desc-char-count');
    if (descInput && charCountEl) {
      descInput.addEventListener('input', () => {
        charCountEl.textContent = descInput.value.length;
      });
    }

    // Image Upload Slots Handlers
    let slotImages = { 1: null, 2: null, 3: null };
    [1, 2, 3].forEach(slotNum => {
      const slotBox = content.querySelector(`#slot-img-${slotNum}`);
      const fileInput = content.querySelector(`#file-slot-${slotNum}`);
      const preview = content.querySelector(`#preview-slot-${slotNum}`);
      const placeholder = content.querySelector(`#placeholder-slot-${slotNum}`);

      if (slotBox && fileInput) {
        slotBox.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvt) => {
              slotImages[slotNum] = loadEvt.target.result;
              preview.src = loadEvt.target.result;
              preview.classList.remove('hidden');
              placeholder.classList.add('hidden');
              showToast(`Gambar ${slotNum} berhasil diunggah!`, 'success');
            };
            reader.readAsDataURL(file);
          }
        });
      }
    });

    // Form Submit Handler
    const form = content.querySelector('#form-tokoku-buat-dagangan');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = content.querySelector('#dagangan-item-name').value.trim();
        const category = content.querySelector('#dagangan-kategori-select').value;
        const price = parseInt(content.querySelector('#dagangan-price').value, 10) || 0;
        const stock = parseInt(content.querySelector('#dagangan-stock').value, 10) || 0;
        const desc = content.querySelector('#dagangan-desc').value.trim();

        const defaultSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="8" y="8" width="16" height="16" fill="%23ff7a18"/><rect x="12" y="12" width="8" height="8" fill="%23ffd54f"/></svg>';
        const finalImage = slotImages[1] || slotImages[2] || slotImages[3] || defaultSvg;

        storage.addItem({
          name,
          category,
          price,
          stock,
          status: stock > 0 ? 'In Stock' : 'Sold Out',
          rarity: 'epic',
          description: desc,
          image: finalImage
        });

        sound.playFanfare();
        showToast(`Dagangan "${name}" berhasil dibuat dan ditambahkan ke katalog!`, 'success');
        activeTokokuTab = 'daganganku';
        renderAdminContent();
      });
    }

    return;
  }

  // VIEW 4: DAGANGANKU (Matching Photo 3)
  if (activeTokokuTab === 'daganganku') {
    let filteredItems = items;

    // Filter by tab
    if (activeDaganganFilter === 'stok-habis') {
      filteredItems = items.filter(it => Number(it.stock) === 0 || it.status === 'Sold Out');
    }

    // Filter by search
    if (daganganSearchQuery) {
      const q = daganganSearchQuery.toLowerCase();
      filteredItems = filteredItems.filter(it => it.name.toLowerCase().includes(q));
    }

    // Filter by category
    if (daganganCategoryFilter !== 'all') {
      filteredItems = filteredItems.filter(it => it.category === daganganCategoryFilter);
    }

    content.innerHTML = `
      <div class="tokoku-dagangan-view">
        <!-- Top Promo/Tutorial Banner -->
        <div class="tokoku-promo-banner" id="dagangan-promo-banner">
          <div style="flex: 1;">
            <strong>Mau jualan makin laku dan praktis?</strong>
            <p style="font-size: 11px; margin-top: 2px; color: #cbd5e1;">
              Yuk, pelajari cara jualan dengan fitur 
              <a href="javascript:void(0)" class="finance-link">Garansi Pengiriman 10 Menit</a> dan 
              <a href="javascript:void(0)" class="finance-link">Pengiriman Otomatis</a>.
            </p>
          </div>
          <button class="tokoku-banner-close" id="btn-close-promo">Tutup</button>
        </div>

        <!-- Header Row -->
        <div class="tokoku-view-header" style="margin-top: 14px;">
          <h2 class="tokoku-view-title">Daganganku</h2>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="pixel-btn-action secondary font-silkscreen" id="btn-download-catalog" style="font-size: 9px;">
              📥 Download
            </button>
            <label class="pixel-btn-action secondary font-silkscreen" style="font-size: 9px; cursor: pointer;">
              📤 Upload
              <input type="file" id="input-upload-catalog" accept=".json" style="display: none;" />
            </label>
            <button class="tokoku-btn-primary" id="btn-tambah-produk-switch" style="padding: 8px 14px; font-size: 11px;">
              Tambah Produk +
            </button>
          </div>
        </div>

        <!-- Search & Filter Controls Row -->
        <div class="tokoku-filter-controls-row">
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              id="input-search-dagangan" 
              class="tokoku-search-input" 
              placeholder="Cari nama dagangan kamu" 
              value="${daganganSearchQuery}"
            />
          </div>

          <select id="select-category-filter" class="tokoku-select-filter">
            <option value="all">Pilih Kategori</option>
            ${categories.map(c => `
              <option value="${c.id}" ${daganganCategoryFilter === c.id ? 'selected' : ''}>${c.name}</option>
            `).join('')}
          </select>

          <div class="stock-range-wrap">
            <span class="stock-label">Stok</span>
            <input type="number" placeholder="Min" class="stock-range-input" id="stock-min" />
            <span>-</span>
            <input type="number" placeholder="Max" class="stock-range-input" id="stock-max" />
          </div>

          <select class="tokoku-select-filter" style="width: 120px;">
            <option>Terbaru</option>
            <option>Harga Terendah</option>
            <option>Harga Tertinggi</option>
          </select>
        </div>

        <!-- Filter Sub-Tabs -->
        <div class="tokoku-filter-tabs" style="margin-top: 12px;">
          <button class="tokoku-filter-tab ${activeDaganganFilter === 'all' ? 'active' : ''}" data-dfilter="all">Semua</button>
          <button class="tokoku-filter-tab ${activeDaganganFilter === 'stok-habis' ? 'active' : ''}" data-dfilter="stok-habis">Stok Habis</button>
          <button class="tokoku-filter-tab ${activeDaganganFilter === 'belum-terjual' ? 'active' : ''}" data-dfilter="belum-terjual">Belum Terjual</button>
          <button class="tokoku-filter-tab ${activeDaganganFilter === 'grosir' ? 'active' : ''}" data-dfilter="grosir">Grosir</button>
          <button class="tokoku-filter-tab ${activeDaganganFilter === 'delivery' ? 'active' : ''}" data-dfilter="delivery">Delivery ▾</button>
        </div>

        <!-- Items Management Table -->
        <div class="tokoku-table-container">
          <table class="tokoku-table">
            <thead>
              <tr>
                <th style="width: 36px;"><input type="checkbox" id="check-select-all" /></th>
                <th>Pilih produk</th>
                <th style="width: 140px;">Harga</th>
                <th style="width: 90px;">Stok</th>
                <th style="width: 110px;">Delivery</th>
                <th style="width: 70px;">Terjual</th>
                <th style="width: 60px; text-align: center;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${filteredItems.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 32px 10px; color: var(--text-dim);">
                    Tidak ada dagangan yang cocok dengan filter.
                  </td>
                </tr>
              ` : filteredItems.map(it => {
                const isZeroStock = Number(it.stock) === 0 || it.status === 'Sold Out';
                return `
                  <tr data-id="${it.id}">
                    <td><input type="checkbox" class="check-item-row" /></td>
                    <td>
                      <div class="table-product-cell">
                        <img src="${it.image}" class="table-product-thumb" />
                        <div class="table-product-meta">
                          <strong class="table-product-name">${it.name}</strong>
                          <span class="table-product-game">Pixel Lineage • ${it.category}</span>
                          ${isZeroStock ? `<span class="badge-stock-out">Stok Habis</span>` : ''}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="font-silkscreen" style="font-size: 11px; color: var(--accent-gold);">
                        IDR ${(it.price || 0).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        class="tokoku-inline-stock-input" 
                        data-id="${it.id}" 
                        value="${it.stock !== undefined ? it.stock : 10}" 
                        min="0" 
                      />
                    </td>
                    <td>
                      <span class="font-silkscreen" style="font-size: 10px; color: #cbd5e1;">Reguler</span>
                    </td>
                    <td>
                      <span class="font-silkscreen" style="font-size: 10px; color: var(--text-dim);">0</span>
                    </td>
                    <td style="text-align: center;">
                      <button class="pixel-btn-action danger btn-delete-dagangan" data-id="${it.id}" title="Hapus dagangan dari katalog" style="padding: 4px 8px; font-size: 9px;">
                        🗑️
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Promo banner close
    const banner = content.querySelector('#dagangan-promo-banner');
    const btnCloseBanner = content.querySelector('#btn-close-promo');
    if (banner && btnCloseBanner) {
      btnCloseBanner.addEventListener('click', () => banner.style.display = 'none');
    }

    // Switch to Buat Dagangan
    const btnSwitchTambah = content.querySelector('#btn-tambah-produk-switch');
    if (btnSwitchTambah) {
      btnSwitchTambah.addEventListener('click', () => {
        sound.playClick();
        activeTokokuTab = 'buat-dagangan';
        renderAdminContent();
      });
    }

    // Filter tabs
    content.querySelectorAll('.tokoku-filter-tab').forEach(tb => {
      tb.addEventListener('click', () => {
        sound.playClick();
        activeDaganganFilter = tb.getAttribute('data-dfilter') || 'all';
        renderAdminContent();
      });
    });

    // Search input
    const inputSearch = content.querySelector('#input-search-dagangan');
    if (inputSearch) {
      inputSearch.addEventListener('input', (e) => {
        daganganSearchQuery = e.target.value.trim();
        renderTokokuView(stats, orders, items, categories, adminAccounts);
      });
    }

    // Category filter
    const selectCat = content.querySelector('#select-category-filter');
    if (selectCat) {
      selectCat.addEventListener('change', (e) => {
        daganganCategoryFilter = e.target.value;
        renderAdminContent();
      });
    }

    // Inline Stock editing
    content.querySelectorAll('.tokoku-inline-stock-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = input.getAttribute('data-id');
        const newStock = parseInt(e.target.value, 10) || 0;
        const currentItems = storage.getItems();
        const updated = currentItems.map(it =>
          it.id === id ? { ...it, stock: newStock, status: newStock > 0 ? 'In Stock' : 'Sold Out' } : it
        );
        storage.saveItems(updated);
        sound.playCoin();
        showToast(`Stok diperbarui menjadi ${newStock}!`, 'success');
        renderAdminContent();
      });
    });

    // Delete item
    content.querySelectorAll('.btn-delete-dagangan').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const it = items.find(i => i.id === id);
        if (confirm(`Hapus dagangan "${it ? it.name : id}" dari katalog tokomu?`)) {
          sound.playRemove();
          storage.deleteItem(id);
          showToast('Dagangan berhasil dihapus!', 'warning');
          renderAdminContent();
        }
      });
    });

    // Download / Upload catalog JSON
    const btnDownload = content.querySelector('#btn-download-catalog');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        sound.playCoin();
        storage.exportBackup();
        showToast('Katalog dagangan berhasil diunduh ke laptop!', 'success');
      });
    }

    const fileUpload = content.querySelector('#input-upload-catalog');
    if (fileUpload) {
      fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            try {
              storage.importBackup(loadEvt.target.result);
              sound.playFanfare();
              showToast('Katalog berhasil diperbarui dari file JSON!', 'success');
              renderAdminContent();
            } catch (err) {
              sound.playRemove();
              showToast(err.message, 'warning');
            }
          };
          reader.readAsText(file);
        }
      });
    }

    return;
  }

  // VIEW 5: ULASAN PEMBELI
  if (activeTokokuTab === 'ulasan') {
    const reviews = storage.getReviews();

    content.innerHTML = `
      <div class="tokoku-orders-view">
        <div class="tokoku-view-header">
          <div>
            <h2 class="tokoku-view-title">Ulasan Pembeli</h2>
            <p class="tokoku-section-subtitle">Daftar ulasan dan rating dari pembeli yang telah terverifikasi menyelesaikan pesanan.</p>
          </div>
          <span class="tokoku-pill-badge font-silkscreen" style="background: rgba(255, 183, 3, 0.2); color: #ffb703; border-color: #ffb703;">
            ★ ${stats.ratingToko} / 5.0 (Total ${reviews.length} Ulasan)
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
          ${reviews.map(r => `
            <div class="tokoku-form-card" style="padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="font-silkscreen" style="font-size: 11px; color: var(--accent-gold); font-weight: 700;">
                    ${r.customerId || 'Customer'}
                  </span>
                  <span class="badge-stock-out font-silkscreen" style="background: rgba(46, 196, 182, 0.15); color: #2ec4b6; border-color: rgba(46, 196, 182, 0.3);">
                    ✓ Pembeli Terverifikasi
                  </span>
                </div>
                <span class="font-silkscreen" style="font-size: 9px; color: var(--text-dim);">${r.date || 'Baru saja'}</span>
              </div>

              <div style="margin-bottom: 8px;">
                <span style="color: #ffb703; font-size: 13px;">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</span>
                <span class="font-silkscreen" style="font-size: 10px; color: #cbd5e1; margin-left: 8px;">Item: <em>${r.itemName || 'Lineage Relic'}</em></span>
              </div>

              <p style="font-size: 12px; color: #f8fafc; line-height: 1.5; margin: 0;">
                "${r.comment || 'Transaksi sangat cepat dan terpercaya!'}"
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }

  // VIEW 6: KELOLA ADMIN (Multi-Admin System)
  if (activeTokokuTab === 'admins') {
    content.innerHTML = `
      <div class="tokoku-orders-view">
        <div class="tokoku-view-header">
          <div>
            <h2 class="tokoku-view-title">Kelola Admin Tokoku</h2>
            <p class="tokoku-section-subtitle">Tambah akun staf dan kelola akses multi-admin untuk melayani pembeli secara bersamaan.</p>
          </div>
        </div>

        <!-- Add New Admin Card -->
        <div class="tokoku-form-card" style="margin-top: 14px;">
          <h4 class="form-card-title">+ Daftarkan Admin Baru</h4>
          <form id="form-add-new-admin" style="display: flex; flex-direction: column; gap: 12px; margin-top: 14px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label font-silkscreen">Username Admin *</label>
                <input type="text" id="new-adm-username" class="pixel-input" placeholder="e.g. staff_satria" required autocomplete="off" />
              </div>
              <div>
                <label class="form-label font-silkscreen">Password *</label>
                <input type="password" id="new-adm-password" class="pixel-input" placeholder="Minimal 6 karakter" required autocomplete="new-password" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label font-silkscreen">Nama Tampilan *</label>
                <input type="text" id="new-adm-display" class="pixel-input" placeholder="e.g. Admin Satria" required />
              </div>
              <div>
                <label class="form-label font-silkscreen">Peran Admin *</label>
                <select id="new-adm-role" class="pixel-input" style="cursor: pointer;">
                  <option value="Staff Admin">Staff Admin (Umum)</option>
                  <option value="Trade Specialist">Trade Specialist (In-Game)</option>
                  <option value="Support Agent">Customer Support (Chat)</option>
                  <option value="Super Admin">Super Admin (Akses Penuh)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
              <button type="submit" class="tokoku-btn-primary" style="padding: 10px 18px; font-size: 11px;">
                Simpan Akun Admin
              </button>
            </div>
          </form>
        </div>

        <!-- Active Admins List -->
        <div style="margin-top: 20px;">
          <h4 class="form-card-title" style="margin-bottom: 12px;">Daftar Administrator Aktif (${adminAccounts.length})</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${adminAccounts.map(adm => `
              <div class="tokoku-form-card" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; margin: 0;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 14px;">🛡️</span>
                    <strong style="color: var(--text-main); font-size: 13px;">${adm.name}</strong>
                    <span class="tokoku-pill-badge font-silkscreen" style="font-size: 8px;">${adm.role}</span>
                  </div>
                  <div class="font-silkscreen" style="font-size: 9px; color: var(--text-muted); margin-top: 4px;">
                    Username: <span style="color: var(--accent-gold);">${adm.username}</span> • Terdaftar: ${adm.createdAt || 'Default'}
                  </div>
                </div>

                <div>
                  ${(adm.username === 'admin' || adm.username === 'boss') ? `
                    <span class="font-silkscreen" style="font-size: 8px; color: var(--text-dim); padding: 4px 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
                      MASTER
                    </span>
                  ` : `
                    <button class="pixel-btn-action danger btn-del-admin" data-id="${adm.id}" style="font-size: 8px; padding: 4px 8px;">
                      HAPUS
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const form = content.querySelector('#form-add-new-admin');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = content.querySelector('#new-adm-username').value.trim();
        const password = content.querySelector('#new-adm-password').value.trim();
        const name = content.querySelector('#new-adm-display').value.trim();
        const role = content.querySelector('#new-adm-role').value;

        try {
          storage.addAdminAccount({ username, password, name, role });
          sound.playFanfare();
          showToast(`Akun admin "${username}" berhasil didaftarkan!`, 'success');
          renderAdminContent();
        } catch (err) {
          sound.playRemove();
          showToast(err.message, 'warning');
        }
      });
    }

    content.querySelectorAll('.btn-del-admin').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Hapus akun staf admin ini?')) {
          try {
            storage.deleteAdminAccount(id);
            sound.playRemove();
            showToast('Akun admin berhasil dihapus.', 'info');
            renderAdminContent();
          } catch (err) {
            showToast(err.message, 'warning');
          }
        }
      });
    });

    return;
  }

  // VIEW 7: PENGATURAN TOKO
  if (activeTokokuTab === 'pengaturan') {
    const settings = storage.getSettings();

    content.innerHTML = `
      <div class="tokoku-orders-view">
        <div class="tokoku-view-header">
          <div>
            <h2 class="tokoku-view-title">Pengaturan Toko</h2>
            <p class="tokoku-section-subtitle">Konfigurasi profil toko, notifikasi webhook Discord, dan integrasi Roblox.</p>
          </div>
        </div>

        <form id="form-tokoku-settings" class="tokoku-form-card" style="margin-top: 14px; display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label class="form-label font-silkscreen">Status Roblox Boss (Ditampilkan di Header Navbar)</label>
            <select id="set-roblox-status" class="pixel-input" style="font-family: 'Silkscreen', monospace;">
              <option value="online" ${(settings.robloxStatus || 'online') === 'online' ? 'selected' : ''}>🟢 BOSS ONLINE (Siap Trade di Dalam Game)</option>
              <option value="trading" ${(settings.robloxStatus || 'online') === 'trading' ? 'selected' : ''}>🟡 BOSS TRADING (Sedang Melayani Pesanan)</option>
              <option value="offline" ${(settings.robloxStatus || 'online') === 'offline' ? 'selected' : ''}>⚪ BOSS OFFLINE (Pantau via Discord)</option>
            </select>
          </div>

          <div>
            <label class="form-label font-silkscreen">URL Profil Roblox Boss</label>
            <input type="url" id="set-roblox-url" class="pixel-input" value="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" />
          </div>

          <div>
            <label class="form-label font-silkscreen">Nomor WhatsApp Notifikasi</label>
            <input type="text" id="set-wa-num" class="pixel-input" value="${settings.bossWhatsapp || '085857537354'}" />
          </div>

          <div>
            <label class="form-label font-silkscreen">Discord Webhook URL (Notifikasi Instan ke HP Boss)</label>
            <div style="display: flex; gap: 8px;">
              <input type="url" id="set-discord-webhook" class="pixel-input" value="${settings.discordWebhookUrl || ''}" placeholder="https://discord.com/api/webhooks/..." style="flex: 1;" />
              <button type="button" id="btn-ping-webhook" class="pixel-btn-action secondary font-silkscreen" style="padding: 6px 12px; font-size: 9px; white-space: nowrap;">
                TEST PING
              </button>
            </div>
            <span class="text-muted" style="font-size: 10px; display: block; margin-top: 4px;">
              Setiap kali pembeli melakukan checkout pesanan atau mengirim chat, notifikasi otomatis akan berbunyi di Discord HP Boss!
            </span>
          </div>

          <div>
            <label class="form-label font-silkscreen">PIN Keamanan Admin</label>
            <input type="password" id="set-admin-pin" class="pixel-input" value="${settings.adminPin || '2026'}" maxlength="8" />
          </div>

          <div style="margin-top: 10px;">
            <button type="submit" class="tokoku-btn-primary" style="width: 100%;">
              Simpan Konfigurasi Tokoku
            </button>
          </div>
        </form>

        <!-- Database Backup and Reset Block -->
        <div class="tokoku-form-card" style="margin-top: 16px;">
          <h4 class="form-card-title" style="color: var(--accent-orange);">Cadangan & Pemulihan Database</h4>
          <p class="tokoku-section-subtitle">Ekspor seluruh data katalog, pesanan, ulasan, dan percakapan ke file JSON lokal.</p>

          <div style="display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap;">
            <button id="btn-export-all-json" class="pixel-btn gold" style="flex: 1; padding: 10px; font-size: 8px;">
              📥 EKSPOR CADANGAN JSON
            </button>
            <button id="btn-reset-catalog-all" class="pixel-btn danger" style="flex: 1; padding: 10px; font-size: 8px;">
              ⚠️ RESET SEMUA KE DEFAULT
            </button>
          </div>
        </div>
      </div>
    `;

    // Ping test
    const btnPing = content.querySelector('#btn-ping-webhook');
    if (btnPing) {
      btnPing.addEventListener('click', async () => {
        const url = content.querySelector('#set-discord-webhook').value.trim();
        if (!url) {
          showToast('Masukkan URL Webhook Discord terlebih dahulu!', 'warning');
          return;
        }
        showToast('Mengirim sinyal uji coba ke Discord...', 'info');
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'Wiseman Shop Bot',
              avatar_url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f9d9.png',
              embeds: [{
                title: '⚡ Sinyal Uji Coba Tokoku Toko',
                description: '✅ Koneksi Webhook Discord berhasil! Notifikasi pesanan dan live chat akan langsung masuk ke ponsel Boss.',
                color: 0xff7a18,
                timestamp: new Date().toISOString()
              }]
            })
          });
          if (res.ok) {
            sound.playFanfare();
            showToast('Sinyal uji coba berhasil diterima di Discord!', 'success');
          } else {
            showToast(`Gagal: status code ${res.status}`, 'warning');
          }
        } catch (err) {
          showToast('Koneksi Discord gagal: ' + err.message, 'warning');
        }
      });
    }

    // Save settings
    const form = content.querySelector('#form-tokoku-settings');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const robloxStatus = content.querySelector('#set-roblox-status').value;
        const robloxUrl = content.querySelector('#set-roblox-url').value.trim();
        const waNum = content.querySelector('#set-wa-num').value.trim();
        const discordWebhook = content.querySelector('#set-discord-webhook').value.trim();
        const pin = content.querySelector('#set-admin-pin').value.trim();

        storage.saveSettings({
          ...settings,
          robloxStatus: robloxStatus || 'online',
          robloxProfileUrl: robloxUrl || 'https://www.roblox.com/users/4035030385/profile',
          bossWhatsapp: waNum || '085857537354',
          discordWebhookUrl: discordWebhook || '',
          adminPin: pin || '2026'
        });

        sound.playFanfare();
        showToast('Pengaturan Tokoku berhasil disimpan!', 'success');
      });
    }

    // Export JSON
    const btnExp = content.querySelector('#btn-export-all-json');
    if (btnExp) {
      btnExp.addEventListener('click', () => {
        sound.playCoin();
        storage.exportBackup();
        showToast('Cadangan JSON telah diunduh ke laptop!', 'success');
      });
    }

    // Reset default
    const btnRst = content.querySelector('#btn-reset-catalog-all');
    if (btnRst) {
      btnRst.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin me-reset katalog dan pengaturan kembali ke default?')) {
          storage.resetToDefault();
          sound.playFanfare();
          showToast('Katalog berhasil di-reset ke default!', 'success');
          renderAdminContent();
        }
      });
    }

    return;
  }

  // Fallback for upcoming tabs (profil, pencapaian, iklan, pengiriman-otomatis)
  content.innerHTML = `
    <div class="tokoku-orders-view">
      <div class="tokoku-view-header">
        <div>
          <h2 class="tokoku-view-title">${activeTokokuTab.toUpperCase().replace('-', ' ')}</h2>
          <p class="tokoku-section-subtitle">Fitur modul toko itemku Tokoku Pixel Lineage.</p>
        </div>
      </div>
      <div class="tokoku-form-card" style="text-align: center; padding: 40px 20px; margin-top: 20px;">
        <span style="font-size: 36px; display: block; margin-bottom: 12px;">⚡</span>
        <h4 class="font-pixel" style="font-size: 11px; color: var(--accent-gold); margin-bottom: 8px;">
          FITUR AKTIF
        </h4>
        <p style="font-size: 12px; color: var(--text-muted); max-width: 480px; margin: 0 auto;">
          Modul ini terhubung secara real-time dengan status toko PanzerFaust. Anda dapat mengelola transaksi utama melalui menu <strong>Beranda</strong>, <strong>Riwayat Pesanan</strong>, dan <strong>Daganganku</strong>.
        </p>
      </div>
    </div>
  `;
}
