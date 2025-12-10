import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Trophy, Target, Shield, Zap, Flame, Activity, Sparkles } from 'lucide-react';
import { DailyQuest, QuestType } from '../../types';
import { Button } from './Button';

interface QuestCardProps {
    quest: DailyQuest;
    onClaim: (id: string) => void;
}

const getQuestIcon = (type: QuestType) => {
    switch (type) {
        case 'mission_completion': return Target;
        case 'stat_threshold': return Zap;
        case 'dungeon_clear': return Shield;
        case 'shadow_extract': return Flame;
        case 'health_score': return Activity;
        case 'streak_maintain': return Star;
        default: return Trophy;
    }
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim }) => {
    const Icon = getQuestIcon(quest.condition.type);
    const progress = Math.min(100, (quest.condition.current / quest.condition.target) * 100);
    const isClaimed = !!quest.claimedAt;
    const canClaim = quest.completed && !isClaimed;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-4 rounded-xl border transition-all duration-300 overflow-hidden group
        ${isClaimed
                    ? 'bg-slate-900/30 border-slate-800 opacity-60'
                    : canClaim
                        ? 'bg-blue-950/30 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                        : 'bg-[#050a14] border-slate-800 hover:border-slate-700'
                }
      `}
        >
            {/* Background Glow for Claimable */}
            {canClaim && (
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
            )}

            <div className="flex items-start gap-4 relative z-10">
                {/* Icon */}
                <div className={`p-3 rounded-lg border ${canClaim ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                    <Icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold text-sm truncate pr-2 ${canClaim ? 'text-white' : 'text-slate-300'}`}>
                            {quest.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            {quest.reward.shards && (
                                <div className="flex items-center gap-1 text-xs font-mono font-bold text-purple-400 bg-purple-900/20 px-1.5 py-0.5 rounded border border-purple-500/20">
                                    <span>{quest.reward.shards}</span>
                                    <Sparkles size={10} />
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-xs font-mono font-bold text-yellow-500 bg-yellow-900/20 px-1.5 py-0.5 rounded border border-yellow-500/20">
                                <span>{quest.reward.questPoints}</span>
                                <span className="text-[10px]">QP</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                        {quest.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500">
                            <span>Progress</span>
                            <span className={canClaim ? 'text-blue-400' : ''}>
                                {quest.condition.current} / {quest.condition.target}
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                            <motion.div
                                className={`h-full ${canClaim ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-slate-600'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col justify-center self-center pl-2">
                    {isClaimed ? (
                        <div className="p-2 rounded-full bg-green-900/20 border border-green-500/30 text-green-500">
                            <Check size={18} />
                        </div>
                    ) : canClaim ? (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onClaim(quest.id)}
                            className="animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                        >
                            Claim
                        </Button>
                    ) : (
                        <div className="w-8" /> // Spacer
                    )}
                </div>
            </div>
        </motion.div>
    );
};
