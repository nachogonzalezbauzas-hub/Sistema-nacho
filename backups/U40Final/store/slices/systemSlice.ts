import { StateCreator } from 'zustand';
import { LogEntry, Settings, CalendarDayData } from '../../types';
import { createLog, isSameDay } from '../utils';
import { computeCalendar } from '../../utils/calendar';
import { GameStore } from '../useStore';
import { INITIAL_STATE } from '../defaults';

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

                // Unlock ALL titles (complete list including shop)
                const allTitleIds = [
                    // Base titles
                    'disciplined', 'daily_stepper', 'first_blood', 'body_tracker', 'pen_on_paper',
                    'iron_will', 'routine_keeper', 'shadow_breaker', 'speed_walker', 'arcane_mind',
                    'fortune_seeker', 'inner_flame', 'season_rookie', 'monarch_candidate', 'balanced_soul',
                    'mind_over_matter', 'early_grinder', 'season_challenger', 'season_raider',
                    's_rank_hunter', 'tycoon', 'goblin_slayer', 'bug_squasher', 'survivor', 'orc_conqueror',
                    'ant_king_slayer', 'god_slayer', 'hyper_focus', 'unstoppable', 'season_vanguard',
                    'season_monarch', 'gym_apostle', 'weight_breaker', 'overlord', 'season_legend',
                    'full_sync', 'perfect_cycle', 'shadow_rider', 'highway_monarch', 'iron_will_master',
                    'six_path_ascetic', 'mind_king', 'system_tycoon', 'season_conqueror',
                    'national_level', 'monarch_of_shadows', 'system_monarch', 'eternal_streak',
                    'demon_hunter', 'necromancer', 'shadow_monarch',
                    // Shop titles
                    'shop_apprentice', 'shop_swift_shadow', 'shop_iron_guardian', 'shop_blade_dancer',
                    'shop_night_walker', 'shop_elite_hunter', 'shop_arcane_master', 'shop_demon_king',
                    'shop_thunder_god', 'shop_soul_reaper', 'shop_blood_lord', 'shop_frost_emperor',
                    'shop_storm_bringer', 'shop_phoenix_risen', 'shop_shadow_king', 'shop_eternal_warrior',
                    'shop_dragon_lord', 'shop_titan_slayer', 'shop_celestial_being', 'shop_void_emperor'
                ];
                newStats.unlockedTitleIds = allTitleIds as any;

                // Unlock ALL frames (complete list including shop)
                const allFrameIds = [
                    // Base frames
                    'default', 'lightning', 'arcane', 'inferno', 'shadow', 'royal',
                    'storm_rider', 'inner_flame_frame', 'golden_fortune', 'monarch_crest',
                    'season_crest', 'season_monarch', 'blue_flame', 'golden_glory', 'monarch_aura',
                    'goblin_frame', 'insect_carapace', 'red_gate_frost', 'orc_tusk',
                    'ant_king_crown', 'god_statue_aura', 'rainbow_monarch', 'eternal_chain',
                    // Shop frames
                    'shop_basic_glow', 'shop_swift_wind', 'shop_iron_shield', 'shop_blade_edge',
                    'shop_night_mist', 'shop_elite_badge', 'shop_arcane_runes', 'shop_demon_horns',
                    'shop_storm_cyclone', 'shop_soul_chains', 'shop_blood_moon', 'shop_frost_crystal',
                    'shop_thunder_strike', 'shop_phoenix_flames', 'shop_shadow_vortex',
                    'shop_aurora_borealis', 'shop_infernal_blaze', 'shop_dragon_aura',
                    'shop_divine_light', 'shop_cosmic_void'
                ];
                newStats.unlockedFrameIds = allFrameIds as any;

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

                nextState.stats = newStats;
                const log = createLog('System', 'Cheat Code', 'ALL CONTENT UNLOCKED. SEASON SSS. 1M QP & SHARDS. MAXIMUM POWER.');
                nextState.logs = [log, ...nextState.logs];

                return { state: nextState };
            });
            return { success: true, message: "EVERYTHING UNLOCKED! Season SSS, 1M QP, 1M Shards. You are the Shadow Monarch." };
        }

        return { success: false, message: "Invalid Access Code" };
    }
});

