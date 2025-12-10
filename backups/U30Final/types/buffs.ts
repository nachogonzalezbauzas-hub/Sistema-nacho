import { StatType } from './core';

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
