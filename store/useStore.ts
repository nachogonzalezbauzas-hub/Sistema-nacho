import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState } from '@/types';
import { INITIAL_STATE } from './defaults';
import { createSystemSlice, SystemSlice } from './slices/systemSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createDungeonSlice, DungeonSlice } from './slices/dungeonSlice';
import { createInventorySlice, InventorySlice } from './slices/inventorySlice';
import { createMissionSlice, MissionSlice } from './slices/missionSlice';
import { createBodySlice, BodySlice } from './slices/bodySlice';
import { createPetSlice, PetSlice } from './slices/petSlice';
import { createChatSlice, ChatSlice } from './slices/chatSlice';
import { createCalendarSlice, CalendarSlice } from './slices/calendarSlice';
import { createZoneSlice, ZoneSlice } from './slices/zoneSlice';
import { calculateTotalPower, calculatePowerBreakdown, PowerBreakdown } from './selectors';

export type GameStore = SystemSlice & UserSlice & DungeonSlice & InventorySlice & MissionSlice & BodySlice & PetSlice & ChatSlice & CalendarSlice & ZoneSlice & {
    state: AppState;
    setState: (fn: (state: AppState) => AppState) => void;
    getTotalPower: () => number;
    getPowerBreakdown: () => PowerBreakdown;
    // Firebase Integration
    isFirebaseReady: boolean;
    initializeFirebase: () => Promise<void>;
};

// Simple debounce for saving
let saveTimeout: NodeJS.Timeout;
const debouncedSave = (state: AppState, userId: string) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        import('@/services/firebaseService').then(({ FirebaseService }) => {
            FirebaseService.saveState(userId, state);
        });
    }, 2000); // Save after 2 seconds of inactivity
};

