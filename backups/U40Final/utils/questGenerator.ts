import { DailyQuest, QuestType, QuestCondition, QuestReward, UserStats } from '../types';

// --- QUEST TEMPLATES ---

interface QuestTemplate {
    type: QuestType;
    titleTemplate: (target: number, metadata?: any) => string;
    descriptionTemplate: (target: number, metadata?: any) => string;
    baseTarget: number;
    targetScalePerLevel: number;
    baseReward: number; // QP
    rewardScalePerLevel: number;
    metadataGenerator?: (level: number) => any;
}

const QUEST_TEMPLATES: QuestTemplate[] = [
    {
        type: 'mission_completion',
        titleTemplate: (target) => `Complete ${target} Missions`,
        descriptionTemplate: (target) => `Complete any ${target} missions today to prove your diligence.`,
        baseTarget: 3,
        targetScalePerLevel: 0.1, // +1 mission every 10 levels
        baseReward: 30,
        rewardScalePerLevel: 0.5
    },
    {
        type: 'stat_threshold',
        titleTemplate: (target, meta) => `Reach ${target} ${meta.statType}`,
        descriptionTemplate: (target, meta) => `Increase your ${meta.statType} to ${target} or higher.`,
        baseTarget: 15,
        targetScalePerLevel: 1.2, // Target grows with level
        baseReward: 40,
        rewardScalePerLevel: 1,
        metadataGenerator: () => {
            const stats = ['Strength', 'Vitality', 'Agility', 'Intelligence', 'Fortune', 'Metabolism'];
            return { statType: stats[Math.floor(Math.random() * stats.length)] };
        }
    },
    {
        type: 'dungeon_clear',
        titleTemplate: (target) => `Clear ${target} Dungeon${target > 1 ? 's' : ''}`,
        descriptionTemplate: (target) => `Successfully clear ${target} dungeon${target > 1 ? 's' : ''} of any difficulty.`,
        baseTarget: 1,
        targetScalePerLevel: 0, // Stays at 1 usually, maybe 2 at high levels
        baseReward: 50,
        rewardScalePerLevel: 1
    },
    {
        type: 'health_score',
        titleTemplate: (target) => `Maintain Health Score > ${target}`,
        descriptionTemplate: (target) => `Keep your daily health score above ${target}.`,
        baseTarget: 60,
        targetScalePerLevel: 0,
        baseReward: 35,
        rewardScalePerLevel: 0.5
    },
    {
        type: 'streak_maintain',
        titleTemplate: () => `Maintain Your Streak`,
        descriptionTemplate: () => `Log in and complete at least one activity to keep your streak alive.`,
        baseTarget: 1,
        targetScalePerLevel: 0,
        baseReward: 25,
        rewardScalePerLevel: 0.2
    }
];

// --- GENERATION LOGIC ---

export const generateDailyQuests = (userLevel: number): DailyQuest[] => {
    const numQuests = 3; // Always 3 quests for now
    const quests: DailyQuest[] = [];
    const usedTypes = new Set<string>();

    // Shuffle templates to get random quest types
    const shuffledTemplates = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);

    for (const template of shuffledTemplates) {
        if (quests.length >= numQuests) break;
        if (usedTypes.has(template.type)) continue;

        // Calculate Target
        let target = Math.floor(template.baseTarget + (userLevel * template.targetScalePerLevel));

        // Cap specific targets
        if (template.type === 'health_score') target = Math.min(90, target);
        if (template.type === 'dungeon_clear') target = Math.min(3, Math.max(1, target));
        if (template.type === 'mission_completion') target = Math.min(10, Math.max(2, target));

        // Generate Metadata
        const metadata = template.metadataGenerator ? template.metadataGenerator(userLevel) : undefined;

        // Calculate Reward
        const rewardQP = Math.floor(template.baseReward + (userLevel * template.rewardScalePerLevel));

        const quest: DailyQuest = {
            id: crypto.randomUUID(),
            title: template.titleTemplate(target, metadata),
            description: template.descriptionTemplate(target, metadata),
            condition: {
                type: template.type,
                target: target,
                current: 0,
                metadata: metadata
            },
            reward: {
                questPoints: rewardQP,
                shards: Math.floor(5 + Math.random() * 5) // 5-10 Shards per quest
            },
            completed: false
        };

        quests.push(quest);
        usedTypes.add(template.type);
    }

    return quests;
};

export const QUEST_SHOP_ITEMS: import('../types').QuestShopItem[] = [
    {
        id: 'xp_boost_small',
        name: 'Small XP Pack',
        description: 'Instantly grants 100 XP.',
        cost: 30,
        type: 'xp',
        reward: { xp: 100 }
    },
    {
        id: 'xp_boost_medium',
        name: 'Medium XP Pack',
        description: 'Instantly grants 250 XP.',
        cost: 60,
        type: 'xp',
        reward: { xp: 250 }
    },
    {
        id: 'xp_boost_large',
        name: 'Large XP Pack',
        description: 'Instantly grants 600 XP.',
        cost: 120,
        type: 'xp',
        reward: { xp: 600 }
    }
];

// --- CHECKING LOGIC ---

export interface QuestCheckContext {
    missionsCompletedToday?: number;
    dungeonsClearedToday?: number;
    currentStats?: UserStats;
    healthScore?: number;
    streak?: number;
    shadowsExtracted?: number;
}

export const checkQuestCompletion = (quest: DailyQuest, context: QuestCheckContext): DailyQuest => {
    if (quest.completed) return quest;

    let newCurrent = quest.condition.current;

    switch (quest.condition.type) {
        case 'mission_completion':
            if (context.missionsCompletedToday !== undefined) {
                newCurrent = context.missionsCompletedToday;
            }
            break;
        case 'dungeon_clear':
            if (context.dungeonsClearedToday !== undefined) {
                newCurrent = context.dungeonsClearedToday;
            }
            break;
        case 'stat_threshold':
            if (context.currentStats && quest.condition.metadata?.statType) {
                const statKey = quest.condition.metadata.statType.toLowerCase() as keyof UserStats;
                const statVal = context.currentStats[statKey];
                if (typeof statVal === 'number') {
                    newCurrent = statVal;
                }
            }
            break;
        case 'health_score':
            if (context.healthScore !== undefined) {
                newCurrent = context.healthScore;
            }
            break;
        case 'streak_maintain':
            if (context.streak !== undefined) {
                newCurrent = context.streak > 0 ? 1 : 0; // Binary check for streak maintenance
            }
            break;
    }

    // Check if completed
    // For stat threshold and health score, we check if current >= target
    // For others (counters), we also check >= target
    const isCompleted = newCurrent >= quest.condition.target;

    if (newCurrent !== quest.condition.current || isCompleted !== quest.completed) {
        return {
            ...quest,
            condition: {
                ...quest.condition,
                current: newCurrent
            },
            completed: isCompleted
        };
    }

    return quest;
};
