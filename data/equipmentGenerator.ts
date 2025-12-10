import { Equipment, EquipmentType, ItemRarity, StatType } from '../types';
import { RARITY_ORDER } from './equipmentConstants';

// Simple ID generator to avoid external dependency
const generateId = () => Math.random().toString(36).substr(2, 9);

// Base Rarity Weights (Standard World)
const RARITY_WEIGHTS: Record<ItemRarity, number> = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 0.9,
    mythic: 0.1,
    godlike: 0.01,
    celestial: 0.001,
    transcendent: 0.0001,
    primordial: 0.00001,
    eternal: 0.000001,
    divine: 0.0000001,
    cosmic: 0.00000001,
    infinite: 0.000000001,

    // Zone Rarities (Default: Near Zero outside their zone)
    magma: 0.0000001,
    abyssal: 0.0000001,
    verdant: 0.0000001,
    storm: 0.0000001,
    lunar: 0.0000001,
    solar: 0.0000001,
    nebula: 0.0000001,
    singularity: 0.0000001,
    nova: 0.0000001,
    cyber: 0.0000001,
    crystal: 0.0000001,
    ethereal: 0.0000001,
    crimson: 0.0000001,
    heavenly: 0.0000001,
    antimatter: 0.0000001,
    temporal: 0.0000001,
    chaotic: 0.0000001,
    void: 0.0000001,
    omega: 0.0000001
};

// Stat Ranges by Rarity
const BASE_STAT_RANGES: Record<ItemRarity, [number, number]> = {
    common: [1, 5],
    uncommon: [5, 10],
    rare: [10, 15],
    epic: [15, 25],
    legendary: [25, 40],
    mythic: [40, 60],
    godlike: [60, 90],
    celestial: [90, 120],            // Floor 120
    transcendent: [120, 160],        // Floor 100? Mapping is loose
    primordial: [160, 200],          // Floor 140

    // Zone 1: Magma (Floor 150)
    magma: [200, 250],

    // Zone 2: Abyssal (Floor 200)
    abyssal: [250, 320],

    // High Tier Generics
    eternal: [320, 380],             // Floor 220
    divine: [380, 450],              // Floor 240

    // Zone 3: Verdant (Floor 250)
    verdant: [450, 520],

    // Zone 4: Storm (Floor 300)
    storm: [520, 600],

    cosmic: [600, 700],              // Floor 320
    infinite: [700, 800],            // Floor 340

    // Zone 5+: High End
    lunar: [800, 950],               // Floor 350
    solar: [950, 1100],              // Floor 400
    nebula: [1100, 1300],            // Floor 450
    singularity: [1300, 1500],       // Floor 500
    nova: [1500, 1800],              // Floor 550

    cyber: [1800, 2100],             // Floor 600
    crystal: [2100, 2500],           // Floor 650
    ethereal: [2500, 3000],          // Floor 700
    crimson: [3000, 3600],           // Floor 750
    heavenly: [3600, 4200],          // Floor 800
    antimatter: [4200, 5000],        // Floor 850
    temporal: [5000, 6000],          // Floor 900
    chaotic: [6000, 7500],           // Floor 950
    void: [7500, 9000],              // Floor 1000
    omega: [9000, 12000]             // Floor 1100+
};

const STAT_TYPES: StatType[] = ['Strength', 'Vitality', 'Agility', 'Intelligence', 'Fortune', 'Metabolism'];

