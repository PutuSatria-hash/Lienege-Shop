// Authentic Product Catalog for Pixel Lineage - Wiseman Shop
// All items mapped directly to 47 Remastered HD 512x512 Assets

export const DEFAULT_CATEGORIES = [
  { id: 'tome', name: 'Tome', icon: '📖' },
  { id: 'heartblood', name: 'HeartBlood', icon: '🩸' },
  { id: 'heirloom', name: 'Heirloom', icon: '👑' },
  { id: 'sigil', name: 'Sigil', icon: '🔮' },
  { id: 'relic', name: 'Relic & Bloodline', icon: '💎' },
  { id: 'weapon', name: 'Weapon', icon: '⚔️' }
];

export const DEFAULT_ITEMS = [
  // =========================================================================
  // 1. TOMES (All 2,500,000 Gold)
  // =========================================================================
  {
    id: 'tome-archon',
    name: 'Tome of Archon',
    category: 'tome',
    price: 2500000,
    stock: 15,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Forbidden spellbook sealed with sacred geometric glyphs. Unleashes golden celestial judgment beams.',
    image: '/icons/TOME%20OF%20ARCHON.png'
  },
  {
    id: 'tome-aegis',
    name: 'Tome of Aegis',
    category: 'tome',
    price: 2500000,
    stock: 12,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Protective scripture summoning orbiting runic barrier shields that deflect incoming hostile projectiles.',
    image: '/icons/TOME%20OF%20AEGIS.png'
  },
  {
    id: 'tome-bloodreaver',
    name: 'Tome of Bloodreaver',
    category: 'tome',
    price: 2500000,
    stock: 10,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Ancient crimson codex. Siphons enemy life force and converts 30% of spell damage into player health.',
    image: '/icons/TOME%20OF%20BLOODREAVER.png'
  },
  {
    id: 'tome-doomcaller',
    name: 'Tome of Doomcaller',
    category: 'tome',
    price: 2500000,
    stock: 8,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Apocalyptic scripture summoning abyssal void meteors that crush heavy defensive stances.',
    image: '/icons/TOME%20OF%20DOOMCALLER.png'
  },
  {
    id: 'tome-dreadcaptain',
    name: 'Tome of Dreadcaptain',
    category: 'tome',
    price: 2500000,
    stock: 7,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Naval corsair grimoire commanding phantom spectral cannons and oceanic tempest winds.',
    image: '/icons/TOME%20OF%20DREADCAPTAIN.png'
  },
  {
    id: 'tome-godshot',
    name: 'Tome of Godshot',
    category: 'tome',
    price: 2500000,
    stock: 9,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Sniper incantation manual for celestial archers. Guarantees 100% piercing critical hit on first strike.',
    image: '/icons/TOME%20OF%20GODSHOT.png'
  },
  {
    id: 'tome-reaper',
    name: 'Tome of Reaper',
    category: 'tome',
    price: 2500000,
    stock: 5,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Death grimoire forged under a blood moon. Executes targets below 25% health in a blast of nether flames.',
    image: '/icons/TOME%20OF%20REAPER.png'
  },
  {
    id: 'tome-seraph',
    name: 'Tome of Seraph',
    category: 'tome',
    price: 2500000,
    stock: 6,
    rarity: 'mythic',
    status: 'In Stock',
    description: 'Divine angelic manuscript radiating holy auras that cleanse lethal curses and heal allies.',
    image: '/icons/TOME%20OF%20SERAPH.png'
  },
  {
    id: 'tome-shadowbreaker',
    name: 'Tome of Shadowbreaker',
    category: 'tome',
    price: 2500000,
    stock: 11,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Anti-magic manual dispelling dark illusions and shattering shadow armor barriers.',
    image: '/icons/TOME%20OF%20SHADOWBREAKER.png'
  },
  {
    id: 'tome-shura',
    name: 'Tome of Shura',
    category: 'tome',
    price: 2500000,
    stock: 8,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Ferocious combat manual unleashing dual-blade berserker flurry strikes with hyper-armor.',
    image: '/icons/TOME%20OF%20SHURA.png'
  },
  {
    id: 'tome-stormhawk',
    name: 'Tome of Stormhawk',
    category: 'tome',
    price: 2500000,
    stock: 14,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Avian lightning manuscript calling down relentless chain-lightning bolts across the battlefield.',
    image: '/icons/TOME%20OF%20STORMHAWK.png'
  },
  {
    id: 'tome-undespited',
    name: 'Tome of Undespited',
    category: 'tome',
    price: 2500000,
    stock: 10,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Unstoppable willpower text preventing knockdown or displacement effects from heavy dungeon bosses.',
    image: '/icons/TOME%20OF%20UNDESPITED.png'
  },
  {
    id: 'tome-virtuose',
    name: 'Tome of Virtuose',
    category: 'tome',
    price: 2500000,
    stock: 12,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Maestro scripture accelerating spell cooldowns and enabling seamless arcane combo chaining.',
    image: '/icons/TOME%20OF%20VIRTUOSE.png'
  },
  {
    id: 'tome-worldcleaver',
    name: 'Tome of Worldcleaver',
    category: 'tome',
    price: 2500000,
    stock: 7,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Colossal earthshaker grimoire cleaving tectonic rifts that stun and rupture groups of enemies.',
    image: '/icons/TOME%20OF%20WORLDCLEAVER.png'
  },

  // =========================================================================
  // 2. HEARTBLOODS & BLOODLINE POUCHES
  // Asborn & Tideborn: 5,000,000 Gold | Ordinary: 2,400,000 Gold
  // =========================================================================
  {
    id: 'hb-asborn',
    name: 'Asborn Heartblood',
    category: 'heartblood',
    price: 5000000,
    stock: 6,
    rarity: 'mythic',
    status: 'In Stock',
    description: 'Burning primordial core flask. Permanently enhances flame affinity and unlocks Asborn racial passives.',
    image: '/icons/ASBORN%20HEARTBLOOD.png'
  },
  {
    id: 'hb-tideborn',
    name: 'Tideborn Bloodline',
    category: 'heartblood',
    price: 5000000,
    stock: 5,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Abyssal ocean lineage crest. Grants water breathing, swift aquatic mobility, and tidal surge magic.',
    image: '/icons/TIDEBORN%20BLOODLINE.png'
  },
  {
    id: 'hb-goblin',
    name: 'Goblin Heartblood',
    category: 'heartblood',
    price: 2400000,
    stock: 15,
    rarity: 'rare',
    status: 'In Stock',
    description: 'Mischievous green goblin catalyst. Grants +50% loot acquisition distance and merchant barter discounts.',
    image: '/icons/GOBLIN%20HEARTBLOOD.png'
  },
  {
    id: 'hb-goblin-pouch',
    name: 'Goblin Bloodline Pouch',
    category: 'heartblood',
    price: 2400000,
    stock: 18,
    rarity: 'rare',
    status: 'In Stock',
    description: 'Sealed leather pouch containing pure goblin lineage essence. Boosts gold drop rate from dungeon mobs.',
    image: '/icons/GOBLIN.png'
  },
  {
    id: 'hb-human-pouch',
    name: 'Human Bloodline Pouch',
    category: 'heartblood',
    price: 2400000,
    stock: 20,
    rarity: 'common',
    status: 'In Stock',
    description: 'Standard versatile human lineage pouch. Provides balanced +15% bonus across all core physical attributes.',
    image: '/icons/HUMAN.png'
  },
  {
    id: 'hb-dullhan',
    name: 'Dullhan Heartblood',
    category: 'heartblood',
    price: 2400000,
    stock: 8,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Headless knight essence bottle. Imbues attacks with necrotic decay that drains target mana.',
    image: '/icons/DULLHAN%20HEARTBLOOD.png'
  },
  {
    id: 'hb-mushroom',
    name: 'Mushroom Heartblood',
    category: 'heartblood',
    price: 2400000,
    stock: 12,
    rarity: 'rare',
    status: 'In Stock',
    description: 'Spore-infused fungi elixir. Releases toxic defensive clouds when struck and regenerates health over time.',
    image: '/icons/MUSHROOM%20HEARTBLOD.png'
  },
  {
    id: 'hb-slime',
    name: 'Slime Heartblood',
    category: 'heartblood',
    price: 2400000,
    stock: 16,
    rarity: 'rare',
    status: 'In Stock',
    description: 'Viscous gelatinous elixir. Grants bouncy terrain mobility and complete immunity to fall damage.',
    image: '/icons/SLIME%20HEAERTBLOOD.png'
  },

  // =========================================================================
  // 3. HEIRLOOMS (All 10,000,000 Gold)
  // =========================================================================
  {
    id: 'heir-celestine',
    name: 'Celestine Heirloom',
    category: 'heirloom',
    price: 10000000,
    stock: 4,
    rarity: 'legendary',
    status: 'Limited Stock',
    description: 'Ancient blessed crest shielding the wearer from catastrophic critical strikes and curse debuffs.',
    image: '/icons/CELESTINE%20HEIRLOOM.png'
  },
  {
    id: 'heir-seraph',
    name: 'Seraph Heirloom',
    category: 'heirloom',
    price: 10000000,
    stock: 3,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Holy angelic talisman. Automatically resurrects fallen warrior once with 50% max HP and divine shield.',
    image: '/icons/SERAPH%20HEIRLOOM.png'
  },
  {
    id: 'heir-slime',
    name: 'Slime Heirloom',
    category: 'heirloom',
    price: 10000000,
    stock: 5,
    rarity: 'legendary',
    status: 'Limited Stock',
    description: 'Mythical crown of the Slime Sovereign. Absorbs 40% of incoming physical blunt force and multiplies max HP.',
    image: '/icons/SLIME%20HEIRLOOM.png'
  },

  // =========================================================================
  // 4. SIGILS (All 2,300,000 Gold)
  // =========================================================================
  {
    id: 'sigil-aegis',
    name: 'Sigil of Aegis',
    category: 'sigil',
    price: 2300000,
    stock: 14,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Golden shield medallion. Increases passive defense by 40% and absorbs 250 damage every 15 seconds.',
    image: '/icons/SIGIL%20OF%20AEGIS.png'
  },
  {
    id: 'sigil-banshee',
    name: 'Sigil of Banshee',
    category: 'sigil',
    price: 2300000,
    stock: 9,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Haunting spirit crest. Releases ear-piercing sonic screams that disorient and silence enemy casters.',
    image: '/icons/SIGIL%20OF%20BANSHEE.png'
  },
  {
    id: 'sigil-beastlord',
    name: 'Sigil of Beastlord',
    category: 'sigil',
    price: 2300000,
    stock: 8,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Primal beast crest. Boosts raw melee attack speed by 30% and empowers ferocious claw strikes.',
    image: '/icons/SIGIL%20OF%20BEASTLORD.png'
  },
  {
    id: 'sigil-doomcaller',
    name: 'Sigil of Doomcaller',
    category: 'sigil',
    price: 2300000,
    stock: 7,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Dark obsidian sigil that inflicts lingering shadow burn upon any enemy hitting the wearer.',
    image: '/icons/SIGIL%20OF%20DOOMCALLER.png'
  },
  {
    id: 'sigil-dreadcaptain',
    name: 'Sigil of Dreadcaptain',
    category: 'sigil',
    price: 2300000,
    stock: 8,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Weathered pirate emblem. Grants critical strike bonuses and temporary immunity to crowd control.',
    image: '/icons/SIGIL%20OF%20DREADCAPTAIN.png'
  },
  {
    id: 'sigil-reaper',
    name: 'Sigil of Reaper',
    category: 'sigil',
    price: 2300000,
    stock: 6,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Obsidian token bearing purple scythe mark. Slain monsters drop double souls and rare crafting mats.',
    image: '/icons/SIGIL%20OF%20REAPER.png'
  },
  {
    id: 'sigil-seraph',
    name: 'Sigil of Seraph',
    category: 'sigil',
    price: 2300000,
    stock: 5,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Six-winged holy crest. Emits a continuous radiant aura that blinds encroaching demon foes.',
    image: '/icons/SIGIL%20OF%20SERAPH.png'
  },
  {
    id: 'sigil-shadowbreaker',
    name: 'Sigil of Shadowbreaker',
    category: 'sigil',
    price: 2300000,
    stock: 10,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Radiant silver talisman. Penetrates 35% of enemy magic resistance with holy light bursts.',
    image: '/icons/SIGIL%20OF%20SHADOWBREAKER.png'
  },
  {
    id: 'sigil-shura',
    name: 'Sigil of Shura',
    category: 'sigil',
    price: 2300000,
    stock: 7,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'War god medallion. Grants stacking attack power each time damage is taken in prolonged combat.',
    image: '/icons/SIGIL%20OF%20SHURA.png'
  },
  {
    id: 'sigil-songweaver',
    name: 'Sigil of Songweaver',
    category: 'sigil',
    price: 2300000,
    stock: 11,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Harmonic melody badge. Regenerates party member stamina and mana at an accelerated rate.',
    image: '/icons/SIGIL%20OF%20SONGWEAVER.png'
  },
  {
    id: 'sigil-stormhawk',
    name: 'Sigil of Stormhawk',
    category: 'sigil',
    price: 2300000,
    stock: 12,
    rarity: 'rare',
    status: 'In Stock',
    description: 'Feathered lightning insignia. Grants rapid dash teleportation with trailing electrical shockwaves.',
    image: '/icons/SIGIL%20OF%20STORMHAWK.png'
  },
  {
    id: 'sigil-tracendent',
    name: 'Sigil of Tracendent',
    category: 'sigil',
    price: 2300000,
    stock: 4,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Enlightened cosmic rune. Unlocks the seventh chakra, elevating all skill ranks by +2 levels.',
    image: '/icons/SIGIL%20OF%20TRACENDENT.png'
  },
  {
    id: 'sigil-undespited',
    name: 'Sigil of Undespited',
    category: 'sigil',
    price: 2300000,
    stock: 9,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Unyielding titanium crest. Reduces physical stun duration by 60% and increases armor tenacity.',
    image: '/icons/SIGIL%20OF%20UNDESPITED.png'
  },
  {
    id: 'sigil-virtuosi',
    name: 'Sigil of Virtuosi',
    category: 'sigil',
    price: 2300000,
    stock: 11,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Precision artisan insignia. Grants 100% weapon stability and eliminates spellcasting interruptions.',
    image: '/icons/SIGIL%20OF%20VIRTUOSI.png'
  },
  {
    id: 'sigil-worldcleaver',
    name: 'Sigil of Worldcleaver',
    category: 'sigil',
    price: 2300000,
    stock: 8,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Shattered continent symbol. Converts 20% of all outgoing attack damage into armor-piercing true damage.',
    image: '/icons/SIGIL%20OF%20WORLDCLEAVER.png'
  },

  // =========================================================================
  // 5. RELICS & BLOODLINES
  // =========================================================================
  {
    id: 'relic-vesper',
    name: 'Vesper Bloodline',
    category: 'relic',
    price: 3500000,
    stock: 6,
    rarity: 'mythic',
    status: 'In Stock',
    description: 'Noble lineage bloodline marked with lunar crescent. Grants dark magic amplification and silent step.',
    image: '/icons/VESPER%20BLOODLINE.png'
  },
  {
    id: 'relic-stonekin',
    name: 'Stonekin Bloodline',
    category: 'relic',
    price: 3500000,
    stock: 8,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Ancestral diamond-heart crest. Bestows immense physical hyper-armor against dungeon boss stuns.',
    image: '/icons/STONEKIN%20BLOODLINE.png'
  },
  {
    id: 'relic-sylvan',
    name: 'Sylvan Bloodline',
    category: 'relic',
    price: 3500000,
    stock: 7,
    rarity: 'legendary',
    status: 'In Stock',
    description: 'Ancient elven woodland lineage. Enhances nature spell potency and accelerates running speed in dungeons.',
    image: '/icons/SYLVAN%20BLOODLINE.png'
  },
  {
    id: 'relic-soul-essence',
    name: 'Soul Essence',
    category: 'relic',
    price: 1200000,
    stock: 24,
    rarity: 'epic',
    status: 'In Stock',
    description: 'Ethereal flask brimming with glowing soul mist. Mandatory catalyst for enchanting high-tier equipment.',
    image: '/icons/SOUL%20ESSENCE.png'
  },
  {
    id: 'relic-eye-of-hollow',
    name: 'Eye of Hollow',
    category: 'relic',
    price: 4500000,
    stock: 3,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Sentient abyss talisman. Reveals hidden dungeon pathways and grants true-sight over invisible foes.',
    image: '/icons/EYE%20OF%20HOLLOW.png'
  },

  // =========================================================================
  // 6. WEAPONS
  // =========================================================================
  {
    id: 'weapon-fatebrand',
    name: 'Fatebrand',
    category: 'weapon',
    price: 8500000,
    stock: 3,
    rarity: 'mythic',
    status: 'Limited Stock',
    description: 'Legendary wand staff crowned with solar ember crystal. Channels devastating continuous beam lasers.',
    image: '/icons/FATEBRAND.png'
  }
];
