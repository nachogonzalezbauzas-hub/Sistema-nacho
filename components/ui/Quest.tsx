import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Trophy, Target, Shield, Zap, Flame, Activity, Sparkles } from 'lucide-react';
import { DailyQuest, QuestType } from '@/types';
import { Button } from './Button';

interface QuestCardProps {
    quest: DailyQuest;
    onClaim: (id: string) => void;
    onManualComplete?: (id: string) => void;
}

const getQuestIcon = (type: QuestType) => {
    switch (type) {
        case 'mission_completion': return Target;
        case 'stat_threshold': return Zap;
        case 'dungeon_clear': return Shield;
        case 'shadow_extract': return Flame;
        case 'health_score': return Activity;
        case 'streak_maintain': return Star;
        case 'manual_verification': return Check;
        default: return Trophy;
    }
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim, onManualComplete }) => {
    const Icon = getQuestIcon(quest.condition.type);
    const progress = Math.min(100, (quest.condition.current / quest.condition.target) * 100);
    const isClaimed = !!quest.claimedAt;
    const canClaim = quest.completed && !isClaimed;
    const canManualComplete = !quest.completed && quest.condition.type === 'manual_verification';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-3 sm:p-4 rounded-xl border transition-all duration-300 overflow-hidden group
        ${isClaimed
                    ? 'bg-slate-900/30 border-slate-800 opacity-60'
                    : canClaim
                        ? 'bg-blue-950/30 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                        : canManualComplete
                            ? 'bg-emerald-950/20 border-emerald-500/30' // Green hint for manual tasks
                            : 'bg-[#050a14] border-slate-800 hover:border-slate-700'
                }
      `}
        >
            {/* Background Glow for Claimable */}
            {canClaim && (
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
            )}

            <div className="flex items-center gap-3 relative z-10">
                {/* Icon */}
                <div className={`p-2.5 rounded-lg border shrink-0 ${canClaim ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' :
                    canManualComplete ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                        'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                    <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-bold text-sm truncate pr-2 ${canClaim ? 'text-white' : 'text-slate-300'}`}>
                            {quest.title}
                        </h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {quest.reward.shards && (
                                <div className="hidden xs:flex items-center gap-1 text-[10px] font-mono font-bold text-purple-400 bg-purple-900/20 px-1.5 py-0.5 rounded border border-purple-500/20">
                                    <span>{quest.reward.shards}</span>
                                    <Sparkles size={8} />
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-yellow-500 bg-yellow-900/20 px-1.5 py-0.5 rounded border border-yellow-500/20">
                                <span>{quest.reward.questPoints}</span>
                                <span className="text-[8px] uppercase">QP</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-2 line-clamp-1 leading-tight">
                        {quest.description}
                    </p>

                    {/* Progress Bar (Hide for manual if not done, show button instead makes more sense? Or keep bar 0/1?) */}
                    {/* Actually, for manual, let's keep the bar logic but maybe color it differently? */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[9px] uppercase font-bold tracking-wider text-slate-500">
                            <span>Progress</span>
                            <span className={canClaim ? 'text-blue-400' : ''}>
                                {quest.condition.current} / {quest.condition.target}
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                            <motion.div
                                className={`h-full ${canClaim ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' :
                                    canManualComplete ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col justify-center self-center pl-1 shrink-0">
                    {isClaimed ? (
                        <div className="p-1.5 rounded-full bg-green-900/20 border border-green-500/30 text-green-500">
                            <Check size={16} />
                        </div>
                    ) : canClaim ? (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClaim(quest.id);
                            }}
                            className="h-9 px-4 text-[10px] font-black tracking-widest bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95 transition-transform touch-manipulation relative z-20"
                        >
                            CLAIM
                        </Button>
                    ) : canManualComplete ? (
                        <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (onManualComplete) onManualComplete(quest.id);
                                }}
                                className="h-9 px-4 text-[10px] font-black tracking-widest border-emerald-500/50 text-emerald-400 hover:bg-emerald-950 hover:text-emerald-300 active:scale-95 transition-transform touch-manipulation relative z-50 pointer-events-auto"
                            >
                                DONE
                            </Button>
                        </div>
                    ) : (
                        <div className="w-2" /> // Minimal spacer
                    )}
                </div>
            </div>
        </motion.div>
    );
};