const PREFIXES = [
    'Ancient', 'Broken', 'Cursed', 'Damaged', 'Ethereal', 'Forgotten', 'Glowing', 'Heavy', 'Iron', 'Jagged',
    'Keen', 'Lost', 'Misty', 'Neon', 'Obsidian', 'Pale', 'Quiet', 'Rusty', 'Silent', 'Twisted',
    'Unstable', 'Vibrant', 'Warped', 'Xenon', 'Yielding', 'Zealous', 'Astral', 'Burning', 'Cosmic', 'Dark',
    'Echoing', 'Frozen', 'Grim', 'Hollow', 'Infernal', 'Jade', 'Kinetic', 'Luminous', 'Mystic', 'Null',
    'Omega', 'Primal', 'Quantum', 'Radiant', 'Shadow', 'Temporal', 'Umbral', 'Void', 'Wicked', 'Abyssal',
    'Blazing', 'Celestial', 'Divine', 'Eternal', 'Feral', 'Glorious', 'Holy', 'Infinite', 'Just', 'Karma',
    'Lunar', 'Solar', 'Magma', 'Nebula', 'Omen', 'Phantom', 'Quake', 'Rune', 'Storm', 'Thunder',
    'Undying', 'Vengeful', 'Wild', 'Chaos', 'Flux', 'Gravity', 'Horizon', 'Ivory', 'Jasper', 'Kaiser',
    'Legion', 'Matrix', 'Nexus', 'Oracle', 'Pulse', 'Quasar', 'Reaper', 'Spectre', 'Titan', 'Unity',
    'Vertex', 'Wraith', 'Zenith', 'Apex', 'Bane', 'Core', 'Dusk', 'Edge', 'Fate', 'Gale',
    'Halo', 'Iris', 'Jinx', 'Knell', 'Link', 'Mark', 'Nova', 'Oath', 'Pact', 'Quest',
    'Rift', 'Spark', 'Tide', 'Urge', 'Veil', 'Wake', 'Yore', 'Zone', 'Arc', 'Beam'
];

const ROOTS: Record<EquipmentType, string[]> = {
    weapon: ['Blade', 'Saber', 'Katana', 'Scythe', 'Reaper', 'Edge', 'Fang', 'Claw', 'Talon', 'Razor', 'Spine', 'Needle', 'Thorn', 'Spike', 'Lance', 'Spear', 'Halberd', 'Glaive', 'Bardiche', 'Trident', 'Hammer', 'Mallet', 'Maul', 'Sledge', 'Mace', 'Flail', 'Wand', 'Staff', 'Scepter', 'Rod', 'Cane', 'Stave', 'Bow', 'Crossbow', 'Longbow', 'Shortbow', 'Recurve', 'Compound'],
    helmet: ['Helm', 'Helmet', 'Visor', 'Casque', 'Bascinet', 'Sallet', 'Armet', 'Burgonet', 'Morion', 'Cabasset', 'Cap', 'Hat', 'Hood', 'Cowl', 'Coif', 'Crown', 'Diadem', 'Circlet', 'Tiara', 'Coronet', 'Veil', 'Mask', 'Faceguard', 'Headgear', 'Headdress', 'Laurel', 'Wreath', 'Bandana'],
    chest: ['Armor', 'Plate', 'Mail', 'Cuirass', 'Breastplate', 'Brigandine', 'Hauberk', 'Gambeson', 'Doublet', 'Jerkin', 'Vest', 'Tunic', 'Robe', 'Gown', 'Cloak', 'Cape', 'Mantle', 'Shawl', 'Poncho', 'Suit', 'Gear', 'Rig', 'Harness', 'Shell', 'Carapace', 'Scale', 'Guard', 'Protector'],
    gloves: ['Gloves', 'Gauntlets', 'Mittens', 'Handguards', 'Bracers', 'Vambraces', 'Grips', 'Claws', 'Touch', 'Grasp', 'Reach', 'Hold', 'Fists', 'Knuckles', 'Wraps', 'Bindings', 'Sleeves', 'Cuffs', 'Manacles', 'Shackles', 'Hands', 'Palms', 'Fingers', 'Touchers', 'Feelers'],
    boots: ['Boots', 'Greaves', 'Sabatons', 'Shoes', 'Sandals', 'Slippers', 'Treads', 'Walkers', 'Runners', 'Sprinters', 'Dashers', 'Striders', 'Marchers', 'Kicks', 'Footgear', 'Footwear', 'Leggings', 'Gaiters', 'Spats', 'Anklets', 'Soles', 'Heels', 'Toes', 'Steps', 'Paths'],
    necklace: ['Amulet', 'Pendant', 'Necklace', 'Choker', 'Collar', 'Torc', 'Locket', 'Medallion', 'Talisman', 'Charm', 'Relic', 'Artifact', 'Curio', 'Keepsake', 'Memento', 'Token', 'Symbol', 'Emblem', 'Insignia', 'Badge', 'Mark', 'Sign', 'Seal', 'Ward', 'Guard'],
    ring: ['Ring', 'Band', 'Loop', 'Circlet', 'Halo', 'Coil', 'Spiral', 'Whorl', 'Circle', 'Orbit', 'Sphere', 'Globe', 'Orb', 'Gem', 'Jewel', 'Stone', 'Rock', 'Pebble', 'Shard', 'Fragment', 'Piece', 'Part', 'Segment', 'Section', 'Slice'],
    ring2: ['Ring', 'Band', 'Loop', 'Circlet', 'Halo', 'Coil', 'Spiral', 'Whorl', 'Circle', 'Orbit', 'Sphere', 'Globe', 'Orb', 'Gem', 'Jewel', 'Stone', 'Rock', 'Pebble', 'Shard', 'Fragment', 'Piece', 'Part', 'Segment', 'Section', 'Slice'],
    earrings: ['Earrings', 'Studs', 'Hoops', 'Drops', 'Cuffs', 'Clips', 'Pins', 'Needles', 'Points', 'Spikes', 'Thorns', 'Barbs', 'Hooks', 'Anchors', 'Weights', 'Bubbles', 'Beads', 'Pearls', 'Gems', 'Jewels', 'Stones', 'Rocks', 'Pebbles', 'Shards', 'Fragments']
};

