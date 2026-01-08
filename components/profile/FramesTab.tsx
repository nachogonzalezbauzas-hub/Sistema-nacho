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
    const allFrames = [...AVATAR_FRAMES, ...(stats.customFrames || [])].filter(f => !f.id.startsWith('zone_'));

    const rankOrder = [
        'C', 'B', 'A', 'S', 'SS', 'SSS' // Standard Hunter Ranks
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
        if (['c'].includes(r)) return 'text-sky-400';
        if (['b'].includes(r)) return 'text-purple-400';
        if (['a'].includes(r)) return 'text-amber-400';
        if (['s'].includes(r)) return 'text-red-400';
        if (['ss'].includes(r)) return 'text-fuchsia-400';
        if (['sss'].includes(r)) return 'text-cyan-400';

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

                        // Visibility Check: Hide content from future zones (Spoiler Protection)
                        const unlockFloor = getRankUnlockFloor(rank);
                        const hasUnlockedInRank = frames.some(f => stats.unlockedFrameIds.includes(f.id));

                        if (unlockFloor > maxReachedFloor && !hasUnlockedInRank) {
                            hasHiddenContent = true;
                            return null;
                        }

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

                    {/* Spoiler Placeholder */}
                    {hasHiddenContent && (
                        <LockedContentPlaceholder />
                    )}
                </div>
            </div>
        </div>
    );
};
