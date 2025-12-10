import React from 'react';
import { UserStats, AvatarFrameId } from '../../types';
import { AvatarFrameSelector } from '../UIComponents';
import { AVATAR_FRAMES } from '../../data/titles';
import { t } from '../../data/translations';

interface FramesTabProps {
    stats: UserStats;
    onEquipFrame: (id: AvatarFrameId) => void;
    language: 'en' | 'es';
}

export const FramesTab: React.FC<FramesTabProps> = ({ stats, onEquipFrame, language }) => {
    return (
        <div className="space-y-6">
            <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">{t('profile_frames_collection', language)}</h3>
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
