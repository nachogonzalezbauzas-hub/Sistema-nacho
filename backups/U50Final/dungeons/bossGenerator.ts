import { BossDefinition, DungeonDefinition, UserStats, Shadow, StatType } from '../types';

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
    if (dungeon.id.includes('arcane') || dungeon.id.includes('double')) element = 'arcane';
    else if (dungeon.id.includes('hydra') || dungeon.id.includes('metabolism') || dungeon.id.includes('insect')) element = 'metabolism';
    else if (dungeon.id.includes('void') || dungeon.id.includes('jeju') || dungeon.id.includes('goblin')) element = 'dark';
    else if (dungeon.id.includes('monarch') || dungeon.id.includes('orc') || dungeon.id.includes('red')) element = 'fire';
    else {
        const elements: BossDefinition['element'][] = ['dark', 'lightning', 'fire', 'arcane', 'fortune', 'metabolism'];
        element = getRandomElement(elements);
    }

    // Calculate Boss Power
    // U30: Fixed power based on dungeon tier, not user scaling
    const basePower = dungeon.recommendedPower || (dungeon.difficulty * 100);

    // Random variance +/- 10%
    const variance = 0.9 + (Math.random() * 0.2);

    const powerLevel = Math.floor(basePower * variance);

    // Generate Stats based on Element
    // U34: Fix boss level to match dungeon level (requested by user)
    const level = dungeon.minLevel + Math.floor(Math.random() * 5); // Level matches dungeon + variance

    const bossStats: UserStats = {
        level,
        xpCurrent: 0,
        xpForNextLevel: 1000,
        strength: 10,
        vitality: 10,
        agility: 10,
        intelligence: 10,
        fortune: 10,
        metabolism: 10,
        streak: 0,
        lastActiveDate: null,
        lastChestClaim: null,
        equippedTitleId: null,
        unlockedTitleIds: [],
        selectedFrameId: 'default',
        unlockedFrameIds: [],
        jobClass: 'None'
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
    const name = `${nameBase} Lvl. ${level}`;

    const moves = [
        getRandomElement(SPECIAL_MOVES[element]),
        getRandomElement(SPECIAL_MOVES[element]),
        'Cataclysm Strike' // Universal ult
    ];

    // U29 Shadow Data Generation
    const canExtract = Math.random() > 0.3; // 70% chance to be extractable
    const rank: Shadow['rank'] = dungeon.difficulty >= 5 ? 'S' : dungeon.difficulty >= 4 ? 'A' : dungeon.difficulty >= 3 ? 'B' : 'C';

    // Determine bonus based on element
    let bonusStat: StatType = 'Strength';
    if (element === 'lightning') bonusStat = 'Agility';
    if (element === 'arcane') bonusStat = 'Intelligence';
    if (element === 'fortune') bonusStat = 'Fortune';
    if (element === 'metabolism') bonusStat = 'Metabolism';
    if (element === 'fire') bonusStat = 'Strength';
    if (element === 'dark') bonusStat = 'Vitality';

    const bonusValue = dungeon.difficulty * 2;

    return {
        id: `boss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        element,
        stats: bossStats,
        powerLevel,
        specialMoves: Array.from(new Set(moves)), // Unique moves
        canExtract,
        shadowData: canExtract ? {
            name: `Shadow ${nameBase}`,
            rank,
            image: '', // Placeholder, will use generic shadow image in UI
            bonus: {
                stat: bonusStat,
                value: bonusValue
            }
        } : undefined
    };
};
