import { StateCreator } from 'zustand';
import { Equipment, QuestShopItem, RewardItem, ItemRarity } from '@/types';
import { generateEquipment } from '@/data/equipmentGenerator';
import { getMaxLevel, calculateSalvageValue, isRarityLower } from '@/data/equipmentConstants';
import { createLog } from '@/store/utils';
import { GameStore } from '@/store/useStore';

export interface InventorySlice {
    equipItem: (itemId: string) => void;
    unequipItem: (itemId: string) => void;
    unequipAll: () => void;
    upgradeItem: (itemId: string, levels?: number, onSuccess?: () => void, onFailure?: () => void) => void;
    transmogItem: (itemId: string, targetItemId: string) => void;
    salvageItem: (itemId: string) => void;
    bulkSalvage: (minRarityToKeep: string) => void;
    addEquipment: (item: Equipment) => void;
    addReward: (reward: RewardItem) => void;
    clearRewards: () => void;
    // purchaseQuestShopItem is in MissionSlice - removed from here to prevent duplicates
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

    unequipAll: () => {
        set((store) => {
            const newInventory = store.state.inventory.map(i => ({ ...i, isEquipped: false }));
            return { state: { ...store.state, inventory: newInventory } };
        });
    },

    upgradeItem: (itemId, levels = 1, onSuccess, onFailure) => {
        set((store) => {
            const item = store.state.inventory.find(i => i.id === itemId);
            if (!item) return {};

            // Get rarity-based max level
            const maxLevel = getMaxLevel(item.rarity);

            // Clamp levels to not exceed max
            const actualLevels = Math.min(levels, maxLevel - item.level);
            if (actualLevels <= 0) return {};

            // Cost Calculation: 100 × (currentLevel + 1) per level, summed
            let totalCost = 0;
            for (let i = 0; i < actualLevels; i++) {
                totalCost += 100 * (item.level + i + 1);
            }

            // Shard Check
            if (store.state.shards < totalCost) return {};

            // Base Probability Calculation (only for levels >= 5)
            let allSuccess = true;
            let successCount = 0;
            let failCount = 0;
            let currentLevel = item.level;
            let currentFailures = item.consecutiveFailures || 0;
            let statMultiplier = 1;

            for (let i = 0; i < actualLevels; i++) {
                let baseChance = 1.0;
                if (currentLevel >= 15) baseChance = 0.3;
                else if (currentLevel >= 10) baseChance = 0.5;
                else if (currentLevel >= 5) baseChance = 0.8;

                const pityBonus = currentFailures * 0.15;
                const successChance = Math.min(baseChance + pityBonus, 0.95);

                if (Math.random() < successChance) {
                    currentLevel++;
                    statMultiplier *= 1.1;
                    currentFailures = 0;
                    successCount++;
                } else {
                    currentFailures++;
                    failCount++;
                    allSuccess = false;
                }
            }

            const newLogs = [...store.state.logs];

            if (successCount > 0) {
                const newInventory = store.state.inventory.map(i => {
                    if (i.id === itemId) {
                        return {
                            ...i,
                            level: currentLevel,
                            consecutiveFailures: currentFailures,
                            baseStats: i.baseStats.map(s => ({
                                ...s,
                                // Ensure at least +1 per successful level upgrade
                                value: Math.max(Math.floor(s.value * statMultiplier), s.value + successCount)
                            }))
                        };
                    }
                    return i;
                });

                newLogs.unshift(createLog('Sistema', 'Mejora de Objeto',
                    `${successCount > 1 ? `¡+${successCount} niveles!` : '¡ÉXITO!'} ${item.name} es ahora +${currentLevel}${failCount > 0 ? ` (${failCount} fallos)` : ''} por ${totalCost} Fragmentos`));

                if (allSuccess && onSuccess) onSuccess();
                else if (onFailure && failCount > 0) onFailure();

                return {
                    state: {
                        ...store.state,
                        shards: store.state.shards - totalCost,
                        inventory: newInventory,
                        logs: newLogs
                    }
                };
            } else {
                // All attempts failed
                const newInventory = store.state.inventory.map(i => {
                    if (i.id === itemId) {
                        return { ...i, consecutiveFailures: currentFailures };
                    }
                    return i;
                });

                newLogs.unshift(createLog('Sistema', 'Mejora Fallida',
                    `Los ${actualLevels} intentos fallaron en ${item.name}. Consumidos ${totalCost} Fragmentos. (Piedad +${failCount * 15}%)`));

                if (onFailure) onFailure();

                return {
                    state: {
                        ...store.state,
                        shards: store.state.shards - totalCost,
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

            // Calculate shards based on rarity and level
            const shardsGained = calculateSalvageValue(item.rarity, item.level);

            const newInventory = store.state.inventory.filter(i => i.id !== itemId);
            const newLogs = [...store.state.logs];
            newLogs.unshift(createLog('Sistema', 'Objeto Reciclado',
                `Reciclado ${item.name} (+${item.level}) por ${shardsGained} Fragmentos`));

            return {
                state: {
                    ...store.state,
                    inventory: newInventory,
                    shards: store.state.shards + shardsGained,
                    logs: newLogs
                }
            };
        });
    },

    bulkSalvage: (minRarityToKeep: string) => {
        set((store) => {
            let totalShards = 0;
            let itemCount = 0;

            const newInventory = store.state.inventory.filter(item => {
                // Keep equipped items
                if (item.isEquipped) return true;

                // Keep items at or above min rarity
                if (!isRarityLower(item.rarity, minRarityToKeep)) return true;

                // Salvage this item
                totalShards += calculateSalvageValue(item.rarity, item.level);
                itemCount++;
                return false;
            });

            if (itemCount === 0) return {};

            const newLogs = [...store.state.logs];
            newLogs.unshift(createLog('Sistema', 'Reciclaje Masivo',
                `Reciclados ${itemCount} objetos por ${totalShards} Fragmentos (manteniendo ${minRarityToKeep}+)`));

            return {
                state: {
                    ...store.state,
                    inventory: newInventory,
                    shards: store.state.shards + totalShards,
                    logs: newLogs
                }
            };
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

    // purchaseQuestShopItem removed - now only in missionSlice to prevent duplicate triggers

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
            logs.unshift(createLog('Sistema', 'Equipo Comprado', `Comprado ${newItem.name} por ${cost} Fragmentos`));

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
