import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '@/data/achievements';
import { getRarityStyles } from '@/utils/rarityStyles';
import { iconMap } from '@/utils/iconMap';
import { getMedalImage } from '@/data/achievementMedals';
import { Lock, CheckCircle, Trophy } from 'lucide-react';

interface AchievementMedalCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    language: 'en' | 'es';
    index: number;
}

export const AchievementMedalCard: React.FC<AchievementMedalCardProps> = ({
    achievement,
    isUnlocked,
    language,
    index
}) => {
    const IconComponent = iconMap[achievement.icon] || Trophy;
    const styles = getRarityStyles(achievement.rarity);
    const medalImage = getMedalImage(achievement.id);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className={`
                relative rounded-xl border overflow-hidden
                flex flex-col items-center text-center p-3
                transition-all duration-300
                ${isUnlocked
                    ? `${styles.bg} ${styles.border} ${styles.glow}`
                    : 'bg-slate-950/50 border-slate-800 opacity-60 grayscale'
                }
            `}
        >
            {/* Medal Image or Icon */}
            <div className="relative w-20 h-20 mb-2">
                {medalImage ? (
                    <img
                        src={medalImage}
                        alt={achievement.title[language]}
                        className={`
                            w-full h-full object-contain
                            ${isUnlocked ? '' : 'opacity-40 saturate-0'}
                        `}
                        style={{ mixBlendMode: 'screen' }}
                    />
                ) : (
                    <div className={`
                        w-full h-full rounded-full 
                        flex items-center justify-center
                        ${isUnlocked ? styles.bg : 'bg-slate-900'}
                        border ${isUnlocked ? styles.border : 'border-slate-700'}
                    `}>
                        <IconComponent size={32} className={isUnlocked ? styles.text : 'text-slate-600'} />
                    </div>
                )}

                {/* Lock overlay for locked achievements */}
                {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <Lock size={20} className="text-slate-500" />
                    </div>
                )}
            </div>

            {/* Title */}
            <h3 className={`
                text-[10px] font-black uppercase tracking-wider leading-tight mb-0.5
                ${isUnlocked ? 'text-white' : 'text-slate-500'}
            `}>
                {achievement.title[language]}
            </h3>

            {/* Description */}
            <p className="text-[8px] text-slate-400 font-mono leading-tight line-clamp-2 mb-2">
                {achievement.description[language]}
            </p>

            {/* Rarity Badge */}
            <div className={`
                absolute top-1.5 right-1.5 
                text-[7px] font-black px-1.5 py-0.5 rounded
                border uppercase tracking-widest
                ${isUnlocked
                    ? `${styles.badge} ${styles.border} bg-black/50`
                    : 'border-slate-700 text-slate-600 bg-black/30'
                }
            `}>
                {achievement.rarity}
            </div>

            {/* Unlocked checkmark */}
            {isUnlocked && (
                <div className={`absolute top-1.5 left-1.5 ${styles.text}`}>
                    <CheckCircle size={12} />
                </div>
            )}

            {/* Background gradient for unlocked */}
            {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none" />
            )}
        </motion.div>
    );
};
