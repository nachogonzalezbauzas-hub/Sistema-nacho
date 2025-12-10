import React from 'react';
import { UserStats, AvatarFrameId } from '@/types';
import { AvatarFrameSelector } from '@/components';
import { AVATAR_FRAMES } from '@/data/titles';
import { t } from '@/data/translations';

import { RARITY_UNLOCK_FLOORS } from '@/data/equipmentConstants';
import { LockedContentPlaceholder } from '@/components/ui/LockedContentPlaceholder';

interface FramesTabProps {
    stats: UserStats;
    onEquipFrame: (id: AvatarFrameId) => void;
    language: 'en' | 'es';
    maxReachedFloor: number;
}

export const FramesTab: React.FC<FramesTabProps> = ({ stats, onEquipFrame, language, maxReachedFloor }) => {
    const allFrames = [...AVATAR_FRAMES, ...(stats.customFrames || [])];

    const rankOrder = [
        'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'godlike', 'celestial', 'transcendent',
        'primordial', 'eternal', 'divine', 'cosmic', 'infinite',
        // Zone Rarities
        'magma', 'abyssal', 'verdant', 'storm', 'lunar', 'solar', 'nebula', 'singularity', 'nova',
        'cyber', 'crystal', 'ethereal', 'crimson', 'heavenly', 'antimatter', 'temporal', 'chaotic', 'void', 'omega'
    ];

    // Helper to map Rank to Unlock Floor (Approximate mapping for non-zone ranks)
    // Zone rarities use RARITY_UNLOCK_FLOORS directly.
    const getRankUnlockFloor = (rank: string): number => {
        return RARITY_UNLOCK_FLOORS[rank.toLowerCase()] || 0;
    };


    const groupByRank = (frames: typeof allFrames) => {
        const grouped: Record<string, typeof allFrames> = {};
        frames.forEach(frame => {
            const rarity = frame.rarity || 'common';
            if (!grouped[rarity]) {
                grouped[rarity] = [];
            }
            grouped[rarity].push(frame);
        });
        return grouped;
    };

    const groupedFrames = groupByRank(allFrames);

    // Helper to get color for rank header
    const getRankColor = (rank: string) => {
        const r = rank.toLowerCase();
        if (['common', 'e'].includes(r)) return 'text-slate-400';
        if (['uncommon', 'd'].includes(r)) return 'text-emerald-400';
        if (['rare', 'c'].includes(r)) return 'text-sky-400';
        if (['epic', 'b'].includes(r)) return 'text-purple-400';
        if (['legendary', 'a'].includes(r)) return 'text-amber-400';
        if (['mythic', 's'].includes(r)) return 'text-red-400';
        if (['godlike', 'ss'].includes(r)) return 'text-fuchsia-400';
        if (['celestial', 'sss'].includes(r)) return 'text-cyan-400';
        if (['transcendent'].includes(r)) return 'text-rose-400';
        if (['primordial'].includes(r)) return 'text-orange-400';
        if (['eternal'].includes(r)) return 'text-teal-400';
        if (['divine'].includes(r)) return 'text-yellow-400';
        if (['cosmic'].includes(r)) return 'text-indigo-400';
        if (['infinite'].includes(r)) return 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]';

        if (['magma', 'crimson', 'antimatter'].includes(r)) return 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]';
        if (['abyssal', 'ethereal', 'void'].includes(r)) return 'text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]';
        if (['verdant', 'cyber'].includes(r)) return 'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]';
        if (['storm', 'singularity', 'transcendent'].includes(r)) return 'text-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]';
        if (['lunar', 'crystal'].includes(r)) return 'text-slate-200 drop-shadow-[0_0_5px_rgba(226,232,240,0.5)]';
        if (['solar', 'heavenly', 'temporal'].includes(r)) return 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]';
        if (['nebula', 'chaotic'].includes(r)) return 'text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]';
        if (['nova'].includes(r)) return 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.5)]';
        if (['omega'].includes(r)) return 'text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse';

        return 'text-slate-400';
    };

    let hasHiddenContent = false;

    return (
        <div className="space-y-6">
            <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center border-b border-slate-800 pb-4">{t('profile_frames_collection', language)}</h3>

                <div className="space-y-8">
                    {rankOrder.map(rank => {
                        const frames = groupedFrames[rank];
                        if (!frames || frames.length === 0) return null;

                        // Visibility Check - REMOVED to show all frames
                        // const unlockFloor = getRankUnlockFloor(rank);
                        // if (unlockFloor > maxReachedFloor) {
                        //     hasHiddenContent = true;
                        //     return null;
                        // }

                        return (
                            <div key={rank} className="space-y-3">
                                <h4 className={`text-sm font-black uppercase tracking-widest pl-2 border-l-2 border-slate-700 ${getRankColor(rank)}`}>
                                    {rank} Rank
                                </h4>
                                <AvatarFrameSelector
                                    frames={frames}
                                    unlockedIds={stats.unlockedFrameIds}
                                    selectedId={stats.selectedFrameId}
                                    onSelect={onEquipFrame}
                                    layout="grid"
                                />
                            </div>
                        );
                    })}

                    {/* Animated Placeholder - REMOVED */}
                    {/* {hasHiddenContent && (
                        <LockedContentPlaceholder />
                    )} */}
                </div>
            </div>
        </div>
    );
};
