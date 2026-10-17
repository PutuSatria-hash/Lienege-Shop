// Item Grid & Controls Component (100% English)
import { sound } from '../utils/sound.js';
import { storage } from '../utils/storage.js';
import { createItemCard } from './ItemCard.js';

export function renderItemGrid(container) {
  let activeCategory = 'all';
  let searchQuery = '';
  let activeRarity = 'all';
  let sortBy = 'default';

  container.innerHTML = `
    <div class="controls-bar">
      <!-- Category Tabs (Horizontal Scrollable on Mobile) -->
      <div class="category-tabs-scroll" id="category-tabs-container"></div>

      <!-- Search & Filters Row -->
      <div class="search-filter-row">
        <div class="search-input-wrap">
          <input 
            type="text" 
            id="search-input" 
            class="pixel-input" 
            placeholder="🔍 Search items by name or lore..." 
            autocomplete="off"
          />
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <!-- Rarity Filter -->
          <select id="filter-rarity" class="filter-select">
            <option value="all">All Rarities</option>
            <option value="mythic">Mythic</option>
            <option value="legendary">Legendary</option>
            <option value="epic">Epic</option>
            <option value="rare">Rare</option>
            <option value="common">Common</option>
          </select>

          <!-- Price Sorter -->
          <select id="sort-items" class="filter-select">
            <option value="default">Default Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Items Grid Container -->
    <div class="items-grid" id="items-grid-container"></div>
  `;

  const tabsContainer = container.querySelector('#category-tabs-container');
  const gridContainer = container.querySelector('#items-grid-container');
  const searchInput = container.querySelector('#search-input');
  const raritySelect = container.querySelector('#filter-rarity');
  const sortSelect = container.querySelector('#sort-items');

  // Render Category Tabs
  function renderTabs() {
    const categories = storage.getCategories();
    tabsContainer.innerHTML = '';

    // 'All' tab
    const allTab = document.createElement('button');
    allTab.className = `category-tab ${activeCategory === 'all' ? 'active' : ''}`;
    allTab.innerHTML = `<span>✨</span> <span>ALL ITEMS</span>`;
    allTab.addEventListener('click', () => {
      sound.playClick();
      activeCategory = 'all';
      updateGrid();
      renderTabs();
    });
    tabsContainer.appendChild(allTab);

    // Dynamic category tabs
    categories.forEach(cat => {
      const tab = document.createElement('button');
      tab.className = `category-tab ${activeCategory === cat.id ? 'active' : ''}`;
      tab.innerHTML = `<span>${cat.icon || '🏷️'}</span> <span>${cat.name.toUpperCase()}</span>`;
      tab.addEventListener('click', () => {
        sound.playClick();
        activeCategory = cat.id;
        updateGrid();
        renderTabs();
      });
      tabsContainer.appendChild(tab);
    });
  }

  // Filter & Sort Items
  function updateGrid() {
    let items = storage.getItems();

    // 1. Category Filter
    if (activeCategory !== 'all') {
      items = items.filter(item => (item.category || '').toLowerCase() === activeCategory.toLowerCase());
    }

    // 2. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // 3. Rarity Filter
    if (activeRarity !== 'all') {
      items = items.filter(item => (item.rarity || '').toLowerCase() === activeRarity.toLowerCase());
    }

    // 4. Sorting
    if (sortBy === 'price-asc') {
      items.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name-asc') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Render cards
    gridContainer.innerHTML = '';
    if (items.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state">
          <p class="font-silkscreen" style="font-size: 14px; color: var(--accent-orange); margin-bottom: 8px;">
            👻 No Items Found!
          </p>
          <p style="font-size: 12px; color: var(--text-muted);">
            Try modifying your search keywords or switching category filters.
          </p>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = createItemCard(item);
      gridContainer.appendChild(card);
    });
  }

  // Attach search and filter events
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    updateGrid();
  });

  raritySelect.addEventListener('change', (e) => {
    sound.playClick();
    activeRarity = e.target.value;
    updateGrid();
  });

  sortSelect.addEventListener('change', (e) => {
    sound.playClick();
    sortBy = e.target.value;
    updateGrid();
  });

  // Listen to external updates
  window.addEventListener('pl_items_updated', () => updateGrid());
  window.addEventListener('pl_categories_updated', () => {
    renderTabs();
    updateGrid();
  });

  // Initial render
  renderTabs();
  updateGrid();
}
