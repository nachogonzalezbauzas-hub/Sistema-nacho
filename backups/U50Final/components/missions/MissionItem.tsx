import React from 'react';
import { motion } from 'framer-motion';
import { Mission, StatType } from '@/types';
import { StreakBadge } from '@/components';
import { RefreshCw, Lock, Sword, Dumbbell, Activity, Zap, Brain, Crown, Flame } from 'lucide-react';
import { isMissionAvailableToday } from '@/store/index';

interface MissionItemProps {
    mission: Mission;
    onComplete: () => void;
}

const statConfig: Record<StatType, { color: string; icon: any }> = {
    Strength: { color: '#ef4444', icon: Dumbbell },
    Vitality: { color: '#22c55e', icon: Activity },
    Agility: { color: '#eab308', icon: Zap },
    Intelligence: { color: '#3b82f6', icon: Brain },
    Fortune: { color: '#a855f7', icon: Crown },
    Metabolism: { color: '#f97316', icon: Flame },
};

export const MissionItem: React.FC<MissionItemProps> = ({ mission, onComplete }) => {
    const isCompletedToday = mission.lastCompletedAt &&
        new Date(mission.lastCompletedAt).toDateString() === new Date().toDateString();

    const isAvailableToday = isMissionAvailableToday(mission, new Date());
    const canComplete = isAvailableToday && (!mission.isDaily || !isCompletedToday);
    const isDimmed = !isAvailableToday;

    const statStyle = statConfig[mission.targetStat] || statConfig.Strength;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
                relative group flex items-center gap-4 p-3 rounded-xl border transition-all duration-300
                ${isCompletedToday
                    ? 'bg-black/20 border-slate-800/50 grayscale opacity-60'
                    : 'bg-black/40 backdrop-blur-sm border-white/5 hover:bg-black/60'
                }
            `}
            style={{
                borderColor: !isCompletedToday ? `${statStyle.color}30` : undefined,
            }}
        >
            {/* Hover Glow */}
            {!isCompletedToday && (
                <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        boxShadow: `inset 0 0 20px ${statStyle.color}10`,
                    }}
                />
            )}

            {/* Icon Section */}
            <div
                className={`
                    relative flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border
                    ${isCompletedToday ? 'bg-slate-900 border-slate-800' : 'bg-black/50'}
                `}
                style={{
                    borderColor: !isCompletedToday ? `${statStyle.color}40` : undefined,
                }}
            >
                <statStyle.icon
                    size={20}
                    style={{ color: isCompletedToday ? '#64748b' : statStyle.color }}
                    className="drop-shadow-[0_0_5px_currentColor]"
                />
                {/* Daily Indicator */}
                {(mission.isDaily || mission.frequency === 'daily') && (
                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-bold px-1 rounded-full border border-black">
                        <RefreshCw size={8} />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span
                        className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: isCompletedToday ? '#64748b' : statStyle.color }}
                    >
                        {mission.targetStat}
                    </span>
                    {!isAvailableToday && (
                        <span className="text-[9px] font-bold px-1.5 rounded bg-slate-800 text-slate-500 border border-slate-700 uppercase tracking-wider">
                            LOCKED
                        </span>
                    )}
                </div>
                <h3 className={`text-sm font-bold truncate ${isCompletedToday ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {mission.title}
                </h3>
                <p className="text-[11px] text-slate-500 truncate font-mono">
                    {mission.detail}
                </p>
            </div>

            {/* Rewards & Action */}
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <div className={`text-xs font-bold font-mono ${isCompletedToday ? 'text-slate-600' : 'text-blue-400'}`}>
                        +{mission.xpReward} XP
                    </div>
                    {mission.streak > 0 && (
                        <div className="flex justify-end">
                            <StreakBadge value={mission.streak} />
                        </div>
                    )}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (canComplete) onComplete();
                    }}
                    disabled={!canComplete}
                    className={`
                        w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300
                        ${!canComplete
                            ? 'bg-slate-900/50 border-slate-800 text-slate-700 cursor-not-allowed'
                            : 'bg-blue-600/10 border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                        }
                    `}
                >
                    {isCompletedToday ? (
                        <Lock size={16} />
                    ) : (
                        <Sword size={18} className={canComplete ? "group-hover:scale-110 transition-transform" : ""} />
                    )}
                </button>
            </div>
        </motion.div>
    );
};
