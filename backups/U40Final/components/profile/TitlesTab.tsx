import React from 'react';
import { UserStats, TitleId } from '../../types';
import { TitleCard } from '../ui/Titles';
import { TITLES } from '../../data/titles';
import { t } from '../../data/translations';

interface TitlesTabProps {
    stats: UserStats;
    onEquipTitle: (id: TitleId | null) => void;
    language: 'en' | 'es';
}

export const TitlesTab: React.FC<TitlesTabProps> = ({ stats, onEquipTitle, language }) => {
    return (
        <div className="space-y-6">
            {/* Titles Section */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">{t('profile_unlocked_titles', language)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TITLES.filter(t => stats.unlockedTitleIds.includes(t.id)).map(title => (
                        <TitleCard
                            key={title.id}
                            title={title}
                            isUnlocked={true}
                            isEquipped={stats.equippedTitleId === title.id}
                            onToggle={() => onEquipTitle(title.id)}
                        />
                    ))}
                </div>

                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 pt-4">{t('profile_locked_titles', language)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TITLES.filter(t => !stats.unlockedTitleIds.includes(t.id)).map(title => (
                        <TitleCard
                            key={title.id}
                            title={title}
                            isUnlocked={false}
                            isEquipped={false}
                            onToggle={() => { }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
