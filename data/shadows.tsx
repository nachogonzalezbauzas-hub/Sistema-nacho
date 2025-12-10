import React from 'react';
import {
    Sword, Shield, Hammer, Flame, Wind, Crown, Skull, Swords,
    Ghost, Zap, Mountain, Eye
} from 'lucide-react';
import { RankTier, StatType } from '../types';

export interface ShadowEvolutionStage {
    suffix: string;
    rankBonus: number;
    colorOverride?: string;
    xpRequired: number;
}

export interface ShadowDefinition {
    id: string;
    name: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    rank: RankTier;
    bonusStat: StatType;
    evolutions: {
        base: ShadowEvolutionStage;
        elite: ShadowEvolutionStage;
        marshal: ShadowEvolutionStage;
    };
}

// Default evolution template for C-rank shadows
const DEFAULT_C_EVOLUTIONS = {
    base: { suffix: '', rankBonus: 0, xpRequired: 0 },
    elite: { suffix: ' Elite', rankBonus: 5, xpRequired: 500 },
    marshal: { suffix: ' Marshal', rankBonus: 10, xpRequired: 2000 }
};

// Default evolution template for A-rank shadows
const DEFAULT_A_EVOLUTIONS = {
    base: { suffix: '', rankBonus: 0, xpRequired: 0 },
    elite: { suffix: ' Elite', rankBonus: 8, xpRequired: 1000 },
    marshal: { suffix: ' Marshal', rankBonus: 15, xpRequired: 4000 }
};

// Default evolution template for S-rank shadows
const DEFAULT_S_EVOLUTIONS = {
    base: { suffix: '', rankBonus: 0, xpRequired: 0 },
    elite: { suffix: ' Elite', rankBonus: 10, xpRequired: 2000 },
    marshal: { suffix: ' Grand Marshal', rankBonus: 20, xpRequired: 8000 }
};

// Default evolution template for SS-rank shadows
const DEFAULT_SS_EVOLUTIONS = {
    base: { suffix: '', rankBonus: 0, xpRequired: 0 },
    elite: { suffix: ' Elite', rankBonus: 12, xpRequired: 3000 },
    marshal: { suffix: ' Overlord', rankBonus: 25, xpRequired: 12000 }
};

// Default evolution template for SSS-rank shadows
const DEFAULT_SSS_EVOLUTIONS = {
    base: { suffix: '', rankBonus: 0, xpRequired: 0 },
    elite: { suffix: ' Ascended', rankBonus: 15, xpRequired: 5000 },
    marshal: { suffix: ' Monarch', rankBonus: 30, xpRequired: 20000 }
};

