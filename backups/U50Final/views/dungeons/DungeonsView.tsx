import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/index';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Lock, Swords, AlertTriangle, Trophy, Zap, ChevronRight, ChevronLeft, Crown, Image } from 'lucide-react';
import { AppState } from '@/types';
import { calculateTotalPower } from '@/store/index';
import { getDungeon } from '@/dungeons/dungeonGenerator';
import { t, Language } from '@/data/translations';

interface DungeonsViewProps {
    state: AppState;
    onSelectDungeon: (id: string | null) => void;
    language: Language;
}

export const DungeonsView: React.FC<DungeonsViewProps> = ({ state, onSelectDungeon, language }) => {
    const { startDungeonRun } = useStore();
    const userPower = calculateTotalPower(state);

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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                        <span className="text-red-600">DEMON</span> TOWER
                    </h2>
                    <p className="text-gray-400 text-sm">Ascend the infinite tower. Survive.</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 px-4 py-2 rounded-xl flex items-center gap-2">
                    <Zap size={16} className="text-blue-400 fill-blue-400" />
                    <span className="font-black text-xl text-blue-100">{userPower.toLocaleString()}</span>
                    <span className="text-xs text-blue-400 uppercase tracking-wider ml-1">{t('dungeon_cp', language)}</span>
                </div>
            </div>

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
                                        <span className="text-[10px] text-gray-400">{dungeon.rewards.xp}</span>
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
