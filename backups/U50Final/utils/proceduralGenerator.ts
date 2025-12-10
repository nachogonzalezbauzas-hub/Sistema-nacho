import { ItemRarity, StatType } from '../types/core';
import { Title, AvatarFrame } from '../types/items';

// --- CONSTANTS & DICTIONARIES ---

const TITLE_PREFIXES = [
    'Shadow', 'Iron', 'Golden', 'Eternal', 'Void', 'Crimson', 'Azure', 'Silent', 'Raging', 'Divine',
    'Cursed', 'Blessed', 'Ancient', 'Neon', 'Cyber', 'Spectral', 'Abyssal', 'Solar', 'Lunar', 'Cosmic',
    'Savage', 'Noble', 'Fallen', 'Ascended', 'Primal', 'Chaos', 'Order', 'Mystic', 'Arcane', 'Phantom'
];

const TITLE_CORES = [
    'Monarch', 'Hunter', 'Warrior', 'Mage', 'Assassin', 'Knight', 'Guardian', 'Slayer', 'Walker', 'Rider',
    'Emperor', 'Lord', 'King', 'Queen', 'Prince', 'Princess', 'Titan', 'Giant', 'Spirit', 'Soul',
    'Master', 'Grandmaster', 'Rookie', 'Challenger', 'Legend', 'Myth', 'God', 'Demon', 'Beast', 'Dragon'
];

const TITLE_SUFFIXES = [
    'of the Void', 'of Shadows', 'of Light', 'of Fire', 'of Ice', 'of Storms', 'of Time', 'of Death', 'of Life',
    'of the North', 'of the South', 'of the East', 'of the West', 'of the System', 'of Eternity', 'of Chaos',
    'of Order', 'of the Abyss', 'of the Stars', 'of the Sun', 'of the Moon', 'of the Earth', 'of the Sky',
    'Breaker', 'Slayer', 'Conqueror', 'Destroyer', 'Creator', 'Protector', 'Watcher'
];

const FRAME_STYLES = [
    { name: 'Solid', border: 'solid' },
    { name: 'Dashed', border: 'dashed' },
    { name: 'Double', border: 'double' },
    { name: 'Groove', border: 'groove' },
    { name: 'Ridge', border: 'ridge' },
    { name: 'Inset', border: 'inset' },
    { name: 'Outset', border: 'outset' },
    { name: 'Dotted', border: 'dotted' }
];

const GLOW_COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#ffffff', // White
    '#000000', // Black (Void)
];

const ANIMATIONS = [
    'pulse', 'spin', 'bounce', 'ping', 'shimmer', 'float', 'glitch', 'shake', 'neon-flicker'
];

// --- TYPES ---

export interface ProceduralTitle extends Title {
    isProcedural: true;
    generatedAt: number;
}

export interface ProceduralFrame extends AvatarFrame {
    isProcedural: true;
    generatedAt: number;
    visuals: {
        borderColor: string;
        glowColor: string;
        particleCount: number;
        animationSpeed: number; // 0.5 to 2.0
    };
}

export interface ProceduralAchievement {
    id: string;
    name: string;
    description: string;
    xpReward: number;
    rarity: ItemRarity;
    icon: string; // Emoji or Lucide icon name
}

// --- GENERATOR FUNCTIONS ---

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRarity = (): ItemRarity => {
    const rand = Math.random();
    if (rand > 0.97) return 'celestial';    // 3%
    if (rand > 0.94) return 'godlike';      // 3%
    if (rand > 0.88) return 'mythic';       // 6%
    if (rand > 0.75) return 'legendary';    // 13%
    if (rand > 0.55) return 'epic';         // 20%
    if (rand > 0.30) return 'rare';         // 25%
    if (rand > 0.10) return 'uncommon';     // 20%
    return 'common';                        // 10%
};

