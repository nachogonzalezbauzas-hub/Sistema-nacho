import { useState, useEffect } from 'react';
import { AppState, UserStats, Mission, JournalEntry, BodyRecord, StatType, Buff, Title, AvatarFrameId, TitleId, EffectiveStats, ActiveBuff, BuffId, PassiveId, LogEntry, LogCategory, HealthSummary, DailyActivityScore, CalendarDayData, Milestone, MilestoneCategory, MilestonePhase, MilestoneReward, SeasonDefinition, SeasonProgress, RankTier, Settings, DungeonRunResult } from './types';
import { BUFF_DEFINITIONS, PASSIVE_DEFINITIONS } from './buffs';
import { computeCalendar } from './utils/calendar';
import { TITLES, AVATAR_FRAMES } from './titles';
import { DUNGEONS } from './dungeons/dungeonDefinitions'; // U27
import { generateBoss } from './dungeons/bossGenerator'; // U27
import { calculateDungeonRewards } from './dungeons/rewardGenerator'; // U27

const STORAGE_KEY = 'sistema_nacho_data';

const INITIAL_STATS: UserStats = {
  level: 1,
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
  unlockedFrameIds: ['default'],
  selectedFrameId: 'default',
  lastChestClaim: null,
  passivePoints: 0,
  buffs: [],
  passives: {}
};

const INITIAL_HEALTH_SUMMARY: HealthSummary = {
  lastRecordDate: null,
  lastWeight: null,
  lastSleepHours: null,
  averageWeight7d: null,
  averageSleep7d: null,
  averageScore7d: null,
  weightTrend7d: null,
  sleepTrend7d: null
};

const INITIAL_STATE: AppState = {
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
  milestones: [],

  // U22 Seasons
  seasons: [],
  currentSeason: undefined,

  // U24.1 Settings
  settings: {
    musicEnabled: true,
    sfxEnabled: true,
    theme: 'dark'
  },

  // U27 Dungeon Runs
  dungeonRuns: []
};

// --- U22 SEASON HELPERS ---
const DEFAULT_SEASON: SeasonDefinition = {
  id: 'S01',
  name: 'Season 01 – Awakening',
  description: 'The beginning of the journey. Rise through the ranks.',
  startDate: new Date().toISOString(),
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
  xpTargets: { D: 100, C: 500, B: 1500, A: 3000, S: 5000 },
  rewards: {
    D: { xpBonus: 100, unlockTitleId: 'season_rookie' },
    C: { xpBonus: 250, unlockTitleId: 'season_challenger' },
    B: { xpBonus: 500, unlockTitleId: 'season_raider', unlockFrameId: 'season_crest' },
    A: { xpBonus: 1000, unlockTitleId: 'season_vanguard' },
    S: { xpBonus: 2500, unlockTitleId: 'season_monarch', unlockFrameId: 'season_monarch', statBonus: { strength: 5, agility: 5, intelligence: 5, vitality: 5, fortune: 5, metabolism: 5 } }
  },
  theme: {
    backgroundImage: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=2664&auto=format&fit=crop',
    primaryColor: '#3b82f6',
    accentColor: '#60a5fa'
  }
};

const calculateRank = (xp: number, targets: SeasonDefinition['xpTargets']): RankTier => {
  if (xp >= targets.S) return 'S';
  if (xp >= targets.A) return 'A';
  if (xp >= targets.B) return 'B';
  if (xp >= targets.C) return 'C';
  if (xp >= targets.D) return 'D';
  return 'E';
};

const addSeasonXP = (state: AppState, amount: number): AppState => {
  if (!state.currentSeason) return state;

  const currentSeasonDef = state.seasons.find(s => s.id === state.currentSeason!.seasonId);
  if (!currentSeasonDef) return state;

  const newXP = state.currentSeason.seasonXP + amount;
  const newRank = calculateRank(newXP, currentSeasonDef.xpTargets);
  const prevRank = state.currentSeason.rank;

  let nextState = {
    ...state,
    currentSeason: {
      ...state.currentSeason,
      seasonXP: newXP,
      rank: newRank
    }
  };

  if (newRank !== prevRank) {
    const log = createLog('System', 'Season Rank Up', `Reached Rank ${newRank}! Check rewards.`);
    nextState.logs = [log, ...nextState.logs];
  }

  return nextState;
};

// --- HELPERS ---
const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

const isYesterday = (today: Date, check: Date) => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(yesterday, check);
};

const createLog = (category: LogCategory, message: string, details: string, extras?: Partial<LogEntry>): LogEntry => {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    category,
    message,
    details,
    ...extras
  };
};

const calculateHealthScore = (record: Omit<BodyRecord, 'id' | 'date'>, prevRecord?: BodyRecord): number => {
  let score = 60;
  const sleep = record.sleepHours;
  if (sleep >= 7 && sleep <= 9) score += 20;
  else if (sleep >= 6 && sleep < 7) score += 10;
  else if (sleep < 5) score -= 15;
  else if (sleep > 10) score -= 10;

  if (prevRecord) {
    const diff = record.weight - prevRecord.weight;
    if (Math.abs(diff) < 0.5) score += 20;
    else if (Math.abs(diff) < 1.0) score += 10;
    else score -= 10;
  } else {
    score += 20;
  }
  return Math.max(0, Math.min(100, score));
};

