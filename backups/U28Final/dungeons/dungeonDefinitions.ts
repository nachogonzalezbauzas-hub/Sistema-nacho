import { DungeonDefinition } from '../types';

export const DUNGEONS: DungeonDefinition[] = [
    // DAILY DUNGEONS
    {
        id: 'dungeon_daily_shadow',
        name: 'Shadow Corridor',
        description: 'A dark hallway where shadows whisper your failures. Test your resolve.',
        difficulty: 1,
        recommendedStats: ['Intelligence', 'Agility'],
        dungeonType: 'Daily',
        baseRewards: {
            xp: 150,
            buffId: 'shadow_veil' // Assuming this exists or will be handled generically
        }
    },
    {
        id: 'dungeon_daily_arcane',
        name: 'Arcane Archives',
        description: 'Ancient texts guard forbidden knowledge. Only the wise survive.',
        difficulty: 2,
        recommendedStats: ['Intelligence', 'Vitality'],
        dungeonType: 'Daily',
        baseRewards: {
            xp: 200
        }
    },

    // WEEKLY RAIDS
    {
        id: 'dungeon_weekly_monarch',
        name: 'Corrupted Monarch',
        description: 'The fallen king of a lost dimension. His strength is absolute.',
        difficulty: 3,
        recommendedStats: ['Strength', 'Vitality', 'Agility'],
        dungeonType: 'Weekly',
        baseRewards: {
            xp: 1000,
            titleId: 'kingslayer'
        }
    },
    {
        id: 'dungeon_weekly_hydra',
        name: 'Hydra Reactor',
        description: 'A bio-mechanical beast fueled by unstable energy.',
        difficulty: 4,
        recommendedStats: ['Metabolism', 'Vitality'],
        dungeonType: 'Weekly',
        baseRewards: {
            xp: 1200,
            frameId: 'hydra_core'
        }
    },

    // CHALLENGE DUNGEONS
    {
        id: 'dungeon_challenge_void',
        name: 'Infinite Void',
        description: 'A place where time and space hold no meaning. Pure chaos.',
        difficulty: 5,
        recommendedStats: ['Fortune', 'Intelligence', 'Agility'],
        dungeonType: 'Challenge',
        baseRewards: {
            xp: 2500,
            titleId: 'void_walker'
        }
    },
    {
        id: 'dungeon_challenge_metabolism',
        name: 'Depths of Metabolism',
        description: 'The ultimate test of endurance and physical processing.',
        difficulty: 5,
        recommendedStats: ['Metabolism', 'Strength', 'Vitality'],
        dungeonType: 'Challenge',
        baseRewards: {
            xp: 2500,
            buffId: 'metabolic_overdrive'
        }
    }
];
