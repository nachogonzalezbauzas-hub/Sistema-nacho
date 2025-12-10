import React from 'react';
import { motion } from 'framer-motion';
import { Shadow } from '@/types';
import { Ghost } from 'lucide-react';
import { t } from '@/data/translations';

interface ShadowCommandProps {
    equippedShadow: Shadow;
    language: 'en' | 'es';
}

export const ShadowCommand: React.FC<ShadowCommandProps> = ({ equippedShadow, language }) => {
    const pulseVariant = {
        animate: {
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <motion.div
            variants={pulseVariant}
            animate="animate"
            className="relative mt-8 group cursor-pointer"
        >
            <div className="absolute inset-0 bg-purple-900/20 blur-xl group-hover:bg-purple-600/30 transition-colors duration-500"></div>
            <div className="relative border-2 border-purple-500/50 bg-[#05020a] overflow-hidden">
                {/* Animated Purple Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>

                <div className="relative p-6 flex flex-col md:flex-row items-center gap-6 z-10">
                    <div className="relative">
                        <div className="w-24 h-24 border-2 border-purple-500 bg-black flex items-center justify-center shadow-[0_0_20px_#a855f7]">
                            <Ghost size={48} className="text-purple-300 animate-[bounce_3s_infinite]" />
                        </div>
                        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-purple-400"></div>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-purple-400"></div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-1 animate-pulse">{t('dash_shadow_marshal', language)}</div>
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_15px_#a855f7]">
                            {equippedShadow.name}
                        </h2>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                            <span className="bg-purple-900/50 border border-purple-500/50 px-2 py-0.5 text-xs font-mono text-purple-200">
                                {t('dash_rank', language)}: {equippedShadow.rank}
                            </span>
                            <span className="bg-purple-900/50 border border-purple-500/50 px-2 py-0.5 text-xs font-mono text-purple-200">
                                {t('dash_bonus', language)}: +{equippedShadow.bonus.value} {t(`stat_${equippedShadow.bonus.stat.toLowerCase()}` as any, language)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
