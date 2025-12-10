import React from 'react';
import { UserStats } from '@/types';
import { Dumbbell, Activity, Zap, Brain, Crown, Flame } from 'lucide-react';
import { t } from '@/data/translations';

interface StatsGridProps {
    effectiveStats: UserStats;
    language: 'en' | 'es';
}

export const StatsGrid: React.FC<StatsGridProps> = ({ effectiveStats, language }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
                { label: 'Strength', val: effectiveStats.strength, icon: Dumbbell, color: '#ef4444' },
                { label: 'Vitality', val: effectiveStats.vitality, icon: Activity, color: '#22c55e' },
                { label: 'Agility', val: effectiveStats.agility, icon: Zap, color: '#eab308' },
                { label: 'Intelligence', val: effectiveStats.intelligence, icon: Brain, color: '#3b82f6' },
                { label: 'Fortune', val: effectiveStats.fortune, icon: Crown, color: '#a855f7' },
                { label: 'Metabolism', val: effectiveStats.metabolism, icon: Flame, color: '#f97316' }
            ].map((s, i) => (
                <div
                    key={s.label}
                    className="relative group flex items-center justify-between p-4 bg-black/40 backdrop-blur-sm rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 overflow-hidden"
                    style={{
                        borderColor: `${s.color}40`,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${s.color}80`;
                        e.currentTarget.style.boxShadow = `0 0 15px ${s.color}20`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${s.color}40`;
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <div className="flex items-center gap-3 relative z-10">
                        {/* Icon */}
                        <div
                            className="p-2 rounded-lg bg-black/50 border transition-colors duration-300"
                            style={{ borderColor: `${s.color}40` }}
                        >
                            <s.icon size={18} style={{ color: s.color }} className="drop-shadow-[0_0_5px_currentColor]" />
                        </div>

                        {/* Label */}
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
                            {t(`stat_${s.label.toLowerCase()}` as any, language)}
                        </div>
                    </div>

                    {/* Value */}
                    <div className="relative z-10 text-xl font-black font-mono tracking-tight" style={{ color: s.color }}>
                        {s.val}
                    </div>

                    {/* Background Gradient Effect */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`
                        }}
                    />

                    {/* Subtle Glow at bottom */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-50"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`
                        }}
                    />
                </div>
            ))}
        </div>
    );
};
