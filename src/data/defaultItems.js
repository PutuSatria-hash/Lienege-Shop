// Default Catalog for Pixel Lineage - Wiseman Shop (100% English)

export const DEFAULT_CATEGORIES = [
  { id: 'relic', name: 'Relic', icon: '💎' },
  { id: 'tome', name: 'Tome', icon: '📖' },
  { id: 'sigil', name: 'Sigil', icon: '🔮' },
  { id: 'heartblood', name: 'HeartBlood', icon: '🩸' },
  { id: 'key', name: 'Key', icon: '🗝️' },
  { id: 'weapon', name: 'Weapon', icon: '⚔️' }
];

export const DEFAULT_ITEMS = [
  // --- RELIC ---
  {
    id: 'relic-1',
    name: "Pumpkin Lord's Core",
    category: 'relic',
    price: 125000,
    rarity: 'mythic',
    status: 'In Stock',
    description: 'Cursed burning ember from the Pumpkin King. Emits a mystical violet flame that boosts spell power by 35%.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="10" y="4" width="12" height="4" fill="%232b7a35"/><rect x="14" y="2" width="4" height="4" fill="%2348b556"/><rect x="6" y="8" width="20" height="18" fill="%23ff6e14"/><rect x="8" y="10" width="16" height="14" fill="%23ff8c2e"/><rect x="10" y="12" width="4" height="4" fill="%23ffe869"/><rect x="18" y="12" width="4" height="4" fill="%23ffe869"/><rect x="12" y="18" width="8" height="4" fill="%23ffe869"/><rect x="14" y="20" width="4" height="2" fill="%23ff3a00"/></svg>'
  },
  {
    id: 'relic-2',
    name: 'Spectral Lantern',
    category: 'relic',
    price: 38000,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Wanderer spirit lantern. Illuminates hidden phantoms and invisible dungeon mimics in the harvest realm.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="14" y="4" width="4" height="4" fill="%239a7b56"/><rect x="10" y="8" width="12" height="3" fill="%23d6a858"/><rect x="8" y="11" width="16" height="14" fill="%231a3b45"/><rect x="11" y="13" width="10" height="10" fill="%2372f7e0"/><rect x="13" y="15" width="6" height="6" fill="%23ffffff"/><rect x="10" y="25" width="12" height="3" fill="%23d6a858"/></svg>'
  },
  {
    id: 'relic-3',
    name: 'Ancient Harvest Amulet',
    category: 'relic',
    price: 55000,
    rarity: 'legendary',
    status: 'Limited Stock',
    description: 'Sacred relic of ancient harvest rituals. Grants 50% curse resistance and high mana regeneration.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="12" y="4" width="8" height="3" fill="%23e6b422"/><rect x="8" y="7" width="16" height="3" fill="%23e6b422"/><rect x="10" y="10" width="12" height="14" fill="%239d1bbf"/><rect x="12" y="12" width="8" height="10" fill="%23c94cf2"/><rect x="14" y="14" width="4" height="6" fill="%23fce3ff"/></svg>'
  },

  // --- TOME ---
  {
    id: 'tome-1',
    name: 'Grimoire of the Harvest Moon',
    category: 'tome',
    price: 92000,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Forbidden spellbook sealed beneath lunar eclipses. Unleashes shadow reaping and spectral firestorm.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="6" y="6" width="20" height="20" fill="%23531b75"/><rect x="8" y="8" width="16" height="16" fill="%238531b8"/><rect x="12" y="11" width="8" height="10" fill="%23ffd54f"/><rect x="14" y="13" width="4" height="6" fill="%23130924"/><rect x="6" y="6" width="4" height="20" fill="%23d6a858"/></svg>'
  },
  {
    id: 'tome-2',
    name: 'Tome of Necrotic Flames',
    category: 'tome',
    price: 48000,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Ancient codex of abyssal purple flame. Conjures necrotic fire that burns through physical barriers.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="6" y="6" width="20" height="20" fill="%232b1038"/><rect x="9" y="9" width="15" height="14" fill="%234d1c66"/><rect x="13" y="11" width="7" height="9" fill="%23b83bfa"/><rect x="15" y="13" width="3" height="5" fill="%23ffffff"/></svg>'
  },
  {
    id: 'tome-3',
    name: 'Ghostly Whispers Codex',
    category: 'tome',
    price: 18500,
    rarity: 'rare',
    status: 'In Stock',
    description: 'Collection of ethereal graveyard secrets. Deciphers riddle runes engraved on sealed crypt portals.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="6" y="6" width="20" height="20" fill="%231e3d3b"/><rect x="9" y="8" width="15" height="16" fill="%232c6662"/><rect x="12" y="12" width="9" height="7" fill="%23a8fffa"/></svg>'
  },

  // --- SIGIL ---
  {
    id: 'sigil-1',
    name: 'Mark of the Pumpkin King',
    category: 'sigil',
    price: 105000,
    rarity: 'legendary',
    status: 'Limited Stock',
    description: 'Royal crest of the ruler of Halloween night. Renders wearer immune to stuns and doubles rare loot drop rates.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><circle cx="16" cy="16" r="10" fill="%235a189a"/><rect x="10" y="10" width="12" height="12" fill="%23ff7a18"/><rect x="13" y="13" width="2" height="2" fill="%23130924"/><rect x="17" y="13" width="2" height="2" fill="%23130924"/><rect x="12" y="17" width="8" height="2" fill="%23130924"/></svg>'
  },
  {
    id: 'sigil-2',
    name: 'Blood Moon Sigil',
    category: 'sigil',
    price: 64000,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Crimson lunar glyph. Converts 15% of physical damage dealt into instant health absorption.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="8" y="8" width="16" height="16" fill="%234a0404"/><rect x="10" y="10" width="12" height="12" fill="%23c91818"/><rect x="12" y="12" width="8" height="8" fill="%23ff4d4d"/><rect x="14" y="14" width="4" height="4" fill="%23ffffff"/></svg>'
  },
  {
    id: 'sigil-3',
    name: 'Shadow Stalker Rune',
    category: 'sigil',
    price: 26000,
    rarity: 'rare',
    status: 'In Stock',
    description: 'Stealth movement glyph. Increases movement and sprint speed across dark corridors by 25%.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="9" y="9" width="14" height="14" fill="%231b1429"/><rect x="11" y="11" width="10" height="10" fill="%23564082"/><rect x="13" y="7" width="6" height="18" fill="%239370db"/></svg>'
  },

  // --- HEARTBLOOD ---
  {
    id: 'blood-1',
    name: 'Pure Vampire Heartblood',
    category: 'heartblood',
    price: 175000,
    rarity: 'mythic',
    status: 'In Stock',
    description: 'Pristine essence from the ancient vampire progenitor. Mandatory catalyst for forging god-tier weapons.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="12" y="5" width="8" height="4" fill="%23a88a4d"/><rect x="10" y="9" width="12" height="17" fill="%236e0505"/><rect x="12" y="11" width="8" height="13" fill="%23d60000"/><rect x="14" y="13" width="3" height="6" fill="%23ff6666"/></svg>'
  },
  {
    id: 'blood-2',
    name: 'Corrupted Beast Heartblood',
    category: 'heartblood',
    price: 78000,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Dense ichor harvested from dark forest behemoths. Bestows exceptional physical defense.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="12" y="6" width="8" height="4" fill="%233a3a3a"/><rect x="9" y="10" width="14" height="16" fill="%233b0047"/><rect x="11" y="12" width="10" height="12" fill="%237b0094"/><rect x="13" y="14" width="4" height="5" fill="%23c724eb"/></svg>'
  },
  {
    id: 'blood-3',
    name: "Witch's Brew Blood Elixir",
    category: 'heartblood',
    price: 36000,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Distilled potion crafted by the marsh sorceress. Instantly heals 500 HP and purges all negative status effects.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="13" y="6" width="6" height="3" fill="%23b8782a"/><rect x="10" y="9" width="12" height="16" fill="%23145417"/><rect x="12" y="12" width="8" height="11" fill="%232ae634"/><rect x="14" y="14" width="3" height="4" fill="%23b0ffb5"/></svg>'
  },

  // --- KEY ---
  {
    id: 'key-1',
    name: 'Haunted Castle Dungeon Key',
    category: 'key',
    price: 68000,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Gate key unlocking the Pumpkin Throne Chamber. Required to summon the Event Dungeon Boss.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="10" y="6" width="12" height="10" fill="%23d6a858"/><rect x="13" y="9" width="6" height="4" fill="%23130924"/><rect x="14" y="16" width="4" height="11" fill="%23d6a858"/><rect x="18" y="21" width="4" height="3" fill="%23d6a858"/><rect x="18" y="25" width="4" height="2" fill="%23d6a858"/></svg>'
  },
  {
    id: 'key-2',
    name: 'Crypt Master Key',
    category: 'key',
    price: 32000,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Skull skeleton key granting access to underground catacombs and hidden relic coffers.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><circle cx="16" cy="11" r="5" fill="%23a89fa8"/><rect x="14" y="15" width="4" height="12" fill="%23756d75"/><rect x="18" y="21" width="3" height="3" fill="%23756d75"/></svg>'
  },

  // --- WEAPON ---
  {
    id: 'weapon-1',
    name: 'Scythe of the Hollow Night',
    category: 'weapon',
    price: 220000,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Reaper scythe forged from abyss starlight. Each sweep tears soul rifts in a full 360-degree radius.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="6" y="5" width="18" height="4" fill="%238531b8"/><rect x="20" y="9" width="6" height="6" fill="%23c94cf2"/><rect x="8" y="9" width="3" height="20" fill="%236e5338"/><rect x="9" y="10" width="2" height="18" fill="%23bfa07e"/></svg>'
  },
  {
    id: 'weapon-2',
    name: 'Pumpkin Carver Greatsword',
    category: 'weapon',
    price: 115000,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Serrated greatsword forged of solar flame steel. Unleashes explosive hellfire on critical hits.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="14" y="4" width="4" height="18" fill="%23ff7a18"/><rect x="15" y="5" width="2" height="16" fill="%23ffd54f"/><rect x="10" y="22" width="12" height="3" fill="%233a1f04"/><rect x="15" y="25" width="2" height="5" fill="%23a855f7"/></svg>'
  },
  {
    id: 'weapon-3',
    name: 'Phantom Edge Dagger',
    category: 'weapon',
    price: 52000,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Translucent shadow assassin blade. Ignores 30% of monster armor and lands deadly backstabs.',
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="%23130924"/><rect x="14" y="6" width="4" height="15" fill="%2348bfe3"/><rect x="15" y="7" width="2" height="13" fill="%23ffffff"/><rect x="11" y="21" width="10" height="2" fill="%235c4d7d"/><rect x="15" y="23" width="2" height="5" fill="%232b213a"/></svg>'
  }
];
