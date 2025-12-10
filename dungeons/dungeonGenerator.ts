import { Dungeon, RankTier, ItemRarity, StatType } from '../types';

export const DUNGEON_TIERS: RankTier[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

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

    // Dynamic Drop Rate Calculator
    const getRate = (startFloor: number, base: number, growth: number, cap: number) => {
        if (floor < startFloor) return 0;
        return Math.min(cap, base + (floor - startFloor) * growth);
    };

    const dropRates: Partial<Record<ItemRarity, number>> = {
        // Common/Uncommon decrease as floor increases
        common: Math.max(0.05, 0.5 - floor * 0.004),
        uncommon: Math.max(0.05, 0.25 - floor * 0.002),
        // Rare+ increase significantly with floor
        rare: Math.min(0.35, 0.1 + floor * 0.002),
        epic: Math.min(0.25, 0.05 + floor * 0.0015),
        legendary: Math.min(0.15, 0.02 + floor * 0.001),

        // High tier rarities unlock at specific floors with meaningful rates
        mythic: getRate(50, 0.02, 0.001, 0.15),
        godlike: getRate(80, 0.015, 0.0005, 0.10),
        transcendent: getRate(100, 0.012, 0.0004, 0.08),
        celestial: getRate(120, 0.01, 0.0003, 0.08),
        primordial: getRate(140, 0.008, 0.0003, 0.05),

        // Zone Rarities (Magma to Omega)
        // Fixed: Magma now starts at 150 (Zone 2) with healthy drop rate
        magma: getRate(150, 0.025, 0.0005, 0.12),      // Primary Zone 2 Drop
        abyssal: getRate(200, 0.025, 0.0005, 0.12),   // Primary Zone 3 Drop

        // Legacy High Tier - Pushed back to act as rare "Jackpot" drops
        eternal: getRate(220, 0.005, 0.0001, 0.03),
        divine: getRate(240, 0.005, 0.0001, 0.03),

        verdant: getRate(250, 0.02, 0.0005, 0.10),   // Zone 4
        storm: getRate(300, 0.02, 0.0005, 0.10),     // Zone 5

        cosmic: getRate(320, 0.005, 0.0001, 0.03),
        infinite: getRate(340, 0.005, 0.0001, 0.03),

        // Tier 2 Zones
        lunar: getRate(350, 0.015, 0.0004, 0.08),
        solar: getRate(400, 0.015, 0.0004, 0.08),
        nebula: getRate(450, 0.01, 0.0003, 0.08),
        singularity: getRate(500, 0.01, 0.0003, 0.08),
        nova: getRate(550, 0.01, 0.0002, 0.08),

        // Tier 3+
        cyber: getRate(600, 0.005, 0.0001, 0.05),
        crystal: getRate(650, 0.005, 0.0001, 0.05),
        ethereal: getRate(700, 0.005, 0.0001, 0.05),
        crimson: getRate(750, 0.005, 0.0001, 0.05),
        heavenly: getRate(800, 0.005, 0.0001, 0.05),
        antimatter: getRate(850, 0.002, 0.0001, 0.03),
        temporal: getRate(900, 0.002, 0.0001, 0.03),
        chaotic: getRate(950, 0.002, 0.0001, 0.03),
        void: getRate(1000, 0.001, 0.0001, 0.02),
        omega: getRate(1100, 0.001, 0.0001, 0.01)
    };

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



