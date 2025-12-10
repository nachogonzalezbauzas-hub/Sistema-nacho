import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import { Milestone, MilestoneCategory, MilestoneReward } from '../../types';
import { Button } from './Button';

export const SegmentedControl: React.FC<{
    options: string[];
    selected: string;
    onChange: (value: string) => void;
}> = ({ options, selected, onChange }) => {
    return (
        <div className="flex p-1 bg-slate-950/50 rounded-lg border border-blue-900/30 relative">
            <div className="absolute inset-0 bg-blue-900/10 rounded-lg pointer-events-none"></div>
            {options.map((option) => {
                const isSelected = selected === option;
                return (
                    <button
                        key={option}
                        onClick={() => onChange(option)}
                        className={`
              flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 relative z-10
              ${isSelected ? 'text-white bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-blue-300 hover:bg-white/5'}
            `}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
};

export const MilestoneCategoryBadge: React.FC<{ category: MilestoneCategory }> = ({ category }) => {
    let colors = "bg-slate-800 text-slate-400 border-slate-700";
    switch (category) {
        case 'Health': colors = "bg-red-950/30 text-red-400 border-red-500/30"; break;
        case 'Wealth': colors = "bg-green-950/30 text-green-400 border-green-500/30"; break;
        case 'Skill': colors = "bg-blue-950/30 text-blue-400 border-blue-500/30"; break;
        case 'Lifestyle': colors = "bg-purple-950/30 text-purple-400 border-purple-500/30"; break;
        case 'Other': colors = "bg-slate-800 text-slate-400 border-slate-600"; break;
    }

    return (
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colors}`}>
            {category}
        </span>
    );
};

export const MilestoneRewardBadge: React.FC<{ reward: MilestoneReward }> = ({ reward }) => {
    return (
        <div className="flex gap-2">
            {reward.xpBonus && (
                <span className="text-[9px] font-bold text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-500/30">+{reward.xpBonus} XP</span>
            )}
            {reward.statBonus && (
                <span className="text-[9px] font-bold text-yellow-400 bg-yellow-950/30 px-1.5 py-0.5 rounded border border-yellow-500/30">STATS</span>
            )}
            {reward.unlockTitleId && (
                <span className="text-[9px] font-bold text-purple-400 bg-purple-950/30 px-1.5 py-0.5 rounded border border-purple-500/30">TITLE</span>
            )}
            {reward.unlockFrameId && (
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-500/30">FRAME</span>
            )}
        </div>
    );
};

export const PhaseProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
    const percent = Math.min(100, (current / total) * 100);
    return (
        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    );
};

export const MilestoneCard: React.FC<{
    milestone: Milestone;
    onAction: () => void;
}> = ({ milestone, onAction }) => {
    const currentPhase = milestone.phases[milestone.currentPhaseIndex];
    const isFullyCompleted = milestone.isCompleted;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        relative overflow-hidden rounded-xl border p-5 transition-all duration-300
        ${isFullyCompleted
                    ? 'bg-blue-950/20 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                    : 'bg-[#050a14]/90 border-blue-900/30 hover:border-blue-500/30'
                }
      `}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <MilestoneCategoryBadge category={milestone.category} />
                            {milestone.targetDate && (
                                <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                                    <Calendar size={10} /> {milestone.targetDate}
                                </span>
                            )}
                        </div>
                        <h3 className={`text-lg font-black uppercase tracking-wide ${isFullyCompleted ? 'text-blue-300' : 'text-white'}`}>
                            {milestone.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-[90%]">{milestone.description}</p>
                    </div>
                    {isFullyCompleted && (
                        <div className="bg-blue-500/20 text-blue-300 border border-blue-500/50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest animate-pulse">
                            Completed
                        </div>
                    )}
                </div>

                {!isFullyCompleted && (
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 mb-4">
                        <div className="flex justify-between items-center mb-2 text-xs">
                            <span className="font-bold text-blue-200 uppercase tracking-wider">
                                Phase {milestone.currentPhaseIndex + 1} <span className="text-slate-600">/</span> {milestone.phases.length}
                            </span>
                            <span className="font-mono text-slate-500">
                                {currentPhase.completedActions} / {currentPhase.requiredActions}
                            </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-300 mb-2">{currentPhase.title}</h4>
                        <PhaseProgressBar current={currentPhase.completedActions} total={currentPhase.requiredActions} />
                    </div>
                )}

                <div className="flex justify-between items-center mt-2">
                    <MilestoneRewardBadge reward={milestone.reward} />

                    {!isFullyCompleted && (
                        <Button
                            variant="primary"
                            onClick={onAction}
                            className="py-1.5 px-3 text-xs"
                            disabled={currentPhase.isCompleted} // Disable if phase just completed but not advanced (though logic handles auto-advance)
                        >
                            <Plus size={14} /> Progress
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
