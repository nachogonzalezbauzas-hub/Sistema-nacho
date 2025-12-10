import React from 'react';
import { UserStats, AvatarFrameId } from '../../types';
import { AvatarFrameSelector } from '../UIComponents';
import { AVATAR_FRAMES } from '../../data/titles';

interface FramesTabProps {
    stats: UserStats;
    onEquipFrame: (id: AvatarFrameId) => void;
}

export const FramesTab: React.FC<FramesTabProps> = ({ stats, onEquipFrame }) => {
    return (
        <div className="space-y-6">
            <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Avatar Frames Collection</h3>
                <AvatarFrameSelector
                    frames={AVATAR_FRAMES}
                    unlockedIds={stats.unlockedFrameIds}
                    selectedId={stats.selectedFrameId}
                    onSelect={onEquipFrame}
                    layout="grid"
                />
            </div>
        </div>
    );
};
