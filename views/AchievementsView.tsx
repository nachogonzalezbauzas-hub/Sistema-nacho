import React, { useEffect, useState } from 'react'; // HMR Trigger
import { AnimatePresence } from 'framer-motion';
import { AppState } from '@/types';
import { ACHIEVEMENTS, getUnlockedAchievements, AchievementCategory } from '@/data/achievements';
import { TITLES, BASE_FRAMES } from '@/data/titles';
import { STATIC_FRAMES as SHOP_FRAMES } from '@/data/staticCosmetics';
import {
  Trophy, Swords, Ghost, TrendingUp, Gem, ClipboardList, Crown, Image, Lock, CheckCircle
} from 'lucide-react';
import { t } from '@/data/translations';
import { AchievementMedalCard } from '@/components/achievements/AchievementMedalCard';
import { TitleCard } from '@/components/achievements/TitleCard';
import { getRarityStyles } from '@/utils/rarityStyles';
import { iconMap } from '@/utils/iconMap';
import { motion } from 'framer-motion';
import { getFrameRarityColors } from '@/components';

import { RARITY_UNLOCK_FLOORS } from '@/data/equipmentConstants';
import { LockedContentPlaceholder } from '@/components/ui/LockedContentPlaceholder';
import { ZONE_FRAMES, ZONE_TITLES } from '@/data/zoneRewards';

interface AchievementsViewProps {
  state: AppState;
  onEquipTitle: (id: string | null) => void;
  language: 'en' | 'es';
  maxReachedFloor: number;
}

const ALL_FRAMES = [...BASE_FRAMES, ...SHOP_FRAMES, ...ZONE_FRAMES];

