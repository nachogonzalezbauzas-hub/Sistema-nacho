import { Dungeon, Equipment } from '../types';
import { generateEquipment } from '../data/equipmentGenerator';
import { generateProceduralTitle, generateProceduralFrame } from './cosmeticGenerator';
import { saveUnlockedAchievement } from '../data/achievements'; // Assuming we might need this or similar for saving titles/frames
// Actually, we need to return the title/frame objects themselves or IDs. 
// The current signature returns unlockedTitleId?: string. 
// For procedural, we need to return the full definition so it can be added to the state.
// But the signature is fixed in the tool call. I should check if I can change the signature or if I need to adapt.
// The signature is: { xp: number; rewards: string[]; equipment: Equipment[]; unlockedTitleId?: string; unlockedFrameId?: string }
// I should probably return `newTitle?: TitleDefinition` and `newFrame?: FrameDefinition`.
// But I need to update the caller too.
// Let's check where calculateDungeonRewards is called. It's likely in DungeonsView or store.
// Since I am overhauling DungeonsView, I can change the signature here and update DungeonsView later.
// But wait, `saveUnlockedAchievement` is for achievements. Titles/Frames are stored in `state.stats.unlockedTitleIds`.
// For procedural items, we need to store the DEFINITION in `state` as well, not just the ID, because they are generated.
// This implies I need to add `customTitles` and `customFrames` to AppState.
// This is a bigger change.
// Let's stick to the plan: "Update dungeons/rewardGenerator.ts to drop procedural cosmetics".
// I will modify the return type to include `proceduralTitle` and `proceduralFrame`.

// I need to import TitleDefinition and FrameDefinition.
import { TitleDefinition, FrameDefinition } from '../data/titles';

export const calculateDungeonRewards = (dungeon: Dungeon, victory: boolean, playerLevel: number): {
    xp: number;
    rewards: string[];
    equipment: Equipment[];
    unlockedTitleId?: string;
    unlockedFrameId?: string;
    proceduralTitle?: TitleDefinition;
    proceduralFrame?: FrameDefinition;
} => {
    if (!victory) {
        return { xp: Math.floor(dungeon.rewards.xp * 0.1), rewards: [], equipment: [] }; // 10% XP for failure
    }

    const rewards: string[] = [];
    const equipment: Equipment[] = [];
    let unlockedTitleId: string | undefined;
    let unlockedFrameId: string | undefined;
    let proceduralTitle: TitleDefinition | undefined;
    let proceduralFrame: FrameDefinition | undefined;

    // XP Variance
    const xp = Math.floor(dungeon.rewards.xp * (1 + Math.random() * 0.2));

    // Generic loot
    dungeon.rewards.items.forEach(item => {
        if (Math.random() > 0.5) rewards.push(item);
    });

    // Equipment Drops
    // Guaranteed drop
    const item = generateEquipment(undefined, undefined, playerLevel, 3);
    equipment.push(item);

    // Extra drop based on drop rates
    if (Math.random() < dungeon.rewards.dropRates.rare) {
        const extraItem = generateEquipment(undefined, undefined, playerLevel, 4);
        equipment.push(extraItem);
    }

    // Procedural Cosmetic Drops
    // Chance based on dungeon difficulty/floor (implied by dropRates)
    // We use 'celestial' and 'transcendent' rates for this, or just a small chance for high floors.

    // Extract floor number from ID "dungeon_123"
    const floor = parseInt(dungeon.id.split('_')[1] || '1');

    // Procedural Title Chance (e.g., 5% chance on boss floors, 0.5% on normal)
    const isBoss = floor % 10 === 0;
    const titleChance = isBoss ? 0.1 : 0.005;

    if (Math.random() < titleChance) {
        proceduralTitle = generateProceduralTitle(floor);
        rewards.push(`New Title: ${proceduralTitle.name}`);
    }

    // Procedural Frame Chance
    const frameChance = isBoss ? 0.05 : 0.001;
    if (Math.random() < frameChance) {
        proceduralFrame = generateProceduralFrame(floor);
        rewards.push(`New Frame: ${proceduralFrame.name}`);
    }

    return { xp, rewards, equipment, unlockedTitleId, unlockedFrameId, proceduralTitle, proceduralFrame };
};
