import { TitleDefinition, FrameDefinition, TitleRarity, ItemRarity } from '@/types';

// --- CONSTANTS ---
const RARITIES: ItemRarity[] = [
    // Standard Progression
    'common', 'uncommon', 'rare', 'epic', 'legendary',
    'mythic', 'godlike', 'celestial', 'transcendent', 'primordial',
    'eternal', 'divine', 'cosmic', 'infinite',
    // Zone Specific
    'magma', 'abyssal', 'verdant', 'storm', 'lunar',
    'solar', 'nebula', 'singularity', 'nova', 'cyber',
    'crystal', 'ethereal', 'crimson', 'heavenly', 'antimatter',
    'temporal', 'chaotic', 'void', 'omega'
];

const SOURCES = [
    'Mission Reward', 'Daily Quest', 'Epic Mission Milestone', 'Demon Tower Floor',
    'Shadow Realm Drop', 'Specific Boss Drop', 'Zone Change Boss', 'Achievement Reward',
    'Shop Exclusive', 'Season Reward'
];
const SOURCE_KEYS = [
    'mission', 'daily', 'epic_mission', 'tower',
    'shadow', 'boss_specific', 'boss_zone', 'achievement',
    'shop', 'season'
];

// --- VOCABULARY ---
const TITLE_ADJECTIVES = [
    'Novice', 'Apprentice', 'Skilled', 'Expert', 'Master', 'Grandmaster',
    'Fierce', 'Savage', 'Brutal', 'Ruthless', 'Merciless', 'Bloodthirsty',
    'Ancient', 'Forgotten', 'Lost', 'Forbidden', 'Cursed', 'Blessed',
    'Shiny', 'Radiant', 'Luminous', 'Glowing', 'Blinding', 'Prismatic',
    'Dark', 'Shadowy', 'Gloomy', 'Hidden', 'Secret', 'Occult',
    'Holy', 'Sacred', 'Hallowed', 'Angelic', 'Pure',
    'Royal', 'Imperial', 'Majestic', 'Noble', 'Kingly', 'Queenly',
    'Tech', 'Digital', 'Virtual', 'System', 'Glitch',
    'Wild', 'Feral', 'Beastly', 'Untamed', 'Sylvan'
];
const TITLE_NOUNS = [
    'Walker', 'Runner', 'Sprinter', 'Dasher', 'Flash', 'Speedster',
    'Fighter', 'Warrior', 'Soldier', 'Knight', 'Guardian', 'Sentinel',
    'Mage', 'Wizard', 'Sorcerer', 'Warlock', 'Summoner', 'Necromancer',
    'Hunter', 'Killer', 'Slayer', 'Assassin', 'Rogue', 'Thief',
    'King', 'Queen', 'Lord', 'Lady', 'Prince', 'Princess',
    'God', 'Goddess', 'Deity', 'Divinity', 'Spirit', 'Soul',
    'Overlord', 'Emperor', 'Monarch', 'Ruler', 'Titan', 'Giant'
];

const FRAME_ADJECTIVES = [
    'Simple', 'Basic', 'Sturdy', 'Reinforced', 'Heavy', 'Light', // Low Tier
    'Polished', 'Ornate', 'Gilded', 'Etched', 'Inlaid', 'Jeweled', // Mid Tier
    'Glowing', 'Radiant', 'Shimmering', 'Pulsing', 'Burning', 'Frozen', // High Tier
    'Ethereal', 'Spectral', 'Cosmic', 'Void', 'Dimensional', 'Infinite' // God Tier
];
const FRAME_NOUNS = [
    'Border', 'Edge', 'Rim', 'Frame', // Low
    'Band', 'Hoop', 'Ring', 'Circle', // Mid
    'Halo', 'Aura', 'Crown', 'Crest', // High
    'Vortex', 'Portal', 'Event Horizon', 'Singularity' // God
];

// --- VISUAL HELPERS ---
const TAILWIND_COLORS = [
    'slate', 'gray', 'zinc', 'neutral', 'stone',
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];

const getRandomColor = (seed: number) => TAILWIND_COLORS[seed % TAILWIND_COLORS.length];

// Rarity Color Mapping (for Titles)
const getRarityColor = (index: number) => {
    const colors = ['slate', 'emerald', 'sky', 'purple', 'amber', 'red', 'fuchsia', 'cyan', 'rose', 'orange', 'teal', 'yellow', 'indigo', 'neutral'];
    return colors[index % colors.length];
};

