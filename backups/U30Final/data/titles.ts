import { AppState, AvatarFrame, Title, TitleId, AvatarFrameId } from '../types';
import { DUNGEON_IDS, MILESTONE_IDS, TITLE_IDS } from './gameConstants';

// --- DEFINITIONS WITH LOGIC ---

export interface TitleDefinition extends Title {
  condition: (state: AppState) => boolean;
}

export interface FrameDefinition extends AvatarFrame {
  condition: (state: AppState) => boolean;
}

// --- TITLES ---

export const TITLES: TitleDefinition[] = [
  // COMMON (blanco) – primeros logros básicos
  {
    id: 'disciplined',
    name: 'The Disciplined',
    description: 'Reach a 7-day streak on any mission.',
    icon: '🧘',
    rarity: 'common',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 7)
  },
  {
    id: 'daily_stepper',
    name: 'Daily Stepper',
    description: 'Complete any daily mission 10 times in total.',
    icon: '👣',
    rarity: 'common',
    condition: (state) =>
      state.missions.some(m => (m.streak || 0) >= 3) // requisito suave para un título básico
  },
  {
    id: 'first_blood',
    name: 'First Mission',
    description: 'Complete your first mission.',
    icon: '🩸',
    rarity: 'common',
    condition: (state) =>
      state.missions.some(m => !!m.lastCompletedAt)
  },
  {
    id: 'body_tracker',
    name: 'Status Initiate',
    description: 'Register a body record for the first time.',
    icon: '📊',
    rarity: 'common',
    condition: (state) => state.bodyRecords.length >= 1
  },
  {
    id: 'pen_on_paper',
    name: 'Journal Initiate',
    description: 'Create your first journal entry.',
    icon: '🖊️',
    rarity: 'common',
    condition: (state) => state.journalEntries.length >= 1
  },

  // UNCOMMON (verde) – hábitos algo más consolidados
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Reach a 30-day streak on any mission.',
    icon: '⛓️',
    rarity: 'uncommon',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 30)
  },
  {
    id: 'routine_keeper',
    name: 'Routine Keeper',
    description: 'Maintain at least one active streak for 14 days.',
    icon: '📆',
    rarity: 'uncommon',
    condition: (state) =>
      state.missions.some(m => (m.streak || 0) >= 14)
  },
  {
    id: 'shadow_breaker',
    name: 'Shadow Breaker',
    description: 'Reach 20 Strength.',
    icon: '💪',
    rarity: 'uncommon',
    condition: (state) => state.stats.strength >= 20
  },
  {
    id: 'speed_walker',
    name: 'Speed Walker',
    description: 'Reach 20 Agility.',
    icon: '⚡',
    rarity: 'uncommon',
    condition: (state) => state.stats.agility >= 20
  },
  {
    id: 'arcane_mind',
    name: 'Arcane Mind',
    description: 'Reach 20 Intelligence.',
    icon: '🧠',
    rarity: 'uncommon',
    condition: (state) => state.stats.intelligence >= 20
  },
  {
    id: 'fortune_seeker',
    name: 'Fortune Seeker',
    description: 'Reach 20 Fortune.',
    icon: '💎',
    rarity: 'uncommon',
    condition: (state) => state.stats.fortune >= 20
  },
  {
    id: 'inner_flame',
    name: 'Inner Flame',
    description: 'Reach 20 Metabolism.',
    icon: '🔥',
    rarity: 'uncommon',
    condition: (state) => state.stats.metabolism >= 20
  },
  {
    id: 'season_rookie',
    name: 'Season Rookie',
    description: 'Reached Rank D in the current season.',
    icon: '🌱',
    rarity: 'uncommon',
    condition: (state) => !!state.currentSeason && ['D', 'C', 'B', 'A', 'S'].includes(state.currentSeason.rank)
  },

  // RARE (azul) – stats y progreso ya serios
  {
    id: 'monarch_candidate',
    name: 'Monarch Candidate',
    description: 'Reach Level 10.',
    icon: '👑',
    rarity: 'rare',
    condition: (state) => state.stats.level >= 10
  },
  {
    id: 'balanced_soul',
    name: 'Balanced Soul',
    description: 'Reach Strength, Vitality and Agility all at 20 or more.',
    icon: '⚖️',
    rarity: 'rare',
    condition: (state) =>
      state.stats.strength >= 20 &&
      state.stats.vitality >= 20 &&
      state.stats.agility >= 20
  },
  {
    id: 'mind_over_matter',
    name: 'Mind Over Matter',
    description: 'Reach Intelligence 25 and keep a 7-day streak on any mental mission.',
    icon: '🧠✨',
    rarity: 'rare',
    condition: (state) =>
      state.stats.intelligence >= 25 &&
      state.missions.some(m => m.targetStat === 'Intelligence' && (m.streak || 0) >= 7)
  },
  {
    id: 'early_grinder',
    name: 'Early Grinder',
    description: 'Complete any mission before 8:00 AM for 5 different days.',
    icon: '🌅',
    rarity: 'rare',
    condition: (state) =>
      state.logs.some(l => l.category === 'Mission' && l.tags?.includes('early_5_days')) // tag que puedes setear en el log system
  },
  {
    id: 'season_challenger',
    name: 'Season Challenger',
    description: 'Reached Rank C in the current season.',
    icon: '⚔️',
    rarity: 'rare',
    condition: (state) => !!state.currentSeason && ['C', 'B', 'A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'season_raider',
    name: 'Season Raider',
    description: 'Reached Rank B in the current season.',
    icon: '🛡️',
    rarity: 'rare',
    condition: (state) => !!state.currentSeason && ['B', 'A', 'S'].includes(state.currentSeason.rank)
  },

  // EPIC (morado) – cosas ya bastante tochas
  {
    id: 's_rank_hunter',
    name: 'S-Rank Hunter',
    description: 'Reach 50 Strength.',
    icon: '🦾',
    rarity: 'epic',
    condition: (state) => state.stats.strength >= 50
  },
  {
    id: 'tycoon',
    name: 'Tycoon',
    description: 'Reach 50 Fortune.',
    icon: '💵',
    rarity: 'epic',
    condition: (state) => state.stats.fortune >= 50
  },
  // Dungeon Titles
  {
    id: 'goblin_slayer',
    name: 'Goblin Slayer',
    description: 'Cleared the Goblin Den.',
    icon: '👺',
    rarity: 'common',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.GOBLIN_DEN && r.victory)
  },
  {
    id: 'bug_squasher',
    name: 'Bug Squasher',
    description: 'Exterminated the Insect Pit.',
    icon: '🪲',
    rarity: 'uncommon',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.INSECT_PIT && r.victory)
  },
  {
    id: 'survivor',
    name: 'Red Gate Survivor',
    description: 'Survived the frozen wasteland.',
    icon: '❄️',
    rarity: 'rare',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.RED_GATE && r.victory)
  },
  {
    id: 'orc_conqueror',
    name: 'Orc Conqueror',
    description: 'Defeated the High Orc Warlord.',
    icon: '👹',
    rarity: 'epic',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.ORC_CITADEL && r.victory)
  },
  {
    id: 'ant_king_slayer',
    name: 'King Slayer',
    description: 'Defeated the Ant King on Jeju Island.',
    icon: '🐜',
    rarity: 'legendary',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.JEJU_ISLAND && r.victory)
  },
  {
    id: 'god_slayer',
    name: 'Deicide',
    description: 'Overcame the Architect in the Double Dungeon.',
    icon: '🗿',
    rarity: 'mythic',
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.DOUBLE_DUNGEON && r.victory)
  },
  {
    id: 'hyper_focus',
    name: 'Hyper Focus',
    description: 'Reach 40 Intelligence and complete 30 mental missions.',
    icon: '🎯',
    rarity: 'epic',
    condition: (state) =>
      state.stats.intelligence >= 40 &&
      state.missions.filter(m => m.targetStat === 'Intelligence' && !!m.lastCompletedAt).length >= 30
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain any streak for 60 days.',
    icon: '🚀',
    rarity: 'epic',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 60)
  },
  {
    id: 'season_vanguard',
    name: 'Season Vanguard',
    description: 'Reached Rank A in the current season.',
    icon: '⚜️',
    rarity: 'epic',
    condition: (state) => !!state.currentSeason && ['A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'season_monarch',
    name: 'Season Monarch',
    description: 'Reached Rank S in the current season.',
    icon: '👑✨',
    rarity: 'epic',
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'S'
  },
  {
    id: 'gym_apostle',
    name: 'Gym Apostle',
    description: 'Complete 100 gym sessions.',
    icon: '🏋️‍♂️',
    rarity: 'epic',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.GYM_100_SESSIONS && m.isCompleted)
  },
  {
    id: 'weight_breaker',
    name: 'Weight Breaker',
    description: 'Achieve and maintain target weight for 30 days.',
    icon: '⚖️💪',
    rarity: 'epic',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.WEIGHT_GOAL && m.isCompleted)
  },

  // LEGENDARY (amarillo) – logros muy tochos / combinados
  {
    id: 'overlord',
    name: 'Overlord',
    description: 'Reach Level 50.',
    icon: '☠️',
    rarity: 'legendary',
    condition: (state) => state.stats.level >= 50
  },
  {
    id: 'season_legend',
    name: 'Season Legend',
    description: 'End a season at Rank S.',
    icon: '🏆',
    rarity: 'legendary',
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'S' && !!state.currentSeason.isFinished
  },
  {
    id: 'full_sync',
    name: 'Full Sync',
    description: 'All six stats reach at least 40.',
    icon: '🧬',
    rarity: 'legendary',
    condition: (state) =>
      state.stats.strength >= 40 &&
      state.stats.vitality >= 40 &&
      state.stats.agility >= 40 &&
      state.stats.intelligence >= 40 &&
      state.stats.fortune >= 40 &&
      state.stats.metabolism >= 40
  },
  {
    id: 'perfect_cycle',
    name: 'Perfect Cycle',
    description: 'Maintain healthy sleep and weight trends for 30 days.',
    icon: '♻️',
    rarity: 'legendary',
    condition: (state) =>
      !!state.healthSummary &&
      (state.healthSummary.streak || 0) >= 30
  },
  {
    id: 'shadow_rider',
    name: 'Shadow Rider',
    description: 'Complete the motorcycle license milestone.',
    icon: '🏍️',
    rarity: 'legendary',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.MOTORCYCLE_LICENSE && m.isCompleted)
  },
  {
    id: 'highway_monarch',
    name: 'Highway Monarch',
    description: 'Complete the motorcycle purchase milestone.',
    icon: '👑🏍️',
    rarity: 'legendary',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.BUY_MOTORCYCLE && m.isCompleted)
  },
  {
    id: 'iron_will_master',
    name: 'Iron Will Master',
    description: 'Maintain perfect nails for 90 days.',
    icon: '💅✨',
    rarity: 'legendary',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.PERFECT_NAILS_90 && m.isCompleted)
  },

  // MYTHIC (rojo) – cosas muy locas
  {
    id: 'six_path_ascetic',
    name: 'Six-Path Ascetic',
    description: 'Reach 60 in all physical stats (Strength, Vitality, Agility, Metabolism).',
    icon: '🔥🧘',
    rarity: 'mythic',
    condition: (state) =>
      state.stats.strength >= 60 &&
      state.stats.vitality >= 60 &&
      state.stats.agility >= 60 &&
      state.stats.metabolism >= 60
  },
  {
    id: 'mind_king',
    name: 'Mind King',
    description: 'Reach 70 Intelligence.',
    icon: '👁️‍🗨️',
    rarity: 'mythic',
    condition: (state) => state.stats.intelligence >= 70
  },
  {
    id: 'system_tycoon',
    name: 'System Tycoon',
    description: 'Reach 70 Fortune and complete 3 wealth milestones.',
    icon: '💰👑',
    rarity: 'mythic',
    condition: (state) =>
      state.stats.fortune >= 70 &&
      (state.milestones || []).filter(m => m.category === 'Wealth' && m.isCompleted).length >= 3
  },
  {
    id: 'season_conqueror',
    name: 'Season Conqueror',
    description: 'Finish 3 seasons with Rank A or higher.',
    icon: '🏹',
    rarity: 'mythic',
    condition: (state) =>
      (state.seasonHistory || []).filter(s => ['A', 'S'].includes(s.rank)).length >= 3
  },

  // GODLIKE (arcoiris) – únicos y bestias
  {
    id: 'national_level',
    name: 'National Level',
    description: 'Reach Level 90.',
    icon: '🇺🇳',
    rarity: 'mythic',
    condition: (state) => state.stats.level >= 90
  },
  {
    id: 'monarch_of_shadows',
    name: 'Monarch of Shadows',
    description: 'Reach Level 100.',
    icon: '👑🌑',
    rarity: 'godlike',
    condition: (state) => state.stats.level >= 100
  },
  {
    id: 'system_monarch',
    name: 'System Monarch',
    description: 'Reach Level 100 and max at least three stats to 80.',
    icon: '🌈👑',
    rarity: 'godlike',
    condition: (state) =>
      state.stats.level >= 100 &&
      [
        state.stats.strength,
        state.stats.vitality,
        state.stats.agility,
        state.stats.intelligence,
        state.stats.fortune,
        state.stats.metabolism
      ].filter(v => v >= 80).length >= 3
  },
  {
    id: 'eternal_streak',
    name: 'Eternal Streak',
    description: 'Maintain any streak for 180 days.',
    icon: '∞',
    rarity: 'godlike',
    condition: (state) => state.missions.some(m => (m.streak || 0) >= 180)
  }
];

