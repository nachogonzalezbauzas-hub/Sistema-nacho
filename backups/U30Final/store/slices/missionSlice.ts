import { StateCreator } from 'zustand';
import { Mission, Milestone, MilestoneCategory, MilestonePhase, MilestoneReward, RankTier, UserStats, QuestShopItem } from '../../types';
import { createLog, isSameDay, getDateKey } from '../utils';
import { DEFAULT_SEASON } from '../defaults';
import { LIFE_GOALS } from '../../utils/lifeGoals';
import { recomputeTitlesAndFrames } from './userSlice';
import { calculateLevel } from '../../utils/progression';
import { BUFF_DEFINITIONS } from '../../data/buffs';
import { generateDailyQuests, checkQuestCompletion } from '../../utils/questGenerator';
import { GameStore } from '../useStore';

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
    checkAllQuests: () => void;
    claimQuestReward: (questId: string) => void;
    purchaseQuestShopItem: (item: QuestShopItem) => void;
}

export const createMissionSlice: StateCreator<GameStore, [], [], MissionSlice> = (set, get) => ({
    addMission: (mission) => {
        set((store) => ({
            state: {
                ...store.state,
                missions: [...store.state.missions, mission],
                logs: [createLog('Mission', 'New Mission', 'Added: ' + mission.title), ...store.state.logs]
            }
        }));
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
                const diffTime = Math.abs(now.getTime() - last.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 2) missionStreak = 1;
            }

            const globalStreak = prev.stats.streak + 1;

            let nextState = { ...prev };
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

            const earnedXp = Math.floor(mission.xpReward * streakMultiplier * buffMultiplier);
            newStats.xpCurrent += earnedXp;
            newStats.streak = globalStreak;
            newStats.lastActiveDate = now.toISOString();

            if (mission.targetStat) {
                const statKey = mission.targetStat.toLowerCase() as keyof UserStats;
                if (typeof newStats[statKey] === 'number') {
                    (newStats[statKey] as number) += 1;
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

            const logs = [...nextState.logs];
            logs.unshift(createLog(
                'Mission',
                'Mission Completed: ' + mission.title,
                '+ ' + earnedXp + ' XP. Stat: ' + mission.targetStat,
                { xpChange: earnedXp, statChange: { stat: mission.targetStat, amount: 1 } }
            ));

            if (leveledUp) {
                logs.unshift(createLog(
                    'LevelUp',
                    'LEVEL UP – ' + newStats.level,
                    'Your presence feels heavier.',
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

            // Check Achievements
            return { state: recomputeTitlesAndFrames(nextState) };
        });
    },

    addMilestone: (milestoneInput) => {
        const newMilestone: Milestone = {
            id: crypto.randomUUID(),
            title: milestoneInput.title,
            description: milestoneInput.description,
            category: milestoneInput.category,
            createdAt: new Date().toISOString(),
            targetDate: milestoneInput.targetDate,
            phases: milestoneInput.phases.map(p => ({
                ...p,
                id: crypto.randomUUID(),
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
            logs.unshift(createLog('System', 'Epic Mission Started', 'Begun: ' + newMilestone.title));
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
                            'LevelUp',
                            'LEVEL UP – ' + newStats.level,
                            'Your presence feels heavier.',
                            { levelChange: { from: nextState.stats.level, to: newStats.level } }
                        ));

                        // Add Level Up Reward to Queue
                        if (!nextState.rewardQueue) nextState.rewardQueue = [];
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

                    logs.unshift(createLog('Milestone', 'Epic Mission Completed', milestone.title + ' completed! + ' + reward.xpBonus + ' XP', { xpChange: reward.xpBonus }));
                }

                nextState.stats = newStats;
            } else {
                logs.unshift(createLog('Milestone', 'Milestone Progress', milestone.title + ': +1 Action'));
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
                newLogs.unshift(createLog('System', 'Season Reward', 'Claimed Rank ' + tier + ' Reward: +' + reward.xpBonus + ' XP'));
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

    refreshDailyQuests: () => {
        set((store) => {
            const prev = store.state;
            const now = new Date();
            const todayKey = now.toDateString();

            // Refresh if it's a new day OR if the quest list is empty (e.g. first load or cleared)
            if (prev.lastQuestRefresh === todayKey && prev.dailyQuests.length > 0) return {};

            const newQuests = generateDailyQuests(prev.stats.level);

            let newStreak = prev.questStreak;
            if (prev.lastQuestRefresh) {
                const lastDate = new Date(prev.lastQuestRefresh);
                const diffTime = Math.abs(now.getTime() - lastDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 1) newStreak = 0;
            }

            return {
                state: {
                    ...prev,
                    dailyQuests: newQuests,
                    lastQuestRefresh: todayKey,
                    questStreak: newStreak
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

            if (reward.shards) {
                newShards += reward.shards;
                newLogs.unshift(createLog('System', 'Quest Reward', 'Obtained ' + reward.shards + ' Shards'));
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
                        name: 'Level ' + newStats.level,
                        description: 'Stats Increased',
                        value: 0,
                        icon: '⚡',
                        powerGain: 1000
                    });
                }
            }

            newLogs.unshift(createLog('System', 'Quest Complete', 'Completed: ' + quest.title, { xpChange: reward.xp }));

            const allClaimed = newQuests.every(q => q.claimedAt);
            let newStreak = prev.questStreak;

            if (allClaimed) {
                newStreak += 1;
                newLogs.unshift(createLog('Streak', 'Daily Quests Cleared', 'Quest Streak: ' + newStreak + ' days!'));
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
                        name: 'Level ' + newStats.level,
                        description: 'Stats Increased',
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

            newLogs.unshift(createLog('System', 'Shop Purchase', 'Bought ' + item.name + ' for ' + item.cost + ' QP'));

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
    }
});

