import { BossDefinition, DungeonDefinition, UserStats } from '../types';

const BOSS_NAMES = {
    dark: ['Shadow Beast', 'Void Stalker', 'Nightmare Construct'],
    lightning: ['Thunder Golem', 'Spark Wraith', 'Volt Titan'],
    fire: ['Inferno Drake', 'Ember Lord', 'Flame Sentinel'],
    arcane: ['Arcane Construct', 'Mana Specter', 'Rune Guardian'],
    fortune: ['Gilded Mimic', 'Chance Eater', 'Luck Stealer'],
    metabolism: ['Bio-Sludge', 'Toxin Hydra', 'Flesh Weaver']
};

const SPECIAL_MOVES = {
    dark: ['Void Howl', 'Shadow Step', 'Abyssal Gaze'],
    lightning: ['Thunder Clap', 'Static Shock', 'Lightning Strike'],
    fire: ['Inferno Breath', 'Magma Burst', 'Heat Wave'],
    arcane: ['Arcane Missiles', 'Mana Drain', 'Reality Rift'],
    fortune: ['Coin Toss', 'Fate Seal', 'Gamble Strike'],
    metabolism: ['Acid Spray', 'Regenerate', 'Toxic Cloud']
};

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateBoss = (dungeon: DungeonDefinition, userStats: UserStats): BossDefinition => {
    // Determine element based on dungeon ID or random
    let element: BossDefinition['element'] = 'dark';
    if (dungeon.id.includes('arcane')) element = 'arcane';
    else if (dungeon.id.includes('hydra') || dungeon.id.includes('metabolism')) element = 'metabolism';
    else if (dungeon.id.includes('void')) element = 'dark';
    else if (dungeon.id.includes('monarch')) element = 'fire';
    else {
        const elements: BossDefinition['element'][] = ['dark', 'lightning', 'fire', 'arcane', 'fortune', 'metabolism'];
        element = getRandomElement(elements);
    }

    // Calculate Boss Power
    // Base power from dungeon difficulty (1-5)
    // Scaling factor from user total stats to keep it challenging but beatable
    const userTotalStats = Object.values(userStats).reduce((a, b) => a + b, 0);
    const difficultyMultiplier = 1 + (dungeon.difficulty * 0.2); // 1.2x to 2.0x

    // Random variance +/- 10%
    const variance = 0.9 + (Math.random() * 0.2);

    const powerLevel = Math.floor(userTotalStats * difficultyMultiplier * variance) + (dungeon.difficulty * 50);

    // Generate Stats based on Element
    const bossStats: UserStats = {
        strength: 10,
        vitality: 10,
        agility: 10,
        intelligence: 10,
        fortune: 10,
        metabolism: 10
    };

    const statPool = Math.floor(powerLevel / 2); // Rough approximation, power level is abstract

    // Distribute stats based on element bias
    switch (element) {
        case 'lightning':
            bossStats.agility += Math.floor(statPool * 0.4);
            bossStats.strength += Math.floor(statPool * 0.3);
            break;
        case 'fire':
            bossStats.strength += Math.floor(statPool * 0.4);
            bossStats.vitality += Math.floor(statPool * 0.3);
            break;
        case 'arcane':
            bossStats.intelligence += Math.floor(statPool * 0.6);
            break;
        case 'fortune':
            bossStats.fortune += Math.floor(statPool * 0.6);
            break;
        case 'metabolism':
            bossStats.metabolism += Math.floor(statPool * 0.4);
            bossStats.vitality += Math.floor(statPool * 0.4);
            break;
        case 'dark':
        default:
            // Balanced
            bossStats.strength += Math.floor(statPool * 0.2);
            bossStats.agility += Math.floor(statPool * 0.2);
            bossStats.intelligence += Math.floor(statPool * 0.2);
            break;
    }

    // Fill rest randomly
    const remainingStats = ['strength', 'vitality', 'agility', 'intelligence', 'fortune', 'metabolism'] as const;
    remainingStats.forEach(stat => {
        bossStats[stat] += Math.floor(Math.random() * (statPool * 0.1));
    });

    // Name & Moves
    const nameBase = getRandomElement(BOSS_NAMES[element]);
    const name = `${nameBase} Lvl. ${Math.floor(powerLevel / 10)}`;

    const moves = [
        getRandomElement(SPECIAL_MOVES[element]),
        getRandomElement(SPECIAL_MOVES[element]),
        'Cataclysm Strike' // Universal ult
    ];

    return {
        id: `boss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        element,
        stats: bossStats,
        powerLevel,
        specialMoves: Array.from(new Set(moves)) // Unique moves
    };
};
