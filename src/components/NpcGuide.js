// Interactive Merchant NPC Guide (Wiseman Boss Persona)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';

const NPC_TIPS = [
  "Greetings, traveler! I'm Wiseman Boss. Browse my vault and send your order when ready!",
  "Need to trade in-game? Order with your unique Customer ID and meet me on Roblox!",
  "Short on Gold? You can also choose 'Item Exchange' to barter with your rare equipment!",
  "Check out the Mythic items—each carries ancient dungeon lineage powers."
];

export function initNpcGuide() {
  if (document.getElementById('npc-guide-widget')) return;

  const settings = storage.getSettings();
  const widget = document.createElement('div');
  widget.id = 'npc-guide-widget';
  widget.className = 'npc-guide-container';

  widget.innerHTML = `
    <!-- Floating Avatar Bubble -->
    <div class="npc-avatar-pill" id="npc-avatar-trigger" title="Talk to Wiseman Boss">
      <div class="npc-avatar-art">
        <svg viewBox="0 0 24 24" width="28" height="28" shape-rendering="crispEdges">
          <!-- Wizard Hat -->
          <polygon points="12,2 8,10 16,10" fill="#9d4edd" />
          <rect x="7" y="10" width="10" height="2" fill="#ffd166" />
          <!-- Face -->
          <rect x="8" y="12" width="8" height="6" fill="#fbcfe8" />
          <!-- Beard -->
          <polygon points="7,18 17,18 12,23" fill="#ffffff" />
          <!-- Eyes -->
          <rect x="9" y="14" width="2" height="2" fill="#120422" />
          <rect x="13" y="14" width="2" height="2" fill="#120422" />
        </svg>
      </div>
      <div class="npc-pill-text">
        <span class="npc-name font-pixel">WISEMAN BOSS</span>
        <span class="npc-role font-silkscreen">VAULT GUIDE</span>
      </div>
      <span class="npc-ping-dot"></span>
    </div>

    <!-- Interactive Speech Bubble Dialog -->
    <div class="npc-dialog-card hidden" id="npc-dialog-card">
      <div class="npc-dialog-header font-pixel">
        <span>🧙 WISEMAN BOSS SAYS:</span>
        <button class="npc-dialog-close" id="btn-close-npc-dialog">✕</button>
      </div>
      <div class="npc-speech-bubble" id="npc-speech-text">
        "Greetings traveler! Welcome to my vault. All items are reviewed and delivered directly by me on Roblox."
      </div>

      <div class="npc-dialog-choices">
        <button class="npc-choice-btn font-silkscreen" data-action="trade-guide">
          🤝 How do Roblox trades work?
        </button>
        <button class="npc-choice-btn font-silkscreen" data-action="barter-info">
          🪙 How does Item Barter work?
        </button>
        <button class="npc-choice-btn font-silkscreen" data-action="hot-items">
          🔥 Recommend high-tier equipment
        </button>
        <a href="${settings.robloxProfileUrl || 'https://www.roblox.com/users/4035030385/profile'}" target="_blank" class="npc-choice-btn font-silkscreen roblox-choice">
          🎮 Meet Boss on Roblox ↗
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  const trigger = widget.querySelector('#npc-avatar-trigger');
  const dialog = widget.querySelector('#npc-dialog-card');
  const closeBtn = widget.querySelector('#btn-close-npc-dialog');
  const speechText = widget.querySelector('#npc-speech-text');

  trigger.addEventListener('click', () => {
    sound.playClick();
    dialog.classList.toggle('hidden');
    if (!dialog.classList.contains('hidden')) {
      const randomTip = NPC_TIPS[Math.floor(Math.random() * NPC_TIPS.length)];
      speechText.textContent = `"${randomTip}"`;
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sound.playClick();
    dialog.classList.add('hidden');
  });

  widget.querySelectorAll('.npc-choice-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.action;
      if (!action) return; // Roblox link
      e.stopPropagation();
      sound.playClick();

      if (action === 'trade-guide') {
        speechText.textContent = `"Simple! 1. Add items to cart. 2. Checkout with Gold or Item Exchange. 3. I get notified immediately on Discord and we meet in-game on Roblox to complete the trade!"`;
      } else if (action === 'barter-info') {
        speechText.textContent = `"When choosing 'Item Exchange', write down the items you wish to offer. I will review your barter offer and message you back in Live Chat!"`;
      } else if (action === 'hot-items') {
        speechText.textContent = `"Check out the Mythic Weapons and Ancient Tomes in the catalog—they grant massive combat multipliers!"`;
        const rarityFilter = document.getElementById('filter-rarity');
        if (rarityFilter) {
          rarityFilter.value = 'mythic';
          rarityFilter.dispatchEvent(new Event('change'));
          document.getElementById('grid-mount')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
