import { Dungeon, RankTier, ItemRarity, StatType } from '../types';

export const DUNGEON_TIERS: RankTier[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

const BOSS_NAMES = [
    "Razan the Ferocious", "Steel-Fanged Lycan", "Blue Venom Kasaka", "Igris the Bloodred",
    "Tank the Bear", "Tusk the Orc High Shaman", "Baruka the Ice Elf", "Kaisel the Wyvern",
    "Beru the Ant King", "Kamish the Dragon", "Bellion the Grand Marshal", "Ashborn the Shadow Monarch",
    "Celestial Guardian", "Void Walker", "Abyssal Titan", "Cosmic Horror"
];

const SHADOW_NAMES = [
    "Razan", "Fang", "Kasaka", "Igris",
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
    // f(i) = 10000 + (i-1) * 2500 + (i-1)^2 * 3
    // For very high floors, we might want exponential or just steeper quadratic
    const basePower = 10000;
    const linearGrowth = (floor - 1) * 3000;
    const quadraticGrowth = Math.pow(floor - 1, 2) * 5;
    const recommendedPower = Math.floor(basePower + linearGrowth + quadraticGrowth);

    const isBossLevel = floor % 10 === 0;
    const bossIndex = (floor / 10) - 1;
    const bossName = BOSS_NAMES[bossIndex % BOSS_NAMES.length] || 'Unknown Entity';

    const dungeonName = isBossLevel
        ? `Boss Raid: ${bossName} (Floor ${floor})`
        : `${tier}-Rank Demon Tower [Floor ${floor}]`;

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

    const dropRates: Record<ItemRarity, number> = {
        common: Math.max(0, 0.5 - floor * 0.005),
        uncommon: Math.max(0, 0.3 - floor * 0.003),
        rare: Math.min(0.5, 0.15 + floor * 0.001),
        epic: Math.min(0.3, 0.04 + floor * 0.001),
        legendary: Math.min(0.1, 0.01 + floor * 0.0005),
        mythic: floor > 50 ? Math.min(0.05, 0.001 + (floor - 50) * 0.0005) : 0,
        godlike: floor > 80 ? Math.min(0.02, (floor - 80) * 0.0002) : 0,
        celestial: floor > 120 ? Math.min(0.01, (floor - 120) * 0.0001) : 0
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