export const SHADOW_DEFINITIONS: ShadowDefinition[] = [
    // E-C Ranks (Basic)
    {
        id: 'razan',
        name: 'Razan',
        title: 'The Ferocious',
        description: 'A basic beast soldier.',
        icon: <Zap size={40} />,
        color: 'text-blue-400',
        rank: 'C',
        bonusStat: 'Agility',
        evolutions: DEFAULT_C_EVOLUTIONS
    },
    {
        id: 'fang',
        name: 'Fang',
        title: 'Steel-Fanged',
        description: 'Wolf soldier with sharp instincts.',
        icon: <Eye size={40} />,
        color: 'text-slate-400',
        rank: 'C',
        bonusStat: 'Agility',
        evolutions: DEFAULT_C_EVOLUTIONS
    },
    {
        id: 'kasaka',
        name: 'Kasaka',
        title: 'Blue Venom',
        description: 'Serpent with paralyzing venom.',
        icon: <Wind size={40} />,
        color: 'text-blue-500',
        rank: 'C',
        bonusStat: 'Vitality',
        evolutions: DEFAULT_C_EVOLUTIONS
    },

    // B-A Ranks (Elite)
    {
        id: 'tank',
        name: 'Tank',
        title: 'Alpha Bear',
        description: 'A massive tank that absorbs damage.',
        icon: <Shield size={40} />,
        color: 'text-amber-700',
        rank: 'A',
        bonusStat: 'Vitality',
        evolutions: DEFAULT_A_EVOLUTIONS
    },
    {
        id: 'iron',
        name: 'Iron',
        title: 'Heavy Knight',
        description: 'A knight with unbreakable defense.',
        icon: <Hammer size={40} />,
        color: 'text-slate-300',
        rank: 'A',
        bonusStat: 'Strength',
        evolutions: DEFAULT_A_EVOLUTIONS
    },
    {
        id: 'tusk',
        name: 'Tusk',
        title: 'High Shaman',
        description: 'Master of flames and gravity magic.',
        icon: <Flame size={40} />,
        color: 'text-red-500',
        rank: 'A',
        bonusStat: 'Intelligence',
        evolutions: DEFAULT_A_EVOLUTIONS
    },
    {
        id: 'kaisel',
        name: 'Kaisel',
        title: 'Sky Ruler',
        description: 'Wyvern that dominates the skies.',
        icon: <Wind size={40} />,
        color: 'text-purple-400',
        rank: 'S',
        bonusStat: 'Agility',
        evolutions: DEFAULT_S_EVOLUTIONS
    },

    // S Rank (Commander)
    {
        id: 'igris',
        name: 'Igris',
        title: 'The Bloodred',
        description: 'Loyal knight commander.',
        icon: <Sword size={40} />,
        color: 'text-red-600',
        rank: 'S',
        bonusStat: 'Strength',
        evolutions: {
            base: { suffix: '', rankBonus: 0, xpRequired: 0 },
            elite: { suffix: ' Elite', rankBonus: 12, colorOverride: 'text-red-500', xpRequired: 2500 },
            marshal: { suffix: ' Grand Marshal', rankBonus: 25, colorOverride: 'text-yellow-500', xpRequired: 10000 }
        }
    },
    {
        id: 'greed',
        name: 'Greed',
        title: 'General',
        description: 'Commander of the vulcan army.',
        icon: <Skull size={40} />,
        color: 'text-orange-600',
        rank: 'S',
        bonusStat: 'Intelligence',
        evolutions: DEFAULT_S_EVOLUTIONS
    },

    // SS Rank (Marshal)
    {
        id: 'beru',
        name: 'Beru',
        title: 'Ant King',
        description: 'The apex predator of Jeju Island.',
        icon: <Crown size={40} />,
        color: 'text-teal-400',
        rank: 'SS',
        bonusStat: 'Agility',
        evolutions: {
            base: { suffix: '', rankBonus: 0, xpRequired: 0 },
            elite: { suffix: ' Elite', rankBonus: 15, colorOverride: 'text-teal-300', xpRequired: 4000 },
            marshal: { suffix: ' Overlord', rankBonus: 30, colorOverride: 'text-emerald-400', xpRequired: 15000 }
        }
    },
    {
        id: 'jima',
        name: 'Jima',
        title: 'Naga King',
        description: 'Ruler of the sea depths.',
        icon: <Mountain size={40} />,
        color: 'text-blue-600',
        rank: 'SS',
        bonusStat: 'Vitality',
        evolutions: DEFAULT_SS_EVOLUTIONS
    },

    // SSS Rank (Grand Marshal)
    {
        id: 'bellion',
        name: 'Bellion',
        title: 'Grand Marshal',
        description: 'The original shadow soldier.',
        icon: <Swords size={40} />,
        color: 'text-purple-600',
        rank: 'SSS',
        bonusStat: 'Strength',
        evolutions: DEFAULT_SSS_EVOLUTIONS
    },
    {
        id: 'kamish',
        name: 'Kamish',
        title: 'Dragon of Ruin',
        description: 'The calamity of humanity.',
        icon: <Flame size={40} />,
        color: 'text-red-700',
        rank: 'SSS',
        bonusStat: 'Strength',
        evolutions: DEFAULT_SSS_EVOLUTIONS
    },
    {
        id: 'ashborn',
        name: 'Ashborn',
        title: 'Shadow Monarch',
        description: 'The source of all shadows.',
        icon: <Ghost size={40} />,
        color: 'text-violet-500',
        rank: 'SSS',
        bonusStat: 'Intelligence',
        evolutions: {
            base: { suffix: '', rankBonus: 0, xpRequired: 0 },
            elite: { suffix: ' Awakened', rankBonus: 20, colorOverride: 'text-violet-400', xpRequired: 8000 },
            marshal: { suffix: ' Eternal', rankBonus: 50, colorOverride: 'text-fuchsia-500', xpRequired: 30000 }
        }
    }
];

export const getShadowDef = (idOrName: string): ShadowDefinition | undefined => {
    const normalized = idOrName.toLowerCase();
    return SHADOW_DEFINITIONS.find(s =>
        s.id === normalized || s.name.toLowerCase() === normalized
    );
};

// Helper to get evolution stage name
export const getEvolutionStageName = (level: number): 'base' | 'elite' | 'marshal' => {
    if (level >= 2) return 'marshal';
    if (level >= 1) return 'elite';
    return 'base';
};

// Helper to calculate XP needed for next evolution
export const getXpToNextEvolution = (def: ShadowDefinition, currentLevel: number): number => {
    const stage = getEvolutionStageName(currentLevel + 1);
    return def.evolutions[stage]?.xpRequired || Infinity;
};
