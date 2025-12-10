import React from 'react';
import { motion } from 'framer-motion';
import { Equipment, EquipmentSet, EquipmentType, ItemRarity } from '@/types';
import { Sword, Shield, Zap, Crown, Star, Hammer, Trash2, Shirt, Footprints, HandMetal, Gem, Ear, Coins } from 'lucide-react';
import { getUpgradeTier, calculateSalvageValue, getMaxLevel } from '@/data/equipmentConstants';

// --- UTILS ---
const RARITY_STYLES: Partial<Record<ItemRarity, string>> = {
    common: 'bg-gradient-to-br from-slate-900/80 to-slate-900/40 text-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.1)]',
    uncommon: 'bg-gradient-to-br from-green-900/40 to-green-900/10 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.15)]',
    rare: 'bg-gradient-to-br from-blue-900/40 to-blue-900/10 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.2)]',
    epic: 'bg-gradient-to-br from-purple-900/40 to-purple-900/10 text-purple-400 shadow-[0_0_25px_rgba(192,132,252,0.25)]',
    legendary: 'bg-gradient-to-br from-yellow-900/40 to-yellow-900/10 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]',
    mythic: 'bg-gradient-to-br from-red-900/40 to-red-900/10 text-red-500 shadow-[0_0_35px_rgba(248,113,113,0.35)] animate-pulse',
    godlike: 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white shadow-[0_0_40px_rgba(255,255,255,0.3)]',
    celestial: 'bg-gradient-to-br from-cyan-900/40 to-cyan-900/10 text-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.4)] animate-pulse',
    transcendent: 'bg-gradient-to-br from-amber-900/30 via-yellow-900/20 to-white/10 text-amber-200 shadow-[0_0_50px_rgba(251,191,36,0.4)] animate-pulse',
    primordial: 'bg-gradient-to-br from-amber-950/80 to-orange-950/60 text-amber-500 border-amber-800/50 shadow-[0_0_35px_rgba(245,158,11,0.4)]',
    eternal: 'bg-gradient-to-br from-emerald-950/80 to-teal-950/60 text-emerald-300 border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.4)] animate-pulse',
    divine: 'bg-gradient-to-br from-yellow-100/20 to-amber-100/10 text-yellow-50 border-yellow-200/50 shadow-[0_0_40px_rgba(254,240,138,0.5)] animate-pulse',
    cosmic: 'bg-gradient-to-br from-indigo-950/80 to-blue-950/60 text-indigo-300 border-indigo-500/50 shadow-[0_0_35px_rgba(99,102,241,0.4)] animate-pulse',
    infinite: 'bg-black border-white/20 text-white shadow-[0_0_40px_rgba(255,255,255,0.4)]',
    // Zone Rarities
    magma: 'bg-gradient-to-br from-red-900/60 to-orange-900/40 text-red-400 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse',
    abyssal: 'bg-gradient-to-br from-cyan-900/60 to-blue-900/40 text-cyan-300 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse',
    verdant: 'bg-gradient-to-br from-emerald-900/60 to-green-900/40 text-emerald-400 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse',
    storm: 'bg-gradient-to-br from-purple-900/60 to-indigo-900/40 text-purple-400 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse',
    lunar: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60 text-slate-300 border-slate-400/50 shadow-[0_0_30px_rgba(148,163,184,0.4)]',
    solar: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-amber-300 border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.5)] animate-pulse',
    nebula: 'bg-gradient-to-br from-fuchsia-900/60 to-pink-900/40 text-fuchsia-300 border-fuchsia-500/50 shadow-[0_0_30px_rgba(232,121,249,0.4)] animate-pulse',
    singularity: 'bg-gradient-to-br from-violet-950/90 to-black text-violet-400 border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.5)] animate-pulse',
    nova: 'bg-gradient-to-br from-rose-600/30 to-red-600/20 text-rose-300 border-rose-400/50 shadow-[0_0_35px_rgba(251,113,133,0.5)] animate-pulse',
    cyber: 'bg-gradient-to-br from-emerald-900/60 to-green-900/40 text-emerald-400 border-emerald-400/50 shadow-[0_0_30px_rgba(52,211,153,0.4)]',
    crystal: 'bg-gradient-to-br from-teal-900/60 to-cyan-900/40 text-teal-300 border-teal-400/50 shadow-[0_0_30px_rgba(45,212,191,0.4)]',
    ethereal: 'bg-gradient-to-br from-sky-900/60 to-blue-900/40 text-sky-300 border-sky-400/50 shadow-[0_0_30px_rgba(56,189,248,0.4)] animate-pulse',
    crimson: 'bg-gradient-to-br from-red-950/80 to-red-900/60 text-red-500 border-red-600/50 shadow-[0_0_35px_rgba(220,38,38,0.5)] animate-pulse',
    heavenly: 'bg-gradient-to-br from-yellow-200/20 to-amber-100/10 text-yellow-100 border-yellow-200/50 shadow-[0_0_35px_rgba(254,240,138,0.5)] animate-pulse',
    antimatter: 'bg-gradient-to-br from-white/10 to-gray-200/5 text-white border-white/40 shadow-[0_0_35px_rgba(255,255,255,0.5)] animate-pulse',
    temporal: 'bg-gradient-to-br from-orange-400/20 to-amber-500/20 text-orange-200 border-orange-300/50 shadow-[0_0_30px_rgba(251,146,60,0.4)]',
    chaotic: 'bg-gradient-to-br from-pink-600/30 to-rose-600/20 text-pink-300 border-pink-500/50 shadow-[0_0_35px_rgba(236,72,153,0.5)] animate-shake',
    void: 'bg-black border-gray-700/50 text-gray-400 shadow-[0_0_40px_rgba(0,0,0,0.8)]',
    omega: 'bg-gradient-to-br from-indigo-950 via-black to-violet-950 text-indigo-400 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.8)] animate-pulse'
};