// --- GENERATOR ---
const generateCosmetics = () => {
    const titles: TitleDefinition[] = [];
    const frames: FrameDefinition[] = [];
    const COUNT_PER_RARITY = 10;

    RARITIES.forEach((rarity, rIndex) => {
        const rarityColor = getRarityColor(rIndex);

        for (let i = 0; i < COUNT_PER_RARITY; i++) {
            const seed = rIndex * 100 + i;
            const sourceKey = SOURCE_KEYS[i % SOURCE_KEYS.length];
            const source = SOURCES[i % SOURCES.length];

            // --- FRAME VISUALS BY TIER ---
            // Calculate complexity tier based on rIndex (0-32)
            // 0-4: Tier 1 (Common) - Simple
            // 5-13: Tier 2 (Mid) - Rings/Glows
            // 14-25: Tier 3 (High) - Animations/Shadows
            // 26-32: Tier 4 (God) - Extreme

            let cssClass = "";
            let anim: string | undefined = undefined;
            const rndColor = getRandomColor(seed * 7);
            const rndColor2 = getRandomColor(seed * 11);

            // Name Selection based on Tier to match Visuals
            let fAdjList = FRAME_ADJECTIVES.slice(0, 6);
            let fNounList = FRAME_NOUNS.slice(0, 4);

            if (rIndex > 4) { fAdjList = FRAME_ADJECTIVES.slice(6, 12); fNounList = FRAME_NOUNS.slice(4, 8); }
            if (rIndex > 13) { fAdjList = FRAME_ADJECTIVES.slice(12, 18); fNounList = FRAME_NOUNS.slice(8, 12); }
            if (rIndex > 25) { fAdjList = FRAME_ADJECTIVES.slice(18); fNounList = FRAME_NOUNS.slice(12); }

            const fAdj = fAdjList[seed % fAdjList.length];
            const fNoun = fNounList[seed % fNounList.length];

            // CSS Construction
            if (rIndex <= 4) {
                // TIER 1: SIMPLE
                // Border only, no shadow, no animation
                const borderStyles = ['solid', 'dashed', 'dotted'];
                const bStyle = borderStyles[seed % borderStyles.length];
                cssClass = `border-[3px] border-${bStyle} border-${rndColor}-500 rounded-xl bg-${rndColor}-500/5`;
            }
            else if (rIndex <= 13) {
                // TIER 2: ADVANCED
                // Ring + Mild Shadow + Slow Pulse (Rarely)
                // Use explicit border color to avoid "invisible" borders
                cssClass = `rounded-xl border-2 border-${rndColor}-400 ring-2 ring-${rndColor}-500/20 shadow-sm`;
                if (i % 3 === 0) anim = 'animate-pulse';
            }
            else if (rIndex <= 25) {
                // TIER 3: HIGH
                // Double Ring, Gradients, Strong Shadows
                const gradDir = ['br', 'tr', 'bl', 'tl'][seed % 4];
                // Ensure opacity is high enough to be seen
                cssClass = `rounded-xl border-2 border-${rndColor}-400 bg-gradient-to-${gradDir} from-${rndColor}-500/30 to-${rndColor2}-500/10 relative`;

                // Add ring via ring util
                cssClass += ` ring-2 ring-${rndColor}-400 ring-offset-1 ring-offset-slate-900`;

                // Strong Shadow
                cssClass += ` shadow-[0_0_15px_var(--color-${rndColor}-500)]`;

                anim = i % 2 === 0 ? 'animate-pulse' : 'animate-pulse-slow';
            }
            else {
                // TIER 4: GOD / ZONE OMEGA
                // Extreme Complexity - FIXED "Black Box" Issue
                // DO NOT USE overflow-hidden on the main element if we want outer glow!
                // We use a dark but TRANSLUCENT background to let content shine through slightly, or rich gradients.

                const gradDir = ['r', 'b', 'br', 'tl'][seed % 4];

                // Complex Shadow: Inset Glow + Outer Ring + Diffuse Glow
                // We MUST rely on the element's own border for the hard edge if shadows are finicky
                // But let's use a transparent border with a strong Ring.

                const shadow = `inset 0 0 20px var(--color-${rndColor}-500), 0 0 15px var(--color-${rndColor2}-500)`;

                // Rich background instead of flat black
                cssClass = `rounded-2xl border-2 border-${rndColor}-400 bg-gradient-to-${gradDir} from-black via-${rndColor}-900/50 to-black relative`;

                // Add explicit outer ring + shadow classes
                // standard tailwind shadow for outer glow
                cssClass += ` ring-2 ring-${rndColor2}-400 ring-offset-2 ring-offset-black`;

                // Arbitrary shadow for the inset glow ONLY (to avoid clipping outer)
                // Actually, let's put the outer glow in drop-shadow or box-shadow
                const cleanShadow = shadow.replace(/, /g, ',').replace(/ /g, '_');
                cssClass += ` shadow-[${cleanShadow}]`;

                // Anim - PROGRESSIVE INTENSITY
                // Tier 4 gets the most chaotic/fast animations
                const godAnims = ['animate-spin-reverse-slow', 'animate-glitch', 'animate-fire-pulse', 'animate-pulse-fast'];
                anim = godAnims[seed % godAnims.length];
            }

            // --- ANIMATION OVERRIDES ---
            // Ensure animation intensity matches strict tiering if not set above
            if (rIndex <= 4) {
                anim = undefined; // Tier 1: Static
            } else if (rIndex <= 13) {
                // Tier 2: Subtle
                if (i % 2 === 0) anim = 'animate-pulse-slow';
            } else if (rIndex <= 25) {
                // Tier 3: Active
                const highAnims = ['animate-pulse', 'animate-float', 'animate-spin-slow'];
                anim = highAnims[seed % highAnims.length];
            }
            // Tier 4 is already set to God Anims above
            // Cost Logic (QP)
            let cost: number | undefined = undefined;
            if (sourceKey === 'shop') {
                // Base cost 500, scaling with rarity
                // Common: 500, Rare: 2000, Legend: 10000, Mythic: 50000
                cost = 500 * Math.pow(2, rIndex);
                if (cost > 1000000) cost = 999999; // Cap
            }

            frames.push({
                id: `frame_${rarity}_${sourceKey}`,
                name: `${fAdj} ${fNoun}`,
                description: `A ${rarity} frame. Obtained from ${source}.`,
                rarity: rarity as any,
                unlockDescription: `Obtained from ${source}`,
                condition: () => false,
                sourceType: sourceKey,
                cssClass: cssClass,
                animation: anim,
                cost: cost
            });

            // --- TITLE ---
            const tAdj = TITLE_ADJECTIVES[(seed * 3) % TITLE_ADJECTIVES.length];
            const tNoun = TITLE_NOUNS[(seed * 7) % TITLE_NOUNS.length];

            let titleCost: number | undefined = undefined;
            let titleAcquisitionText = `Obtained from ${source}.`;
            if (sourceKey === 'shop') {
                titleCost = 500 * Math.pow(2, rIndex);
                if (titleCost > 1000000) titleCost = 999999;
                titleAcquisitionText = `Purchased from the shop for ${titleCost} QP.`;
            }

            titles.push({
                id: `title_${rarity}_${sourceKey}`,
                name: `${tAdj} ${tNoun}`,
                description: `A ${rarity} title. ${titleAcquisitionText}`,
                rarity: rarity as TitleRarity,
                icon: 'Crown',
                condition: () => false,
                sourceType: sourceKey,
                textStyle: `text-${rarityColor}-${rIndex > 5 ? 400 : 500} ${rIndex > 8 ? 'animate-pulse' : ''} ${rIndex > 11 ? 'font-black tracking-widest' : 'font-bold'}`,
                glowStyle: rIndex > 6 ? `shadow-[0_0_${(rIndex - 5) * 5}px_var(--color-${rarityColor}-500)]` : undefined,
                cost: titleCost
            });
        }
    });

    return { titles, frames };
};

