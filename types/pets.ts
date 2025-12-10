import { StatType } from './core';

export type PetType = 'wolf' | 'owl' | 'shadow_soldier' | 'dragon';
export type PetStage = 'baby' | 'adult' | 'awakened';

export interface PetDefinition {
    id: string;
    type: PetType;
    name: string;
    description: string;
    baseStats: Partial<Record<StatType, number>>;
    evolutionLevel: number; // Level required to evolve
    preferredCategory: string; // 'Health', 'Intelligence', etc.
}

export interface Pet {
    id: string; // Unique instance ID
    defId: string; // Reference to definition (e.g., 'igris_wolf')
    name: string; // Custom name
    level: number;
    xp: number;
    xpForNextLevel: number;
    stage: PetStage;
    bond: number; // 0-100, affects bonus
    isEquipped: boolean;
}
