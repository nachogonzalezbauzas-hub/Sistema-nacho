import { Dungeon, RankTier, ItemRarity, StatType } from '../types';
import { ZONES } from '../data/zoneSystem';

export const DUNGEON_TIERS: RankTier[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

// ... (BOSS_NAMES, SHADOW_NAMES logic remains similar but needed for context if I replace whole file)


const BOSS_NAMES = [
    "Razan el Feroz", "Lycan Dientes de Acero", "Kasaka Veneno Azul", "Igris el Sanguinario",
    "Tank el Oso", "Tusk el Gran Chamán", "Baruka el Elfo de Hielo", "Kaisel el Wyvern",
    "Beru el Rey Hormiga", "Kamish el Dragón", "Bellion el Gran Mariscal", "Ashborn el Monarca de las Sombras",
    "Guardián Celestial", "Caminante del Vacío", "Titán Abisal", "Horror Cósmico"
];

const SHADOW_NAMES = [
    "Razan", "Colmillo", "Kasaka", "Igris",
    "Tank", "Tusk", "Baruka", "Kaisel",
    "Beru", "Kamish", "Bellion", "Ashborn"
];

export const getDungeon = (floor: number): Dungeon => {
    // Infinite Tier Scaling
    // Floors 1-20: E
    // Floors 21-40: D
    // ...
    // Floors 100+: S -> SS -> SSS -> Celestial (implied)

    let tierIndex = Math.floor((floor - 1) / 20);
    const tier = DUNGEON_TIERS[Math.min(tierIndex, DUNGEON_TIERS.length - 1)];

    // Infinite Power Scaling
    // Steeper curve to force habit farming
    const basePower = 12000;
    const linearGrowth = (floor - 1) * 4500;
    const quadraticGrowth = Math.pow(floor - 1, 2) * 35; // Significant increase for late game wall
    const recommendedPower = Math.floor(basePower + linearGrowth + quadraticGrowth);

    const isBossLevel = floor % 10 === 0;
    const bossIndex = (floor / 10) - 1;
    const bossName = BOSS_NAMES[bossIndex % BOSS_NAMES.length] || 'Entidad Desconocida';

    const dungeonName = isBossLevel
        ? `Jefe: ${bossName} (Piso ${floor})`
        : `Torre Demoníaca Rango ${tier} [Piso ${floor}]`;

    // XP reward scales with power but should be balanced
    // 40% was too high (4000 XP for Floor 1). Reducing to ~5-8%
    const xpReward = Math.floor(recommendedPower * 0.05);

    const recommendedStats: StatType[] = [
        ['Strength', 'Agility'],
        ['Agility', 'Sense'],
        ['Vitality', 'Strength'],
        ['Intelligence', 'Sense'],
        ['Agility', 'Vitality']
    ][floor % 5] as StatType[];

    // Dynamic Drop Rate Calculator based on ZONES
    const dropRates: Partial<Record<ItemRarity, number>> = {
        // Base rarities (Standard progression)
        common: Math.max(0.05, 0.5 - floor * 0.001),
        uncommon: Math.max(0.05, 0.3 - floor * 0.001),
        rare: Math.min(0.30, 0.1 + floor * 0.0005),
        epic: Math.min(0.25, 0.05 + floor * 0.0005),
        legendary: Math.min(0.20, 0.01 + floor * 0.0005),
        mythic: floor >= 50 ? Math.min(0.15, 0.01 + (floor - 50) * 0.0005) : 0,
    };

    // Zone-specific Rarities (The core "System" adjustment)
    ZONES.forEach(zone => {
        // Only if we have reached the zone's start floor
        if (floor >= zone.floorRange[0]) {
            const rarity = zone.newRarity as ItemRarity;

            // Determine rate based on if we are currently IN this zone or PAST it
            // Current Zone: High drop rate (primary loot)
            // Past Zone: Lower drop rate (legacy loot)
            const isCurrentZone = floor <= zone.floorRange[1];

            // Rate logic:
            // Current Zone: 12% base chance
            // Past Zone: 2% base chance (drastically reduced so you get new stuff)
            const rate = isCurrentZone ? 0.12 : 0.02;

            // Apply rate
            if (rarity) {
                dropRates[rarity] = rate;
            }
        }
    });

    return {
        id: `dungeon_${floor}`,
        name: dungeonName,
        description: `Floor ${floor} of the Demon Tower. Recommended Power: ${recommendedPower.toLocaleString()}`,
        difficulty: tier,
        recommendedLevel: floor,
        recommendedPower: recommendedPower,
        timeLimit: 300 + (Math.floor(floor / 50) * 60), // More time for higher floors
        minLevel: Math.max(1, floor - 5),
        recommendedStats: recommendedStats,
        rewards: {
            xp: xpReward,
            items: [],
            dropRates: dropRates
        },
        boss: isBossLevel ? {
            id: `boss_${floor}`,
            name: bossName,
            level: floor + 5,
            health: recommendedPower * 15,
            powerLevel: recommendedPower,
            abilities: ['Strike', 'Roar', 'Void Crush'],
            canExtract: bossIndex < SHADOW_NAMES.length, // Only original shadows extractable for now
            shadowData: bossIndex < SHADOW_NAMES.length ? {
                name: SHADOW_NAMES[bossIndex],
                rank: tier,
                image: '/shadows/generic.png',
                bonus: {
                    stat: 'Strength', // Simplified for procedural
                    value: Math.floor(floor * 2.5)
                }
            } : undefined
        } : undefined
    };
};

// Backward compatibility for existing code that might use ALL_DUNGEONS
// We generate the first 100 floors as a static list if needed, but ideally we switch to getDungeon
export const ALL_DUNGEONS = Array.from({ length: 100 }, (_, i) => getDungeon(i + 1));



