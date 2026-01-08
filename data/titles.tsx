import { AppState, AvatarFrame, Title, TitleId, AvatarFrameId, TitleDefinition, FrameDefinition } from '../types';
import { DUNGEON_IDS, MILESTONE_IDS, TITLE_IDS } from './gameConstants';
import {
  Activity, Footprints, Droplet, ChartBar, PenTool, Skull,
  Link, Calendar, BicepsFlexed, Zap, Brain, Gem, Flame, Sprout, Bug,
  Crown, Scale, Sunrise, Shield, Snowflake,
  DollarSign, Crosshair, Rocket, Medal, Dumbbell, Weight, Sword,
  Trophy, Dna, RefreshCw, Bike, HandMetal, Ghost, Users,
  Eye, Globe, User
} from 'lucide-react';
import React from 'react';
import { SHADOW_DEFINITIONS } from './shadows';

// --- SHADOW TITLES (Dynamically Generated) ---
export const SHADOW_TITLES: TitleDefinition[] = SHADOW_DEFINITIONS.map(shadow => ({
  id: `shadow_master_${shadow.id}`,
  name: `Monarch of ${shadow.name}`,
  description: `Sombra extraída de ${shadow.name}.`,
  icon: shadow.icon ? React.cloneElement(shadow.icon as React.ReactElement, { size: 24 }) : <Users size={24} />,
  rarity: 'mythic',
  textStyle: shadow.color || 'text-purple-400',
  glowStyle: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]',
  condition: (state) => (state.shadows || []).some(s => s.name === shadow.name)
}));

// --- DEFINITIONS WITH LOGIC ---
// Moved to types/cosmetics.ts to avoid circular dependency

// --- TITLES ---
// RANK ORDER: common (gray) -> uncommon (green) -> rare (blue) -> epic (purple) -> legendary (gold) -> mythic (red) -> godlike (rainbow/max)

