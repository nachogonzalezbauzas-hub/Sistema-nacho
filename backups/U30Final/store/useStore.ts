import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState } from '../types';
import { INITIAL_STATE } from './defaults';
import { createSystemSlice, SystemSlice } from './slices/systemSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createDungeonSlice, DungeonSlice } from './slices/dungeonSlice';
import { createInventorySlice, InventorySlice } from './slices/inventorySlice';
import { createMissionSlice, MissionSlice } from './slices/missionSlice';
import { createBodySlice, BodySlice } from './slices/bodySlice';
import { calculateTotalPower, calculatePowerBreakdown } from './selectors';

export type GameStore = SystemSlice & UserSlice & DungeonSlice & InventorySlice & MissionSlice & BodySlice & {
    state: AppState;
    setState: (fn: (state: AppState) => AppState) => void; // Helper for legacy compatibility if needed, or just direct state manipulation
    getTotalPower: () => number;
    getPowerBreakdown: () => any;
};

export const useStore = create<GameStore>()(
    persist(
        (set, get) => ({
            state: INITIAL_STATE,

            // Helper to update state directly (mimics legacy setState)
            setState: (fn) => set((store) => ({ state: fn(store.state) })),

            ...createSystemSlice(set, get),
            ...createUserSlice(set, get),
            ...createDungeonSlice(set, get),
            ...createInventorySlice(set, get),
            ...createMissionSlice(set, get),
            ...createBodySlice(set, get),

            getTotalPower: () => calculateTotalPower(get().state),
            getPowerBreakdown: () => calculatePowerBreakdown(get().state),
        }),
        {
            name: 'sistema_nacho_data',
            storage: createJSONStorage(() => localStorage),
            partialize: (store) => ({ state: store.state }), // Only persist the 'state' object
            merge: (persistedState: any, currentState) => {
                if (!persistedState || !persistedState.state) return currentState;

                // Deep merge or migration logic here if needed
                // For now, we trust the persisted state but ensure new fields from INITIAL_STATE are present
                const mergedState = { ...INITIAL_STATE, ...persistedState.state };

                // Migration: Ensure new fields exist (copied from useGameLogic)
                if (!mergedState.dungeonRuns) mergedState.dungeonRuns = [];
                if (!mergedState.shadows) mergedState.shadows = [];
                if (!mergedState.dailyQuests) mergedState.dailyQuests = [];
                if (!mergedState.inventory) mergedState.inventory = [];
                if (!mergedState.rewardQueue) mergedState.rewardQueue = [];
                if (typeof mergedState.passivePoints !== 'number') mergedState.passivePoints = 0;
                if (typeof mergedState.shards !== 'number') mergedState.shards = 0;
                if (!mergedState.stats.jobClass) mergedState.stats.jobClass = 'None';

                // Migration: Recalculate Passive Points (1 point per level starting at lvl 2)
                const totalPointsEarned = Math.max(0, mergedState.stats.level - 1);
                const spentPoints = Object.values(mergedState.passiveLevels || {}).reduce((a: number, b: any) => a + Number(b), 0);
                mergedState.passivePoints = Math.max(0, totalPointsEarned - spentPoints);

                return { ...currentState, state: mergedState };
            }
        }
    )
);