export const AchievementsView: React.FC<AchievementsViewProps> = ({ state, onEquipTitle, language, maxReachedFloor }) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'ACHIEVEMENTS' | 'TITLES' | 'FRAMES'>('ACHIEVEMENTS');
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('GENERAL');

  useEffect(() => {
    setUnlockedIds(getUnlockedAchievements());
  }, [state]);

  const categories: { id: AchievementCategory; icon: React.ReactNode; label: string }[] = [
    { id: 'GENERAL', icon: <Trophy size={16} />, label: t('ach_cat_general', language) },
    { id: 'COMBAT', icon: <Swords size={16} />, label: t('ach_cat_combat', language) },
    { id: 'SHADOWS', icon: <Ghost size={16} />, label: t('ach_cat_shadows', language) },
    { id: 'GROWTH', icon: <TrendingUp size={16} />, label: t('ach_cat_growth', language) },
    { id: 'COLLECTION', icon: <Gem size={16} />, label: t('ach_cat_collection', language) },
    { id: 'MISSIONS', icon: <ClipboardList size={16} />, label: t('ach_cat_missions', language) },
  ];

  const filteredAchievements = ACHIEVEMENTS.filter(ach => ach.category === activeCategory);

  let totalUnlocked = unlockedIds.length;
  let totalItems = ACHIEVEMENTS.length;
  let progressColor = 'bg-blue-500';

  const customTitles = state.stats.customTitles || [];
  const customFrames = state.stats.customFrames || [];

  // Weights for sorting
  const RARITY_WEIGHT: Record<string, number> = {
    // ... items
    celestial: 7, godlike: 6, mythic: 5, legendary: 4, epic: 3, rare: 2, uncommon: 1, common: 0,
    sss: 6, ss: 5, s: 4, a: 3, b: 2, c: 1, e: 0, d: 0,
    magma: 7, abyssal: 8, verdant: 9, storm: 10,
    lunar: 11, solar: 12, nebula: 13, singularity: 14, nova: 15,
    cyber: 16, crystal: 17, ethereal: 18, crimson: 19, heavenly: 20,
    antimatter: 21, temporal: 22, chaotic: 23, void: 24, omega: 25,
    primordial: 26, eternal: 27, divine: 28, cosmic: 29, infinite: 30
  };

  const sortItems = <T extends { rarity: string; name: string }>(items: T[]) => {
    return [...items].sort((a, b) => {
      const weightA = RARITY_WEIGHT[a.rarity.toLowerCase()] || 0;
      const weightB = RARITY_WEIGHT[b.rarity.toLowerCase()] || 0;
      if (weightA !== weightB) return weightA - weightB; // Ascending rarity
      return a.name.localeCompare(b.name);
    });
  };

  const DISPLAY_TITLES = sortItems([...TITLES, ...ZONE_TITLES, ...customTitles]);
  const DISPLAY_FRAMES = sortItems([...ALL_FRAMES, ...customFrames]);

  if (viewMode === 'TITLES') {
    totalUnlocked = state.stats.unlockedTitleIds.length;
    totalItems = DISPLAY_TITLES.length;
    progressColor = 'bg-purple-500';
  } else if (viewMode === 'FRAMES') {
    totalUnlocked = state.stats.unlockedFrameIds.length;
    totalItems = DISPLAY_FRAMES.length;
    progressColor = 'bg-yellow-500';
  }

  const progress = Math.round((totalUnlocked / totalItems) * 100);

  // Gating helper
  const isVisible = (rarity: string) => {
    // Base ranks/rarities always visible
    if (['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'godlike'].includes(rarity)) return true;
    const unlockFloor = RARITY_UNLOCK_FLOORS[rarity.toLowerCase()] || 999;
    return unlockFloor <= maxReachedFloor;
  };

  let hasHiddenContent = false;

  return (
    <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

      {/* Header */}
      <div className="flex items-end justify-between px-1 border-b border-blue-900/30 pb-4">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-md flex items-center gap-3">
            {t('achievements_title', language)} <Trophy className="text-yellow-500" size={28} />
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${progressColor}`} style={{ width: `${progress}%` }} />
            </div>
            <span className={`text-xs font-mono ${viewMode === 'TITLES' ? 'text-purple-400' : viewMode === 'FRAMES' ? 'text-yellow-400' : 'text-blue-400'}`}>{progress}% Complete</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white">{totalUnlocked} <span className="text-slate-500 text-lg">/ {totalItems}</span></div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Unlocked</div>
        </div>
      </div>

      {/* Main Mode Switcher */}
      <div className="flex p-1 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 sticky top-0 z-30 shadow-xl">
        <button
          onClick={() => setViewMode('ACHIEVEMENTS')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${viewMode === 'ACHIEVEMENTS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-blue-400 hover:bg-slate-800/50'}`}
        >
          <Trophy size={14} /> {t('achievements_tab_general', language)}
        </button>
        <button
          onClick={() => setViewMode('TITLES')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${viewMode === 'TITLES' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-500 hover:text-purple-400 hover:bg-slate-800/50'}`}
        >
          <Crown size={14} /> {t('achievements_tab_titles', language)}
        </button>
        <button
          onClick={() => setViewMode('FRAMES')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${viewMode === 'FRAMES' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/20' : 'text-slate-500 hover:text-yellow-400 hover:bg-slate-800/50'}`}
        >
          <Image size={14} /> Frames
        </button>
      </div>

      {viewMode === 'ACHIEVEMENTS' ? (
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all
                  ${activeCategory === cat.id
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                  }
                `}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Achievements Grid - 3 columns like Frames */}
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence mode='popLayout'>
              {filteredAchievements.map((ach, index) => (
                <AchievementMedalCard
                  key={ach.id}
                  achievement={ach}
                  isUnlocked={unlockedIds.includes(ach.id)}
                  language={language}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : viewMode === 'FRAMES' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {DISPLAY_FRAMES.map((frame) => {
              // Check visibility
              if (!isVisible(frame.rarity || 'E')) {
                hasHiddenContent = true;
                return null;
              }

              const isUnlocked = state.stats.unlockedFrameIds.includes(frame.id);
              const rarityColors = getFrameRarityColors(frame.rarity || 'C');

              return (
                <div key={frame.id} className={`p-4 rounded-xl border ${isUnlocked ? `${rarityColors.bg} ${rarityColors.border}` : 'bg-slate-950/50 border-slate-800 opacity-60'} flex flex-col items-center gap-3 text-center relative overflow-hidden`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center relative ${frame.borderStyle} ${frame.glowStyle} ${frame.animation}`}>
                    <div className="w-12 h-12 bg-slate-800 rounded-full" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold mb-1 ${isUnlocked ? rarityColors.text : 'text-white'}`}>{frame.name}</div>
                    <div className="text-[10px] text-slate-500">{frame.description}</div>
                  </div>
                  {isUnlocked ? (
                    <div className={`absolute top-2 right-2 ${rarityColors.text}`}><CheckCircle size={12} /></div>
                  ) : (
                    <div className="absolute top-2 right-2 text-slate-700"><Lock size={12} /></div>
                  )}

                  {/* Rarity Badge */}
                  <div className={`absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded border ${isUnlocked ? `${rarityColors.border} ${rarityColors.text} bg-black/50` : 'border-slate-700 text-slate-600'}`}>
                    {frame.rarity || 'C'}
                  </div>
                </div>
              );
            })}
          </div>
          {hasHiddenContent && <LockedContentPlaceholder />}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {DISPLAY_TITLES.map((title, index) => {
              // Check visibility
              if (!isVisible(title.rarity)) {
                hasHiddenContent = true;
                return null;
              }

              return (
                <TitleCard
                  key={title.id}
                  title={title}
                  isUnlocked={state.stats.unlockedTitleIds.includes(title.id)}
                  isEquipped={state.stats.titleId === title.id}
                  onEquip={onEquipTitle}
                  index={index}
                />
              );
            })}
          </div>
          {hasHiddenContent && <LockedContentPlaceholder />}
        </div>
      )}
    </div>
  );
};
