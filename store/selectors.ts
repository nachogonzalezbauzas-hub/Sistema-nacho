import { AppState } from '@/types';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { PASSIVE_DEFINITIONS } from '@/data/buffs';

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

    // 1. Base Stats Sum (Buffed: each point worth 480 power)
    const coreStats = ['strength', 'vitality', 'agility', 'intelligence', 'fortune', 'metabolism'];
    const statTotal = coreStats.reduce((acc, stat) => {
        const val = state.stats[stat as keyof typeof state.stats];
        return typeof val === 'number' ? acc + val : acc;
    }, 0);
    // Was 10 * SCALE (120). Now 40 * SCALE (480).
    breakdown.baseStats = statTotal * SCALE * 40;

    // 2. Level Power (Buffed: 4800 power per level)
    // Was 50 * SCALE (600). Now 400 * SCALE (4800).
    // Level 100 = 480,000 power.
    breakdown.level = state.stats.level * 400 * SCALE;

    // 3. Title Power (balanced, slight boost)
    const titleRarityPower: Record<string, number> = {
        common: 100,
        uncommon: 250,
        rare: 500,
        epic: 1000,
        legendary: 2000,
        mythic: 4000,
        godlike: 10000, // Boosted from 8000
        // Zone Rarities (Escalating Power)
        magma: 12000,
        abyssal: 14000,
        verdant: 16000,
        storm: 18000,
        lunar: 20000,
        solar: 22000,
        nebula: 25000,
        singularity: 28000,
        nova: 32000,
        cyber: 36000,
        crystal: 40000,
        ethereal: 45000,
        crimson: 50000,
        heavenly: 55000,
        antimatter: 60000,
        temporal: 70000,
        chaotic: 80000,
        void: 90000,
        omega: 100000,
        // Legacy High Tiers
        primordial: 110000,
        eternal: 120000,
        divine: 130000,
        cosmic: 140000,
        infinite: 150000
    };

    // Equipped title power
    if (state.stats.equippedTitleId) {
        const allTitles = [...TITLES, ...(state.stats.customTitles || [])];
        const title = allTitles.find(t => t.id === state.stats.equippedTitleId);
        if (title) {
            breakdown.titles = (titleRarityPower[title.rarity] || 0) * SCALE;
        }
    }

    // Collection bonus: 10% of each owned title's power
    if (state.stats.unlockedTitleIds) {
        state.stats.unlockedTitleIds.forEach(titleId => {
            if (titleId !== state.stats.equippedTitleId) {
                const allTitles = [...TITLES, ...(state.stats.customTitles || [])];
                const title = allTitles.find(t => t.id === titleId);
                if (title) {
                    breakdown.titles += Math.floor((titleRarityPower[title.rarity] || 0) * SCALE * 0.1);
                }
            }
        });
    }

    // 4. Frame Power (balanced, slight boost)
    const frameRarityPower: Record<string, number> = {
        C: 500,
        B: 1000,
        A: 2000,
        S: 4000,
        SS: 8000,
        SSS: 12000,
        // Zone Rarities (Matching Title Power Curve)
        magma: 15000,
        abyssal: 18000,
        verdant: 21000,
        storm: 24000,
        lunar: 27000,
        solar: 30000,
        nebula: 35000,
        singularity: 40000,
        nova: 45000,
        cyber: 50000,
        crystal: 55000,
        ethereal: 60000,
        crimson: 65000,
        heavenly: 70000,
        antimatter: 80000,
        temporal: 90000,
        chaotic: 100000,
        void: 120000,
        omega: 150000
    };

    if (state.stats.selectedFrameId && state.stats.selectedFrameId !== 'default') {
        const allFrames = [...AVATAR_FRAMES, ...(state.stats.customFrames || [])];
        const frame = allFrames.find(f => f.id === state.stats.selectedFrameId);
        if (frame) {
            breakdown.frames = (frameRarityPower[frame.rarity as keyof typeof frameRarityPower] || 0) * SCALE;
        }
    }

    // Collection bonus: 10% of each owned frame's power
    if (state.stats.unlockedFrameIds) {
        state.stats.unlockedFrameIds.forEach(frameId => {
            if (frameId !== state.stats.selectedFrameId && frameId !== 'default') {
                const allFrames = [...AVATAR_FRAMES, ...(state.stats.customFrames || [])];
                const frame = allFrames.find(f => f.id === frameId);
                if (frame) {
                    breakdown.frames += Math.floor((frameRarityPower[frame.rarity as keyof typeof frameRarityPower] || 0) * SCALE * 0.1);
                }
            }
        });
    }

    // 5. Shadow Army Power (Buffed high ranks)
    if (state.shadows) {
        const shadowRankPower = {
            E: 200,
            D: 400,
            C: 800,
            B: 1500,
            A: 3000,
            S: 5000 // Was 1000. Now 5000.
        };
        state.shadows.forEach(shadow => {
            breakdown.shadows += (shadowRankPower[shadow.rank as keyof typeof shadowRankPower] || 0) * SCALE;
        });

        // Bonus for shadow army size
        if (state.shadows.length >= 5) breakdown.shadows += 2000 * SCALE;
        if (state.shadows.length >= 10) breakdown.shadows += 5000 * SCALE;
    }

    // 6. Equipment Power (NERFED Scaling Factor)
    // Reduce factor from 10 to 3 to balance against stats/levels
    if (state.inventory) {
        state.inventory.filter(i => i.isEquipped).forEach(item => {
            // Include item level in calculation to reward upgrades more
            // (Level * 10%) boost per item level?
            // Actually, keep it based on stat values, but reduce the multiplier.
            const statSum = item.baseStats.reduce((acc, s) => acc + s.value, 0);
            const rarityMult = {
                common: 1,
                uncommon: 1.5,
                rare: 2,
                epic: 3,
                legendary: 5,
                mythic: 8,
                godlike: 12,
                // Zone rarities
                magma: 15,
                abyssal: 18,
                verdant: 22,
                storm: 26,
                lunar: 30,
                sector: 35,
                infinity: 50
            };

            // Was: * 10 * SCALE.
            // Now: * 3 * SCALE.
            // BUT ensure zone items feel strong. 
            // The nerf is global, but high rarity mults (e.g. 50) will still give huge numbers.
            const r = item.rarity?.toLowerCase() || 'common';
            const mult = (rarityMult as any)[r] || 1;

            breakdown.equipment += Math.floor(statSum * mult * 3) * SCALE;
        });
    }

    // 7. Passive Skills Power (Buffed)
    if (state.passiveLevels) {
        Object.entries(state.passiveLevels).forEach(([id, level]) => {
            const def = PASSIVE_DEFINITIONS.find(p => p.id === id);
            const lvl = Number(level);
            if (def && lvl > 0) {
                // Each passive level gives power based on stat bonuses
                const bonusTotal = Object.values(def.statBonusesPerLevel).reduce((a: number, b: number) => a + Number(b), 0);
                // Was * 100. Now * 400.
                breakdown.passives += Math.floor(bonusTotal * lvl * 400) * SCALE;
            }
        });
    }

    // 8. Job Class Power (Buffed)
    // Each class unlocked = 2500 * SCALE power (cumulative) (Was 500)
    const jobIndex = getJobClassIndex(state.stats.jobClass);
    if (jobIndex > 0) {
        // Sum of all unlocked classes (1 + 2 + ... + jobIndex) * base power
        // Using formula: n(n+1)/2 for sum of 1 to n, then multiply by power per class
        const powerPerClass = 2500;
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
