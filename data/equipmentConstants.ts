import { ItemRarity } from '@/types';

// Max upgrade level by rarity
export const RARITY_MAX_LEVELS: Record<string, number> = {
    common: 3,
    uncommon: 5,
    rare: 7,
    epic: 10,
    legendary: 12,
    mythic: 14,
    godlike: 20
};

// Base shards when salvaging (+ level bonus)
export const SALVAGE_SHARD_VALUES: Record<string, number> = {
    common: 5,
    uncommon: 15,
    rare: 30,
    epic: 60,
    legendary: 120,
    mythic: 250,
    godlike: 1000
};

export const calculateSalvageValue = (rarity: string, level: number): number => {
    const base = SALVAGE_SHARD_VALUES[rarity.toLowerCase()] || 0;
    return base + (level * 2);
};

export const getMaxLevel = (rarity: string): number => {
    return RARITY_MAX_LEVELS[rarity.toLowerCase()] || 10;
};

export const UPGRADE_TIER_COLORS = [
    { name: 'Standard', color: 'border-slate-500', glow: 'shadow-[0_0_10px_rgba(148,163,184,0.1)]', minLevel: 0 },
    { name: 'Refined', color: 'border-green-500', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]', minLevel: 1 },
    { name: 'Superior', color: 'border-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]', minLevel: 3 },
    { name: 'Elite', color: 'border-purple-500', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]', minLevel: 5 },
    { name: 'Masterwork', color: 'border-yellow-500', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.5)]', minLevel: 8 },
    { name: 'Flawless', color: 'border-red-500', glow: 'shadow-[0_0_35px_rgba(239,68,68,0.6)]', minLevel: 10 }
];

export const getUpgradeTier = (level: number) => {
    return [...UPGRADE_TIER_COLORS].reverse().find(t => level >= t.minLevel) || UPGRADE_TIER_COLORS[0];
};

// Rarity order for filtering
export const RARITY_ORDER: string[] = [
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary',
    'mythic',
    'godlike'
];


// Check if rarity A is lower than rarity B
export const isRarityLower = (rarityA: string, minRarity: string): boolean => {
    const indexA = RARITY_ORDER.indexOf(rarityA);
    const indexB = RARITY_ORDER.indexOf(minRarity);
    return indexA < indexB;
};

// Unlock floors for each rarity (Gating System)
export const RARITY_UNLOCK_FLOORS: Record<string, number> = {
    common: 1,
    uncommon: 1,
    rare: 1,
    epic: 20,
    legendary: 50,
    mythic: 100,
    godlike: 200
};

// Power multipliers for equipment
// REBALANCED V2.0: Slightly dampen multipliers to align with compressed stats
export const RARITY_POWER_MULTIPLIERS: Record<string, number> = {
    common: 1,
    uncommon: 1.5,
    rare: 2.5,
    epic: 4,
    legendary: 7,
    mythic: 12,
    godlike: 25
};

// Calculate power for a single item
export const calculateItemPower = (item: { baseStats: { value: number }[], rarity: string }): number => {
    const SCALE = 12; // Global scale factor
    const statSum = item.baseStats.reduce((acc, s) => acc + s.value, 0);
    const rarity = item.rarity?.toLowerCase() || 'common';
    const mult = RARITY_POWER_MULTIPLIERS[rarity] || 1;

    // Formula matching store/selectors.ts
    // Was: breakdown.equipment += Math.floor(statSum * mult * 3) * SCALE;
    return Math.floor(statSum * mult * 3) * SCALE;
};
