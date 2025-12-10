import { DungeonDefinition } from '../types';
import { DUNGEON_IDS } from '../data/gameConstants';

export const DUNGEONS: DungeonDefinition[] = [
    // E-RANK (Starter)
    {
        id: DUNGEON_IDS.GOBLIN_DEN,
        name: 'E-Rank Gate: Goblin Den',
        description: 'A low-level dungeon infested with goblins. Good for warming up.',
        difficulty: 1,
        recommendedStats: ['Agility', 'Strength'],
        minLevel: 1,
        recommendedPower: 50,
        dungeonType: 'Daily',
        baseRewards: {
            xp: 200,
            titleId: 'goblin_slayer',
            frameId: 'goblin_frame',
            items: ['Goblin Dagger', 'Low Grade Mana Stone'],
            shadowId: 'shadow_infantry'
        }
    },
    // C-RANK (Metabolism)
    {
        id: DUNGEON_IDS.INSECT_PIT,
        name: 'C-Rank Gate: Insect Pit',
        description: 'A humid nest of giant insects. Tests your endurance and poison resistance.',
        difficulty: 2,
        recommendedStats: ['Metabolism', 'Vitality'],
        minLevel: 20,
        recommendedPower: 500,
        dungeonType: 'Daily',
        baseRewards: {
            xp: 800,
            titleId: 'bug_squasher',
            frameId: 'insect_carapace',
            items: ['Insect Armor', 'Venom Sac'],
            shadowId: 'shadow_ant' // Preview
        }
    },
    // B-RANK (Survival)
    {
        id: DUNGEON_IDS.RED_GATE,
        name: 'B-Rank Gate: Red Gate',
        description: 'A frozen wasteland where the gate has closed behind you. Survive.',
        difficulty: 3,
        recommendedStats: ['Vitality', 'Intelligence'],
        minLevel: 40,
        recommendedPower: 2000,
        dungeonType: 'Weekly',
        baseRewards: {
            xp: 2500,
            titleId: 'survivor',
            frameId: 'red_gate_frost',
            items: ['Ice Elf Bow', 'Frost Core'],
            shadowId: 'shadow_bear' // Tank
        }
    },
    // A-RANK (Strength)
    {
        id: DUNGEON_IDS.ORC_CITADEL,
        name: 'A-Rank Gate: High Orc Citadel',
        description: 'The stronghold of the High Orcs. Brute force is required.',
        difficulty: 4,
        recommendedStats: ['Strength', 'Agility'],
        minLevel: 60,
        recommendedPower: 8000,
        dungeonType: 'Weekly',
        baseRewards: {
            xp: 8000,
            titleId: 'orc_conqueror',
            frameId: 'orc_tusk',
            items: ['Orc Warlord Axe', 'High Grade Mana Stone'],
            shadowId: 'shadow_orc_general' // Tusk
        }
    },
    // S-RANK (Jeju)
    {
        id: DUNGEON_IDS.JEJU_ISLAND,
        name: 'S-Rank Gate: Jeju Island',
        description: 'The ant colony that destroyed a nation. Face the King.',
        difficulty: 5,
        recommendedStats: ['Agility', 'Strength', 'Metabolism'],
        minLevel: 80,
        recommendedPower: 25000,
        dungeonType: 'Challenge',
        baseRewards: {
            xp: 25000,
            titleId: 'ant_king_slayer',
            frameId: 'ant_king_crown',
            items: ['Ant King Dagger', 'Black Heart'],
            shadowId: 'shadow_beru' // Beru
        }
    },
    // DOUBLE DUNGEON (God)
    {
        id: DUNGEON_IDS.DOUBLE_DUNGEON,
        name: 'Double Dungeon: Cartenon Temple',
        description: 'Where it all began. Face the Architect and the False God.',
        difficulty: 5,
        recommendedStats: ['Intelligence', 'Fortune', 'Strength'],
        minLevel: 100,
        recommendedPower: 80000,
        dungeonType: 'Challenge',
        baseRewards: {
            xp: 100000,
            titleId: 'god_slayer',
            frameId: 'god_statue_aura',
            items: ['Demon King Sword', 'System Key'],
            shadowId: 'shadow_igris' // Maybe not Igris, but fits the theme of "First Shadow" or similar
        }
    }
];
