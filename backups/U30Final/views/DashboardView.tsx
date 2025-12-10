import React from 'react';
import { UserStats, BuffDefinition, SeasonDefinition as Season, SeasonProgress, Shadow, DailyQuest } from '../types';
import { MissionRewardSummary } from '../components/RewardModal';
import { HeroSection } from '../components/dashboard/HeroSection';
import { DailyQuestSection } from '../components/dashboard/DailyQuestSection';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { ShadowCommand } from '../components/dashboard/ShadowCommand';
import { ActionModules } from '../components/dashboard/ActionModules';

interface DashboardViewProps {
  stats: UserStats;
  todayCompletedMissions: number;
  canOpenChest: boolean;
  onOpenChest: () => void;
  activeBuffs: BuffDefinition[];
  effectiveStats: UserStats;
  onApplyBuff: (buffId: string) => void;
  lastReward: MissionRewardSummary | null;
  season: Season;
  seasonProgress: SeasonProgress | null;
  onOpenSeason: () => void;
  equippedShadow?: Shadow | null;
  totalPower: number; // U30
  dailyQuests: DailyQuest[]; // U30
  onClaimQuest: (id: string) => void; // U30
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
  onClaimQuest
}) => {
  if (!stats) return <div className="p-8 text-center text-slate-500">Loading System...</div>;

  return (
    <div className="pb-32 space-y-8 relative overflow-hidden min-h-screen">
      {/* Global Background Particles/Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(18,16,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
      </div>

      {/* --- HERO HUD SECTION --- */}
      <HeroSection stats={stats} seasonProgress={seasonProgress} totalPower={totalPower} />

      {/* --- DAILY QUESTS (U30) --- */}
      <DailyQuestSection dailyQuests={dailyQuests} onClaimQuest={onClaimQuest} />

      {/* --- STATS GRID (Refined "Pro" Design - Flat Square) --- */}
      <StatsGrid effectiveStats={effectiveStats} />

      {/* --- SHADOW ARMY COMMAND --- */}
      {equippedShadow && <ShadowCommand equippedShadow={equippedShadow} />}

      {/* --- ACTION MODULES --- */}
      <ActionModules
        canOpenChest={canOpenChest}
        onOpenChest={onOpenChest}
        season={season}
        seasonProgress={seasonProgress}
        onOpenSeason={onOpenSeason}
      />

    </div >
  );
};
