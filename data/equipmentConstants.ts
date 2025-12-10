import { ItemRarity } from '@/types';

// Max upgrade level by rarity
export const RARITY_MAX_LEVELS: Record<string, number> = {
    common: 3,
    uncommon: 5,
    rare: 7,
    epic: 10,
    legendary: 12,
    mythic: 14,
    godlike: 16,
    celestial: 18,
    transcendent: 20,
    // Zone rarities
    magma: 22,
    abyssal: 24,
    verdant: 26,
    storm: 28,
    lunar: 30,
    solar: 32,
    nebula: 34,
    singularity: 36,
    nova: 38,
    cyber: 40,
    crystal: 42,
    ethereal: 44,
    crimson: 46,
    heavenly: 48,
    antimatter: 50,
    temporal: 52,
    chaotic: 54,
    void: 56,
    omega: 60
};

// Base shards when salvaging (+ level bonus)
export const SALVAGE_SHARD_VALUES: Record<string, number> = {
    common: 5,
    uncommon: 15,
    rare: 30,
    epic: 60,
    legendary: 120,
    mythic: 250,
    godlike: 500,
    celestial: 1000,
    transcendent: 2000,
    // Zone rarities
    magma: 4000,
    abyssal: 8000,
    verdant: 16000,
    storm: 32000,
    lunar: 64000,
    solar: 128000,
    nebula: 256000,
    singularity: 512000,
    nova: 1000000,
    cyber: 2000000,
    crystal: 4000000,
    ethereal: 8000000,
    crimson: 16000000,
    heavenly: 32000000,
    antimatter: 64000000,
    temporal: 128000000,
    chaotic: 256000000,
    void: 512000000,
    omega: 1000000000
};

// Calculate salvage value for an item
export const calculateSalvageValue = (rarity: string, level: number): number => {
    const baseValue = SALVAGE_SHARD_VALUES[rarity] || 5;
    const levelBonus = level * 20;
    return baseValue + levelBonus;
};

// Get max level for a rarity
export const getMaxLevel = (rarity: string): number => {
    return RARITY_MAX_LEVELS[rarity] || 20;
};

// Upgrade tier colors (border color based on level)
export const UPGRADE_TIER_COLORS = [
    { minLevel: 0, color: 'border-slate-600', glow: '', name: 'Base' },              // +0-4: Gray
    { minLevel: 5, color: 'border-green-500', glow: 'shadow-[0_0_8px_rgba(34,197,94,0.4)]', name: 'Enhanced' },   // +5-9: Green
    { minLevel: 10, color: 'border-blue-500', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]', name: 'Superior' },  // +10-14: Blue
    { minLevel: 15, color: 'border-purple-500', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]', name: 'Epic' },    // +15-19: Purple
    { minLevel: 20, color: 'border-yellow-500', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.6)]', name: 'Legendary' }, // +20-24: Gold
    { minLevel: 25, color: 'border-red-500', glow: 'shadow-[0_0_18px_rgba(239,68,68,0.6)]', name: 'Mythic' },     // +25-29: Red
    { minLevel: 30, color: 'border-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-border', glow: 'shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-pulse', name: 'Transcendent' }, // +30+: Rainbow
    { minLevel: 35, color: 'border-orange-500', glow: 'shadow-[0_0_22px_rgba(249,115,22,0.7)] animate-pulse', name: 'Cosmic' },
    { minLevel: 40, color: 'border-fuchsia-500', glow: 'shadow-[0_0_25px_rgba(217,70,239,0.7)] animate-pulse', name: 'Infinite' },
    { minLevel: 45, color: 'border-rose-600', glow: 'shadow-[0_0_28px_rgba(225,29,72,0.8)] animate-pulse', name: 'Divine' },
    { minLevel: 50, color: 'border-cyan-400', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.8)] animate-pulse', name: 'Eternal' },
    { minLevel: 60, color: 'border-indigo-500 bg-black', glow: 'shadow-[0_0_40px_rgba(99,102,241,1)] animate-pulse', name: 'Omega' }
];

// Get upgrade tier for item level
export const getUpgradeTier = (level: number) => {
    let tier = UPGRADE_TIER_COLORS[0];
    for (const t of UPGRADE_TIER_COLORS) {
        if (level >= t.minLevel) {
            tier = t;
        } else {
            break;
        }
    }
    return tier;
};

// Rarity order for filtering
export const RARITY_ORDER: string[] = [
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary',
    'mythic',
    'godlike',
    'celestial',
    'transcendent',
    'magma',
    'abyssal',
    'verdant',
    'storm',
    'lunar',
    'solar',
    'nebula',
    'singularity',
    'nova',
    'cyber',
    'crystal',
    'ethereal',
    'crimson',
    'heavenly',
    'antimatter',
    'temporal',
    'chaotic',
    'void',
    'omega'
];


// Check if rarity A is lower than rarity B
export const isRarityLower = (rarityA: string, minRarity: string): boolean => {
    const indexA = RARITY_ORDER.indexOf(rarityA);
    const indexB = RARITY_ORDER.indexOf(minRarity);
    return indexA < indexB;
};

// Unlock floors for each rarity (Gating System)
// Unlock floors for each rarity (Gating System)
// Adjusted for logical progression: Godlike -> Transcendent -> Celestial -> Zone Rarities
export const RARITY_UNLOCK_FLOORS: Record<string, number> = {
    common: 1,
    uncommon: 1,
    rare: 1,
    epic: 20,
    legendary: 40,
    mythic: 50,
    godlike: 80,
    transcendent: 100,
    celestial: 120,
    primordial: 140, // Bridge to Zone 2

    // Zone 2: Volcanic (150-200)
    magma: 150,

    // Zone 3: Abyssal (200-250)
    abyssal: 200,

    // High Tier Generics (PUSHED BACK to avoid pollution)
    eternal: 220,
    divine: 240,

    // Zone 4: Verdant (250-300)
    verdant: 250,

    // Zone 5: Storm (300-350)
    storm: 300,

    cosmic: 320,
    infinite: 340,

    // Tier 2 Zones (350+)
    lunar: 350,
    solar: 400,
    nebula: 450,
    singularity: 500,
    nova: 550,

    // Tier 3+ (600+)
    cyber: 600,
    crystal: 650,
    ethereal: 700,
    crimson: 750,
    heavenly: 800,
    antimatter: 850,
    temporal: 900,
    chaotic: 950,
    void: 1000,
    omega: 1100
};
