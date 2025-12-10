import { StateCreator } from 'zustand';
import { AppState, UserStats, TitleId, AvatarFrameId, EffectiveStats, Title } from '../../types';
import { TITLES, AVATAR_FRAMES } from '../../data/titles';
import { createLog } from '../utils';
import { GameStore } from '../useStore';
import { calculateLevel } from '../../utils/progression';

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
}

export const createUserSlice: StateCreator<GameStore, [], [], UserSlice> = (set, get) => ({

    setLevelUp: (value) => set((store) => ({ state: { ...store.state, justLeveledUp: value } })),

    setTitleModalClosed: () => set((store) => ({ state: { ...store.state, justUnlockedTitle: null } })),

    equipTitle: (titleId) => {
        set((store) => {
            if (titleId && !store.state.stats.unlockedTitleIds.includes(titleId)) return {};
            const log = createLog('System', 'Title Equipped', `Equipped title: ${titleId}`);
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
        const base = get().state.stats;
        return {
            strength: base.strength,
            vitality: base.vitality,
            agility: base.agility,
            intelligence: base.intelligence,
            fortune: base.fortune,
            metabolism: base.metabolism,
            dailyGains: base.dailyGains
        };
    },

    updateLevelIfNeeded: (currentStats) => {
        const { level, xp, leveledUp, xpForNextLevel } = calculateLevel(currentStats.level, currentStats.xpCurrent);
        let newStats = { ...currentStats, level, xpCurrent: xp, xpForNextLevel };
        return { stats: newStats, leveledUp };
    },

    checkAchievements: () => {
        set((store) => ({ state: recomputeTitlesAndFrames(store.state) }));
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
        const log = createLog('Achievement', 'Title Unlocked', `You unlocked: ${newlyUnlockedTitle.name}`);
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
            actuallyNewFrames.forEach(frame => {
                nextState.rewardQueue.push({
                    id: `frame_${frame.id}_${Date.now()}`,
                    type: 'item', // Using item for frame
                    name: `${frame.name} Frame`,
                    description: frame.description,
                    icon: '🖼️',
                    rarity: frame.rarity === 'S' || frame.rarity === 'SS' || frame.rarity === 'SSS' ? 'legendary' : 'rare'
                });
                nextState.logs.unshift(createLog('Achievement', 'Frame Unlocked', `Unlocked: ${frame.name}`));
            });
        }
    }

    return hasChanges ? nextState : currentState;
};