const SUFFIXES = [
    'of the Bear', 'of the Bull', 'of the Cat', 'of the Dragon', 'of the Eagle', 'of the Fox', 'of the Ghost',
    'of the Hawk', 'of the Iron', 'of the Jaguar', 'of the King', 'of the Lion', 'of the Moon', 'of the Night',
    'of the Owl', 'of the Phoenix', 'of the Queen', 'of the Rat', 'of the Snake', 'of the Tiger', 'of the Unicorn',
    'of the Viper', 'of the Wolf', 'of the Xenon', 'of the Yeti', 'of the Zealot', 'of Agony', 'of Blood',
    'of Chaos', 'of Death', 'of Energy', 'of Fire', 'of Glory', 'of Hate', 'of Ice', 'of Justice',
    'of Karma', 'of Life', 'of Magic', 'of Nature', 'of Order', 'of Pain', 'of Quiet', 'of Rage',
    'of Soul', 'of Time', 'of Unity', 'of Void', 'of War', 'of Youth', 'of Zenith', 'of Ash'
];

const DEFAULT_EQUIPMENT_IMAGES: Partial<Record<EquipmentType, string>> = {
    helmet: '/images/equipment/set_item_5.png',
    chest: '/images/equipment/set_item_6.png',
    gloves: '/images/equipment/set_item_2.png',
    boots: '/images/equipment/set_item_4.png',
    necklace: '/images/equipment/set_item_7.png',
    ring: '/images/equipment/set_item_1.png',
    ring2: '/images/equipment/set_item_3.png',
    earrings: '/images/equipment/set_item_8.png',
    weapon: '/images/weapons/Demon_King%27s_Longsword_Icon.webp'
};

