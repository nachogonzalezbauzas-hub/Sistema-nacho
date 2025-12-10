import React from 'react';
import { StatType, RankTier, ItemRarity } from './core';

// --- TITLES ---
export type TitleId =
    | 'disciplined'
    | 'daily_stepper'
    | 'first_blood'
    | 'body_tracker'
    | 'pen_on_paper'
    | 'iron_will'
    | 'routine_keeper'
    | 'shadow_breaker'
    | 'speed_walker'
    | 'arcane_mind'
    | 'fortune_seeker'
    | 'inner_flame'
    | 'season_rookie'
    | 'monarch_candidate'
    | 'balanced_soul'
    | 'mind_over_matter'
    | 'early_grinder'
    | 'season_challenger'
    | 'season_raider'
    | 's_rank_hunter'
    | 'tycoon'
    | 'hyper_focus'
    | 'unstoppable'
    | 'season_vanguard'
    | 'shadow_monarch'
    | 'demon_hunter'
    | 'necromancer'
    | 'national_level'
    | 'monarch_of_shadows'
    | 'season_monarch'
    | 'gym_apostle'
    | 'weight_breaker'
    | 'overlord'
    | 'season_legend'
    | 'full_sync'
    | 'perfect_cycle'
    | 'shadow_rider'
    | 'highway_monarch'
    | 'iron_will_master'
    | 'six_path_ascetic'
    | 'mind_king'
    | 'system_tycoon'
    | 'season_conqueror'
    | 'system_monarch'
    | 'eternal_streak'
    // Dungeon Titles
    | 'goblin_slayer'
    | 'bug_squasher'
    | 'survivor'
    | 'orc_conqueror'
    | 'ant_king_slayer'
    | 'god_slayer'
    // Shop Exclusive Titles
    | 'shop_void_emperor'
    | 'shop_celestial_being'
    | 'shop_titan_slayer'
    | 'shop_dragon_lord'
    | 'shop_eternal_warrior'
    | 'shop_shadow_king'
    | 'shop_phoenix_risen'
    | 'shop_storm_bringer'
    | 'shop_frost_emperor'
    | 'shop_blood_lord'
    | 'shop_soul_reaper'
    | 'shop_thunder_god'
    | 'shop_demon_king'
    | 'shop_arcane_master'
    | 'shop_elite_hunter'
    | 'shop_night_walker'
    | 'shop_blade_dancer'
    | 'shop_iron_guardian'
    | 'shop_swift_shadow'
    | 'shop_swift_shadow'
    | 'shop_apprentice'
    | string & {}; // Allow generic strings for zone titles

export type TitleRarity = ItemRarity;

export interface Title {
    id: TitleId;
    name: string;
    description: string;
    icon: React.ReactNode | string;
    rarity: TitleRarity;
}

// --- AVATAR FRAMES ---
export type AvatarFrameId = "default" | "lightning" | "arcane" | "inferno" | "shadow" | "royal" | "storm_rider" | "inner_flame_frame" | "golden_fortune" | "monarch_crest" | "season_crest" | "season_monarch" | "rainbow_monarch" | "eternal_chain" | "blue_flame" | "golden_glory" | "monarch_aura"
    | "goblin_frame" | "insect_carapace" | "red_gate_frost" | "orc_tusk" | "ant_king_crown" | "god_statue_aura"
    // Shop Exclusive Frames
    | "shop_cosmic_void" | "shop_divine_light" | "shop_dragon_aura" | "shop_infernal_blaze"
    | "shop_aurora_borealis" | "shop_shadow_vortex" | "shop_phoenix_flames" | "shop_thunder_strike"
    | "shop_frost_crystal" | "shop_blood_moon" | "shop_soul_chains" | "shop_storm_cyclone"
    | "shop_demon_horns" | "shop_arcane_runes" | "shop_elite_badge" | "shop_night_mist"
    | "shop_blade_edge" | "shop_iron_shield" | "shop_swift_wind" | "shop_basic_glow"
    | string & {}; // Allow generic strings for zone frames

export interface AvatarFrame {
    id: AvatarFrameId;
    name: string;
    description: string;
    rarity: "C" | "B" | "A" | "S" | "SS" | "SSS" | ItemRarity;
    unlockDescription: string;
    // Optional styling for shop frames
    borderStyle?: string;
    glowStyle?: string;
    animation?: string;
    condition?: (state?: any) => boolean;
}

// --- SHADOWS ---
export interface Shadow {
    id: string;
    name: string;
    rank: RankTier;
    image: string;
    bonus: {
        stat: StatType;
        value: number;
    };
    isEquipped: boolean;
    extractedAt: string;
    // Evolution System
    evolutionLevel: number; // 0 = Base, 1 = Elite, 2 = Marshal
    experiencePoints: number;
    xpToNextEvolution: number;
}

// --- EQUIPMENT ---
export type EquipmentType = 'weapon' | 'helmet' | 'chest' | 'gloves' | 'boots' | 'necklace' | 'ring' | 'ring2' | 'earrings';

export interface EquipmentStat {
    stat: StatType;
    value: number;
}

export interface Equipment {
    id: string;
    name: string;
    type: EquipmentType;
    rarity: ItemRarity;
    level: number;
    maxLevel: number;
    baseStats: EquipmentStat[];
    setId?: string;
    description: string;
    image?: string;
    isEquipped: boolean;
    transmogSkinId?: string;
    acquiredAt: string;
    consecutiveFailures?: number; // Pity system: track failures for upgrade chance boost
}

// Note: EquipmentSet depends on UserStats (Partial<UserStats>), so it might need to be in features or user?
// Actually, let's put EquipmentSet in features or keep it here but use Partial<Record<StatType, number>> instead of UserStats to avoid circular dep?
// UserStats has a lot of fields. Equipment bonuses usually just give stats.
// Let's use a simplified type for bonuses here if possible, or move EquipmentSet to features.
// But EquipmentSet is static data structure usually.
// Let's look at EquipmentSet definition:
// bonuses: { stats?: Partial<UserStats> ... }
// I will move EquipmentSet to `features.ts` or `user.ts` to avoid circular dependency if I can't import UserStats here.
// Or I can define a `StatBonus` type in core.
