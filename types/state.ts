import { UserStats, BodyRecord, LogEntry, HealthSummary, DailyActivityScore, Settings } from './user';
import { Mission, JournalEntry, Milestone, SeasonDefinition, SeasonProgress, DungeonRunResult, DailyQuest, RewardItem, CalendarDayData, UserEvent } from './features';
import { ActiveBuff, PassiveId } from './buffs';
import { Title, Shadow, Equipment } from './items';

export interface AppState {
    stats: UserStats;
    missions: Mission[];
    journalEntries: JournalEntry[];
    bodyRecords: BodyRecord[];

    // U14 New State
    activeBuffs: ActiveBuff[];
    lastBuffCleanupAt: string | null;
    dailyChest: { lastOpenedAt: string | null };
    passivePoints: number;
    passiveLevels: Record<PassiveId, number>;

    // U16 Logs
    logs: LogEntry[];

    // U16 Health Intelligence
    healthSummary: HealthSummary;
    lastHealthBonusDate: string | null;

    // U17 Daily Progression
    lastDailyStatUpdate: string | null;

    // U17.1 Progression
    dailyActivity: Record<string, DailyActivityScore>;
    lastPassiveProgressDate: string | null;

    // Transient UI State
    justLeveledUp: boolean;
    justUnlockedTitle: Title | null;

    // U18 Calendar System
    calendar?: {
        events: Record<string, CalendarDayData>;
    };
    userEvents: UserEvent[];

    // U21 Milestones
    milestones: Milestone[];

    // U22 Seasons
    seasons: SeasonDefinition[];
    currentSeason?: SeasonProgress;
    seasonHistory?: SeasonProgress[];

    // U24.1 Settings
    settings: Settings;

    // U27 Dungeon Runs
    dungeonRuns: DungeonRunResult[];

    // U29 Shadows
    shadows: Shadow[];
    equippedShadowId: string | null;

    // U30 Daily Quests
    dailyQuests: DailyQuest[];
    lastQuestRefresh: string | null;
    questPoints: number;
    questShopPurchases: string[]; // IDs of purchased items
    questStreak: number;
    questHistory: {
        date: string;
        questsCompleted: number;
    }[];

    // U33 Daily Shop Rotation
    dailyShop: {
        date: string | null;
        titleIds: string[];
        frameIds: string[];
    };

    // U31 Equipment
    inventory: Equipment[];
    shards: number; // Currency for upgrades

    // U32 Unified Reward System
    rewardQueue: RewardItem[];

    // Global UI State (U34)
    isDungeonResultVisible?: boolean;
    lastDungeonResult?: DungeonRunResult | null;

    // U51 Daily Chat
    chatHistory: import('./chat').ChatMessage[];

    // U52 Era System
    zone: import('./core').ZoneState;

    // U54 Onboarding
    onboardingCompleted?: boolean;
    userObjectives?: {
        mainGoal: string;
        focusStat: string;
        calibratedAt: string;
    };
}

