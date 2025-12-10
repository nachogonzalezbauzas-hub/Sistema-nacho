import { StateCreator } from 'zustand';
import { LogEntry, Settings, CalendarDayData } from '@/types';
import { createLog, isSameDay } from '@/store/utils';
import { computeCalendar } from '@/utils/calendar';
import { GameStore } from '@/store/useStore';
import { INITIAL_STATE } from '@/store/defaults';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { SHOP_TITLES, SHOP_FRAMES } from '@/data/shopCosmetics';
import { generateSetEquipment } from '@/data/equipmentGenerator';
import { ALL_DUNGEONS } from '@/dungeons/dungeonGenerator';
import { Shadow } from '@/types';

export interface SystemSlice {
    addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
    updateSettings: (partial: Partial<Settings>) => void;
    resetAll: () => void;
    getCalendarData: () => Record<string, CalendarDayData>;
    getDayInfo: (dateString: string) => CalendarDayData | null;
    canOpenDailyChest: () => boolean;
    openDailyChest: () => { xpReward: number; buffId?: string } | null;
    redeemCode: (code: string) => { success: boolean; message: string };
    setLanguage: (lang: 'en' | 'es') => void;
}

export const createSystemSlice: StateCreator<GameStore, [], [], SystemSlice> = (set, get) => ({
    setLanguage: (lang) => set((store) => ({
        state: {
            ...store.state,
            settings: { ...store.state.settings, language: lang }
        }
    })),
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
        // Clear localStorage first
        localStorage.removeItem('sistema_nacho_data');

        // Reset state to initial values
        set(() => ({
            state: { ...INITIAL_STATE }
        }));

        // Force a page reload to ensure everything is fresh
        window.location.reload();
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

        // UNLOCK ALL - Unlock everything in the app
        if (normalizedCode === 'unlockall') {
            set((store) => {
                const nextState = { ...store.state };
                const newStats = { ...nextState.stats };

                // Max all stats
                newStats.level = 100;
                newStats.xpCurrent = 0;
                newStats.xpForNextLevel = 100 + (100 * 25);
                newStats.strength = 100;
                newStats.vitality = 100;
                newStats.agility = 100;
                newStats.intelligence = 100;
                newStats.fortune = 100;
                newStats.metabolism = 100;

                // Set to final job class
                newStats.jobClass = 'Shadow Monarch';

                // Unlock ALL titles (Base + Shop)
                const allTitleIds = [
                    ...TITLES.map(t => t.id),
                    ...SHOP_TITLES.map(t => t.id)
                ];
                // Remove duplicates just in case
                newStats.unlockedTitleIds = Array.from(new Set(allTitleIds)) as any;

                // Unlock ALL frames (Base + Shop)
                const allFrameIds = [
                    ...AVATAR_FRAMES.map(f => f.id),
                    ...SHOP_FRAMES.map(f => f.id)
                ];
                newStats.unlockedFrameIds = Array.from(new Set(allFrameIds)) as any;

                // Set season to SSS
                nextState.currentSeason = {
                    seasonId: 'season_1',
                    seasonXP: 999999,
                    rank: 'SSS',
                    claimedRewards: ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'] as any,
                    isFinished: false
                };

                // 1 Million QP and Shards
                nextState.questPoints = 1000000;
                nextState.shards = 1000000;

                // Add Shadow Monarch Equipment Set
                const setEquipment = generateSetEquipment();
                // Add to inventory (allow duplicates if user wants to dual wield or whatever, but maybe filter unique IDs if they collide?)
                // generateSetEquipment returns new IDs usually.
                nextState.inventory = [...nextState.inventory, ...setEquipment];

                // Unlock All Shadows (Max Evolution)
                const allShadows: Shadow[] = [];
                ALL_DUNGEONS.forEach(dungeon => {
                    if (dungeon.boss && dungeon.boss.shadowData) {
                        const shadowData = dungeon.boss.shadowData;
                        const newShadow: Shadow = {
                            id: crypto.randomUUID(),
                            name: shadowData.name,
                            rank: shadowData.rank,
                            image: shadowData.image,
                            bonus: {
                                ...shadowData.bonus,
                                value: shadowData.bonus.value + 10 // Max evolution bonus
                            },
                            isEquipped: false,
                            extractedAt: new Date().toISOString(),
                            evolutionLevel: 2, // Marshal
                            experiencePoints: 999999,
                            xpToNextEvolution: Infinity
                        };
                        allShadows.push(newShadow);
                    }
                });
                nextState.shadows = allShadows;

                nextState.stats = newStats;
                const log = createLog('System', 'Cheat Code', 'ALL CONTENT UNLOCKED. SEASON SSS. 1M QP & SHARDS. FULL GEAR & SHADOWS.');
                nextState.logs = [log, ...nextState.logs];

                return { state: nextState };
            });
            return { success: true, message: "EVERYTHING UNLOCKED! Season SSS, 1M QP, 1M Shards, Full Gear, All Shadows." };
        }

        return { success: false, message: "Invalid Access Code" };
    }
});

