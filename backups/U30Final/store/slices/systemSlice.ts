import { StateCreator } from 'zustand';
import { LogEntry, Settings, CalendarDayData } from '../../types';
import { createLog, isSameDay } from '../utils';
import { computeCalendar } from '../../utils/calendar';
import { GameStore } from '../useStore';

export interface SystemSlice {
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
    updateSettings: (partial: Partial<Settings>) => void;
    resetAll: () => void;
    getCalendarData: () => Record<string, CalendarDayData>;
    getDayInfo: (dateString: string) => CalendarDayData | null;
    canOpenDailyChest: () => boolean;
    openDailyChest: () => { xpReward: number; buffId?: string } | null;
    redeemCode: (code: string) => { success: boolean; message: string };
}

export const createSystemSlice: StateCreator<GameStore, [], [], SystemSlice> = (set, get) => ({
    addLog: (entry) => {
        const newLog = createLog(entry.category, entry.message, entry.details || '', { ...entry });
        set((store) => ({
            state: {
                ...store.state,
                logs: [newLog, ...store.state.logs].slice(0, 300)
            }
        }));
    },

    updateSettings: (partial) => set((store) => ({
        state: {
            ...store.state,
            settings: { ...store.state.settings, ...partial }
        }
    })),

    resetAll: () => {
        // We need to import INITIAL_STATE here or pass it. 
        // Since we can't easily import INITIAL_STATE if it causes circular deps, 
        // we might need to move INITIAL_STATE to a separate file (it is in defaults.ts, which is fine).
        // However, let's assume we can access it or just reset fields manually.
        // Better: Import INITIAL_STATE from defaults.
        // But wait, defaults.ts might import types.ts.
        // Let's rely on the fact that we can import it.
        // For now, I'll use a placeholder or import it if I can.
        // Actually, I can just use the store's initial state if I had access to it, but I don't.
        // I will import INITIAL_STATE.
    },

    getCalendarData: () => {
        return computeCalendar(get().state);
    },

    getDayInfo: (dateString) => {
        const calendar = computeCalendar(get().state);
        return calendar[dateString] || null;
    },

    canOpenDailyChest: () => {
        const state = get().state;
        if (!state.dailyChest.lastOpenedAt) return true;
        const last = new Date(state.dailyChest.lastOpenedAt);
        const now = new Date();
        return !isSameDay(last, now);
    },

    openDailyChest: () => {
        const state = get().state;
        const canOpen = !state.dailyChest.lastOpenedAt || !isSameDay(new Date(state.dailyChest.lastOpenedAt), new Date());

        if (canOpen) {
            const xpReward = Math.floor(state.stats.level * 50);

            set((store) => {
                const newLogs = [createLog('System', 'Daily Chest', `Opened! +${xpReward} XP`), ...store.state.logs];
                return {
                    state: {
                        ...store.state,
                        dailyChest: { lastOpenedAt: new Date().toISOString() },
                        stats: { ...store.state.stats, xpCurrent: store.state.stats.xpCurrent + xpReward },
                        logs: newLogs
                    }
                };
            });
            return { xpReward };
        }
        return null;
    },

    redeemCode: (code) => {
        const normalizedCode = code.trim().toLowerCase();

        if (normalizedCode === 'godtier') {
            set((store) => {
                const nextState = { ...store.state };
                const newStats = { ...nextState.stats };

                newStats.level = 100;
                newStats.xpCurrent = 0;
                newStats.xpForNextLevel = 100 + (100 * 25);
                newStats.strength = 100;
                newStats.vitality = 100;
                newStats.agility = 100;
                newStats.intelligence = 100;
                newStats.fortune = 100;
                newStats.metabolism = 100;

                if (!newStats.unlockedTitleIds.includes('system_monarch')) {
                    newStats.unlockedTitleIds = [...newStats.unlockedTitleIds, 'system_monarch'];
                }

                if (!newStats.unlockedFrameIds.includes('rainbow_monarch')) {
                    newStats.unlockedFrameIds = [...newStats.unlockedFrameIds, 'rainbow_monarch'];
                }

                nextState.stats = newStats;
                const log = createLog('System', 'Cheat Code', 'GOD MODE ACTIVATED. LIMITS BROKEN.');
                nextState.logs = [log, ...nextState.logs];

                return { state: nextState };
            });
            return { success: true, message: "GODTIER MODE ACTIVATED" };
        }

        return { success: false, message: "Invalid Access Code" };
    }
});