// Helper to select a contextual icon based on title name
const getIconForTitle = (name: string): string => {
    const lowerName = name.toLowerCase();

    // Map keywords to icon names
    if (lowerName.includes('shadow') || lowerName.includes('dark') || lowerName.includes('void') || lowerName.includes('night')) return 'Ghost';
    if (lowerName.includes('fire') || lowerName.includes('flame') || lowerName.includes('inferno') || lowerName.includes('burn')) return 'Flame';
    if (lowerName.includes('ice') || lowerName.includes('frost') || lowerName.includes('cold') || lowerName.includes('winter')) return 'Snowflake';
    if (lowerName.includes('storm') || lowerName.includes('thunder') || lowerName.includes('lightning') || lowerName.includes('spark')) return 'Zap';
    if (lowerName.includes('king') || lowerName.includes('queen') || lowerName.includes('royal') || lowerName.includes('monarch') || lowerName.includes('emperor')) return 'Crown';
    if (lowerName.includes('warrior') || lowerName.includes('fighter') || lowerName.includes('blade') || lowerName.includes('knight')) return 'Sword';
    if (lowerName.includes('guardian') || lowerName.includes('defender') || lowerName.includes('shield') || lowerName.includes('wall')) return 'Shield';
    if (lowerName.includes('hunter') || lowerName.includes('stalker') || lowerName.includes('ranger') || lowerName.includes('scout')) return 'Crosshair';
    if (lowerName.includes('mage') || lowerName.includes('wizard') || lowerName.includes('spell') || lowerName.includes('arcane')) return 'Sparkles';
    if (lowerName.includes('beast') || lowerName.includes('wolf') || lowerName.includes('bear') || lowerName.includes('dragon')) return 'Skull';
    if (lowerName.includes('god') || lowerName.includes('divine') || lowerName.includes('holy') || lowerName.includes('angel')) return 'Sun';
    if (lowerName.includes('demon') || lowerName.includes('devil') || lowerName.includes('hell') || lowerName.includes('cursed')) return 'Skull';
    if (lowerName.includes('wealth') || lowerName.includes('gold') || lowerName.includes('rich') || lowerName.includes('fortune')) return 'Coins';
    if (lowerName.includes('mind') || lowerName.includes('brain') || lowerName.includes('smart') || lowerName.includes('genius')) return 'Brain';
    if (lowerName.includes('speed') || lowerName.includes('fast') || lowerName.includes('quick') || lowerName.includes('flash')) return 'Zap';
    if (lowerName.includes('time') || lowerName.includes('chrono') || lowerName.includes('eternal') || lowerName.includes('ancient')) return 'Activity';
    if (lowerName.includes('star') || lowerName.includes('space') || lowerName.includes('cosmic') || lowerName.includes('galaxy')) return 'Star';
    if (lowerName.includes('moon') || lowerName.includes('lunar') || lowerName.includes('night')) return 'Moon';
    if (lowerName.includes('sun') || lowerName.includes('solar') || lowerName.includes('day')) return 'Sun';
    if (lowerName.includes('ocean') || lowerName.includes('sea') || lowerName.includes('water') || lowerName.includes('tide')) return 'Droplet';
    if (lowerName.includes('wind') || lowerName.includes('air') || lowerName.includes('sky') || lowerName.includes('breeze')) return 'Wind';
    if (lowerName.includes('earth') || lowerName.includes('stone') || lowerName.includes('rock') || lowerName.includes('mountain')) return 'Box';
    if (lowerName.includes('life') || lowerName.includes('heal') || lowerName.includes('vital') || lowerName.includes('heart')) return 'Heart';
    if (lowerName.includes('death') || lowerName.includes('dead') || lowerName.includes('kill') || lowerName.includes('grave')) return 'Skull';
    if (lowerName.includes('love') || lowerName.includes('passion') || lowerName.includes('romance')) return 'Heart';
    if (lowerName.includes('luck') || lowerName.includes('chance') || lowerName.includes('gamble')) return 'Dice';
    if (lowerName.includes('game') || lowerName.includes('play') || lowerName.includes('player')) return 'Gamepad';

    // Default random icon if no keyword matches
    const defaultIcons = ['Star', 'Sparkles', 'Trophy', 'Medal', 'Gem', 'Crown', 'Sword', 'Shield'];
    return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
};

export const generateProceduralTitle = (): ProceduralTitle => {
    const prefix = getRandomElement(TITLE_PREFIXES);
    const core = getRandomElement(TITLE_CORES);
    const suffix = getRandomElement(TITLE_SUFFIXES);

    const name = `${prefix} ${core} ${suffix}`;
    const rarity = generateRarity();
    const icon = getIconForTitle(name);

    return {
        id: `proc_title_${Date.now()}_${Math.floor(Math.random() * 1000)}` as any,
        name,
        description: `A title bestowed upon the ${name}.`,
        icon: icon,
        rarity,
        isProcedural: true,
        generatedAt: Date.now()
    };
};