// --- AVATAR FRAMES ---

export const AVATAR_FRAMES: FrameDefinition[] = [
  {
    id: 'default',
    name: 'Initiate',
    description: 'Standard system frame.',
    rarity: 'C',
    unlockDescription: 'Default',
    condition: () => true
  },
  {
    id: 'lightning',
    name: 'Storm',
    description: 'Crackling with energy.',
    rarity: 'B',
    unlockDescription: 'Reach Level 5',
    condition: (state) => state.stats.level >= 5
  },
  {
    id: 'arcane',
    name: 'Arcane',
    description: 'Mystic runes orbit the core.',
    rarity: 'A',
    unlockDescription: 'Reach Level 10',
    condition: (state) => state.stats.level >= 10
  },
  {
    id: 'inferno',
    name: 'Inferno',
    description: 'Burning passion.',
    rarity: 'A',
    unlockDescription: 'Reach Level 20',
    condition: (state) => state.stats.level >= 20
  },
  {
    id: 'shadow',
    name: 'Monarch',
    description: 'The shadow of the king.',
    rarity: 'S',
    unlockDescription: 'Unlock "S-Rank Hunter" Title',
    condition: (state) => state.stats.unlockedTitleIds.includes(TITLE_IDS.S_RANK_HUNTER)
  },
  {
    id: 'royal',
    name: 'Sovereign',
    description: 'Absolute authority.',
    rarity: 'SS',
    unlockDescription: 'Reach Level 50',
    condition: (state) => state.stats.level >= 50
  },
  // U21 Milestone-Exclusive Frames
  {
    id: 'storm_rider',
    name: 'Storm Rider',
    description: 'Cyan lightning frame with electric aura.',
    rarity: 'S',
    unlockDescription: 'Complete motorcycle license milestone',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.MOTORCYCLE_LICENSE && m.isCompleted)
  },
  {
    id: 'inner_flame_frame',
    name: 'Inner Flame',
    description: 'Blue fire aura frame.',
    rarity: 'S',
    unlockDescription: 'Complete 100 gym sessions milestone',
    condition: (state) => (state.milestones || []).some(m => m.id === MILESTONE_IDS.GYM_100_SESSIONS && m.isCompleted)
  },
  {
    id: 'golden_fortune',
    name: 'Golden Fortune',
    description: 'Green and yellow wealth aura.',
    rarity: 'S',
    unlockDescription: 'Complete wealth-related milestone',
    condition: (state) => (state.milestones || []).some(m => m.category === 'Wealth' && m.isCompleted)
  },
  {
    id: 'monarch_crest',
    name: 'Monarch Crest',
    description: 'Ultimate epic frame for true monarchs.',
    rarity: 'SS',
    unlockDescription: 'Complete 5 epic milestones',
    condition: (state) => (state.milestones || []).filter(m => m.isCompleted).length >= 5
  },
  // U22 Season Frames
  {
    id: 'season_crest',
    name: 'Season Crest',
    description: 'Blue neon frame with season emblem.',
    rarity: 'A',
    unlockDescription: 'Reach Rank B in Season',
    condition: (state) => !!state.currentSeason && ['B', 'A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'season_monarch',
    name: 'Season Monarch',
    description: 'Legendary aura for the season ruler.',
    rarity: 'SS',
    unlockDescription: 'Reach Rank S in Season',
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'S'
  },
  {
    id: 'blue_flame',
    name: 'Blue Flame',
    description: 'A cold, intense flame.',
    rarity: 'B',
    unlockDescription: 'Reach Rank B in Season',
    condition: (state) => !!state.currentSeason && ['B', 'A', 'S', 'SS', 'SSS'].includes(state.currentSeason.rank)
  },
  {
    id: 'golden_glory',
    name: 'Golden Glory',
    description: 'Radiant golden aura.',
    rarity: 'S',
    unlockDescription: 'Reach Rank S in Season',
    condition: (state) => !!state.currentSeason && ['S', 'SS', 'SSS'].includes(state.currentSeason.rank)
  },
  {
    id: "monarch_aura",
    name: "Monarch's Aura",
    description: "The overwhelming pressure of a ruler.",
    rarity: "SSS",
    unlockDescription: "Reach Rank SSS in Season 1.",
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'SSS'
  },
  // Dungeon Frames
  {
    id: "goblin_frame",
    name: "Goblin Ear",
    description: "A trophy from the den.",
    rarity: "C",
    unlockDescription: "Clear Goblin Den.",
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.GOBLIN_DEN && r.victory)
  },
  {
    id: "insect_carapace",
    name: "Chitin Plating",
    description: "Hardened shell from the pit.",
    rarity: "B",
    unlockDescription: "Clear Insect Pit.",
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.INSECT_PIT && r.victory)
  },
  {
    id: "red_gate_frost",
    name: "Permafrost",
    description: "Cold as the grave.",
    rarity: "A",
    unlockDescription: "Clear Red Gate.",
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.RED_GATE && r.victory)
  },
  {
    id: "orc_tusk",
    name: "Warlord's Tusk",
    description: "Symbol of brute strength.",
    rarity: "S",
    unlockDescription: "Clear High Orc Citadel.",
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.ORC_CITADEL && r.victory)
  },
  {
    id: "ant_king_crown",
    name: "Ant King's Mandibles",
    description: "The apex predator.",
    rarity: "SS",
    unlockDescription: "Clear Jeju Island.",
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.JEJU_ISLAND && r.victory)
  },
  {
    id: "god_statue_aura",
    name: "False God's Smile",
    description: "That terrifying grin...",
    rarity: "SSS",
    unlockDescription: "Clear Double Dungeon.",
    condition: (state) => (state.dungeonRuns || []).some(r => r.dungeonId === DUNGEON_IDS.DOUBLE_DUNGEON && r.victory)
  },
  // U23 Godlike Frames opcionales
  {
    id: 'rainbow_monarch',
    name: 'Rainbow Monarch',
    description: 'A prismatic frame reserved for the System Monarch.',
    rarity: 'SS',
    unlockDescription: 'Unlock the "System Monarch" title',
    condition: (state) => state.stats.unlockedTitleIds.includes(TITLE_IDS.SYSTEM_MONARCH)
  },
  {
    id: 'eternal_chain',
    name: 'Eternal Chain',
    description: 'Frame forged from an unbroken streak.',
    rarity: 'SS',
    unlockDescription: 'Unlock the "Eternal Streak" title',
    condition: (state) => state.stats.unlockedTitleIds.includes(TITLE_IDS.ETERNAL_STREAK)
  }
];
