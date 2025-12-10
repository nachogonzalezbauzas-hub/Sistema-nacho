import React from 'react';
import { motion } from 'framer-motion';
import { Equipment, EquipmentSet, EquipmentType, ItemRarity } from '../../types';
import { Sword, Shield, Zap, Crown, Star, Hammer, Trash2, Shirt, Footprints, HandMetal, Gem } from 'lucide-react';

// --- UTILS ---
const RARITY_COLORS: Record<ItemRarity, string> = {
    common: 'text-slate-400 border-slate-600 bg-slate-900/50',
    uncommon: 'text-green-400 border-green-600 bg-green-900/20',
    rare: 'text-blue-400 border-blue-600 bg-blue-900/20',
    epic: 'text-purple-400 border-purple-600 bg-purple-900/20',
    legendary: 'text-yellow-400 border-yellow-600 bg-yellow-900/20',
    mythic: 'text-red-500 border-red-600 bg-red-900/20',
    godlike: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 border-white/50 bg-slate-900/80'
};

const RARITY_BORDER_GLOW: Record<ItemRarity, string> = {
    common: '',
    uncommon: 'shadow-[0_0_10px_rgba(74,222,128,0.2)]',
    rare: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]',
    epic: 'shadow-[0_0_20px_rgba(192,132,252,0.4)]',
    legendary: 'shadow-[0_0_25px_rgba(250,204,21,0.5)]',
    mythic: 'shadow-[0_0_30px_rgba(248,113,113,0.6)]',
    godlike: 'shadow-[0_0_40px_rgba(255,255,255,0.4)]'
};

// --- COMPONENTS ---

interface ItemCardProps {
    item: Equipment;
    onClick?: () => void;
    onEquip?: () => void;
    onUnequip?: () => void;
    onUpgrade?: () => void;
    onSalvage?: () => void;
    showActions?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, onEquip, onUnequip, onUpgrade, onSalvage, showActions }) => {
    return (
        <motion.div
            layout
            onClick={onClick}
            className={`
        relative p-3 rounded-xl border-2 transition-all cursor-pointer group
        ${RARITY_COLORS[item.rarity]}
        ${RARITY_BORDER_GLOW[item.rarity]}
        hover:scale-[1.02]
      `}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">{item.name}</h4>
                    <span className="text-[10px] opacity-70 uppercase font-mono">{item.rarity} {item.type} • Lvl {item.level}</span>
                </div>
                {item.isEquipped && (
                    <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Equipped</span>
                )}
            </div>

            <div className="space-y-1 mb-3">
                {item.baseStats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-mono">
                        <span className="opacity-70">{stat.stat}</span>
                        <span className="font-bold">+{Math.floor(stat.value * (1 + item.level * 0.1))}</span>
                    </div>
                ))}
            </div>

            {showActions && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
                    {item.isEquipped ? (
                        <button onClick={(e) => { e.stopPropagation(); onUnequip?.(); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] py-1 rounded">Unequip</button>
                    ) : (
                        <button onClick={(e) => { e.stopPropagation(); onEquip?.(); }} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] py-1 rounded">Equip</button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onUpgrade?.(); }} className="p-1 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded"><Hammer size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onSalvage?.(); }} className="p-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded"><Trash2 size={12} /></button>
                </div>
            )}
        </motion.div>
    );
};

interface EquipmentSlotProps {
    type: EquipmentType;
    item?: Equipment;
    onClick: () => void;
}

const SLOT_ICONS: Record<EquipmentType, React.ElementType> = {
    weapon: Sword,
    helmet: Crown,
    chest: Shirt,
    gloves: HandMetal,
    boots: Footprints,
    necklace: Gem,
    ring: Star
};

export const EquipmentSlot: React.FC<EquipmentSlotProps> = ({ type, item, onClick }) => {
    const Icon = SLOT_ICONS[type] || Shield;

    return (
        <div
            onClick={onClick}
            className={`
        w-16 h-16 rounded-xl border-2 flex items-center justify-center relative cursor-pointer transition-all
        ${item
                    ? `${RARITY_COLORS[item.rarity]} ${RARITY_BORDER_GLOW[item.rarity]}`
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'
                }
      `}
        >
            {item ? (
                <div className="text-center">
                    <Icon size={24} className="opacity-80" />
                </div>
            ) : (
                <Icon size={20} className="text-slate-700" />
            )}

            {item && (
                <div className="absolute -bottom-1 -right-1 bg-slate-900 text-[9px] px-1 rounded border border-slate-700 font-mono">
                    +{item.level}
                </div>
            )}
        </div>
    );
};

interface SetBonusDisplayProps {
    sets: EquipmentSet[];
    equippedItemIds: string[];
}

export const SetBonusDisplay: React.FC<SetBonusDisplayProps> = ({ sets, equippedItemIds }) => {
    return (
        <div className="space-y-4">
            {sets.map(set => {
                const equippedCount = equippedItemIds.filter(id => {
                    return set.pieces.some(p => id.includes(p));
                }).length;

                if (equippedCount === 0) return null;

                return (
                    <div key={set.id} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-bold text-yellow-500">{set.name}</h4>
                            <span className="text-xs text-slate-500 font-mono">{equippedCount}/{set.pieces.length}</span>
                        </div>
                        <div className="space-y-1">
                            {set.bonuses.map((bonus, idx) => (
                                <div key={idx} className={`text-xs ${equippedCount >= bonus.requiredCount ? 'text-green-400' : 'text-slate-600'}`}>
                                    ({bonus.requiredCount}) {bonus.effect}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