const RARITY_TEXT_STYLES: Partial<Record<ItemRarity, { title: string; subtitle: string; stats: string; statValue: string }>> = {
    common: { title: 'text-slate-200', subtitle: 'text-slate-400', stats: 'text-slate-500', statValue: 'text-slate-300' },
    uncommon: { title: 'text-green-300', subtitle: 'text-green-500', stats: 'text-green-600/80', statValue: 'text-green-400' },
    rare: { title: 'text-blue-300', subtitle: 'text-blue-400', stats: 'text-blue-500/80', statValue: 'text-blue-300' },
    epic: { title: 'text-purple-300', subtitle: 'text-purple-400', stats: 'text-purple-500/80', statValue: 'text-purple-300' },
    legendary: { title: 'text-yellow-300', subtitle: 'text-yellow-400', stats: 'text-yellow-500/80', statValue: 'text-yellow-200' },
    mythic: { title: 'text-red-400 drop-shadow-md', subtitle: 'text-red-500', stats: 'text-red-500/80', statValue: 'text-red-300' },
    godlike: { title: 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]', subtitle: 'text-white/80', stats: 'text-white/70', statValue: 'text-white' },
    celestial: { title: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]', subtitle: 'text-cyan-400', stats: 'text-cyan-500/80', statValue: 'text-cyan-200' },
    transcendent: { title: 'text-amber-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]', subtitle: 'text-amber-300', stats: 'text-amber-400/80', statValue: 'text-amber-100' },
    primordial: { title: 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]', subtitle: 'text-amber-600', stats: 'text-amber-700/80', statValue: 'text-amber-400' },
    eternal: { title: 'text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]', subtitle: 'text-emerald-400', stats: 'text-emerald-500/80', statValue: 'text-emerald-200' },
    divine: { title: 'text-yellow-50 drop-shadow-[0_0_8px_rgba(254,240,138,0.8)]', subtitle: 'text-yellow-100', stats: 'text-yellow-200/80', statValue: 'text-yellow-50' },
    cosmic: { title: 'text-indigo-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]', subtitle: 'text-indigo-400', stats: 'text-indigo-500/80', statValue: 'text-indigo-200' },
    infinite: { title: 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]', subtitle: 'text-gray-400', stats: 'text-gray-500/80', statValue: 'text-white' },

    // Zone Rarities
    magma: { title: 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]', subtitle: 'text-orange-500', stats: 'text-orange-600/80', statValue: 'text-orange-300' },
    abyssal: { title: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]', subtitle: 'text-cyan-400', stats: 'text-cyan-500/80', statValue: 'text-cyan-200' },
    verdant: { title: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]', subtitle: 'text-emerald-500', stats: 'text-emerald-600/80', statValue: 'text-emerald-300' },
    storm: { title: 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]', subtitle: 'text-violet-500', stats: 'text-violet-600/80', statValue: 'text-violet-300' },
    lunar: { title: 'text-slate-200 drop-shadow-[0_0_8px_rgba(226,232,240,0.8)]', subtitle: 'text-slate-400', stats: 'text-slate-500/80', statValue: 'text-slate-300' },
    solar: { title: 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]', subtitle: 'text-amber-400', stats: 'text-amber-500/80', statValue: 'text-amber-200' },
    nebula: { title: 'text-fuchsia-300 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]', subtitle: 'text-fuchsia-400', stats: 'text-fuchsia-500/80', statValue: 'text-fuchsia-200' },
    singularity: { title: 'text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]', subtitle: 'text-violet-600', stats: 'text-violet-700/80', statValue: 'text-violet-400' },
    nova: { title: 'text-rose-300 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]', subtitle: 'text-rose-400', stats: 'text-rose-500/80', statValue: 'text-rose-200' },
    cyber: { title: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] font-mono', subtitle: 'text-emerald-500 font-mono', stats: 'text-emerald-600/80 font-mono', statValue: 'text-emerald-300 font-mono' },
    crystal: { title: 'text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]', subtitle: 'text-teal-400', stats: 'text-teal-500/80', statValue: 'text-teal-200' },
    ethereal: { title: 'text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]', subtitle: 'text-sky-400', stats: 'text-sky-500/80', statValue: 'text-sky-200' },
    crimson: { title: 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]', subtitle: 'text-red-600', stats: 'text-red-700/80', statValue: 'text-red-400' },
    heavenly: { title: 'text-yellow-100 drop-shadow-[0_0_8px_rgba(254,240,138,0.8)]', subtitle: 'text-yellow-200', stats: 'text-yellow-300/80', statValue: 'text-yellow-50' },
    antimatter: { title: 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] invert', subtitle: 'text-gray-400', stats: 'text-gray-500/80', statValue: 'text-white' },
    temporal: { title: 'text-orange-200 drop-shadow-[0_0_8px_rgba(253,186,116,0.8)]', subtitle: 'text-orange-300', stats: 'text-orange-400/80', statValue: 'text-orange-100' },
    chaotic: { title: 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]', subtitle: 'text-pink-400', stats: 'text-pink-500/80', statValue: 'text-pink-200' },
    void: { title: 'text-gray-400 drop-shadow-[0_0_8px_rgba(156,163,175,0.8)]', subtitle: 'text-gray-500', stats: 'text-gray-600/80', statValue: 'text-gray-300' },
    omega: { title: 'text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,1)] animate-pulse', subtitle: 'text-indigo-500', stats: 'text-indigo-600/80', statValue: 'text-indigo-200' }
};

