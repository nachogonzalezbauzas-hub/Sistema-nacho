import { Dungeon, Equipment, ItemRarity } from '../types';
import { generateEquipment } from '../data/equipmentGenerator';
import { TITLES, AVATAR_FRAMES } from '../data/titles';

import { saveUnlockedAchievement } from '../data/achievements';

// Helper function to select rarity based on floor's dropRates
const selectRarityFromDropRates = (dropRates: Partial<Record<ItemRarity, number>>, floor: number): ItemRarity => {
    const roll = Math.random();
    let cumulative = 0;

    // Order from rarest to most common (Simplified core set V2.0)
    const rarityOrder: ItemRarity[] = [
        'godlike', 'mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'
    ];

    for (const rarity of rarityOrder) {
        const rate = dropRates[rarity] || 0;
        cumulative += rate;
        if (roll < cumulative) {
            return rarity;
        }
    }

    return 'common';
};

export const calculateDungeonRewards = (dungeon: Dungeon, victory: boolean, playerLevel: number): {
    xp: number;
    rewards: string[];
    equipment: Equipment[];
    unlockedTitleId?: string;
    unlockedFrameId?: string;
} => {
    if (!victory) {
        return { xp: Math.floor(dungeon.rewards.xp * 0.1), rewards: [], equipment: [] };
    }

    const rewards: string[] = [];
    const equipment: Equipment[] = [];
    let unlockedTitleId: string | undefined;
    let unlockedFrameId: string | undefined;

    // Extract floor number
    const floor = parseInt(dungeon.id.split('_')[1] || '1');
    const isBoss = floor % 10 === 0;

    // XP with variance (Tower XP is already nerfed at source, this is just scaling)
    const xp = Math.floor(dungeon.rewards.xp * (1 + Math.random() * 0.2));

    // Generic loot
    dungeon.rewards.items.forEach(item => {
        if (Math.random() > 0.5) rewards.push(item);
    });

    // === EQUIPMENT DROP SYSTEM (V2.0) ===
    // Guaranteed 1 drop
    const guaranteedRarity = selectRarityFromDropRates(dungeon.rewards.dropRates, floor);
    const item = generateEquipment(undefined, guaranteedRarity, playerLevel, Math.ceil(floor / 10));
    equipment.push(item);

    // Boss floors get an extra guaranteed drop
    if (isBoss) {
        const bossRarity = selectRarityFromDropRates(dungeon.rewards.dropRates, floor);
        const bossItem = generateEquipment(undefined, bossRarity, playerLevel, Math.ceil(floor / 10));
        equipment.push(bossItem);
    }

    // Extra drops (chance scales slowly with floor)
    const extraDropChance = Math.min(0.3, 0.1 + floor * 0.001);
    if (Math.random() < extraDropChance) {
        const extraRarity = selectRarityFromDropRates(dungeon.rewards.dropRates, floor);
        const extraItem = generateEquipment(undefined, extraRarity, playerLevel, Math.ceil(floor / 10));
        equipment.push(extraItem);
    }

    // COSMETIC DROPS (V2.0 Pruned)
    // Only a small chance to get a Title on Boss floors
    if (isBoss && Math.random() < 0.05) {
        // We will manually trigger a curated title drop here or via missions
        // For now, keeping it empty to let the user focus on habit titles
    }

    return { xp, rewards, equipment, unlockedTitleId, unlockedFrameId };
};
