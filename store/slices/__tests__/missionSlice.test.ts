import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMissionSlice } from '../missionSlice';
import { INITIAL_STATE } from '../../defaults';
import { Mission } from '@/types';

// Mock store setup
const createMockStore = () => {
    const set = vi.fn();
    const get = vi.fn(() => ({ state: { ...INITIAL_STATE } })) as any;
    const api = {} as any;
    return { set, get, api, slice: createMissionSlice(set, get, api) };
};

describe('MissionSlice', () => {
    let store: ReturnType<typeof createMockStore>;

    beforeEach(() => {
        store = createMockStore();
    });

    describe('addMission', () => {
        it('should add a new mission to the state', () => {
            const mission: Mission = {
                id: 'test-mission',
                title: 'Test Mission',
                detail: 'Test Description',
                xpReward: 100,
                targetStat: 'Strength',
                isDaily: true,
                lastCompletedAt: null
            };

            store.slice.addMission(mission);

            expect(store.set).toHaveBeenCalledWith(expect.any(Function));
            // Simulate the state update callback
            const callback = store.set.mock.calls[0][0];
            const newState = callback({ state: INITIAL_STATE });

            expect(newState.state.missions).toHaveLength(1);
            expect(newState.state.missions[0]).toEqual(mission);
        });
    });

    describe('completeMission', () => {
        it('should update stats and logs when completing a mission', () => {
            const mission: Mission = {
                id: 'test-mission',
                title: 'Test Mission',
                detail: 'Test Description',
                xpReward: 100,
                targetStat: 'Strength',
                isDaily: true,
                lastCompletedAt: null
            };

            // Mock state with one mission
            store.get = vi.fn(() => ({
                state: {
                    ...INITIAL_STATE,
                    missions: [mission],
                    stats: { ...INITIAL_STATE.stats, xpCurrent: 0, level: 1 }
                }
            })) as any;

            store.slice.completeMission('test-mission');

            expect(store.set).toHaveBeenCalled();
            const callback = store.set.mock.calls[0][0];
            const result = callback({ state: { ...INITIAL_STATE, missions: [mission] } });

            // Check XP gain (100 base * 1.05 streak * 1.0 buff = 105)
            // Level 1 requires 100 XP. So 105 - 100 = 5 XP remaining.
            // Level should increase to 2.
            expect(result.state.stats.xpCurrent).toBe(5);
            expect(result.state.stats.level).toBe(2);
            // Check log added (might be at index 1 if title unlocked)
            const missionLog = result.state.logs.find((l: any) => l.message === 'Mission Completed: Test Mission');
            expect(missionLog).toBeDefined();
        });
    });
});
