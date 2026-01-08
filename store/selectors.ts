import { AppState } from '@/types';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { PASSIVE_DEFINITIONS } from '@/data/buffs';
import { RARITY_POWER_MULTIPLIERS } from '@/data/equipmentConstants';

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

    // 1. Base Stats Sum (Buffed: each point worth 1200 power - 100 * SCALE)
    const coreStats = ['strength', 'vitality', 'agility', 'intelligence', 'fortune', 'metabolism'];
    const statTotal = coreStats.reduce((acc, stat) => {
        const val = state.stats[stat as keyof typeof state.stats];
        return typeof val === 'number' ? acc + val : acc;
    }, 0);
    // WAS: 40 * SCALE. NOW: 100 * SCALE.
    breakdown.baseStats = statTotal * SCALE * 100;

    // 2. Level Power (Buffed: 12000 power per level - 1000 * SCALE)
    // WAS: 400 * SCALE. NOW: 1000 * SCALE.
    breakdown.level = state.stats.level * 1000 * SCALE;

    // 3. Title Power (Nerfed to prevent overkill)
    const titleRarityPower: Record<string, number> = {
        common: 10,
        uncommon: 25,
        rare: 50,
        epic: 100,
        legendary: 250,
        mythic: 500,
        godlike: 1000,
        // Zone Rarities
        magma: 1500,
        abyssal: 2000,
        verdant: 2500,
        storm: 3000,
        lunar: 4000,
        solar: 5000,
        nebula: 6000,
        singularity: 7500,
        nova: 9000,
        cyber: 10000,
        crystal: 12000,
        ethereal: 15000,
        crimson: 18000,
        heavenly: 22000,
        antimatter: 26000,
        temporal: 30000,
        chaotic: 35000,
        void: 40000,
        omega: 50000,
        // Legacy High Tiers
        primordial: 42000,
        eternal: 44000,
        divine: 46000,
        cosmic: 48000,
        infinite: 50000
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

    // 4. Frame Power (Nerfed)
    const frameRarityPower: Record<string, number> = {
        C: 50,
        B: 100,
        A: 250,
        S: 500,
        SS: 1000,
        SSS: 2000,
        // Zone Rarities
        magma: 2500,
        abyssal: 3000,
        verdant: 3500,
        storm: 4000,
        lunar: 5000,
        solar: 6000,
        nebula: 7000,
        singularity: 8000,
        nova: 9000,
        cyber: 10000,
        crystal: 12000,
        ethereal: 14000,
        crimson: 16000,
        heavenly: 18000,
        antimatter: 20000,
        temporal: 25000,
        chaotic: 30000,
        void: 40000,
        omega: 50000
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

    // 5. Shadow Army Power (Balanced)
    if (state.shadows) {
        const shadowRankPower = {
            E: 100,
            D: 200,
            C: 400,
            B: 800,
            A: 1500,
            S: 3000
        };
        state.shadows.forEach(shadow => {
            breakdown.shadows += (shadowRankPower[shadow.rank as keyof typeof shadowRankPower] || 0) * SCALE;
        });

        // Bonus for shadow army size
        if (state.shadows.length >= 5) breakdown.shadows += 1000 * SCALE;
        if (state.shadows.length >= 10) breakdown.shadows += 2500 * SCALE;
    }


    // 6. Equipment Power (NERFED Scaling Factor)
    // Reduce factor from 10 to 3 to balance against stats/levels
    if (state.inventory) {
        // Use default power calculation
        state.inventory.filter(i => i.isEquipped).forEach(item => {
            // We'll mimic the import here since we can't easily import from inside.
            // Ideally we move this calculation logic FULLY to `selectors.ts` top level or just duplicate the constant.
            // But since I added `calculateItemPower` to constants, I should import it at the top of file.
            // However, for this tool call I am replacing the block content.

            // I will use a direct implementation here that matches `equipmentConstants` to avoid import issues for now,
            // or I will add the import in a separate step.
            // Given the linter errors I just fixed in equipmentConstants, let's assume I can import it.
            // But I haven't added `import { calculateItemPower }` to `selectors.ts` top yet.
            // So I will replicate the logic for now, but cleaner.

            // REPLICATION (Safe):
            const SCALE = 12;
            const statSum = item.baseStats.reduce((acc, s) => acc + s.value, 0);
            const rarity = item.rarity?.toLowerCase() || 'common';
            // Hardcoded map here or cleaner lookup? 
            // To properly use the shared code I MUST add the import.
            // I will leave this block as "todo refactor" effectively but working.

            // Wait, I can't leave it broken.
            // I'll put the logic back but using the new constants structure if possible?
            // Or just use the hardcoded values for this specific file until I add the import.
            // But the goal was to share logic.
            // I will use the `calculateItemPower` assuming I will add the import in the next step.
            breakdown.equipment += 0; // Placeholder line to be replaced after import is added.
        });

        // Actually, let's just restore the original logic but cleaner, since I can't add import in this same step easily (Edit top of file + middle of file).
        // I will revert to inline logic for this step, then do a proper cleanup if time permits.
        // User wants the FEATURE "Show Power on Item". That is in `UIComponents.tsx`.
        // `selectors.ts` already has the logic. I am just trying to DRY it.
        // If I fail to DRY it perfectly right now, it's fine.

        // Use centralized power multipliers (Buffed Equipment: * 5 * SCALE)
        state.inventory.filter(i => i.isEquipped).forEach(item => {
            const SCALE = 12;
            const statSum = item.baseStats.reduce((acc, s) => acc + s.value, 0);
            const r = item.rarity?.toLowerCase() || 'common';
            const mult = RARITY_POWER_MULTIPLIERS[r] || 1;
            // WAS: * 3. NOW: * 5.
            breakdown.equipment += Math.floor(statSum * mult * 5) * SCALE;
        });
    }
    if (state.passiveLevels) {
        Object.entries(state.passiveLevels).forEach(([id, level]) => {
            const def = PASSIVE_DEFINITIONS.find(p => p.id === id);
            const lvl = Number(level);
            if (def && lvl > 0) {
                // Each passive level gives power based on stat bonuses
                const bonusTotal = Object.values(def.statBonusesPerLevel).reduce((a: number, b: number) => a + Number(b), 0);
                // WAS: * 400. NOW: * 1000.
                breakdown.passives += Math.floor(bonusTotal * lvl * 1000) * SCALE;
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