const recomputeHealthSummary = (records: BodyRecord[]): HealthSummary => {
  if (records.length === 0) return INITIAL_HEALTH_SUMMARY;

  const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const last = sorted[sorted.length - 1];

  const now = new Date().getTime();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

  const recentRecords = sorted.filter(r => new Date(r.date).getTime() >= sevenDaysAgo);

  const avgWeight = recentRecords.length > 0
    ? recentRecords.reduce((acc, r) => acc + r.weight, 0) / recentRecords.length
    : last.weight;

  const avgSleep = recentRecords.length > 0
    ? recentRecords.reduce((acc, r) => acc + r.sleepHours, 0) / recentRecords.length
    : last.sleepHours;

  const avgScore = recentRecords.length > 0
    ? recentRecords.reduce((acc, r) => acc + (r.healthScore || 0), 0) / recentRecords.length
    : (last.healthScore || 0);

  let weightTrend: "up" | "down" | "stable" = "stable";
  if (sorted.length >= 2) {
    const recentAvg = sorted.slice(-3).reduce((acc, r) => acc + r.weight, 0) / Math.min(3, sorted.length);
    const prevSlice = sorted.slice(-6, -3);
    if (prevSlice.length > 0) {
      const prevAvg = prevSlice.reduce((acc, r) => acc + r.weight, 0) / prevSlice.length;
      if (recentAvg > prevAvg + 0.3) weightTrend = "up";
      else if (recentAvg < prevAvg - 0.3) weightTrend = "down";
    }
  }

  let sleepTrend: "up" | "down" | "stable" = "stable";
  if (sorted.length >= 2) {
    const recentAvg = sorted.slice(-3).reduce((acc, r) => acc + r.sleepHours, 0) / Math.min(3, sorted.length);
    const prevSlice = sorted.slice(-6, -3);
    if (prevSlice.length > 0) {
      const prevAvg = prevSlice.reduce((acc, r) => acc + r.sleepHours, 0) / prevSlice.length;
      if (recentAvg > prevAvg + 0.5) sleepTrend = "up";
      else if (recentAvg < prevAvg - 0.5) sleepTrend = "down";
    }
  }

  return {
    lastRecordDate: last.date,
    lastWeight: last.weight,
    lastSleepHours: last.sleepHours,
    averageWeight7d: avgWeight,
    averageSleep7d: avgSleep,
    averageScore7d: avgScore,
    weightTrend7d: weightTrend,
    sleepTrend7d: sleepTrend
  };
};

export const isMissionAvailableToday = (mission: Mission, today: Date): boolean => {
  if (!mission.frequency || mission.frequency === 'always') return true;
  if (mission.daysOfWeek && mission.daysOfWeek.length > 0) {
    const dayIndex = today.getDay();
    if (!mission.daysOfWeek.includes(dayIndex)) return false;
  }
  if (mission.frequency === 'daily' && (!mission.daysOfWeek || mission.daysOfWeek.length === 0)) return true;
  if (mission.frequency === 'weekly' && (!mission.daysOfWeek || mission.daysOfWeek.length === 0)) return true;
  return true;
};

// --- U17.1 HELPERS ---
const getDateKey = (date = new Date()) =>
  date.toDateString();

const ensureDailyActivity = (state: AppState, dateKey: string): AppState => {
  if (state.dailyActivity?.[dateKey]) return state;

  return {
    ...state,
    dailyActivity: {
      ...state.dailyActivity,
      [dateKey]: {
        missionsCompleted: 0,
        xpGained: 0,
        healthScore: undefined
      }
    }
  };
};

const registerDailyActivity = (
  state: AppState,
  dateKey: string,
  data: Partial<DailyActivityScore>
): AppState => {
  const base = state.dailyActivity[dateKey];

  return {
    ...state,
    dailyActivity: {
      ...state.dailyActivity,
      [dateKey]: {
        ...base,
        ...data,
        missionsCompleted:
          (base.missionsCompleted || 0) +
          (data.missionsCompleted || 0),
        xpGained:
          (base.xpGained || 0) +
          (data.xpGained || 0)
      }
    }
  };
};

const calculatePassiveGains = (activity: DailyActivityScore) => {
  let gain = 0;

  gain += activity.missionsCompleted * 0.1;
  gain += activity.xpGained * 0.01;

  if (activity.healthScore)
    gain += activity.healthScore / 25;

  return Math.min(1, Math.floor(gain));
};

const applyPassiveProgression = (state: AppState): AppState => {
  const todayKey = getDateKey();
  const lastKey = state.lastPassiveProgressDate;

  if (lastKey === todayKey) return state;

  const yesterday = getDateKey(
    new Date(Date.now() - 86400000)
  );

  const activity = state.dailyActivity?.[yesterday];
  if (!activity) {
    return {
      ...state,
      lastPassiveProgressDate: todayKey
    };
  }

  const gain = calculatePassiveGains(activity);

  const newStats = { ...state.stats };

  if (gain > 0) {
    newStats.strength += gain;
    newStats.vitality += gain;
    newStats.agility += gain;
    newStats.intelligence += gain;
    newStats.fortune += gain;
    newStats.metabolism += gain;
  }

  return {
    ...state,
    stats: newStats,
    lastPassiveProgressDate: todayKey
  };
};

// --- STORE LOGIC ---

