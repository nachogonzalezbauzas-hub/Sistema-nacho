import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, CheckCircle2 } from 'lucide-react';

interface AchievementPopupProps {
    isVisible: boolean;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    type?: 'achievement' | 'milestone' | 'quest';
    onComplete?: () => void;
    autoHideDuration?: number;
}

const typeColors = {
    achievement: { main: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
    milestone: { main: '#a855f7', glow: 'rgba(168,85,247,0.4)' },
    quest: { main: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
};

const typeIcons = {
    achievement: <Trophy size={24} />,
    milestone: <Star size={24} />,
    quest: <CheckCircle2 size={24} />,
};

const typeLabels = {
    achievement: 'LOGRO DESBLOQUEADO',
    milestone: 'HITO COMPLETADO',
    quest: 'MISIÓN COMPLETADA',
};

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
    isVisible,
    title,
    description,
    icon,
    type = 'achievement',
    onComplete,
    autoHideDuration = 3000,
}) => {
    const colors = typeColors[type];
    const defaultIcon = typeIcons[type];
    const label = typeLabels[type];

    useEffect(() => {
        if (isVisible && onComplete) {
            const timer = setTimeout(onComplete, autoHideDuration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete, autoHideDuration]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed top-4 left-1/2 z-[95] pointer-events-auto"
                    initial={{ x: '-50%', y: -100, opacity: 0 }}
                    animate={{ x: '-50%', y: 0, opacity: 1 }}
                    exit={{ x: '-50%', y: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <motion.div
                        className="relative px-6 py-4 rounded-2xl backdrop-blur-md border-2 min-w-[300px] max-w-[400px]"
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            borderColor: colors.main,
                            boxShadow: `0 0 30px ${colors.glow}, 0 10px 40px rgba(0,0,0,0.5)`,
                        }}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Top Label */}
                        <motion.div
                            className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap"
                            style={{
                                backgroundColor: colors.main,
                                color: '#000',
                            }}
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                        >
                            {label}
                        </motion.div>

                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <motion.div
                                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{
                                    backgroundColor: `${colors.main}20`,
                                    border: `2px solid ${colors.main}`,
                                    boxShadow: `0 0 15px ${colors.glow}`,
                                }}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            >
                                <span style={{ color: colors.main }}>
                                    {icon || defaultIcon}
                                </span>
                            </motion.div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <motion.h4
                                    className="text-base font-black text-white uppercase tracking-wide truncate"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {title}
                                </motion.h4>
                                {description && (
                                    <motion.p
                                        className="text-xs text-slate-400 mt-0.5 truncate"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {description}
                                    </motion.p>
                                )}
                            </div>

                            {/* Completed Stamp */}
                            <motion.div
                                className="flex-shrink-0"
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
                            >
                                <div
                                    className="px-2 py-1 rounded border-2 text-[8px] font-black uppercase tracking-wider"
                                    style={{
                                        borderColor: '#22c55e',
                                        color: '#22c55e',
                                    }}
                                >
                                    ✓
                                </div>
                            </motion.div>
                        </div>

                        {/* Progress bar animation (decorative) */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
                            style={{ backgroundColor: colors.main }}
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: autoHideDuration / 1000, ease: 'linear' }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
