import { AppState } from '../types';
import { TITLES, AVATAR_FRAMES } from '../data/titles';

export interface PowerBreakdown {
    baseStats: number;
    level: number;
    titles: number;
    frames: number;
    shadows: number;
    equipment: number;
    total: number;
}

export const calculatePowerBreakdown = (state: AppState): PowerBreakdown => {
    let breakdown: PowerBreakdown = {
        baseStats: 0,
        level: 0,
        titles: 0,
        frames: 0,
        shadows: 0,
        equipment: 0,
        total: 0
    };

    // SCALING FACTOR for "Big Numbers" feel
    const SCALE = 12;

    // 1. Base Stats Sum
    // 1. Base Stats Sum
    const coreStats = ['strength', 'vitality', 'agility', 'intelligence', 'fortune', 'metabolism'];
    breakdown.baseStats = coreStats.reduce((acc, stat) => {
        const val = state.stats[stat as keyof typeof state.stats];
        return typeof val === 'number' ? acc + val : acc;
    }, 0) * SCALE;

    // 2. Level Power
    breakdown.level = (state.stats.level * 10) * SCALE;

    // 3. Title Power (Collection & Equipped)
    if (state.stats.equippedTitleId) {
        const title = TITLES.find(t => t.id === state.stats.equippedTitleId);
        if (title) {
            const rarityValues = { common: 10, uncommon: 20, rare: 50, epic: 100, legendary: 250, mythic: 500, godlike: 1000 };
            breakdown.titles = (rarityValues[title.rarity] || 0) * SCALE;
        }
    }

    // 4. Frame Power (Collection & Equipped)
    if (state.stats.selectedFrameId && state.stats.selectedFrameId !== 'default') {
        const frame = AVATAR_FRAMES.find(f => f.id === state.stats.selectedFrameId);
        if (frame) {
            const rarityValues = { C: 50, B: 100, A: 200, S: 400, SS: 800 };
            breakdown.frames = (rarityValues[frame.rarity] || 0) * SCALE;
        }
    }

    // 5. Shadow Army Power (Collection)
    if (state.shadows) {
        state.shadows.forEach(shadow => {
            const rankValues = { E: 50, D: 100, C: 200, B: 400, A: 800, S: 1500 };
            breakdown.shadows += (rankValues[shadow.rank] || 0) * SCALE;
        });
    }

    // 6. Equipment Power
    if (state.inventory) {
        state.inventory.filter(i => i.isEquipped).forEach(item => {
            const statSum = item.baseStats.reduce((acc, s) => acc + s.value, 0);
            const rarityMult = { common: 1, uncommon: 1.2, rare: 1.5, epic: 2, legendary: 3, mythic: 5 };
            breakdown.equipment += Math.floor(statSum * (rarityMult[item.rarity] || 1)) * SCALE;
        });
    }

    breakdown.total = Math.floor(breakdown.baseStats + breakdown.level + breakdown.titles + breakdown.frames + breakdown.shadows + breakdown.equipment);
    return breakdown;
};

export const calculateTotalPower = (state: AppState): number => {
    return calculatePowerBreakdown(state).total;
};