// --- COMPONENTS ---

interface ItemCardProps {
    item: Equipment;
    onClick?: () => void;
    onEquip?: () => void;
    onUpgrade?: () => void;
    onSalvage?: () => void;
    showActions?: boolean;
    unequipLabel?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, onEquip, onUnequip, onUpgrade, onSalvage, showActions, unequipLabel = 'Unequip' }) => {
    // Get upgrade tier for border color
    const upgradeTier = getUpgradeTier(item.level);
    const maxLevel = getMaxLevel(item.rarity);
    const isMaxLevel = item.level >= maxLevel;
    const salvageValue = calculateSalvageValue(item.rarity, item.level);

    return (
        <motion.div
            layout
            onClick={onClick}
            className={`
        relative p-3 rounded-xl border-2 backdrop-blur-md transition-all cursor-pointer group overflow-hidden
        ${RARITY_STYLES[item.rarity] || RARITY_STYLES['common']}
        ${upgradeTier.color}
        ${upgradeTier.glow}
        hover:brightness-110
      `}
        >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                    <h4 className={`font-black text-xs uppercase tracking-widest ${RARITY_TEXT_STYLES[item.rarity]?.title || 'text-slate-200'}`}>
                        {item.name}
                    </h4>
                    <span className={`text-[9px] uppercase font-mono tracking-wider block mt-0.5 ${RARITY_TEXT_STYLES[item.rarity]?.subtitle || 'opacity-70'}`}>
                        {item.rarity} {item.type} <span className="text-white/50">•</span> +{item.level}/{maxLevel}
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
                        <span className={`uppercase tracking-wide ${RARITY_TEXT_STYLES[item.rarity]?.stats || 'opacity-60'}`}>{stat.stat}</span>
                        <span className={`font-bold ${RARITY_TEXT_STYLES[item.rarity]?.statValue || 'text-white'}`}>+{stat.value}</span>
                    </div>
                ))}
            </div>

            {showActions && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-white/10 relative z-10">
                    {item.isEquipped ? (
                        <button onClick={(e) => { e.stopPropagation(); onUnequip?.(); }} className="flex-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] py-1.5 rounded font-bold uppercase tracking-wider transition-colors">{unequipLabel}</button>
                    ) : (
                        <button onClick={(e) => { e.stopPropagation(); onEquip?.(); }} className="flex-1 bg-blue-600/80 hover:bg-blue-500 text-white text-[10px] py-1.5 rounded font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-900/20">Equip</button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onUpgrade?.(); }}
                        className={`p-1.5 rounded border transition-colors ${isMaxLevel
                            ? 'bg-slate-900/50 text-slate-600 border-slate-700 cursor-not-allowed'
                            : 'bg-green-900/30 hover:bg-green-900/50 text-green-400 border-green-500/20'}`}
                        disabled={isMaxLevel}
                    >
                        <Hammer size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSalvage?.(); }}
                        className="p-1.5 bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 rounded border border-amber-500/20 transition-colors flex items-center gap-1"
                        title={`Salvage for ${salvageValue} shards`}
                    >
                        <Coins size={12} />
                        <span className="text-[9px] font-bold">{salvageValue}</span>
                    </button>
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

