import { TitleId, AvatarFrameId, ItemRarity } from '../types';
import { TitleDefinition, FrameDefinition } from './titles';
import React from 'react';
import {
    BookOpen, Wind, Shield, Swords, Moon, Target, Wand2, Skull,
    Zap, Ghost, Droplets, Snowflake, CloudLightning, Flame,
    Crown, Axe, Bird, Hammer, Sun, Orbit
} from 'lucide-react';

// 20 Shop-exclusive titles ordered from CHEAPEST to MOST EXPENSIVE
export const SHOP_TITLES: TitleDefinition[] = [
    // COMMON (50-100 QP) - No effects
    {
        id: 'shop_apprentice',
        name: 'Apprentice',
        description: 'Every master was once a student.',
        icon: <BookOpen size={24} />,
        rarity: 'common',
        textStyle: 'text-slate-500',
        glowStyle: '',
        cost: 50,
        condition: () => false
    },
    // UNCOMMON (150-300 QP) - Basic colors
    {
        id: 'shop_swift_shadow',
        name: 'Swift Shadow',
        description: 'Fast as darkness.',
        icon: <Wind size={24} />,
        rarity: 'uncommon',
        textStyle: 'text-gray-400',
        glowStyle: '',
        cost: 150,
        condition: () => false
    },
    {
        id: 'shop_iron_guardian',
        name: 'Iron Guardian',
        description: 'Stalwart defender.',
        icon: <Shield size={24} />,
        rarity: 'uncommon',
        textStyle: 'text-green-400',
        glowStyle: '',
        cost: 200,
        condition: () => false
    },
    {
        id: 'shop_blade_dancer',
        name: 'Blade Dancer',
        description: 'Grace with a sword.',
        icon: <Swords size={24} />,
        rarity: 'uncommon',
        textStyle: 'text-green-400',
        glowStyle: 'drop-shadow-[0_0_3px_rgba(74,222,128,0.3)]',
        cost: 300,
        condition: () => false
    },
    // RARE (400-800 QP) - Subtle glow
    {
        id: 'shop_night_walker',
        name: 'Night Walker',
        description: 'Moves unseen in darkness.',
        icon: <Moon size={24} />,
        rarity: 'rare',
        textStyle: 'text-blue-400',
        glowStyle: 'drop-shadow-[0_0_4px_rgba(96,165,250,0.4)]',
        cost: 400,
        condition: () => false
    },
    {
        id: 'shop_elite_hunter',
        name: 'Elite Hunter',
        description: 'Top of the hunting class.',
        icon: <Target size={24} />,
        rarity: 'rare',
        textStyle: 'text-emerald-400',
        glowStyle: 'drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]',
        cost: 500,
        condition: () => false
    },
    {
        id: 'shop_arcane_master',
        name: 'Arcane Master',
        description: 'Wielder of ancient magic.',
        icon: <Wand2 size={24} />,
        rarity: 'rare',
        textStyle: 'text-indigo-400',
        glowStyle: 'drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]',
        cost: 600,
        condition: () => false
    },
    {
        id: 'shop_demon_king',
        name: 'Demon King',
        description: 'Ruler of the underworld.',
        icon: <Skull size={24} className="text-red-400" />,
        rarity: 'rare',
        textStyle: 'text-red-400',
        glowStyle: 'drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]',
        cost: 700,
        condition: () => false
    },
    {
        id: 'shop_thunder_god',
        name: 'Thunder God',
        description: 'Commands the storms.',
        icon: <Zap size={24} className="text-yellow-300" />,
        rarity: 'rare',
        textStyle: 'text-yellow-300',
        glowStyle: 'drop-shadow-[0_0_6px_rgba(253,224,71,0.5)]',
        cost: 800,
        condition: () => false
    },
    // EPIC (1000-2000 QP) - Medium glow
    {
        id: 'shop_soul_reaper',
        name: 'Soul Reaper',
        description: 'Harvester of spirits.',
        icon: <Ghost size={24} />,
        rarity: 'epic',
        textStyle: 'text-violet-400',
        glowStyle: 'drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]',
        cost: 1000,
        condition: () => false
    },
    {
        id: 'shop_blood_lord',
        name: 'Blood Lord',
        description: 'Master of crimson arts.',
        icon: <Droplets size={24} className="text-red-500" />,
        rarity: 'epic',
        textStyle: 'text-red-500',
        glowStyle: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]',
        cost: 1200,
        condition: () => false
    },
    {
        id: 'shop_frost_emperor',
        name: 'Frost Emperor',
        description: 'Winter personified.',
        icon: <Snowflake size={24} className="text-blue-300" />,
        rarity: 'epic',
        textStyle: 'text-blue-300',
        glowStyle: 'drop-shadow-[0_0_8px_rgba(147,197,253,0.6)]',
        cost: 1500,
        condition: () => false
    },
    {
        id: 'shop_storm_bringer',
        name: 'Storm Bringer',
        description: 'Wields lightning itself.',
        icon: <CloudLightning size={24} className="text-cyan-400" />,
        rarity: 'epic',
        textStyle: 'text-cyan-400',
        glowStyle: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]',
        cost: 1800,
        condition: () => false
    },
    {
        id: 'shop_phoenix_risen',
        name: 'Phoenix Risen',
        description: 'Reborn from ashes.',
        icon: <Flame size={24} className="text-orange-400" />,
        rarity: 'epic',
        textStyle: 'text-orange-400',
        glowStyle: 'drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]',
        cost: 2000,
        condition: () => false
    },
    // LEGENDARY (2000-5000 QP) - Strong glow effects
    {
        id: 'shop_shadow_king',
        name: 'Shadow King',
        description: 'Commands the darkness.',
        icon: <Crown size={24} className="text-purple-400" />,
        rarity: 'legendary',
        textStyle: 'text-purple-400',
        glowStyle: 'drop-shadow-[0_0_10px_rgba(192,132,252,0.7)] animate-pulse',
        cost: 3000,
        condition: () => false
    },
    {
        id: 'shop_eternal_warrior',
        name: 'Eternal Warrior',
        description: 'Battles since time began.',
        icon: <Axe size={24} className="text-amber-400" />,
        rarity: 'legendary',
        textStyle: 'text-amber-400',
        glowStyle: 'drop-shadow-[0_0_10px_rgba(251,191,36,0.7)] animate-pulse',
        cost: 3500,
        condition: () => false
    },
    {
        id: 'shop_dragon_lord',
        name: 'Dragon Lord',
        description: 'Master of ancient beasts.',
        icon: <Bird size={24} className="text-orange-500" />,
        rarity: 'legendary',
        textStyle: 'text-orange-500',
        glowStyle: 'drop-shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-pulse',
        cost: 4000,
        condition: () => false
    },
    {
        id: 'shop_titan_slayer',
        name: 'Titan Slayer',
        description: 'Felled giants of legend.',
        icon: <Hammer size={24} className="text-yellow-400" />,
        rarity: 'legendary',
        textStyle: 'text-yellow-400',
        glowStyle: 'drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-pulse',
        cost: 5000,
        condition: () => false
    },
    // MYTHIC (8000+ QP) - Max animations
    {
        id: 'shop_celestial_being',
        name: 'Celestial Being',
        description: 'Transcended mortal limits.',
        icon: <Sun size={24} className="text-white" />,
        rarity: 'mythic',
        textStyle: 'text-white',
        glowStyle: 'drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] animate-pulse',
        cost: 8000,
        condition: () => false
    },
    {
        id: 'shop_void_emperor',
        name: 'Void Emperor',
        description: 'Ruler of the endless void.',
        icon: <Orbit size={24} className="text-violet-400" />,
        rarity: 'mythic',
        textStyle: 'animate-rainbow-text',
        glowStyle: 'drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]',
        cost: 10000,
        condition: () => false
    },
];

