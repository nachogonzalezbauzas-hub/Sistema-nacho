import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { PetCard } from '@/components/pets/PetCard';
import { PET_DEFINITIONS } from '@/data/pets';
import { t } from '@/data/translations';
import { Lock } from 'lucide-react';

export const PetsView: React.FC = () => {
    const { state, equipPet, feedPet, unlockPet } = useStore();
    const { pets, activePetId } = state.stats;

    // Debug: Unlock pets if none exist
    const handleUnlockDebug = (defId: string) => {
        unlockPet(defId);
    };

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end px-1 pb-2 border-b border-purple-900/30">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">
                        Shadow Army
                    </h2>
                    <p className="text-xs text-purple-400/80 font-mono uppercase tracking-widest mt-1">
                        Companions & Summons
                    </p>
                </div>
            </div>

            {/* Active Pet */}
            {pets && pets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pets.map(pet => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            isActive={pet.id === activePetId}
                            onEquip={() => equipPet(pet.id)}
                            onFeed={() => feedPet(pet.id, 10)} // Debug feed amount
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 opacity-50">
                    <p className="text-slate-500 font-mono text-xs">No shadows extracted yet.</p>
                </div>
            )}

            {/* Available to Unlock (Debug/Demo) */}
            <div className="mt-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Available Shadows</h3>
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(PET_DEFINITIONS).map(def => {
                        const isUnlocked = pets?.some(p => p.defId === def.id);
                        if (isUnlocked) return null;

                        return (
                            <button
                                key={def.id}
                                onClick={() => handleUnlockDebug(def.id)}
                                className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-slate-700 hover:bg-slate-900/50 transition-colors text-left group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 group-hover:text-purple-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-400 group-hover:text-white transition-colors">{def.name}</h4>
                                    <p className="text-[10px] text-slate-600 font-mono">{def.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