export const BASE_TITLES: TitleDefinition[] = [
  // ===== COMMON (Gray) - Basic first achievements =====
  {
    id: 'disciplined',
    name: 'The Disciplined',
    description: 'Reach a 7-day streak on any mission.',
    icon: <Activity size={24} />,
    rarity: 'common',
    textStyle: 'text-slate-400',
    glowStyle: '',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 7)
  },
  {
    id: 'daily_stepper',
    name: 'Daily Stepper',
    description: 'Complete any daily mission 10 times in total.',
    icon: <Footprints size={24} />,
    rarity: 'common',
    textStyle: 'text-slate-400',
    glowStyle: '',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 3)
  },
  {
    id: 'first_blood',
    name: 'First Mission',
    description: 'Complete your first mission.',
    icon: <Droplet size={24} />,
    rarity: 'common',
    textStyle: 'text-slate-400',
    glowStyle: '',
    condition: (state) => state.missions.some(m => !!m.lastCompletedAt)
  },
  {
    id: 'body_tracker',
    name: 'Status Initiate',
    description: 'Register a body record for the first time.',
    icon: <ChartBar size={24} />,
    rarity: 'common',
    textStyle: 'text-slate-400',
    glowStyle: '',
    condition: (state) => state.bodyRecords.length >= 1
  },
  {
    id: 'pen_on_paper',
    name: 'Journal Initiate',
    description: 'Create your first journal entry.',
    icon: <PenTool size={24} />,
    rarity: 'common',
    textStyle: 'text-slate-400',
    glowStyle: '',
    condition: (state) => state.journalEntries.length >= 1
  },
  {
    id: 'goblin_slayer',
    name: 'Goblin Slayer',
    description: 'Cleared the Goblin Den.',
    icon: <Skull size={24} />,
    rarity: 'common',
    textStyle: 'text-slate-400',
    glowStyle: '',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.GOBLIN_DEN && r.victory)
  },

  // ===== UNCOMMON (Green) - Consolidated habits =====
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Reach a 30-day streak on any mission.',
    icon: <Link size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 30)
  },
  {
    id: 'routine_keeper',
    name: 'Routine Keeper',
    description: 'Maintain at least one active streak for 14 days.',
    icon: <Calendar size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 14)
  },
  {
    id: 'shadow_breaker',
    name: 'Shadow Breaker',
    description: 'Reach 20 Strength.',
    icon: <BicepsFlexed size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => state.stats.strength >= 20
  },
  {
    id: 'speed_walker',
    name: 'Speed Walker',
    description: 'Reach 20 Agility.',
    icon: <Zap size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => state.stats.agility >= 20
  },
  {
    id: 'arcane_mind',
    name: 'Arcane Mind',
    description: 'Reach 20 Intelligence.',
    icon: <Brain size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => state.stats.intelligence >= 20
  },
  {
    id: 'fortune_seeker',
    name: 'Fortune Seeker',
    description: 'Reach 20 Fortune.',
    icon: <Gem size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => state.stats.fortune >= 20
  },
  {
    id: 'inner_flame',
    name: 'Inner Flame',
    description: 'Reach 20 Metabolism.',
    icon: <Flame size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => state.stats.metabolism >= 20
  },
  {
    id: 'season_rookie',
    name: 'Season Rookie',
    description: 'Reached Rank D in the current season.',
    icon: <Sprout size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => !!state.currentSeason && ['D', 'C', 'B', 'A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'bug_squasher',
    name: 'Bug Squasher',
    description: 'Exterminated the Insect Pit.',
    icon: <Bug size={24} />,
    rarity: 'uncommon',
    textStyle: 'text-green-400',
    glowStyle: 'drop-shadow-[0_0_4px_rgba(74,222,128,0.3)]',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.INSECT_PIT && r.victory)
  },

  // ===== RARE (Blue) - Serious progress =====
  {
    id: 'monarch_candidate',
    name: 'Monarch Candidate',
    description: 'Reach Level 10.',
    icon: <Crown size={24} />,
    rarity: 'rare',
    textStyle: 'text-blue-400',
    glowStyle: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]',
    condition: (state) => state.stats.level >= 10
  },
  {
    id: 'balanced_soul',
    name: 'Balanced Soul',
    description: 'Reach Strength, Vitality and Agility all at 20 or more.',
    icon: <Scale size={24} />,
    rarity: 'rare',
    textStyle: 'text-blue-400',
    glowStyle: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]',
    condition: (state) => state.stats.strength >= 20 && state.stats.vitality >= 20 && state.stats.agility >= 20
  },
  {
    id: 'mind_over_matter',
    name: 'Mind Over Matter',
    description: 'Reach Intelligence 25 and keep a 7-day streak on any mental mission.',
    icon: <Brain size={24} className="text-blue-400" />,
    rarity: 'rare',
    textStyle: 'text-blue-400',
    glowStyle: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]',
    condition: (state) => state.stats.intelligence >= 25 && state.missions.some(m => m.targetStat === 'Intelligence' && (m.streak || 0) >= 7)
  },
  {
    id: 'early_grinder',
    name: 'Early Grinder',
    description: 'Complete any mission before 8:00 AM for 5 different days.',
    icon: <Sunrise size={24} />,
    rarity: 'rare',
    textStyle: 'text-blue-400',
    glowStyle: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]',
    condition: (state) => state.logs.some(l => l.category === 'Mission' && l.tags?.includes('early_5_days'))
  },
  {
    id: 'season_challenger',
    name: 'Season Challenger',
    description: 'Reached Rank C in the current season.',
    icon: <Sword size={24} />,
    rarity: 'rare',
    textStyle: 'text-blue-400',
    glowStyle: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]',
    condition: (state) => !!state.currentSeason && ['C', 'B', 'A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'season_raider',
    name: 'Season Raider',
    description: 'Reached Rank B in the current season.',
    icon: <Shield size={24} />,
    rarity: 'rare',
    textStyle: 'text-blue-400',
    glowStyle: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]',
    condition: (state) => !!state.currentSeason && ['B', 'A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'survivor',
    name: 'Red Gate Survivor',
    description: 'Survived the frozen wasteland.',
    icon: <Snowflake size={24} />,
    rarity: 'rare',
    textStyle: 'text-blue-400',
    glowStyle: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.RED_GATE && r.victory)
  },

  // ===== EPIC (Purple) - Very tough achievements =====
  {
    id: 's_rank_hunter',
    name: 'S-Rank Hunter',
    description: 'Reach 50 Strength.',
    icon: <BicepsFlexed size={24} className="text-purple-400" />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => state.stats.strength >= 50
  },
  {
    id: 'tycoon',
    name: 'Tycoon',
    description: 'Reach 50 Fortune.',
    icon: <DollarSign size={24} />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => state.stats.fortune >= 50
  },
  {
    id: 'hyper_focus',
    name: 'Hyper Focus',
    description: 'Reach 40 Intelligence and complete 30 mental missions.',
    icon: <Crosshair size={24} />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => state.stats.intelligence >= 40 && state.missions.filter(m => m.targetStat === 'Intelligence' && !!m.lastCompletedAt).length >= 30
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain any streak for 60 days.',
    icon: <Rocket size={24} />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 60)
  },
  {
    id: 'season_vanguard',
    name: 'Season Vanguard',
    description: 'Reached Rank A in the current season.',
    icon: <Medal size={24} />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => !!state.currentSeason && ['A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'season_monarch',
    name: 'Season Monarch',
    description: 'Reached Rank S in the current season.',
    icon: <Crown size={24} className="text-purple-400" />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'S'
  },
  {
    id: 'gym_apostle',
    name: 'Gym Apostle',
    description: 'Complete 100 gym sessions.',
    icon: <Dumbbell size={24} />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.GYM_100_SESSIONS && m.isCompleted)
  },
  {
    id: 'weight_breaker',
    name: 'Weight Breaker',
    description: 'Achieve and maintain target weight for 30 days.',
    icon: <Weight size={24} />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.WEIGHT_GOAL && m.isCompleted)
  },
  {
    id: 'demon_hunter',
    name: 'Demon Hunter',
    description: 'Reach 50 in all combat stats.',
    icon: <Sword size={24} className="text-purple-400" />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => state.stats.strength >= 50 && state.stats.vitality >= 50 && state.stats.agility >= 50
  },
  {
    id: 'orc_conqueror',
    name: 'Orc Conqueror',
    description: 'Defeated the High Orc Warlord.',
    icon: <Skull size={24} className="text-purple-400" />,
    rarity: 'epic',
    textStyle: 'text-purple-400',
    glowStyle: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.ORC_CITADEL && r.victory)
  },

  // ===== LEGENDARY (Gold) - Very tough / combined =====
  {
    id: 'overlord',
    name: 'Overlord',
    description: 'Reach Level 50.',
    icon: <Skull size={24} className="text-yellow-400" />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => state.stats.level >= 50
  },
  {
    id: 'season_legend',
    name: 'Season Legend',
    description: 'End a season at Rank S.',
    icon: <Trophy size={24} />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'S' && !!state.currentSeason.isFinished
  },
  {
    id: 'full_sync',
    name: 'Full Sync',
    description: 'All six stats reach at least 40.',
    icon: <Dna size={24} />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => state.stats.strength >= 40 && state.stats.vitality >= 40 && state.stats.agility >= 40 && state.stats.intelligence >= 40 && state.stats.fortune >= 40 && state.stats.metabolism >= 40
  },
  {
    id: 'perfect_cycle',
    name: 'Perfect Cycle',
    description: 'Maintain healthy sleep and weight trends for 30 days.',
    icon: <RefreshCw size={24} />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => !!state.healthSummary && (state.healthSummary.streak || 0) >= 30
  },
  {
    id: 'shadow_rider',
    name: 'Shadow Rider',
    description: 'Complete the motorcycle license milestone.',
    icon: <Bike size={24} />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.MOTORCYCLE_LICENSE && m.isCompleted)
  },
  {
    id: 'highway_monarch',
    name: 'Highway Monarch',
    description: 'Complete the motorcycle purchase milestone.',
    icon: <Crown size={24} className="text-yellow-400" />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.BUY_MOTORCYCLE && m.isCompleted)
  },
  {
    id: 'iron_will_master',
    name: 'Iron Will Master',
    description: 'Maintain perfect nails for 90 days.',
    icon: <HandMetal size={24} />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.PERFECT_NAILS_90 && m.isCompleted)
  },
  {
    id: 'necromancer',
    name: 'Necromancer',
    description: 'Command 10 shadows.',
    icon: <Ghost size={24} />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => (state.shadows || []).length >= 10
  },
  {
    id: 'shadow_monarch',
    name: 'Shadow Monarch',
    description: 'Command 25 shadows.',
    icon: <Users size={24} />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => (state.shadows || []).length >= 25
  },
  {
    id: 'ant_king_slayer',
    name: 'King Slayer',
    description: 'Defeated the Ant King on Jeju Island.',
    icon: <Bug size={24} className="text-yellow-400" />,
    rarity: 'legendary',
    textStyle: 'text-yellow-400',
    glowStyle: 'drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.JEJU_ISLAND && r.victory)
  },

  // ===== MYTHIC (Red) - Insane achievements =====
  {
    id: 'six_path_ascetic',
    name: 'Six-Path Ascetic',
    description: 'Reach 60 in all physical stats.',
    icon: <Flame size={24} className="text-red-500" />,
    rarity: 'mythic',
    textStyle: 'text-red-500',
    glowStyle: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse',
    condition: (state) => state.stats.strength >= 60 && state.stats.vitality >= 60 && state.stats.agility >= 60 && state.stats.metabolism >= 60
  },
  {
    id: 'mind_king',
    name: 'Mind King',
    description: 'Reach 70 Intelligence.',
    icon: <Eye size={24} />,
    rarity: 'mythic',
    textStyle: 'text-red-500',
    glowStyle: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse',
    condition: (state) => state.stats.intelligence >= 70
  },
  {
    id: 'system_tycoon',
    name: 'System Tycoon',
    description: 'Reach 70 Fortune and complete 3 wealth milestones.',
    icon: <DollarSign size={24} className="text-red-500" />,
    rarity: 'mythic',
    textStyle: 'text-red-500',
    glowStyle: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse',
    condition: (state) => state.stats.fortune >= 70 && (state.milestones || []).filter(m => m.category === 'Wealth' && m.isCompleted).length >= 3
  },
  {
    id: 'season_conqueror',
    name: 'Season Conqueror',
    description: 'Finish 3 seasons with Rank A or higher.',
    icon: <Globe size={24} />,
    rarity: 'mythic',
    textStyle: 'text-red-500',
    glowStyle: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse',
    condition: (state) => (state.seasonHistory || []).filter(s => ['A', 'S'].includes(s.rank)).length >= 3
  },
  {
    id: 'national_level',
    name: 'National Level',
    description: 'Reach Level 90.',
    icon: <User size={24} />,
    rarity: 'mythic',
    textStyle: 'text-red-500',
    glowStyle: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse',
    condition: (state) => state.stats.level >= 90
  },
  {
    id: 'god_slayer',
    name: 'Deicide',
    description: 'Overcame the Architect in the Double Dungeon.',
    icon: <Skull size={24} className="text-red-500" />,
    rarity: 'mythic',
    textStyle: 'text-red-500',
    glowStyle: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.DOUBLE_DUNGEON && r.victory)
  },

  // ===== GODLIKE (Rainbow/Max) - Ultimate achievements =====
  {
    id: 'monarch_of_shadows',
    name: 'Monarch of Shadows',
    description: 'Reach Level 100.',
    icon: <Crown size={24} className="text-purple-500" />,
    rarity: 'godlike',
    textStyle: 'animate-rainbow-text',
    glowStyle: 'drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]',
    condition: (state) => state.stats.level >= 100
  },
  {
    id: 'system_monarch',
    name: 'System Monarch',
    description: 'Reach Level 100 and max at least three stats to 80.',
    icon: <Zap size={24} className="text-yellow-500" />,
    rarity: 'godlike',
    textStyle: 'animate-rainbow-text',
    glowStyle: 'drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]',
    condition: (state) => state.stats.level >= 100 && [state.stats.strength, state.stats.vitality, state.stats.agility, state.stats.intelligence, state.stats.fortune, state.stats.metabolism].filter(v => v >= 80).length >= 3
  },
  {
    id: 'eternal_streak',
    name: 'Eternal Streak',
    description: 'Maintain any streak for 180 days.',
    icon: <Link size={24} className="text-cyan-500" />,
    rarity: 'godlike',
    textStyle: 'animate-rainbow-text',
    glowStyle: 'drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 180)
  }
];

