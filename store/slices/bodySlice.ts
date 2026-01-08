import { StateCreator } from 'zustand';
import { AppState, BodyRecord, BuffId, ActiveBuff, StatType } from '@/types';
import { createLog } from '@/store/utils';
import { BUFF_DEFINITIONS, PASSIVE_DEFINITIONS } from '@/data/buffs';
import type { GameStore } from '@/store/useStore';
import { v4 as uuidv4 } from 'uuid';

// Helper for health score
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

export interface BodySlice {
    addBodyRecord: (recordInput: Omit<BodyRecord, 'id' | 'date'>) => void;
    applyBuff: (id: BuffId) => void;
    cleanupExpiredBuffs: () => void;
    getActiveBuffDefinitions: () => any[]; // Should be BuffDefinition[]
    getCurrentXpMultiplier: () => number;
    getPassiveEffectiveBonuses: () => Partial<Record<StatType, number>>;
    upgradePassive: (id: string) => void;
}

export const createBodySlice: StateCreator<GameStore, [], [], BodySlice> = (set, get) => ({
    addBodyRecord: (recordInput) => {
        set((store) => {
            const prev = store.state;
            const previousRecord = prev.bodyRecords.length > 0
                ? [...prev.bodyRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                : undefined;

            const healthScore = calculateHealthScore(recordInput, previousRecord);

            let weightDelta = 0;
            if (previousRecord) weightDelta = recordInput.weight - previousRecord.weight;

            const sleepDelta = recordInput.sleepHours - 7;

            const newRecord: BodyRecord = {
                ...recordInput,
                id: uuidv4(),
                date: new Date().toISOString(),
                healthScore,
                weightDelta,
                sleepDelta
            };

            const updatedRecords = [newRecord, ...prev.bodyRecords];
            // Recompute summary logic omitted for brevity, should be imported or re-implemented
            // const newSummary = recomputeHealthSummary(updatedRecords);

            const logs = [...prev.logs];
            const log = createLog('Salud', 'Estado de Salud Actualizado', `Peso: ${recordInput.weight}kg, Sueño: ${recordInput.sleepHours}h, Puntuación: ${healthScore}`);
            logs.unshift(log);

            let newStats = { ...prev.stats };
            // Health bonus logic omitted for brevity

            return {
                state: {
                    ...prev,
                    bodyRecords: updatedRecords,
                    // healthSummary: newSummary,
                    stats: newStats,
                    logs: logs
                }
            };
        });
    },

    applyBuff: (id) => {
        const def = BUFF_DEFINITIONS.find(b => b.id === id);
        if (!def) return;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + def.durationMinutes * 60000).toISOString();

        set((store) => {
            const others = store.state.activeBuffs.filter(b => b.id !== id);
            const newBuff: ActiveBuff = { id, startedAt: now.toISOString(), expiresAt };
            const log = createLog('Sistema', 'Bufo Aplicado', `Activado: ${def.name}`);
            return {
                state: {
                    ...store.state,
                    activeBuffs: [...others, newBuff],
                    logs: [log, ...store.state.logs]
                }
            };
        });
    },

    cleanupExpiredBuffs: () => {
        const now = new Date();
        set((store) => {
            const validBuffs = store.state.activeBuffs.filter(b => new Date(b.expiresAt) > now);
            if (validBuffs.length !== store.state.activeBuffs.length) {
                return {
                    state: {
                        ...store.state,
                        activeBuffs: validBuffs,
                        lastBuffCleanupAt: now.toISOString()
                    }
                };
            }
            return {};
        });
    },

    getActiveBuffDefinitions: () => {
        const now = new Date();
        return get().state.activeBuffs
            .filter(b => new Date(b.expiresAt) > now)
            .map(b => BUFF_DEFINITIONS.find(def => def.id === b.id)!)
            .filter(Boolean);
    },

    getCurrentXpMultiplier: () => {
        const now = new Date();
        const activeDefs = get().state.activeBuffs
            .filter(b => new Date(b.expiresAt) > now)
            .map(b => BUFF_DEFINITIONS.find(def => def.id === b.id)!)
            .filter(Boolean);
        return activeDefs.reduce((acc, def) => acc * (def.xpMultiplier || 1), 1);
    },

    getPassiveEffectiveBonuses: () => {
        const bonuses: Partial<Record<StatType, number>> = {};
        Object.entries(get().state.passiveLevels).forEach(([id, level]) => {
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
    },

    upgradePassive: (id) => {
        set((store) => {
            const prev = store.state;
            const def = PASSIVE_DEFINITIONS.find(p => p.id === id);
            if (!def) return {};

            const currentLevel = prev.passiveLevels[id] || 0;

            // Check max level
            if (currentLevel >= def.maxLevel) return {};

            // Check cost
            if (prev.passivePoints < def.costPerLevel) return {};

            return {
                state: {
                    ...prev,
                    passivePoints: prev.passivePoints - def.costPerLevel,
                    passiveLevels: { ...prev.passiveLevels, [id]: currentLevel + 1 }
                }
            };
        });
    }
});

