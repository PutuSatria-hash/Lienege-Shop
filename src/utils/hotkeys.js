// Gamer Keyboard Hotkeys (M, C, W, R, H, Esc)
import { sound } from './sound.js';
import { bgm } from './bgm.js';

export function initHotkeys(callbacks) {
  window.addEventListener('keydown', (e) => {
    // Ignore hotkeys when typing in forms
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const key = e.key.toLowerCase();

    switch (key) {
      case 'm':
        sound.playClick();
        bgm.toggle();
        break;
      case 'c':
        if (callbacks.onOpenCart) {
          sound.playClick();
          callbacks.onOpenCart();
        }
        break;
      case 'w':
        if (callbacks.onOpenWishlist) {
          sound.playClick();
          callbacks.onOpenWishlist();
        }
        break;
      case 'r':
        if (callbacks.onOpenReviews) {
          sound.playClick();
          callbacks.onOpenReviews();
        }
        break;
      case 'h':
        if (callbacks.onOpenOrders) {
          sound.playClick();
          callbacks.onOpenOrders();
        }
        break;
      default:
        break;
    }
  });
}
