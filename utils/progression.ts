import { UserStats } from '@/types';

export const getXpForNextLevel = (level: number): number => {
    // REBALANCED V2.0: Steeply exponential curve. Level 100 needs ~15M XP.
    // Goal: Make high levels a true long-term prestige.
    return Math.floor(150 * Math.pow(level, 2.5));
};

export const calculateLevel = (currentLevel: number, currentXp: number): { level: number; xp: number; leveledUp: boolean; xpForNextLevel: number } => {
    let level = currentLevel;
    let xp = currentXp;
    let leveledUp = false;

    while (xp >= getXpForNextLevel(level)) {
        xp -= getXpForNextLevel(level);
        level++;
        leveledUp = true;
    }

    return { level, xp, leveledUp, xpForNextLevel: getXpForNextLevel(level) };
};

export const calculateStatIncrease = (currentValue: number, increase: number = 1): number => {
    return currentValue + increase;
};

// Helper to handle level up logic for stats object
export const calculateLevelUp = (currentStats: UserStats, xpGain: number): { stats: UserStats; levelUp: boolean } => {
    const { level, xp, leveledUp, xpForNextLevel } = calculateLevel(currentStats.level, (currentStats.xpCurrent || 0) + xpGain);

    // Create new stats object
    const newStats: UserStats = {
        ...currentStats,
        level,
        xpCurrent: xp, 
        xpForNextLevel: xpForNextLevel,
        // Buffed ability points on level up (5 points per level instead of 3 to compensate for difficulty)
        passivePoints: (currentStats.passivePoints || 0) + (leveledUp ? (level - currentStats.level) * 5 : 0)
    };

    return { stats: newStats, levelUp: leveledUp };
};