const { titles, frames } = generateCosmetics();
export const STATIC_TITLES = titles;
export const STATIC_FRAMES = frames;

const getRaritiesForZone = (zoneId: number): ItemRarity[] => {
    const centerIndex = Math.floor(((zoneId - 1) / 19) * (RARITIES.length - 1));
    const minIndex = Math.max(0, centerIndex - 1);
    const maxIndex = Math.min(RARITIES.length - 1, centerIndex + 1);
    const available: ItemRarity[] = [];
    for (let i = minIndex; i <= maxIndex; i++) { available.push(RARITIES[i]); }
    return available;
};

export const getZoneCosmeticDrop = (zoneId: number, requiredSource?: string): { type: 'title' | 'frame', item: TitleDefinition | FrameDefinition } | null => {
    const validRarities = getRaritiesForZone(zoneId);
    const isTitle = Math.random() > 0.5;
    const sourceCollection = isTitle ? STATIC_TITLES : STATIC_FRAMES;
    const validItems = sourceCollection.filter(item => {
        const itemRarity = item.rarity as ItemRarity;
        if (!validRarities.includes(itemRarity)) return false;
        if (requiredSource && item.sourceType !== requiredSource) return false;
        if (!requiredSource && (item.sourceType === 'shop' || item.sourceType === 'season')) return false;
        return true;
    });
    if (validItems.length === 0) return null;
    const item = validItems[Math.floor(Math.random() * validItems.length)];
    return { type: isTitle ? 'title' : 'frame', item: item as any };
};
