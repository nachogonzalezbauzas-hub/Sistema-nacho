import { StateCreator } from 'zustand';
import { AppState, UserStats, TitleId, AvatarFrameId, EffectiveStats, Title } from '@/types';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { createLog } from '@/store/utils';
import { GameStore } from '@/store/useStore';
import { calculateLevel } from '@/utils/progression';

export interface UserSlice {
    setLevelUp: (value: boolean) => void;
    setTitleModalClosed: () => void;
    equipTitle: (titleId: TitleId | null) => void;
    equipFrame: (frameId: AvatarFrameId) => void;
    unlockFrame: (id: AvatarFrameId) => void;
    selectFrame: (id: AvatarFrameId) => void;
    getEffectiveStats: () => EffectiveStats;
    updateLevelIfNeeded: (currentStats: UserStats) => { stats: UserStats, leveledUp: boolean };
    checkAchievements: () => void;
    setJobClass: (jobClass: string) => void;
    importProceduralTitle: (title: Title) => void;
    importProceduralFrame: (frame: import('../../types').AvatarFrame) => void;
    debugSetStats: (stats: Partial<UserStats>) => void;
    debugResetTitles: () => void;
    debugAddReward: () => void;
}

export const createUserSlice: StateCreator<GameStore, [], [], UserSlice> = (set, get) => ({

    debugSetStats: (newStats) => {
        set((store) => ({
            state: {
                ...store.state,
                stats: { ...store.state.stats, ...newStats }
            }
        }));
    },

    debugResetTitles: () => {
        set((store) => ({
            state: {
                ...store.state,
                stats: { ...store.state.stats, unlockedTitleIds: [] }
            }
        }));
    },

    debugAddReward: () => {
        set((store) => ({
            state: {
                ...store.state,
                rewardQueue: [
                    ...(store.state.rewardQueue || []),
                    {
                        id: `debug_reward_${Date.now()}`,
                        type: 'title',
                        name: 'Debug Title',
                        description: 'This is a test reward to verify the overlay.',
                        icon: '🧪',
                        rarity: 'legendary'
                    }
                ]
            }
        }));
    },

    setLevelUp: (value) => set((store) => ({ state: { ...store.state, justLeveledUp: value } })),

    setTitleModalClosed: () => set((store) => ({ state: { ...store.state, justUnlockedTitle: null } })),

    equipTitle: (titleId) => {
        set((store) => {
            if (titleId && !store.state.stats.unlockedTitleIds.includes(titleId)) return {};
            const log = createLog('Sistema', 'Título Equipado', `Título equipado: ${titleId}`);
            return {
                state: {
                    ...store.state,
                    stats: { ...store.state.stats, equippedTitleId: titleId },
                    logs: [log, ...store.state.logs]
                }
            };
        });
    },

    equipFrame: (frameId) => {
        set((store) => {
            if (!store.state.stats.unlockedFrameIds.includes(frameId)) return {};
            return {
                state: {
                    ...store.state,
                    stats: { ...store.state.stats, selectedFrameId: frameId }
                }
            };
        });
    },

    unlockFrame: (id) => {
        set((store) => ({ state: recomputeTitlesAndFrames(store.state) }));
    },

    selectFrame: (id) => {
        set((store) => {
            if (!store.state.stats.unlockedFrameIds.includes(id)) return {};
            return {
                state: {
                    ...store.state,
                    stats: { ...store.state.stats, selectedFrameId: id }
                }
            };
        });
    },

    getEffectiveStats: () => {
        const state = get().state;
        const base = state.stats;

        // Start with base stats
        const effective = {
            strength: base.strength,
            vitality: base.vitality,
            agility: base.agility,
            intelligence: base.intelligence,
            fortune: base.fortune,
            metabolism: base.metabolism,
            dailyGains: base.dailyGains
        };

        // Helper to add stat bonus
        const addBonus = (stat: string, value: number) => {
            const statKey = stat.toLowerCase() as keyof typeof effective;
            if (statKey in effective && typeof effective[statKey] === 'number') {
                (effective as any)[statKey] += value;
            }
        };

        // 1. Add bonuses from equipped items
        const equippedItems = state.inventory?.filter(item => item.isEquipped) || [];
        equippedItems.forEach(item => {
            item.baseStats?.forEach(statBonus => {
                addBonus(statBonus.stat, statBonus.value);
            });
        });

        // 2. Add bonuses from equipped shadow
        if (state.equippedShadowId) {
            const shadow = state.shadows?.find(s => s.id === state.equippedShadowId);
            if (shadow?.bonus) {
                addBonus(shadow.bonus.stat, shadow.bonus.value);
            }
        }

        // 3. Add bonuses from passive levels (using inline calculation to avoid circular deps)
        if (state.passiveLevels) {
            // Import would cause circular dep, so we use dynamic require pattern or inline
            const PASSIVE_DEFS = [
                { id: 'iron_muscle', stat: 'Strength', perLevel: 2 },
                { id: 'phoenix_body', stat: 'Vitality', perLevel: 2 },
                { id: 'quick_feet', stat: 'Agility', perLevel: 2 },
                { id: 'sharp_mind', stat: 'Intelligence', perLevel: 2 },
                { id: 'lucky_instinct', stat: 'Fortune', perLevel: 2 },
                { id: 'inner_engine', stat: 'Metabolism', perLevel: 2 }
            ];
            Object.entries(state.passiveLevels).forEach(([id, level]) => {
                const def = PASSIVE_DEFS.find(p => p.id === id);
                const lvl = Number(level);
                if (def && lvl > 0) {
                    addBonus(def.stat, def.perLevel * lvl);
                }
            });
        }

        // 4. Add bonuses from active buffs (temporary)
        if (state.activeBuffs) {
            const now = new Date();
            const BUFF_DEFS: Record<string, Record<string, number>> = {
                'coffee_focus': { Intelligence: 5 },
                'gym_boost': { Strength: 5, Vitality: 3 },
                'social_charm': { Agility: 3, Fortune: 2 },
                'inner_flame_boost': { Metabolism: 10 },
                'well_rested': { Strength: 10, Vitality: 10, Agility: 10, Intelligence: 10, Fortune: 10, Metabolism: 10 }
            };
            state.activeBuffs
                .filter(b => new Date(b.expiresAt) > now)
                .forEach(b => {
                    const modifiers = BUFF_DEFS[b.id];
                    if (modifiers) {
                        Object.entries(modifiers).forEach(([stat, val]) => addBonus(stat, val));
                    }
                });
        }

        // 5. Add bonuses from season rank (if reached)
        if (state.currentSeason) {
            const SEASON_BONUSES: Record<string, Record<string, number>> = {
                'S': { strength: 5, agility: 5 },
                'SS': { strength: 10, agility: 10 },
                'SSS': { strength: 20, agility: 20, vitality: 20 }
            };
            const rank = state.currentSeason.rank;
            const bonuses = SEASON_BONUSES[rank];
            if (bonuses) {
                Object.entries(bonuses).forEach(([stat, val]) => addBonus(stat, val));
            }
        }

        return effective;
    },

    updateLevelIfNeeded: (currentStats) => {
        const { level, xp, leveledUp, xpForNextLevel } = calculateLevel(currentStats.level, currentStats.xpCurrent);
        let newStats = { ...currentStats, level, xpCurrent: xp, xpForNextLevel };
        return { stats: newStats, leveledUp };
    },

    checkAchievements: () => {
        set((store) => ({ state: recomputeTitlesAndFrames(store.state) }));
    },

    setJobClass: (jobClass) => {
        set((store) => {
            const log = createLog('Sistema', 'Cambio de Clase', `Despertado como: ${jobClass}`);
            return {
                state: {
                    ...store.state,
                    stats: { ...store.state.stats, jobClass: jobClass as UserStats['jobClass'] },
                    logs: [log, ...store.state.logs],
                    rewardQueue: [
                        ...store.state.rewardQueue,
                        {
                            id: `job_${jobClass}_${Date.now()}`,
                            type: 'title' as const,
                            name: `Clase: ${jobClass}`,
                            description: `¡Has despertado como ${jobClass}!`,
                            icon: '⚔️',
                            rarity: 'legendary' as const
                        }
                    ]
                }
            };
        });
    },

    importProceduralTitle: (title) => {
        set((store) => {
            // Avoid duplicates
            if (store.state.stats.unlockedTitleIds.includes(title.id)) return {};

            const log = createLog('Sistema', 'Título Importado', `Título procedural importado: ${title.name}`);
            const newCustomTitles = [...(store.state.stats.customTitles || []), title];
            const newUnlockedIds = [...store.state.stats.unlockedTitleIds, title.id];

            return {
                state: {
                    ...store.state,
                    stats: {
                        ...store.state.stats,
                        customTitles: newCustomTitles,
                        unlockedTitleIds: newUnlockedIds
                    },
                    logs: [log, ...store.state.logs]
                }
            };
        });
    },

    importProceduralFrame: (frame) => {
        set((store) => {
            // Avoid duplicates
            if (store.state.stats.unlockedFrameIds.includes(frame.id)) return {};

            const log = createLog('Sistema', 'Marco Importado', `Marco procedural importado: ${frame.name}`);
            const newCustomFrames = [...(store.state.stats.customFrames || []), frame];
            const newUnlockedIds = [...store.state.stats.unlockedFrameIds, frame.id];

            return {
                state: {
                    ...store.state,
                    stats: {
                        ...store.state.stats,
                        customFrames: newCustomFrames,
                        unlockedFrameIds: newUnlockedIds
                    },
                    logs: [log, ...store.state.logs]
                }
            };
        });
    }
});

