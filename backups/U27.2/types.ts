// --- STATS & RPG CORE ---
export type StatType = 'Strength' | 'Vitality' | 'Agility' | 'Intelligence' | 'Fortune' | 'Metabolism';

export type BuffId = string;
export type PassiveId = string;

export interface BuffDefinition {
  id: BuffId;
  name: string;
  description: string;
  icon: string;
  durationMinutes: number;
  statModifiers?: Partial<Record<StatType, number>>;
  xpMultiplier?: number;
}

export interface ActiveBuff {
  id: BuffId;
  startedAt: string;
  expiresAt: string;
}

export interface PassiveDefinition {
  id: PassiveId;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  costPerLevel: number;
  statBonusesPerLevel: Partial<Record<StatType, number>>;
}

export interface Buff {
  id: string;
  stat: StatType;
  amount: number;
  durationMinutes: number;
  expiresAt: string; // ISO Date
}

export interface Passive {
  id: string;
  name: string;
  description: string;
  stat: StatType;
  level: number;
  bonusPerLevel: number;
  maxLevel: number;
}

export interface EffectiveStats {
  strength: number;
  vitality: number;
  agility: number;
  intelligence: number;
  fortune: number;
  metabolism: number;
  dailyGains?: {
    strength: number;
    vitality: number;
    agility: number;
    intelligence: number;
    fortune: number;
    metabolism: number;
  };
}

// --- U16 LOGS ---
export type LogCategory =
  | "Mission"
  | "LevelUp"
  | "Health"
  | "Streak"
  | "Achievement"
  | "Milestone"
  | "System";

export interface LogEntry {
  id: string;
  timestamp: string;
  category: LogCategory;
  message: string;
  details?: string;
  xpChange?: number;
  levelChange?: {
    from: number;
    to: number;
  };
  statChange?: {
    stat: StatType;
    amount: number;
  };
  tags?: string[];
}

// --- TITLES (U13.3) ---
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
  | 'eternal_streak';

export type TitleRarity =
  | 'common'      // blanco
  | 'uncommon'   // verde
  | 'rare'       // azul
  | 'epic'       // morado
  | 'legendary'  // amarillo
  | 'mythic'     // rojo
  | 'godlike';   // arcoiris

export interface Title {
  id: TitleId;
  name: string;
  description: string;
  icon: string;
  rarity: TitleRarity;
}

// --- AVATAR FRAMES (U13.3) ---
// --- AVATAR FRAMES (U13.3) ---
export type AvatarFrameId = "default" | "lightning" | "arcane" | "inferno" | "shadow" | "royal" | "storm_rider" | "inner_flame_frame" | "golden_fortune" | "monarch_crest" | "season_crest" | "season_monarch" | "rainbow_monarch" | "eternal_chain";

export interface AvatarFrame {
  id: AvatarFrameId;
  name: string;
  description: string;
  rarity: "C" | "B" | "A" | "S" | "SS";
  unlockDescription: string;
}

// --- USER STATE ---
export interface UserStats {
  level: number;
  xpCurrent: number;
  xpForNextLevel: number;

  // Base Stats
  strength: number;
  vitality: number;
  agility: number;
  intelligence: number;
  fortune: number;
  metabolism: number;

  // U17 Daily Gains
  dailyGains?: {
    strength: number;
    vitality: number;
    agility: number;
    intelligence: number;
    fortune: number;
    metabolism: number;
  };

  // U17.1 Pending Daily Gains
  pendingDailyGains?: {
    strength: number;
    vitality: number;
    agility: number;
    intelligence: number;
    fortune: number;
    metabolism: number;
  };

  // Tracking
  streak: number;
  lastActiveDate: string | null;

  // Legacy
  lastChestClaim: string | null;
  passivePoints?: number;
  buffs?: Buff[];
  passives?: Record<string, number>;

  // U13.3 - Title & Frame State
  equippedTitleId: TitleId | null;
  unlockedTitleIds: TitleId[];

  selectedFrameId: AvatarFrameId;
  unlockedFrameIds: AvatarFrameId[];
}

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

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

// --- U16 HEALTH INTELLIGENCE ---
export interface BodyRecord {
  id: string;
  date: string;
  weight: number;
  sleepHours: number;
  notes: string;
  healthScore?: number; // 0-100
  weightDelta?: number;
  sleepDelta?: number;
}

export interface HealthSummary {
  lastRecordDate: string | null;
  lastWeight: number | null;
  lastSleepHours: number | null;
  averageWeight7d: number | null;
  averageSleep7d: number | null;
  averageScore7d: number | null;
  weightTrend7d: "up" | "down" | "stable" | null;
  sleepTrend7d: "up" | "down" | "stable" | null;
  streak?: number;
}

// --- U17.1 Activity Score ---
export interface DailyActivityScore {
  missionsCompleted: number;
  xpGained: number;
  healthScore?: number;
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
export type RankTier = "E" | "D" | "C" | "B" | "A" | "S";

export interface SeasonReward {
  xpBonus?: number;
  statBonus?: Partial<UserStats>;
  unlockTitleId?: TitleId;
  unlockFrameId?: AvatarFrameId;
  unlockPassiveId?: PassiveId;
}

export interface SeasonDefinition {
  id: string;                  // "S01", "S02"...
  name: string;                // "Season 01 – Awakening"
  description: string;
  startDate: string;           // ISO
  endDate: string;             // ISO
  xpTargets: {                 // thresholds de XP de temporada
    D: number;
    C: number;
    B: number;
    A: number;
    S: number;
  };
  rewards: {                   // recompensas al alcanzar rango
    D?: SeasonReward;
    C?: SeasonReward;
    B?: SeasonReward;
    A?: SeasonReward;
    S?: SeasonReward;
  };
}

export interface SeasonProgress {
  seasonId: string;
  seasonXP: number;
  rank: RankTier;
  claimedRewards: RankTier[];   // rangos cuyas recompensas ya se reclamaron
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
  dungeonType: DungeonType;
  baseRewards: {
    xp: number;
    buffId?: string;
    frameId?: string;
    titleId?: string;
  };
}

export interface BossDefinition {
  id: string;
  name: string;
  element: 'dark' | 'lightning' | 'fire' | 'arcane' | 'fortune' | 'metabolism';
  stats: UserStats;
  powerLevel: number;
  specialMoves: string[];
}

export interface DungeonRunResult {
  id: string;
  dungeonId: string;
  bossId: string;
  victory: boolean;
  timestamp: string;
  xpEarned: number;
  rewards: string[];
}

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

  // U21 Milestones
  milestones: Milestone[];

  // U22 Seasons
  seasons: SeasonDefinition[];
  currentSeason?: SeasonProgress;
  seasonHistory?: SeasonProgress[];

  // U24.1 Settings
  settings: Settings;
}

// --- U24.1 SETTINGS ---
export interface Settings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  theme: 'dark' | 'light';
}

// --- U18 CALENDAR ---
export interface CalendarDayData {
  date: string; // ISO Date String (YYYY-MM-DD)
  missions: Mission[];
  health?: BodyRecord;
  journal?: JournalEntry[];
  xpGained: number;
  streak: number;
  efficiency: number; // 0-100
  logs?: LogEntry[]; // U21
}