const mapRarityToFrameRank = (rarity: ItemRarity): "C" | "B" | "A" | "S" | "SS" | "SSS" => {
    switch (rarity) {
        case 'common': return 'C';
        case 'uncommon': return 'B';
        case 'rare': return 'A';
        case 'epic': return 'S';
        case 'legendary': return 'SS';
        case 'mythic': return 'SSS';
        case 'godlike': return 'SSS';
        case 'celestial': return 'SSS';
        default: return 'C';
    }
};

// --- THEMES ---

const FRAME_THEMES = [
    {
        name: 'Inferno',
        colors: ['red', 'orange', 'amber'],
        borderBase: 'border-red-500',
        shadowBase: 'shadow-[0_0_20px_rgba(239,68,68,0.8)]',
        bgBase: 'bg-red-950/30',
        animations: ['animate-pulse', 'animate-fire-pulse'] // Ensure these exist in global CSS or tailwind config
    },
    {
        name: 'Glacial',
        colors: ['cyan', 'sky', 'blue'],
        borderBase: 'border-cyan-400',
        shadowBase: 'shadow-[0_0_20px_rgba(34,211,238,0.8)]',
        bgBase: 'bg-cyan-950/30',
        animations: ['animate-pulse', 'animate-spin-slow']
    },
    {
        name: 'Void',
        colors: ['purple', 'violet', 'fuchsia'],
        borderBase: 'border-purple-600',
        shadowBase: 'shadow-[0_0_30px_rgba(147,51,234,0.8)]',
        bgBase: 'bg-black',
        animations: ['animate-pulse', 'animate-spin-reverse-slow']
    },
    {
        name: 'Nature',
        colors: ['green', 'emerald', 'lime'],
        borderBase: 'border-green-500',
        shadowBase: 'shadow-[0_0_20px_rgba(34,197,94,0.8)]',
        bgBase: 'bg-green-950/30',
        animations: ['animate-pulse']
    },
    {
        name: 'Royal',
        colors: ['yellow', 'amber', 'gold'],
        borderBase: 'border-yellow-400',
        shadowBase: 'shadow-[0_0_25px_rgba(250,204,21,0.8)]',
        bgBase: 'bg-yellow-950/30',
        animations: ['animate-shimmer', 'animate-pulse']
    },
    {
        name: 'Cyber',
        colors: ['indigo', 'blue', 'violet'],
        borderBase: 'border-indigo-500',
        shadowBase: 'shadow-[0_0_20px_rgba(99,102,241,0.8)]',
        bgBase: 'bg-slate-900',
        animations: ['animate-pulse', 'animate-ping'] // Ping might be too much, but let's try
    },
    {
        name: 'Blood',
        colors: ['rose', 'red', 'pink'],
        borderBase: 'border-rose-600',
        shadowBase: 'shadow-[0_0_25px_rgba(225,29,72,0.8)]',
        bgBase: 'bg-rose-950/20',
        animations: ['animate-pulse']
    }
];

