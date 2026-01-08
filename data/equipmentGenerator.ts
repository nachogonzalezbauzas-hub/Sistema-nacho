import { Equipment, EquipmentType, ItemRarity, StatType } from '../types';
import { RARITY_ORDER } from './equipmentConstants';

// Simple ID generator to avoid external dependency
const generateId = () => Math.random().toString(36).substr(2, 9);

// Base Rarity Weights (Simplified V2.0)
const RARITY_WEIGHTS: Record<ItemRarity, number> = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 0.9,
    mythic: 0.1,
    godlike: 0.01
};

// Stat Ranges by Rarity (ULTRA COMPRESSED V2.1)
// Goal: Equipment is a MINOR supplement. 
// A full day of missions gives +10-15 stats. A legendary item gives ~5-10.
const BASE_STAT_RANGES: Record<ItemRarity, [number, number]> = {
    common: [0, 0],
    uncommon: [0, 1],
    rare: [1, 2],
    epic: [2, 3], // Tightened (v2.1.1)
    legendary: [4, 6], // Tightened (v2.1.1)
    mythic: [8, 12], // Tightened (v2.1.1)
    godlike: [15, 25] // Tightened (v2.1.1)
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

const GENERATOR_VERSION = 21;
console.log(`%c[SYSTEM] Equipment Generator v${GENERATOR_VERSION} initialized`, 'color: #3b82f6; font-weight: bold;');

export const generateEquipment = (type?: EquipmentType, rarityOverride?: ItemRarity, playerLevel: number = 1, difficulty: number = 1, zoneId?: number, options?: { skipGlobalAnimation?: boolean }): Equipment => {
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

        // --- SIMPLIFIED WEIGHT LOGIC V2.0 ---
        if (difficulty >= 100) {
            weights.godlike += 2;
            weights.mythic += 5;
            weights.legendary += 10;
        } else if (difficulty >= 50) {
            weights.mythic += 1;
            weights.legendary += 5;
            weights.epic += 10;
        }

        if (difficulty >= 10) {
            weights.common = Math.max(5, weights.common - difficultyBonus);
            weights.uncommon = Math.max(10, weights.uncommon - difficultyBonus);
            weights.rare += difficultyBonus;
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

    // 5. Generate Stats (V2.1.1 Hardened)
    // Explicit mapping to prevent index-based errors or inflation
    let numStats = 1;
    switch (selectedRarity.toLowerCase().trim()) {
        case 'common':
        case 'uncommon':
            numStats = 1;
            break;
        case 'rare':
        case 'epic':
            numStats = 2; // ENFORCED MAX 2
            break;
        case 'legendary':
        case 'mythic':
            numStats = 3;
            break;
        case 'godlike':
            numStats = 4;
            break;
        default:
            numStats = 1;
    }

    const baseStats = [];
    const availableStats = [...STAT_TYPES];

    for (let i = 0; i < numStats; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats.splice(statIndex, 1)[0];

        // FINAL VALIDATION: Ensure only core stats are ever picked
        if (!STAT_TYPES.includes(stat)) {
            console.error(`[CRITICAL] Illegal stat detected during generation: ${stat}`);
            continue;
        }

        const range = BASE_STAT_RANGES[selectedRarity] || [0, 0];
        const [min, max] = range;

        // Level bonus (ULTRA NERF V2.1): +1 stat every 100 levels
        // Uses 'playerLevel' for scaling, NOT for the item's enhancement level
        const levelBonus = Math.floor(playerLevel * 0.01);
        const finalValue = Math.floor(Math.random() * (max - min + 1)) + min + levelBonus;

        if (finalValue > 0) {
            baseStats.push({ stat, value: finalValue });
        }
    }

    // Default to at least one +0 stat if everything rolled 0 to avoid empty stats array
    if (baseStats.length === 0) {
        baseStats.push({ stat: STAT_TYPES[Math.floor(Math.random() * STAT_TYPES.length)], value: 0 });
    }

    return {
        id: generateId(),
        name,
        type: selectedType,
        rarity: selectedRarity,
        level: 0, // DROPS AT +0 (V2.1.2 Fixed)
        maxLevel: 10, // Default to 10 for safety, constants will override in UI if needed
        baseStats,
        description: `A unique ${selectedRarity} ${selectedType}, forged from the essence of ${prefix}.`,
        image,
        isEquipped: false,
        acquiredAt: new Date().toISOString(),
        v: GENERATOR_VERSION, // VERSION TAG
        ...(options || {})
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
