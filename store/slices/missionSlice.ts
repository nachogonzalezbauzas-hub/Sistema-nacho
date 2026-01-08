import { StateCreator } from 'zustand'; // HMR Trigger
import { Mission, Milestone, MilestoneCategory, MilestonePhase, MilestoneReward, RankTier, UserStats, QuestShopItem, ItemRarity } from '@/types';
import { createLog, isSameDay, getDateKey } from '@/store/utils';
import { DEFAULT_SEASON } from '@/store/defaults';
import { LIFE_GOALS } from '@/utils/lifeGoals';
import { recomputeTitlesAndFrames } from './userSlice';
import { calculateLevel, calculateLevelUp } from '@/utils/progression';
import { BUFF_DEFINITIONS } from '@/data/buffs';
import { generateDailyQuests, checkQuestCompletion } from '@/utils/questGenerator';
import type { GameStore } from '@/store/useStore';
import { CORE_MISSIONS } from '@/data/coreMissions';
import { DAILY_MISSION_POOL } from '@/data/dailyMissionPool';
import { v4 as uuidv4 } from 'uuid';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { generateEquipment } from '@/data/equipmentGenerator';
// Redundant import removed
// NEW STATIC GENERATOR
import { getHunterRank } from '@/utils/rankSystem';


export interface MissionSlice {
    addMission: (mission: Mission) => void;
    completeMission: (missionId: string) => void;
    addMilestone: (milestoneInput: {
        title: string;
        description: string;
        category: MilestoneCategory;
        targetDate?: string;
        phases: Omit<MilestonePhase, "id" | "completedActions" | "isCompleted">[];
        reward: MilestoneReward;
    }) => void;
    incrementMilestonePhase: (milestoneId: string) => void;
    claimSeasonReward: (tier: RankTier) => void;
    addRecommendedMission: (mission: Mission) => void;
    syncLifeGoals: () => void;
    refreshDailyQuests: () => void;
    forceRefreshDailyQuests: () => void; // Debug/Testing
    checkAllQuests: () => void;
    claimQuestReward: (questId: string) => void;
    manualCompleteQuest: (questId: string) => void; // U42 - Manual Verification
    purchaseQuestShopItem: (item: QuestShopItem) => void;
    initializeMissions: () => void;
}

