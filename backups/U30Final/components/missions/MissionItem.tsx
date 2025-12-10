import React from 'react';
import { motion } from 'framer-motion';
import { Mission } from '../../types';
import { StatBadge, StreakBadge } from '../UIComponents';
import { RefreshCw, Lock, Sword } from 'lucide-react';
import { isMissionAvailableToday } from '../../store/index';

interface MissionItemProps {
    mission: Mission;
    onComplete: () => void;
}

export const MissionItem: React.FC<MissionItemProps> = ({ mission, onComplete }) => {
    const isCompletedToday = mission.lastCompletedAt &&
        new Date(mission.lastCompletedAt).toDateString() === new Date().toDateString();

    const isAvailableToday = isMissionAvailableToday(mission, new Date());
    const canComplete = isAvailableToday && (!mission.isDaily || !isCompletedToday);
    const isDimmed = !isAvailableToday;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative group transition-all duration-300 
      ${!canComplete ? 'opacity-60 grayscale-[0.5] scale-[0.98]' : 'hover:scale-[1.01]'}
      ${isDimmed ? 'opacity-40' : ''}
    `}>

            {/* Dynamic Glow */}
            {canComplete && (
                <div className={`absolute inset-0 blur-xl rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${mission.targetStat === 'Strength' ? 'bg-cyan-500/20' : ''}
          ${mission.targetStat === 'Vitality' ? 'bg-red-500/20' : ''}
          ${mission.targetStat === 'Agility' ? 'bg-yellow-500/20' : ''}
          ${mission.targetStat === 'Intelligence' ? 'bg-purple-500/20' : ''}
          ${mission.targetStat === 'Fortune' ? 'bg-green-500/20' : ''}
          ${mission.targetStat === 'Metabolism' ? 'bg-blue-500/20' : ''}
        `}></div>
            )}

            <div className={`
        relative overflow-hidden rounded-xl border transition-all duration-300
        ${isCompletedToday
                    ? 'bg-[#050a14]/60 border-slate-800'
                    : 'bg-[#050a14]/80 border-blue-900/30 hover:border-blue-500/50 hover:bg-[#0a1020]'
                }
      `}>
                {/* Holographic Grid Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent)',
                        backgroundSize: '20px 20px'
                    }}
                ></div>

                <div className="p-4 flex justify-between items-center gap-4 relative z-10">
                    <div className="flex-1 min-w-0">
                        {/* Header: Badges */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {(mission.isDaily || mission.frequency === 'daily' || mission.frequency === 'weekly') && (
                                <span className={`
                  flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider
                  ${isCompletedToday
                                        ? 'bg-slate-800 text-slate-500 border-slate-700'
                                        : 'bg-blue-900/30 text-blue-300 border-blue-500/30'
                                    }
                `}>
                                    <RefreshCw size={10} className={canComplete ? "animate-spin-slow" : ""} />
                                    {mission.frequency === 'weekly' ? 'WEEKLY' : 'DAILY'}
                                </span>
                            )}
                            {!isAvailableToday && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-slate-800 text-slate-500 border-slate-700 uppercase tracking-wider">
                                    LOCKED
                                </span>
                            )}
                            <StatBadge stat={mission.targetStat} />
                        </div>

                        {/* Content */}
                        <div className="mb-3">
                            <h3 className={`
                text-base font-bold mb-1 transition-colors duration-300 truncate
                ${isCompletedToday
                                    ? 'text-slate-500 line-through decoration-slate-600'
                                    : 'text-blue-50 group-hover:text-blue-300'
                                }
              `}>
                                {mission.title}
                            </h3>

                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-mono">
                                {mission.detail}
                            </p>
                        </div>

                        {/* Footer: Streak & Reward */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <StreakBadge value={mission.streak || 0} />
                            </div>

                            <div className={`
                px-2 py-1 rounded border flex items-center gap-2 transition-all duration-300
                ${isCompletedToday
                                    ? 'bg-slate-900 border-slate-800 opacity-50'
                                    : 'bg-blue-950/20 border-blue-500/20 group-hover:border-blue-500/40'
                                }
              `}>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Reward</span>
                                <span className={`text-[10px] font-bold font-mono ${isCompletedToday ? 'text-slate-500' : 'text-blue-300'}`}>
                                    +{mission.xpReward} XP
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 self-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onComplete();
                            }}
                            disabled={!canComplete}
                            className={`
                relative flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-300 group/btn
                ${!canComplete
                                    ? 'bg-[#0a0f1e] border-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-blue-600/10 border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                                }
              `}
                        >
                            {isCompletedToday ? (
                                <Lock size={16} />
                            ) : !isAvailableToday ? (
                                <Lock size={16} className="opacity-50" />
                            ) : (
                                <>
                                    <Sword size={20} className="relative z-10 transition-transform duration-300 group-hover/btn:scale-110" />
                                    <div className="absolute inset-0 bg-blue-400/20 blur-md rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