const WEAPON_SKINS = [
    { id: 'demon_king_dagger', image: '/images/weapons/Demon_King%27s_Daggers_Icon.webp' },
    { id: 'demon_king_longsword', image: '/images/weapons/Demon_King%27s_Longsword_Icon.webp' },
    { id: 'demonic_plum', image: '/images/weapons/Demonic_Plum_Flower_Sword_Icon.webp' },
    { id: 'moonshadow', image: '/images/weapons/Moonshadow_Icon.webp' },
    { id: 'phoenix_soul', image: '/images/weapons/Phoenix_Soul_Icon.webp' },
    { id: 'scythe', image: '/images/weapons/Shadow_Scythe_Icon.webp' },
    { id: 'skadi', image: '/images/weapons/Skadi_Icon.webp' },
    { id: 'kasaka', image: '/images/weapons/Truth_Kasaka%27s_Venom_Fang_Icon.webp' },
    { id: 'knight_spear', image: '/images/weapons/Truth_Demon_Knight%27s_Spear_Icon.webp' },
    { id: 'huntsman', image: '/images/weapons/The_Huntsman_Icon.webp' },
    { id: 'thetis', image: '/images/weapons/Thetis%27_Grimoire_Icon.webp' },
    { id: 'vulcan', image: '/images/weapons/Vulcan%27s_Rage_Icon.webp' },
    { id: 'winter_fang', image: '/images/weapons/Winter_Fang_Icon.webp' },
    { id: 'zeke', image: '/images/weapons/Zeke%27s_Fragment_Icon.webp' }
];

// Used to map list of names to type? No, existing code used Object.keys(EQUIPMENT_NAMES) which is likely defined elsewhere or legacy.
// We will use Object.keys(ROOTS) instead.

