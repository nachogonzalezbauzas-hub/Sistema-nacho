import { StatType, RankTier, ItemRarity } from './core';
import { UserStats, BodyRecord, LogEntry } from './user';
import { TitleId, AvatarFrameId, Equipment } from './items';
import { PassiveId, BuffId } from './buffs';

// --- MISSIONS ---
export type MissionFrequency = "always" | "daily" | "weekly";

export interface Mission {
    id: string;
    title: string;
    detail: string;
    targetStat: StatType;
    xpReward: number;
    isDaily: boolean;
    lastCompletedAt: string | null;
    frequency?: MissionFrequency;
    daysOfWeek?: number[];
    streak?: number;
}

export interface MissionTemplate {
    id: string;
    title: string;
    detail: string;
    targetStat: StatType;
    xpReward: number;
    isDaily: boolean;
    frequency?: MissionFrequency;
    daysOfWeek?: number[];
}


// Checking user.ts content... I put JournalEntry in user.ts?
// Let's check step 64.
// Yes, I put JournalEntry in user.ts? No, wait.
// In step 64 code content:
// export interface JournalEntry { ... } was NOT in user.ts?
// Let's check step 64 again.
// I see BodyRecord, HealthSummary, LogEntry, UserStats.
// I DO NOT see JournalEntry in step 64.
// So I need to define it here or in user.ts.
// It feels like user data. Let's define it here for now or add to user.ts later.
// Actually, let's define it here to be safe.

export interface JournalEntry {
    id: string;
    date: string;
    text: string;
}

// --- U21 MILESTONES (EPIC MISSIONS) ---
export type MilestoneCategory = "Health" | "Wealth" | "Skill" | "Lifestyle" | "Other";

export interface MilestonePhase {
    id: string;
    title: string;
    description: string;
    requiredActions: number;
    completedActions: number;
    isCompleted: boolean;
}

export interface MilestoneReward {
    xpBonus?: number;
    statBonus?: Partial<UserStats>;
    unlockTitleId?: TitleId;
    unlockFrameId?: AvatarFrameId;
    unlockPassiveId?: PassiveId;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    category: MilestoneCategory;
    createdAt: string;
    targetDate?: string;
    phases: MilestonePhase[];
    currentPhaseIndex: number;
    isCompleted: boolean;
    progressPercent: number;
    reward: MilestoneReward;
}

export interface CalendarEvent {
    date: Date;
    hasMission: boolean;
    hasHealth: boolean;
    isToday: boolean;
}

// --- U22 SEASONS & RANK LADDER ---
export interface SeasonTheme {
    primaryColor: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundImage?: string;
}

export interface SeasonReward {
    xpBonus?: number;
    statBonus?: Partial<UserStats>;
    unlockTitleId?: TitleId;
    unlockFrameId?: AvatarFrameId;
    unlockPassiveId?: PassiveId;
}

export interface SeasonDefinition {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    xpTargets: {
        E: number;
        D: number;
        C: number;
        B: number;
        A: number;
        S: number;
        SS?: number;
        SSS?: number;
    };
    rewards: {
        E?: SeasonReward;
        D?: SeasonReward;
        C?: SeasonReward;
        B?: SeasonReward;
        A?: SeasonReward;
        S?: SeasonReward;
        SS?: SeasonReward;
        SSS?: SeasonReward;
    };
    theme: SeasonTheme;
}

export interface SeasonProgress {
    seasonId: string;
    seasonXP: number;
    rank: RankTier;
    claimedRewards: RankTier[];
    isFinished?: boolean;
}

// U27: Dungeons System
export type DungeonType = 'Daily' | 'Weekly' | 'Challenge';
export type BossType = 'Shadow Beast' | 'Corrupted Titan' | 'Mind Specter' | 'Fortune Golem' | 'Metabolic Hydra';

export interface DungeonDefinition {
    id: string;
    name: string;
    description: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    recommendedStats: StatType[];
    minLevel: number;
    recommendedPower: number;
    dungeonType: DungeonType;
    baseRewards: {
        xp: number;
        buffId?: string;
        frameId?: string;
        titleId?: string;
        shadowId?: string;
        items?: string[];
    };
}

export interface BossDefinition {
    id: string;
    name: string;
    element?: 'dark' | 'lightning' | 'fire' | 'arcane' | 'fortune' | 'metabolism';
    stats?: UserStats;
    level?: number;
    health?: number;
    abilities?: string[];
    powerLevel: number;
    specialMoves?: string[];
    canExtract?: boolean;
    shadowData?: {
        name: string;
        rank: RankTier;
        image: string;
        bonus: {
            stat: StatType;
            value: number;
        };
    };
}

export interface Dungeon {
    id: string;
    name: string;
    description: string;
    difficulty: RankTier;
    recommendedLevel: number;
    recommendedPower: number;
    timeLimit: number;
    minLevel: number;
    rewards: {
        xp: number;
        items: string[];
        dropRates: Record<ItemRarity, number>;
    };
    boss?: BossDefinition;
}

export interface DungeonRunResult {
    id: string;
    dungeonId: string;
    bossId?: string;
    victory: boolean;
    timestamp: string;
    xpEarned: number;
    rewards: string[];
    equipment?: Equipment[];
    unlockedTitleId?: string;
    unlockedFrameId?: string;
    shardsEarned?: number;
}

// --- U30 DAILY QUESTS ---
export type QuestType = 'mission_completion' | 'stat_threshold' | 'dungeon_clear' | 'shadow_extract' | 'health_score' | 'streak_maintain';

export interface QuestCondition {
    type: QuestType;
    target: number;
    current: number;
    metadata?: {
        missionType?: string;
        dungeonId?: string;
        shadowRank?: string;
        statType?: string;
    };
}

export interface QuestReward {
    questPoints: number;
    xp?: number;
    shards?: number;
    buffId?: BuffId;
}

export interface DailyQuest {
    id: string;
    title: string;
    description: string;
    condition: QuestCondition;
    reward: QuestReward;
    completed: boolean;
    claimedAt?: string;
}

export interface QuestShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: 'buff' | 'xp' | 'cosmetic' | 'material';
    reward: {
        buffId?: BuffId;
        xp?: number;
        titleId?: TitleId;
        frameId?: AvatarFrameId;
    };
    stock?: number;
}

// --- EQUIPMENT SETS ---
export interface EquipmentSet {
    id: string;
    name: string;
    pieces: string[];
    bonuses: {
        requiredCount: number;
        stats?: Partial<UserStats>;
        effect?: string;
    }[];
}

// --- REWARDS ---
export type RewardType = 'levelup' | 'item' | 'title' | 'currency' | 'season_rank' | 'milestone' | 'quest';

export interface RewardItem {
    id: string;
    type: RewardType;
    name: string;
    description?: string;
    icon?: string;
    rarity?: ItemRarity;
    value?: number;
    powerGain?: number;
}

// --- CALENDAR DATA ---
export interface CalendarDayData {
    date: string; // ISO Date String (YYYY-MM-DD)
    missions: Mission[];
    health?: BodyRecord;
    journal?: JournalEntry[];
    xpGained: number;
    streak: number;
    efficiency: number; // 0-100
    logs?: LogEntry[];
}