export const createMissionSlice: StateCreator<GameStore, [], [], MissionSlice> = (set, get) => ({
    addMission: (mission) => {
        set((store) => ({
            state: {
                ...store.state,
                missions: [...store.state.missions, mission],
                logs: [createLog('Misión', 'Nueva Misión', 'Añadida: ' + mission.title), ...store.state.logs]
            }
        }));
    },

    forceRefreshDailyQuests: () => {
        set((store) => {
            const prev = store.state;
            const newQuests = generateDailyQuests(prev.stats.level);
            const todayKey = new Date().toDateString();

            return {
                state: {
                    ...prev,
                    dailyQuests: newQuests,
                    lastQuestRefresh: todayKey,
                    // Don't reset streak on force refresh for UX niceness during testing
                }
            };
        });
    },

    refreshDailyQuests: () => {
        set((store) => {
            const prev = store.state;
            const now = new Date();
            const todayKey = getDateKey(now);

            if (prev.lastQuestRefresh === todayKey) {
                return {}; // Already refreshed today
            }

            const newQuests = generateDailyQuests(prev.stats.level);

            // Reset streak if not all quests were completed yesterday
            let currentStreak = prev.stats.streak;
            if (prev.lastQuestRefresh) {
                const yesterdayKey = getDateKey(new Date(now.setDate(now.getDate() - 1)));
                if (prev.lastQuestRefresh === yesterdayKey) {
                    const allCompletedYesterday = prev.dailyQuests.every(q => q.completed);
                    if (allCompletedYesterday) {
                        currentStreak++;
                    } else {
                        currentStreak = 0;
                    }
                } else {
                    currentStreak = 0; // Missed a day
                }
            } else {
                currentStreak = 0; // First time refreshing
            }

            return {
                state: {
                    ...prev,
                    dailyQuests: newQuests,
                    lastQuestRefresh: todayKey,
                    stats: {
                        ...prev.stats,
                        streak: currentStreak,
                    },
                    logs: [createLog('Misión', 'Daily Quests', 'Refrescadas'), ...prev.logs]
                }
            };
        });
    },

    manualCompleteQuest: (questId) => {
        set((store) => {
            try {
                const prev = store.state;
                // Use map for cleaner immutable update
                const updatedQuests = prev.dailyQuests.map(q =>
                    q.id === questId
                        ? { ...q, completed: true, condition: { ...q.condition, current: q.condition.target } }
                        : q
                );

                const quest = prev.dailyQuests.find(q => q.id === questId);

                if (!quest) {
                    console.error("Quest not found:", questId);
                    return {};
                }

                if (quest.completed) {
                    console.warn("Quest already completed:", quest.title);
                    return {};
                }

                // 2. Grant Logic (XP + Rewards)
                let nextState = { ...prev };

                // XP Reward (Base 50 + Level Scaling)
                // Ensure stats exists
                if (!prev.stats) {
                    console.error("Stats missing in manualCompleteQuest");
                    return {};
                }

                const levelMultiplier = 1 + (prev.stats.level * 0.1);
                const xpReward = Math.floor(50 * levelMultiplier);

                // Add Reward to Queue
                const newRewardQueue = nextState.rewardQueue ? [...nextState.rewardQueue] : [];
                newRewardQueue.push({
                    id: `daily_${quest.id}_${Date.now()}`,
                    type: 'currency',
                    name: quest.title,
                    rarity: 'common',
                    icon: 'Zap',
                    value: xpReward,
                    description: `Reward for: ${quest.title}`
                });

                // Apply XP
                // Check if calculateLevelUp is available/working
                const { stats: newStats, levelUp } = calculateLevelUp(prev.stats, xpReward);

                if (levelUp) {
                    newRewardQueue.push({
                        id: `levelup_${newStats.level}`,
                        type: 'levelup',
                        name: 'Level Up!',
                        icon: 'ArrowUpCircle',
                        value: newStats.level
                    });
                }

                // Log
                const newLogs = [...prev.logs];
                newLogs.unshift(createLog('Sistema', 'Daily Quest', `Completada: ${quest.title} (+${xpReward} XP)`));

                // IMPORTANT: Assign updated quests to nextState
                nextState.dailyQuests = updatedQuests;
                nextState.stats = newStats;
                nextState.logs = newLogs;
                nextState.rewardQueue = newRewardQueue;

                // console.log("Manual Quest Complete Success:", quest.title);
                return { state: nextState };

            } catch (error) {
                console.error("CRITICAL ERROR in manualCompleteQuest:", error);
                // Return unchanged state on error to prevent corruption, but maybe log it visibly
                const logs = [createLog('Sistema', 'Error', `Crash en misión: ${error}`), ...store.state.logs];
                return { state: { ...store.state, logs } };
            }
        });
    },

    completeMission: (missionId) => {
        set((store) => {
            const prev = store.state;
            const missionIndex = prev.missions.findIndex(m => m.id === missionId);
            if (missionIndex === -1) return {};

            const mission = prev.missions[missionIndex];
            const now = new Date();

            if (mission.lastCompletedAt && isSameDay(new Date(mission.lastCompletedAt), now)) {
                return {};
            }

            let missionStreak = (mission.streak || 0) + 1;
            if (mission.lastCompletedAt) {
                const last = new Date(mission.lastCompletedAt);
                last.setHours(0, 0, 0, 0);
                const today = new Date(now);
                today.setHours(0, 0, 0, 0);

                // If completed today, don't increase streak (already handled by early return, but safe check)
                if (last.getTime() === today.getTime()) {
                    return {};
                }

                // Calculate expected previous date based on schedule
                let expectedPreviousDate = new Date(today);
                expectedPreviousDate.setDate(today.getDate() - 1);

                if (mission.daysOfWeek && mission.daysOfWeek.length > 0) {
                    // Find the most recent scheduled day strictly before today
                    let daysBack = 1;
                    while (daysBack <= 7) {
                        const checkDate = new Date(today);
                        checkDate.setDate(today.getDate() - daysBack);
                        const dayIndex = checkDate.getDay();
                        if (mission.daysOfWeek.includes(dayIndex)) {
                            expectedPreviousDate = checkDate;
                            break;
                        }
                        daysBack++;
                    }
                }

                // Check if the last completion was on (or after) the expected previous date
                // If last completion was BEFORE the expected date, it means we missed a scheduled day.
                // Example: Gym (M,W,F). Today Mon. Expected Prev: Fri.
                // If Last = Fri, OK. If Last = Wed, Missed Fri -> Reset.

                // We allow a small buffer (e.g. maybe they did it late night?) 
                // But strictly: last >= expectedPreviousDate
                if (last.getTime() < expectedPreviousDate.getTime()) {
                    missionStreak = 1; // Streak broken
                }
            }

            const globalStreak = prev.stats.streak + 1;

            let nextState = { ...prev };
            const logs = [...nextState.logs];
            let newStats = { ...nextState.stats };
            const prevLevel = newStats.level;

            const streakMultiplier = 1 + (globalStreak * 0.05);
            const buffMultiplier = (() => {
                const activeDefs = nextState.activeBuffs
                    .filter(b => new Date(b.expiresAt) > now)
                    .map(b => BUFF_DEFINITIONS.find(d => d.id === b.id)!)
                    .filter(Boolean);
                return activeDefs.reduce((acc, def) => acc * (def.xpMultiplier || 1), 1);
            })();

            // Level Scaling for XP (2% increase per level - REBALANCED V2.0)
            const levelMultiplier = 1 + (newStats.level * 0.02);
            // MISSION BOOST: Removed in V2.0 to prevent bloat. Relying on base XP buffs.
            const earnedXp = Math.floor(mission.xpReward * streakMultiplier * buffMultiplier * levelMultiplier);

            newStats.xpCurrent += earnedXp;

            // === GUARANTEED SHARD REWARD FOR MISSIONS ===
            // Base 15-40 shards, scaling with level and streak
            const baseShards = 15 + Math.floor(Math.random() * 25);
            const shardReward = Math.floor(baseShards * (1 + globalStreak * 0.1) * (1 + newStats.level * 0.05));
            nextState.shards = (nextState.shards || 0) + shardReward;
            logs.unshift(createLog('Sistema', 'Recompensa de Misión', `+${shardReward} Fragmentos por completar ${mission.title}`));

            // --- SEASON XP (Hunter Rank) ---
            if (nextState.currentSeason) {
                const seasonXpReward = Math.max(10, Math.floor(earnedXp * 0.25));
                nextState.currentSeason.seasonXP += seasonXpReward;

                const newRank = getHunterRank(nextState.currentSeason.seasonXP);
                if (newRank !== nextState.currentSeason.rank) {
                    nextState.currentSeason.rank = newRank;

                    // Log Rank Up
                    logs.unshift(createLog('Sistema', 'Rango Subido', `¡Has alcanzado el Rango ${newRank}!`));

                    // Add Notification Reward
                    if (!nextState.rewardQueue) nextState.rewardQueue = [];
                    nextState.rewardQueue.push({
                        id: `rank_up_${newRank}_${Date.now()}`,
                        type: 'season_rank',
                        name: `Rango ${newRank}`,
                        description: 'Hunter Rank Increased',
                        icon: '🏆',
                        value: 0
                    });
                }
            }
            // -------------------------------

            newStats.streak = globalStreak;
            newStats.lastActiveDate = now.toISOString();

            if (mission.targetStat) {
                const statKey = mission.targetStat.toLowerCase() as keyof UserStats;
                if (typeof newStats[statKey] === 'number') {
                    // REBALANCED V2.1: Exactly +1 stat point per mission
                    const statGain = 1;
                    (newStats[statKey] as number) += statGain;
                }
            }

            const { level, xp, leveledUp, xpForNextLevel } = calculateLevel(newStats.level, newStats.xpCurrent);
            newStats.level = level;
            newStats.xpCurrent = xp;
            newStats.xpForNextLevel = xpForNextLevel;

            if (leveledUp) {
                newStats.strength += 1;
                newStats.vitality += 1;
                newStats.agility += 1;
                newStats.intelligence += 1;
                newStats.fortune += 1;
                newStats.metabolism += 1;
                if (newStats.level > 1) nextState.passivePoints += 1;
            }

            const updatedMissions = [...nextState.missions];
            updatedMissions[missionIndex] = { ...mission, lastCompletedAt: now.toISOString(), streak: missionStreak };

            logs.unshift(createLog(
                'Misión',
                'Misión Completada: ' + mission.title,
                '+ ' + earnedXp + ' XP. Stat: ' + mission.targetStat,
                { xpChange: earnedXp, statChange: { stat: mission.targetStat, amount: 1 } }
            ));

            // --- LUCKY DROP SYSTEM (60% Chance - Super Boosted) ---
            const luckyRoll = Math.random();
            if (luckyRoll < 0.60) { // Increased to 60%
                const typeRoll = Math.random();
                let luckyRewardName = '';
                let luckyRewardType = '';

                // Equipment (50%)
                if (typeRoll < 0.50) {
                    // ... Equipment Logic ...
                    // Pass estimatedZone (Zone 2, 3 etc) to boost rarity drops accordingly
                    const estimatedZone = Math.max(1, Math.min(20, Math.ceil(newStats.level / 5)));
                    // Also estimate difficulty for scaling (Level * 5 approx)
                    const estimatedDifficulty = newStats.level * 5;

                    const equipment = generateEquipment(undefined, undefined, newStats.level, estimatedDifficulty, estimatedZone);
                    if (equipment) {
                        nextState.inventory = [...nextState.inventory, equipment];
                        luckyRewardName = equipment.name;
                        luckyRewardType = 'Equipment';
                        logs.unshift(createLog('Sistema', 'Lucky Drop!', `¡Has encontrado: ${equipment.name} (${equipment.rarity})!`));

                        // Add to Reward Queue
                        if (!nextState.rewardQueue) nextState.rewardQueue = [];
                        nextState.rewardQueue.push({
                            id: `lucky_equip_${equipment.id}`,
                            type: 'item',
                            name: equipment.name,
                            rarity: equipment.rarity,
                            icon: 'Shield',
                            stats: equipment.baseStats?.map(s => ({ stat: s.stat, value: s.value }))
                        });
                    }
                }
                // Shards (30%) - Adjusted from 35%
                else if (typeRoll < 0.80) {
                    // ... Shards Logic ...
                    const baseShards = 100 + (newStats.level * 10);
                    const variance = Math.floor(Math.random() * 50);
                    const shards = baseShards + variance;

                    nextState.shards += shards;
                    luckyRewardName = `${shards} Shards`;
                    luckyRewardType = 'Currency';
                    logs.unshift(createLog('Sistema', 'Lucky Drop!', `¡Has encontrado una bolsa de gemas: +${shards} Shards!`));

                    if (!nextState.rewardQueue) nextState.rewardQueue = [];
                    nextState.rewardQueue.push({
                        id: `lucky_shards_${Date.now()}`,
                        type: 'currency',
                        name: 'Lucky Shards',
                        shards: shards,
                        value: 0,
                        icon: 'Gem'
                    });
                }
                // Title (15%) - Adjusted to < 0.95
                else if (typeRoll < 0.95) {
                    const title = TITLES[Math.floor(Math.random() * TITLES.length)];

                    if (!newStats.unlockedTitleIds.includes(title.id)) {
                        newStats.unlockedTitleIds = [...newStats.unlockedTitleIds, title.id];

                        luckyRewardName = `Title: ${title.name}`;
                        luckyRewardType = 'Title';
                        logs.unshift(createLog('Sistema', 'Lucky Drop!', `¡Has desbloqueado Título: ${title.name}!`));
                    }
                }
                // Frame (5%) - The Rest
                else {
                    const frame = AVATAR_FRAMES[Math.floor(Math.random() * AVATAR_FRAMES.length)];

                    if (!newStats.unlockedFrameIds.includes(frame.id)) {
                        newStats.unlockedFrameIds = [...newStats.unlockedFrameIds, frame.id];

                        luckyRewardName = `Frame: ${frame.name}`;
                        luckyRewardType = 'Frame';
                        logs.unshift(createLog('Sistema', 'Lucky Drop!', `¡Has descubierto un Marco Raro: ${frame.name}!`));
                    }
                }
            }

            // Add Mission Reward to Queue (Consolidated)
            if (!nextState.rewardQueue) nextState.rewardQueue = [];
            const rewardItem = {
                id: `mission_reward_${mission.id}_${Date.now()}`,
                type: 'mission_complete' as const,
                name: mission.title,
                value: earnedXp,
                targetStat: mission.targetStat,
                icon: '🎯',
                rarity: 'common' as const
            };
            nextState.rewardQueue = [...nextState.rewardQueue, rewardItem];

            // === LUCKY BONUS REWARD (20% Chance) ===
            // Reinforced Habit Loop: Habits -> Random Loot -> Power
            // SCALING: Depends on Level and Zone
            if (Math.random() < 0.20) {
                const bonusRoll = Math.random();
                let bonusReward = null;
                let bonusLog = '';

                if (bonusRoll < 0.60) {
                    // 60% Chance: Equipment (Power)
                    // Calculate Tier based on Level and Zone
                    const currentZone = nextState.zone?.currentZone || 1;
                    const tier = Math.floor(newStats.level / 20) + (currentZone - 1); // e.g. Lvl 10 Z1 = 0, Lvl 50 Z2 = 2+1=3

                    let rarity: any = 'common';
                    const roll = Math.random();

                    if (tier <= 1) { // Starter
                        if (roll > 0.95) rarity = 'rare';
                        else if (roll > 0.70) rarity = 'uncommon';
                    } else if (tier <= 3) { // Mid Game
                        if (roll > 0.98) rarity = 'legendary';
                        else if (roll > 0.85) rarity = 'epic';
                        else if (roll > 0.60) rarity = 'rare';
                        else rarity = 'uncommon';
                    } else { // High End (Zone 2+)
                        if (roll > 0.99) rarity = 'magma'; // Zone Rarity Chance!
                        else if (roll > 0.95) rarity = 'legendary';
                        else if (roll > 0.80) rarity = 'epic';
                        else rarity = 'rare';
                    }

                    const equipment = generateEquipment(undefined, rarity, newStats.level);
                    bonusReward = equipment;
                    bonusLog = `¡Suerte! Encontraste ${equipment.name} (${rarity})`;

                    // Fix: Map Equipment to RewardItem type
                    nextState.rewardQueue.push({
                        id: `bonus_equip_${equipment.id}`,
                        type: 'item',
                        name: equipment.name,
                        rarity: equipment.rarity,
                        icon: '⚔️', // Generic icon, UI handles specific icons based on name/type usually
                        stats: equipment.baseStats?.map(s => ({ stat: s.stat, value: s.value })),
                        value: 0
                    });

                    // Add to inventory
                    if (!nextState.inventory) nextState.inventory = [];
                    nextState.inventory.push(equipment);

                } else if (bonusRoll < 0.90) {
                    // 30% Chance: Shards (Scales with Level)
                    const baseShards = 10;
                    const levelBonus = Math.floor(newStats.level * 0.5);
                    const shardsAmount = Math.floor(Math.random() * 40) + baseShards + levelBonus;

                    if (!nextState.shards) nextState.shards = 0;
                    nextState.shards += shardsAmount;

                    bonusLog = `¡Suerte! Encontraste ${shardsAmount} Fragmentos`;
                    nextState.rewardQueue.push({
                        id: `bonus_shards_${Date.now()}`,
                        type: 'item',
                        name: `${shardsAmount} Fragmentos`,
                        rarity: 'rare',
                        icon: '✨'
                    });

                } else if (bonusRoll < 0.99) {
                    // 9% Chance: Title
                    const title = TITLES[Math.floor(Math.random() * TITLES.length)];
                    bonusLog = `¡Increíble! Desbloqueaste Título: ${title.name}`;

                    if (!newStats.unlockedTitleIds.includes(title.id)) {
                        newStats.unlockedTitleIds = [...newStats.unlockedTitleIds, title.id];
                    }

                } else {
                    // 1% Chance: Frame
                    const frame = AVATAR_FRAMES[Math.floor(Math.random() * AVATAR_FRAMES.length)];
                    bonusLog = `¡Mítico! Marco Hallado: ${frame.name}`;

                    if (!newStats.unlockedFrameIds.includes(frame.id)) {
                        newStats.unlockedFrameIds = [...newStats.unlockedFrameIds, frame.id];
                    }
                }

                // Log the Lucky Drop
                if (bonusLog) {
                    logs.unshift(createLog('Sistema', 'Bonus Hallado', bonusLog));
                }
            }

            if (leveledUp) {
                logs.unshift(createLog(
                    'Subida de Nivel',
                    'NIVEL ALCANZADO – ' + newStats.level,
                    'Tu presencia se siente más pesada.',
                    { levelChange: { from: prevLevel, to: newStats.level } }
                ));

                // Add Level Up Reward to Queue
                if (!nextState.rewardQueue) nextState.rewardQueue = [];
                nextState.rewardQueue = [...nextState.rewardQueue, {
                    id: 'levelup_' + newStats.level + '_' + Date.now(),
                    type: 'levelup',
                    name: 'Level ' + newStats.level,
                    value: 0,
                    icon: '⚡',
                    powerGain: 1000
                }];
            }

            nextState.stats = newStats;
            nextState.missions = updatedMissions;
            nextState.justLeveledUp = leveledUp;
            nextState.logs = logs;

            const dateKey = getDateKey(now);
            if (!nextState.dailyActivity) nextState.dailyActivity = {};
            if (!nextState.dailyActivity[dateKey]) {
                nextState.dailyActivity[dateKey] = { missionsCompleted: 0, xpGained: 0 };
            }
            nextState.dailyActivity[dateKey].missionsCompleted += 1;
            nextState.dailyActivity[dateKey].xpGained += mission.xpReward;

            // Monarch's Domain logic removed per user request

            // Update Daily Quests progress
            const questCheckContext = {
                missionsCompletedToday: nextState.dailyActivity[dateKey].missionsCompleted,
                currentStats: nextState.stats,
                streak: nextState.stats.streak
            };

            const updatedDailyQuests = nextState.dailyQuests.map(q => checkQuestCompletion(q, questCheckContext));
            nextState.dailyQuests = updatedDailyQuests;

            // Check Achievements
            return { state: recomputeTitlesAndFrames(nextState) };
        });
    },

    addMilestone: (milestoneInput) => {
        const newMilestone: Milestone = {
            id: uuidv4(),
            title: milestoneInput.title,
            description: milestoneInput.description,
            category: milestoneInput.category,
            createdAt: new Date().toISOString(),
            targetDate: milestoneInput.targetDate,
            phases: milestoneInput.phases.map(p => ({
                ...p,
                id: uuidv4(),
                completedActions: 0,
                isCompleted: false
            })),
            currentPhaseIndex: 0,
            isCompleted: false,
            progressPercent: 0,
            reward: milestoneInput.reward
        };

        set((store) => {
            const logs = [...store.state.logs];
            logs.unshift(createLog('Sistema', 'Misión Épica Iniciada', 'Comenzada: ' + newMilestone.title));
            return {
                state: {
                    ...store.state,
                    milestones: [...store.state.milestones, newMilestone],
                    logs
                }
            };
        });
    },

    incrementMilestonePhase: (milestoneId) => {
        set((store) => {
            const prev = store.state;
            const milestoneIndex = prev.milestones.findIndex(m => m.id === milestoneId);
            if (milestoneIndex === -1) return {};

            const milestone = { ...prev.milestones[milestoneIndex] };
            if (milestone.isCompleted) return {};

            const currentPhase = { ...milestone.phases[milestone.currentPhaseIndex] };
            currentPhase.completedActions = Math.min(currentPhase.requiredActions, currentPhase.completedActions + 1);

            if (currentPhase.completedActions >= currentPhase.requiredActions) {
                currentPhase.isCompleted = true;
            }

            const updatedPhases = [...milestone.phases];
            updatedPhases[milestone.currentPhaseIndex] = currentPhase;
            milestone.phases = updatedPhases;

            if (currentPhase.isCompleted && milestone.currentPhaseIndex < milestone.phases.length - 1) {
                milestone.currentPhaseIndex += 1;
            }

            const totalActions = milestone.phases.reduce((acc, p) => acc + p.requiredActions, 0);
            const completedActions = milestone.phases.reduce((acc, p) => acc + p.completedActions, 0);
            milestone.progressPercent = Math.floor((completedActions / totalActions) * 100);

            const allPhasesCompleted = milestone.phases.every(p => p.isCompleted);
            let nextState = { ...prev };
            const logs = [...nextState.logs];

            if (allPhasesCompleted && !milestone.isCompleted) {
                milestone.isCompleted = true;
                milestone.progressPercent = 100;

                const { reward } = milestone;
                let newStats = { ...nextState.stats };

                // Add Epic Mission Complete Reward to Queue FIRST
                if (!nextState.rewardQueue) nextState.rewardQueue = [];
                nextState.rewardQueue = [...nextState.rewardQueue, {
                    id: `epic_mission_${milestone.id}_${Date.now()}`,
                    type: 'mission_complete' as const,
                    name: milestone.title,
                    description: '¡Misión Épica Completada!',
                    value: reward.xpBonus || 0,
                    targetStat: reward.statBonus ? Object.keys(reward.statBonus)[0] as any : undefined,
                    icon: '⭐',
                    rarity: 'legendary' as const
                }];

                if (reward.xpBonus) {
                    newStats.xpCurrent += reward.xpBonus;

                    // Calculate Level Up
                    const { level, xp, leveledUp, xpForNextLevel } = calculateLevel(newStats.level, newStats.xpCurrent);
                    newStats.level = level;
                    newStats.xpCurrent = xp;
                    newStats.xpForNextLevel = xpForNextLevel;

                    if (leveledUp) {
                        newStats.strength += 1;
                        newStats.vitality += 1;
                        newStats.agility += 1;
                        newStats.intelligence += 1;
                        newStats.fortune += 1;
                        newStats.metabolism += 1;

                        if (typeof nextState.passivePoints !== 'number') nextState.passivePoints = 0;
                        if (newStats.level > 1) nextState.passivePoints += 1;

                        logs.unshift(createLog(
                            'Subida de Nivel',
                            'NIVEL ALCANZADO – ' + newStats.level,
                            'Tu presencia se siente más pesada.',
                            { levelChange: { from: nextState.stats.level, to: newStats.level } }
                        ));

                        // Add Level Up Reward to Queue
                        nextState.rewardQueue = [...nextState.rewardQueue, {
                            id: 'levelup_' + newStats.level + '_' + Date.now(),
                            type: 'levelup',
                            name: 'Level ' + newStats.level,
                            description: 'Stats Increased',
                            value: 0,
                            icon: '⚡',
                            powerGain: 1000
                        }];

                        nextState.justLeveledUp = true;
                    }

                    logs.unshift(createLog('Hito', 'Misión Épica Completada', milestone.title + ' completada! + ' + reward.xpBonus + ' XP', { xpChange: reward.xpBonus }));
                }

                nextState.stats = newStats;
            } else {
                logs.unshift(createLog('Hito', 'Progreso de Hito', milestone.title + ': +1 Acción'));
            }

            const updatedMilestones = [...prev.milestones];
            updatedMilestones[milestoneIndex] = milestone;

            nextState.milestones = updatedMilestones;
            nextState.logs = logs;

            // Check Achievements
            return { state: recomputeTitlesAndFrames(nextState) };
        });
    },

    claimSeasonReward: (tier) => {
        set((store) => {
            const prev = store.state;
            if (!prev.currentSeason) return {};
            if (prev.currentSeason.claimedRewards.includes(tier)) return {};

            const season = prev.seasons.find(s => s.id === prev.currentSeason!.seasonId) || DEFAULT_SEASON;
            const requiredXP = season.xpTargets[tier];

            if (prev.currentSeason.seasonXP < requiredXP) return {};

            const reward = season.rewards[tier];
            if (!reward) return {};

            let newStats = { ...prev.stats };
            let newLogs = [...prev.logs];
            let newRewardQueue = [...prev.rewardQueue];

            if (reward.xpBonus) {
                newStats.xpCurrent += reward.xpBonus;
                newLogs.unshift(createLog('Sistema', 'Recompensa de Temporada', 'Reclamado Rango ' + tier + ' Recompensa: +' + reward.xpBonus + ' XP'));
                newRewardQueue.push({
                    id: 'season_xp_' + tier + '_' + Date.now(),
                    type: 'currency',
                    name: reward.xpBonus + ' XP',
                    value: reward.xpBonus,
                    icon: '✨'
                });
            }

            return {
                state: {
                    ...prev,
                    stats: newStats,
                    logs: newLogs,
                    rewardQueue: newRewardQueue,
                    currentSeason: {
                        ...prev.currentSeason,
                        claimedRewards: [...prev.currentSeason.claimedRewards, tier]
                    }
                }
            };
        });
    },

    addRecommendedMission: (mission) => {
        set((store) => ({
            state: {
                ...store.state,
                missions: [...store.state.missions, mission]
            }
        }));
    },

    syncLifeGoals: () => {
        set((store) => {
            const prev = store.state;
            const existingIds = new Set(prev.milestones.map(m => m.id));
            const newGoals = LIFE_GOALS.filter(g => !existingIds.has(g.id));

            if (newGoals.length === 0) return {};

            return {
                state: {
                    ...prev,
                    milestones: [...prev.milestones, ...newGoals]
                }
            };
        });
    },



    checkAllQuests: () => {
        set((store) => {
            const prev = store.state;
            const todayKey = new Date().toDateString();
            const context = {
                missionsCompletedToday: prev.dailyActivity[todayKey]?.missionsCompleted || 0,
                dungeonsClearedToday: prev.dungeonRuns.filter(r => isSameDay(new Date(r.timestamp), new Date())).length,
                currentStats: prev.stats,
                healthScore: prev.healthSummary.averageScore7d || 0,
                streak: prev.stats.streak,
                shadowsExtracted: prev.shadows.length
            };

            let hasChanges = false;
            const newQuests = prev.dailyQuests.map(q => {
                const checked = checkQuestCompletion(q, context);
                if (checked !== q) hasChanges = true;
                return checked;
            });

            if (!hasChanges) return {};

            return { state: { ...prev, dailyQuests: newQuests } };
        });
    },

    claimQuestReward: (questId) => {
        set((store) => {
            const prev = store.state;
            const quest = prev.dailyQuests.find(q => q.id === questId);
            if (!quest || !quest.completed || quest.claimedAt) return {};

            const newQuests = prev.dailyQuests.map(q =>
                q.id === questId ? { ...q, claimedAt: new Date().toISOString() } : q
            );

            let newStats = { ...prev.stats };
            let newLogs = [...prev.logs];

            const reward = quest.reward;
            const newQP = prev.questPoints + reward.questPoints;

            let newRewardQueue = [...(prev.rewardQueue || [])];
            let newPassivePoints = prev.passivePoints;
            let newShards = prev.shards || 0;

            if (reward.stats) {
                // U40 - Apply Stat Rewards
                Object.entries(reward.stats).forEach(([stat, amount]) => {
                    const key = stat.toLowerCase() as keyof UserStats;
                    if (typeof newStats[key] === 'number') {
                        (newStats[key] as number) += amount as number;

                        // Log Stat Gain
                        newLogs.unshift(createLog(
                            'Sistema',
                            `Stat Increased: ${stat}`,
                            `+${amount} ${stat} from Quest`,
                            { statChange: { stat: stat as any, amount: amount as number } }
                        ));
                    }
                });
            }

            if (reward.shards) {
                newShards += reward.shards;
                newLogs.unshift(createLog('Sistema', 'Recompensa de Misión', 'Obtenidos ' + reward.shards + ' Fragmentos'));
                newRewardQueue.push({
                    id: 'quest_shards_' + Date.now(),
                    type: 'item',
                    name: reward.shards + ' Shards',
                    rarity: 'rare',
                    icon: '✨'
                });
            }

            if (reward.xp) {
                newStats.xpCurrent += reward.xp;

                // Calculate Level Up
                const { level, xp, leveledUp, xpForNextLevel } = calculateLevel(newStats.level, newStats.xpCurrent);
                newStats.level = level;
                newStats.xpCurrent = xp;
                newStats.xpForNextLevel = xpForNextLevel;

                if (leveledUp) {
                    newStats.strength += 1;
                    newStats.vitality += 1;
                    newStats.agility += 1;
                    newStats.intelligence += 1;
                    newStats.fortune += 1;
                    newStats.metabolism += 1;
                    if (newStats.level > 1) newPassivePoints += 1;

                    newLogs.unshift(createLog(
                        'LevelUp',
                        'LEVEL UP – ' + newStats.level,
                        'Your presence feels heavier.',
                        { levelChange: { from: prev.stats.level, to: newStats.level } }
                    ));

                    // Add Level Up Reward to Queue
                    newRewardQueue.push({
                        id: 'levelup_' + newStats.level + '_' + Date.now(),
                        type: 'levelup',
                        name: 'Nivel ' + newStats.level,
                        description: 'Estadísticas Aumentadas',
                        value: 0,
                        icon: '⚡',
                        powerGain: 1000
                    });
                }
            }

            newLogs.unshift(createLog('Sistema', 'Misión Completada', 'Completada: ' + quest.title, { xpChange: reward.xp }));

            const allClaimed = newQuests.every(q => q.claimedAt);
            let newStreak = prev.questStreak;

            if (allClaimed) {
                newStreak += 1;
                newLogs.unshift(createLog('Racha', 'Misiones Diarias', 'Racha de Misiones: ¡' + newStreak + ' días!'));
            }

            const finalState = {
                ...prev,
                stats: newStats,
                dailyQuests: newQuests,
                questPoints: newQP,
                questStreak: newStreak,
                logs: newLogs,
                passivePoints: newPassivePoints,
                shards: newShards,
                rewardQueue: newRewardQueue
            };

            // Check Achievements
            return { state: recomputeTitlesAndFrames(finalState) };
        });
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
            let newRewardQueue = [...(prev.rewardQueue || [])];
            let newPassivePoints = prev.passivePoints;

            if (item.reward.xp) {
                newStats.xpCurrent += item.reward.xp;

                // Calculate Level Up
                const { level, xp, leveledUp, xpForNextLevel } = calculateLevel(newStats.level, newStats.xpCurrent);
                newStats.level = level;
                newStats.xpCurrent = xp;
                newStats.xpForNextLevel = xpForNextLevel;

                if (leveledUp) {
                    newStats.strength += 1;
                    newStats.vitality += 1;
                    newStats.agility += 1;
                    newStats.intelligence += 1;
                    newStats.fortune += 1;
                    newStats.metabolism += 1;
                    if (newStats.level > 1) newPassivePoints += 1;

                    newLogs.unshift(createLog(
                        'LevelUp',
                        'LEVEL UP – ' + newStats.level,
                        'Your presence feels heavier.',
                        { levelChange: { from: prev.stats.level, to: newStats.level } }
                    ));

                    // Add Level Up Reward to Queue
                    newRewardQueue.push({
                        id: 'levelup_' + newStats.level + '_' + Date.now(),
                        type: 'levelup',
                        name: 'Nivel ' + newStats.level,
                        description: 'Estadísticas Aumentadas',
                        value: 0,
                        icon: '⚡',
                        powerGain: 1000
                    });
                }
            }
            if (item.reward.titleId && !newStats.unlockedTitleIds.includes(item.reward.titleId)) {
                newStats.unlockedTitleIds.push(item.reward.titleId);
            }
            if (item.reward.frameId && !newStats.unlockedFrameIds.includes(item.reward.frameId)) {
                newStats.unlockedFrameIds.push(item.reward.frameId);
            }

            newLogs.unshift(createLog('Sistema', 'Compra en Tienda', 'Comprado ' + item.name + ' por ' + item.cost + ' QP'));

            const finalState = {
                ...prev,
                questPoints: newQP,
                questShopPurchases: newPurchases,
                stats: newStats,
                logs: newLogs,
                passivePoints: newPassivePoints,
                rewardQueue: newRewardQueue
            };

            // Check Achievements
            return { state: recomputeTitlesAndFrames(finalState) };
        });
    },

    initializeMissions: () => {
        set((store) => {
            const prev = store.state;
            const now = new Date();
            const todayKey = now.toDateString();

            let updatedMissions = [...prev.missions];
            let hasChanges = false;

            // 1. Ensure CORE MISSIONS exist
            CORE_MISSIONS.forEach(coreMission => {
                const exists = updatedMissions.find(m => m.id === coreMission.id);
                if (!exists) {
                    updatedMissions.push(coreMission);
                    hasChanges = true;
                } else {
                    // Update definition to match code (XP changes, typos, etc)
                    // But PRESERVE user progress (streak, lastCompletedAt)
                    const index = updatedMissions.findIndex(m => m.id === coreMission.id);
                    const existing = updatedMissions[index];

                    const updated = {
                        ...coreMission, // New definition (XP, Title, etc)
                        lastCompletedAt: existing.lastCompletedAt,
                        streak: existing.streak
                    };

                    // Check if anything actually changed to avoid loop/overhead
                    if (JSON.stringify(existing) !== JSON.stringify(updated)) {
                        updatedMissions[index] = updated;
                        hasChanges = true;
                    }
                }
            });

            // 2. Handle Random Daily Missions
            // User requested NO random missions for now.
            // We clear any existing random missions to respect the "literal" request.
            updatedMissions = updatedMissions.filter(m => m && m.id && !m.id.startsWith('daily_random_'));

            // Logic for random missions removed per user request.
            // if (!hasTodayRandoms) { ... }

            if (!hasChanges && updatedMissions.length === prev.missions.length) return {};

            return {
                state: {
                    ...prev,
                    missions: updatedMissions
                }
            };
        });
    }
});

