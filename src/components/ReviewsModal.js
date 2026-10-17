// Customer Reviews & Feedback Modal Component (100% English & Mobile-First)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { showToast } from './Toast.js';

export function initReviewsModal() {
  const existing = document.getElementById('reviews-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'reviews-modal';

  modal.innerHTML = `
    <div class="modal-content mobile-sheet" style="max-width: 680px; max-height: 90vh; display: flex; flex-direction: column;">
      <div class="modal-header" style="flex-shrink: 0;">
        <div>
          <h3 class="modal-title font-pixel">⭐ CUSTOMER REVIEWS & RATINGS</h3>
          <div class="font-silkscreen" style="font-size: 10px; color: var(--accent-gold); margin-top: 4px;">
            100% Verified In-Game Lineage Trades
          </div>
        </div>
        <button class="modal-close-btn" id="reviews-close-btn">&times;</button>
      </div>

      <div class="modal-body" id="reviews-modal-body" style="flex: 1; overflow-y: auto;">
        <!-- Dynamic Reviews Content -->
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#reviews-close-btn');
  closeBtn.addEventListener('click', () => closeReviews());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeReviews();
  });

  // Listen to open reviews event from other components
  window.addEventListener('pl_open_reviews', (e) => {
    const prefillItem = e.detail ? e.detail.itemName : null;
    openReviews(prefillItem);
  });

  return {
    open: openReviews,
    close: closeReviews
  };
}

let activeRatingStars = 5;
let prefilledItemName = '';

export function openReviews(prefillItem = '') {
  const modal = document.getElementById('reviews-modal');
  if (!modal) return;
  prefilledItemName = prefillItem || '';
  renderReviewsContent();
  modal.classList.add('open');
}

export function closeReviews() {
  const modal = document.getElementById('reviews-modal');
  if (modal) modal.classList.remove('open');
}

function renderReviewsContent() {
  const body = document.getElementById('reviews-modal-body');
  if (!body) return;

  const reviews = storage.getReviews();
  const items = storage.getItems();
  const customerId = storage.getCustomerId();

  // Calculate Average Rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  body.innerHTML = `
    <!-- Top Stats Scorecard -->
    <div style="background: rgba(255, 209, 102, 0.08); border: 1px solid rgba(255, 209, 102, 0.25); padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div>
        <div style="font-size: 24px; font-weight: 800; color: var(--accent-gold); display: flex; align-items: center; gap: 8px;">
          <span>⭐ ${avgRating}</span>
          <span style="font-size: 13px; color: #fff; font-family: 'Silkscreen';">/ 5.0</span>
        </div>
        <div class="font-silkscreen" style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">
          Based on ${reviews.length} Verified Buyer Testimonials
        </div>
      </div>
      <button id="btn-toggle-write-review" class="pixel-btn gold" style="font-size: 8px; padding: 8px 14px;">
        ✍️ WRITE A REVIEW
      </button>
    </div>

    <!-- Collapsible Write Review Form -->
    <div id="review-form-container" style="display: ${prefilledItemName ? 'block' : 'none'}; background: rgba(0,0,0,0.4); border: 1px solid rgba(255, 122, 24, 0.35); padding: 16px; margin-bottom: 22px;">
      <h4 class="font-pixel" style="font-size: 10px; color: var(--accent-orange); margin-bottom: 12px;">
        SUBMIT VERIFIED REVIEW
      </h4>

      <form id="form-submit-review">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div>
            <label class="form-label font-silkscreen">Reviewer (Your ID)</label>
            <input type="text" class="pixel-input" value="${customerId}" disabled style="opacity: 0.8; cursor: not-allowed;" />
          </div>
          <div>
            <label class="form-label font-silkscreen">Item Purchased *</label>
            <select id="review-item-select" class="pixel-input" style="cursor: pointer;">
              ${items.map(it => `
                <option value="${it.name}" ${it.name === prefilledItemName ? 'selected' : ''}>
                  ${it.name}
                </option>
              `).join('')}
              <option value="General Lineage Trade" ${!prefilledItemName ? 'selected' : ''}>General Lineage Trade</option>
            </select>
          </div>
        </div>

        <!-- Star Rating Picker -->
        <div style="margin-bottom: 14px;">
          <label class="form-label font-silkscreen">Rating *</label>
          <div style="display: flex; gap: 8px;" id="star-picker">
            ${[1, 2, 3, 4, 5].map(star => `
              <button type="button" class="star-btn ${star <= activeRatingStars ? 'active' : ''}" data-val="${star}" style="background: none; border: none; font-size: 22px; cursor: pointer; transition: transform 0.15s;">
                ⭐
              </button>
            `).join('')}
            <span class="font-silkscreen" id="star-label" style="font-size: 11px; color: var(--accent-gold); align-self: center; margin-left: 8px;">
              5 / 5 Stars
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label font-silkscreen">Your Feedback & Experience *</label>
          <textarea 
            id="review-comment-text" 
            class="pixel-input form-textarea" 
            placeholder="E.g.: Trade was instant! Boss met me in-game within 2 minutes. Item as described..." 
            required
            style="min-height: 80px;"
          ></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" id="btn-cancel-review" class="pixel-btn secondary" style="font-size: 8px; padding: 8px 12px;">CANCEL</button>
          <button type="submit" class="pixel-btn gold" style="font-size: 8px; padding: 8px 16px;">SUBMIT PUBLIC REVIEW ⭐</button>
        </div>
      </form>
    </div>

    <!-- Reviews Stream List -->
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${reviews.map(rev => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 14px; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="font-pixel" style="font-size: 9px; color: var(--accent-gold);">${rev.customerId}</span>
              <span class="rarity-badge font-silkscreen" style="font-size: 7px; background: rgba(46, 196, 182, 0.2); color: #2ec4b6;">
                VERIFIED BUYER
              </span>
            </div>
            <span class="font-silkscreen" style="font-size: 9px; color: var(--text-muted);">${rev.date}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="color: #ffd166; font-size: 13px;">${'⭐'.repeat(rev.rating || 5)}</div>
            <span class="font-silkscreen" style="font-size: 9px; color: #ff9e00; background: rgba(255, 122, 24, 0.15); padding: 2px 6px;">
              Item: ${rev.itemName}
            </span>
          </div>

          <div style="font-size: 12px; color: #e2e8f0; line-height: 1.5; font-style: italic;">
            "${escapeHtml(rev.comment)}"
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Toggle write review form
  const btnToggleForm = body.querySelector('#btn-toggle-write-review');
  const formContainer = body.querySelector('#review-form-container');
  btnToggleForm.addEventListener('click', () => {
    sound.playClick();
    const isHidden = formContainer.style.display === 'none';
    formContainer.style.display = isHidden ? 'block' : 'none';
  });

  const btnCancel = body.querySelector('#btn-cancel-review');
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      sound.playClick();
      formContainer.style.display = 'none';
      prefilledItemName = '';
    });
  }

  // Star Picker interaction
  const starBtns = body.querySelectorAll('.star-btn');
  const starLabel = body.querySelector('#star-label');
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      activeRatingStars = parseInt(btn.getAttribute('data-val'), 10);
      starBtns.forEach(b => {
        const val = parseInt(b.getAttribute('data-val'), 10);
        b.style.opacity = val <= activeRatingStars ? '1' : '0.3';
      });
      starLabel.textContent = `${activeRatingStars} / 5 Stars`;
    });
  });

  // Submit Review Handler
  const form = body.querySelector('#form-submit-review');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const itemSelect = body.querySelector('#review-item-select');
    const commentEl = body.querySelector('#review-comment-text');

    const itemName = itemSelect.value;
    const comment = commentEl.value.trim();

    if (!comment) {
      showToast('Please enter your review comment!', 'warning');
      return;
    }

    storage.saveReview({
      customerId,
      rating: activeRatingStars,
      itemName,
      comment
    });

    sound.playFanfare();
    showToast('Thank you! Your review has been published.', 'success');
    prefilledItemName = '';
    renderReviewsContent();
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
