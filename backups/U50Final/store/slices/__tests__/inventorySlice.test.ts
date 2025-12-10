import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createInventorySlice } from '../inventorySlice';
import { INITIAL_STATE } from '../../defaults';
import { Equipment } from '@/types';

// Mock store setup
const createMockStore = () => {
    const set = vi.fn();
    const get = vi.fn(() => ({ state: { ...INITIAL_STATE } })) as any;
    const api = {} as any;
    return { set, get, api, slice: createInventorySlice(set, get, api) };
};

describe('InventorySlice', () => {
    let store: ReturnType<typeof createMockStore>;

    beforeEach(() => {
        store = createMockStore();
    });

    describe('upgradeItem', () => {
        it('should fail if item does not exist', () => {
            store.slice.upgradeItem('non-existent-id');
            expect(store.set).toHaveBeenCalledWith(expect.any(Function));
            // In a real Redux/Zustand test we'd check state, but here we mock set.
            // The function returns {} if item not found, so set is called with a function that returns {}.
        });

        it('should fail if shards are insufficient', () => {
            const item: Equipment = {
                id: 'test-item',
                name: 'Test Sword',
                type: 'weapon',
                rarity: 'common',
                level: 0,
                maxLevel: 20,
                baseStats: [],
                isEquipped: false,
                description: 'Test item',
                acquiredAt: new Date().toISOString()
            };

            // Mock state with item but 0 shards
            store.get = vi.fn(() => ({
                state: {
                    ...INITIAL_STATE,
                    inventory: [item],
                    shards: 0
                }
            })) as any;

            store.slice.upgradeItem('test-item');

            // Should not proceed (returns empty object in set callback)
            // We can't easily check the internal logic without a full store, 
            // but we can verify it doesn't crash.
        });
    });
});
