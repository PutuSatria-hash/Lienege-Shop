// Other Games Merchant Hub (Coming Soon Modal)
import { sound } from '../utils/sound.js';

export function initOtherGamesModal() {
  const existing = document.getElementById('other-games-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'other-games-modal';

  modal.innerHTML = `
    <div class="modal-content mobile-sheet" style="max-width: 620px;">
      <div class="modal-header">
        <div>
          <h3 class="modal-title font-pixel">🎮 OTHER GAME STORES</h3>
          <span class="font-silkscreen" style="font-size: 10px; color: var(--accent-gold); margin-top: 4px; display: block;">
            Wiseman Multiverse Merchant Expansion
          </span>
        </div>
        <button class="modal-close-btn" id="other-games-close-btn">&times;</button>
      </div>

      <div class="modal-body" style="padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 36px; margin-bottom: 12px; filter: drop-shadow(0 0 10px var(--accent-orange));">🏰</div>
          <span class="rarity-badge font-pixel" style="background: rgba(255, 122, 24, 0.2); color: var(--accent-orange); font-size: 10px; padding: 6px 12px; border: 1px solid var(--accent-orange);">
            🚧 COMING SOON 🚧
          </span>
          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-top: 14px; max-width: 480px; margin-left: auto; margin-right: auto;">
            Boss Wiseman is actively preparing new trading branches for popular games. All items will feature the same fast delivery, verified safety, and direct in-game trade support!
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 14px;">
            <div style="font-size: 20px; margin-bottom: 6px;">⚔️</div>
            <div class="font-pixel" style="font-size: 9px; color: #ffd166; margin-bottom: 4px;">DEEP DUNGEON REALMS</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">Legendary weapons, rings & enchanted armor.</div>
            <span class="rarity-badge font-silkscreen" style="font-size: 7px; background: rgba(148, 163, 184, 0.15); color: #94a3b8;">IN PREPARATION</span>
          </div>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 14px;">
            <div style="font-size: 20px; margin-bottom: 6px;">⚡</div>
            <div class="font-pixel" style="font-size: 9px; color: #ffd166; margin-bottom: 4px;">ANIME & RPG ADVENTURES</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">Mythic units, reroll items & trait gems.</div>
            <span class="rarity-badge font-silkscreen" style="font-size: 7px; background: rgba(148, 163, 184, 0.15); color: #94a3b8;">IN PREPARATION</span>
          </div>
        </div>

        <div style="text-align: center;">
          <button class="pixel-btn" id="btn-close-other-games" style="padding: 10px 24px; font-size: 9px;">
            GOT IT, TAKE ME BACK
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#other-games-close-btn');
  closeBtn.addEventListener('click', () => closeOtherGames());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeOtherGames();
  });

  const btnGotIt = modal.querySelector('#btn-close-other-games');
  if (btnGotIt) {
    btnGotIt.addEventListener('click', () => {
      sound.playClick();
      closeOtherGames();
    });
  }

  return {
    open: openOtherGames,
    close: closeOtherGames
  };
}

export function openOtherGames() {
  const modal = document.getElementById('other-games-modal');
  if (!modal) return;
  modal.classList.add('open');
}

export function closeOtherGames() {
  const modal = document.getElementById('other-games-modal');
  if (modal) modal.classList.remove('open');
}
