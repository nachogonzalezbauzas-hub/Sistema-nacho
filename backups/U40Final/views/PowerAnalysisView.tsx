import React from 'react';
import { motion } from 'framer-motion';
import { AppState } from '../types';
import { calculatePowerBreakdown } from '../store';
import { ArrowLeft, Zap, Dumbbell, Crown, Image, Ghost, TrendingUp, Sword, Sparkles } from 'lucide-react';
import { t } from '../data/translations';

interface PowerAnalysisViewProps {
    state: AppState;
    onBack: () => void;
    language: 'en' | 'es';
}

export const PowerAnalysisView: React.FC<PowerAnalysisViewProps> = ({ state, onBack, language }) => {
    const breakdown = calculatePowerBreakdown(state);

    const sections = [
        {
            id: 'baseStats',
            label: t('power_base_stats', language),
            value: breakdown.baseStats,
            icon: Dumbbell,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            desc: t('power_base_stats_desc', language)
        },
        {
            id: 'level',
            label: t('power_level_bonus', language),
            value: breakdown.level,
            icon: TrendingUp,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            desc: t('power_level_bonus_desc', language).replace('{level}', state.stats.level.toString())
        },
        {
            id: 'passives',
            label: language === 'es' ? 'HABILIDADES' : 'SKILLS',
            value: breakdown.passives || 0,
            icon: Sparkles,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/30',
            desc: language === 'es' ? 'Poder de habilidades pasivas' : 'Power from passive skills'
        },
        {
            id: 'equipment',
            label: t('power_equipment', language),
            value: breakdown.equipment || 0,
            icon: Sword,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/30',
            desc: t('power_equipment_desc', language)
        },
        {
            id: 'titles',
            label: t('power_titles', language),
            value: breakdown.titles,
            icon: Crown,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30',
            desc: t('power_titles_desc', language)
        },
        {
            id: 'frames',
            label: t('power_frames', language),
            value: breakdown.frames,
            icon: Image,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30',
            desc: t('power_frames_desc', language)
        },
        {
            id: 'shadows',
            label: t('power_shadows', language),
            value: breakdown.shadows,
            icon: Ghost,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30',
            desc: t('power_shadows_desc', language)
        },
        {
            id: 'jobClass',
            label: language === 'es' ? 'CLASE' : 'JOB CLASS',
            value: breakdown.jobClass || 0,
            icon: Zap,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/30',
            desc: language === 'es' ? `Poder acumulado de clases (${state.stats.jobClass})` : `Cumulative class power (${state.stats.jobClass})`
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
                    <h2 className="text-xl font-black text-white uppercase tracking-wider italic">{t('power_title', language)}</h2>
                    <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">{t('power_subtitle', language)}</p>
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
                            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{t('power_total', language)}</span>
                        </div>

                        <div className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] mb-2 font-mono">
                            {breakdown.total.toLocaleString()}
                        </div>

                        <p className="text-xs text-slate-400 font-mono">
                            {t('power_total_desc', language)}
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
                                        <div className="text-[10px] font-bold text-slate-500">{percentage}% {t('power_of_total', language)}</div>
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
