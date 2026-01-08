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

    // Infinite Power Scaling (V2.0 Wall)
    // Steeper curve to force stat farming from real missions
    const basePower = 15000;
    const linearGrowth = (floor - 1) * 5000;
    const quadraticGrowth = Math.pow(floor - 1, 2) * 50;
    const recommendedPower = Math.floor(basePower + linearGrowth + quadraticGrowth);

    const isBossLevel = floor % 10 === 0;
    const bossIndex = (floor / 10) - 1;
    const bossName = BOSS_NAMES[bossIndex % BOSS_NAMES.length] || 'Entidad Desconocida';

    const dungeonName = isBossLevel
        ? `Jefe: ${bossName} (Piso ${floor})`
        : `Torre Demoníaca Rango ${tier} [Piso ${floor}]`;

    // XP reward (ULTRA NERF V2.0)
    // Tower is for loot/shadows only. XP is marginal.
    // 1 Gym session (500 XP) should be worth ~10 Floor 100 runs.
    const xpReward = Math.floor(recommendedPower * 0.00005);

    const recommendedStats: StatType[] = [
        ['Strength', 'Agility'],
        ['Agility', 'Vitality'],
        ['Vitality', 'Strength'],
        ['Intelligence', 'Strength'],
        ['Agility', 'Fortune']
    ][floor % 5] as StatType[];

    // Simplified drop rates (Core Rarities only V2.0)
    const dropRates: Partial<Record<ItemRarity, number>> = {
        common: Math.max(0.1, 0.7 - floor * 0.01),
        uncommon: Math.max(0.1, 0.4 - floor * 0.005),
        rare: Math.min(0.25, 0.1 + floor * 0.002),
        epic: floor >= 20 ? Math.min(0.20, 0.05 + (floor - 20) * 0.002) : 0,
        legendary: floor >= 50 ? Math.min(0.15, 0.01 + (floor - 50) * 0.001) : 0,
        mythic: floor >= 100 ? Math.min(0.10, 0.005 + (floor - 100) * 0.0005) : 0,
        godlike: floor >= 200 ? Math.min(0.05, 0.001 + (floor - 200) * 0.0002) : 0,
    };

    return {
        id: `dungeon_${floor}`,
        name: dungeonName,
        description: `Floor ${floor} of the Demon Tower. Recommended Power: ${recommendedPower.toLocaleString()}`,
        difficulty: tier,
        recommendedLevel: floor,
        recommendedPower: recommendedPower,
        timeLimit: 300 + (Math.floor(floor / 50) * 60),
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
            health: recommendedPower * 20, // Bosses are tankier
            powerLevel: recommendedPower,
            abilities: ['Strike', 'Roar', 'Void Crush'],
            canExtract: bossIndex < SHADOW_NAMES.length,
            shadowData: bossIndex < SHADOW_NAMES.length ? {
                name: SHADOW_NAMES[bossIndex],
                rank: tier,
                image: '/shadows/generic.png',
                bonus: {
                    stat: 'Strength',
                    value: Math.floor(floor * 2.5)
                }
            } : undefined
        } : undefined
    };
};

// Backward compatibility for existing code that might use ALL_DUNGEONS
// We generate the first 100 floors as a static list if needed, but ideally we switch to getDungeon
export const ALL_DUNGEONS = Array.from({ length: 100 }, (_, i) => getDungeon(i + 1));