// Helper to get raw color for dynamic styles
const getRarityHeX = (rarity: string) => {
    switch (rarity.toLowerCase()) {
        case 'common': return '#94a3b8';
        case 'uncommon': return '#22c55e';
        case 'rare': return '#3b82f6';
        case 'epic': return '#a855f7';
        case 'legendary': return '#eab308';
        case 'mythic': return '#ef4444';
        case 'godlike': return '#ffffff';
        case 'celestial': return '#22d3ee';
        case 'transcendent': return '#fbbf24';
        case 'primordial': return '#f59e0b';
        case 'eternal': return '#10b981';
        case 'divine': return '#fef08a';
        case 'cosmic': return '#6366f1';
        case 'infinite': return '#ffffff';
        // Zone Rarities
        case 'magma': return '#ea580c';
        case 'abyssal': return '#06b6d4';
        case 'verdant': return '#10b981';
        case 'storm': return '#8b5cf6';
        case 'lunar': return '#cbd5e1';
        case 'solar': return '#fcd34d';
        case 'nebula': return '#e879f9';
        case 'singularity': return '#8b5cf6';
        case 'nova': return '#fb7185';
        case 'cyber': return '#34d399';
        case 'crystal': return '#2dd4bf';
        case 'ethereal': return '#38bdf8';
        case 'crimson': return '#dc2626';
        case 'heavenly': return '#fef08a';
        case 'antimatter': return '#ffffff';
        case 'temporal': return '#fb923c';
        case 'chaotic': return '#f472b6';
        case 'void': return '#9ca3af';
        case 'omega': return '#4f46e5';
        default: return '#64748b';
    }
};

export const EquipmentSlot: React.FC<EquipmentSlotProps> = ({ type, item, onClick, size = 'md' }) => {
    const Icon = SLOT_ICONS[type] || Shield;
    const sizeClasses = size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';
    const iconSize = size === 'lg' ? 32 : 24;

    const levelBorder = item ? getLevelBorder(item.level) : 'border-slate-800';
    const rarityColor = item ? getRarityHeX(item.rarity) : 'transparent';

    return (
        <div
            onClick={onClick}
            className={`
        ${sizeClasses} rounded-xl flex items-center justify-center relative cursor-pointer group transition-all duration-300 overflow-hidden
        ${item
                    ? `${RARITY_STYLES[item.rarity] || RARITY_STYLES['common']} border-2 ${levelBorder}`
                    : 'bg-[#0a0f1e] border border-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                }
      `}
        >
            {/* Inner shadow for empty slot */}
            {!item && <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none" />}

            {/* Rarity Background Glow for Equipped Items */}
            {item && (
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at center, ${rarityColor}, transparent)`
                    }}
                />
            )}

            {item ? (
                item.image ? (
                    <div className="relative z-10 w-full h-full p-1 flex items-center justify-center">
                        {/* Glow behind the specific item image */}
                        <div className="absolute inset-0 blur-md opacity-40 shrink-4" style={{ backgroundColor: rarityColor }} />
                        <img src={item.image} alt={item.name} className={`relative object-contain drop-shadow-md z-10 ${size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'}`} />
                    </div>
                ) : (
                    <div className="text-center relative z-10">
                        <div className="absolute inset-0 blur-md opacity-30" style={{ backgroundColor: rarityColor }} />
                        <Icon size={iconSize} className="relative z-10 opacity-90 drop-shadow-md" />
                    </div>
                )
            ) : (
                <Icon size={size === 'lg' ? 28 : 20} className="text-slate-700 group-hover:text-blue-500/70 transition-colors duration-300" />
            )}

            {item && (
                <div className="absolute -bottom-1 -right-1 bg-slate-950/90 text-[10px] px-1.5 py-0.5 rounded-tl-lg border-l border-t border-slate-700 font-mono text-white font-bold shadow-lg z-20">
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
