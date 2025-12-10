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
import { v4 as uuidv4 } from 'uuid';

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

            // Enforce Zone Gating
            // Cannot start a dungeon if it's beyond the max unlocked floor of the current zone
            // Logic: Dungeon floor must be <= zone.maxUnlockedFloor
            if (dungeonId.startsWith('dungeon_')) {
                const floor = parseInt(dungeonId.split('_')[1] || '0');
                // Ensure zone state is initialized, default to 150 (Zone 1 limit)
                const currentZone = state.zone?.currentZone || 1;
                const maxUnlocked = state.zone?.maxUnlockedFloor || 150;

                // Strict Check: If floor > maxUnlocked, BLOCK IT.
                // Exception: If we just beat the boss, the maxUnlocked should have increased.
                if (floor > maxUnlocked) {
                    console.warn(`[ZoneGuard] Blocked entry to Floor ${floor}. Zone limit is ${maxUnlocked}.`);

                    set((store) => ({
                        state: {
                            ...store.state,
                            logs: [
                                createLog('Sistema', 'Zona Bloqueada', `¡ALTO! Debes derrotar al Jefe de Zona (Piso ${maxUnlocked}) para avanzar.`),
                                ...store.state.logs
                            ]
                        }
                    }));
                    return null;
                }
            }


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
            const { xp, rewards, equipment, unlockedTitleId, unlockedFrameId } = calculateDungeonRewards(dungeon, victory, state.stats.level);

            const boss = dungeon.boss;

            const runResult: DungeonRunResult = {
                id: uuidv4(),
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

                    // Calculate Shards early so we can include in currency card
                    const rankMultipliers: Record<string, number> = { 'E': 1, 'D': 2, 'C': 3, 'B': 4, 'A': 5, 'S': 6, 'SS': 8, 'SSS': 10 };
                    const difficultyMultiplier = rankMultipliers[dungeon.difficulty as string] || 1;
                    const shardReward = Math.floor(10 * (1 + difficultyMultiplier * 0.3)); // Reduced: missions should be main shard source

                    // Add combined XP + Shards Currency Card (displays side by side)
                    newRewardQueue.push({
                        id: `dungeon_currency_${Date.now()}`,
                        type: 'currency',
                        name: `${dungeon.name} Cleared`,
                        value: xp,
                        shards: shardReward,
                        icon: '💎'
                    });

                    // Add Equipment
                    if (equipment.length > 0) {
                        nextState.inventory = [...nextState.inventory, ...equipment];
                        equipment.forEach(item => {
                            nextState.logs.unshift(createLog('Sistema', 'Botín de Mazmorra', `Obtenido: ${item.name} (${item.rarity})`));
                            newRewardQueue.push({
                                id: `dungeon_equip_${item.id}`,
                                type: 'item',
                                name: item.name,
                                rarity: item.rarity,
                                icon: '🛡️',
                                stats: item.baseStats?.map(s => ({ stat: s.stat, value: s.value }))
                            });
                        });
                    }

                    // Handle Title Unlock
                    if (unlockedTitleId && !nextState.stats.unlockedTitleIds.includes(unlockedTitleId as any)) {
                        nextState.stats.unlockedTitleIds.push(unlockedTitleId as any);
                        const titleDef = TITLES?.find(t => t.id === unlockedTitleId);
                        if (titleDef) {
                            nextState.logs.unshift(createLog('Sistema', 'Recompensa de Mazmorra', `Título Desbloqueado: ${titleDef.name}`));
                        }
                    }

                    // Handle Frame Unlock (Standard)
                    if (unlockedFrameId && !nextState.stats.unlockedFrameIds.includes(unlockedFrameId as any)) {
                        nextState.stats.unlockedFrameIds.push(unlockedFrameId as any);
                        const frameDef = AVATAR_FRAMES?.find(f => f.id === unlockedFrameId);
                        console.log('[DEBUG] Frame unlock attempt:', unlockedFrameId, 'Found in AVATAR_FRAMES:', !!frameDef);
                        if (frameDef) {
                            nextState.logs.unshift(createLog('Sistema', 'Recompensa de Mazmorra', `Marco Desbloqueado: ${frameDef.name}`));
                        } else {
                            // Frame ID not found in static list - log anyway for debugging
                            nextState.logs.unshift(createLog('Sistema', 'Sistema', `Marco añadido (ID: ${unlockedFrameId})`));
                        }
                    }

                    // Handle Shadow Extraction
                    if (boss && boss.canExtract && boss.shadowData) {
                        const alreadyHas = nextState.shadows.some(s => s.name === boss.shadowData!.name);
                        if (!alreadyHas) {
                            const newShadow: Shadow = {
                                id: uuidv4(),
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
                            nextState.logs.unshift(createLog('Sistema', 'Extracción de Sombra', `¡SURGE! ${newShadow.name} se ha unido a tu ejército.`));

                            // GRANT SHADOW TITLE
                            // Fixed title based on Shadow Name
                            const titleId = `shadow_master_${boss.id}` as any;
                            const titleName = `Monarch of ${boss.shadowData!.name}`;

                            // Check if ALREADY has this specific shadow title
                            if (!nextState.stats.unlockedTitleIds.includes(titleId)) {
                                // Unlock the Title ID (Definition is now in TITLES via SHADOW_TITLES)
                                nextState.stats.unlockedTitleIds.push(titleId);

                                nextState.logs.unshift(createLog('Sistema', 'Título Desbloqueado', `Título obtenido: ${titleName}`));

                                // Add to Reward Queue
                                newRewardQueue.push({
                                    id: `shadow_title_${titleId}_${Date.now()}`,
                                    type: 'title',
                                    name: titleName,
                                    description: `Sombra extraída de ${boss.name}.`,
                                    icon: '👻', // Ghost emoji for notification (better than people)
                                    rarity: 'mythic'
                                });
                            }
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
                        nextState.logs.unshift(createLog('Subida de Nivel', `NIVEL ALCANZADO – ${level}`, 'Tu poder aumenta.', { levelChange: { from: prev.stats.level, to: level } }));

                        // Add Level Up Reward to Queue
                        newRewardQueue.push({
                            id: `levelup_${level}_${Date.now()}`,
                            type: 'levelup',
                            name: `Nivel ${level}`,
                            description: 'Estadísticas Aumentadas',
                            value: 0,
                            icon: '⚡',
                            powerGain: 1000
                        });
                    }

                    nextState.stats = newStats;
                    nextState.rewardQueue = newRewardQueue;

                    const logEntry = createLog(
                        'Sistema',
                        'Mazmorra Completada',
                        `Derrotado ${dungeon.name}. Recompensas: ${xp} XP.`,
                        { xpChange: xp }
                    );
                    nextState.logs.unshift(logEntry);

                    // Award Shards (already calculated and included in currency card above)
                    nextState.shards += shardReward;
                    nextState.logs.unshift(createLog('Sistema', 'Recompensa de Mazmorra', `Obtenidos ${shardReward} Fragmentos`));

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
                                nextState.logs.unshift(createLog('Sistema', 'Evolución de Sombra', `¡${shadow.name} ha evolucionado a ${shadow.name} ${stageName}!`));

                                // Set next evolution threshold
                                shadow.xpToNextEvolution = shadow.evolutionLevel === 1 ? 2000 : Infinity;

                                // Add evolution to reward queue
                                newRewardQueue.push({
                                    id: `shadow_evolve_${shadow.id}_${Date.now()}`,
                                    type: 'shadow',
                                    name: `${shadow.name} ${stageName}`,
                                    rarity: 'legendary',
                                    icon: 'Ghost',
                                    stats: [{ stat: shadow.bonus.stat, value: shadow.bonus.value }]
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
                        'Sistema',
                        'Mazmorra Fallida',
                        `Fallo al limpiar ${dungeon.name}. Poder Recomendado: ${requiredPower}`,
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

