import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/index';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Lock, Swords, AlertTriangle, Trophy, Zap, ChevronRight, ChevronLeft, Crown, Image, Info, X } from 'lucide-react';
import { AppState } from '@/types';
import { calculateTotalPower } from '@/store/index';
import { getDungeon } from '@/dungeons/dungeonGenerator';
import { t, Language } from '@/data/translations';

// Drop rate info for the modal
const DROP_RATE_INFO = [
    { rarity: 'Common', color: '#94a3b8', unlockFloor: 1, baseRate: '50% → 5%' },
    { rarity: 'Uncommon', color: '#22c55e', unlockFloor: 1, baseRate: '25% → 5%' },
    { rarity: 'Rare', color: '#3b82f6', unlockFloor: 1, baseRate: '10% → 35%' },
    { rarity: 'Epic', color: '#a855f7', unlockFloor: 1, baseRate: '5% → 25%' },
    { rarity: 'Legendary', color: '#f59e0b', unlockFloor: 1, baseRate: '2% → 15%' },
    { rarity: 'Mythic', color: '#ef4444', unlockFloor: 50, baseRate: '1% → 10%' },
    { rarity: 'Godlike', color: '#ffffff', unlockFloor: 80, baseRate: '0.5% → 5%' },
    { rarity: 'Celestial', color: '#00ffff', unlockFloor: 120, baseRate: '0.2% → 3%' },
    { rarity: 'Transcendent', color: '#fffacd', unlockFloor: 150, baseRate: '0.1% → 2%' },
    // Zone Rarities (High Tier - Tier 1)
    { rarity: 'Primordial', color: '#f59e0b', unlockFloor: 251, baseRate: '0.09% → 1.8%' },
    { rarity: 'Eternal', color: '#10b981', unlockFloor: 301, baseRate: '0.08% → 1.6%' },
    { rarity: 'Divine', color: '#fcd34d', unlockFloor: 351, baseRate: '0.07% → 1.4%' },
    { rarity: 'Cosmic', color: '#6366f1', unlockFloor: 401, baseRate: '0.06% → 1.2%' },
    { rarity: 'Infinite', color: '#ffffff', unlockFloor: 451, baseRate: '0.05% → 1.0%' },
    // Zone Rarities (Tier 2 - Elemental)
    { rarity: 'Magma', color: '#ef4444', unlockFloor: 501, baseRate: '0.05% → 1%' },
    { rarity: 'Abyssal', color: '#06b6d4', unlockFloor: 651, baseRate: '0.04% → 0.9%' },
    { rarity: 'Verdant', color: '#22c55e', unlockFloor: 801, baseRate: '0.03% → 0.8%' },
    { rarity: 'Storm', color: '#a855f7', unlockFloor: 951, baseRate: '0.02% → 0.7%' },
    { rarity: 'Lunar', color: '#cbd5e1', unlockFloor: 1101, baseRate: '0.01% → 0.6%' },
    { rarity: 'Solar', color: '#fbbf24', unlockFloor: 1251, baseRate: '0.01% → 0.5%' },
    { rarity: 'Nebula', color: '#e879f9', unlockFloor: 1401, baseRate: '0.009% → 0.4%' },
    { rarity: 'Singularity', color: '#8b5cf6', unlockFloor: 1551, baseRate: '0.008% → 0.3%' },
    { rarity: 'Nova', color: '#fb7185', unlockFloor: 1701, baseRate: '0.007% → 0.2%' },
    { rarity: 'Cyber', color: '#34d399', unlockFloor: 1851, baseRate: '0.006% → 0.15%' },
    { rarity: 'Crystal', color: '#5eead4', unlockFloor: 2001, baseRate: '0.005% → 0.12%' },
    { rarity: 'Ethereal', color: '#7dd3fc', unlockFloor: 2151, baseRate: '0.004% → 0.1%' },
    { rarity: 'Crimson', color: '#ef4444', unlockFloor: 2301, baseRate: '0.003% → 0.09%' },
    { rarity: 'Heavenly', color: '#fef08a', unlockFloor: 2451, baseRate: '0.002% → 0.08%' },
    { rarity: 'Antimatter', color: '#ffffff', unlockFloor: 2601, baseRate: '0.001% → 0.07%' },
    { rarity: 'Temporal', color: '#fb923c', unlockFloor: 2751, baseRate: '0.0009% → 0.06%' },
    { rarity: 'Chaotic', color: '#ec4899', unlockFloor: 2901, baseRate: '0.0008% → 0.05%' },
    { rarity: 'Void', color: '#6b7280', unlockFloor: 3051, baseRate: '0.0005% → 0.04%' },
    { rarity: 'Omega', color: '#6366f1', unlockFloor: 3201, baseRate: '0.0001% → 0.01%' },
];

