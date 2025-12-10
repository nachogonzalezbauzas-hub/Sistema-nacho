import { Dungeon, Equipment } from '../types';
import { generateEquipment } from '../data/equipmentGenerator';

export const calculateDungeonRewards = (dungeon: Dungeon, victory: boolean, playerLevel: number): { xp: number; rewards: string[]; equipment: Equipment[]; unlockedTitleId?: string; unlockedFrameId?: string } => {
    if (!victory) {
        return { xp: Math.floor(dungeon.rewards.xp * 0.1), rewards: [], equipment: [] }; // 10% XP for failure
    }

    const rewards: string[] = [];
    const equipment: Equipment[] = [];
    let unlockedTitleId: string | undefined;
    let unlockedFrameId: string | undefined;

    // XP Variance
    const xp = Math.floor(dungeon.rewards.xp * (1 + Math.random() * 0.2));

    // Generic loot
    dungeon.rewards.items.forEach(item => {
        if (Math.random() > 0.5) rewards.push(item);
    });

    // Equipment Drops
    // Guaranteed drop
    const item = generateEquipment(undefined, undefined, playerLevel, 3); // Defaulting difficulty to 3 for now, or map tier to difficulty
    equipment.push(item);

    // Extra drop based on drop rates
    if (Math.random() < dungeon.rewards.dropRates.rare) {
        const extraItem = generateEquipment(undefined, undefined, playerLevel, 4);
        equipment.push(extraItem);
    }

    return { xp, rewards, equipment, unlockedTitleId, unlockedFrameId };
};
