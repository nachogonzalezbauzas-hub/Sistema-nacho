import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUserSlice } from '../userSlice';
import { INITIAL_STATE, INITIAL_STATS } from '../../defaults';
import { UserStats } from '@/types';

// Mock store setup
const createMockStore = () => {
    const set = vi.fn();
    const get = vi.fn(() => ({ state: { ...INITIAL_STATE } })) as any;
    const api = {} as any;
    return { set, get, api, slice: createUserSlice(set, get, api) };
};

describe('UserSlice', () => {
    let store: ReturnType<typeof createMockStore>;

    beforeEach(() => {
        store = createMockStore();
    });

    describe('updateLevelIfNeeded', () => {
        it('should level up when XP exceeds threshold', () => {
            const currentStats: UserStats = {
                ...INITIAL_STATS,
                level: 1,
                xpCurrent: 150, // Threshold for lvl 1 is 100
                xpForNextLevel: 100
            };

            const result = store.slice.updateLevelIfNeeded(currentStats);

            expect(result.leveledUp).toBe(true);
            expect(result.stats.level).toBe(2);
            expect(result.stats.xpCurrent).toBe(50); // 150 - 100 = 50
        });

        it('should not level up if XP is below threshold', () => {
            const currentStats: UserStats = {
                ...INITIAL_STATS,
                level: 1,
                xpCurrent: 50,
                xpForNextLevel: 100
            };

            const result = store.slice.updateLevelIfNeeded(currentStats);

            expect(result.leveledUp).toBe(false);
            expect(result.stats.level).toBe(1);
            expect(result.stats.xpCurrent).toBe(50);
        });
    });

    describe('equipTitle', () => {
        it('should equip an unlocked title', () => {
            store.get = vi.fn(() => ({
                state: {
                    ...INITIAL_STATE,
                    stats: {
                        ...INITIAL_STATS,
                        unlockedTitleIds: ['test_title']
                    }
                }
            })) as any;

            store.slice.equipTitle('test_title' as any);

            expect(store.set).toHaveBeenCalled();
            const callback = store.set.mock.calls[0][0];
            const result = callback(store.get());

            expect(result.state.stats.equippedTitleId).toBe('test_title');
            expect(result.state.logs[0].message).toContain('Title Equipped');
        });

        it('should not equip a locked title', () => {
            store.get = vi.fn(() => ({
                state: {
                    ...INITIAL_STATE,
                    stats: {
                        ...INITIAL_STATS,
                        unlockedTitleIds: []
                    }
                }
            })) as any;

            store.slice.equipTitle('locked_title' as any);

            expect(store.set).toHaveBeenCalled();
            const callback = store.set.mock.calls[0][0];
            const result = callback(store.get());

            // Should return empty object (no state change)
            expect(result).toEqual({});
        });
    });
});