export const generateProceduralFrame = (): ProceduralFrame => {
    const rarity = generateRarity();
    const theme = getRandomElement(FRAME_THEMES);
    const rank = mapRarityToFrameRank(rarity);

    // Construct name
    const styleName = getRandomElement(['Aura', 'Halo', 'Ring', 'Circle', 'Barrier', 'Field', 'Veil', 'Crown']);
    const name = `${theme.name} ${styleName}`;

    // --- VISUAL PROGRESSION BASED ON RANK ---

    let borderClass = theme.borderBase;
    let shadowClass = theme.shadowBase;
    let bgClass = theme.bgBase;
    let animationClass = "";

    // Base animation selection
    const baseAnimation = getRandomElement(theme.animations.filter(a => a !== 'animate-ping'));

    if (rank === 'SSS') {
        // SSS: Intense, multi-layered
        const colorHex = theme.colors[0] === 'red' ? '#ef4444' :
            theme.colors[0] === 'cyan' ? '#22d3ee' :
                theme.colors[0] === 'purple' ? '#a855f7' : '#f43f5e';

        shadowClass = `shadow-[0_0_10px_${colorHex},0_0_30px_${colorHex},0_0_60px_${colorHex}]`;

        borderClass = `${theme.borderBase} ring-2 ring-offset-1 ring-offset-black ${theme.borderBase.replace('border-', 'ring-')}`;

        // Fixed: Removed bgClass to prevent "exploding interior"
        bgClass = 'bg-transparent';

        animationClass = `after:absolute after:inset-[-6px] after:rounded-full after:border-4 after:border-double after:border-white/50 after:${baseAnimation}`;

    } else if (rank === 'SS') {
        // SS: Stronger glow
        shadowClass = theme.shadowBase.replace('20px', '35px').replace('0.8', '1');
        borderClass = `${theme.borderBase} ring-1 ${theme.borderBase.replace('border-', 'ring-')}`;

        animationClass = `after:absolute after:inset-[-4px] after:rounded-full after:border-2 after:border-white/30 after:${baseAnimation}`;

    } else if (rank === 'S') {
        // S: Standard premium
        animationClass = `after:absolute after:inset-[-2px] after:rounded-full after:border after:border-white/20 after:${baseAnimation}`;
    } else {
        // A, B, C: Basic
        shadowClass = shadowClass.replace('20px', '10px').replace('0.8', '0.5');
        animationClass = "";
    }

    // Construct the final style string
    // Note: AvatarOrb uses `border-[3px]` for lg size, so our ring utilities help add visual weight.
    const borderStyle = `${borderClass} ${shadowClass} ${bgClass}`;

    return {
        id: `proc_frame_${Date.now()}_${Math.floor(Math.random() * 1000)}` as any,
        name,
        description: `A ${theme.name.toLowerCase()} frame pulsating with power.`,
        rarity: rank,
        unlockDescription: 'Forged in the System.',
        borderStyle: borderStyle,
        glowStyle: '',
        animation: animationClass, // Now contains after: classes
        isProcedural: true,
        generatedAt: Date.now(),
        visuals: {
            borderColor: theme.colors[0],
            glowColor: theme.colors[0],
            particleCount: getParticleCount(rarity),
            animationSpeed: rank === 'SSS' ? 2 : 1
        }
    };
};

// Helper to name colors
const getColorName = (hex: string): string => {
    if (hex === '#ef4444') return 'Crimson';
    if (hex === '#f97316') return 'Amber';
    if (hex === '#eab308') return 'Golden';
    if (hex === '#22c55e') return 'Emerald';
    if (hex === '#06b6d4') return 'Azure';
    if (hex === '#3b82f6') return 'Cobalt';
    if (hex === '#a855f7') return 'Amethyst';
    if (hex === '#ec4899') return 'Rose';
    if (hex === '#ffffff') return 'Pure';
    if (hex === '#000000') return 'Void';
    return 'Mystic';
};

const getParticleCount = (rarity: ItemRarity): number => {
    switch (rarity) {
        case 'common': return 0;
        case 'uncommon': return 2;
        case 'rare': return 5;
        case 'epic': return 10;
        case 'legendary': return 20;
        case 'mythic': return 35;
        case 'godlike': return 50;
        case 'celestial': return 75;
        default: return 0;
    }
};

export const generateProceduralAchievement = (): ProceduralAchievement => {
    const actions = ['Slay', 'Collect', 'Run', 'Lift', 'Meditate', 'Read', 'Code', 'Survive'];
    const targets = ['Goblins', 'Shards', 'Kilometers', 'Tons', 'Hours', 'Pages', 'Lines', 'Days'];
    const counts = [10, 50, 100, 500, 1000, 5000, 10000];

    const action = getRandomElement(actions);
    const target = getRandomElement(targets);
    const count = getRandomElement(counts);

    const rarity = count >= 10000 ? 'celestial' :
        count >= 5000 ? 'godlike' :
            count >= 1000 ? 'mythic' :
                count >= 500 ? 'legendary' :
                    count >= 100 ? 'epic' : 'rare';

    const name = `${action} ${count} ${target}`;
    const icon = getIconForTitle(name); // Reuse title icon logic for achievements

    return {
        id: `proc_ach_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name,
        description: `Prove your worth by completing this feat.`,
        xpReward: count * 10,
        rarity,
        icon: icon
    };
};
