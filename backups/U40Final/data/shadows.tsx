import React from 'react';
import {
    Sword, Shield, Hammer, Flame, Wind, Crown, Skull, Swords,
    Ghost, Zap, Mountain, Eye
} from 'lucide-react';
import { RankTier, StatType } from '../types';

export interface ShadowDefinition {
    id: string; // Matches the ID generated or used in logic
    name: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string; // Hex or Tailwind class
    rank: RankTier;
    bonusStat: StatType;
}

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
        bonusStat: 'Agility'
    },
    {
        id: 'fang',
        name: 'Fang',
        title: 'Steel-Fanged',
        description: 'Wolf soldier with sharp instincts.',
        icon: <Eye size={40} />,
        color: 'text-slate-400',
        rank: 'C',
        bonusStat: 'Agility'
    },
    {
        id: 'kasaka',
        name: 'Kasaka',
        title: 'Blue Venom',
        description: 'Serpent with paralyzing venom.',
        icon: <Wind size={40} />,
        color: 'text-blue-500',
        rank: 'C',
        bonusStat: 'Vitality'
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
        bonusStat: 'Vitality'
    },
    {
        id: 'iron',
        name: 'Iron',
        title: 'Heavy Knight',
        description: 'A knight with unbreakable defense.',
        icon: <Hammer size={40} />,
        color: 'text-slate-300',
        rank: 'A',
        bonusStat: 'Strength'
    },
    {
        id: 'tusk',
        name: 'Tusk',
        title: 'High Shaman',
        description: 'Master of flames and gravity magic.',
        icon: <Flame size={40} />,
        color: 'text-red-500',
        rank: 'A',
        bonusStat: 'Intelligence'
    },
    {
        id: 'kaisel',
        name: 'Kaisel',
        title: 'Sky Ruler',
        description: 'Wyvern that dominates the skies.',
        icon: <Wind size={40} />,
        color: 'text-purple-400',
        rank: 'S',
        bonusStat: 'Agility'
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
        bonusStat: 'Strength'
    },
    {
        id: 'greed',
        name: 'Greed',
        title: 'General',
        description: 'Commander of the vulcan army.',
        icon: <Skull size={40} />,
        color: 'text-orange-600',
        rank: 'S',
        bonusStat: 'Intelligence'
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
        bonusStat: 'Agility'
    },
    {
        id: 'jima',
        name: 'Jima',
        title: 'Naga King',
        description: 'Ruler of the sea depths.',
        icon: <Mountain size={40} />,
        color: 'text-blue-600',
        rank: 'SS',
        bonusStat: 'Vitality'
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
        bonusStat: 'Strength'
    },
    {
        id: 'kamish',
        name: 'Kamish',
        title: 'Dragon of Ruin',
        description: 'The calamity of humanity.',
        icon: <Flame size={40} />,
        color: 'text-red-700',
        rank: 'SSS',
        bonusStat: 'Strength'
    },
    {
        id: 'ashborn',
        name: 'Ashborn',
        title: 'Shadow Monarch',
        description: 'The source of all shadows.',
        icon: <Ghost size={40} />,
        color: 'text-violet-500',
        rank: 'SSS',
        bonusStat: 'Intelligence'
    }
];

export const getShadowDef = (idOrName: string): ShadowDefinition | undefined => {
    const normalized = idOrName.toLowerCase();
    return SHADOW_DEFINITIONS.find(s =>
        s.id === normalized || s.name.toLowerCase() === normalized
    );
};
