import React from 'react';
import { motion } from 'framer-motion';

export const ModuleTile: React.FC<{
    id: string;
    label: string;
    icon: React.ReactNode;
    accentColor: 'cyan' | 'purple' | 'amber' | 'slate' | 'teal' | 'orange';
    onClick: () => void;
}> = ({ label, icon, accentColor, onClick }) => {
    const colorStyles = {
        cyan: {
            border: 'border-cyan-500/20 hover:border-cyan-400/50',
            iconBg: 'bg-cyan-950/30 border-cyan-500/30',
            iconText: 'text-cyan-400',
            shadow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
            glow: 'group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
        },
        purple: {
            border: 'border-purple-500/20 hover:border-purple-400/50',
            iconBg: 'bg-purple-950/30 border-purple-500/30',
            iconText: 'text-purple-400',
            shadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
            glow: 'group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'
        },
        amber: {
            border: 'border-amber-500/20 hover:border-amber-400/50',
            iconBg: 'bg-amber-950/30 border-amber-500/30',
            iconText: 'text-amber-400',
            shadow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]',
            glow: 'group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]'
        },
        slate: {
            border: 'border-slate-500/20 hover:border-slate-400/50',
            iconBg: 'bg-slate-950/30 border-slate-500/30',
            iconText: 'text-slate-400',
            shadow: 'hover:shadow-[0_0_30px_rgba(100,116,139,0.3)]',
            glow: 'group-hover:shadow-[0_0_15px_rgba(100,116,139,0.4)]'
        },
        teal: {
            border: 'border-teal-500/20 hover:border-teal-400/50',
            iconBg: 'bg-teal-950/30 border-teal-500/30',
            iconText: 'text-teal-400',
            shadow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]',
            glow: 'group-hover:shadow-[0_0_15px_rgba(20,184,166,0.4)]'
        },
        orange: {
            border: 'border-orange-500/20 hover:border-orange-400/50',
            iconBg: 'bg-orange-950/30 border-orange-500/30',
            iconText: 'text-orange-400',
            shadow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]',
            glow: 'group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]'
        }
    };

    const styles = colorStyles[accentColor];

    return (
        <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        group relative overflow-hidden rounded-2xl border ${styles.border}
        bg-slate-900/60 backdrop-blur-sm
        shadow-[0_0_25px_rgba(15,23,42,0.8)] ${styles.shadow}
        transition-all duration-300 ease-out
        aspect-square flex flex-col items-center justify-center p-6
      `}
        >
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {/* Icon container */}
            <div className={`
        relative p-4 rounded-full border ${styles.iconBg}
        mb-3 transition-all duration-300
        ${styles.glow}
      `}>
                <div className={`${styles.iconText}`}>
                    {icon}
                </div>
            </div>

            {/* Label */}
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-200 group-hover:text-white transition-colors">
                {label}
            </span>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
        </motion.button>
    );
};
