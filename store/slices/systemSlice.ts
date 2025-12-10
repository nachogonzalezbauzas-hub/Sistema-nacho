import { StateCreator } from 'zustand';
import { LogEntry, Settings, CalendarDayData } from '@/types';
import { createLog, isSameDay } from '@/store/utils';
import { computeCalendar } from '@/utils/calendar';
import { GameStore } from '@/store/useStore';
import { INITIAL_STATE } from '@/store/defaults';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { STATIC_TITLES, STATIC_FRAMES } from '@/data/staticCosmetics';
import { generateSetEquipment } from '@/data/equipmentGenerator';
import { ALL_DUNGEONS } from '@/dungeons/dungeonGenerator';
import { Shadow } from '@/types';
import { v4 as uuidv4 } from 'uuid';
// generator import removed
import { getZoneCosmeticDrop } from '@/data/staticCosmetics';

const SHOP_TITLES = STATIC_TITLES.filter(t => t.sourceType === 'shop');
const SHOP_FRAMES = STATIC_FRAMES.filter(f => f.sourceType === 'shop');

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
    queueReward: (reward: import('@/types').RewardItem) => void;
    checkDailyShopRefresh: () => void;
}

export const createSystemSlice: StateCreator<GameStore, [], [], SystemSlice> = (set, get) => ({
    checkDailyShopRefresh: () => {
        const state = get().state;
        const now = new Date();
        const currentDateString = now.toISOString().split('T')[0];

        // If today is different from last rotation date
        if (state.dailyShop.date !== currentDateString) {
            // Get player's unlocked rarities (default to basic if not set)
            const unlockedRarities = state.zone?.unlockedRarities || ['common', 'uncommon', 'rare', 'epic', 'legendary'];

            // Filter shop items to only include those matching unlocked rarities
            const availableTitles = SHOP_TITLES.filter(t => unlockedRarities.includes(t.rarity));
            const availableFrames = SHOP_FRAMES.filter(f => unlockedRarities.includes(f.rarity));

            // Randomly select 3 titles from available ones
            const shuffledTitles = [...availableTitles].sort(() => 0.5 - Math.random());
            const selectedTitles = shuffledTitles.slice(0, 3).map(t => t.id);

            // Randomly select 3 frames from available ones
            const shuffledFrames = [...availableFrames].sort(() => 0.5 - Math.random());
            const selectedFrames = shuffledFrames.slice(0, 3).map(f => f.id);

            set((store) => ({
                state: {
                    ...store.state,
                    dailyShop: {
                        date: currentDateString,
                        titleIds: selectedTitles,
                        frameIds: selectedFrames
                    }
                }
            }));

            // Log the refresh
            get().addLog({
                category: 'Sistema',
                message: 'Tienda Actualizada',
                details: '¡Nuevos objetos disponibles en la tienda de hoy!'
            });
        }
    },
    queueReward: (reward) => set((store) => ({
        state: {
            ...store.state,
            rewardQueue: [...(store.state.rewardQueue || []), reward]
        }
    })),
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
        // Clear all localStorage data
        localStorage.removeItem('sistema_nacho_data');        // Main state
        localStorage.removeItem('sistema_nacho_achievements'); // Achievements/Records

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
            let buffId: string | undefined;

            // Logic for Daily Chest Title Drop (5% Chance)
            let dailyTitle: import('@/types').Title | undefined;
            if (Math.random() < 0.05) {
                const estimatedZone = Math.max(1, Math.ceil(state.stats.level / 20));
                const drop = getZoneCosmeticDrop(estimatedZone, 'daily');

                if (drop && drop.type === 'title') {
                    dailyTitle = { ...drop.item, icon: '🎁' } as any;
                }
            }

            set((store) => {
                const logs = [...store.state.logs];
                logs.unshift(createLog('Sistema', 'Cofre Diario', `¡Abierto! +${xpReward} XP`));

                let nextStats = {
                    ...store.state.stats,
                    xpCurrent: store.state.stats.xpCurrent + xpReward
                };

                let newRewardQueue = [...(store.state.rewardQueue || [])];

                if (dailyTitle) {
                    // Check duplicates
                    if (!nextStats.unlockedTitleIds.includes(dailyTitle.id)) {
                        nextStats.customTitles = [...(nextStats.customTitles || []), dailyTitle];
                        nextStats.unlockedTitleIds.push(dailyTitle.id);
                        logs.unshift(createLog('Sistema', 'Suerte Diaria', `Has encontrado un título especial: ${dailyTitle.name}!`));

                        newRewardQueue.push({
                            id: `daily_title_${dailyTitle.id}_${Date.now()}`,
                            type: 'title',
                            name: dailyTitle.name,
                            description: "Encontrado en un Cofre Diario.",
                            icon: '🎁',
                            rarity: dailyTitle.rarity
                        });
                    }
                }

                return {
                    state: {
                        ...store.state,
                        dailyChest: { lastOpenedAt: new Date().toISOString() },
                        stats: nextStats,
                        logs: logs,
                        rewardQueue: newRewardQueue
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
                const log = createLog('Sistema', 'Código Secreto', 'MODO DIOS ACTIVADO. LÍMITES ROTOS.');
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
                            id: uuidv4(),
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
                const log = createLog('Sistema', 'Código Secreto', 'TODO DESBLOQUEADO. TEMPORADA SSS. 1M QP & FRAGMENTOS. EQUIPO COMPLETO & SOMBRAS.');
                nextState.logs = [log, ...nextState.logs];

                return { state: nextState };
            });
            return { success: true, message: "EVERYTHING UNLOCKED! Season SSS, 1M QP, 1M Shards, Full Gear, All Shadows." };
        }

        return { success: false, message: "Invalid Access Code" };
    }
});

