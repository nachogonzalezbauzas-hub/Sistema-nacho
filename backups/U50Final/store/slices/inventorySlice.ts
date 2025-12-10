import { StateCreator } from 'zustand';
import { Equipment, QuestShopItem, RewardItem, ItemRarity } from '@/types';
import { generateEquipment } from '@/data/equipmentGenerator';
import { createLog } from '@/store/utils';
import { GameStore } from '@/store/useStore';

export interface InventorySlice {
    equipItem: (itemId: string) => void;
    unequipItem: (itemId: string) => void;
    upgradeItem: (itemId: string, onSuccess?: () => void, onFailure?: () => void) => void;
    transmogItem: (itemId: string, targetItemId: string) => void;
    salvageItem: (itemId: string) => void;
    addEquipment: (item: Equipment) => void;
    addReward: (reward: RewardItem) => void;
    clearRewards: () => void;
    purchaseQuestShopItem: (item: QuestShopItem) => void;
    purchaseEquipment: (cost: number, rarity?: ItemRarity, onItemGenerated?: (item: Equipment) => void) => void;
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

    upgradeItem: (itemId, onSuccess, onFailure) => {
        set((store) => {
            const item = store.state.inventory.find(i => i.id === itemId);
            if (!item) return {};

            // Max Level Check
            if (item.level >= 20) return {};

            // Cost Calculation
            const cost = 100 * (item.level + 1);

            // Shard Check
            if (store.state.shards < cost) return {};

            // Base Probability Calculation
            let baseChance = 1.0;
            if (item.level >= 15) baseChance = 0.3;      // 30% for +15 to +20
            else if (item.level >= 10) baseChance = 0.5; // 50% for +10 to +15
            else if (item.level >= 5) baseChance = 0.8;  // 80% for +5 to +10

            // Pity System: Each consecutive failure adds 15% to success chance
            // Max at 95% to always have some risk
            const pityBonus = (item.consecutiveFailures || 0) * 0.15;
            const successChance = Math.min(baseChance + pityBonus, 0.95);

            const isSuccess = Math.random() < successChance;
            const newLogs = [...store.state.logs];

            if (isSuccess) {
                const newInventory = store.state.inventory.map(i => {
                    if (i.id === itemId) {
                        return {
                            ...i,
                            level: i.level + 1,
                            consecutiveFailures: 0, // Reset pity on success
                            baseStats: i.baseStats.map(s => ({ ...s, value: Math.floor(s.value * 1.1) }))
                        };
                    }
                    return i;
                });

                newLogs.unshift(createLog('System', 'Item Upgraded', `SUCCESS! Upgraded ${item.name} to +${item.level + 1} for ${cost} Shards`));
                if (onSuccess) onSuccess();

                return {
                    state: {
                        ...store.state,
                        shards: store.state.shards - cost,
                        inventory: newInventory,
                        logs: newLogs
                    }
                };
            } else {
                // Failure: Consume shards, increase pity counter
                const newInventory = store.state.inventory.map(i => {
                    if (i.id === itemId) {
                        return {
                            ...i,
                            consecutiveFailures: (i.consecutiveFailures || 0) + 1
                        };
                    }
                    return i;
                });

                newLogs.unshift(createLog('System', 'Upgrade Failed', `Failed to upgrade ${item.name}. Consumed ${cost} Shards. (Pity +15%)`));
                if (onFailure) onFailure();

                return {
                    state: {
                        ...store.state,
                        shards: store.state.shards - cost,
                        inventory: newInventory,
                        logs: newLogs
                    }
                };
            }
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
                newStats.unlockedTitleIds = [...newStats.unlockedTitleIds, item.reward.titleId];
            }
            if (item.reward.frameId && !newStats.unlockedFrameIds.includes(item.reward.frameId)) {
                newStats.unlockedFrameIds = [...newStats.unlockedFrameIds, item.reward.frameId];
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

    purchaseEquipment: (cost: number, rarity?: ItemRarity, onItemGenerated?: (item: Equipment) => void) => {
        const prev = get().state;
        if (prev.shards < cost) return;

        const newItem = generateEquipment(undefined, rarity, prev.stats.level);

        // Call the callback with the generated item for animation
        if (onItemGenerated) {
            onItemGenerated(newItem);
        }

        set((store) => {
            const logs = [...store.state.logs];
            logs.unshift(createLog('System', 'Equipment Purchased', `Bought ${newItem.name} for ${cost} Shards`));

            return {
                state: {
                    ...store.state,
                    shards: store.state.shards - cost,
                    inventory: [newItem, ...store.state.inventory],
                    logs
                }
            };
        });
    }
});
