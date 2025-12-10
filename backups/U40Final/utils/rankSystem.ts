import { RankTier } from '../types';

// XP Thresholds for Ranks
export const RANK_THRESHOLDS: Record<RankTier, number> = {
    E: 0,
    D: 100,
    C: 500,
    B: 1500,
    A: 3000,
    S: 5000,
    SS: 10000,
    SSS: 20000
};

export const getHunterRank = (xp: number): RankTier => {
    if (xp >= RANK_THRESHOLDS.SSS) return 'SSS';
    if (xp >= RANK_THRESHOLDS.SS) return 'SS';
    if (xp >= RANK_THRESHOLDS.S) return 'S';
    if (xp >= RANK_THRESHOLDS.A) return 'A';
    if (xp >= RANK_THRESHOLDS.B) return 'B';
    if (xp >= RANK_THRESHOLDS.C) return 'C';
    if (xp >= RANK_THRESHOLDS.D) return 'D';
    return 'E';
};

export const getRankProgress = (xp: number): number => {
    const rank = getHunterRank(xp);
    const currentThreshold = RANK_THRESHOLDS[rank];

    // Find next rank
    const ranks: RankTier[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
    const currentIndex = ranks.indexOf(rank);
    const nextRank = ranks[currentIndex + 1];

    if (!nextRank) return 100; // Max rank

    const nextThreshold = RANK_THRESHOLDS[nextRank];
    const totalInBracket = nextThreshold - currentThreshold;
    const currentInBracket = xp - currentThreshold;

    return Math.min(100, Math.max(0, (currentInBracket / totalInBracket) * 100));
};
