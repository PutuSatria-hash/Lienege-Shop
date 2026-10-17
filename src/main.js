// Main Application Orchestrator (100% English & Mobile Optimized)
import './style.css';
import { storage } from './utils/storage.js';
import { initPixelCanvas } from './utils/canvasBackground.js';
import { initLoadingScreen } from './components/LoadingScreen.js';
import { renderNavbar } from './components/Navbar.js';
import { renderBannerHeader } from './components/BannerHeader.js';
import { renderItemGrid } from './components/ItemGrid.js';
import { initCartDrawer, openCart } from './components/CartDrawer.js';
import { initAdminModal, openAdmin } from './components/AdminModal.js';
import { initOrderHistoryModal, openOrders } from './components/OrderHistoryModal.js';
import { initLiveChatModal, openChat } from './components/LiveChatModal.js';
import { initReviewsModal, openReviews } from './components/ReviewsModal.js';
import { initOtherGamesModal, openOtherGames } from './components/OtherGamesModal.js';
import { initItemInspectModal } from './components/ItemInspectModal.js';
import { initWishlistModal, openWishlist } from './components/WishlistModal.js';
import { initNpcGuide } from './components/NpcGuide.js';
import { initHotkeys } from './utils/hotkeys.js';
import { renderReviewsShowcase } from './components/ReviewsShowcase.js';
import { initScenery } from './utils/sceneryManager.js';
import { initClickSparkles } from './utils/sparkles.js';
import { bgm } from './utils/bgm.js';

// 1. Initialize Canvas Background, Ambient Scenery, Tavern BGM & Sparkles
const canvas = document.getElementById('bg-canvas');
initPixelCanvas(canvas);
initScenery();
initClickSparkles();
bgm.init();

// 2. Initialize Modals & Interactive NPCs
initCartDrawer();
initAdminModal();
initOrderHistoryModal();
initLiveChatModal();
initReviewsModal();
initOtherGamesModal();
initItemInspectModal();
initWishlistModal();
initNpcGuide();

const settings = storage.getSettings();

// 3. Mount Application Core Layout
const app = document.getElementById('app');
app.innerHTML = `
  <div id="nav-mount"></div>
  <div id="banner-mount"></div>
  <main id="grid-mount"></main>
  <div id="reviews-mount"></div>
  
  <footer style="margin-top: 60px; padding: 40px 20px; border-top: 2px solid rgba(255,255,255,0.08); text-align: center;">
    <p class="font-pixel" style="font-size: 12px; color: var(--accent-orange); margin-bottom: 12px;">
      ⚔️ PIXEL LINEAGE • WISEMAN SHOP ⚔️
    </p>
    <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; max-width: 620px; margin: 0 auto 16px;">
      All in-game items are reviewed & traded directly by Boss via Roblox Profile: 
      <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" class="footer-roblox-link font-silkscreen" style="color: #ffd166; text-decoration: none; font-weight: 700; margin-left: 4px;">
        ${settings.robloxUsername || 'WisemanBoss'} ↗
      </a>.
      Chat directly on Roblox to complete in-game trades!
    </p>
    <div style="font-size: 10px; color: var(--text-dim);" class="font-silkscreen">
      &copy; 2026 PIXEL LINEAGE • WISEMAN SHOP • ALL RIGHTS RESERVED
    </div>
  </footer>
`;

// 4. Render Components
const navMount = document.getElementById('nav-mount');
const bannerMount = document.getElementById('banner-mount');
const gridMount = document.getElementById('grid-mount');
const reviewsMount = document.getElementById('reviews-mount');

renderNavbar(navMount, {
  onOpenCart: () => openCart(),
  onOpenWishlist: () => openWishlist(),
  onOpenBoss: () => openAdmin(),
  onOpenHistory: () => openOrders(),
  onOpenPublicChat: () => openChat('general', false),
  onOpenReviews: () => openReviews(),
  onOpenOtherGames: () => openOtherGames()
});

initHotkeys({
  onOpenCart: () => openCart(),
  onOpenWishlist: () => openWishlist(),
  onOpenReviews: () => openReviews(),
  onOpenOrders: () => openOrders()
});

renderBannerHeader(bannerMount);
renderItemGrid(gridMount);
renderReviewsShowcase(reviewsMount, () => openReviews());

// Update footer link dynamically if settings change
window.addEventListener('pl_settings_updated', (e) => {
  const link = document.querySelector('.footer-roblox-link');
  if (link) {
    link.href = e.detail.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile';
    link.textContent = `${e.detail.robloxUsername || 'WisemanBoss'} ↗`;
  }
});

// 5. Trigger Retro Loading Screen
initLoadingScreen(() => {
  console.log('Wiseman Shop loaded successfully.');
});
