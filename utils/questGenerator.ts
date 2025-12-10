import { DailyQuest, QuestType, QuestCondition, QuestReward, UserStats } from '../types';
import { v4 as uuidv4 } from 'uuid';

// --- QUEST TEMPLATES ---

// --- QUEST TEMPLATES ---

interface QuestTemplate {
    type: QuestType;
    titleTemplate: (target: number, metadata?: any) => string;
    descriptionTemplate: (target: number, metadata?: any) => string;
    baseTarget: number;
    targetScalePerLevel: number;
    baseReward: number; // QP
    rewardScalePerLevel: number;
    statRewardGenerator?: () => Partial<UserStats>;
    metadataGenerator?: (level: number) => any;
}

const QUEST_TEMPLATES: QuestTemplate[] = [
    // --- PHYSICAL ---
    {
        type: 'manual_verification',
        titleTemplate: (target) => `Haz ${target} Flexiones`,
        descriptionTemplate: (target) => `Realiza ${target} flexiones correctamente. Regístralo al terminar.`,
        baseTarget: 10,
        targetScalePerLevel: 0.5,
        baseReward: 40,
        rewardScalePerLevel: 1,
        statRewardGenerator: () => ({ strength: 1 })
    },
    {
        type: 'manual_verification',
        titleTemplate: (target) => `Haz ${target} Sentadillas`,
        descriptionTemplate: (target) => `Realiza ${target} sentadillas con buena forma.`,
        baseTarget: 15,
        targetScalePerLevel: 0.5,
        baseReward: 40,
        rewardScalePerLevel: 1,
        statRewardGenerator: () => ({ vitality: 1 })
    },
    {
        type: 'manual_verification',
        titleTemplate: (target) => `Haz ${Math.floor(target / 2)} Min de Plancha`, // target is basically seconds equivalent or similar scaling
        descriptionTemplate: (target) => `Mantén la posición de plancha durante ${Math.ceil(target / 2)} minutos (acumulados).`,
        baseTarget: 2, // 1 min basically
        targetScalePerLevel: 0.1,
        baseReward: 45,
        rewardScalePerLevel: 1.2,
        statRewardGenerator: () => ({ vitality: 1, strength: 1 }) // Bonus!
    },
    // --- MENTAL / LIFESTYLE ---
    {
        type: 'manual_verification',
        titleTemplate: (target) => `Medita ${target} Minutos`,
        descriptionTemplate: (target) => `Dedica ${target} minutos a la meditación silenciosa.`,
        baseTarget: 5,
        targetScalePerLevel: 0.2, // Increases slowly
        baseReward: 30,
        rewardScalePerLevel: 0.5,
        statRewardGenerator: () => ({ intelligence: 1 })
    },
    {
        type: 'manual_verification',
        titleTemplate: (target) => `Lee ${target} Páginas`,
        descriptionTemplate: (target) => `Lee al menos ${target} páginas de un libro (ficción o no ficción).`,
        baseTarget: 10,
        targetScalePerLevel: 0, // Stay constant mostly
        baseReward: 30,
        rewardScalePerLevel: 0.5,
        statRewardGenerator: () => ({ intelligence: 1 })
    },
    {
        type: 'manual_verification',
        titleTemplate: () => `Ordena tu Habitación`,
        descriptionTemplate: () => `Dedica 10 minutos a ordenar tu espacio personal.`,
        baseTarget: 1,
        targetScalePerLevel: 0,
        baseReward: 35,
        rewardScalePerLevel: 0.5,
        statRewardGenerator: () => ({ fortune: 1 }) // Cleanliness = Luck (Feng Shui style logic)
    },
    // --- GAME LOOP (Keep some for variety) ---
    {
        type: 'mission_completion',
        titleTemplate: (target) => `Completa ${target} Misiones`,
        descriptionTemplate: (target) => `Completa ${target} misiones de tu lista hoy.`,
        baseTarget: 3,
        targetScalePerLevel: 0,
        baseReward: 25,
        rewardScalePerLevel: 0.5
    }
];

// --- GENERATION LOGIC ---

export const generateDailyQuests = (userLevel: number): DailyQuest[] => {
    const numQuests = 3;
    const quests: DailyQuest[] = [];
    const usedTitles = new Set<string>();

    // Shuffle
    const shuffledTemplates = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);

    for (const template of shuffledTemplates) {
        if (quests.length >= numQuests) break;

        // Calculate Target
        let target = Math.floor(template.baseTarget + (userLevel * template.targetScalePerLevel));
        target = Math.max(1, target); // Safety

        const title = template.titleTemplate(target);
        if (usedTitles.has(title)) continue;

        // Generate Reward
        const rewardQP = Math.floor(template.baseReward + (userLevel * template.rewardScalePerLevel));
        const statReward = template.statRewardGenerator ? template.statRewardGenerator() : undefined;

        const quest: DailyQuest = {
            id: uuidv4(),
            title: title,
            description: template.descriptionTemplate(target),
            condition: {
                type: template.type,
                target: template.type === 'manual_verification' ? 1 : target, // Manual is always binary (Done/Not Done), but title reflects effort
                current: 0
            },
            reward: {
                questPoints: rewardQP,
                shards: Math.floor(10 + Math.random() * 15) + userLevel, // Scaled Shards
                stats: statReward
            },
            completed: false
        };

        quests.push(quest);
        usedTitles.add(quest.title);
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
        case 'manual_verification':
            // These require explicit user interaction via UI (button), so automated checks don't update them
            // unless we add specific logic here. For now, rely on manual trigger in UI.
            break;
    }

    // Check if completed
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
