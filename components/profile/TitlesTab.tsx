import React from 'react';
import { UserStats, TitleId, Title, TitleRarity } from '@/types';
import { TitleCard, rarityStyles, rarityLabel } from '@/components/ui/Titles';
import { TITLES } from '@/data/titles';
import { t } from '@/data/translations';

import { RARITY_UNLOCK_FLOORS } from '@/data/equipmentConstants';
import { LockedContentPlaceholder } from '@/components/ui/LockedContentPlaceholder';

interface TitlesTabProps {
    stats: UserStats;
    onEquipTitle: (id: TitleId | null) => void;
    language: 'en' | 'es';
    maxReachedFloor: number;
}

export const TitlesTab: React.FC<TitlesTabProps> = ({ stats, onEquipTitle, language, maxReachedFloor }) => {
    const allTitles = [...TITLES, ...(stats.customTitles || [])];
    const unlockedTitles = allTitles.filter(t => stats.unlockedTitleIds.includes(t.id));
    const lockedTitles = TITLES.filter(t => !stats.unlockedTitleIds.includes(t.id));

    const rarityOrder: TitleRarity[] = [
        'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'godlike', 'celestial', 'transcendent',
        'primordial', 'eternal', 'divine', 'cosmic', 'infinite',
        // Zone Rarities
        'magma', 'abyssal', 'verdant', 'storm', 'lunar', 'solar', 'nebula', 'singularity', 'nova',
        'cyber', 'crystal', 'ethereal', 'crimson', 'heavenly', 'antimatter', 'temporal', 'chaotic', 'void', 'omega'
    ];

    const groupByRarity = (titles: Title[]) => {
        const grouped: Partial<Record<TitleRarity, Title[]>> = {};
        titles.forEach(title => {
            if (!grouped[title.rarity]) {
                grouped[title.rarity] = [];
            }
            grouped[title.rarity]!.push(title);
        });
        return grouped;
    };

    const unlockedGrouped = groupByRarity(unlockedTitles);
    const lockedGrouped = groupByRarity(lockedTitles);

    const renderTitleGroup = (titles: Title[], rarity: TitleRarity, isUnlocked: boolean) => (
        <div key={rarity} className="space-y-2 mb-6">
            <h4 className={`text-[10px] font-black uppercase tracking-widest opacity-60 pl-1 ${rarityStyles[rarity].textColor.replace('text-', 'text-')}`}>
                {t(`rarity_${rarity.toLowerCase()}` as any, language)}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {titles.map(title => (
                    <TitleCard
                        key={title.id}
                        title={title}
                        isUnlocked={isUnlocked}
                        isEquipped={stats.equippedTitleId === title.id}
                        onToggle={() => isUnlocked ? onEquipTitle(title.id) : {}}
                    />
                ))}
            </div>
        </div>
    );

    // Gating Logic
    let hasHiddenContent = false;

    return (
        <div className="space-y-8">
            {/* Titles Section */}
            <div>
                <h3 className="text-xs font-bold text-[#5c4033] uppercase tracking-widest pl-1 mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#ffd100] rounded-full"></span>
                    {t('profile_unlocked_titles', language)}
                </h3>
                {rarityOrder.map(rarity => {
                    const titles = unlockedGrouped[rarity];
                    if (!titles || titles.length === 0) return null;
                    return renderTitleGroup(titles, rarity, true);
                })}
            </div>

            <div>
                <h3 className="text-xs font-bold text-[#5c4033] uppercase tracking-widest pl-1 mb-4 pt-4 border-t border-[#5c4033]/20 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#5c4033] rounded-full"></span>
                    {t('profile_locked_titles', language)}
                </h3>
                {rarityOrder.map(rarity => {
                    // Show all titles, even if deep in the dungeon
                    const titles = lockedGrouped[rarity];
                    if (!titles || titles.length === 0) return null;

                    return renderTitleGroup(titles, rarity, false);
                })}

                {/* Animated Placeholder for Hidden Content */}
                {hasHiddenContent && (
                    <LockedContentPlaceholder />
                )}
            </div>
        </div>
    );
};
