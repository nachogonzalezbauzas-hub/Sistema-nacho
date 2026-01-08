import { StatType } from './core';
import { Buff, PassiveId } from './buffs';
import { TitleId, AvatarFrameId, Equipment } from './items';

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

export interface UserStats {
    level: number;
    jobClass: 'None' | 'Warrior' | 'Swift Runner' | 'Guardian' | 'Scholar' | 'Vitalist' | 'Fortune Seeker' | 'Balanced Master' | 'Shadow Lord' | 'Shadow Monarch';
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
    customTitles?: import('./items').Title[]; // Store procedural titles

    selectedFrameId: AvatarFrameId;
    unlockedFrameIds: AvatarFrameId[];
    customFrames?: import('./items').AvatarFrame[]; // Store procedural frames

    // U50 - Pets
    pets: import('./pets').Pet[];
    activePetId: string | null;

    // U54 - Profile
    name: string;
}

// --- LOGS ---
export type LogCategory =
    | "Mission"
    | "LevelUp"
    | "Health"
    | "Streak"
    | "Achievement"
    | "Milestone"
    | "System"
    | "Misión"
    | "Subida de Nivel"
    | "Racha"
    | "Logro"
    | "Hito"
    | "Sistema"
    | "Salud";

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

// --- HEALTH ---
export interface BodyRecord {
    id: string;
    date: string;
    weight: number;
    sleepHours: number;
    notes: string;
    healthScore?: number;
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

// --- SETTINGS ---
export interface Settings {
    musicEnabled: boolean;
    sfxEnabled: boolean;
    theme: 'dark' | 'light';
    language: 'en' | 'es';
    performanceMode?: boolean;
}

// --- ACTIVITY ---
export interface DailyActivityScore {
    missionsCompleted: number;
    xpGained: number;
    healthScore?: number;
}
