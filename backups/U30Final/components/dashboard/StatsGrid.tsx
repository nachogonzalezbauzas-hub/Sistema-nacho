import React from 'react';
import { UserStats } from '../../types';
import { Dumbbell, Activity, Zap, Brain, Crown, Flame } from 'lucide-react';

interface StatsGridProps {
    effectiveStats: UserStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ effectiveStats }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                    className="relative aspect-square flex flex-col items-center justify-center bg-[#050505] rounded-2xl border-2 group cursor-default transition-all duration-300 hover:brightness-110"
                    style={{
                        borderColor: `${s.color}80`,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = s.color;
                        e.currentTarget.style.boxShadow = `0 0 20px ${s.color}60`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${s.color}80`;
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {/* Corner Accents (Tech Style) */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></div>

                    {/* Icon Circle */}
                    <div className="mb-3 p-3 rounded-full border-2 bg-black/50 relative transition-all duration-300 group-hover:scale-110"
                        style={{ borderColor: `${s.color}60` }}>
                        <s.icon size={24} style={{ color: s.color }} className="relative z-10 drop-shadow-[0_0_8px_currentColor]" />
                        <div className="absolute inset-0 rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity" style={{ backgroundColor: s.color }}></div>
                    </div>

                    {/* Label */}
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-80 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>
                        {s.label}
                    </div>

                    {/* Value */}
                    <div className="text-3xl font-black text-white font-mono tracking-tighter group-hover:scale-105 transition-transform">
                        {s.val}
                    </div>

                    {/* Background Hover Effects */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ backgroundColor: s.color }}></div>
                </div>
            ))}
        </div>
    );
};