// 20 Shop-exclusive frames ordered from CHEAPEST to MOST EXPENSIVE
export const SHOP_FRAMES: FrameDefinition[] = [
    // C RANK (50-200 QP) - Visible basic border with subtle glow
    {
        id: 'shop_basic_glow',
        name: 'Basic Glow',
        description: 'A simple frame.',
        rarity: 'C',
        unlockDescription: 'Shop: 50 QP',
        borderStyle: 'border-2 border-slate-400',
        glowStyle: 'shadow-[0_0_10px_rgba(148,163,184,0.4)]',
        animation: '',
        cost: 50,
        condition: () => false
    },
    {
        id: 'shop_swift_wind',
        name: 'Swift Wind',
        description: 'Light as the breeze.',
        rarity: 'C',
        unlockDescription: 'Shop: 100 QP',
        borderStyle: 'border-2 border-teal-500',
        glowStyle: 'shadow-[0_0_12px_rgba(20,184,166,0.5)]',
        animation: '',
        cost: 100,
        condition: () => false
    },
    {
        id: 'shop_iron_shield',
        name: 'Iron Shield',
        description: 'Solid protection.',
        rarity: 'C',
        unlockDescription: 'Shop: 200 QP',
        borderStyle: 'border-2 border-zinc-400',
        glowStyle: 'shadow-[0_0_12px_rgba(161,161,170,0.5)]',
        animation: '',
        cost: 200,
        condition: () => false
    },
    // B RANK (300-600 QP) - Colored glow with double layer
    {
        id: 'shop_blade_edge',
        name: 'Blade Edge',
        description: 'Sharp and clean.',
        rarity: 'B',
        unlockDescription: 'Shop: 300 QP',
        borderStyle: 'border-2 border-lime-400',
        glowStyle: 'shadow-[0_0_15px_rgba(163,230,53,0.7),0_0_30px_rgba(132,204,22,0.35)]',
        animation: 'animate-pulse',
        cost: 300,
        condition: () => false
    },
    {
        id: 'shop_night_mist',
        name: 'Night Mist',
        description: 'Shrouded in mystery.',
        rarity: 'B',
        unlockDescription: 'Shop: 400 QP',
        borderStyle: 'border-2 border-violet-400',
        glowStyle: 'shadow-[0_0_15px_rgba(167,139,250,0.7),0_0_30px_rgba(139,92,246,0.35)]',
        animation: 'animate-pulse',
        cost: 400,
        condition: () => false
    },
    {
        id: 'shop_elite_badge',
        name: 'Elite Badge',
        description: 'Certified excellence.',
        rarity: 'B',
        unlockDescription: 'Shop: 500 QP',
        borderStyle: 'border-2 border-emerald-400',
        glowStyle: 'shadow-[0_0_18px_rgba(52,211,153,0.7),0_0_35px_rgba(16,185,129,0.35)]',
        animation: 'animate-pulse',
        cost: 500,
        condition: () => false
    },
    {
        id: 'shop_arcane_runes',
        name: 'Arcane Runes',
        description: 'Inscribed with power.',
        rarity: 'B',
        unlockDescription: 'Shop: 600 QP',
        borderStyle: 'border-2 border-indigo-400',
        glowStyle: 'shadow-[0_0_18px_rgba(129,140,248,0.7),0_0_35px_rgba(99,102,241,0.35)]',
        animation: 'animate-pulse',
        cost: 600,
        condition: () => false
    },
    // A RANK (800-1500 QP) - Triple layer glow
    {
        id: 'shop_demon_horns',
        name: 'Demon Horns',
        description: 'Infernal presence.',
        rarity: 'A',
        unlockDescription: 'Shop: 800 QP',
        borderStyle: 'border-[3px] border-rose-400',
        glowStyle: 'shadow-[0_0_22px_rgba(251,113,133,0.8),0_0_45px_rgba(244,63,94,0.4),0_0_70px_rgba(225,29,72,0.2)]',
        animation: 'animate-pulse',
        cost: 800,
        condition: () => false
    },
    {
        id: 'shop_storm_cyclone',
        name: 'Storm Cyclone',
        description: 'Swirling tempest.',
        rarity: 'A',
        unlockDescription: 'Shop: 1000 QP',
        borderStyle: 'border-[3px] border-cyan-300',
        glowStyle: 'shadow-[0_0_22px_rgba(103,232,249,0.8),0_0_45px_rgba(34,211,238,0.4),0_0_70px_rgba(6,182,212,0.2)]',
        animation: 'animate-pulse',
        cost: 1000,
        condition: () => false
    },
    {
        id: 'shop_soul_chains',
        name: 'Soul Chains',
        description: 'Bound spirits.',
        rarity: 'A',
        unlockDescription: 'Shop: 1200 QP',
        borderStyle: 'border-[3px] border-purple-300',
        glowStyle: 'shadow-[0_0_22px_rgba(216,180,254,0.8),0_0_45px_rgba(192,132,252,0.4),0_0_70px_rgba(168,85,247,0.2)]',
        animation: 'animate-pulse',
        cost: 1200,
        condition: () => false
    },
    {
        id: 'shop_blood_moon',
        name: 'Blood Moon',
        description: 'Crimson radiance.',
        rarity: 'A',
        unlockDescription: 'Shop: 1500 QP',
        borderStyle: 'border-[3px] border-red-400',
        glowStyle: 'shadow-[0_0_25px_rgba(248,113,113,0.8),0_0_50px_rgba(239,68,68,0.4),0_0_80px_rgba(220,38,38,0.2)]',
        animation: 'animate-pulse',
        cost: 1500,
        condition: () => false
    },
    // S RANK (2000-3500 QP) - Ring effects with intense glow
    {
        id: 'shop_frost_crystal',
        name: 'Frost Crystal',
        description: 'Frozen perfection.',
        rarity: 'S',
        unlockDescription: 'Shop: 2000 QP',
        borderStyle: 'border-[3px] border-sky-300 ring-2 ring-blue-400/50',
        glowStyle: 'shadow-[0_0_28px_rgba(125,211,252,0.9),0_0_55px_rgba(56,189,248,0.5),0_0_85px_rgba(14,165,233,0.3)]',
        animation: 'animate-pulse',
        cost: 2000,
        condition: () => false
    },
    {
        id: 'shop_thunder_strike',
        name: 'Thunder Strike',
        description: 'Electric power.',
        rarity: 'S',
        unlockDescription: 'Shop: 2500 QP',
        borderStyle: 'border-[3px] border-yellow-300 ring-2 ring-amber-400/50',
        glowStyle: 'shadow-[0_0_28px_rgba(253,224,71,0.9),0_0_55px_rgba(250,204,21,0.5),0_0_85px_rgba(234,179,8,0.3)]',
        animation: 'animate-pulse',
        cost: 2500,
        condition: () => false
    },
    {
        id: 'shop_phoenix_flames',
        name: 'Phoenix Flames',
        description: 'Burning rebirth.',
        rarity: 'S',
        unlockDescription: 'Shop: 3000 QP',
        borderStyle: 'border-[3px] border-orange-300 ring-2 ring-red-400/50',
        glowStyle: 'shadow-[0_0_28px_rgba(253,186,116,0.9),0_0_55px_rgba(251,146,60,0.5),0_0_85px_rgba(234,88,12,0.3)]',
        animation: 'animate-pulse',
        cost: 3000,
        condition: () => false
    },
    {
        id: 'shop_shadow_vortex',
        name: 'Shadow Vortex',
        description: 'Dark spiral.',
        rarity: 'S',
        unlockDescription: 'Shop: 3500 QP',
        borderStyle: 'border-[3px] border-violet-400 ring-2 ring-purple-500/50',
        glowStyle: 'shadow-[0_0_28px_rgba(167,139,250,0.9),0_0_55px_rgba(139,92,246,0.5),0_0_85px_rgba(124,58,237,0.3)]',
        animation: 'animate-pulse',
        cost: 3500,
        condition: () => false
    },
    // SS RANK (4000-6000 QP) - Ring-4 with layered max glow
    {
        id: 'shop_aurora_borealis',
        name: 'Aurora Borealis',
        description: 'Northern lights.',
        rarity: 'SS',
        unlockDescription: 'Shop: 4500 QP',
        borderStyle: 'border-[4px] border-cyan-300 ring-4 ring-teal-400/60',
        glowStyle: 'shadow-[0_0_40px_rgba(103,232,249,1),0_0_80px_rgba(34,211,238,0.6),0_0_120px_rgba(20,184,166,0.3)]',
        animation: 'animate-pulse',
        cost: 4500,
        condition: () => false
    },
    {
        id: 'shop_infernal_blaze',
        name: 'Infernal Blaze',
        description: 'Hellfire incarnate.',
        rarity: 'SS',
        unlockDescription: 'Shop: 5000 QP',
        borderStyle: 'border-[4px] border-red-400 ring-4 ring-orange-500/60',
        glowStyle: 'shadow-[0_0_40px_rgba(248,113,113,1),0_0_80px_rgba(239,68,68,0.6),0_0_120px_rgba(220,38,38,0.3)]',
        animation: 'animate-pulse',
        cost: 5000,
        condition: () => false
    },
    {
        id: 'shop_dragon_aura',
        name: 'Dragon Aura',
        description: 'Ancient beast power.',
        rarity: 'SS',
        unlockDescription: 'Shop: 6000 QP',
        borderStyle: 'border-[4px] border-orange-300 ring-4 ring-amber-500/60',
        glowStyle: 'shadow-[0_0_40px_rgba(253,186,116,1),0_0_80px_rgba(251,146,60,0.6),0_0_120px_rgba(234,88,12,0.3)]',
        animation: 'animate-pulse',
        cost: 6000,
        condition: () => false
    },
    // SSS RANK (10000+ QP) - Ultimate frames with max effects
    {
        id: 'shop_divine_light',
        name: 'Divine Light',
        description: 'Heavenly radiance.',
        rarity: 'SSS',
        unlockDescription: 'Shop: 10000 QP',
        borderStyle: 'border-[5px] border-yellow-200 ring-4 ring-amber-400 ring-offset-2 ring-offset-black',
        glowStyle: 'shadow-[0_0_60px_rgba(254,240,138,1),0_0_120px_rgba(253,224,71,0.7),0_0_180px_rgba(250,204,21,0.4),0_0_240px_rgba(234,179,8,0.2)]',
        animation: 'animate-pulse',
        cost: 10000,
        condition: () => false
    },
    {
        id: 'shop_cosmic_void',
        name: 'Cosmic Void',
        description: 'The endless universe.',
        rarity: 'SSS',
        unlockDescription: 'Shop: 12000 QP',
        borderStyle: 'border-[5px] border-violet-300 ring-4 ring-purple-500 ring-offset-2 ring-offset-black',
        glowStyle: 'shadow-[0_0_60px_rgba(196,181,253,1),0_0_120px_rgba(167,139,250,0.7),0_0_180px_rgba(139,92,246,0.4),0_0_240px_rgba(124,58,237,0.2)]',
        animation: 'animate-rainbow-border',
        cost: 12000,
        condition: () => false
    },
];
