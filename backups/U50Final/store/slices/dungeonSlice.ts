import { StateCreator } from 'zustand';
import { DungeonRunResult, BossDefinition, Shadow } from '@/types';
import { ALL_DUNGEONS } from '@/dungeons/dungeonGenerator';
import { calculateDungeonRewards } from '@/dungeons/rewardGenerator';
import { createLog } from '@/store/utils';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { recomputeTitlesAndFrames } from './userSlice';
import { calculateLevel } from '@/utils/progression';
import { calculateTotalPower } from '@/store/selectors';
import { GameStore } from '@/store/useStore';

export interface DungeonSlice {
    startDungeonRun: (dungeonId: string) => { result: DungeonRunResult, boss?: BossDefinition } | null;
    extractShadow: (boss: BossDefinition) => { success: boolean; message: string; shadow?: Shadow };
    closeDungeonResult: () => void;
    equipShadow: (shadowId: string) => void;
}

import { getDungeon } from '@/dungeons/dungeonGenerator';

export const createDungeonSlice: StateCreator<GameStore, [], [], DungeonSlice> = (set, get) => ({
    startDungeonRun: (dungeonId) => {
        try {
            let dungeon = ALL_DUNGEONS.find(d => d.id === dungeonId);

            // Infinite Dungeon Support
            if (!dungeon && dungeonId.startsWith('dungeon_')) {
                const floor = parseInt(dungeonId.split('_')[1]);
                if (!isNaN(floor)) {
                    dungeon = getDungeon(floor);
                }
            }

            if (!dungeon) {
                console.error(`Dungeon not found: ${dungeonId}`);
                return null;
            }

            const state = get().state;

            // 1. Calculate Power
            let userPower = calculateTotalPower(state);

            // Fallback if power is 0 (debug)
            if (userPower === 0 && state.stats) {
                console.warn("calculateTotalPower returned 0. Using fallback.");
                const SCALE = 12;
                const statTotal = (state.stats.strength + state.stats.vitality + state.stats.agility + state.stats.intelligence + state.stats.fortune + state.stats.metabolism);
                userPower = statTotal * SCALE * 10;
            }

            const requiredPower = dungeon.recommendedPower || 0;

            // 2. Determine Outcome
            const victory = userPower >= requiredPower;

            console.log(`[Dungeon] ${dungeon.name} | User: ${userPower} vs Req: ${requiredPower} | Victory: ${victory}`);

            // 3. Calculate Rewards
            const { xp, rewards, equipment, unlockedTitleId, unlockedFrameId, proceduralTitle, proceduralFrame } = calculateDungeonRewards(dungeon, victory, state.stats.level);

            const boss = dungeon.boss;

            const runResult: DungeonRunResult = {
                id: crypto.randomUUID(),
                dungeonId: dungeon.id,
                bossId: boss?.id,
                victory,
                timestamp: new Date().toISOString(),
                xpEarned: xp,
                rewards: [...rewards, ...equipment.map(e => e.name)],
                equipment: equipment,
                unlockedTitleId: unlockedTitleId,
                unlockedFrameId: unlockedFrameId
            };

            set((store) => {
                let nextState = { ...store.state };
                let prev = store.state;

                // Only apply rewards on victory
                if (victory) {
                    nextState.dungeonRuns = [runResult, ...(nextState.dungeonRuns || [])];
                    let newRewardQueue = [...(prev.rewardQueue || [])];

                    // Add Equipment
                    if (equipment.length > 0) {
                        nextState.inventory = [...nextState.inventory, ...equipment];
                        equipment.forEach(item => {
                            nextState.logs.unshift(createLog('System', 'Dungeon Loot', `Obtained: ${item.name} (${item.rarity})`));
                            newRewardQueue.push({
                                id: `dungeon_equip_${item.id}`,
                                type: 'item',
                                name: item.name,
                                rarity: item.rarity,
                                icon: '🛡️'
                            });
                        });
                    }

                    // Handle Title Unlock
                    if (unlockedTitleId && !nextState.stats.unlockedTitleIds.includes(unlockedTitleId as any)) {
                        nextState.stats.unlockedTitleIds.push(unlockedTitleId as any);
                        const titleDef = TITLES?.find(t => t.id === unlockedTitleId);
                        if (titleDef) {
                            nextState.logs.unshift(createLog('System', 'Dungeon Reward', `Unlocked Title: ${titleDef.name}`));
                        }
                    }

                    // Handle Procedural Title
                    // Let's assume I updated line 49 in the same file. 
                    // I will use a multi-replace to update both line 49 and the handling logic here.

                    // Handle Frame Unlock
                    if (unlockedFrameId && !nextState.stats.unlockedFrameIds.includes(unlockedFrameId as any)) {
                        nextState.stats.unlockedFrameIds.push(unlockedFrameId as any);
                        const frameDef = AVATAR_FRAMES?.find(f => f.id === unlockedFrameId);
                        if (frameDef) {
                            nextState.logs.unshift(createLog('System', 'Dungeon Reward', `Unlocked Frame: ${frameDef.name}`));
                        }
                    }

                    // Handle Shadow Extraction
                    if (boss && boss.canExtract && boss.shadowData) {
                        const alreadyHas = nextState.shadows.some(s => s.name === boss.shadowData!.name);
                        if (!alreadyHas) {
                            const newShadow: Shadow = {
                                id: crypto.randomUUID(),
                                name: boss.shadowData!.name,
                                rank: boss.shadowData!.rank,
                                image: boss.shadowData!.image,
                                bonus: boss.shadowData!.bonus,
                                isEquipped: false,
                                extractedAt: new Date().toISOString(),
                                // Evolution System
                                evolutionLevel: 0,
                                experiencePoints: 0,
                                xpToNextEvolution: 500
                            };
                            nextState.shadows = [...nextState.shadows, newShadow];
                            nextState.logs.unshift(createLog('System', 'Shadow Extraction', `ARISE! ${newShadow.name} has joined your army.`));
                        }
                    }

                    // Apply XP
                    let newStats = { ...nextState.stats };
                    const { level, xp: newXp, leveledUp, xpForNextLevel } = calculateLevel(newStats.level, newStats.xpCurrent + xp);

                    newStats.level = level;
                    newStats.xpCurrent = newXp;
                    newStats.xpForNextLevel = xpForNextLevel;

                    if (leveledUp) {
                        newStats.strength += 1;
                        newStats.vitality += 1;
                        newStats.agility += 1;
                        newStats.intelligence += 1;
                        newStats.fortune += 1;
                        newStats.metabolism += 1;

                        nextState.justLeveledUp = true;
                        nextState.logs.unshift(createLog('LevelUp', `LEVEL UP – ${level}`, 'Your power grows.', { levelChange: { from: prev.stats.level, to: level } }));

                        // Add Level Up Reward to Queue
                        newRewardQueue.push({
                            id: `levelup_${level}_${Date.now()}`,
                            type: 'levelup',
                            name: `Level ${level}`,
                            description: 'Stats Increased',
                            value: 0,
                            icon: '⚡',
                            powerGain: 1000
                        });
                    }

                    nextState.stats = newStats;
                    nextState.rewardQueue = newRewardQueue;

                    const logEntry = createLog(
                        'System',
                        'Dungeon Cleared',
                        `Defeated ${dungeon.name}. Rewards: ${xp} XP.`,
                        { xpChange: xp }
                    );
                    nextState.logs.unshift(logEntry);

                    // Award Shards (New Feature)
                    // Base shards + difficulty multiplier
                    const rankMultipliers: Record<string, number> = { 'E': 1, 'D': 2, 'C': 3, 'B': 4, 'A': 5, 'S': 6, 'SS': 8, 'SSS': 10 };
                    const difficultyMultiplier = rankMultipliers[dungeon.difficulty as string] || 1;
                    const shardReward = Math.floor(10 * (1 + difficultyMultiplier * 0.5));
                    nextState.shards += shardReward;
                    nextState.logs.unshift(createLog('System', 'Dungeon Reward', `Obtained ${shardReward} Shards`));
                    newRewardQueue.push({
                        id: `dungeon_shards_${Date.now()}`,
                        type: 'item',
                        name: `${shardReward} Shards`,
                        rarity: 'rare',
                        icon: '✨'
                    });

                    // Update result with shards earned
                    runResult.shardsEarned = shardReward;

                    // Shadow Evolution: Grant XP to equipped shadow
                    if (nextState.equippedShadowId) {
                        const shadowIndex = nextState.shadows.findIndex(s => s.id === nextState.equippedShadowId);
                        if (shadowIndex !== -1) {
                            const shadow = { ...nextState.shadows[shadowIndex] };

                            // Ensure evolution fields exist (migration for old saves)
                            if (typeof shadow.evolutionLevel !== 'number') shadow.evolutionLevel = 0;
                            if (typeof shadow.experiencePoints !== 'number') shadow.experiencePoints = 0;
                            if (typeof shadow.xpToNextEvolution !== 'number') shadow.xpToNextEvolution = 500;

                            // Grant XP based on dungeon difficulty
                            const shadowXpGain = Math.floor(xp * 0.2); // 20% of dungeon XP goes to shadow
                            shadow.experiencePoints += shadowXpGain;

                            // Check for evolution
                            if (shadow.experiencePoints >= shadow.xpToNextEvolution && shadow.evolutionLevel < 2) {
                                shadow.evolutionLevel += 1;
                                shadow.bonus = {
                                    ...shadow.bonus,
                                    value: shadow.bonus.value + (shadow.evolutionLevel * 5) // Increase bonus on evolution
                                };

                                const stageName = shadow.evolutionLevel === 1 ? 'Elite' : 'Marshal';
                                nextState.logs.unshift(createLog('System', 'Shadow Evolution', `${shadow.name} has evolved to ${shadow.name} ${stageName}!`));

                                // Set next evolution threshold
                                shadow.xpToNextEvolution = shadow.evolutionLevel === 1 ? 2000 : Infinity;

                                // Add evolution to reward queue
                                newRewardQueue.push({
                                    id: `shadow_evolve_${shadow.id}_${Date.now()}`,
                                    type: 'item',
                                    name: `${shadow.name} ${stageName}`,
                                    rarity: 'legendary',
                                    icon: '👑'
                                });
                            }

                            const updatedShadows = [...nextState.shadows];
                            updatedShadows[shadowIndex] = shadow;
                            nextState.shadows = updatedShadows;
                        }
                    }
                } else {
                    // Defeat Logic
                    const logEntry = createLog(
                        'System',
                        'Dungeon Failed',
                        `Failed to clear ${dungeon.name}. Recommended Power: ${requiredPower}`,
                    );
                    nextState.logs.unshift(logEntry);
                }

                nextState.isDungeonResultVisible = true;
                nextState.lastDungeonResult = runResult;

                // Check Achievements
                return { state: recomputeTitlesAndFrames(nextState) };
            });

            return { result: runResult, boss: dungeon.boss };
        } catch (error) {
            console.error("Failed to start dungeon run:", error);
            return null;
        }
    },

    extractShadow: (boss) => {
        return { success: false, message: "Shadows are now extracted automatically upon boss defeat." };
    },

    closeDungeonResult: () => {
        set((store) => ({
            state: {
                ...store.state,
                isDungeonResultVisible: false,
                lastDungeonResult: null
            }
        }));
    },

    equipShadow: (shadowId) => {
        set((store) => {
            const shadow = store.state.shadows.find(s => s.id === shadowId);
            if (!shadow) return {};
            if (store.state.equippedShadowId === shadowId) {
                return { state: { ...store.state, equippedShadowId: null } };
            }
            return { state: { ...store.state, equippedShadowId: shadowId } };
        });
    }
});

