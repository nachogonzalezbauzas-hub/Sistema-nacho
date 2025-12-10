
import { TITLES, AVATAR_FRAMES } from './titles';
import { ALL_DUNGEONS as DUNGEONS } from '../dungeons/dungeonGenerator';
import { calculateDungeonRewards } from '../dungeons/rewardGenerator';
import { generateBoss } from '../dungeons/bossGenerator';

console.log('TITLES length:', TITLES?.length);
console.log('AVATAR_FRAMES length:', AVATAR_FRAMES?.length);
console.log('DUNGEONS length:', DUNGEONS?.length);

const dungeon = DUNGEONS[0];
console.log('Testing Dungeon:', dungeon.name);

const mockStats = {
    level: 1,
    strength: 10,
    vitality: 10,
    agility: 10,
    intelligence: 10,
    fortune: 10,
    metabolism: 10
};

const boss = generateBoss(dungeon as any, mockStats as any);
console.log('Generated Boss:', boss.name);

const rewards = calculateDungeonRewards(dungeon as any, true, 1);
console.log('Calculated Rewards:', rewards);

if (rewards.unlockedTitleId) {
    const title = TITLES.find(t => t.id === rewards.unlockedTitleId);
    console.log('Found Title:', title?.name);
}

if (rewards.unlockedFrameId) {
    const frame = AVATAR_FRAMES.find(f => f.id === rewards.unlockedFrameId);
    console.log('Found Frame:', frame?.name);
}
