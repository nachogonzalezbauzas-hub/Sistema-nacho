import React from 'react';
import { UserStats, SeasonDefinition, SeasonProgress, DailyQuest, Shadow, ActiveBuff, Equipment } from '@/types';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ActionModules } from '@/components/dashboard/ActionModules';
import { ShadowCommand } from '@/components/dashboard/ShadowCommand';
import { DailyQuestSection } from '@/components/dashboard/DailyQuestSection';
import { GearSummary } from '@/components/dashboard/GearSummary';

interface DashboardViewProps {
  stats: UserStats;
  todayCompletedMissions: number;
  canOpenChest: boolean;
  onOpenChest: () => void;
  activeBuffs: any[];
  effectiveStats: UserStats;
  onApplyBuff: (buffId: string) => void;
  lastReward: any;
  season: SeasonDefinition;
  seasonProgress: SeasonProgress | null;
  onOpenSeason: () => void;
  equippedShadow: Shadow | null | undefined;
  totalPower: number;
  dailyQuests: DailyQuest[];
  onClaimQuest: (id: string) => void;
  equippedItems: Equipment[];
  onManageGear: () => void;
  language: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  todayCompletedMissions,
  canOpenChest,
  onOpenChest,
  activeBuffs,
  effectiveStats,
  onApplyBuff,
  lastReward,
  season,
  seasonProgress,
  onOpenSeason,
  equippedShadow,
  totalPower,
  dailyQuests,
  onClaimQuest,
  equippedItems,
  onManageGear,
  language
}) => {
  if (!stats) {
    return <div className="p-8 text-center text-white">Loading system data...</div>;
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Hero Section */}
      <HeroSection
        stats={stats}
        seasonProgress={seasonProgress}
        totalPower={totalPower}
        language={language}
      />

      {/* Daily Quests */}
      <DailyQuestSection
        dailyQuests={dailyQuests || []}
        onClaimQuest={onClaimQuest}
        language={language}
      />

      {/* Gear Summary */}
      <GearSummary
        equippedItems={equippedItems || []}
        onManageGear={onManageGear}
        language={language}
      />

      {/* Stats Grid */}
      <StatsGrid effectiveStats={effectiveStats} language={language} />

      {/* Action Modules */}
      <ActionModules
        canOpenChest={canOpenChest}
        onOpenChest={onOpenChest}
        season={season}
        seasonProgress={seasonProgress}
        onOpenSeason={onOpenSeason}
        language={language}
      />

      {/* Shadow Command */}
      {equippedShadow && (
        <ShadowCommand equippedShadow={equippedShadow} language={language} />
      )}
    </div>
  );
};