// --- AVATAR FRAMES ---
// RANK ORDER: C (gray) -> B (green) -> A (blue) -> S (purple) -> SS (gold) -> SSS (red/rainbow)

export const BASE_FRAMES: FrameDefinition[] = [
  // ===== C RANK (Gray) - Visible basic frames =====
  {
    id: 'default',
    name: 'Initiate',
    description: 'Standard system frame.',
    rarity: 'C',
    unlockDescription: 'Default',
    borderStyle: 'border-2 border-slate-500',
    glowStyle: 'shadow-[0_0_8px_rgba(100,116,139,0.3)]',
    animation: '',
    condition: () => true
  },
  {
    id: 'goblin_frame',
    name: 'Goblin Trophy',
    description: 'A trophy from the den.',
    rarity: 'C',
    unlockDescription: 'Clear Goblin Den.',
    borderStyle: 'border-2 border-green-700',
    glowStyle: 'shadow-[0_0_10px_rgba(21,128,61,0.4)]',
    animation: '',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.GOBLIN_DEN && r.victory)
  },

  // ===== B RANK (Green) - Colored glow frames =====
  {
    id: 'lightning',
    name: 'Storm',
    description: 'Crackling with energy.',
    rarity: 'B',
    unlockDescription: 'Reach Level 5',
    borderStyle: 'border-2 border-emerald-400',
    glowStyle: 'shadow-[0_0_15px_rgba(52,211,153,0.6),0_0_30px_rgba(16,185,129,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => state.stats.level >= 5
  },
  {
    id: 'insect_carapace',
    name: 'Chitin Plating',
    description: 'Hardened shell from the pit.',
    rarity: 'B',
    unlockDescription: 'Clear Insect Pit.',
    borderStyle: 'border-2 border-amber-600',
    glowStyle: 'shadow-[0_0_15px_rgba(217,119,6,0.6),0_0_30px_rgba(180,83,9,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.INSECT_PIT && r.victory)
  },
  {
    id: 'blue_flame',
    name: 'Blue Flame',
    description: 'A cold, intense flame.',
    rarity: 'B',
    unlockDescription: 'Reach Rank B in Season',
    borderStyle: 'border-2 border-cyan-400',
    glowStyle: 'shadow-[0_0_18px_rgba(34,211,238,0.7),0_0_35px_rgba(6,182,212,0.4)]',
    animation: 'animate-pulse',
    condition: (state) => !!state.currentSeason && ['B', 'A', 'S', 'SS', 'SSS'].includes(state.currentSeason.rank)
  },

  // ===== A RANK (Blue) - Strong animated glow =====
  {
    id: 'arcane',
    name: 'Arcane',
    description: 'Mystic runes orbit the core.',
    rarity: 'A',
    unlockDescription: 'Reach Level 10',
    borderStyle: 'border-[3px] border-blue-400',
    glowStyle: 'shadow-[0_0_20px_rgba(96,165,250,0.8),0_0_40px_rgba(59,130,246,0.4),0_0_60px_rgba(37,99,235,0.2)]',
    animation: 'animate-pulse',
    condition: (state) => state.stats.level >= 10
  },
  {
    id: 'inferno',
    name: 'Inferno',
    description: 'Burning passion.',
    rarity: 'A',
    unlockDescription: 'Reach Level 20',
    borderStyle: 'border-[3px] border-orange-400',
    glowStyle: 'shadow-[0_0_22px_rgba(251,146,60,0.8),0_0_45px_rgba(249,115,22,0.4),0_0_70px_rgba(234,88,12,0.2)]',
    animation: 'animate-pulse',
    condition: (state) => state.stats.level >= 20
  },
  {
    id: 'red_gate_frost',
    name: 'Permafrost',
    description: 'Cold as the grave.',
    rarity: 'A',
    unlockDescription: 'Clear Red Gate.',
    borderStyle: 'border-[3px] border-sky-300',
    glowStyle: 'shadow-[0_0_22px_rgba(125,211,252,0.8),0_0_45px_rgba(56,189,248,0.4),0_0_70px_rgba(14,165,233,0.2)]',
    animation: 'animate-pulse',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.RED_GATE && r.victory)
  },
  {
    id: 'season_crest',
    name: 'Season Crest',
    description: 'Blue neon frame with season emblem.',
    rarity: 'A',
    unlockDescription: 'Reach Rank B in Season',
    borderStyle: 'border-[3px] border-indigo-400',
    glowStyle: 'shadow-[0_0_22px_rgba(129,140,248,0.8),0_0_45px_rgba(99,102,241,0.4),0_0_70px_rgba(79,70,229,0.2)]',
    animation: 'animate-pulse',
    condition: (state) => !!state.currentSeason && ['B', 'A', 'S'].includes(state.currentSeason.rank)
  },

  // ===== S RANK (Purple) - Intense glow with ring effect =====
  {
    id: 'shadow',
    name: 'Monarch',
    description: 'The shadow of the king.',
    rarity: 'S',
    unlockDescription: 'Unlock "S-Rank Hunter" Title',
    borderStyle: 'border-[3px] border-purple-400 ring-2 ring-purple-600/50',
    glowStyle: 'shadow-[0_0_25px_rgba(192,132,252,0.9),0_0_50px_rgba(168,85,247,0.5),0_0_80px_rgba(147,51,234,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => state.stats.unlockedTitleIds.includes(TITLE_IDS.S_RANK_HUNTER)
  },
  {
    id: 'storm_rider',
    name: 'Storm Rider',
    description: 'Cyan lightning frame with electric aura.',
    rarity: 'S',
    unlockDescription: 'Complete motorcycle license milestone',
    borderStyle: 'border-[3px] border-cyan-300 ring-2 ring-cyan-500/50',
    glowStyle: 'shadow-[0_0_25px_rgba(103,232,249,0.9),0_0_50px_rgba(34,211,238,0.5),0_0_80px_rgba(6,182,212,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.MOTORCYCLE_LICENSE && m.isCompleted)
  },
  {
    id: 'inner_flame_frame',
    name: 'Inner Flame',
    description: 'Blue fire aura frame.',
    rarity: 'S',
    unlockDescription: 'Complete 100 gym sessions milestone',
    borderStyle: 'border-[3px] border-orange-300 ring-2 ring-red-500/50',
    glowStyle: 'shadow-[0_0_25px_rgba(253,186,116,0.9),0_0_50px_rgba(251,146,60,0.5),0_0_80px_rgba(239,68,68,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.GYM_100_SESSIONS && m.isCompleted)
  },
  {
    id: 'golden_fortune',
    name: 'Golden Fortune',
    description: 'Green and yellow wealth aura.',
    rarity: 'S',
    unlockDescription: 'Complete wealth-related milestone',
    borderStyle: 'border-[3px] border-yellow-300 ring-2 ring-emerald-500/50',
    glowStyle: 'shadow-[0_0_25px_rgba(253,224,71,0.9),0_0_50px_rgba(250,204,21,0.5),0_0_80px_rgba(52,211,153,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => (state.milestones || []).some(m => m.category === 'Wealth' && m.isCompleted)
  },
  {
    id: 'golden_glory',
    name: 'Golden Glory',
    description: 'Radiant golden aura.',
    rarity: 'S',
    unlockDescription: 'Reach Rank S in Season',
    borderStyle: 'border-[3px] border-yellow-400 ring-2 ring-amber-500/50',
    glowStyle: 'shadow-[0_0_25px_rgba(250,204,21,0.9),0_0_50px_rgba(245,158,11,0.5),0_0_80px_rgba(217,119,6,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => !!state.currentSeason && ['S', 'SS', 'SSS'].includes(state.currentSeason.rank)
  },
  {
    id: 'orc_tusk',
    name: "Warlord's Tusk",
    description: 'Symbol of brute strength.',
    rarity: 'S',
    unlockDescription: 'Clear High Orc Citadel.',
    borderStyle: 'border-[3px] border-red-400 ring-2 ring-red-600/50',
    glowStyle: 'shadow-[0_0_25px_rgba(248,113,113,0.9),0_0_50px_rgba(239,68,68,0.5),0_0_80px_rgba(220,38,38,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.ORC_CITADEL && r.victory)
  },

  // ===== SS RANK (Gold) - Layered glow with multiple rings =====
  {
    id: 'royal',
    name: 'Sovereign',
    description: 'Absolute authority.',
    rarity: 'SS',
    unlockDescription: 'Reach Level 50',
    borderStyle: 'border-[4px] border-yellow-300 ring-4 ring-amber-500/60',
    glowStyle: 'shadow-[0_0_35px_rgba(253,224,71,1),0_0_70px_rgba(250,204,21,0.6),0_0_110px_rgba(245,158,11,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => state.stats.level >= 50
  },
  {
    id: 'monarch_crest',
    name: 'Monarch Crest',
    description: 'Ultimate epic frame for true monarchs.',
    rarity: 'SS',
    unlockDescription: 'Complete 5 epic milestones',
    borderStyle: 'border-[4px] border-amber-300 ring-4 ring-orange-500/60',
    glowStyle: 'shadow-[0_0_35px_rgba(251,191,36,1),0_0_70px_rgba(245,158,11,0.6),0_0_110px_rgba(217,119,6,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => (state.milestones || []).filter(m => m.isCompleted).length >= 5
  },
  {
    id: 'season_monarch',
    name: 'Season Monarch',
    description: 'Legendary aura for the season ruler.',
    rarity: 'SS',
    unlockDescription: 'Reach Rank S in Season',
    borderStyle: 'border-[4px] border-pink-300 ring-4 ring-rose-500/60',
    glowStyle: 'shadow-[0_0_35px_rgba(244,114,182,1),0_0_70px_rgba(236,72,153,0.6),0_0_110px_rgba(219,39,119,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'S'
  },
  {
    id: 'ant_king_crown',
    name: "Ant King's Mandibles",
    description: 'The apex predator.',
    rarity: 'SS',
    unlockDescription: 'Clear Jeju Island.',
    borderStyle: 'border-[4px] border-violet-300 ring-4 ring-purple-500/60',
    glowStyle: 'shadow-[0_0_35px_rgba(196,181,253,1),0_0_70px_rgba(167,139,250,0.6),0_0_110px_rgba(139,92,246,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.JEJU_ISLAND && r.victory)
  },
  {
    id: 'rainbow_monarch',
    name: 'Rainbow Monarch',
    description: 'A prismatic frame reserved for the System Monarch.',
    rarity: 'SS',
    unlockDescription: 'Unlock the "System Monarch" title',
    borderStyle: 'border-[4px] border-white/80 ring-4 ring-pink-400/60',
    glowStyle: 'shadow-[0_0_40px_rgba(255,255,255,0.9),0_0_80px_rgba(244,114,182,0.5)]',
    animation: 'animate-rainbow-border',
    condition: (state) => state.stats.unlockedTitleIds.includes(TITLE_IDS.SYSTEM_MONARCH)
  },
  {
    id: 'eternal_chain',
    name: 'Eternal Chain',
    description: 'Frame forged from an unbroken streak.',
    rarity: 'SS',
    unlockDescription: 'Unlock the "Eternal Streak" title',
    borderStyle: 'border-[4px] border-slate-200 ring-4 ring-blue-400/60',
    glowStyle: 'shadow-[0_0_35px_rgba(226,232,240,1),0_0_70px_rgba(148,163,184,0.6),0_0_110px_rgba(100,116,139,0.3)]',
    animation: 'animate-pulse',
    condition: (state) => state.stats.unlockedTitleIds.includes(TITLE_IDS.ETERNAL_STREAK)
  },

  // ===== SSS RANK (Red/Rainbow) - ULTIMATE frames with max effects =====
  {
    id: 'monarch_aura',
    name: "Monarch's Aura",
    description: 'The overwhelming pressure of a ruler.',
    rarity: 'SSS',
    unlockDescription: 'Reach Rank SSS in Season.',
    borderStyle: 'border-[5px] border-red-400 ring-4 ring-red-600 ring-offset-2 ring-offset-black',
    glowStyle: 'shadow-[0_0_50px_rgba(248,113,113,1),0_0_100px_rgba(239,68,68,0.7),0_0_150px_rgba(220,38,38,0.4),0_0_200px_rgba(185,28,28,0.2)]',
    animation: 'animate-pulse',
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'SSS'
  },
  {
    id: 'god_statue_aura',
    name: "False God's Smile",
    description: 'That terrifying grin...',
    rarity: 'SSS',
    unlockDescription: 'Clear Double Dungeon.',
    borderStyle: 'border-[5px] border-purple-300 ring-4 ring-violet-500 ring-offset-2 ring-offset-black',
    glowStyle: 'shadow-[0_0_60px_rgba(216,180,254,1),0_0_120px_rgba(192,132,252,0.7),0_0_180px_rgba(168,85,247,0.4),0_0_240px_rgba(147,51,234,0.2)]',
    animation: 'animate-rainbow-border',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.DOUBLE_DUNGEON && r.victory)
  }
];

// Rarity order for sorting
const TITLE_RARITY_ORDER: Record<string, number> = {
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, godlike: 6
};

const FRAME_RARITY_ORDER: Record<string, number> = {
  // Standard
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, godlike: 6,
  // Legacy
  C: 0, B: 1, A: 2, S: 3, SS: 4, SSS: 5
};

// Combine and export sorted arrays (PRUNED V2.0)
// We only keep high-quality, manually defined titles and frames.
export const TITLES: TitleDefinition[] = [...BASE_TITLES, ...SHADOW_TITLES].sort((a, b) => {
  return (TITLE_RARITY_ORDER[a.rarity] || 0) - (TITLE_RARITY_ORDER[b.rarity] || 0);
});

export const AVATAR_FRAMES: FrameDefinition[] = [...BASE_FRAMES].sort((a, b) => {
  return (FRAME_RARITY_ORDER[a.rarity] || 0) - (FRAME_RARITY_ORDER[b.rarity] || 0);
});