interface DungeonsViewProps {
    state: AppState;
    onSelectDungeon: (id: string | null) => void;
    language: Language;
}

export const DungeonsView: React.FC<DungeonsViewProps> = ({ state, onSelectDungeon, language }) => {
    const { startDungeonRun } = useStore();
    const userPower = calculateTotalPower(state);
    const [showDropInfo, setShowDropInfo] = useState(false);

    // Calculate max reached floor based on victory history
    const maxReachedFloor = (state.dungeonRuns || [])
        .filter(r => r.victory)
        .reduce((max, r) => {
            const floor = parseInt(r.dungeonId.split('_')[1] || '0');
            return Math.max(max, floor);
        }, 0);

    const currentProgressionFloor = maxReachedFloor + 1;

    // Force viewing the current progression floor. No navigation allowed.
    const viewingFloor = currentProgressionFloor;

    const dungeon = getDungeon(viewingFloor);
    const isLocked = false; // Always unlocked because it's the current progression floor
    const isCompleted = false; // Never completed because it's the next one
    const isBoss = viewingFloor % 10 === 0;

    return (
        <div className="space-y-6 pb-24 min-h-[80vh] flex flex-col">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3">
                        <span className="text-red-600">DEMON</span> TOWER
                    </h2>
                    <p className="text-gray-400 text-xs md:text-sm">Ascend the infinite tower. Survive.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
                    {/* Info Button */}
                    <button
                        onClick={() => setShowDropInfo(true)}
                        className="w-10 h-10 bg-amber-900/30 border border-amber-500/50 rounded-full flex items-center justify-center text-amber-400 hover:bg-amber-900/50 hover:scale-105 transition-all shrink-0"
                    >
                        <Info size={20} />
                    </button>
                    <div className="bg-blue-900/20 border border-blue-500/30 px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2 overflow-hidden flex-1 md:flex-initial justify-center md:justify-start min-w-0">
                        <Zap size={16} className="text-blue-400 fill-blue-400 shrink-0" />
                        <span className="font-black text-lg md:text-xl text-blue-100 truncate">{userPower.toLocaleString()}</span>
                        <span className="text-[10px] md:text-xs text-blue-400 uppercase tracking-wider ml-1 whitespace-nowrap">{t('dungeon_cp', language)}</span>
                    </div>
                </div>
            </div>

            {/* Drop Rates Modal */}
            <AnimatePresence>
                {showDropInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowDropInfo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_40px_rgba(245,158,11,0.2)]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                    <Info size={20} />
                                    Drop Rates
                                </h3>
                                <button onClick={() => setShowDropInfo(false)} className="text-gray-500 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {DROP_RATE_INFO
                                    .filter(item => item.unlockFloor <= (viewingFloor + 5)) // Show slightly ahead (next 5 floors) to hint upcoming, or strictly viewingFloor? User said "don't exist until". Let's use viewingFloor.
                                    .filter(item => item.unlockFloor <= viewingFloor)
                                    .map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 rounded-lg border"
                                            style={{
                                                backgroundColor: `${item.color}10`,
                                                borderColor: `${item.color}40`
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
                                                />
                                                <span className="font-bold text-sm" style={{ color: item.color }}>
                                                    {t(`rarity_${item.rarity.toLowerCase()}` as any, language) || item.rarity}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="text-gray-400">
                                                    Floor <span className="font-bold text-white">{item.unlockFloor}+</span>
                                                </span>
                                                <span className="font-mono font-bold" style={{ color: item.color }}>
                                                    {item.baseRate}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <p className="text-[10px] text-gray-500 mt-4 text-center">
                                Drop rates increase as you climb higher floors
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tower Navigation */}
            <div className="flex-1 flex flex-col items-center justify-center relative">

                {/* Floor Indicator */}
                <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                    <div className="bg-black/50 backdrop-blur-md border border-gray-800 px-8 py-3 rounded-full flex items-center gap-4 shadow-xl">
                        <div className="text-center">
                            <div className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mb-1">Current Floor</div>
                            <div className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{viewingFloor}</div>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div
                    key={viewingFloor}
                    className={`
                        w-full max-w-md relative mt-16 p-1 rounded-3xl bg-gradient-to-b animate-in fade-in slide-in-from-bottom-4 duration-500
                        ${isBoss
                            ? 'from-red-600 via-red-900 to-black shadow-[0_0_50px_rgba(220,38,38,0.3)]'
                            : 'from-blue-600 via-slate-900 to-black shadow-[0_0_30px_rgba(37,99,235,0.2)]'
                        }
                    `}
                >
                    <div className="bg-slate-950 rounded-[22px] p-6 h-full border border-white/10 relative overflow-hidden">
                        {/* Background Ambience */}
                        <div className={`absolute inset-0 opacity-20 ${isBoss ? 'bg-[url("/patterns/boss_bg.png")]' : 'bg-[url("/patterns/dungeon_bg.png")]'} bg-cover bg-center`} />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center gap-6">

                            {/* Icon */}
                            <div className={`
                                    w-24 h-24 rounded-2xl flex items-center justify-center border-2 shadow-2xl
                                    ${isBoss
                                    ? 'bg-red-950/50 border-red-500 text-red-500 animate-pulse'
                                    : 'bg-slate-900/50 border-blue-500 text-blue-400'
                                }
                                `}>
                                {isLocked ? <Lock size={40} /> : isBoss ? <Skull size={48} /> : <Swords size={40} />}
                            </div>

                            {/* Title & Info */}
                            <div>
                                <div className={`text-xs font-bold px-3 py-1 rounded-full border inline-block mb-2 ${dungeon.difficulty === 'S' || dungeon.difficulty === 'SS' || dungeon.difficulty === 'SSS' ? 'bg-red-500/20 border-red-500 text-red-400' :
                                    'bg-blue-500/20 border-blue-500 text-blue-400'
                                    }`}>
                                    {dungeon.difficulty}-RANK
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
                                    {dungeon.name}
                                </h3>
                                <p className="text-gray-400 text-xs max-w-[250px] mx-auto leading-relaxed">
                                    {dungeon.description}
                                </p>
                            </div>

                            {/* Rewards Preview */}
                            <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Potential Rewards</div>
                                <div className="flex justify-center gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded bg-yellow-500/20 flex items-center justify-center text-yellow-500 border border-yellow-500/30">
                                            <span className="font-bold text-xs">XP</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400">{Math.floor(dungeon.rewards.xp * 0.4)}</span>
                                    </div>
                                    {isBoss && (
                                        <>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-10 h-10 rounded bg-purple-500/20 flex items-center justify-center text-purple-500 border border-purple-500/30 animate-pulse">
                                                    <Crown size={16} />
                                                </div>
                                                <span className="text-[10px] text-purple-400 font-bold">Title?</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-10 h-10 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-500 border border-cyan-500/30 animate-pulse">
                                                    <Image size={16} />
                                                </div>
                                                <span className="text-[10px] text-cyan-400 font-bold">Frame?</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="w-full space-y-3">
                                <div className="flex justify-between text-xs font-bold px-2">
                                    <span className="text-gray-500">REQ. POWER</span>
                                    <span className={userPower >= dungeon.recommendedPower ? 'text-green-400' : 'text-red-500'}>
                                        {dungeon.recommendedPower.toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={() => startDungeonRun(dungeon.id)}
                                    disabled={isLocked || userPower < dungeon.recommendedPower}
                                    className={`
                                            w-full py-4 rounded-xl font-black text-lg tracking-widest uppercase transition-all relative overflow-hidden
                                            ${isLocked
                                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                            : userPower >= dungeon.recommendedPower
                                                ? 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                                : 'bg-red-900/20 border border-red-500/50 text-red-500 cursor-not-allowed'
                                        }
                                        `}
                                >
                                    {isLocked ? 'LOCKED' : userPower < dungeon.recommendedPower ? 'INSUFFICIENT POWER' : isCompleted ? 'REPLAY FLOOR' : 'ENTER FLOOR'}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
