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

    // NEW POWER SCALING to match player power system
    // Target ranges:
    // Floor 1:   ~10,000  (new player can enter with ~8,000+ power)
    // Floor 20:  ~60,000  
    // Floor 40:  ~120,000  
    // Floor 60:  ~190,000 
    // Floor 80:  ~260,000
    // Floor 100: ~290,000 (almost max)
    // Floor 120: ~350,000 (requires fully maxed account)

    for (let i = 1; i <= TOTAL_LEVELS; i++) {
        const tierIndex = Math.floor((i - 1) / 20); // 20 levels per tier
        const tier = DUNGEON_TIERS[Math.min(tierIndex, DUNGEON_TIERS.length - 1)];

        // Polynomial scaling: base + linear + quadratic
        // f(i) = 10000 + (i-1) * 2500 + (i-1)^2 * 3
        const basePower = 10000;
        const linearGrowth = (i - 1) * 2500;
        const quadraticGrowth = Math.pow(i - 1, 2) * 3;
        const recommendedPower = Math.floor(basePower + linearGrowth + quadraticGrowth);

        const isBossLevel = i % 10 === 0;
        const bossIndex = (i / 10) - 1;

        const dungeonName = isBossLevel
            ? `Boss Raid: ${BOSS_NAMES[bossIndex] || 'Unknown Entity'}`
            : `${tier}-Rank Dungeon [Floor ${i}]`;

        // XP reward scales with power
        const xpReward = Math.floor(recommendedPower * 0.3);

        dungeons.push({
            id: `dungeon_${i}`,
            name: dungeonName,
            description: `Level ${i} ${tier}-Rank Dungeon. Recommended Power: ${recommendedPower.toLocaleString()}`,
            difficulty: tier,
            recommendedLevel: i,
            recommendedPower: recommendedPower,
            timeLimit: 300,
            minLevel: Math.max(1, i - 5),
            recommendedStats: [
                ['Strength', 'Agility'],
                ['Agility', 'Sense'],
                ['Vitality', 'Strength'],
                ['Intelligence', 'Sense'],
                ['Agility', 'Vitality']
            ][i % 5] as any[], // Cycle through stats
            rewards: {
                xp: xpReward,
                items: [],
                dropRates: {
                    common: 0.5,
                    uncommon: 0.3,
                    rare: 0.15,
                    epic: 0.04,
                    legendary: 0.01,
                    mythic: 0.001,
                    godlike: 0
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
                shadowData: (() => {
                    const name = SHADOW_NAMES[bossIndex] || 'Shadow Soldier';
                    // Dynamic import or moved logic to avoid circular dep if possible, 
                    // but data/shadows.tsx imports types/items.ts. types/items.ts is safe.
                    // We need to import getShadowDef.
                    // If circular dependency issues arise, we might need to duplicate simple logic or move definitions.
                    // Let's assume we can import it.

                    // Hardcoding the mapping here to avoid circular dependency with data/shadows.tsx if it imports types that import this?
                    // data/shadows imports types/items.ts.
                    // dungeonGenerator imports types/features.ts which imports items.ts.
                    // It should be fine.

                    // Actually, let's just use a helper or switch here to be safe and fast.
                    let stat: any = 'Strength';
                    let rank: any = tier;

                    // Override for specific shadows based on lore
                    if (name === 'Igris') { stat = 'Strength'; rank = 'S'; }
                    if (name === 'Tank') { stat = 'Vitality'; rank = 'A'; }
                    if (name === 'Tusk') { stat = 'Intelligence'; rank = 'A'; }
                    if (name === 'Kaisel') { stat = 'Agility'; rank = 'S'; }
                    if (name === 'Beru') { stat = 'Agility'; rank = 'SS'; }
                    if (name === 'Kamish') { stat = 'Strength'; rank = 'SSS'; }
                    if (name === 'Bellion') { stat = 'Strength'; rank = 'SSS'; }
                    if (name === 'Ashborn') { stat = 'Intelligence'; rank = 'SSS'; }
                    if (name === 'Iron') { stat = 'Vitality'; rank = 'A'; }
                    if (name === 'Greed') { stat = 'Intelligence'; rank = 'S'; }
                    if (name === 'Fang') { stat = 'Agility'; rank = 'C'; }
                    if (name === 'Kasaka') { stat = 'Vitality'; rank = 'C'; }
                    if (name === 'Razan') { stat = 'Agility'; rank = 'C'; }

                    return {
                        name: name,
                        rank: rank,
                        image: '/shadows/generic.png',
                        bonus: {
                            stat: stat,
                            value: Math.floor(i * 2)
                        }
                    };
                })()
            } : undefined
        });
    }

    return dungeons;
};

export const ALL_DUNGEONS = generateDungeons();

