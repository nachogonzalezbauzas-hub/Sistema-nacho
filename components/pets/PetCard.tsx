import React from 'react';
import { motion } from 'framer-motion';
import { Pet } from '@/types';
import { PET_DEFINITIONS } from '@/data/pets';
import { useStore } from '@/store';
import { Heart, Zap, Shield, Brain } from 'lucide-react';

interface PetCardProps {
    pet: Pet;
    isActive: boolean;
    onEquip: () => void;
    onFeed: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, isActive, onEquip, onFeed }) => {
    // Visuals based on type and stage
    const getPetImage = () => {
        if (pet.defId === 'igris_wolf') {
            return pet.stage === 'baby' ? '🐺' : pet.stage === 'adult' ? '🐺🔥' : '👹';
        }
        if (pet.defId === 'noctis_owl') {
            return pet.stage === 'baby' ? '🦉' : pet.stage === 'adult' ? '🦉✨' : '🧙‍♂️';
        }
        return '🐾';
    };

    const xpPercentage = (pet.xp / pet.xpForNextLevel) * 100;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative p-4 rounded-xl border-2 transition-all ${isActive ? 'border-purple-500 bg-purple-900/20' : 'border-slate-700 bg-slate-900/50'}`}
        >
            {isActive && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-purple-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    Active
                </div>
            )}

            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl border border-slate-600 shadow-inner">
                    {getPetImage()}
                </div>
                <div>
                    <h3 className="font-black text-white italic">{pet.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Lvl {pet.level} • {pet.stage}</p>
                </div>
            </div>

            {/* XP Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                    <span>XP</span>
                    <span>{pet.xp} / {pet.xpForNextLevel}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${xpPercentage}%` }}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {!isActive && (
                    <button
                        onClick={onEquip}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-white uppercase tracking-wider transition-colors"
                    >
                        Equip
                    </button>
                )}
                <button
                    onClick={onFeed}
                    className="flex-1 py-2 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-400 uppercase tracking-wider transition-colors"
                >
                    Feed
                </button>
            </div>
        </motion.div>
    );
};
