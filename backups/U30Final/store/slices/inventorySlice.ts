import { StateCreator } from 'zustand';
import { Equipment, QuestShopItem, RewardItem, ItemRarity } from '../../types';
import { generateEquipment } from '../../data/equipmentGenerator';
import { createLog } from '../utils';
import { GameStore } from '../useStore';

export interface InventorySlice {
    equipItem: (itemId: string) => void;
    unequipItem: (itemId: string) => void;
    upgradeItem: (itemId: string) => void;
    transmogItem: (itemId: string, targetItemId: string) => void;
    salvageItem: (itemId: string) => void;
    addEquipment: (item: Equipment) => void;
    addReward: (reward: RewardItem) => void;
    clearRewards: () => void;
    purchaseQuestShopItem: (item: QuestShopItem) => void;
    purchaseEquipment: (cost: number, rarity?: ItemRarity) => void;
}

export const createInventorySlice: StateCreator<GameStore, [], [], InventorySlice> = (set, get) => ({
    equipItem: (itemId) => {
        set((store) => {
            const item = store.state.inventory.find(i => i.id === itemId);
            if (!item) return {};

            const newInventory = store.state.inventory.map(i => {
                if (i.id === itemId) return { ...i, isEquipped: true };
                if (i.type === item.type && i.isEquipped) return { ...i, isEquipped: false };
                return i;
            });

            return { state: { ...store.state, inventory: newInventory } };
        });
    },

    unequipItem: (itemId) => {
        set((store) => {
            const newInventory = store.state.inventory.map(i =>
                i.id === itemId ? { ...i, isEquipped: false } : i
            );
            return { state: { ...store.state, inventory: newInventory } };
        });
    },

    upgradeItem: (itemId) => {
        set((store) => {
            const item = store.state.inventory.find(i => i.id === itemId);
            if (!item) return {};

            const newInventory = store.state.inventory.map(i => {
                if (i.id === itemId) {
                    return {
                        ...i,
                        level: i.level + 1,
                        baseStats: i.baseStats.map(s => ({ ...s, value: Math.floor(s.value * 1.1) }))
                    };
                }
                return i;
            });

            return { state: { ...store.state, inventory: newInventory } };
        });
    },

    transmogItem: (itemId, targetItemId) => {
        console.log("Transmog not implemented yet");
    },

    salvageItem: (itemId) => {
        set((store) => {
            const item = store.state.inventory.find(i => i.id === itemId);
            if (!item) return {};

            const newInventory = store.state.inventory.filter(i => i.id !== itemId);
            return { state: { ...store.state, inventory: newInventory } };
        });
    },

    addEquipment: (item) => {
        set((store) => ({
            state: {
                ...store.state,
                inventory: [item, ...store.state.inventory]
            }
        }));
    },

    addReward: (reward) => {
        set((store) => ({
            state: {
                ...store.state,
                rewardQueue: [...store.state.rewardQueue, reward]
            }
        }));
    },

    clearRewards: () => {
        set((store) => ({
            state: {
                ...store.state,
                rewardQueue: []
            }
        }));
    },

    purchaseQuestShopItem: (item) => {
        set((store) => {
            const prev = store.state;
            if (prev.questPoints < item.cost) return {};
            if (item.type === 'cosmetic' && prev.questShopPurchases.includes(item.id)) return {};

            const newQP = prev.questPoints - item.cost;
            const newPurchases = [...prev.questShopPurchases, item.id];
            let newStats = { ...prev.stats };
            let newLogs = [...prev.logs];

            if (item.reward.xp) {
                newStats.xpCurrent += item.reward.xp;
            }
            if (item.reward.titleId && !newStats.unlockedTitleIds.includes(item.reward.titleId)) {
                newStats.unlockedTitleIds.push(item.reward.titleId);
            }
            if (item.reward.frameId && !newStats.unlockedFrameIds.includes(item.reward.frameId)) {
                newStats.unlockedFrameIds.push(item.reward.frameId);
            }

            newLogs.unshift(createLog('System', 'Shop Purchase', `Bought ${item.name} for ${item.cost} QP`));

            return {
                state: {
                    ...prev,
                    questPoints: newQP,
                    questShopPurchases: newPurchases,
                    stats: newStats,
                    logs: newLogs
                }
            };
        });
    },

    purchaseEquipment: (cost: number, rarity?: ItemRarity) => {
        set((store) => {
            const prev = store.state;
            if (prev.shards < cost) return {};

            const newItem = generateEquipment(undefined, rarity, prev.stats.level);

            const newInventory = [newItem, ...prev.inventory];
            const newShards = prev.shards - cost;

            const logs = [...prev.logs];
            logs.unshift(createLog('System', 'Equipment Purchased', `Bought ${newItem.name} for ${cost} Shards`));

            return {
                state: {
                    ...prev,
                    shards: newShards,
                    inventory: newInventory,
                    logs
                }
            };
        });
    }
});
