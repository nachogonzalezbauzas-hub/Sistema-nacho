import { AppState } from '../types';
import { TITLES, AVATAR_FRAMES } from '../data/titles';
import { PASSIVE_DEFINITIONS } from '../data/buffs';

export interface PowerBreakdown {
    baseStats: number;
    level: number;
    titles: number;
    frames: number;
    shadows: number;
    equipment: number;
    passives: number;
    jobClass: number;
    total: number;
}

// Job classes in order of progression (1-10)
const JOB_CLASS_ORDER = [
    'None',           // 0 - No power
    'Warrior',        // 1
    'Swift Runner',   // 2
    'Guardian',       // 3
    'Scholar',        // 4
    'Vitalist',       // 5
    'Fortune Seeker', // 6
    'Balanced Master',// 7
    'Shadow Lord',    // 8
    'Shadow Monarch'  // 9
];

// Get the index of job class (how many classes have been unlocked)
const getJobClassIndex = (jobClass: string): number => {
    const index = JOB_CLASS_ORDER.indexOf(jobClass);
    return index >= 0 ? index : 0;
};

export const calculatePowerBreakdown = (state: AppState): PowerBreakdown => {
    let breakdown: PowerBreakdown = {
        baseStats: 0,
        level: 0,
        titles: 0,
        frames: 0,
        shadows: 0,
        equipment: 0,
        passives: 0,
        jobClass: 0,
        total: 0
    };

    // TARGET: ~300,000 without equipment, ~360,000 with passives
    // Breakdown at max (lvl 100, stats at 100 each):
    // - Base Stats: ~72,000 (6 stats x 100 x 120)
    // - Level: ~60,000 (100 x 600)
    // - Titles: ~36,000 (godlike = 3000 x 12)
    // - Frames: ~36,000 (SSS = 3000 x 12)
    // - Shadows: ~60,000 (10 S-rank shadows = 10 x 500 x 12)
    // - Passives: ~36,000 (skill bonuses)
    // - Job Class: ~54,000 (9 classes x 500 x 12)
    // Total without equipment: ~354,000

    const SCALE = 12;

    // 1. Base Stats Sum (each point worth 120 power)
    const coreStats = ['strength', 'vitality', 'agility', 'intelligence', 'fortune', 'metabolism'];
    const statTotal = coreStats.reduce((acc, stat) => {
        const val = state.stats[stat as keyof typeof state.stats];
        return typeof val === 'number' ? acc + val : acc;
    }, 0);
    breakdown.baseStats = statTotal * SCALE * 10; // 120 power per stat point

    // 2. Level Power (600 power per level)
    breakdown.level = state.stats.level * 50 * SCALE;

    // 3. Title Power (equipped title + collection bonus)
    const titleRarityPower = {
        common: 100,
        uncommon: 250,
        rare: 500,
        epic: 1000,
        legendary: 2000,
        mythic: 2500,
        godlike: 3000
    };

    // Equipped title power
    if (state.stats.equippedTitleId) {
        const title = TITLES.find(t => t.id === state.stats.equippedTitleId);
        if (title) {
            breakdown.titles = (titleRarityPower[title.rarity] || 0) * SCALE;
        }
    }

    // Collection bonus: 10% of each owned title's power
    if (state.stats.unlockedTitleIds) {
        state.stats.unlockedTitleIds.forEach(titleId => {
            if (titleId !== state.stats.equippedTitleId) {
                const title = TITLES.find(t => t.id === titleId);
                if (title) {
                    breakdown.titles += Math.floor((titleRarityPower[title.rarity] || 0) * SCALE * 0.1);
                }
            }
        });
    }

    // 4. Frame Power (equipped frame + collection bonus)
    const frameRarityPower = {
        C: 500,
        B: 1000,
        A: 1500,
        S: 2000,
        SS: 2500,
        SSS: 3000
    };

    if (state.stats.selectedFrameId && state.stats.selectedFrameId !== 'default') {
        const frame = AVATAR_FRAMES.find(f => f.id === state.stats.selectedFrameId);
        if (frame) {
            breakdown.frames = (frameRarityPower[frame.rarity as keyof typeof frameRarityPower] || 0) * SCALE;
        }
    }

    // Collection bonus: 10% of each owned frame's power
    if (state.stats.unlockedFrameIds) {
        state.stats.unlockedFrameIds.forEach(frameId => {
            if (frameId !== state.stats.selectedFrameId && frameId !== 'default') {
                const frame = AVATAR_FRAMES.find(f => f.id === frameId);
                if (frame) {
                    breakdown.frames += Math.floor((frameRarityPower[frame.rarity as keyof typeof frameRarityPower] || 0) * SCALE * 0.1);
                }
            }
        });
    }

    // 5. Shadow Army Power (all shadows contribute)
    if (state.shadows) {
        const shadowRankPower = {
            E: 100,
            D: 200,
            C: 400,
            B: 600,
            A: 800,
            S: 1000
        };
        state.shadows.forEach(shadow => {
            breakdown.shadows += (shadowRankPower[shadow.rank as keyof typeof shadowRankPower] || 0) * SCALE;
        });

        // Bonus for shadow army size
        if (state.shadows.length >= 5) breakdown.shadows += 1000 * SCALE;
        if (state.shadows.length >= 10) breakdown.shadows += 2000 * SCALE;
    }

    // 6. Equipment Power
    if (state.inventory) {
        state.inventory.filter(i => i.isEquipped).forEach(item => {
            const statSum = item.baseStats.reduce((acc, s) => acc + s.value, 0);
            const rarityMult = {
                common: 1,
                uncommon: 1.5,
                rare: 2,
                epic: 3,
                legendary: 5,
                mythic: 8,
                godlike: 12
            };
            breakdown.equipment += Math.floor(statSum * (rarityMult[item.rarity] || 1) * 10) * SCALE;
        });
    }

    // 7. Passive Skills Power
    if (state.passiveLevels) {
        Object.entries(state.passiveLevels).forEach(([id, level]) => {
            const def = PASSIVE_DEFINITIONS.find(p => p.id === id);
            const lvl = Number(level);
            if (def && lvl > 0) {
                // Each passive level gives power based on stat bonuses
                const bonusTotal = Object.values(def.statBonusesPerLevel).reduce((a: number, b: any) => a + Number(b), 0);
                breakdown.passives += Math.floor(bonusTotal * lvl * 100) * SCALE;
            }
        });
    }

    // 8. Job Class Power (each unlocked class adds power cumulatively)
    // Classes: None(0), Warrior(1), Swift Runner(2), Guardian(3), Scholar(4), 
    //          Vitalist(5), Fortune Seeker(6), Balanced Master(7), Shadow Lord(8), Shadow Monarch(9)
    // Each class unlocked = 500 * SCALE power (cumulative)
    const jobIndex = getJobClassIndex(state.stats.jobClass);
    if (jobIndex > 0) {
        // Sum of all unlocked classes (1 + 2 + ... + jobIndex) * base power
        // Using formula: n(n+1)/2 for sum of 1 to n, then multiply by power per class
        const powerPerClass = 500;
        breakdown.jobClass = (jobIndex * (jobIndex + 1) / 2) * powerPerClass * SCALE;
    }

    breakdown.total = Math.floor(
        breakdown.baseStats +
        breakdown.level +
        breakdown.titles +
        breakdown.frames +
        breakdown.shadows +
        breakdown.equipment +
        breakdown.passives +
        breakdown.jobClass
    );

    return breakdown;
};

export const calculateTotalPower = (state: AppState): number => {
    return calculatePowerBreakdown(state).total;
};
