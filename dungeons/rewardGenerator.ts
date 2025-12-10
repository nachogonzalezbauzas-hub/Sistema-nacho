import { Dungeon, Equipment, ItemRarity } from '../types';
import { generateEquipment } from '../data/equipmentGenerator';

import { saveUnlockedAchievement } from '../data/achievements';
import { getZoneCosmeticDrop } from '../data/staticCosmetics';

// Helper function to select rarity based on floor's dropRates
const selectRarityFromDropRates = (dropRates: Partial<Record<ItemRarity, number>>, floor: number): ItemRarity => {
    const roll = Math.random();
    let cumulative = 0;

    // Order from rarest to most common (so rarer items get checked first)
    const rarityOrder: ItemRarity[] = [
        'omega', 'void', 'chaotic', 'temporal', 'antimatter', 'heavenly', 'crimson',
        'ethereal', 'crystal', 'cyber', 'nova', 'singularity', 'nebula', 'solar',
        'lunar', 'storm', 'verdant', 'abyssal', 'magma', 'infinite', 'cosmic',
        'divine', 'eternal', 'primordial', 'transcendent', 'celestial', 'godlike',
        'mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'
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

    // XP with variance (Heavily reduced - real life missions should be main XP source)
    const xp = Math.floor(dungeon.rewards.xp * 0.15 * (1 + Math.random() * 0.2));

    // Generic loot
    dungeon.rewards.items.forEach(item => {
        if (Math.random() > 0.5) rewards.push(item);
    });

    // === IMPROVED EQUIPMENT DROP SYSTEM ===
    // Guaranteed 1 drop, rarity based on floor's dropRates
    const guaranteedRarity = selectRarityFromDropRates(dungeon.rewards.dropRates, floor);
    const item = generateEquipment(undefined, guaranteedRarity, playerLevel, Math.ceil(floor / 20));
    equipment.push(item);

    // Boss floors get an extra guaranteed drop with boosted rarity
    if (isBoss) {
        // Boost rates for boss drops
        const boostedRates = { ...dungeon.rewards.dropRates };
        boostedRates.mythic = (boostedRates.mythic || 0) * 3;
        boostedRates.godlike = (boostedRates.godlike || 0) * 3;
        boostedRates.celestial = (boostedRates.celestial || 0) * 3;
        boostedRates.transcendent = (boostedRates.transcendent || 0) * 3;

        const bossRarity = selectRarityFromDropRates(boostedRates, floor);
        const bossItem = generateEquipment(undefined, bossRarity, playerLevel, Math.ceil(floor / 20));
        equipment.push(bossItem);
    }

    // Extra drops (30% chance, up to 2 more items on high floors)
    const extraDropChance = Math.min(0.5, 0.2 + floor * 0.002);
    if (Math.random() < extraDropChance) {
        const extraRarity = selectRarityFromDropRates(dungeon.rewards.dropRates, floor);
        const extraItem = generateEquipment(undefined, extraRarity, playerLevel, Math.ceil(floor / 20));
        equipment.push(extraItem);
    }

    // High floors get even more drops
    if (floor >= 100 && Math.random() < 0.3) {
        const extraRarity = selectRarityFromDropRates(dungeon.rewards.dropRates, floor);
        const extraItem = generateEquipment(undefined, extraRarity, playerLevel, Math.ceil(floor / 20));
        equipment.push(extraItem);
    }

    // ZONE COSMETIC DROPS (Replaces old procedural system)
    // 10% on Boss, 1% on Normal
    const cosmeticChance = isBoss ? 0.1 : 0.01;

    if (Math.random() < cosmeticChance) {
        const zoneId = Math.max(1, Math.ceil(floor / 150)); // 20 Zones for 3000 Floors.
        const requiredSource = isBoss ? 'boss_zone' : undefined;

        const drop = getZoneCosmeticDrop(zoneId, requiredSource);

        if (drop) {
            if (drop.type === 'title') {
                unlockedTitleId = drop.item.id;
                rewards.push(`New Title: ${drop.item.name}`);
            } else {
                unlockedFrameId = drop.item.id;
                rewards.push(`New Frame: ${drop.item.name}`);
            }
        }
    }

    return { xp, rewards, equipment, unlockedTitleId, unlockedFrameId };
};
