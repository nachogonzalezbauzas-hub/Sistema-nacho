import React, { useMemo } from 'react';
import { useStore } from '@/store/index';
import { motion, AnimatePresence } from 'framer-motion';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { rarityStyles } from '@/components/ui/Titles';
import { Equipment, ItemRarity } from '@/types';
import { Sword, Shield, Crown, Frame, Sparkles, Zap, Skull, Check } from 'lucide-react';

const getRarityColor = (rarity: ItemRarity | string) => {
    // Force lowercase to match keys
    const rKey = rarity.toLowerCase() as ItemRarity;
    const style = rarityStyles[rKey] || rarityStyles.common || { labelColor: 'text-gray-400', borderColor: 'border-gray-700' };

    // Adapt the unified styles for this list view
    return `${style.labelColor} ${style.borderColor} bg-slate-950/40`;
};

export const DungeonRunResultView = () => {
    const { state, closeDungeonResult } = useStore();
    const result = state.lastDungeonResult;

    const rewardsData = useMemo(() => {
        if (!result || !result.victory) return null;

        const equipment = result.equipment || [];
        const unlockedTitle = result.unlockedTitleId ? (TITLES || []).find(t => t.id === result.unlockedTitleId) : null;
        const unlockedFrame = result.unlockedFrameId ? (AVATAR_FRAMES || []).find(f => f.id === result.unlockedFrameId) : null;

        // Filter generic loot
        const genericLoot = (result.rewards || []).filter(r => !r.startsWith('Title:') && !r.startsWith('Frame:'));

        // Check for new shadow
        const shadows = state.shadows || [];
        const newShadow = shadows.find(s => Math.abs(new Date(s.extractedAt).getTime() - new Date(result.timestamp).getTime()) < 5000);

        return { equipment, unlockedTitle, unlockedFrame, genericLoot, newShadow };
    }, [result, state.shadows]);

    if (!result) return null;

    const isVictory = result.victory;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            {/* Main Container */}
            <div className="w-full max-w-md flex flex-col items-center gap-8">

                {/* Header Status */}
                <div className="text-center space-y-2">
                    <h1 className={`text-6xl font-black tracking-tighter italic uppercase ${isVictory ? 'text-blue-500' : 'text-red-600'}`}>
                        {isVictory ? 'CLEARED' : 'FAILED'}
                    </h1>
                    <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
                        {isVictory ? 'DUNGEON CONQUERED' : 'RETREAT ADVISED'}
                    </p>
                </div>

                {/* Rewards Section (Victory Only) */}
                {isVictory && rewardsData && (
                    <div className="w-full space-y-6">

                        {/* New Shadow (Prominent) */}
                        {rewardsData.newShadow && (
                            <div className="bg-purple-900/20 border border-purple-500/50 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                                    <Skull size={32} className="text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-purple-400 text-xs font-black uppercase tracking-widest mb-1">Shadow Extracted</div>
                                    <div className="text-2xl font-black text-white leading-none">{rewardsData.newShadow.name}</div>
                                    <div className="text-purple-300/60 text-xs mt-1">Rank {rewardsData.newShadow.rank}</div>
                                </div>
                            </div>
                        )}

                        {/* Items Grid */}
                        {(rewardsData.equipment.length > 0 || rewardsData.unlockedTitle || rewardsData.unlockedFrame) && (
                            <div className="space-y-2">
                                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center">Loot Obtained</div>
                                <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">

                                    {/* Equipment */}
                                    {rewardsData.equipment.map((item, idx) => (
                                        <div key={`equip-${idx}`} className={`p-3 rounded-xl border flex items-center gap-3 ${getRarityColor(item.rarity)}`}>
                                            <div className="p-2 bg-black/40 rounded-lg">
                                                {item.type === 'weapon' ? <Sword size={20} /> : <Shield size={20} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm truncate">{item.name}</div>
                                                <div className="text-[10px] opacity-70 uppercase font-mono">{item.rarity} {item.type}</div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Titles */}
                                    {rewardsData.unlockedTitle && (
                                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${getRarityColor(rewardsData.unlockedTitle.rarity)}`}>
                                            <div className="p-2 bg-black/40 rounded-lg"><Crown size={20} /></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm truncate">{rewardsData.unlockedTitle.name}</div>
                                                <div className="text-[10px] opacity-70 uppercase font-mono">New Title</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Frames */}
                                    {rewardsData.unlockedFrame && (
                                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${getRarityColor(rewardsData.unlockedFrame.rarity)}`}>
                                            <div className="p-2 bg-black/40 rounded-lg"><Frame size={20} /></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm truncate">{rewardsData.unlockedFrame.name}</div>
                                                <div className="text-[10px] opacity-70 uppercase font-mono">New Frame</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={(e) => {
                        console.log('Claim Rewards Clicked');
                        e.stopPropagation();
                        // U52: Check for Zone Progression
                        const { checkZoneThreshold } = useStore.getState();
                        checkZoneThreshold();

                        closeDungeonResult();
                    }}
                    className={`
                        relative z-50 pointer-events-auto cursor-pointer
                        w-full py-4 rounded-xl font-black text-xl tracking-widest uppercase transition-all transform active:scale-95
                        ${isVictory
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                        }
                    `}
                >
                    {isVictory ? 'Claim Rewards' : 'Close'}
                </button>

                {/* Redundant Close Button (Top Right) */}
                <button
                    onClick={(e) => {
                        console.log('Close X Clicked');
                        e.stopPropagation();
                        closeDungeonResult();
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-black/50 rounded-full z-50 pointer-events-auto cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

            </div>
        </div>
    );
};
