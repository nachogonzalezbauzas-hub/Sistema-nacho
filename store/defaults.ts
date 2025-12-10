import { AppState, UserStats, HealthSummary, SeasonDefinition, SeasonProgress } from '@/types';
import { RANK_THRESHOLDS } from '@/utils/rankSystem';
import { LIFE_GOALS } from '@/utils/lifeGoals';

export const INITIAL_STATS: UserStats = {
    level: 1,
    jobClass: 'None',
    xpCurrent: 0,
    xpForNextLevel: 100,
    strength: 10,
    vitality: 10,
    agility: 10,
    intelligence: 10,
    fortune: 10,
    metabolism: 10,
    dailyGains: { strength: 0, vitality: 0, agility: 0, intelligence: 0, fortune: 0, metabolism: 0 },
    pendingDailyGains: { strength: 0, vitality: 0, agility: 0, intelligence: 0, fortune: 0, metabolism: 0 },
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    equippedTitleId: null,
    unlockedTitleIds: [],
    customTitles: [],
    unlockedFrameIds: ['default'],
    customFrames: [],
    selectedFrameId: 'default',
    lastChestClaim: null,
    passivePoints: 0,
    buffs: [],
    passives: {},
    pets: [],
    activePetId: null
};

export const INITIAL_HEALTH_SUMMARY: HealthSummary = {
    lastRecordDate: null,
    lastWeight: null,
    lastSleepHours: null,
    averageWeight7d: null,
    averageSleep7d: null,
    averageScore7d: null,
    weightTrend7d: null,
    sleepTrend7d: null
};

export const DEFAULT_SEASON: SeasonDefinition = {
    id: 'S01',
    name: 'Season 1: Awakening',
    description: 'The beginning of your journey as a Hunter. Rise through the ranks and claim your power.',
    startDate: new Date().toISOString(),
    endDate: '2026-03-03T23:59:59Z',
    theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1e3a8a',
        backgroundImage: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=2070&auto=format&fit=crop'
    },
    xpTargets: RANK_THRESHOLDS,
    rewards: {
        E: {}, // Base rank
        D: { xpBonus: 100, unlockTitleId: 'season_rookie' },
        C: { xpBonus: 250, unlockTitleId: 'season_challenger' },
        B: { xpBonus: 500, unlockTitleId: 'season_raider', unlockFrameId: 'blue_flame' },
        A: { xpBonus: 1000, unlockTitleId: 'season_vanguard' },
        S: { xpBonus: 2500, statBonus: { strength: 5, agility: 5 }, unlockTitleId: 'season_monarch', unlockFrameId: 'golden_glory' },
        SS: { xpBonus: 5000, statBonus: { strength: 10, agility: 10 }, unlockTitleId: 'national_level' },
        SSS: { xpBonus: 10000, statBonus: { strength: 20, agility: 20, vitality: 20 }, unlockTitleId: 'monarch_of_shadows', unlockFrameId: 'monarch_aura' }
    }
};

export const DEFAULT_SEASON_PROGRESS: SeasonProgress = {
    seasonId: 'S01',
    seasonXP: 0,
    rank: 'E',
    claimedRewards: [],
    isFinished: false
};

export const INITIAL_STATE: AppState = {
    stats: INITIAL_STATS,
    missions: [],
    journalEntries: [],
    bodyRecords: [],

    activeBuffs: [],
    lastBuffCleanupAt: null,
    dailyChest: { lastOpenedAt: null },
    passivePoints: 0,
    passiveLevels: {},

    logs: [],

    healthSummary: INITIAL_HEALTH_SUMMARY,
    lastHealthBonusDate: null,
    lastDailyStatUpdate: null,

    dailyActivity: {},
    lastPassiveProgressDate: null,

    justLeveledUp: false,
    justUnlockedTitle: null,

    // U21 Milestones
    milestones: [...LIFE_GOALS],

    // U22 Seasons
    seasons: [DEFAULT_SEASON],
    currentSeason: DEFAULT_SEASON_PROGRESS,

    // U24.1 Settings
    settings: {
        musicEnabled: true,
        sfxEnabled: true,
        theme: 'dark',
        language: 'en',
        performanceMode: false
    },

    // U27 Dungeon Runs
    dungeonRuns: [],
    isDungeonResultVisible: false,
    lastDungeonResult: null,

    // U29 Shadows
    shadows: [],
    equippedShadowId: null,

    // U30 Daily Quests
    dailyQuests: [],
    lastQuestRefresh: null,
    questPoints: 0,
    questShopPurchases: [],
    questStreak: 0,
    questStreak: 0,
    questHistory: [],
    dailyShop: {
        date: null,
        titleIds: [],
        frameIds: []
    },

    // U31 Equipment
    inventory: [],
    shards: 0,

    // U32 Unified Reward System
    rewardQueue: [],

    // U51 Daily Chat
    chatHistory: [],

    // U52 Calendar Events
    userEvents: [],

    // U52 Zone System
    zone: {
        currentZone: 1,
        maxUnlockedFloor: 150,
        zoneGuardiansDefeated: [],
        unlockedRarities: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
        pendingZoneBoss: null
    }
};

