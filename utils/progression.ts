import { UserStats } from '@/types';

export const getXpForNextLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(level, 2));
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
    const { level, xp, leveledUp, xpForNextLevel } = calculateLevel(currentStats.level, currentStats.xpCurrent + xpGain);

    // Create new stats object
    const newStats: UserStats = {
        ...currentStats,
        level,
        xpCurrent: xp, // Correct property
        xpForNextLevel: xpForNextLevel,
        // Add ability points on level up (3 points per level)
        passivePoints: (currentStats.passivePoints || 0) + (leveledUp ? (level - currentStats.level) * 3 : 0)
    };

    return { stats: newStats, levelUp: leveledUp };
};
