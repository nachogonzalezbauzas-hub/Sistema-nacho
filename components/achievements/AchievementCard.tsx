import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '@/data/achievements';
import { getRarityStyles } from '@/utils/rarityStyles';
import { iconMap } from '@/utils/iconMap';
import { Trophy } from 'lucide-react';
import { t } from '@/data/translations';

import { getMedalImage } from '@/data/achievementMedals';

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    language: 'en' | 'es';
    index: number;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked, language, index }) => {
    const IconComponent = iconMap[achievement.icon] || Trophy;
    const styles = getRarityStyles(achievement.rarity);
    const medalImage = getMedalImage(achievement.id);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
        >
            <div className={`
        relative p-4 rounded-r-xl border-l-4 flex items-center gap-4 group overflow-hidden transition-all duration-300
        ${isUnlocked
                    ? `${styles.bg} ${styles.border} border-y border-r border-slate-800/50 ${styles.glow}`
                    : 'bg-slate-950/30 border-l-slate-700 border-y border-r border-slate-800/30 opacity-50 grayscale'
                }
      `}>
                {/* Icon or Medal Image */}
                <div className={`
          w-12 h-12 rounded flex items-center justify-center shrink-0 relative z-10
          ${isUnlocked && !medalImage
                        ? styles.text
                        : 'text-slate-600'
                    }
        `}>
                    {medalImage ? (
                        <div className="w-12 h-12 relative flex items-center justify-center">
                            {/* Glow behind medal */}
                            {isUnlocked && <div className={`absolute inset-0 blur-md opacity-50 ${styles.bg}`} />}
                            <img
                                src={medalImage}
                                alt="medal"
                                className="w-full h-full object-contain relative z-10"
                                style={{
                                    mixBlendMode: 'screen', // Magic fix for black backgrounds
                                    filter: isUnlocked ? 'brightness(1.2)' : 'grayscale(1)'
                                }}
                            />
                        </div>
                    ) : (
                        <IconComponent size={24} />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                        <h3 className={`text-sm font-black uppercase tracking-wider ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                            {achievement.title[language]}
                        </h3>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono leading-tight truncate mt-0.5">
                        {achievement.description[language]}
                    </p>
                </div>

                {/* Status Badge */}
                {isUnlocked && (
                    <div className="shrink-0">
                        <span className={`text-[9px] font-black px-2 py-1 rounded border border-white/10 uppercase tracking-widest ${styles.badge}`}>
                            {achievement.rarity}
                        </span>
                    </div>
                )}

                {/* Background Effects for Unlocked */}
                {isUnlocked && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent pointer-events-none" />
                )}
            </div>
        </motion.div>
    );
};
