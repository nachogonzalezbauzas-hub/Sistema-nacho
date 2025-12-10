import { PetDefinition } from '@/types';

export const PET_DEFINITIONS: Record<string, PetDefinition> = {
    'igris_wolf': {
        id: 'igris_wolf',
        type: 'wolf',
        name: 'Igris (Young)',
        description: 'A loyal wolf that grows stronger with your physical prowess.',
        baseStats: { Strength: 5, Agility: 5 },
        evolutionLevel: 10,
        preferredCategory: 'Health'
    },
    'noctis_owl': {
        id: 'noctis_owl',
        type: 'owl',
        name: 'Noctis',
        description: 'A wise owl that aids in your intellectual pursuits.',
        baseStats: { Intelligence: 5, Fortune: 5 },
        evolutionLevel: 10,
        preferredCategory: 'Intelligence'
    }
};
