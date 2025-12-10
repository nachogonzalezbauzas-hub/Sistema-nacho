import React from 'react';
import { UserStats, TitleId } from '../../types';
import { TitleBadge } from '../UIComponents';
import { TITLES } from '../../data/titles';

interface TitlesTabProps {
    stats: UserStats;
    onEquipTitle: (id: TitleId | null) => void;
}

export const TitlesTab: React.FC<TitlesTabProps> = ({ stats, onEquipTitle }) => {
    return (
        <div className="space-y-6">
            {/* Titles Section */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Unlocked Titles</h3>
                <div className="grid grid-cols-1 gap-3">
                    {TITLES.filter(t => stats.unlockedTitleIds.includes(t.id)).map(title => (
                        <TitleBadge
                            key={title.id}
                            title={title}
                            isEquipped={stats.equippedTitleId === title.id}
                            onClick={() => onEquipTitle(title.id)}
                        />
                    ))}
                </div>

                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 pt-4">Locked Titles</h3>
                <div className="grid grid-cols-1 gap-3 opacity-60">
                    {TITLES.filter(t => !stats.unlockedTitleIds.includes(t.id)).map(title => (
                        <div key={title.id} className="opacity-50 grayscale pointer-events-none">
                            <TitleBadge
                                title={title}
                                isEquipped={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
