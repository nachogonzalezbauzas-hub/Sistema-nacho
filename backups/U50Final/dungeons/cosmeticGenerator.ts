import { TitleDefinition, FrameDefinition } from '../data/titles';

const PREFIXES = [
    'Void', 'Eternal', 'Abyssal', 'Celestial', 'Infernal', 'Divine', 'Shadow', 'Storm', 'Frost', 'Blood',
    'Ancient', 'Cursed', 'Blessed', 'Arcane', 'Cosmic', 'Titan', 'Dragon', 'Phoenix', 'Demon', 'Soul'
];

const SUFFIXES = [
    'Walker', 'Slayer', 'Monarch', 'Emperor', 'Lord', 'King', 'Guardian', 'Reaper', 'Bringer', 'Master',
    'Knight', 'Warrior', 'Hunter', 'Assassin', 'Mage', 'Sorcerer', 'Priest', 'Oracle', 'Prophet', 'God'
];

const COLORS = [
    'text-red-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 'text-yellow-500', 'text-pink-500', 'text-indigo-500', 'text-cyan-500',
    'text-slate-400', 'text-orange-500', 'text-teal-500', 'text-rose-500', 'text-fuchsia-500', 'text-violet-500', 'text-sky-500', 'text-lime-500'
];

const BORDER_STYLES = [
    'border-red-500', 'border-blue-500', 'border-green-500', 'border-purple-500', 'border-yellow-500', 'border-pink-500',
    'border-indigo-500', 'border-cyan-500', 'border-slate-400', 'border-orange-500', 'border-teal-500', 'border-rose-500'
];

const GLOW_STYLES = [
    'shadow-[0_0_15px_rgba(239,68,68,0.5)]', 'shadow-[0_0_15px_rgba(59,130,246,0.5)]', 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    'shadow-[0_0_15px_rgba(168,85,247,0.5)]', 'shadow-[0_0_15px_rgba(234,179,8,0.5)]', 'shadow-[0_0_15px_rgba(236,72,153,0.5)]'
];

const ANIMATIONS = [
    'animate-pulse', 'animate-bounce', 'animate-spin-slow', 'animate-ping-slow', 'animate-wiggle'
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateProceduralTitle = (floor: number): TitleDefinition => {
    const prefix = getRandomElement(PREFIXES);
    const suffix = getRandomElement(SUFFIXES);
    const name = `${prefix} ${suffix}`;

    // Higher floors = cooler styles
    const isHighTier = floor > 100;
    const textStyle = isHighTier
        ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse'
        : getRandomElement(COLORS);

    const glowStyle = isHighTier
        ? 'shadow-[0_0_20px_rgba(168,85,247,0.6)]'
        : '';

    return {
        id: `proc_title_${floor}_${Date.now()}` as any,
        name,
        description: `A title forged in the depths of Floor ${floor}.`,
        icon: '👑', // We can randomize icons too if we import iconMap, but string emoji is safe for now or we update types to allow string
        rarity: floor > 150 ? 'transcendent' : floor > 100 ? 'celestial' : 'godlike',
        textStyle,
        glowStyle,
        condition: () => true // Always unlocked once dropped
    };
};

export const generateProceduralFrame = (floor: number): FrameDefinition => {
    const prefix = getRandomElement(PREFIXES);
    const name = `${prefix} Frame`;

    const borderStyle = getRandomElement(BORDER_STYLES);
    const glowStyle = getRandomElement(GLOW_STYLES);
    const animation = floor > 50 ? getRandomElement(ANIMATIONS) : '';

    return {
        id: `proc_frame_${floor}_${Date.now()}` as any,
        name,
        description: `Obtained from the Demon Tower Floor ${floor}.`,
        rarity: floor > 150 ? 'SSS' : 'SS', // Mapping to S-Rank system for frames
        unlockDescription: `Clear Floor ${floor}.`,
        borderStyle,
        glowStyle,
        animation,
        condition: () => true
    };
};
