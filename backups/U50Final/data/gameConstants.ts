// Centralized constants for game IDs to avoid magic strings

export const DUNGEON_IDS = {
    GOBLIN_DEN: 'dungeon_goblin_den',
    INSECT_PIT: 'dungeon_insect_pit',
    RED_GATE: 'dungeon_red_gate',
    ORC_CITADEL: 'dungeon_orc_citadel',
    JEJU_ISLAND: 'dungeon_jeju_island',
    DOUBLE_DUNGEON: 'dungeon_double_dungeon',
} as const;

export const MILESTONE_IDS = {
    MOTORCYCLE_LICENSE: 'motorcycle_license',
    BUY_MOTORCYCLE: 'buy_motorcycle',
    GYM_100_SESSIONS: 'gym_100_sessions',
    WEIGHT_GOAL: 'weight_goal',
    PERFECT_NAILS_90: 'perfect_nails_90',
} as const;

export const TITLE_IDS = {
    S_RANK_HUNTER: 's_rank_hunter',
    SYSTEM_MONARCH: 'system_monarch',
    ETERNAL_STREAK: 'eternal_streak',
} as const;

export const STATS = {
    STRENGTH: 'Strength',
    AGILITY: 'Agility',
    INTELLIGENCE: 'Intelligence',
    VITALITY: 'Vitality',
    FORTUNE: 'Fortune',
    METABOLISM: 'Metabolism',
} as const;
