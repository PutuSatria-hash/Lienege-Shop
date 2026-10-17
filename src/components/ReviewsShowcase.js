// Verified Customer Reviews & Reputation Showcase Component
import { storage } from '../utils/storage.js';
import { sound } from '../utils/sound.js';

export function renderReviewsShowcase(container, onOpenReviewsModal) {
  const reviews = storage.getReviews();
  const settings = storage.getSettings();

  // Pick top 3 reviews
  const displayReviews = reviews.slice(0, 3);

  container.innerHTML = `
    <section class="reviews-showcase-section" id="reviews-showcase">
      <div class="showcase-header">
        <div class="showcase-title-group">
          <div class="showcase-badge font-pixel">⭐ VERIFIED TRADES</div>
          <h2 class="showcase-heading font-pixel">COMMUNITY REPUTATION</h2>
          <p class="showcase-sub font-silkscreen">
            Direct trades & item swaps verified by Boss on Roblox. Trusted by Lineage adventurers.
          </p>
        </div>

        <div class="showcase-rating-pill">
          <div class="rating-stars">★★★★★</div>
          <div class="rating-val font-pixel">4.9 / 5.0</div>
          <div class="rating-count font-silkscreen">${reviews.length}+ REVIEWS</div>
        </div>
      </div>

      <!-- Reviews Grid -->
      <div class="reviews-cards-grid">
        ${displayReviews.map(r => `
          <div class="review-showcase-card">
            <div class="review-card-top">
              <span class="review-cust-id font-pixel">${r.customerId || 'CUST-XXXX'}</span>
              <span class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</span>
            </div>
            <p class="review-comment">"${escapeHtml(r.comment || 'Smooth trade.')}"</p>
            <div class="review-card-footer">
              <span class="review-verified font-silkscreen">✓ VERIFIED IN-GAME</span>
              <span class="review-date font-silkscreen">${r.date ? new Date(r.date).toLocaleDateString() : 'Recent'}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Showcase Action Strip -->
      <div class="showcase-actions">
        <button class="pixel-btn" id="btn-showcase-write">
          ✍️ LEAVE A REVIEW
        </button>
        <button class="pixel-btn secondary" id="btn-showcase-all">
          ⭐ VIEW ALL (${reviews.length})
        </button>
        <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" class="pixel-btn gold" style="text-decoration: none;">
          🎮 MEET BOSS ON ROBLOX ↗
        </a>
      </div>
    </section>
  `;

  const btnWrite = container.querySelector('#btn-showcase-write');
  const btnAll = container.querySelector('#btn-showcase-all');

  if (btnWrite) {
    btnWrite.addEventListener('click', () => {
      sound.playClick();
      if (onOpenReviewsModal) onOpenReviewsModal();
    });
  }

  if (btnAll) {
    btnAll.addEventListener('click', () => {
      sound.playClick();
      if (onOpenReviewsModal) onOpenReviewsModal();
    });
  }

  // Refresh showcase when new review is saved
  window.addEventListener('pl_review_added', () => {
    renderReviewsShowcase(container, onOpenReviewsModal);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
