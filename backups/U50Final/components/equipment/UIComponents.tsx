import React from 'react';
import { motion } from 'framer-motion';
import { Equipment, EquipmentSet, EquipmentType, ItemRarity } from '@/types';
import { Sword, Shield, Zap, Crown, Star, Hammer, Trash2, Shirt, Footprints, HandMetal, Gem, Ear } from 'lucide-react';

// --- UTILS ---
const RARITY_STYLES: Record<ItemRarity, string> = {
    common: 'border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-900/40 text-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.1)]',
    uncommon: 'border-green-500/30 bg-gradient-to-br from-green-900/40 to-green-900/10 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.15)]',
    rare: 'border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-blue-900/10 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.2)]',
    epic: 'border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-purple-900/10 text-purple-400 shadow-[0_0_25px_rgba(192,132,252,0.25)]',
    legendary: 'border-yellow-500/30 bg-gradient-to-br from-yellow-900/40 to-yellow-900/10 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]',
    mythic: 'border-red-500/30 bg-gradient-to-br from-red-900/40 to-red-900/10 text-red-500 shadow-[0_0_35px_rgba(248,113,113,0.35)] animate-pulse',
    godlike: 'border-white/20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 shadow-[0_0_40px_rgba(255,255,255,0.2)]',
    celestial: 'border-cyan-500/30 bg-gradient-to-br from-cyan-900/40 to-cyan-900/10 text-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.35)] animate-pulse'
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
        relative p-3 rounded-xl border backdrop-blur-md transition-all cursor-pointer group overflow-hidden
        ${RARITY_STYLES[item.rarity]}
        hover:brightness-110
      `}
        >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                    <h4 className={`font-black text-xs uppercase tracking-widest ${item.rarity === 'godlike' ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500' : ''}`}>
                        {item.name}
                    </h4>
                    <span className="text-[9px] opacity-70 uppercase font-mono tracking-wider block mt-0.5">
                        {item.rarity} {item.type} <span className="text-white/50">•</span> Lvl {item.level}
                    </span>
                </div>
                {item.isEquipped && (
                    <span className="bg-blue-600/80 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shadow-lg border border-blue-400/30">
                        Equipped
                    </span>
                )}
            </div>

            {item.image && (
                <div className="flex justify-center mb-3 relative z-10">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain drop-shadow-lg" />
                </div>
            )}

            <div className="space-y-1 mb-3 relative z-10 bg-black/20 rounded-lg p-2 border border-white/5">
                {item.baseStats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-60 uppercase tracking-wide">{stat.stat}</span>
                        <span className="font-bold text-white">+{Math.floor(stat.value * (1 + item.level * 0.1))}</span>
                    </div>
                ))}
            </div>

            {showActions && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-white/10 relative z-10">
                    {item.isEquipped ? (
                        <button onClick={(e) => { e.stopPropagation(); onUnequip?.(); }} className="flex-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] py-1.5 rounded font-bold uppercase tracking-wider transition-colors">Unequip</button>
                    ) : (
                        <button onClick={(e) => { e.stopPropagation(); onEquip?.(); }} className="flex-1 bg-blue-600/80 hover:bg-blue-500 text-white text-[10px] py-1.5 rounded font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-900/20">Equip</button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onUpgrade?.(); }} className="p-1.5 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded border border-green-500/20 transition-colors"><Hammer size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onSalvage?.(); }} className="p-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded border border-red-500/20 transition-colors"><Trash2 size={12} /></button>
                </div>
            )}
        </motion.div>
    );
};

interface EquipmentSlotProps {
    type: EquipmentType;
    item?: Equipment;
    onClick: () => void;
    size?: 'md' | 'lg';
}

const SLOT_ICONS: Record<EquipmentType, React.ElementType> = {
    weapon: Sword,
    helmet: Crown,
    chest: Shirt,
    gloves: HandMetal,
    boots: Footprints,
    necklace: Gem,
    ring: Star,
    ring2: Star,
    earrings: Ear
};

const getLevelBorder = (level: number) => {
    if (level >= 20) return 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse'; // Godlike Gold
    if (level >= 15) return 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'; // Mythic Red
    if (level >= 10) return 'border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]'; // Epic Purple
    if (level >= 5) return 'border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]'; // Rare Blue
    return 'border-slate-800'; // Default
};

export const EquipmentSlot: React.FC<EquipmentSlotProps> = ({ type, item, onClick, size = 'md' }) => {
    const Icon = SLOT_ICONS[type] || Shield;
    const sizeClasses = size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';
    const iconSize = size === 'lg' ? 32 : 24;

    const levelBorder = item ? getLevelBorder(item.level) : 'border-slate-800';

    return (
        <div
            onClick={onClick}
            className={`
        ${sizeClasses} rounded-xl flex items-center justify-center relative cursor-pointer group transition-all duration-300
        ${item
                    ? `${RARITY_STYLES[item.rarity]} border-2 ${levelBorder}`
                    : 'bg-[#0a0f1e] border border-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                }
      `}
        >
            {/* Inner shadow for empty slot */}
            {!item && <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none" />}

            {item ? (
                item.image ? (
                    <img src={item.image} alt={item.name} className={`object-contain drop-shadow-md ${size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'}`} />
                ) : (
                    <div className="text-center relative z-10">
                        <Icon size={iconSize} className="opacity-90 drop-shadow-md" />
                    </div>
                )
            ) : (
                <Icon size={size === 'lg' ? 28 : 20} className="text-slate-700 group-hover:text-blue-500/70 transition-colors duration-300" />
            )}

            {item && (
                <div className="absolute -bottom-2 -right-2 bg-slate-950 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 font-mono text-white font-bold shadow-lg z-20">
                    +{item.level}
                </div>
            )}

            {/* Slot Label (only if empty) */}
            {!item && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-slate-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {type}
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
                    <div key={set.id} className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/50 p-4 rounded-xl backdrop-blur-md shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 uppercase tracking-wider">{set.name}</h4>
                            <div className="bg-slate-800/50 px-2 py-1 rounded text-[10px] text-slate-400 font-mono border border-slate-700">
                                <span className="text-yellow-400 font-bold">{equippedCount}</span> / {set.pieces.length}
                            </div>
                        </div>
                        <div className="space-y-2">
                            {set.bonuses.map((bonus, idx) => {
                                const isActive = equippedCount >= bonus.requiredCount;
                                return (
                                    <div key={idx} className={`text-xs flex items-start gap-2 transition-colors duration-300 ${isActive ? 'text-green-400' : 'text-slate-600'}`}>
                                        <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-slate-700'}`}></div>
                                        <div>
                                            <span className="font-mono font-bold mr-1">({bonus.requiredCount})</span>
                                            <span className={isActive ? 'text-white' : ''}>{bonus.effect}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
