
import React from 'react';
import { UserStats, BuffDefinition, SeasonDefinition as Season, SeasonProgress } from '../types';
import { MissionRewardSummary } from '../components/RewardModal';
import { Card, StatCard, Button, StatIcon, Modal, RankPill } from '../components/UIComponents';
import { Trophy, Flame, Zap, Crown, ChevronRight, Gift, Lock, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

import { TITLES } from '../titles';
import { rarityStyles } from '../components/ui/Titles';
import { getFrameStyles } from '../components/ui/Avatar';

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
  onOpenSeason
}) => {
  const xpPercentage = Math.min(100, (stats.xpCurrent / stats.xpForNextLevel) * 100);

  const equippedTitle = TITLES.find(t => t.id === stats.equippedTitleId);
  const titleStyle = equippedTitle ? rarityStyles[equippedTitle.rarity] : null;

  const { frameStyle, effect } = getFrameStyles(stats.selectedFrameId || 'default');

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-700">

      {/* --- HEADER PROFILE SECTION --- */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase mb-1 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">Player Name</span>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                Sung Jin-Woo
              </h2>
              {seasonProgress && <RankPill rank={seasonProgress.rank} size="sm" />}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase mb-1">Title</span>
            {equippedTitle ? (
              <span className={`text-sm font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)] border ${titleStyle?.borderColor} ${titleStyle?.textColor} bg-gradient-to-r ${titleStyle?.bgGradient}`}>
                {equippedTitle.name}
              </span>
            ) : (
              <span className="text-sm font-bold text-slate-500 bg-slate-900/40 border border-slate-700 px-3 py-1 rounded-full">
                None
              </span>
            )}
          </div>
        </div>

        {/* --- MANA BAR (XP) --- */}
        <div className="relative mt-4 group flex items-center gap-4">
          {/* Level Indicator - Now on the left */}
          <div className={`flex-shrink-0 w-14 h-14 bg-[#02040a] border-2 rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300 relative ${frameStyle} ${effect}`}>
            <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></div>
            <div className="text-center leading-none relative z-10">
              <div className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">LVL</div>
              <div className="text-xl font-black text-white font-mono">{stats.level}</div>
            </div>
          </div>

          {/* XP Bar and Text Container */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between items-end px-1">
              <span className="text-[10px] font-bold text-blue-300 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">Experience</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-blue-400 font-mono">{Math.floor(xpPercentage)}%</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black font-mono text-white tracking-wider">{Math.floor(stats.xpCurrent)}</span>
                  <span className="text-[10px] font-bold text-blue-500 font-mono">/ {stats.xpForNextLevel}</span>
                </div>
              </div>
            </div>

            <div className="h-4 bg-[#050a14] rounded-sm border border-blue-900/50 relative overflow-hidden shadow-inner">
              {/* Background Grid in Bar */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(59, 130, 246, 0.1) 50%)', backgroundSize: '4px 4px' }}></div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 relative"
              >
                {/* Flowing Energy Effect */}
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 skew-x-12"
                />
                {/* End Glow */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-300 blur-[2px] shadow-[0_0_10px_#93c5fd]"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard stat="Strength" value={effectiveStats.strength} highlight={lastReward?.targetStat === 'Strength'} />
        <StatCard stat="Vitality" value={effectiveStats.vitality} highlight={lastReward?.targetStat === 'Vitality'} />
        <StatCard stat="Agility" value={effectiveStats.agility} highlight={lastReward?.targetStat === 'Agility'} />
        <StatCard stat="Intelligence" value={effectiveStats.intelligence} highlight={lastReward?.targetStat === 'Intelligence'} />
        <StatCard stat="Fortune" value={effectiveStats.fortune} highlight={lastReward?.targetStat === 'Fortune'} />
        <StatCard stat="Metabolism" value={effectiveStats.metabolism} highlight={lastReward?.targetStat === 'Metabolism'} />
      </div>

      {/* --- DAILY CHEST --- */}
      <Card className="relative overflow-hidden group border-yellow-500/20 bg-gradient-to-br from-yellow-950/10 to-[#050a14]">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className={`
              w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-500
              ${canOpenChest
                ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)] animate-pulse-slow'
                : 'bg-slate-900/50 border-slate-800'
              }
            `}>
              <Gift size={28} className={canOpenChest ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" : "text-slate-600"} />
            </div>
            <div>
              <h3 className={`font-bold uppercase tracking-wider text-sm ${canOpenChest ? 'text-yellow-100' : 'text-slate-400'}`}>Daily Supply</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                {canOpenChest ? "Ready to claim" : "Cooldown active"}
              </p>
            </div>
          </div>

          <Button
            onClick={onOpenChest}
            disabled={!canOpenChest}
            variant={canOpenChest ? 'primary' : 'secondary'}
            className={canOpenChest ? '!bg-yellow-600 !border-yellow-400 !shadow-[0_0_20px_rgba(202,138,4,0.4)] hover:!bg-yellow-500' : ''}
          >
            {canOpenChest ? 'CLAIM' : <Timer size={16} />}
          </Button>
        </div>

        {/* Background Particles for Chest */}
        {canOpenChest && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 blur-2xl rounded-full animate-pulse"></div>
          </div>
        )}
      </Card>

      {/* --- SEASON BANNER --- */}
      {season && (
        <div onClick={onOpenSeason} className="cursor-pointer group">
          <div className="relative h-32 rounded-xl overflow-hidden border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 group-hover:border-purple-400/60 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${season.theme?.backgroundImage || 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=2664&auto=format&fit=crop'})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050a14] via-[#050a14]/80 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-[9px] font-bold text-purple-300 uppercase tracking-widest backdrop-blur-sm">
                  Season {season.id}
                </span>
                {seasonProgress && (
                  <span className="text-[9px] font-mono text-purple-200/70">Lvl {seasonProgress.rank || 'E'}</span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] mb-1">
                {season.name || season.title || 'Current Season'}
              </h3>

              <div className="flex items-center gap-1 text-purple-300 text-[10px] font-bold uppercase tracking-wider group-hover:text-purple-100 transition-colors">
                View Progress <ChevronRight size={12} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ACTIVE BUFFS --- */}
      {activeBuffs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-blue-500 shadow-[0_0_5px_#3b82f6]"></div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Active Effects</h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {activeBuffs.map(buff => (
              <div key={buff.id} className="flex items-center justify-between bg-blue-950/20 border border-blue-500/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-500/10 rounded border border-blue-500/30">
                    <Zap size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-200 uppercase tracking-wide">{buff.name}</div>
                    <div className="text-[10px] text-blue-400/60 font-mono">{buff.description}</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-blue-500 animate-pulse">
                  ACTIVE
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
