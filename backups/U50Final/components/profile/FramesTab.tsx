import React from 'react';
import { UserStats, AvatarFrameId } from '@/types';
import { AvatarFrameSelector } from '@/components';
import { AVATAR_FRAMES } from '@/data/titles';
import { t } from '@/data/translations';

interface FramesTabProps {
    stats: UserStats;
    onEquipFrame: (id: AvatarFrameId) => void;
    language: 'en' | 'es';
}

export const FramesTab: React.FC<FramesTabProps> = ({ stats, onEquipFrame, language }) => {
    const allFrames = [...AVATAR_FRAMES, ...(stats.customFrames || [])];

    const rankOrder = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

    const groupByRank = (frames: typeof allFrames) => {
        const grouped: Record<string, typeof allFrames> = {};
        frames.forEach(frame => {
            const rarity = frame.rarity || 'E';
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
        switch (rank) {
            case 'SSS': return 'text-rose-400';
            case 'SS': return 'text-yellow-400';
            case 'S': return 'text-purple-400';
            case 'A': return 'text-blue-400';
            case 'B': return 'text-green-400';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center border-b border-slate-800 pb-4">{t('profile_frames_collection', language)}</h3>

                <div className="space-y-8">
                    {rankOrder.map(rank => {
                        const frames = groupedFrames[rank];
                        if (!frames || frames.length === 0) return null;

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
                </div>
            </div>
        </div>
    );
};