export const useStore = create<GameStore>()(
    persist(
        (set, get, api) => ({
            state: INITIAL_STATE,

            // Helper to update state directly (mimics legacy setState)
            setState: (fn) => set((store) => ({ state: fn(store.state) })),

            ...createSystemSlice(set, get, api),
            ...createUserSlice(set, get, api),
            ...createDungeonSlice(set, get, api),
            ...createInventorySlice(set, get, api),
            ...createMissionSlice(set, get, api),
            ...createBodySlice(set, get, api),
            ...createPetSlice(set, get, api),
            ...createChatSlice(set, get, api),
            ...createCalendarSlice(set, get, api),
            ...createZoneSlice(set, get, api),

            getTotalPower: () => calculateTotalPower(get().state),
            getPowerBreakdown: () => calculatePowerBreakdown(get().state),

            isFirebaseReady: false,
            initializeFirebase: async () => {
                if (get().isFirebaseReady) return;

                try {
                    const { FirebaseService } = await import('@/services/firebaseService');
                    const user = await FirebaseService.initAuth();
                    console.log('Firebase User:', user.uid);

                    // Load remote state
                    const remoteState = await FirebaseService.loadState(user.uid);
                    if (remoteState) {
                        console.log('Loaded state from Firebase');
                        // Merge remote state with current state (handling migrations via the existing merge logic if we re-ran it, but here we just set it)
                        // Ideally we use the same merge logic as persist, but for now let's trust the remote if it exists
                        // Or better: trigger a merge.

                        // We can use the 'setState' to update.
                        // However, we need to be careful not to overwrite if local is newer? 
                        // For this task, "Persistence" usually implies "Remote wins" or "Last write wins".
                        // Since we just loaded, let's assume Remote is the source of truth for a fresh session.
                        set((store) => ({ state: { ...store.state, ...remoteState } }));
                    }

                    set({ isFirebaseReady: true });

                    // Subscribe to changes
                    useStore.subscribe((state) => {
                        if (state.isFirebaseReady) {
                            debouncedSave(state.state, user.uid);
                        }
                    });

                } catch (error) {
                    console.error('Failed to initialize Firebase:', error);
                }
            },
        }),
        {
            name: 'sistema_nacho_data',
            storage: createJSONStorage(() => localStorage),
            partialize: (store) => ({ state: store.state }), // Only persist the 'state' object
            merge: (persistedState: unknown, currentState) => {
                // Ensure we have a valid base state
                const baseState = INITIAL_STATE || currentState.state;

                if (!baseState) {
                    console.error('CRITICAL: INITIAL_STATE is undefined!');
                    return currentState;
                }

                const persisted = persistedState as { state: AppState } | undefined;

                if (!persisted || !persisted.state) {
                    return { ...currentState, state: baseState };
                }

                // Deep merge or migration logic here if needed
                // For now, we trust the persisted state but ensure new fields from INITIAL_STATE are present
                const mergedState = { ...baseState, ...persisted.state } as any; // Cast to any to handle migration of old keys

                // CRITICAL: Ensure stats exists and is not overwritten by undefined
                if (!mergedState.stats) {
                    mergedState.stats = baseState.stats;
                }

                // Migration: Ensure new fields exist (copied from useGameLogic)
                if (!mergedState.dungeonRuns) mergedState.dungeonRuns = [];
                if (!mergedState.shadows) mergedState.shadows = [];
                if (!mergedState.dailyQuests) mergedState.dailyQuests = [];
                if (!mergedState.inventory) mergedState.inventory = [];
                if (!mergedState.rewardQueue) mergedState.rewardQueue = [];
                if (typeof mergedState.passivePoints !== 'number') mergedState.passivePoints = 0;
                if (typeof mergedState.shards !== 'number') mergedState.shards = 0;
                if (!mergedState.stats.jobClass) mergedState.stats.jobClass = 'None';
                if (!mergedState.stats.unlockedFrameIds) mergedState.stats.unlockedFrameIds = ['default'];
                if (!mergedState.stats.selectedFrameId) mergedState.stats.selectedFrameId = 'default';
                if (!mergedState.stats.pets) mergedState.stats.pets = [];
                if (!mergedState.stats.activePetId) mergedState.stats.activePetId = null;
                if (!mergedState.chatHistory) mergedState.chatHistory = [];

                // MIGRATION: SANITIZE ICONS (Fix for Blue Screen Crash)
                // If titles or frames have React Elements (objects) passed as icons, they crash Redux/React.
                // We force them to be simple strings.
                if (mergedState.stats?.customTitles) {
                    mergedState.stats.customTitles = mergedState.stats.customTitles.map((t: any) => ({
                        ...t,
                        icon: typeof t.icon === 'string' ? t.icon : 'Crown'
                    }));
                }
                if (mergedState.stats?.customFrames) {
                    // Frames don't usually have icons, but let's be safe.
                    // Frames generated might have some properties we want to check.
                }

                // Migration: Zone System (Replace Era)
                if (!mergedState.zone) {
                    if (mergedState.era) {
                        // Migrate Era -> Zone (Era 0 -> Zone 1, Era 1 -> Zone 2, etc.)
                        mergedState.zone = {
                            currentZone: (mergedState.era.currentEra || 0) + 1,
                            maxUnlockedFloor: mergedState.era.maxUnlockedFloor || 150,
                            zoneGuardiansDefeated: (mergedState.era.eraGuardiansDefeated || []).map((id: number) => id + 1),
                            unlockedRarities: mergedState.era.unlockedRarities || ['common', 'uncommon', 'rare', 'epic', 'legendary'],
                            pendingZoneBoss: mergedState.era.pendingEraBoss ? mergedState.era.pendingEraBoss + 1 : null
                        };
                        // We can't easily delete 'era' from the type-safe object, but it will be ignored by the new code
                    } else {
                        // Initialize new Zone state
                        mergedState.zone = {
                            currentZone: 1,
                            maxUnlockedFloor: 150,
                            zoneGuardiansDefeated: [],
                            unlockedRarities: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
                            pendingZoneBoss: null
                        };
                    }
                }

                // Migration: Recalculate Passive Points (1 point per level starting at lvl 2)
                const totalPointsEarned = Math.max(0, Number(mergedState.stats.level) - 1);
                const spentPoints = Number(Object.values(mergedState.passiveLevels || {}).reduce((a: number, b: number) => a + Number(b), 0));
                mergedState.passivePoints = Math.max(0, totalPointsEarned - spentPoints);

                // MIGRATION V2.1: Equipment Sanitation
                // Strips legacy stats (Crit, Atk Speed) and enforces v2.1 stat compression
                const CORE_STATS = ['Strength', 'Vitality', 'Agility', 'Intelligence', 'Fortune', 'Metabolism'];
                const RARITY_LIMITS: Record<string, number> = {
                    common: 1, uncommon: 1, rare: 2, epic: 2,
                    legendary: 3, mythic: 3, godlike: 4, celestial: 4
                };

                if (mergedState.inventory && Array.isArray(mergedState.inventory)) {
                    mergedState.inventory = mergedState.inventory.map((item: any) => {
                        // Skip if already sanitized or special set item
                        if (item.v === 21 || item.setId) return item;

                        // 1. Filter out illegal stats
                        let cleanedStats = (item.baseStats || []).filter((s: any) => CORE_STATS.includes(s.stat));

                        // 2. If stats were removed, replace with random core stars (only if we have room)
                        if (cleanedStats.length < 1 && item.baseStats?.length > 0) {
                            cleanedStats.push({
                                stat: CORE_STATS[Math.floor(Math.random() * CORE_STATS.length)],
                                value: Math.max(1, Math.floor((item.baseStats[0]?.value || 1) / 2))
                            });
                        }

                        // 3. Enforce rarity limits (v2.1 compression)
                        const limit = RARITY_LIMITS[item.rarity.toLowerCase()] || 1;
                        if (cleanedStats.length > limit) {
                            cleanedStats = cleanedStats.slice(0, limit);
                        }

                        // 4. Update level if 0 (old items)
                        const level = item.level || 0;

                        return {
                            ...item,
                            baseStats: cleanedStats,
                            level,
                            v: 21
                        };
                    });
                }

                return { ...currentState, state: mergedState };
            }
        }
    )
);