export const generateEquipment = (type?: EquipmentType, rarityOverride?: ItemRarity, level: number = 1, difficulty: number = 1, zoneId?: number): Equipment => {
    // 1. Determine Type
    const possibleTypes = Object.keys(ROOTS) as EquipmentType[];
    const selectedType = type || possibleTypes[Math.floor(Math.random() * possibleTypes.length)];

    // 2. Determine Rarity
    let selectedRarity: ItemRarity = 'common';
    if (rarityOverride) {
        selectedRarity = rarityOverride;
    } else {
        const difficultyBonus = (difficulty - 1) * 5;
        const rand = Math.random() * 100;

        const weights = { ...RARITY_WEIGHTS };

        // --- ZONE BOOST LOGIC ---
        // Boost rarities based on Zone ID OR Difficulty Thresholds

        // 1. Explicit Zone ID Boost (Strongest)
        if (zoneId) {
            if (zoneId >= 2) weights.magma += 10;
            if (zoneId >= 3) weights.abyssal += 10;
            if (zoneId >= 4) weights.verdant += 10;
            if (zoneId >= 5) weights.storm += 10;
            if (zoneId >= 6) weights.lunar += 10;
            if (zoneId >= 7) weights.solar += 10;
            if (zoneId >= 8) weights.nebula += 10;
            if (zoneId >= 9) weights.singularity += 10;
            if (zoneId >= 10) weights.nova += 10;
            // ... extend as needed
        }
        // 2. Difficulty Auto-Scale (Fallback)
        else {
            if (difficulty >= 150) weights.magma += 5;
            if (difficulty >= 200) weights.abyssal += 5;
            if (difficulty >= 250) weights.verdant += 5;
            if (difficulty >= 300) weights.storm += 5;
            if (difficulty >= 350) weights.lunar += 5;
            if (difficulty >= 400) weights.solar += 5;
            if (difficulty >= 450) weights.nebula += 5;
            if (difficulty >= 500) weights.singularity += 5;
            if (difficulty >= 550) weights.nova += 5;
            if (difficulty >= 600) weights.cyber += 5;
            if (difficulty >= 1100) weights.omega += 5;
        }

        if (difficulty >= 3) {
            weights.common = Math.max(0, weights.common - difficultyBonus);
            weights.uncommon = Math.max(0, weights.uncommon - difficultyBonus);
            weights.rare += difficultyBonus;
            weights.epic += difficultyBonus / 2;
        }
        if (difficulty >= 50) {
            weights.legendary += 5;
            weights.mythic += 2;
        }
        if (difficulty >= 100) {
            weights.godlike += 2;
        }

        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let currentWeight = 0;

        // Random roll
        const limit = Math.random() * totalWeight;

        for (const [r, weight] of Object.entries(weights)) {
            currentWeight += weight;
            if (limit <= currentWeight) {
                selectedRarity = r as ItemRarity;
                break;
            }
        }
    }

    // 3. Generate Name (Prefix + Root + Suffix)
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const rootList = ROOTS[selectedType];
    const root = rootList[Math.floor(Math.random() * rootList.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];

    const nameRoll = Math.random();
    let name = '';
    if (nameRoll < 0.4) {
        name = `${prefix} ${root} ${suffix}`;
    } else if (nameRoll < 0.7) {
        name = `${prefix} ${root}`;
    } else {
        name = `${root} ${suffix}`;
    }

    // 4. Determine Image
    let image = DEFAULT_EQUIPMENT_IMAGES[selectedType] || DEFAULT_EQUIPMENT_IMAGES.chest;
    if (selectedType === 'weapon') {
        const skin = WEAPON_SKINS[Math.floor(Math.random() * WEAPON_SKINS.length)];
        image = skin.image;
    }

    // 5. Generate Stats
    // Number of stats scales with rarity
    let numStats = 1;
    const rIndex = RARITY_ORDER.indexOf(selectedRarity);
    if (rIndex > 0) numStats = 2; // Uncommon
    if (rIndex > 2) numStats = 3; // Epic
    if (rIndex > 4) numStats = 4; // Legendary
    if (rIndex > 5) numStats = 5; // Mythic+
    if (rIndex > 10) numStats = 6; // Zone+

    const baseStats = [];
    const availableStats = [...STAT_TYPES];

    for (let i = 0; i < numStats; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats.splice(statIndex, 1)[0];

        // Safety fallback if rarity missing from ranges
        const range = BASE_STAT_RANGES[selectedRarity] || [5, 10];
        const [min, max] = range;

        // Add random variance based on level
        const levelBonus = Math.min(10, Math.floor(level * 0.2));
        const finalValue = Math.floor(Math.random() * (max - min + 1)) + min + levelBonus;

        baseStats.push({ stat, value: finalValue });
    }

    return {
        id: generateId(),
        name,
        type: selectedType,
        rarity: selectedRarity,
        level: level,
        maxLevel: 10 + Math.floor(level / 5),
        baseStats,
        description: `A unique ${selectedRarity} ${selectedType}, forged from the essence of ${prefix}.`,
        image,
        isEquipped: false,
        acquiredAt: new Date().toISOString()
    };
};

export const generateSetEquipment = (): Equipment[] => {
    const setImages = [
        '/images/equipment/set_item_5.png', // Helmet
        '/images/equipment/set_item_6.png', // Chest
        '/images/equipment/set_item_2.png', // Gloves
        '/images/equipment/set_item_4.png', // Boots
        '/images/equipment/set_item_7.png', // Necklace
        '/images/equipment/set_item_1.png', // Ring 1
        '/images/equipment/set_item_3.png', // Ring 2
        '/images/equipment/set_item_8.png'  // Earrings
    ];

    const equipmentTypes: EquipmentType[] = ['helmet', 'chest', 'gloves', 'boots', 'necklace', 'ring', 'ring2', 'earrings'];
    const setNames = ['Shadow Monarch\'s Crown', 'Shadow Monarch\'s Armor', 'Shadow Monarch\'s Gauntlets', 'Shadow Monarch\'s Greaves', 'Shadow Monarch\'s Pendant', 'Shadow Monarch\'s Signet', 'Shadow Monarch\'s Band', 'Shadow Monarch\'s Earrings'];

    return setImages.map((image, index) => {
        const type = equipmentTypes[index];
        const name = setNames[index];

        return {
            id: generateId(),
            name,
            type,
            rarity: 'mythic',
            level: 1,
            maxLevel: 10,
            baseStats: [
                { stat: 'Strength', value: 10 },
                { stat: 'Agility', value: 10 },
                { stat: 'Intelligence', value: 10 },
                { stat: 'Vitality', value: 10 },
                { stat: 'Fortune', value: 10 }
            ],
            description: 'Part of the legendary Shadow Monarch set.',
            image,
            isEquipped: false,
            acquiredAt: new Date().toISOString(),
            setId: 'shadow_monarch_set'
        };
    });
};
