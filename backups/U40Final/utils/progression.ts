// Utility functions for progression logic (XP, Levels, Stats)

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
