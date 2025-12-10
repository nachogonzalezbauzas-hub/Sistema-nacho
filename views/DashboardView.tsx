import React from 'react';
import { motion } from 'framer-motion';
import { UserStats, SeasonDefinition, SeasonProgress, DailyQuest, Shadow, ActiveBuff, Equipment, BodyRecord } from '@/types';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ActionModules } from '@/components/dashboard/ActionModules';
import { ShadowCommand } from '@/components/dashboard/ShadowCommand';
import { DailyQuestSection } from '@/components/dashboard/DailyQuestSection';
import { GearSummary } from '@/components/dashboard/GearSummary';
import { SleepStatusCard } from '@/components/dashboard/SleepStatusCard';
import { Sword, Zap } from 'lucide-react';
import { getZoneInfo } from '@/data/zoneSystem';

interface DashboardViewProps {
  stats: UserStats;
  todayCompletedMissions: number;
  canOpenChest: boolean;
  onOpenChest: () => void;
  activeBuffs: ActiveBuff[];
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
  onManualComplete: (id: string) => void;
  equippedItems: Equipment[];
  onManageGear: () => void;
  lastSleepRecord?: BodyRecord;
  language: 'en' | 'es';
  pendingEraBoss?: number | null; // Kept as pendingEraBoss in props for compatibility if needed, but mapped to zone
  onChallengeEraBoss?: () => void;
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
  onManualComplete,
  equippedItems,
  onManageGear,
  lastSleepRecord,
  language,
  pendingEraBoss,
  onChallengeEraBoss
}) => {
  if (!stats) {
    return <div className="p-8 text-center text-white">Loading system data...</div>;
  }

  // Map pendingEraBoss (which is actually zoneId) to zone info
  const zoneInfo = pendingEraBoss ? getZoneInfo(pendingEraBoss) : null;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Zone Boss Challenge Banner */}
      {pendingEraBoss && zoneInfo && onChallengeEraBoss && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onChallengeEraBoss}
          className="w-full p-4 rounded-xl border-2 text-left"
          style={{
            background: `linear-gradient(135deg, ${zoneInfo.visuals.backgroundColor}, transparent)`,
            borderColor: zoneInfo.visuals.borderColor,
            boxShadow: `0 0 30px ${zoneInfo.visuals.primaryColor}40`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${zoneInfo.visuals.primaryColor}20`,
                  border: `1px solid ${zoneInfo.visuals.borderColor}`
                }}
              >
                <Sword size={28} style={{ color: zoneInfo.visuals.primaryColor }} />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Zone Guardian Awaits</div>
                <div className="text-lg font-black text-white">{zoneInfo.bossName}</div>
                <div className="flex items-center gap-2 text-sm" style={{ color: zoneInfo.visuals.primaryColor }}>
                  <Zap size={14} />
                  <span className="font-bold">{zoneInfo.bossPower.toLocaleString()} Power</span>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-4 py-2 rounded-lg font-black uppercase text-sm"
              style={{ backgroundColor: zoneInfo.visuals.primaryColor, color: zoneInfo.visuals.textColor }}
            >
              Challenge
            </motion.div>
          </div>
        </motion.button>
      )}

      {/* Hero Section */}
      <HeroSection
        stats={stats}
        seasonProgress={seasonProgress}
        totalPower={totalPower}
        language={language}
      />

      {/* Sleep Status */}
      <SleepStatusCard
        activeBuffs={activeBuffs}
        lastSleepRecord={lastSleepRecord}
        language={language}
      />

      {/* Daily Quests */}
      <DailyQuestSection
        dailyQuests={dailyQuests || []}
        onClaimQuest={onClaimQuest}
        onManualComplete={onManualComplete}
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
