import { DungeonDefinition } from '../types';

export const calculateDungeonRewards = (dungeon: DungeonDefinition, victory: boolean): { xp: number; rewards: string[] } => {
    if (!victory) {
        return { xp: Math.floor(dungeon.baseRewards.xp * 0.1), rewards: [] }; // 10% XP for failure
    }

    const rewards: string[] = [];

    // XP Variance
    const xp = Math.floor(dungeon.baseRewards.xp * (1 + Math.random() * 0.2));

    // Base Rewards
    if (dungeon.baseRewards.buffId && Math.random() > 0.5) {
        rewards.push(dungeon.baseRewards.buffId);
    }

    if (dungeon.baseRewards.titleId && Math.random() > 0.8) { // Rare title drop
        rewards.push(dungeon.baseRewards.titleId);
    }

    if (dungeon.baseRewards.frameId && Math.random() > 0.9) { // Very rare frame drop
        rewards.push(dungeon.baseRewards.frameId);
    }

    // Generic loot based on difficulty
    if (dungeon.difficulty >= 3) {
        if (Math.random() > 0.7) rewards.push('Mana Crystal (Small)');
    }
    if (dungeon.difficulty >= 5) {
        rewards.push('Void Essence');
    }

    return { xp, rewards };
};