export const useStore = () => {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sistema-nacho-storage');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with INITIAL_STATE to ensure new fields (like settings) are present
          return { ...INITIAL_STATE, ...parsed.state };
        } catch (e) {
          console.error('Failed to parse storage', e);
        }
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sistema-nacho-storage', JSON.stringify({ state }));
    }
  }, [state]);
  const [loaded, setLoaded] = useState(false);

  // --- RECOMPUTE UNLOCKS ---
  const recomputeTitlesAndFrames = (currentState: AppState): AppState => {
    let nextState = { ...currentState, stats: { ...currentState.stats } };
    let hasChanges = false;
    let newlyUnlockedTitle: any = null;

    const unlockedTitles = TITLES.filter(t => t.condition(nextState));
    const newTitleIds = unlockedTitles.map(t => t.id);
    const currentIds = new Set(nextState.stats.unlockedTitleIds);
    const newUnlock = unlockedTitles.find(t => !currentIds.has(t.id));
    if (newUnlock) newlyUnlockedTitle = newUnlock;

    const combinedTitleIds = Array.from(new Set([...nextState.stats.unlockedTitleIds, ...newTitleIds]));
    if (combinedTitleIds.length !== nextState.stats.unlockedTitleIds.length) {
      nextState.stats.unlockedTitleIds = combinedTitleIds as TitleId[];
      hasChanges = true;
    }
    if (nextState.stats.equippedTitleId && !combinedTitleIds.includes(nextState.stats.equippedTitleId)) {
      nextState.stats.equippedTitleId = null;
      hasChanges = true;
    }

    const unlockedFrames = AVATAR_FRAMES.filter(f => f.condition(nextState));
    const newFrameIds = unlockedFrames.map(f => f.id);
    const combinedFrameIds = Array.from(new Set([...nextState.stats.unlockedFrameIds, ...newFrameIds, 'default' as AvatarFrameId]));
    if (combinedFrameIds.length !== nextState.stats.unlockedFrameIds.length) {
      nextState.stats.unlockedFrameIds = combinedFrameIds as AvatarFrameId[];
      hasChanges = true;
    }
    if (!combinedFrameIds.includes(nextState.stats.selectedFrameId)) {
      nextState.stats.selectedFrameId = 'default';
      hasChanges = true;
    }

    if (newlyUnlockedTitle && !currentState.justUnlockedTitle) {
      nextState.justUnlockedTitle = newlyUnlockedTitle;
      hasChanges = true;
      const log = createLog('Achievement', 'Title Unlocked', `You unlocked: ${newlyUnlockedTitle.name}`);
      nextState.logs = [log, ...nextState.logs];
    }

    return hasChanges ? nextState : currentState;
  };

  // --- U17 DAILY STAT PROGRESSION ---
  const applyDailyStatProgression = (currentState: AppState): AppState => {
    if (!currentState.lastDailyStatUpdate) {
      return { ...currentState, lastDailyStatUpdate: new Date().toISOString() };
    }

    const lastUpdate = new Date(currentState.lastDailyStatUpdate);
    const now = new Date();
    if (isSameDay(lastUpdate, now)) return currentState;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const missionsYesterday = currentState.missions.filter(m =>
      m.lastCompletedAt && isSameDay(new Date(m.lastCompletedAt), yesterday)
    ).length;

    const healthScore = currentState.healthSummary.averageScore7d || 50;
    const trendPositive = currentState.healthSummary.averageScore7d !== null && currentState.healthSummary.averageScore7d >= 70;

    const baseGain = (missionsYesterday * 0.1) + (healthScore / 200) + (trendPositive ? 0.2 : 0);
    const dailyGain = parseFloat(Math.min(1.0, Math.max(0, baseGain)).toFixed(1));

    if (dailyGain <= 0) {
      return { ...currentState, lastDailyStatUpdate: now.toISOString() };
    }

    const newStats = { ...currentState.stats };
    const gainValue = Number(dailyGain);

    newStats.strength += gainValue;
    newStats.vitality += gainValue;
    newStats.agility += gainValue;
    newStats.intelligence += gainValue;
    newStats.fortune += gainValue;
    newStats.metabolism += gainValue;

    newStats.dailyGains = {
      strength: gainValue,
      vitality: gainValue,
      agility: gainValue,
      intelligence: gainValue,
      fortune: gainValue,
      metabolism: gainValue
    };

    const log = createLog('System', 'Daily Progression', `Passive growth applied: +${gainValue} to all stats.`);

    return {
      ...currentState,
      stats: newStats,
      logs: [log, ...currentState.logs],
      lastDailyStatUpdate: now.toISOString()
    };
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let migratedState = { ...INITIAL_STATE, ...(parsed.state || parsed) };

        if (!migratedState.lastDailyStatUpdate) migratedState.lastDailyStatUpdate = new Date().toISOString();
        if (!migratedState.stats.dailyGains) migratedState.stats.dailyGains = { strength: 0, vitality: 0, agility: 0, intelligence: 0, fortune: 0, metabolism: 0 };
        if (!migratedState.stats.pendingDailyGains) migratedState.stats.pendingDailyGains = { strength: 0, vitality: 0, agility: 0, intelligence: 0, fortune: 0, metabolism: 0 };

        if (!migratedState.healthSummary) migratedState.healthSummary = INITIAL_HEALTH_SUMMARY;
        if (migratedState.lastHealthBonusDate === undefined) migratedState.lastHealthBonusDate = null;
        if (!migratedState.logs) migratedState.logs = [];

        if (!migratedState.activeBuffs) migratedState.activeBuffs = [];
        if (!migratedState.dailyChest) migratedState.dailyChest = { lastOpenedAt: null };
        const expectedPoints = Math.floor(migratedState.stats.level / 3);
        const pointsSpent = Object.values(migratedState.passiveLevels || {}).reduce((acc: number, lvl: any) => acc + (Number(lvl) || 0), 0) as number;
        if (migratedState.passivePoints === undefined) {
          migratedState.passivePoints = Math.max(0, expectedPoints - pointsSpent);
        }
        if (!migratedState.passiveLevels) migratedState.passiveLevels = {};

        // U18 Calendar Migration
        if (!migratedState.calendar) {
          migratedState.calendar = { events: {} };
        }

        // U21 Milestones Migration
        if (!migratedState.milestones) {
          migratedState.milestones = [];
        }

        // U17.1 Migration
        if (!migratedState.dailyActivity) migratedState.dailyActivity = {};
        if (!migratedState.lastPassiveProgressDate) migratedState.lastPassiveProgressDate = null;

        // U22 Seasons Migration
        if (!migratedState.seasons || migratedState.seasons.length === 0) {
          migratedState.seasons = [DEFAULT_SEASON];
        }
        if (!migratedState.currentSeason) {
          migratedState.currentSeason = {
            seasonId: migratedState.seasons[0].id,
            seasonXP: 0,
            rank: 'E',
            claimedRewards: []
          };
        }

        // U27 Dungeon Runs Migration
        if (!migratedState.dungeonRuns) {
          migratedState.dungeonRuns = [];
        }

        if ('buffs' in migratedState.stats) delete (migratedState.stats as any).buffs;
        if ('passives' in migratedState.stats) delete (migratedState.stats as any).passives;
        if ('passivePoints' in migratedState.stats) delete (migratedState.stats as any).passivePoints;

        migratedState = recomputeTitlesAndFrames(migratedState);
        migratedState = applyDailyStatProgression(migratedState);
        migratedState = applyPassiveProgression(migratedState); // U17.1

        setState(migratedState);
      } catch (e) {
        console.error("Error loading data", e);
      }
    } else {
      let initState = recomputeTitlesAndFrames(INITIAL_STATE);
      initState = applyPassiveProgression(initState); // U17.1
      // U22 Init
      initState.seasons = [DEFAULT_SEASON];
      initState.currentSeason = {
        seasonId: DEFAULT_SEASON.id,
        seasonXP: 0,
        rank: 'E',
        claimedRewards: []
      };
      setState(initState);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog = createLog(entry.category, entry.message, entry.details || '', { ...entry });
    setState(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs].slice(0, 300)
    }));
  };

  const cleanupExpiredBuffs = () => {
    const now = new Date();
    setState(prev => {
      const validBuffs = prev.activeBuffs.filter(b => new Date(b.expiresAt) > now);
      if (validBuffs.length !== prev.activeBuffs.length) {
        return { ...prev, activeBuffs: validBuffs, lastBuffCleanupAt: now.toISOString() };
      }
      return prev;
    });
  };

  useEffect(() => {
    if (loaded) {
      const interval = setInterval(cleanupExpiredBuffs, 60000);
      return () => clearInterval(interval);
    }
  }, [loaded]);

  const applyBuff = (id: BuffId) => {
    const def = BUFF_DEFINITIONS.find(b => b.id === id);
    if (!def) return;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + def.durationMinutes * 60000).toISOString();

    setState(prev => {
      const others = prev.activeBuffs.filter(b => b.id !== id);
      const newBuff: ActiveBuff = { id, startedAt: now.toISOString(), expiresAt };
      const log = createLog('System', 'Buff Applied', `Activated: ${def.name}`);
      return { ...prev, activeBuffs: [...others, newBuff], logs: [log, ...prev.logs] };
    });
  };

  const getActiveBuffDefinitions = () => {
    const now = new Date();
    return state.activeBuffs
      .filter(b => new Date(b.expiresAt) > now)
      .map(b => BUFF_DEFINITIONS.find(def => def.id === b.id)!)
      .filter(Boolean);
  };

  const getCurrentXpMultiplier = () => {
    const activeDefs = getActiveBuffDefinitions();
    return activeDefs.reduce((acc, def) => acc * (def.xpMultiplier || 1), 1);
  };

  const getPassiveEffectiveBonuses = () => {
    const bonuses: Partial<Record<StatType, number>> = {};
    Object.entries(state.passiveLevels).forEach(([id, level]) => {
      const def = PASSIVE_DEFINITIONS.find(p => p.id === id);
      const lvl = Number(level);
      if (def && lvl > 0) {
        Object.entries(def.statBonusesPerLevel).forEach(([stat, amount]) => {
          const s = stat as StatType;
          bonuses[s] = (bonuses[s] || 0) + (amount * lvl);
        });
      }
    });
    return bonuses;
  };

  const getEffectiveStats = (): EffectiveStats => {
    const base = state.stats;
    const passiveBonuses = getPassiveEffectiveBonuses();
    const activeBuffs = getActiveBuffDefinitions();

    const calc = (stat: StatType): number => {
      let val = base[stat.toLowerCase() as keyof UserStats] as number;
      val += (passiveBonuses[stat] || 0);
      activeBuffs.forEach(def => {
        if (def.statModifiers && def.statModifiers[stat]) {
          val += def.statModifiers[stat]!;
        }
      });
      return Math.floor(val);
    };

    return {
      strength: calc('Strength'),
      vitality: calc('Vitality'),
      agility: calc('Agility'),
      intelligence: calc('Intelligence'),
      fortune: calc('Fortune'),
      metabolism: calc('Metabolism'),
      dailyGains: state.stats.dailyGains
    };
  };

  const canOpenDailyChest = (): boolean => {
    if (!state.dailyChest.lastOpenedAt) return true;
    const last = new Date(state.dailyChest.lastOpenedAt);
    const now = new Date();
    return !isSameDay(last, now);
  };

  const updateLevelIfNeeded = (currentStats: UserStats): { stats: UserStats, leveledUp: boolean } => {
    let newStats = { ...currentStats };
    let leveledUp = false;

    while (newStats.xpCurrent >= newStats.xpForNextLevel) {
      newStats.xpCurrent -= newStats.xpForNextLevel;
      newStats.level += 1;
      newStats.xpForNextLevel = 100 + (newStats.level * 25);
      newStats.strength += 1;
      newStats.vitality += 1;
      newStats.agility += 1;
      newStats.intelligence += 1;
      newStats.fortune += 1;
      newStats.metabolism += 1;
      leveledUp = true;
    }
    return { stats: newStats, leveledUp };
  };

  // Helper for dungeon runs
  const calculateLevel = (currentLevel: number, currentXp: number): { level: number; xp: number; leveledUp: boolean } => {
    let level = currentLevel;
    let xp = currentXp;
    let xpForNextLevel = 100 + (level * 25);
    let leveledUp = false;

    while (xp >= xpForNextLevel) {
      xp -= xpForNextLevel;
      level += 1;
      xpForNextLevel = 100 + (level * 25);
      leveledUp = true;
    }
    return { level, xp, leveledUp };
  };

  const openDailyChest = (): { xpReward: number; buffId?: BuffId } | null => {
    if (!canOpenDailyChest()) return null;

    const xpReward = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    const roll = Math.random();
    let buffId: BuffId | undefined;

    if (roll < 0.4) {
      const buffs = BUFF_DEFINITIONS;
      buffId = buffs[Math.floor(Math.random() * buffs.length)].id;
    }

    setState(prev => {
      let nextState = { ...prev };

      let newStats = { ...nextState.stats };
      const prevLevel = newStats.level;
      newStats.xpCurrent += xpReward;
      const levelRes = updateLevelIfNeeded(newStats);
      newStats = levelRes.stats;

      nextState.stats = newStats;
      nextState.justLeveledUp = levelRes.leveledUp;
      nextState.dailyChest = { lastOpenedAt: new Date().toISOString() };

      const logs = [...nextState.logs];
      logs.unshift(createLog('System', 'Daily Supply', `Opened chest. +${xpReward} XP.`, { xpChange: xpReward }));

      if (newStats.level > prevLevel) {
        if (newStats.level % 3 === 0) nextState.passivePoints += 1;
        logs.unshift(createLog('LevelUp', `LEVEL UP – ${newStats.level}`, 'Your presence feels heavier.', { levelChange: { from: prevLevel, to: newStats.level } }));
      }

      if (buffId) {
        const def = BUFF_DEFINITIONS.find(b => b.id === buffId);
        if (def) {
          const now = new Date();
          const expiresAt = new Date(now.getTime() + def.durationMinutes * 60000).toISOString();
          const others = nextState.activeBuffs.filter(b => b.id !== buffId);
          nextState.activeBuffs = [...others, { id: buffId, startedAt: now.toISOString(), expiresAt }];
          logs.unshift(createLog('System', 'Buff Acquired', `Found ${def.name} in chest.`));
        }
      }

      nextState.logs = logs;
      nextState = applyDailyStatProgression(nextState);

      return recomputeTitlesAndFrames(nextState);
    });

    return { xpReward, buffId };
  };

  const upgradePassive = (id: PassiveId) => {
    setState(prev => {
      const def = PASSIVE_DEFINITIONS.find(p => p.id === id);
      if (!def) return prev;

      const currentLevel = prev.passiveLevels[id] || 0;
      if (currentLevel >= def.maxLevel) return prev;
      if (prev.passivePoints < def.costPerLevel) return prev;

      const log = createLog('System', 'Skill Upgraded', `${def.name} upgraded to Level ${currentLevel + 1}`);

      return {
        ...prev,
        passivePoints: prev.passivePoints - def.costPerLevel,
        passiveLevels: {
          ...prev.passiveLevels,
          [id]: currentLevel + 1
        },
        logs: [log, ...prev.logs]
      };
    });
  };

  const addMission = (missionInput: Omit<Mission, 'id' | 'lastCompletedAt'>) => {
    const newMission: Mission = {
      ...missionInput,
      id: crypto.randomUUID(),
      lastCompletedAt: null,
      frequency: missionInput.frequency || (missionInput.isDaily ? 'daily' : 'always'),
      streak: 0,
    };
    setState(prev => ({ ...prev, missions: [...prev.missions, newMission] }));
  };

  const addRecommendedMission = (template: { title: string; detail: string; targetStat: StatType; xpReward: number; isDaily: boolean }) => {
    addMission({
      title: template.title,
      detail: template.detail,
      targetStat: template.targetStat,
      xpReward: template.xpReward,
      isDaily: template.isDaily,
      frequency: template.isDaily ? 'daily' : 'always'
    });
  };

  // U24.2 Redeem Code
  const redeemCode = (code: string): { success: boolean; message: string } => {
    const normalizedCode = code.trim().toLowerCase();

    if (normalizedCode === 'godtier') {

      setState(prev => {
        let nextState = { ...prev };
        // Deep copy stats to ensure React detects change
        let newStats = { ...nextState.stats };

        // God Mode Stats
        newStats.level = 100;
        newStats.xpCurrent = 0;
        newStats.xpForNextLevel = 100 + (100 * 25);
        newStats.strength = 100;
        newStats.vitality = 100;
        newStats.agility = 100;
        newStats.intelligence = 100;
        newStats.fortune = 100;
        newStats.metabolism = 100;

        // Force Unlock Title
        if (!newStats.unlockedTitleIds.includes('system_monarch')) {
          newStats.unlockedTitleIds = [...newStats.unlockedTitleIds, 'system_monarch'];
        }

        // Force Unlock Frame
        if (!newStats.unlockedFrameIds.includes('rainbow_monarch')) {
          newStats.unlockedFrameIds = [...newStats.unlockedFrameIds, 'rainbow_monarch'];
        }

        nextState.stats = newStats;

        const log = createLog('System', 'Cheat Code', 'GOD MODE ACTIVATED. LIMITS BROKEN.');
        nextState.logs = [log, ...nextState.logs];

        // Return nextState directly
        return nextState;
      });
      return { success: true, message: "GODTIER MODE ACTIVATED" };
    }

    return { success: false, message: "Invalid Access Code" };
  };

  const completeMission = (missionId: string) => {
    cleanupExpiredBuffs();

    setState(prev => {
      const missionIndex = prev.missions.findIndex(m => m.id === missionId);
      if (missionIndex === -1) return prev;
      const mission = prev.missions[missionIndex];
      const now = new Date();

      if (mission.isDaily && mission.lastCompletedAt && isSameDay(new Date(mission.lastCompletedAt), now)) return prev;

      let globalStreak = prev.stats.streak;
      const isDailyCompletedToday = prev.missions.some(m => m.isDaily && m.lastCompletedAt && isSameDay(new Date(m.lastCompletedAt), now));
      if (mission.isDaily && !isDailyCompletedToday) globalStreak += 1;

      let missionStreak = mission.streak || 0;
      if (mission.lastCompletedAt) {
        const lastComp = new Date(mission.lastCompletedAt);
        if (isYesterday(now, lastComp)) missionStreak += 1;
        else if (!isSameDay(lastComp, now)) missionStreak = 1;
      } else {
        missionStreak = 1;
      }

      let nextState = { ...prev };
      let newStats = { ...nextState.stats };
      const prevLevel = newStats.level;

      const streakMultiplier = 1 + (globalStreak * 0.05);
      const buffMultiplier = (() => {
        const activeDefs = nextState.activeBuffs
          .filter(b => new Date(b.expiresAt) > now)
          .map(b => BUFF_DEFINITIONS.find(d => d.id === b.id)!)
          .filter(Boolean);
        return activeDefs.reduce((acc, def) => acc * (def.xpMultiplier || 1), 1);
      })();

      const earnedXp = Math.floor(mission.xpReward * streakMultiplier * buffMultiplier);
      newStats.xpCurrent += earnedXp;
      newStats.streak = globalStreak;
      newStats.lastActiveDate = now.toISOString();

      switch (mission.targetStat) {
        case 'Strength': newStats.strength += 1; break;
        case 'Vitality': newStats.vitality += 1; break;
        case 'Agility': newStats.agility += 1; break;
        case 'Intelligence': newStats.intelligence += 1; break;
        case 'Fortune': newStats.fortune += 1; break;
        case 'Metabolism': newStats.metabolism += 1; break;
      }

      const { level, xp, leveledUp } = calculateLevel(newStats.level, newStats.xpCurrent);
      newStats.level = level;
      newStats.xpCurrent = xp;

      if (leveledUp) {
        // Stat growth on level up
        newStats.strength += 1;
        newStats.vitality += 1;
        newStats.agility += 1;
        newStats.intelligence += 1;
        newStats.fortune += 1;
        newStats.metabolism += 1;
        if (newStats.level % 3 === 0) nextState.passivePoints += 1;
      }

      const updatedMissions = [...nextState.missions];
      updatedMissions[missionIndex] = { ...mission, lastCompletedAt: now.toISOString(), streak: missionStreak };

      const logs = [...nextState.logs];
      logs.unshift(createLog(
        'Mission',
        `Mission Completed: ${mission.title}`,
        `+${earnedXp} XP. Stat: ${mission.targetStat}`,
        { xpChange: earnedXp, statChange: { stat: mission.targetStat, amount: 1 } }
      ));

      if (leveledUp) {
        logs.unshift(createLog(
          'LevelUp',
          `LEVEL UP – ${newStats.level}`,
          'Your presence feels heavier.',
          { levelChange: { from: prevLevel, to: newStats.level } }
        ));
      }

      if (missionStreak > 1 && missionStreak % 5 === 0) {
        logs.unshift(createLog('Streak', `${missionStreak} Day Streak`, `Consistent performance on: ${mission.title}`));
      }

      nextState.stats = newStats;
      nextState.missions = updatedMissions;
      nextState.justLeveledUp = leveledUp;
      nextState.logs = logs;

      if (mission.isDaily) {
        nextState = applyDailyStatProgression(nextState);
      }

      // U17.1 register activity
      const dateKey = getDateKey(now);
      nextState = ensureDailyActivity(nextState, dateKey);
      nextState = registerDailyActivity(nextState, dateKey, {
        missionsCompleted: 1,
        xpGained: earnedXp
      });

      // U22 Season XP Hook
      const seasonXpGain = Math.floor(earnedXp * 0.5);
      if (seasonXpGain > 0) {
        nextState = addSeasonXP(nextState, seasonXpGain);
      }

      return recomputeTitlesAndFrames(nextState);
    });
  };

  const setLevelUp = (value: boolean) => setState(prev => ({ ...prev, justLeveledUp: value }));
  const setTitleModalClosed = () => setState(prev => ({ ...prev, justUnlockedTitle: null }));

  const equipTitle = (titleId: TitleId | null) => {
    setState(prev => {
      if (titleId && !prev.stats.unlockedTitleIds.includes(titleId)) return prev;
      const log = createLog('System', 'Title Equipped', `Equipped title: ${titleId}`);
      return { ...prev, stats: { ...prev.stats, equippedTitleId: titleId }, logs: [log, ...prev.logs] };
    });
  };

  const equipFrame = (frameId: AvatarFrameId) => {
    setState(prev => {
      if (!prev.stats.unlockedFrameIds.includes(frameId)) return prev;
      return { ...prev, stats: { ...prev.stats, selectedFrameId: frameId } };
    });
  };

  const unlockFrame = (id: AvatarFrameId) => {
    setState(prev => recomputeTitlesAndFrames(prev));
  };

  const selectFrame = (id: AvatarFrameId) => equipFrame(id);

  const addJournalEntry = (text: string) => {
    setState(prev => ({ ...prev, journalEntries: [{ id: crypto.randomUUID(), date: new Date().toISOString(), text }, ...prev.journalEntries] }));
  };

  const addBodyRecord = (recordInput: Omit<BodyRecord, 'id' | 'date'>) => {
    setState(prev => {
      const previousRecord = prev.bodyRecords.length > 0
        ? [...prev.bodyRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        : undefined;

      const healthScore = calculateHealthScore(recordInput, previousRecord);

      let weightDelta = 0;
      if (previousRecord) weightDelta = recordInput.weight - previousRecord.weight;

      const sleepDelta = recordInput.sleepHours - 7;

      const newRecord: BodyRecord = {
        ...recordInput,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        healthScore,
        weightDelta,
        sleepDelta
      };

      const updatedRecords = [newRecord, ...prev.bodyRecords];
      const newSummary = recomputeHealthSummary(updatedRecords);
      const logs = [...prev.logs];
      const log = createLog('Health', 'Health Status Updated', `Weight: ${recordInput.weight}kg, Sleep: ${recordInput.sleepHours}h, Score: ${healthScore}`);
      logs.unshift(log);

      let newStats = { ...prev.stats };
      let lastBonusDate = prev.lastHealthBonusDate;
      const today = new Date().toDateString();
      const lastBonus = lastBonusDate ? new Date(lastBonusDate).toDateString() : null;

      if (newSummary.averageScore7d !== null && newSummary.averageScore7d >= 70 && lastBonus !== today) {
        newStats.vitality += 1;
        newStats.metabolism += 1;
        lastBonusDate = new Date().toISOString();
        const bonusLog = createLog('System', 'Health Bonus', 'Physical peak maintained. Vitality +1, Metabolism +1');
        logs.unshift(bonusLog);
      }

      let nextState = {
        ...prev,
        bodyRecords: updatedRecords,
        healthSummary: newSummary,
        lastHealthBonusDate: lastBonusDate,
        stats: newStats,
        logs: logs
      };

      // Trigger daily progression checks on health update
      nextState = applyDailyStatProgression(nextState);

      // U17.1 register activity
      const dateKey = getDateKey(new Date());
      nextState = ensureDailyActivity(nextState, dateKey);
      nextState = registerDailyActivity(nextState, dateKey, {
        healthScore: healthScore
      });

      return nextState;
    });
  };

  // --- U21 MILESTONES ---
  const addMilestone = (milestoneInput: {
    title: string;
    description: string;
    category: MilestoneCategory;
    targetDate?: string;
    phases: Omit<MilestonePhase, "id" | "completedActions" | "isCompleted">[];
    reward: MilestoneReward;
  }) => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      title: milestoneInput.title,
      description: milestoneInput.description,
      category: milestoneInput.category,
      createdAt: new Date().toISOString(),
      targetDate: milestoneInput.targetDate,
      phases: milestoneInput.phases.map(p => ({
        ...p,
        id: crypto.randomUUID(),
        completedActions: 0,
        isCompleted: false
      })),
      currentPhaseIndex: 0,
      isCompleted: false,
      progressPercent: 0,
      reward: milestoneInput.reward
    };

    setState(prev => {
      const logs = [...prev.logs];
      logs.unshift(createLog('System', 'Epic Mission Started', `Begun: ${newMilestone.title}`));
      return { ...prev, milestones: [...prev.milestones, newMilestone], logs };
    });
  };

  const incrementMilestonePhase = (milestoneId: string) => {
    setState(prev => {
      const milestoneIndex = prev.milestones.findIndex(m => m.id === milestoneId);
      if (milestoneIndex === -1) return prev;

      const milestone = { ...prev.milestones[milestoneIndex] };
      if (milestone.isCompleted) return prev;

      const currentPhase = { ...milestone.phases[milestone.currentPhaseIndex] };

      // Increment actions
      currentPhase.completedActions = Math.min(currentPhase.requiredActions, currentPhase.completedActions + 1);

      // Check phase completion
      if (currentPhase.completedActions >= currentPhase.requiredActions) {
        currentPhase.isCompleted = true;
      }

      const updatedPhases = [...milestone.phases];
      updatedPhases[milestone.currentPhaseIndex] = currentPhase;
      milestone.phases = updatedPhases;

      // Check if we should advance phase
      if (currentPhase.isCompleted && milestone.currentPhaseIndex < milestone.phases.length - 1) {
        milestone.currentPhaseIndex += 1;
      }

      // Recalculate total progress
      const totalActions = milestone.phases.reduce((acc, p) => acc + p.requiredActions, 0);
      const completedActions = milestone.phases.reduce((acc, p) => acc + p.completedActions, 0);
      milestone.progressPercent = Math.floor((completedActions / totalActions) * 100);

      // Check Milestone Completion
      const allPhasesCompleted = milestone.phases.every(p => p.isCompleted);
      let nextState = { ...prev };
      const logs = [...nextState.logs];

      if (allPhasesCompleted && !milestone.isCompleted) {
        milestone.isCompleted = true;
        milestone.progressPercent = 100;

        // Apply Rewards
        const { reward } = milestone;
        let newStats = { ...nextState.stats };

        // XP Bonus
        if (reward.xpBonus) {
          newStats.xpCurrent += reward.xpBonus;
          logs.unshift(createLog('Milestone', 'Epic Mission Completed', `${milestone.title} completed! +${reward.xpBonus} XP`, { xpChange: reward.xpBonus }));
        } else {
          logs.unshift(createLog('Milestone', 'Epic Mission Completed', `${milestone.title} completed!`));
        }

        // Stat Bonus
        if (reward.statBonus) {
          (Object.keys(reward.statBonus) as StatType[]).forEach(stat => {
            const val = reward.statBonus![stat.toLowerCase() as keyof UserStats] as number;
            if (val) {
              const statKey = stat.toLowerCase() as keyof UserStats;
              (newStats[statKey] as number) += val;
              logs.unshift(createLog('System', 'Stat Bonus', `${stat} +${val} from Milestone`));
            }
          });
        }

        // Title Unlock
        if (reward.unlockTitleId && !newStats.unlockedTitleIds.includes(reward.unlockTitleId)) {
          newStats.unlockedTitleIds = [...newStats.unlockedTitleIds, reward.unlockTitleId];
          const titleDef = TITLES.find(t => t.id === reward.unlockTitleId);
          if (titleDef) {
            nextState.justUnlockedTitle = titleDef;
            logs.unshift(createLog('System', 'Title Unlocked', `Unlocked title: ${titleDef.name}`));
          }
        }

        // Frame Unlock
        if (reward.unlockFrameId && !newStats.unlockedFrameIds.includes(reward.unlockFrameId)) {
          newStats.unlockedFrameIds = [...newStats.unlockedFrameIds, reward.unlockFrameId];
          const frameDef = AVATAR_FRAMES.find(f => f.id === reward.unlockFrameId);
          if (frameDef) {
            logs.unshift(createLog('System', 'Frame Unlocked', `Unlocked frame: ${frameDef.name}`));
          }
        }

        // Check Level Up from XP bonus
        const { level, xp, leveledUp } = calculateLevel(newStats.level, newStats.xpCurrent);
        newStats.level = level;
        newStats.xpCurrent = xp;

        if (leveledUp) {
          nextState.justLeveledUp = true;
          logs.unshift(createLog('LevelUp', `LEVEL UP – ${newStats.level}`, 'Milestone reward pushed you further.', { levelChange: { from: prev.stats.level, to: newStats.level } }));
        }

        nextState.stats = newStats;
      } else {
        // Just progress log
        logs.unshift(createLog('Milestone', 'Milestone Progress', `${milestone.title}: +1 Action`));
      }

      // Update milestones array
      const updatedMilestones = [...prev.milestones];
      updatedMilestones[milestoneIndex] = milestone;

      nextState.milestones = updatedMilestones;
      nextState.logs = logs;

      // U22 Season XP Hook for Milestones
      if (milestone.isCompleted && !prev.milestones[milestoneIndex].isCompleted) {
        nextState = addSeasonXP(nextState, 100); // Flat 100 Season XP for Epic Mission
      }

      return recomputeTitlesAndFrames(nextState);
    });
  };

  // --- U18 CALENDAR LOGIC ---
  const getCalendarData = (): Record<string, CalendarDayData> => {
    return computeCalendar(state);
  };

  const getDayInfo = (dateString: string): CalendarDayData | null => {
    const calendar = getCalendarData();
    return calendar[dateString] || null;
  };

  return {
    state,
    addMission,
    completeMission,
    addJournalEntry,
    addBodyRecord,
    setLevelUp,
    setTitleModalClosed,
    equipTitle,
    equipFrame,
    unlockFrame,
    selectFrame,
    applyBuff,
    getActiveBuffDefinitions,
    getEffectiveStats,
    canOpenDailyChest,
    openDailyChest,
    upgradePassive,
    addLog,
    // U18
    getCalendarData,

    // U21
    addMilestone,
    incrementMilestonePhase,
    getDayInfo,

    // U22
    claimSeasonReward: (tier: RankTier) => {
      setState(prev => {
        if (!prev.currentSeason) return prev;
        if (prev.currentSeason.claimedRewards.includes(tier)) return prev;

        // Use DEFAULT_SEASON for rewards definition since it might not be fully in state
        const reward = DEFAULT_SEASON.rewards[tier];
        if (!reward) return prev;

        let nextState = { ...prev };
        let newStats = { ...nextState.stats };
        const logs = [...nextState.logs];

        // 1. Apply XP Bonus
        if (reward.xpBonus) {
          const { level, xp, leveledUp } = calculateLevel(newStats.level, newStats.xpCurrent + reward.xpBonus);
          newStats.level = level;
          newStats.xpCurrent = xp;

          logs.unshift(createLog('System', 'Season Reward', `+${reward.xpBonus} XP from Rank ${tier}`));

          if (leveledUp) {
            // Stat growth on level up
            newStats.strength += 1;
            newStats.vitality += 1;
            newStats.agility += 1;
            newStats.intelligence += 1;
            newStats.fortune += 1;
            newStats.metabolism += 1;

            nextState.justLeveledUp = true;
            logs.unshift(createLog('LevelUp', `LEVEL UP – ${level}`, 'Season rewards pushed you further.', { levelChange: { from: prev.stats.level, to: level } }));
          }
        }

        // 2. Unlock Title
        if (reward.unlockTitleId && !newStats.unlockedTitleIds.includes(reward.unlockTitleId)) {
          newStats.unlockedTitleIds = [...newStats.unlockedTitleIds, reward.unlockTitleId];
          const titleDef = TITLES.find(t => t.id === reward.unlockTitleId);
          if (titleDef) {
            nextState.justUnlockedTitle = titleDef;
            logs.unshift(createLog('System', 'Title Unlocked', `Season Reward: ${titleDef.name}`));
          }
        }

        // 3. Unlock Frame
        if (reward.unlockFrameId && !newStats.unlockedFrameIds.includes(reward.unlockFrameId)) {
          newStats.unlockedFrameIds = [...newStats.unlockedFrameIds, reward.unlockFrameId];
          const frameDef = AVATAR_FRAMES.find(f => f.id === reward.unlockFrameId);
          if (frameDef) {
            logs.unshift(createLog('System', 'Frame Unlocked', `Season Reward: ${frameDef.name}`));
          }
        }

        // 4. Stat Bonus (for S Rank usually)
        if (reward.statBonus) {
          (Object.keys(reward.statBonus) as StatType[]).forEach(stat => {
            const val = reward.statBonus![stat.toLowerCase() as keyof UserStats] as number;
            if (val) {
              const statKey = stat.toLowerCase() as keyof UserStats;
              (newStats[statKey] as number) += val;
              logs.unshift(createLog('System', 'Stat Bonus', `${stat} +${val} from Season Reward`));
            }
          });
        }

        // 5. Mark as claimed
        nextState.currentSeason = {
          ...nextState.currentSeason!,
          claimedRewards: [...nextState.currentSeason!.claimedRewards, tier]
        };

        nextState.stats = newStats;
        nextState.logs = logs;

        return recomputeTitlesAndFrames(nextState);
      });
    },

    // U24.1 Settings Actions
    updateSettings: (partial) => setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...partial }
    })),

    resetAll: () => setState(prev => ({
      ...INITIAL_STATE,
      settings: prev.settings // Preserve settings on reset
    })),

    // U26
    addRecommendedMission,

    // U27: Dungeons System
    startDungeonRun: (dungeonId: string) => {
      const dungeon = DUNGEONS.find(d => d.id === dungeonId);
      if (!dungeon) return null;

      // 1. Generate Boss
      const boss = generateBoss(dungeon, state.stats);

      // 2. Simulate Battle
      const userTotalStats = Object.values(state.stats).reduce((a: number, b) => typeof b === 'number' ? a + (b as number) : a, 0);
      const userPower = userTotalStats + state.stats.level * 5; // Simple power formula

      // Luck factor
      const luckRoll = Math.random() * (state.stats.fortune * 0.5);
      const finalUserPower = userPower + luckRoll;

      const victory = finalUserPower >= boss.powerLevel;

      // 3. Calculate Rewards
      const result = calculateDungeonRewards(dungeon, victory);

      // 4. Apply Results
      const runResult: DungeonRunResult = {
        id: `run_${Date.now()}`,
        dungeonId,
        bossId: boss.id,
        victory,
        timestamp: new Date().toISOString(),
        xpEarned: result.xp,
        rewards: result.rewards
      };

      setState(prev => {
        // Apply XP
        const { level, xp, leveledUp } = calculateLevel(prev.stats.level, prev.stats.xpCurrent + result.xp);

        // Add to history
        const newRuns = [...(prev.dungeonRuns || []), runResult];

        // Log entry
        const logEntry: LogEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          category: 'System',
          message: victory ? 'Dungeon Cleared' : 'Dungeon Failed',
          details: `${victory ? 'Defeated' : 'Lost to'} ${boss.name} in ${dungeon.name}. Rewards: ${result.xp} XP.`,
          xpChange: result.xp
        };

        let nextState = {
          ...prev,
          dungeonRuns: newRuns,
          logs: [logEntry, ...prev.logs]
        };

        let newStats = { ...nextState.stats };
        newStats.level = level;
        newStats.xpCurrent = xp;

        if (leveledUp) {
          // Stat growth on level up
          newStats.strength += 1;
          newStats.vitality += 1;
          newStats.agility += 1;
          newStats.intelligence += 1;
          newStats.fortune += 1;
          newStats.metabolism += 1;

          nextState.justLeveledUp = true;
          nextState.logs.unshift(createLog('LevelUp', `LEVEL UP – ${level}`, 'Your power grows.', { levelChange: { from: prev.stats.level, to: level } }));
        }

        nextState.stats = newStats;
        return nextState;
      });

      return { result: runResult, boss };
    },

    // U24.2
    redeemCode
  };
};

// Expose for verification
if (typeof window !== 'undefined') {
  (window as any).useStore = useStore;
}