import React from 'react';
import { motion } from 'framer-motion';
import { UserStats } from '@/types';
import { t, Language } from '@/data/translations';

interface ExpBarProps {
    stats: UserStats;
    language: Language;
}

export const ExpBar: React.FC<ExpBarProps> = ({ stats, language = 'en' as Language }) => {
    const xpPercentage = Math.min(100, (stats.xpCurrent / stats.xpForNextLevel) * 100);

    return (
        <div className="relative pt-2">
            <div className="flex justify-between text-[10px] font-mono text-blue-300 mb-1 uppercase tracking-widest">
                <span>{t('dash_exp_accumulation', language)}</span>
                <span className="animate-pulse">{Math.floor(xpPercentage)}%</span>
            </div>
            <div className="h-4 bg-[#050a14] border border-blue-800 relative overflow-hidden">
                {/* Grid Background in Bar */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:10px_100%]"></div>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-400 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>

                    {/* Leading Edge */}
                    <div className="absolute right-0 top-0 h-full w-[2px] bg-white shadow-[0_0_10px_white] z-10"></div>

                    {/* Moving Shine Effect */}
                    <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                        className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    />
                </motion.div>
            </div>
            <div className="text-right text-[9px] font-mono text-blue-500/60 mt-1">
                {stats.xpCurrent.toFixed(0)} / {stats.xpForNextLevel}
            </div>
        </div>
    );
};
