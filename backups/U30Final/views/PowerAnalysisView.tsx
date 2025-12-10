import React from 'react';
import { motion } from 'framer-motion';
import { AppState } from '../types';
import { calculatePowerBreakdown } from '../store';
import { ArrowLeft, Zap, Dumbbell, Crown, Image, Ghost, TrendingUp, Sword } from 'lucide-react';
import { Card, StatIcon } from '../components/UIComponents';

interface PowerAnalysisViewProps {
    state: AppState;
    onBack: () => void;
}

export const PowerAnalysisView: React.FC<PowerAnalysisViewProps> = ({ state, onBack }) => {
    const breakdown = calculatePowerBreakdown(state);

    const sections = [
        {
            id: 'baseStats',
            label: 'Base Stats',
            value: breakdown.baseStats,
            icon: Dumbbell,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            desc: 'Sum of all primary attributes'
        },
        {
            id: 'level',
            label: 'Level Bonus',
            value: breakdown.level,
            icon: TrendingUp,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            desc: `Level ${state.stats.level} × 10`
        },
        {
            id: 'equipment',
            label: 'Equipment',
            value: breakdown.equipment || 0,
            icon: Sword,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/30',
            desc: 'Power from equipped gear'
        },
        {
            id: 'titles',
            label: 'Titles',
            value: breakdown.titles,
            icon: Crown,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30',
            desc: 'Power from equipped title rarity'
        },
        {
            id: 'frames',
            label: 'Avatar Frames',
            value: breakdown.frames,
            icon: Image,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30',
            desc: 'Power from avatar frame rarity'
        },
        {
            id: 'shadows',
            label: 'Shadow Army',
            value: breakdown.shadows,
            icon: Ghost,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30',
            desc: 'Total power of all collected shadows'
        }
    ];

    return (
        <div className="min-h-screen bg-[#02040a] pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#02040a]/95 backdrop-blur-xl border-b border-blue-900/30 px-4 py-4 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider italic">Power Analysis</h2>
                    <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">Source Breakdown</p>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Total Power Hero */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-[#050a14] p-8 text-center group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                            <Zap size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Total Power</span>
                        </div>

                        <div className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] mb-2 font-mono">
                            {breakdown.total.toLocaleString()}
                        </div>

                        <p className="text-xs text-slate-400 font-mono">
                            Aggregated combat capability rating
                        </p>
                    </div>
                </div>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-1 gap-3">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        const percentage = breakdown.total > 0 ? Math.round((section.value / breakdown.total) * 100) : 0;

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative overflow-hidden rounded-xl border ${section.border} ${section.bg} p-4 group`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-[#02040a]/50 border ${section.border}`}>
                                            <Icon size={18} className={section.color} />
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-bold uppercase tracking-wide ${section.color}`}>{section.label}</h3>
                                            <p className="text-[10px] text-slate-400 font-mono">{section.desc}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-white font-mono">{section.value.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-slate-500">{percentage}% of Total</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-1.5 bg-[#02040a]/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "circOut", delay: 0.5 + (index * 0.1) }}
                                        className={`h-full ${section.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
