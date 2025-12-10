import { Dungeon, RankTier, ItemRarity } from '../types';

export const DUNGEON_TIERS: RankTier[] = ['E', 'D', 'C', 'B', 'A', 'S'];

const BOSS_NAMES = [
    "Razan the Ferocious", "Steel-Fanged Lycan", "Blue Venom Kasaka", "Igris the Bloodred",
    "Tank the Bear", "Tusk the Orc High Shaman", "Baruka the Ice Elf", "Kaisel the Wyvern",
    "Beru the Ant King", "Kamish the Dragon", "Bellion the Grand Marshal", "Ashborn the Shadow Monarch"
];

const SHADOW_NAMES = [
    "Razan", "Fang", "Kasaka", "Igris",
    "Tank", "Tusk", "Baruka", "Kaisel",
    "Beru", "Kamish", "Bellion", "Ashborn"
];

export const generateDungeons = (): Dungeon[] => {
    const dungeons: Dungeon[] = [];
    const TOTAL_LEVELS = 120;

    for (let i = 1; i <= TOTAL_LEVELS; i++) {
        const tierIndex = Math.floor((i - 1) / 20); // 20 levels per tier
        const tier = DUNGEON_TIERS[Math.min(tierIndex, DUNGEON_TIERS.length - 1)];

        // Power Scaling: Exponential-ish
        // Level 1: ~1000
        // Level 20: ~20,000
        // Level 120: ~1,000,000+
        const basePower = 1000;
        const powerGrowth = Math.pow(1.06, i);
        const recommendedPower = Math.floor(basePower * powerGrowth);

        const isBossLevel = i % 10 === 0;
        const bossIndex = (i / 10) - 1;

        const dungeonName = isBossLevel
            ? `Boss Raid: ${BOSS_NAMES[bossIndex] || 'Unknown Entity'}`
            : `${tier}-Rank Dungeon [Floor ${i}]`;

        const xpReward = Math.floor(recommendedPower * 0.5); // XP based on difficulty

        dungeons.push({
            id: `dungeon_${i}`,
            name: dungeonName,
            description: `Level ${i} ${tier}-Rank Dungeon. Recommended Power: ${recommendedPower}`,
            difficulty: tier,
            recommendedLevel: i, // Using level as a proxy for difficulty index
            recommendedPower: recommendedPower,
            timeLimit: 300, // 5 minutes standard
            minLevel: Math.max(1, i - 5), // Can enter slightly under-leveled
            rewards: {
                xp: xpReward,
                items: [], // Generated dynamically in slice
                dropRates: {
                    common: 0.5,
                    uncommon: 0.3,
                    rare: 0.15,
                    epic: 0.04,
                    legendary: 0.01,
                    mythic: 0.001
                }
            },
            boss: isBossLevel ? {
                id: `boss_${i}`,
                name: BOSS_NAMES[bossIndex] || 'Unknown Boss',
                level: i + 5,
                health: recommendedPower * 10,
                powerLevel: recommendedPower,
                abilities: ['Strike', 'Roar'],
                canExtract: true,
                shadowData: {
                    name: SHADOW_NAMES[bossIndex] || 'Shadow Soldier',
                    rank: tier,
                    image: '/shadows/generic.png', // Placeholder
                    bonus: {
                        stat: 'Strength',
                        value: Math.floor(i * 2)
                    }
                }
            } : undefined
        });
    }

    return dungeons;
};

export const ALL_DUNGEONS = generateDungeons();