export const recomputeTitlesAndFrames = (currentState: AppState): AppState => {
    let nextState = { ...currentState, stats: { ...currentState.stats } };
    let hasChanges = false;
    let newlyUnlockedTitle: Title | null = null;

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

    if (newlyUnlockedTitle && !currentState.justUnlockedTitle) {
        nextState.justUnlockedTitle = newlyUnlockedTitle;
        hasChanges = true;
        const log = createLog('Logro', 'Título Desbloqueado', `Has desbloqueado: ${newlyUnlockedTitle.name}`);
        nextState.logs = [log, ...nextState.logs];

        // Add Title Reward to Queue
        if (!nextState.rewardQueue) nextState.rewardQueue = [];
        nextState.rewardQueue = [...nextState.rewardQueue, {
            id: `title_${newlyUnlockedTitle.id}_${Date.now()}`,
            type: 'title',
            name: newlyUnlockedTitle.name,
            description: newlyUnlockedTitle.description,
            icon: newlyUnlockedTitle.icon,
            rarity: newlyUnlockedTitle.rarity
        }];
    }

    // Check for new frames
    const unlockedFrames = AVATAR_FRAMES.filter(f => f.condition(nextState));
    const newFrameIds = unlockedFrames.map(f => f.id);
    const combinedFrameIds = Array.from(new Set([...nextState.stats.unlockedFrameIds, ...newFrameIds, 'default' as AvatarFrameId]));

    if (combinedFrameIds.length !== nextState.stats.unlockedFrameIds.length) {
        // Find which frames are new
        const actuallyNewFrames = unlockedFrames.filter(f => !nextState.stats.unlockedFrameIds.includes(f.id));

        nextState.stats.unlockedFrameIds = combinedFrameIds as AvatarFrameId[];
        hasChanges = true;

        // Add Frame Rewards to Queue
        if (actuallyNewFrames.length > 0) {
            if (!nextState.rewardQueue) nextState.rewardQueue = [];
            // Convert frame rank to ItemRarity
            const frameRankToRarity = (rank: string): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' => {
                switch (rank) {
                    case 'C': return 'uncommon';
                    case 'B': return 'rare';
                    case 'A': return 'epic';
                    case 'S': return 'legendary';
                    case 'SS': return 'mythic';
                    case 'SSS': return 'mythic';
                    default: return 'common';
                }
            };
            actuallyNewFrames.forEach(frame => {
                nextState.rewardQueue.push({
                    id: `frame_${frame.id}_${Date.now()}`,
                    type: 'frame', // Correct type for frame animation
                    name: frame.name,
                    description: frame.description,
                    icon: '🖼️',
                    rarity: frameRankToRarity(frame.rarity)
                });
                nextState.logs.unshift(createLog('Logro', 'Marco Desbloqueado', `Desbloqueado: ${frame.name}`));
            });
        }
    }

    return hasChanges ? nextState : currentState;
};

