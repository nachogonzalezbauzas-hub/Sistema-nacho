import { StateCreator } from 'zustand';
import { GameStore } from '@/store/useStore';
import { Pet, PetDefinition } from '@/types';
import { createLog } from '@/store/utils';
import { v4 as uuidv4 } from 'uuid';

import { PET_DEFINITIONS } from '@/data/pets';

export interface PetSlice {
    unlockPet: (defId: string) => void;
    equipPet: (petId: string) => void;
    feedPet: (petId: string, amount: number) => void;
    checkPetEvolution: (petId: string) => void;
}

export const createPetSlice: StateCreator<GameStore, [], [], PetSlice> = (set, get) => ({
    unlockPet: (defId) => {
        set((store) => {
            const def = PET_DEFINITIONS[defId];
            if (!def) return {};

            // Check if already unlocked (optional, maybe allow duplicates?)
            // For now, unique pets
            if (store.state.stats.pets?.some(p => p.defId === defId)) return {};

            const newPet: Pet = {
                id: uuidv4(),
                defId: defId,
                name: def.name,
                level: 1,
                xp: 0,
                xpForNextLevel: 100,
                stage: 'baby',
                bond: 0,
                isEquipped: false
            };

            const newPets = [...(store.state.stats.pets || []), newPet];

            return {
                state: {
                    ...store.state,
                    stats: {
                        ...store.state.stats,
                        pets: newPets
                    },
                    logs: [createLog('Sistema', 'Mascota Desbloqueada', `¡Has obtenido ${def.name}!`), ...store.state.logs]
                }
            };
        });
    },

    equipPet: (petId) => {
        set((store) => {
            const pets = store.state.stats.pets || [];
            const pet = pets.find(p => p.id === petId);
            if (!pet) return {};

            // Unequip current
            const updatedPets = pets.map(p => ({
                ...p,
                isEquipped: p.id === petId
            }));

            return {
                state: {
                    ...store.state,
                    stats: {
                        ...store.state.stats,
                        pets: updatedPets,
                        activePetId: petId
                    }
                }
            };
        });
    },

    feedPet: (petId, amount) => {
        set((store) => {
            const pets = store.state.stats.pets || [];
            const petIndex = pets.findIndex(p => p.id === petId);
            if (petIndex === -1) return {};

            const pet = { ...pets[petIndex] };
            pet.xp += amount;
            pet.bond = Math.min(100, pet.bond + 1);

            let leveledUp = false;
            while (pet.xp >= pet.xpForNextLevel) {
                pet.xp -= pet.xpForNextLevel;
                pet.level += 1;
                pet.xpForNextLevel = Math.floor(pet.xpForNextLevel * 1.2);
                leveledUp = true;
            }

            const newPets = [...pets];
            newPets[petIndex] = pet;

            const logs = [...store.state.logs];
            if (leveledUp) {
                logs.unshift(createLog('Sistema', 'Nivel de Mascota', `¡${pet.name} alcanzó el Nivel ${pet.level}!`));
            }

            return {
                state: {
                    ...store.state,
                    stats: {
                        ...store.state.stats,
                        pets: newPets
                    },
                    logs
                }
            };
        });
    },

    checkPetEvolution: (petId) => {
        // Placeholder for evolution logic
        console.log('Checking evolution for', petId);
    }
});
