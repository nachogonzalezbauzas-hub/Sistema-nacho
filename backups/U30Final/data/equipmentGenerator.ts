import { Equipment, EquipmentType, ItemRarity, StatType } from '../types';

// Simple ID generator to avoid external dependency
const generateId = () => Math.random().toString(36).substr(2, 9);

const RARITY_WEIGHTS: Record<ItemRarity, number> = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 0.9,
    mythic: 0.1,
    godlike: 0.01
};

const STAT_TYPES: StatType[] = ['Strength', 'Vitality', 'Agility', 'Intelligence', 'Fortune', 'Metabolism'];

const EQUIPMENT_NAMES: Record<EquipmentType, string[]> = {
    weapon: ['Sword', 'Dagger', 'Scythe', 'Spear', 'Axe', 'Staff', 'Blade'],
    helmet: ['Helm', 'Cowl', 'Visor', 'Hood', 'Crown', 'Mask'],
    chest: ['Armor', 'Plate', 'Robe', 'Vest', 'Tunic', 'Cuirass'],
    gloves: ['Gauntlets', 'Gloves', 'Grips', 'Handguards', 'Bracers'],
    boots: ['Boots', 'Greaves', 'Shoes', 'Sandals', 'Treads'],
    necklace: ['Amulet', 'Pendant', 'Choker', 'Necklace', 'Talisman'],
    ring: ['Ring', 'Band', 'Signet', 'Loop', 'Coil']
};

const ADJECTIVES: Record<ItemRarity, string[]> = {
    common: ['Rusty', 'Worn', 'Simple', 'Basic', 'Old'],
    uncommon: ['Polished', 'Sturdy', 'Fine', 'Reinforced', 'Sharp'],
    rare: ['Gleaming', 'Hardened', 'Superior', 'Deadly', 'Arcane'],
    epic: ['Radiant', 'Masterwork', 'Elite', 'Shadow', 'Cursed'],
    legendary: ['Divine', 'Eternal', 'Godly', 'Monarch\'s', 'Abyssal'],
    mythic: ['System', 'Creator\'s', 'Infinite', 'Omnipotent'],
    godlike: ['Transcendent', 'Absolute', 'Singular']
};

const BASE_STAT_RANGES: Record<ItemRarity, [number, number]> = {
    common: [1, 1],
    uncommon: [1, 2],
    rare: [2, 3],
    epic: [3, 4],
    legendary: [4, 5],
    mythic: [5, 5],
    godlike: [5, 5]
};

export const generateEquipment = (type?: EquipmentType, rarityOverride?: ItemRarity, level: number = 1, difficulty: number = 1): Equipment => {
    const selectedType = type || (Object.keys(EQUIPMENT_NAMES)[Math.floor(Math.random() * 7)] as EquipmentType);

    let selectedRarity: ItemRarity = 'common';
    if (rarityOverride) {
        selectedRarity = rarityOverride;
    } else {
        // Difficulty scales rarity chance
        // Difficulty 1: Base
        // Difficulty 5: Much higher chance for rare+
        const difficultyBonus = (difficulty - 1) * 5;

        const rand = Math.random() * 100;
        let cumulative = 0;

        // Adjust weights based on difficulty
        const weights = { ...RARITY_WEIGHTS };
        if (difficulty >= 3) {
            weights.common = Math.max(0, weights.common - difficultyBonus);
            weights.uncommon = Math.max(0, weights.uncommon - difficultyBonus);
            weights.rare += difficultyBonus;
            weights.epic += difficultyBonus / 2;
        }
        if (difficulty >= 5) {
            weights.legendary += 2;
            weights.mythic += 0.5;
        }

        // Normalize weights
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

        let currentWeight = 0;
        for (const [r, weight] of Object.entries(weights)) {
            currentWeight += (weight / totalWeight) * 100;
            if (rand <= currentWeight) {
                selectedRarity = r as ItemRarity;
                break;
            }
        }
    }

    const nameBase = EQUIPMENT_NAMES[selectedType][Math.floor(Math.random() * EQUIPMENT_NAMES[selectedType].length)];
    const adjective = ADJECTIVES[selectedRarity][Math.floor(Math.random() * ADJECTIVES[selectedRarity].length)];
    const name = `${adjective} ${nameBase}`;

    const numStats = selectedRarity === 'common' ? 1 :
        selectedRarity === 'uncommon' ? 2 :
            selectedRarity === 'rare' ? 3 :
                selectedRarity === 'epic' ? 4 : 5;

    const baseStats = [];
    const availableStats = [...STAT_TYPES];

    for (let i = 0; i < numStats; i++) {
        if (availableStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * availableStats.length);
        const stat = availableStats.splice(statIndex, 1)[0];

        const [min, max] = BASE_STAT_RANGES[selectedRarity];

        // REMOVED MULTIPLIERS to keep stats within 1-5 range as requested
        const finalValue = Math.floor(Math.random() * (max - min + 1)) + min;

        baseStats.push({ stat, value: finalValue });
    }

    return {
        id: generateId(),
        name,
        type: selectedType,
        rarity: selectedRarity,
        level: 0,
        maxLevel: 10, // Default max level
        baseStats,
        description: `A ${selectedRarity} ${selectedType} imbued with power.`,
        isEquipped: false,
        acquiredAt: new Date().toISOString()
    };
};
